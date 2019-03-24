/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { merge, of as observableOf, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEventBuilder } from './cesium-event-builder';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { PlonterService } from '../plonter/plonter.service';
import { UtilsService } from '../../utils/utils.service';
import { CesiumDragDropHelper } from './event-observers/cesium-drag-drop-helper';
class Registration {
    /**
     * @param {?} observable
     * @param {?} stopper
     * @param {?} priority
     * @param {?} isPaused
     */
    constructor(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
}
if (false) {
    /** @type {?} */
    Registration.prototype.observable;
    /** @type {?} */
    Registration.prototype.stopper;
    /** @type {?} */
    Registration.prototype.priority;
    /** @type {?} */
    Registration.prototype.isPaused;
}
/**
 * Returns screen position, drag boolean for drag events only
 * @record
 */
export function Movement() { }
if (false) {
    /** @type {?} */
    Movement.prototype.startPosition;
    /** @type {?} */
    Movement.prototype.endPosition;
    /** @type {?|undefined} */
    Movement.prototype.drop;
}
/**
 * @record
 */
export function EventResult() { }
if (false) {
    /** @type {?} */
    EventResult.prototype.movement;
    /** @type {?} */
    EventResult.prototype.cesiumEntities;
    /** @type {?} */
    EventResult.prototype.entities;
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
    /**
     * @param {?} cesiumService
     * @param {?} eventBuilder
     * @param {?} plonterService
     */
    constructor(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    /**
     * @return {?}
     */
    init() {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    }
    /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    register(input) {
        if (this.scene === undefined) {
            throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
        }
        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw new Error('MapEventsManagerService: can\'t register an event ' +
                'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
        }
        /** @type {?} */
        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        /** @type {?} */
        const eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority, input.pickFilter);
        /** @type {?} */
        const registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = (/**
         * @return {?}
         */
        () => this.disposeObservable(eventRegistration, eventName));
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return (/** @type {?} */ (registrationObservable));
    }
    /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        /** @type {?} */
        const registrations = this.eventRegistrations.get(eventName);
        /** @type {?} */
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }
    /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    sortRegistrationsByPriority(eventName) {
        /** @type {?} */
        const registrations = this.eventRegistrations.get(eventName);
        registrations.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => b.priority - a.priority));
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        /** @type {?} */
        const currentPriority = registrations[0].priority;
        registrations.forEach((/**
         * @param {?} registration
         * @return {?}
         */
        (registration) => {
            registration.isPaused = registration.priority < currentPriority;
        }));
    }
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    createEventRegistration(event, modifier, entityType, pickOption, priority, pickFilter) {
        /** @type {?} */
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        /** @type {?} */
        const stopper = new Subject();
        /** @type {?} */
        const registration = new Registration(undefined, stopper, priority, false);
        /** @type {?} */
        let observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter((/**
             * @return {?}
             */
            () => !registration.isPaused)), map((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => this.triggerPick(movement, pickOption))), filter((/**
             * @param {?} result
             * @return {?}
             */
            (result) => result.cesiumEntities !== null || entityType === undefined)), map((/**
             * @param {?} picksAndMovement
             * @return {?}
             */
            (picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter))), filter((/**
             * @param {?} result
             * @return {?}
             */
            (result) => result.entities !== null || (entityType === undefined && !pickFilter))), switchMap((/**
             * @param {?} entitiesAndMovement
             * @return {?}
             */
            (entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption))), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    }
    /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter) {
        const { mouseDownEvent, mouseUpEvent } = CesiumDragDropHelper.getDragEventTypes(event);
        /** @type {?} */
        const mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        /** @type {?} */
        const mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        /** @type {?} */
        const mouseDownRegistration = this.createEventRegistration(mouseDownEvent, modifier, entityType, pickOption, priority, pickFilter);
        /** @type {?} */
        const dropSubject = new Subject();
        /** @type {?} */
        const dragObserver = mouseDownRegistration.observable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        e => {
            /** @type {?} */
            let lastMove = null;
            /** @type {?} */
            const dragStartPositionX = e.movement.startPosition.x;
            /** @type {?} */
            const dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((/**
             * @param {?} movement
             * @return {?}
             */
            (movement) => {
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
            })), takeUntil(mouseUpObservable), tap(undefined, undefined, (/**
             * @return {?}
             */
            () => {
                // On complete
                if (lastMove) {
                    /** @type {?} */
                    const dropEvent = Object.assign({}, lastMove);
                    dropEvent.movement.drop = true;
                    dropSubject.next(dropEvent);
                }
            })));
        })));
        return merge(dragObserver, dropSubject);
    }
    /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    triggerPick(movement, pickOptions) {
        /** @type {?} */
        let picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                /** @type {?} */
                const pick = this.scene.pick(movement.endPosition);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map((/**
             * @param {?} pick
             * @return {?}
             */
            (pick) => pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive));
        }
        return { movement: movement, cesiumEntities: picks };
    }
    /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    addEntities(picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        /** @type {?} */
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                (pick) => pick.acEntity)).filter((/**
                 * @param {?} acEntity
                 * @return {?}
                 */
                (acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                }));
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                (pick) => pick.acEntity));
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
    /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    plonter(entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return observableOf(entitiesAndMovement);
        }
    }
}
MapEventsManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapEventsManagerService.ctorParameters = () => [
    { type: CesiumService },
    { type: CesiumEventBuilder },
    { type: PlonterService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapEventsManagerService.prototype.scene;
    /**
     * @type {?}
     * @private
     */
    MapEventsManagerService.prototype.eventRegistrations;
    /**
     * @type {?}
     * @private
     */
    MapEventsManagerService.prototype.cesiumService;
    /**
     * @type {?}
     * @private
     */
    MapEventsManagerService.prototype.eventBuilder;
    /**
     * @type {?}
     * @private
     */
    MapEventsManagerService.prototype.plonterService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRWpGLE1BQU0sWUFBWTs7Ozs7OztJQUNoQixZQUFtQixVQUFtQyxFQUNsQyxPQUFxQixFQUNyQixRQUFnQixFQUNoQixRQUFpQjtRQUhsQixlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFjO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUNyQyxDQUFDO0NBQ0Y7OztJ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QzthQUM5RTtZQUVELFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsR0FBRyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzdFLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3pCLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDakI7U0FDRjtRQUVELGdCQUFnQixDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFckMsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDOzs7Ozs7O0lBRU8sT0FBTyxDQUFDLG1CQUFnQyxFQUFFLFVBQXVCO1FBQ3ZFLElBQUksVUFBVSxLQUFLLFdBQVcsQ0FBQyxRQUFRLElBQUksbUJBQW1CLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzSCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLE9BQU8sWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDMUM7SUFDSCxDQUFDOzs7WUF4TkYsVUFBVTs7OztZQWpERixhQUFhO1lBQ2Isa0JBQWtCO1lBTWxCLGNBQWM7Ozs7Ozs7SUE2Q3JCLHdDQUFtQjs7Ozs7SUFDbkIscURBQStEOzs7OztJQUVuRCxnREFBb0M7Ozs7O0lBQ3BDLCtDQUF3Qzs7Ozs7SUFDeEMsaURBQXNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2UsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50QnVpbGRlciB9IGZyb20gJy4vY2VzaXVtLWV2ZW50LWJ1aWxkZXInO1xuaW1wb3J0IHsgRXZlbnRSZWdpc3RyYXRpb25JbnB1dCB9IGZyb20gJy4vZXZlbnQtcmVnaXN0cmF0aW9uLWlucHV0JztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4vY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1EcmFnRHJvcEhlbHBlciB9IGZyb20gJy4vZXZlbnQtb2JzZXJ2ZXJzL2Nlc2l1bS1kcmFnLWRyb3AtaGVscGVyJztcblxuY2xhc3MgUmVnaXN0cmF0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9ic2VydmFibGU6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+LFxuICAgICAgICAgICAgICBwdWJsaWMgIHN0b3BwZXI6IFN1YmplY3Q8YW55PixcbiAgICAgICAgICAgICAgcHVibGljICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICBwdWJsaWMgIGlzUGF1c2VkOiBib29sZWFuKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHNjcmVlbiBwb3NpdGlvbiwgZHJhZyBib29sZWFuIGZvciBkcmFnIGV2ZW50cyBvbmx5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZW1lbnQge1xuICBzdGFydFBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gIGVuZFBvc2l0aW9uOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH07XG4gIGRyb3A/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50UmVzdWx0IHtcbiAgbW92ZW1lbnQ6IE1vdmVtZW50O1xuICBjZXNpdW1FbnRpdGllczogYW55W107XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGFsbCBtYXAgZXZlbnRzLiBOb3RpY2UgZXZlbnRzIHdpbGwgcnVuIG91dHNpZGUgb2YgQW5ndWxhciB6b25lLlxuICogUHJvdmlkZWQgYnkgYDxhYy1tYXAvPmAgY29tcG9uZW50IHRoZXJlIGZvciBjb3VsZCBiZSBpbmplY3RlZCBhdCBhbnkgY29tcG9uZW50IHVuZGVyIGA8YWMtbWFwLz5gIGhpZXJhcmNoeVxuICogb3IgZnJvbSB0aGUgYDxhYy1tYXAvPmAgY29tcG9uZW50IHJlZmVyZW5jZSBgYWNNYXBDb21wb25lbnQuZ2V0TWFwRXZlbnRzTWFuYWdlcigpYFxuICpcbiAqIF9fdXNhZ2U6X19cbiAqIGBgYFxuICogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UucmVnaXN0ZXIoe2V2ZW50LCBtb2RpZmllciwgcHJpb3JpdHksIGVudGl0eVR5cGUsIHBpY2tPcHRpb259KS5zdWJzY3JpYmUoKVxuICogYGBgXG4gKiBfX3BhcmFtOl9fIHtDZXNpdW1FdmVudH0gZXZlbnRcbiAqIF9fcGFyYW06X18ge0Nlc2l1bUV2ZW50TW9kaWZpZXJ9IG1vZGlmaWVyXG4gKiBfX3BhcmFtOl9fIHByaW9yaXR5IC0gdGhlIGJpZ2dlciB0aGUgbnVtYmVyIHRoZSBiaWdnZXIgdGhlIHByaW9yaXR5LiBkZWZhdWx0IDogMC5cbiAqIF9fcGFyYW06X18gZW50aXR5VHlwZSAtIGVudGl0eSB0eXBlIGNsYXNzIHRoYXQgeW91IGFyZSBpbnRlcmVzdGVkIGxpa2UgKFRyYWNrKS4gdGhlIGNsYXNzIG11c3QgZXh0ZW5kcyBBY0VudGl0eVxuICogX19wYXJhbTpfXyBwaWNrT3B0aW9uIC0gc2VsZiBleHBsYWluZWRcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIHtcblxuICBwcml2YXRlIHNjZW5lOiBhbnk7XG4gIHByaXZhdGUgZXZlbnRSZWdpc3RyYXRpb25zID0gbmV3IE1hcDxzdHJpbmcsIFJlZ2lzdHJhdGlvbltdPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBldmVudEJ1aWxkZXI6IENlc2l1bUV2ZW50QnVpbGRlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwbG9udGVyU2VydmljZTogUGxvbnRlclNlcnZpY2UpIHtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5ldmVudEJ1aWxkZXIuaW5pdCgpO1xuICAgIHRoaXMuc2NlbmUgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0byBtYXAgZXZlbnRcbiAgICogQHBhcmFtIGlucHV0IEV2ZW50IFJlZ2lzdHJhdGlvbiBJbnB1dFxuICAgKlxuICAgKiBAcmV0dXJucyBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD5cbiAgICovXG4gIHJlZ2lzdGVyKGlucHV0OiBFdmVudFJlZ2lzdHJhdGlvbklucHV0KTogRGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+IHtcbiAgICBpZiAodGhpcy5zY2VuZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nlc2l1bVNlcnZpY2UgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldCAtIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIG11c3QgYmUgaW5qZWN0ZWQgIHVuZGVyIGFjLW1hcCcpO1xuICAgIH1cblxuICAgIGlucHV0LnBpY2sgPSBpbnB1dC5waWNrIHx8IFBpY2tPcHRpb25zLk5PX1BJQ0s7XG4gICAgaW5wdXQucHJpb3JpdHkgPSBpbnB1dC5wcmlvcml0eSB8fCAwO1xuXG4gICAgaWYgKGlucHV0LmVudGl0eVR5cGUgJiYgaW5wdXQucGljayA9PT0gUGlja09wdGlvbnMuTk9fUElDSykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYXBFdmVudHNNYW5hZ2VyU2VydmljZTogY2FuXFwndCByZWdpc3RlciBhbiBldmVudCAnICtcbiAgICAgICAgJ3dpdGggZW50aXR5VHlwZSBhbmQgUGlja09wdGlvbnMuTk9fUElDSyAtIEl0IGRvZXNuXFwndCBtYWtlIHNlbnNlICcpO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50TmFtZSA9IENlc2l1bUV2ZW50QnVpbGRlci5nZXRFdmVudEZ1bGxOYW1lKGlucHV0LmV2ZW50LCBpbnB1dC5tb2RpZmllcik7XG5cbiAgICBpZiAoIXRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmhhcyhldmVudE5hbWUpKSB7XG4gICAgICB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5zZXQoZXZlbnROYW1lLCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRSZWdpc3RyYXRpb24gPSB0aGlzLmNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKFxuICAgICAgaW5wdXQuZXZlbnQsXG4gICAgICBpbnB1dC5tb2RpZmllcixcbiAgICAgIGlucHV0LmVudGl0eVR5cGUsXG4gICAgICBpbnB1dC5waWNrLFxuICAgICAgaW5wdXQucHJpb3JpdHksXG4gICAgICBpbnB1dC5waWNrRmlsdGVyKTtcbiAgICBjb25zdCByZWdpc3RyYXRpb25PYnNlcnZhYmxlOiBhbnkgPSBldmVudFJlZ2lzdHJhdGlvbi5vYnNlcnZhYmxlO1xuICAgIHJlZ2lzdHJhdGlvbk9ic2VydmFibGUuZGlzcG9zZSA9ICgpID0+IHRoaXMuZGlzcG9zZU9ic2VydmFibGUoZXZlbnRSZWdpc3RyYXRpb24sIGV2ZW50TmFtZSk7XG4gICAgdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSkucHVzaChldmVudFJlZ2lzdHJhdGlvbik7XG5cbiAgICB0aGlzLnNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWUpO1xuICAgIHJldHVybiA8RGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+PiByZWdpc3RyYXRpb25PYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwb3NlT2JzZXJ2YWJsZShldmVudFJlZ2lzdHJhdGlvbjogUmVnaXN0cmF0aW9uLCBldmVudE5hbWU6IHN0cmluZykge1xuICAgIGV2ZW50UmVnaXN0cmF0aW9uLnN0b3BwZXIubmV4dCgxKTtcbiAgICBjb25zdCByZWdpc3RyYXRpb25zID0gdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgY29uc3QgaW5kZXggPSByZWdpc3RyYXRpb25zLmluZGV4T2YoZXZlbnRSZWdpc3RyYXRpb24pO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHJlZ2lzdHJhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgdGhpcy5zb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVnaXN0cmF0aW9ucyA9IHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmdldChldmVudE5hbWUpO1xuICAgIHJlZ2lzdHJhdGlvbnMuc29ydCgoYSwgYikgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHkpO1xuICAgIGlmIChyZWdpc3RyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFjdGl2ZSByZWdpc3RyYXRpb25zIGJ5IHByaW9yaXR5XG4gICAgY29uc3QgY3VycmVudFByaW9yaXR5ID0gcmVnaXN0cmF0aW9uc1swXS5wcmlvcml0eTtcbiAgICByZWdpc3RyYXRpb25zLmZvckVhY2goKHJlZ2lzdHJhdGlvbikgPT4ge1xuICAgICAgcmVnaXN0cmF0aW9uLmlzUGF1c2VkID0gcmVnaXN0cmF0aW9uLnByaW9yaXR5IDwgY3VycmVudFByaW9yaXR5O1xuICAgIH0pO1xuXG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKGV2ZW50OiBDZXNpdW1FdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlUeXBlOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja09wdGlvbjogUGlja09wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrRmlsdGVyPzogKGFueSkgPT4gYm9vbGVhbik6IFJlZ2lzdHJhdGlvbiB7XG4gICAgY29uc3QgY2VzaXVtRXZlbnRPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KGV2ZW50LCBtb2RpZmllcik7XG4gICAgY29uc3Qgc3RvcHBlciA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IG5ldyBSZWdpc3RyYXRpb24odW5kZWZpbmVkLCBzdG9wcGVyLCBwcmlvcml0eSwgZmFsc2UpO1xuICAgIGxldCBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PjtcblxuICAgIGlmICghQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIuZHJhZ0V2ZW50cy5oYXMoZXZlbnQpKSB7XG4gICAgICBvYnNlcnZhYmxlID0gY2VzaXVtRXZlbnRPYnNlcnZhYmxlLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiAhcmVnaXN0cmF0aW9uLmlzUGF1c2VkKSxcbiAgICAgICAgbWFwKChtb3ZlbWVudCkgPT4gdGhpcy50cmlnZ2VyUGljayhtb3ZlbWVudCwgcGlja09wdGlvbikpLFxuICAgICAgICBmaWx0ZXIoKHJlc3VsdCkgPT4gcmVzdWx0LmNlc2l1bUVudGl0aWVzICE9PSBudWxsIHx8IGVudGl0eVR5cGUgPT09IHVuZGVmaW5lZCksXG4gICAgICAgIG1hcCgocGlja3NBbmRNb3ZlbWVudCkgPT4gdGhpcy5hZGRFbnRpdGllcyhwaWNrc0FuZE1vdmVtZW50LCBlbnRpdHlUeXBlLCBwaWNrT3B0aW9uLCBwaWNrRmlsdGVyKSksXG4gICAgICAgIGZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQuZW50aXRpZXMgIT09IG51bGwgfHwgKGVudGl0eVR5cGUgPT09IHVuZGVmaW5lZCAmJiAhcGlja0ZpbHRlcikpLFxuICAgICAgICBzd2l0Y2hNYXAoKGVudGl0aWVzQW5kTW92ZW1lbnQpID0+IHRoaXMucGxvbnRlcihlbnRpdGllc0FuZE1vdmVtZW50LCBwaWNrT3B0aW9uKSksXG4gICAgICAgIHRha2VVbnRpbChzdG9wcGVyKSwgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JzZXJ2YWJsZSA9IHRoaXMuY3JlYXRlRHJhZ0V2ZW50KGV2ZW50LCBtb2RpZmllciwgZW50aXR5VHlwZSwgcGlja09wdGlvbiwgcHJpb3JpdHksIHBpY2tGaWx0ZXIpLnBpcGUodGFrZVVudGlsKHN0b3BwZXIpKTtcbiAgICB9XG5cbiAgICByZWdpc3RyYXRpb24ub2JzZXJ2YWJsZSA9IG9ic2VydmFibGU7XG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRHJhZ0V2ZW50KGV2ZW50OiBDZXNpdW1FdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eVR5cGU6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja09wdGlvbjogUGlja09wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tGaWx0ZXI/OiAoYW55KSA9PiBib29sZWFuKTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGNvbnN0IHsgbW91c2VEb3duRXZlbnQsIG1vdXNlVXBFdmVudCB9ID0gQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIuZ2V0RHJhZ0V2ZW50VHlwZXMoZXZlbnQpO1xuXG4gICAgY29uc3QgbW91c2VVcE9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQobW91c2VVcEV2ZW50KTtcbiAgICBjb25zdCBtb3VzZU1vdmVPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KENlc2l1bUV2ZW50Lk1PVVNFX01PVkUpO1xuXG4gICAgY29uc3QgbW91c2VEb3duUmVnaXN0cmF0aW9uID0gdGhpcy5jcmVhdGVFdmVudFJlZ2lzdHJhdGlvbihtb3VzZURvd25FdmVudCwgbW9kaWZpZXIsIGVudGl0eVR5cGUsIHBpY2tPcHRpb24sIHByaW9yaXR5LCBwaWNrRmlsdGVyKTtcblxuICAgIGNvbnN0IGRyb3BTdWJqZWN0ID0gbmV3IFN1YmplY3Q8RXZlbnRSZXN1bHQ+KCk7XG4gICAgY29uc3QgZHJhZ09ic2VydmVyID0gbW91c2VEb3duUmVnaXN0cmF0aW9uLm9ic2VydmFibGUucGlwZShtZXJnZU1hcChlID0+IHtcbiAgICAgIGxldCBsYXN0TW92ZTogYW55ID0gbnVsbDtcbiAgICAgIGNvbnN0IGRyYWdTdGFydFBvc2l0aW9uWCA9IGUubW92ZW1lbnQuc3RhcnRQb3NpdGlvbi54O1xuICAgICAgY29uc3QgZHJhZ1N0YXJ0UG9zaXRpb25ZID0gZS5tb3ZlbWVudC5zdGFydFBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbW91c2VNb3ZlT2JzZXJ2YWJsZS5waXBlKG1hcCgobW92ZW1lbnQpID0+IHtcbiAgICAgICAgbGFzdE1vdmUgPSB7XG4gICAgICAgICAgbW92ZW1lbnQ6IHtcbiAgICAgICAgICAgIGRyb3A6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjoge1xuICAgICAgICAgICAgICB4OiBkcmFnU3RhcnRQb3NpdGlvblgsXG4gICAgICAgICAgICAgIHk6IGRyYWdTdGFydFBvc2l0aW9uWSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmRQb3NpdGlvbjogbW92ZW1lbnQuZW5kUG9zaXRpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbnRpdGllczogZS5lbnRpdGllcyxcbiAgICAgICAgICBjZXNpdW1FbnRpdGllczogZS5jZXNpdW1FbnRpdGllc1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbGFzdE1vdmU7XG4gICAgICB9KSwgdGFrZVVudGlsKG1vdXNlVXBPYnNlcnZhYmxlKSwgdGFwKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgIC8vIE9uIGNvbXBsZXRlXG4gICAgICAgIGlmIChsYXN0TW92ZSkge1xuICAgICAgICAgIGNvbnN0IGRyb3BFdmVudCA9IE9iamVjdC5hc3NpZ24oe30sIGxhc3RNb3ZlKTtcbiAgICAgICAgICBkcm9wRXZlbnQubW92ZW1lbnQuZHJvcCA9IHRydWU7XG4gICAgICAgICAgZHJvcFN1YmplY3QubmV4dChkcm9wRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KSwgKTtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gbWVyZ2UoZHJhZ09ic2VydmVyLCBkcm9wU3ViamVjdCk7XG5cbiAgfVxuXG4gIHByaXZhdGUgdHJpZ2dlclBpY2sobW92ZW1lbnQ6IGFueSwgcGlja09wdGlvbnM6IFBpY2tPcHRpb25zKSB7XG4gICAgbGV0IHBpY2tzOiBhbnkgPSBbXTtcbiAgICBzd2l0Y2ggKHBpY2tPcHRpb25zKSB7XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLlBJQ0tfT05FOlxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0FMTDpcbiAgICAgICAgcGlja3MgPSB0aGlzLnNjZW5lLmRyaWxsUGljayhtb3ZlbWVudC5lbmRQb3NpdGlvbik7XG4gICAgICAgIHBpY2tzID0gcGlja3MubGVuZ3RoID09PSAwID8gbnVsbCA6IHBpY2tzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuUElDS19GSVJTVDpcbiAgICAgICAgY29uc3QgcGljayA9IHRoaXMuc2NlbmUucGljayhtb3ZlbWVudC5lbmRQb3NpdGlvbik7XG4gICAgICAgIHBpY2tzID0gcGljayA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IFtwaWNrXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLk5PX1BJQ0s6XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gUGlja3MgY2FuIGJlIGNlc2l1bSBlbnRpdHkgb3IgY2VzaXVtIHByaW1pdGl2ZVxuICAgIGlmIChwaWNrcykge1xuICAgICAgcGlja3MgPSBwaWNrcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5pZCAmJiBwaWNrLmlkIGluc3RhbmNlb2YgQ2VzaXVtLkVudGl0eSA/IHBpY2suaWQgOiBwaWNrLnByaW1pdGl2ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbW92ZW1lbnQ6IG1vdmVtZW50LCBjZXNpdW1FbnRpdGllczogcGlja3MgfTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRW50aXRpZXMocGlja3NBbmRNb3ZlbWVudDogYW55LCBlbnRpdHlUeXBlOiBhbnksIHBpY2tPcHRpb246IFBpY2tPcHRpb25zLCBwaWNrRmlsdGVyPzogKGFueSkgPT4gYm9vbGVhbik6IEV2ZW50UmVzdWx0IHtcblxuICAgIGlmIChwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzID09PSBudWxsKSB7XG4gICAgICBwaWNrc0FuZE1vdmVtZW50LmVudGl0aWVzID0gbnVsbDtcbiAgICAgIHJldHVybiBwaWNrc0FuZE1vdmVtZW50O1xuICAgIH1cbiAgICBsZXQgZW50aXRpZXMgPSBbXTtcbiAgICBpZiAocGlja09wdGlvbiAhPT0gUGlja09wdGlvbnMuTk9fUElDSykge1xuICAgICAgaWYgKGVudGl0eVR5cGUpIHtcbiAgICAgICAgZW50aXRpZXMgPSBwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmFjRW50aXR5KS5maWx0ZXIoKGFjRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gYWNFbnRpdHkgJiYgYWNFbnRpdHkgaW5zdGFuY2VvZiBlbnRpdHlUeXBlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudGl0aWVzID0gcGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5hY0VudGl0eSk7XG4gICAgICB9XG5cbiAgICAgIGVudGl0aWVzID0gVXRpbHNTZXJ2aWNlLnVuaXF1ZShlbnRpdGllcyk7XG4gICAgICBlbnRpdGllcyA9IChwaWNrRmlsdGVyICYmIGVudGl0aWVzKSA/IGVudGl0aWVzLmZpbHRlcihwaWNrRmlsdGVyKSA6IGVudGl0aWVzO1xuICAgICAgaWYgKGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBlbnRpdGllcyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGlja3NBbmRNb3ZlbWVudC5lbnRpdGllcyA9IGVudGl0aWVzO1xuXG4gICAgcmV0dXJuIHBpY2tzQW5kTW92ZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIHBsb250ZXIoZW50aXRpZXNBbmRNb3ZlbWVudDogRXZlbnRSZXN1bHQsIHBpY2tPcHRpb246IFBpY2tPcHRpb25zKTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGlmIChwaWNrT3B0aW9uID09PSBQaWNrT3B0aW9ucy5QSUNLX09ORSAmJiBlbnRpdGllc0FuZE1vdmVtZW50LmVudGl0aWVzICE9PSBudWxsICYmIGVudGl0aWVzQW5kTW92ZW1lbnQuZW50aXRpZXMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckl0KGVudGl0aWVzQW5kTW92ZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGVudGl0aWVzQW5kTW92ZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuIl19