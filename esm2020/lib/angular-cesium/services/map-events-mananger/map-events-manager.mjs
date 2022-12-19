import { merge, of as observableOf, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CesiumEventBuilder } from './cesium-event-builder';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { UtilsService } from '../../utils/utils.service';
import { CesiumDragDropHelper } from './event-observers/cesium-drag-drop-helper';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
import * as i2 from "./cesium-event-builder";
import * as i3 from "../plonter/plonter.service";
class Registration {
    constructor(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
}
/**
 * Manages all map events. Notice events will run outside of Angular zone.
 * Provided by `<ac-map/>` component there for could be injected at any component under `<ac-map/>` hierarchy
 * or from the `<ac-map/>` component reference `acMapComponent.getMapEventsManager()`
 *
 * __usage:__
 * ```
 * MapEventsManagerService.register({event, modifier, priority, entityType, pickOption}).subscribe()
 * ```
 * __param:__ {CesiumEvent} event
 * __param:__ {CesiumEventModifier} modifier
 * __param:__ priority - the bigger the number the bigger the priority. default : 0.
 * __param:__ entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 * __param:__ pickOption - self explained
 */
export class MapEventsManagerService {
    constructor(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    init() {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    }
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    register(input) {
        if (this.scene === undefined) {
            throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
        }
        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;
        input.pickConfig = input.pickConfig || {};
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw new Error('MapEventsManagerService: can\'t register an event ' +
                'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
        }
        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        const eventRegistration = this.createEventRegistration(input);
        const registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return registrationObservable;
    }
    disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        const registrations = this.eventRegistrations.get(eventName);
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }
    sortRegistrationsByPriority(eventName) {
        const registrations = this.eventRegistrations.get(eventName);
        registrations.sort((a, b) => b.priority - a.priority);
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        const currentPriority = registrations[0].priority;
        registrations.forEach((registration) => {
            registration.isPaused = registration.priority < currentPriority;
        });
    }
    createEventRegistration({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        const stopper = new Subject();
        const registration = new Registration(undefined, stopper, priority, false);
        let observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter(() => !registration.isPaused), map((movement) => this.triggerPick(movement, pickOption, pickConfig)), filter((result) => result.cesiumEntities !== null || entityType === undefined), map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter)), filter((result) => result.entities !== null || (entityType === undefined && !pickFilter)), switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption)), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent({
                event,
                modifier,
                entityType,
                pick: pickOption,
                priority,
                pickFilter,
                pickConfig
            }).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    }
    createDragEvent({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
        const { mouseDownEvent, mouseUpEvent } = CesiumDragDropHelper.getDragEventTypes(event);
        const mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        const mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        const mouseDownRegistration = this.createEventRegistration({
            event: mouseDownEvent,
            modifier,
            entityType,
            pick: pickOption,
            priority,
            pickFilter,
            pickConfig,
        });
        const dropSubject = new Subject();
        const dragObserver = mouseDownRegistration.observable.pipe(mergeMap(e => {
            let lastMove = null;
            const dragStartPositionX = e.movement.startPosition.x;
            const dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((movement) => {
                lastMove = {
                    movement: {
                        drop: false,
                        startPosition: {
                            x: dragStartPositionX,
                            y: dragStartPositionY,
                        },
                        endPosition: movement.endPosition,
                    },
                    entities: e.entities,
                    cesiumEntities: e.cesiumEntities
                };
                return lastMove;
            }), takeUntil(mouseUpObservable), tap({
                complete: () => {
                    // On complete
                    if (lastMove) {
                        const dropEvent = Object.assign({}, lastMove);
                        dropEvent.movement.drop = true;
                        dropSubject.next(dropEvent);
                    }
                }
            }));
        }));
        return merge(dragObserver, dropSubject);
    }
    triggerPick(movement, pickOptions, pickConfig) {
        let picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition, pickConfig.drillPickLimit, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                const pick = this.scene.pick(movement.endPosition, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map((pick) => pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive);
        }
        return { movement: movement, cesiumEntities: picks };
    }
    addEntities(picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity).filter((acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                });
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity);
            }
            entities = UtilsService.unique(entities);
            entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
            if (entities.length === 0) {
                entities = null;
            }
        }
        picksAndMovement.entities = entities;
        return picksAndMovement;
    }
    plonter(entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return observableOf(entitiesAndMovement);
        }
    }
}
MapEventsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapEventsManagerService, deps: [{ token: i1.CesiumService }, { token: i2.CesiumEventBuilder }, { token: i3.PlonterService }], target: i0.ɵɵFactoryTarget.Injectable });
MapEventsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapEventsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapEventsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }, { type: i2.CesiumEventBuilder }, { type: i3.PlonterService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7Ozs7O0FBRWpGLE1BQU0sWUFBWTtJQUNoQixZQUFtQixVQUFtQyxFQUNsQyxPQUFxQixFQUNyQixRQUFnQixFQUNoQixRQUFpQjtRQUhsQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUNyQyxDQUFDO0NBQ0Y7QUFpQkQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQW9CLGFBQTRCLEVB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Z0JBQWdCLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlFO1lBRUQsUUFBUSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsUUFBUSxHQUFHLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDN0UsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDekIsUUFBUSxHQUFHLElBQUksQ0FBQzthQUNqQjtTQUNGO1FBRUQsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUVyQyxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTyxPQUFPLENBQUMsbUJBQWdDLEVBQUUsVUFBdUI7UUFDdkUsSUFBSSxVQUFVLEtBQUssV0FBVyxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNILE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsT0FBTyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7O3FIQTFPVSx1QkFBdUI7eUhBQXZCLHVCQUF1Qjs0RkFBdkIsdUJBQXVCO2tCQURuQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2UsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50QnVpbGRlciB9IGZyb20gJy4vY2VzaXVtLWV2ZW50LWJ1aWxkZXInO1xuaW1wb3J0IHsgRXZlbnRSZWdpc3RyYXRpb25JbnB1dCwgUGlja0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuL2V2ZW50LXJlZ2lzdHJhdGlvbi1pbnB1dCc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4vZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1EcmFnRHJvcEhlbHBlciB9IGZyb20gJy4vZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1kcmFnLWRyb3AtaGVscGVyJztcblxuY2xhc3MgUmVnaXN0cmF0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9ic2VydmFibGU6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+LFxuICAgICAgICAgICAgICBwdWJsaWMgIHN0b3BwZXI6IFN1YmplY3Q8YW55PixcbiAgICAgICAgICAgICAgcHVibGljICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgIGlzUGF1c2VkOiBib29sZWFuKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHNjcmVlbiBwb3NpdGlvbiwgZHJhZyBib29sZWFuIGZvciBkcmFnIGV2ZW50cyBvbmx5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZW1lbnQge1xuICBzdGFydFBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gIGVuZFBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gIGRyb3A/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50UmVzdWx0IHtcbiAgbW92ZW1lbnQ6IE1vdmVtZW50O1xuICBjZXNpdW1FbnRpdGllczogYW55W107XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGFsbCBtYXAgZXZlbnRzLiBOb3RpY2UgZXZlbnRzIHdpbGwgcnVuIG91dHNpZGUgb2YgQW5ndWxhciB6b25lLlxuICogUHJvdmlkZWQgYnkgYDxhYy1tYXAvPmAgY29tcG9uZW50IHRoZXJlIGZvciBjb3VsZCBiZSBpbmplY3RlZCBhdCBhbnkgY29tcG9uZW50IHVuZGVyIGA8YWMtbWFwLz5gIGhpZXJhcmNoeVxuICogb3IgZnJvbSB0aGUgYDxhYy1tYXAvPmAgY29tcG9uZW50IHJlZmVyZW5jZSBgYWNNYXBDb21wb25lbnQuZ2V0TWFwRXZlbnRzTWFuYWdlcigpYFxuICpcbiAqIF9fdXNhZ2U6X19cbiAqIGBgYFxuICogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UucmVnaXN0ZXIoe2V2ZW50LCBtb2RpZmllciwgcHJpb3JpdHksIGVudGl0eVR5cGUsIHBpY2tPcHRpb259KS5zdWJzY3JpYmUoKVxuICogYGBgXG4gKiBfX3BhcmFtOl9fIHtDZXNpdW1FdmVudH0gZXZlbnRcbiAqIF9fcGFyYW06X18ge0Nlc2l1bUV2ZW50TW9kaWZpZXJ9IG1vZGlmaWVyXG4gKiBfX3BhcmFtOl9fIHByaW9yaXR5IC0gdGhlIGJpZ2dlciB0aGUgbnVtYmVyIHRoZSBiaWdnZXIgdGhlIHByaW9yaXR5LiBkZWZhdWx0IDogMC5cbiAqIF9fcGFyYW06X18gZW50aXR5VHlwZSAtIGVudGl0eSB0eXBlIGNsYXNzIHRoYXQgeW91IGFyZSBpbnRlcmVzdGVkIGxpa2UgKFRyYWNrKS4gdGhlIGNsYXNzIG11c3QgZXh0ZW5kcyBBY0VudGl0eVxuICogX19wYXJhbTpfXyBwaWNrT3B0aW9uIC0gc2VsZiBleHBsYWluZWRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIHtcblxuICBwcml2YXRlIHNjZW5lOiBhbnk7XG4gIHByaXZhdGUgZXZlbnRSZWdpc3RyYXRpb25zID0gbmV3IE1hcDxzdHJpbmcsIFJlZ2lzdHJhdGlvbltdPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBldmVudEJ1aWxkZXI6IENlc2l1bUV2ZW50QnVpbGRlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwbG9udGVyU2VydmljZTogUGxvbnRlclNlcnZpY2UpIHtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5ldmVudEJ1aWxkZXIuaW5pdCgpO1xuICAgIHRoaXMuc2NlbmUgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0byBtYXAgZXZlbnRcbiAgICogQHBhcmFtIGlucHV0IEV2ZW50IFJlZ2lzdHJhdGlvbiBJbnB1dFxuICAgKlxuICAgKiBAcmV0dXJucyBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD5cbiAgICovXG4gIHJlZ2lzdGVyKGlucHV0OiBFdmVudFJlZ2lzdHJhdGlvbklucHV0KTogRGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+IHtcbiAgICBpZiAodGhpcy5zY2VuZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nlc2l1bVNlcnZpY2UgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldCAtIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIG11c3QgYmUgaW5qZWN0ZWQgIHVuZGVyIGFjLW1hcCcpO1xuICAgIH1cblxuICAgIGlucHV0LnBpY2sgPSBpbnB1dC5waWNrIHx8IFBpY2tPcHRpb25zLk5PX1BJQ0s7XG4gICAgaW5wdXQucHJpb3JpdHkgPSBpbnB1dC5wcmlvcml0eSB8fCAwO1xuICAgIGlucHV0LnBpY2tDb25maWcgPSBpbnB1dC5waWNrQ29uZmlnIHx8IHt9O1xuXG4gICAgaWYgKGlucHV0LmVudGl0eVR5cGUgJiYgaW5wdXQucGljayA9PT0gUGlja09wdGlvbnMuTk9fUElDSykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXBFdmVudHNNYW5hZ2VyU2VydmljZTogY2FuXFwndCByZWdpc3RlciBhbiBldmVudCAnICtcbiAgICAgICAgJ3dpdGggZW50aXR5VHlwZSBhbmQgUGlja09wdGlvbnMuTk9fUElDSyAtIEl0IGRvZXNuXFwndCBtYWtlIHNlbnNlICcpO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50TmFtZSA9IENlc2l1bUV2ZW50QnVpbGRlci5nZXRFdmVudEZ1bGxOYW1lKGlucHV0LmV2ZW50LCBpbnB1dC5tb2RpZmllcik7XG5cbiAgICBpZiAoIXRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmhhcyhldmVudE5hbWUpKSB7XG4gICAgICB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5zZXQoZXZlbnROYW1lLCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRSZWdpc3RyYXRpb24gPSB0aGlzLmNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKGlucHV0KTtcbiAgICBjb25zdCByZWdpc3RyYXRpb25PYnNlcnZhYmxlOiBhbnkgPSBldmVudFJlZ2lzdHJhdGlvbi5vYnNlcnZhYmxlO1xuICAgIHJlZ2lzdHJhdGlvbk9ic2VydmFibGUuZGlzcG9zZSA9ICgpID0+IHRoaXMuZGlzcG9zZU9ic2VydmFibGUoZXZlbnRSZWdpc3RyYXRpb24sIGV2ZW50TmFtZSk7XG4gICAgdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSkucHVzaChldmVudFJlZ2lzdHJhdGlvbik7XG5cbiAgICB0aGlzLnNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWUpO1xuICAgIHJldHVybiA8RGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+PnJlZ2lzdHJhdGlvbk9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGRpc3Bvc2VPYnNlcnZhYmxlKGV2ZW50UmVnaXN0cmF0aW9uOiBSZWdpc3RyYXRpb24sIGV2ZW50TmFtZTogc3RyaW5nKSB7XG4gICAgZXZlbnRSZWdpc3RyYXRpb24uc3RvcHBlci5uZXh0KDEpO1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5nZXQoZXZlbnROYW1lKTtcbiAgICBjb25zdCBpbmRleCA9IHJlZ2lzdHJhdGlvbnMuaW5kZXhPZihldmVudFJlZ2lzdHJhdGlvbik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcmVnaXN0cmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICB0aGlzLnNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBzb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWdpc3RyYXRpb25zID0gdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgcmVnaXN0cmF0aW9ucy5zb3J0KChhLCBiKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSk7XG4gICAgaWYgKHJlZ2lzdHJhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWN0aXZlIHJlZ2lzdHJhdGlvbnMgYnkgcHJpb3JpdHlcbiAgICBjb25zdCBjdXJyZW50UHJpb3JpdHkgPSByZWdpc3RyYXRpb25zWzBdLnByaW9yaXR5O1xuICAgIHJlZ2lzdHJhdGlvbnMuZm9yRWFjaCgocmVnaXN0cmF0aW9uKSA9PiB7XG4gICAgICByZWdpc3RyYXRpb24uaXNQYXVzZWQgPSByZWdpc3RyYXRpb24ucHJpb3JpdHkgPCBjdXJyZW50UHJpb3JpdHk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrOiBwaWNrT3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrRmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0NvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9OiBFdmVudFJlZ2lzdHJhdGlvbklucHV0KTogUmVnaXN0cmF0aW9uIHtcbiAgICBjb25zdCBjZXNpdW1FdmVudE9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uID0gbmV3IFJlZ2lzdHJhdGlvbih1bmRlZmluZWQsIHN0b3BwZXIsIHByaW9yaXR5LCBmYWxzZSk7XG4gICAgbGV0IG9ic2VydmFibGU6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+O1xuXG4gICAgaWYgKCFDZXNpdW1EcmFnRHJvcEhlbHBlci5kcmFnRXZlbnRzLmhhcyhldmVudCkpIHtcbiAgICAgIG9ic2VydmFibGUgPSBjZXNpdW1FdmVudE9ic2VydmFibGUucGlwZShcbiAgICAgICAgZmlsdGVyKCgpID0+ICFyZWdpc3RyYXRpb24uaXNQYXVzZWQpLFxuICAgICAgICBtYXAoKG1vdmVtZW50KSA9PiB0aGlzLnRyaWdnZXJQaWNrKG1vdmVtZW50LCBwaWNrT3B0aW9uLCBwaWNrQ29uZmlnKSksXG4gICAgICAgIGZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQuY2VzaXVtRW50aXRpZXMgIT09IG51bGwgfHwgZW50aXR5VHlwZSA9PT0gdW5kZWZpbmVkKSxcbiAgICAgICAgbWFwKChwaWNrc0FuZE1vdmVtZW50KSA9PiB0aGlzLmFkZEVudGl0aWVzKHBpY2tzQW5kTW92ZW1lbnQsIGVudGl0eVR5cGUsIHBpY2tPcHRpb24sIHBpY2tGaWx0ZXIpKSxcbiAgICAgICAgZmlsdGVyKChyZXN1bHQpID0+IHJlc3VsdC5lbnRpdGllcyAhPT0gbnVsbCB8fCAoZW50aXR5VHlwZSA9PT0gdW5kZWZpbmVkICYmICFwaWNrRmlsdGVyKSksXG4gICAgICAgIHN3aXRjaE1hcCgoZW50aXRpZXNBbmRNb3ZlbWVudCkgPT4gdGhpcy5wbG9udGVyKGVudGl0aWVzQW5kTW92ZW1lbnQsIHBpY2tPcHRpb24pKSxcbiAgICAgICAgdGFrZVVudGlsKHN0b3BwZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRHJhZ0V2ZW50KHtcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIG1vZGlmaWVyLFxuICAgICAgICBlbnRpdHlUeXBlLFxuICAgICAgICBwaWNrOiBwaWNrT3B0aW9uLFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgcGlja0ZpbHRlcixcbiAgICAgICAgcGlja0NvbmZpZ1xuICAgICAgfSkucGlwZSh0YWtlVW50aWwoc3RvcHBlcikpO1xuICAgIH1cblxuICAgIHJlZ2lzdHJhdGlvbi5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZTtcbiAgICByZXR1cm4gcmVnaXN0cmF0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEcmFnRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eVR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGljazogcGlja09wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrRmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH06IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQpOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PiB7XG4gICAgY29uc3QgeyBtb3VzZURvd25FdmVudCwgbW91c2VVcEV2ZW50IH0gPSBDZXNpdW1EcmFnRHJvcEhlbHBlci5nZXREcmFnRXZlbnRUeXBlcyhldmVudCk7XG5cbiAgICBjb25zdCBtb3VzZVVwT2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRCdWlsZGVyLmdldChtb3VzZVVwRXZlbnQpO1xuICAgIGNvbnN0IG1vdXNlTW92ZU9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQoQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSk7XG5cbiAgICBjb25zdCBtb3VzZURvd25SZWdpc3RyYXRpb24gPSB0aGlzLmNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKHtcbiAgICAgIGV2ZW50OiBtb3VzZURvd25FdmVudCxcbiAgICAgIG1vZGlmaWVyLFxuICAgICAgZW50aXR5VHlwZSxcbiAgICAgIHBpY2s6IHBpY2tPcHRpb24sXG4gICAgICBwcmlvcml0eSxcbiAgICAgIHBpY2tGaWx0ZXIsXG4gICAgICBwaWNrQ29uZmlnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZHJvcFN1YmplY3QgPSBuZXcgU3ViamVjdDxFdmVudFJlc3VsdD4oKTtcbiAgICBjb25zdCBkcmFnT2JzZXJ2ZXIgPSBtb3VzZURvd25SZWdpc3RyYXRpb24ub2JzZXJ2YWJsZS5waXBlKG1lcmdlTWFwKGUgPT4ge1xuICAgICAgbGV0IGxhc3RNb3ZlOiBhbnkgPSBudWxsO1xuICAgICAgY29uc3QgZHJhZ1N0YXJ0UG9zaXRpb25YID0gZS5tb3ZlbWVudC5zdGFydFBvc2l0aW9uLng7XG4gICAgICBjb25zdCBkcmFnU3RhcnRQb3NpdGlvblkgPSBlLm1vdmVtZW50LnN0YXJ0UG9zaXRpb24ueTtcbiAgICAgIHJldHVybiBtb3VzZU1vdmVPYnNlcnZhYmxlLnBpcGUobWFwKChtb3ZlbWVudCkgPT4ge1xuICAgICAgICBsYXN0TW92ZSA9IHtcbiAgICAgICAgICBtb3ZlbWVudDoge1xuICAgICAgICAgICAgZHJvcDogZmFsc2UsXG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcbiAgICAgICAgICAgICAgeTogZHJhZ1N0YXJ0UG9zaXRpb25ZLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uOiBtb3ZlbWVudC5lbmRQb3NpdGlvbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVudGl0aWVzOiBlLmVudGl0aWVzLFxuICAgICAgICAgIGNlc2l1bUVudGl0aWVzOiBlLmNlc2l1bUVudGl0aWVzXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsYXN0TW92ZTtcbiAgICAgIH0pLCB0YWtlVW50aWwobW91c2VVcE9ic2VydmFibGUpLCB0YXAoe1xuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIC8vIE9uIGNvbXBsZXRlXG4gICAgICAgICAgaWYgKGxhc3RNb3ZlKSB7XG4gICAgICAgICAgICBjb25zdCBkcm9wRXZlbnQgPSBPYmplY3QuYXNzaWduKHt9LCBsYXN0TW92ZSk7XG4gICAgICAgICAgICBkcm9wRXZlbnQubW92ZW1lbnQuZHJvcCA9IHRydWU7XG4gICAgICAgICAgICBkcm9wU3ViamVjdC5uZXh0KGRyb3BFdmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIG1lcmdlKGRyYWdPYnNlcnZlciwgZHJvcFN1YmplY3QpO1xuXG4gIH1cblxuICBwcml2YXRlIHRyaWdnZXJQaWNrKG1vdmVtZW50OiBhbnksIHBpY2tPcHRpb25zOiBQaWNrT3B0aW9ucywgcGlja0NvbmZpZzogUGlja0NvbmZpZ3VyYXRpb24pIHtcbiAgICBsZXQgcGlja3M6IGFueSA9IFtdO1xuICAgIHN3aXRjaCAocGlja09wdGlvbnMpIHtcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuUElDS19PTkU6XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLlBJQ0tfQUxMOlxuICAgICAgICBwaWNrcyA9IHRoaXMuc2NlbmUuZHJpbGxQaWNrKG1vdmVtZW50LmVuZFBvc2l0aW9uLCBwaWNrQ29uZmlnLmRyaWxsUGlja0xpbWl0LCBwaWNrQ29uZmlnLnBpY2tXaWR0aCwgcGlja0NvbmZpZy5waWNrSGVpZ2h0KTtcbiAgICAgICAgcGlja3MgPSBwaWNrcy5sZW5ndGggPT09IDAgPyBudWxsIDogcGlja3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNUOlxuICAgICAgICBjb25zdCBwaWNrID0gdGhpcy5zY2VuZS5waWNrKG1vdmVtZW50LmVuZFBvc2l0aW9uLCBwaWNrQ29uZmlnLnBpY2tXaWR0aCwgcGlja0NvbmZpZy5waWNrSGVpZ2h0KTtcbiAgICAgICAgcGlja3MgPSBwaWNrID09PSB1bmRlZmluZWQgPyBudWxsIDogW3BpY2tdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuTk9fUElDSzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBQaWNrcyBjYW4gYmUgY2VzaXVtIGVudGl0eSBvciBjZXNpdW0gcHJpbWl0aXZlXG4gICAgaWYgKHBpY2tzKSB7XG4gICAgICBwaWNrcyA9IHBpY2tzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmlkICYmIHBpY2suaWQgaW5zdGFuY2VvZiBDZXNpdW0uRW50aXR5ID8gcGljay5pZCA6IHBpY2sucHJpbWl0aXZlKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBtb3ZlbWVudDogbW92ZW1lbnQsIGNlc2l1bUVudGl0aWVzOiBwaWNrcyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRFbnRpdGllcyhwaWNrc0FuZE1vdmVtZW50OiBhbnksIGVudGl0eVR5cGU6IGFueSwgcGlja09wdGlvbjogUGlja09wdGlvbnMsIHBpY2tGaWx0ZXI/OiAoYW55KSA9PiBib29sZWFuKTogRXZlbnRSZXN1bHQge1xuXG4gICAgaWYgKHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMgPT09IG51bGwpIHtcbiAgICAgIHBpY2tzQW5kTW92ZW1lbnQuZW50aXRpZXMgPSBudWxsO1xuICAgICAgcmV0dXJuIHBpY2tzQW5kTW92ZW1lbnQ7XG4gICAgfVxuICAgIGxldCBlbnRpdGllcyA9IFtdO1xuICAgIGlmIChwaWNrT3B0aW9uICE9PSBQaWNrT3B0aW9ucy5OT19QSUNLKSB7XG4gICAgICBpZiAoZW50aXR5VHlwZSkge1xuICAgICAgICBlbnRpdGllcyA9IHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMubWFwKChwaWNrOiBhbnkpID0+IHBpY2suYWNFbnRpdHkpLmZpbHRlcigoYWNFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiBhY0VudGl0eSAmJiBhY0VudGl0eSBpbnN0YW5jZW9mIGVudGl0eVR5cGU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXRpZXMgPSBwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmFjRW50aXR5KTtcbiAgICAgIH1cblxuICAgICAgZW50aXRpZXMgPSBVdGlsc1NlcnZpY2UudW5pcXVlKGVudGl0aWVzKTtcbiAgICAgIGVudGl0aWVzID0gKHBpY2tGaWx0ZXIgJiYgZW50aXRpZXMpID8gZW50aXRpZXMuZmlsdGVyKHBpY2tGaWx0ZXIpIDogZW50aXRpZXM7XG4gICAgICBpZiAoZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGVudGl0aWVzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwaWNrc0FuZE1vdmVtZW50LmVudGl0aWVzID0gZW50aXRpZXM7XG5cbiAgICByZXR1cm4gcGlja3NBbmRNb3ZlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgcGxvbnRlcihlbnRpdGllc0FuZE1vdmVtZW50OiBFdmVudFJlc3VsdCwgcGlja09wdGlvbjogUGlja09wdGlvbnMpOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PiB7XG4gICAgaWYgKHBpY2tPcHRpb24gPT09IFBpY2tPcHRpb25zLlBJQ0tfT05FICYmIGVudGl0aWVzQW5kTW92ZW1lbnQuZW50aXRpZXMgIT09IG51bGwgJiYgZW50aXRpZXNBbmRNb3ZlbWVudC5lbnRpdGllcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVySXQoZW50aXRpZXNBbmRNb3ZlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoZW50aXRpZXNBbmRNb3ZlbWVudCk7XG4gICAgfVxuICB9XG59XG4iXX0=