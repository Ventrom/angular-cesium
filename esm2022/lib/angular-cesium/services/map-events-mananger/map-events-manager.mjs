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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapEventsManagerService, deps: [{ token: i1.CesiumService }, { token: i2.CesiumEventBuilder }, { token: i3.PlonterService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapEventsManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapEventsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }, { type: i2.CesiumEventBuilder }, { type: i3.PlonterService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDekQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7Ozs7O0FBRWpGLE1BQU0sWUFBWTtJQUNoQixZQUFtQixVQUFtQyxFQUNsQyxPQUFxQixFQUNyQixRQUFnQixFQUNoQixRQUFpQjtRQUhsQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUNyQyxDQUFDO0NBQ0Y7QUFpQkQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFFSCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQW9CLGFBQTRCLEVB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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IGZpbHRlciwgbWFwLCBtZXJnZU1hcCwgc3dpdGNoTWFwLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRCdWlsZGVyIH0gZnJvbSAnLi9jZXNpdW0tZXZlbnQtYnVpbGRlcic7XG5pbXBvcnQgeyBFdmVudFJlZ2lzdHJhdGlvbklucHV0LCBQaWNrQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vZXZlbnQtcmVnaXN0cmF0aW9uLWlucHV0JztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGxvbnRlclNlcnZpY2UgfSBmcm9tICcuLi9wbG9udGVyL3Bsb250ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBVdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bURyYWdEcm9wSGVscGVyIH0gZnJvbSAnLi9ldmVudC1vYnNlcnZlcnMvY2VzaXVtLWRyYWctZHJvcC1oZWxwZXInO1xuXG5jbGFzcyBSZWdpc3RyYXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4sXG4gICAgICAgICAgICAgIHB1YmxpYyAgc3RvcHBlcjogU3ViamVjdDxhbnk+LFxuICAgICAgICAgICAgICBwdWJsaWMgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyAgaXNQYXVzZWQ6IGJvb2xlYW4pIHtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgc2NyZWVuIHBvc2l0aW9uLCBkcmFnIGJvb2xlYW4gZm9yIGRyYWcgZXZlbnRzIG9ubHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb3ZlbWVudCB7XG4gIHN0YXJ0UG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgZW5kUG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgZHJvcD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRSZXN1bHQge1xuICBtb3ZlbWVudDogTW92ZW1lbnQ7XG4gIGNlc2l1bUVudGl0aWVzOiBhbnlbXTtcbiAgZW50aXRpZXM6IGFueVtdO1xufVxuXG4vKipcbiAqIE1hbmFnZXMgYWxsIG1hcCBldmVudHMuIE5vdGljZSBldmVudHMgd2lsbCBydW4gb3V0c2lkZSBvZiBBbmd1bGFyIHpvbmUuXG4gKiBQcm92aWRlZCBieSBgPGFjLW1hcC8+YCBjb21wb25lbnQgdGhlcmUgZm9yIGNvdWxkIGJlIGluamVjdGVkIGF0IGFueSBjb21wb25lbnQgdW5kZXIgYDxhYy1tYXAvPmAgaGllcmFyY2h5XG4gKiBvciBmcm9tIHRoZSBgPGFjLW1hcC8+YCBjb21wb25lbnQgcmVmZXJlbmNlIGBhY01hcENvbXBvbmVudC5nZXRNYXBFdmVudHNNYW5hZ2VyKClgXG4gKlxuICogX191c2FnZTpfX1xuICogYGBgXG4gKiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZS5yZWdpc3Rlcih7ZXZlbnQsIG1vZGlmaWVyLCBwcmlvcml0eSwgZW50aXR5VHlwZSwgcGlja09wdGlvbn0pLnN1YnNjcmliZSgpXG4gKiBgYGBcbiAqIF9fcGFyYW06X18ge0Nlc2l1bUV2ZW50fSBldmVudFxuICogX19wYXJhbTpfXyB7Q2VzaXVtRXZlbnRNb2RpZmllcn0gbW9kaWZpZXJcbiAqIF9fcGFyYW06X18gcHJpb3JpdHkgLSB0aGUgYmlnZ2VyIHRoZSBudW1iZXIgdGhlIGJpZ2dlciB0aGUgcHJpb3JpdHkuIGRlZmF1bHQgOiAwLlxuICogX19wYXJhbTpfXyBlbnRpdHlUeXBlIC0gZW50aXR5IHR5cGUgY2xhc3MgdGhhdCB5b3UgYXJlIGludGVyZXN0ZWQgbGlrZSAoVHJhY2spLiB0aGUgY2xhc3MgbXVzdCBleHRlbmRzIEFjRW50aXR5XG4gKiBfX3BhcmFtOl9fIHBpY2tPcHRpb24gLSBzZWxmIGV4cGxhaW5lZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xuXG4gIHByaXZhdGUgc2NlbmU6IGFueTtcbiAgcHJpdmF0ZSBldmVudFJlZ2lzdHJhdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgUmVnaXN0cmF0aW9uW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGV2ZW50QnVpbGRlcjogQ2VzaXVtRXZlbnRCdWlsZGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHBsb250ZXJTZXJ2aWNlOiBQbG9udGVyU2VydmljZSkge1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmV2ZW50QnVpbGRlci5pbml0KCk7XG4gICAgdGhpcy5zY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvIG1hcCBldmVudFxuICAgKiBAcGFyYW0gaW5wdXQgRXZlbnQgUmVnaXN0cmF0aW9uIElucHV0XG4gICAqXG4gICAqIEByZXR1cm5zIERpc3Bvc2FibGVPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PlxuICAgKi9cbiAgcmVnaXN0ZXIoaW5wdXQ6IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQpOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGlmICh0aGlzLnNjZW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2VzaXVtU2VydmljZSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0IC0gTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgbXVzdCBiZSBpbmplY3RlZCAgdW5kZXIgYWMtbWFwJyk7XG4gICAgfVxuXG4gICAgaW5wdXQucGljayA9IGlucHV0LnBpY2sgfHwgUGlja09wdGlvbnMuTk9fUElDSztcbiAgICBpbnB1dC5wcmlvcml0eSA9IGlucHV0LnByaW9yaXR5IHx8IDA7XG4gICAgaW5wdXQucGlja0NvbmZpZyA9IGlucHV0LnBpY2tDb25maWcgfHwge307XG5cbiAgICBpZiAoaW5wdXQuZW50aXR5VHlwZSAmJiBpbnB1dC5waWNrID09PSBQaWNrT3B0aW9ucy5OT19QSUNLKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hcEV2ZW50c01hbmFnZXJTZXJ2aWNlOiBjYW5cXCd0IHJlZ2lzdGVyIGFuIGV2ZW50ICcgK1xuICAgICAgICAnd2l0aCBlbnRpdHlUeXBlIGFuZCBQaWNrT3B0aW9ucy5OT19QSUNLIC0gSXQgZG9lc25cXCd0IG1ha2Ugc2Vuc2UgJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnROYW1lID0gQ2VzaXVtRXZlbnRCdWlsZGVyLmdldEV2ZW50RnVsbE5hbWUoaW5wdXQuZXZlbnQsIGlucHV0Lm1vZGlmaWVyKTtcblxuICAgIGlmICghdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuaGFzKGV2ZW50TmFtZSkpIHtcbiAgICAgIHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLnNldChldmVudE5hbWUsIFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudFJlZ2lzdHJhdGlvbiA9IHRoaXMuY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oaW5wdXQpO1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk9ic2VydmFibGU6IGFueSA9IGV2ZW50UmVnaXN0cmF0aW9uLm9ic2VydmFibGU7XG4gICAgcmVnaXN0cmF0aW9uT2JzZXJ2YWJsZS5kaXNwb3NlID0gKCkgPT4gdGhpcy5kaXNwb3NlT2JzZXJ2YWJsZShldmVudFJlZ2lzdHJhdGlvbiwgZXZlbnROYW1lKTtcbiAgICB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5nZXQoZXZlbnROYW1lKS5wdXNoKGV2ZW50UmVnaXN0cmF0aW9uKTtcblxuICAgIHRoaXMuc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZSk7XG4gICAgcmV0dXJuIDxEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4+cmVnaXN0cmF0aW9uT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZU9ic2VydmFibGUoZXZlbnRSZWdpc3RyYXRpb246IFJlZ2lzdHJhdGlvbiwgZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgICBldmVudFJlZ2lzdHJhdGlvbi5zdG9wcGVyLm5leHQoMSk7XG4gICAgY29uc3QgcmVnaXN0cmF0aW9ucyA9IHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmdldChldmVudE5hbWUpO1xuICAgIGNvbnN0IGluZGV4ID0gcmVnaXN0cmF0aW9ucy5pbmRleE9mKGV2ZW50UmVnaXN0cmF0aW9uKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICByZWdpc3RyYXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHRoaXMuc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZSk7XG4gIH1cblxuICBwcml2YXRlIHNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5nZXQoZXZlbnROYW1lKTtcbiAgICByZWdpc3RyYXRpb25zLnNvcnQoKGEsIGIpID0+IGIucHJpb3JpdHkgLSBhLnByaW9yaXR5KTtcbiAgICBpZiAocmVnaXN0cmF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBBY3RpdmUgcmVnaXN0cmF0aW9ucyBieSBwcmlvcml0eVxuICAgIGNvbnN0IGN1cnJlbnRQcmlvcml0eSA9IHJlZ2lzdHJhdGlvbnNbMF0ucHJpb3JpdHk7XG4gICAgcmVnaXN0cmF0aW9ucy5mb3JFYWNoKChyZWdpc3RyYXRpb24pID0+IHtcbiAgICAgIHJlZ2lzdHJhdGlvbi5pc1BhdXNlZCA9IHJlZ2lzdHJhdGlvbi5wcmlvcml0eSA8IGN1cnJlbnRQcmlvcml0eTtcbiAgICB9KTtcblxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVFdmVudFJlZ2lzdHJhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2s6IHBpY2tPcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tGaWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrQ29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH06IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQpOiBSZWdpc3RyYXRpb24ge1xuICAgIGNvbnN0IGNlc2l1bUV2ZW50T2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRCdWlsZGVyLmdldChldmVudCwgbW9kaWZpZXIpO1xuICAgIGNvbnN0IHN0b3BwZXIgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cbiAgICBjb25zdCByZWdpc3RyYXRpb24gPSBuZXcgUmVnaXN0cmF0aW9uKHVuZGVmaW5lZCwgc3RvcHBlciwgcHJpb3JpdHksIGZhbHNlKTtcbiAgICBsZXQgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD47XG5cbiAgICBpZiAoIUNlc2l1bURyYWdEcm9wSGVscGVyLmRyYWdFdmVudHMuaGFzKGV2ZW50KSkge1xuICAgICAgb2JzZXJ2YWJsZSA9IGNlc2l1bUV2ZW50T2JzZXJ2YWJsZS5waXBlKFxuICAgICAgICBmaWx0ZXIoKCkgPT4gIXJlZ2lzdHJhdGlvbi5pc1BhdXNlZCksXG4gICAgICAgIG1hcCgobW92ZW1lbnQpID0+IHRoaXMudHJpZ2dlclBpY2sobW92ZW1lbnQsIHBpY2tPcHRpb24sIHBpY2tDb25maWcpKSxcbiAgICAgICAgZmlsdGVyKChyZXN1bHQpID0+IHJlc3VsdC5jZXNpdW1FbnRpdGllcyAhPT0gbnVsbCB8fCBlbnRpdHlUeXBlID09PSB1bmRlZmluZWQpLFxuICAgICAgICBtYXAoKHBpY2tzQW5kTW92ZW1lbnQpID0+IHRoaXMuYWRkRW50aXRpZXMocGlja3NBbmRNb3ZlbWVudCwgZW50aXR5VHlwZSwgcGlja09wdGlvbiwgcGlja0ZpbHRlcikpLFxuICAgICAgICBmaWx0ZXIoKHJlc3VsdCkgPT4gcmVzdWx0LmVudGl0aWVzICE9PSBudWxsIHx8IChlbnRpdHlUeXBlID09PSB1bmRlZmluZWQgJiYgIXBpY2tGaWx0ZXIpKSxcbiAgICAgICAgc3dpdGNoTWFwKChlbnRpdGllc0FuZE1vdmVtZW50KSA9PiB0aGlzLnBsb250ZXIoZW50aXRpZXNBbmRNb3ZlbWVudCwgcGlja09wdGlvbikpLFxuICAgICAgICB0YWtlVW50aWwoc3RvcHBlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVEcmFnRXZlbnQoe1xuICAgICAgICBldmVudCxcbiAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgIGVudGl0eVR5cGUsXG4gICAgICAgIHBpY2s6IHBpY2tPcHRpb24sXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBwaWNrRmlsdGVyLFxuICAgICAgICBwaWNrQ29uZmlnXG4gICAgICB9KS5waXBlKHRha2VVbnRpbChzdG9wcGVyKSk7XG4gICAgfVxuXG4gICAgcmVnaXN0cmF0aW9uLm9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xuICAgIHJldHVybiByZWdpc3RyYXRpb247XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURyYWdFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrOiBwaWNrT3B0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tGaWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0NvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfTogRXZlbnRSZWdpc3RyYXRpb25JbnB1dCk6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+IHtcbiAgICBjb25zdCB7IG1vdXNlRG93bkV2ZW50LCBtb3VzZVVwRXZlbnQgfSA9IENlc2l1bURyYWdEcm9wSGVscGVyLmdldERyYWdFdmVudFR5cGVzKGV2ZW50KTtcblxuICAgIGNvbnN0IG1vdXNlVXBPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KG1vdXNlVXBFdmVudCk7XG4gICAgY29uc3QgbW91c2VNb3ZlT2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRCdWlsZGVyLmdldChDZXNpdW1FdmVudC5NT1VTRV9NT1ZFKTtcblxuICAgIGNvbnN0IG1vdXNlRG93blJlZ2lzdHJhdGlvbiA9IHRoaXMuY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oe1xuICAgICAgZXZlbnQ6IG1vdXNlRG93bkV2ZW50LFxuICAgICAgbW9kaWZpZXIsXG4gICAgICBlbnRpdHlUeXBlLFxuICAgICAgcGljazogcGlja09wdGlvbixcbiAgICAgIHByaW9yaXR5LFxuICAgICAgcGlja0ZpbHRlcixcbiAgICAgIHBpY2tDb25maWcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkcm9wU3ViamVjdCA9IG5ldyBTdWJqZWN0PEV2ZW50UmVzdWx0PigpO1xuICAgIGNvbnN0IGRyYWdPYnNlcnZlciA9IG1vdXNlRG93blJlZ2lzdHJhdGlvbi5vYnNlcnZhYmxlLnBpcGUobWVyZ2VNYXAoZSA9PiB7XG4gICAgICBsZXQgbGFzdE1vdmU6IGFueSA9IG51bGw7XG4gICAgICBjb25zdCBkcmFnU3RhcnRQb3NpdGlvblggPSBlLm1vdmVtZW50LnN0YXJ0UG9zaXRpb24ueDtcbiAgICAgIGNvbnN0IGRyYWdTdGFydFBvc2l0aW9uWSA9IGUubW92ZW1lbnQuc3RhcnRQb3NpdGlvbi55O1xuICAgICAgcmV0dXJuIG1vdXNlTW92ZU9ic2VydmFibGUucGlwZShtYXAoKG1vdmVtZW50KSA9PiB7XG4gICAgICAgIGxhc3RNb3ZlID0ge1xuICAgICAgICAgIG1vdmVtZW50OiB7XG4gICAgICAgICAgICBkcm9wOiBmYWxzZSxcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb246IHtcbiAgICAgICAgICAgICAgeDogZHJhZ1N0YXJ0UG9zaXRpb25YLFxuICAgICAgICAgICAgICB5OiBkcmFnU3RhcnRQb3NpdGlvblksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kUG9zaXRpb246IG1vdmVtZW50LmVuZFBvc2l0aW9uLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW50aXRpZXM6IGUuZW50aXRpZXMsXG4gICAgICAgICAgY2VzaXVtRW50aXRpZXM6IGUuY2VzaXVtRW50aXRpZXNcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGxhc3RNb3ZlO1xuICAgICAgfSksIHRha2VVbnRpbChtb3VzZVVwT2JzZXJ2YWJsZSksIHRhcCh7XG4gICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgLy8gT24gY29tcGxldGVcbiAgICAgICAgICBpZiAobGFzdE1vdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRyb3BFdmVudCA9IE9iamVjdC5hc3NpZ24oe30sIGxhc3RNb3ZlKTtcbiAgICAgICAgICAgIGRyb3BFdmVudC5tb3ZlbWVudC5kcm9wID0gdHJ1ZTtcbiAgICAgICAgICAgIGRyb3BTdWJqZWN0Lm5leHQoZHJvcEV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gbWVyZ2UoZHJhZ09ic2VydmVyLCBkcm9wU3ViamVjdCk7XG5cbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclBpY2sobW92ZW1lbnQ6IGFueSwgcGlja09wdGlvbnM6IFBpY2tPcHRpb25zLCBwaWNrQ29uZmlnOiBQaWNrQ29uZmlndXJhdGlvbikge1xuICAgIGxldCBwaWNrczogYW55ID0gW107XG4gICAgc3dpdGNoIChwaWNrT3B0aW9ucykge1xuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX09ORTpcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuUElDS19BTEw6XG4gICAgICAgIHBpY2tzID0gdGhpcy5zY2VuZS5kcmlsbFBpY2sobW92ZW1lbnQuZW5kUG9zaXRpb24sIHBpY2tDb25maWcuZHJpbGxQaWNrTGltaXQsIHBpY2tDb25maWcucGlja1dpZHRoLCBwaWNrQ29uZmlnLnBpY2tIZWlnaHQpO1xuICAgICAgICBwaWNrcyA9IHBpY2tzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBwaWNrcztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLlBJQ0tfRklSU1Q6XG4gICAgICAgIGNvbnN0IHBpY2sgPSB0aGlzLnNjZW5lLnBpY2sobW92ZW1lbnQuZW5kUG9zaXRpb24sIHBpY2tDb25maWcucGlja1dpZHRoLCBwaWNrQ29uZmlnLnBpY2tIZWlnaHQpO1xuICAgICAgICBwaWNrcyA9IHBpY2sgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBbcGlja107XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5OT19QSUNLOlxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFBpY2tzIGNhbiBiZSBjZXNpdW0gZW50aXR5IG9yIGNlc2l1bSBwcmltaXRpdmVcbiAgICBpZiAocGlja3MpIHtcbiAgICAgIHBpY2tzID0gcGlja3MubWFwKChwaWNrOiBhbnkpID0+IHBpY2suaWQgJiYgcGljay5pZCBpbnN0YW5jZW9mIENlc2l1bS5FbnRpdHkgPyBwaWNrLmlkIDogcGljay5wcmltaXRpdmUpO1xuICAgIH1cblxuICAgIHJldHVybiB7IG1vdmVtZW50OiBtb3ZlbWVudCwgY2VzaXVtRW50aXRpZXM6IHBpY2tzIH07XG4gIH1cblxuICBwcml2YXRlIGFkZEVudGl0aWVzKHBpY2tzQW5kTW92ZW1lbnQ6IGFueSwgZW50aXR5VHlwZTogYW55LCBwaWNrT3B0aW9uOiBQaWNrT3B0aW9ucywgcGlja0ZpbHRlcj86IChhbnkpID0+IGJvb2xlYW4pOiBFdmVudFJlc3VsdCB7XG5cbiAgICBpZiAocGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcyA9PT0gbnVsbCkge1xuICAgICAgcGlja3NBbmRNb3ZlbWVudC5lbnRpdGllcyA9IG51bGw7XG4gICAgICByZXR1cm4gcGlja3NBbmRNb3ZlbWVudDtcbiAgICB9XG4gICAgbGV0IGVudGl0aWVzID0gW107XG4gICAgaWYgKHBpY2tPcHRpb24gIT09IFBpY2tPcHRpb25zLk5PX1BJQ0spIHtcbiAgICAgIGlmIChlbnRpdHlUeXBlKSB7XG4gICAgICAgIGVudGl0aWVzID0gcGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5hY0VudGl0eSkuZmlsdGVyKChhY0VudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGFjRW50aXR5ICYmIGFjRW50aXR5IGluc3RhbmNlb2YgZW50aXR5VHlwZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRpdGllcyA9IHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMubWFwKChwaWNrOiBhbnkpID0+IHBpY2suYWNFbnRpdHkpO1xuICAgICAgfVxuXG4gICAgICBlbnRpdGllcyA9IFV0aWxzU2VydmljZS51bmlxdWUoZW50aXRpZXMpO1xuICAgICAgZW50aXRpZXMgPSAocGlja0ZpbHRlciAmJiBlbnRpdGllcykgPyBlbnRpdGllcy5maWx0ZXIocGlja0ZpbHRlcikgOiBlbnRpdGllcztcbiAgICAgIGlmIChlbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZW50aXRpZXMgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBpY2tzQW5kTW92ZW1lbnQuZW50aXRpZXMgPSBlbnRpdGllcztcblxuICAgIHJldHVybiBwaWNrc0FuZE1vdmVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBwbG9udGVyKGVudGl0aWVzQW5kTW92ZW1lbnQ6IEV2ZW50UmVzdWx0LCBwaWNrT3B0aW9uOiBQaWNrT3B0aW9ucyk6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+IHtcbiAgICBpZiAocGlja09wdGlvbiA9PT0gUGlja09wdGlvbnMuUElDS19PTkUgJiYgZW50aXRpZXNBbmRNb3ZlbWVudC5lbnRpdGllcyAhPT0gbnVsbCAmJiBlbnRpdGllc0FuZE1vdmVtZW50LmVudGl0aWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJJdChlbnRpdGllc0FuZE1vdmVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihlbnRpdGllc0FuZE1vdmVtZW50KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==