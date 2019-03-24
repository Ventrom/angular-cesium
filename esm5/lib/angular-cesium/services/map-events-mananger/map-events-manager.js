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
var Registration = /** @class */ (function () {
    function Registration(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
    return Registration;
}());
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
var MapEventsManagerService = /** @class */ (function () {
    function MapEventsManagerService(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    /**
     * @return {?}
     */
    MapEventsManagerService.prototype.init = /**
     * @return {?}
     */
    function () {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    };
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    MapEventsManagerService.prototype.register = /**
     * Register to map event
     * @param {?} input Event Registration Input
     *
     * @return {?} DisposableObservable<EventResult>
     */
    function (input) {
        var _this = this;
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
        var eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        /** @type {?} */
        var eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority, input.pickFilter);
        /** @type {?} */
        var registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = (/**
         * @return {?}
         */
        function () { return _this.disposeObservable(eventRegistration, eventName); });
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return (/** @type {?} */ (registrationObservable));
    };
    /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    MapEventsManagerService.prototype.disposeObservable = /**
     * @private
     * @param {?} eventRegistration
     * @param {?} eventName
     * @return {?}
     */
    function (eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        /** @type {?} */
        var registrations = this.eventRegistrations.get(eventName);
        /** @type {?} */
        var index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    };
    /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    MapEventsManagerService.prototype.sortRegistrationsByPriority = /**
     * @private
     * @param {?} eventName
     * @return {?}
     */
    function (eventName) {
        /** @type {?} */
        var registrations = this.eventRegistrations.get(eventName);
        registrations.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return b.priority - a.priority; }));
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        /** @type {?} */
        var currentPriority = registrations[0].priority;
        registrations.forEach((/**
         * @param {?} registration
         * @return {?}
         */
        function (registration) {
            registration.isPaused = registration.priority < currentPriority;
        }));
    };
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
    MapEventsManagerService.prototype.createEventRegistration = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    function (event, modifier, entityType, pickOption, priority, pickFilter) {
        var _this = this;
        /** @type {?} */
        var cesiumEventObservable = this.eventBuilder.get(event, modifier);
        /** @type {?} */
        var stopper = new Subject();
        /** @type {?} */
        var registration = new Registration(undefined, stopper, priority, false);
        /** @type {?} */
        var observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter((/**
             * @return {?}
             */
            function () { return !registration.isPaused; })), map((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) { return _this.triggerPick(movement, pickOption); })), filter((/**
             * @param {?} result
             * @return {?}
             */
            function (result) { return result.cesiumEntities !== null || entityType === undefined; })), map((/**
             * @param {?} picksAndMovement
             * @return {?}
             */
            function (picksAndMovement) { return _this.addEntities(picksAndMovement, entityType, pickOption, pickFilter); })), filter((/**
             * @param {?} result
             * @return {?}
             */
            function (result) { return result.entities !== null || (entityType === undefined && !pickFilter); })), switchMap((/**
             * @param {?} entitiesAndMovement
             * @return {?}
             */
            function (entitiesAndMovement) { return _this.plonter(entitiesAndMovement, pickOption); })), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent(event, modifier, entityType, pickOption, priority, pickFilter).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    };
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
    MapEventsManagerService.prototype.createDragEvent = /**
     * @private
     * @param {?} event
     * @param {?} modifier
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?} priority
     * @param {?=} pickFilter
     * @return {?}
     */
    function (event, modifier, entityType, pickOption, priority, pickFilter) {
        var _a = CesiumDragDropHelper.getDragEventTypes(event), mouseDownEvent = _a.mouseDownEvent, mouseUpEvent = _a.mouseUpEvent;
        /** @type {?} */
        var mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        /** @type {?} */
        var mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        /** @type {?} */
        var mouseDownRegistration = this.createEventRegistration(mouseDownEvent, modifier, entityType, pickOption, priority, pickFilter);
        /** @type {?} */
        var dropSubject = new Subject();
        /** @type {?} */
        var dragObserver = mouseDownRegistration.observable.pipe(mergeMap((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            /** @type {?} */
            var lastMove = null;
            /** @type {?} */
            var dragStartPositionX = e.movement.startPosition.x;
            /** @type {?} */
            var dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((/**
             * @param {?} movement
             * @return {?}
             */
            function (movement) {
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
            function () {
                // On complete
                if (lastMove) {
                    /** @type {?} */
                    var dropEvent = Object.assign({}, lastMove);
                    dropEvent.movement.drop = true;
                    dropSubject.next(dropEvent);
                }
            })));
        })));
        return merge(dragObserver, dropSubject);
    };
    /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    MapEventsManagerService.prototype.triggerPick = /**
     * @private
     * @param {?} movement
     * @param {?} pickOptions
     * @return {?}
     */
    function (movement, pickOptions) {
        /** @type {?} */
        var picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                /** @type {?} */
                var pick = this.scene.pick(movement.endPosition);
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
            function (pick) { return pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive; }));
        }
        return { movement: movement, cesiumEntities: picks };
    };
    /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    MapEventsManagerService.prototype.addEntities = /**
     * @private
     * @param {?} picksAndMovement
     * @param {?} entityType
     * @param {?} pickOption
     * @param {?=} pickFilter
     * @return {?}
     */
    function (picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        /** @type {?} */
        var entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                function (pick) { return pick.acEntity; })).filter((/**
                 * @param {?} acEntity
                 * @return {?}
                 */
                function (acEntity) {
                    return acEntity && acEntity instanceof entityType;
                }));
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((/**
                 * @param {?} pick
                 * @return {?}
                 */
                function (pick) { return pick.acEntity; }));
            }
            entities = UtilsService.unique(entities);
            entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
            if (entities.length === 0) {
                entities = null;
            }
        }
        picksAndMovement.entities = entities;
        return picksAndMovement;
    };
    /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    MapEventsManagerService.prototype.plonter = /**
     * @private
     * @param {?} entitiesAndMovement
     * @param {?} pickOption
     * @return {?}
     */
    function (entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return observableOf(entitiesAndMovement);
        }
    };
    MapEventsManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapEventsManagerService.ctorParameters = function () { return [
        { type: CesiumService },
        { type: CesiumEventBuilder },
        { type: PlonterService }
    ]; };
    return MapEventsManagerService;
}());
export { MapEventsManagerService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRWpGO0lBQ0Usc0JBQW1CLFVBQW1DLEVBQ2xDLE9BQXFCLEVBQ3JCLFFBQWdCLEVBQ2hCLFFBQWlCO1FBSGxCLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQ3JDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFO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QXdDOzs7OztJQUN4QyxpREFBc0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IGZpbHRlciwgbWFwLCBtZXJnZU1hcCwgc3dpdGNoTWFwLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRCdWlsZGVyIH0gZnJvbSAnLi9jZXNpdW0tZXZlbnQtYnVpbGRlcic7XG5pbXBvcnQgeyBFdmVudFJlZ2lzdHJhdGlvbklucHV0IH0gZnJvbSAnLi9ldmVudC1yZWdpc3RyYXRpb24taW5wdXQnO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4vY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudE1vZGlmaWVyIH0gZnJvbSAnLi9jb25zdHMvY2VzaXVtLWV2ZW50LW1vZGlmaWVyLmVudW0nO1xuaW1wb3J0IHsgUGxvbnRlclNlcnZpY2UgfSBmcm9tICcuLi9wbG9udGVyL3Bsb250ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBVdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bURyYWdEcm9wSGVscGVyIH0gZnJvbSAnLi9ldmVudC1vYnNlcnZlcnMvY2VzaXVtLWRyYWctZHJvcC1oZWxwZXInO1xuXG5jbGFzcyBSZWdpc3RyYXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4sXG4gICAgICAgICAgICAgIHB1YmxpYyAgc3RvcHBlcjogU3ViamVjdDxhbnk+LFxuICAgICAgICAgICAgICBwdWJsaWMgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyAgaXNQYXVzZWQ6IGJvb2xlYW4pIHtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgc2NyZWVuIHBvc2l0aW9uLCBkcmFnIGJvb2xlYW4gZm9yIGRyYWcgZXZlbnRzIG9ubHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb3ZlbWVudCB7XG4gIHN0YXJ0UG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgZW5kUG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcbiAgZHJvcD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRSZXN1bHQge1xuICBtb3ZlbWVudDogTW92ZW1lbnQ7XG4gIGNlc2l1bUVudGl0aWVzOiBhbnlbXTtcbiAgZW50aXRpZXM6IGFueVtdO1xufVxuXG4vKipcbiAqIE1hbmFnZXMgYWxsIG1hcCBldmVudHMuIE5vdGljZSBldmVudHMgd2lsbCBydW4gb3V0c2lkZSBvZiBBbmd1bGFyIHpvbmUuXG4gKiBQcm92aWRlZCBieSBgPGFjLW1hcC8+YCBjb21wb25lbnQgdGhlcmUgZm9yIGNvdWxkIGJlIGluamVjdGVkIGF0IGFueSBjb21wb25lbnQgdW5kZXIgYDxhYy1tYXAvPmAgaGllcmFyY2h5XG4gKiBvciBmcm9tIHRoZSBgPGFjLW1hcC8+YCBjb21wb25lbnQgcmVmZXJlbmNlIGBhY01hcENvbXBvbmVudC5nZXRNYXBFdmVudHNNYW5hZ2VyKClgXG4gKlxuICogX191c2FnZTpfX1xuICogYGBgXG4gKiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZS5yZWdpc3Rlcih7ZXZlbnQsIG1vZGlmaWVyLCBwcmlvcml0eSwgZW50aXR5VHlwZSwgcGlja09wdGlvbn0pLnN1YnNjcmliZSgpXG4gKiBgYGBcbiAqIF9fcGFyYW06X18ge0Nlc2l1bUV2ZW50fSBldmVudFxuICogX19wYXJhbTpfXyB7Q2VzaXVtRXZlbnRNb2RpZmllcn0gbW9kaWZpZXJcbiAqIF9fcGFyYW06X18gcHJpb3JpdHkgLSB0aGUgYmlnZ2VyIHRoZSBudW1iZXIgdGhlIGJpZ2dlciB0aGUgcHJpb3JpdHkuIGRlZmF1bHQgOiAwLlxuICogX19wYXJhbTpfXyBlbnRpdHlUeXBlIC0gZW50aXR5IHR5cGUgY2xhc3MgdGhhdCB5b3UgYXJlIGludGVyZXN0ZWQgbGlrZSAoVHJhY2spLiB0aGUgY2xhc3MgbXVzdCBleHRlbmRzIEFjRW50aXR5XG4gKiBfX3BhcmFtOl9fIHBpY2tPcHRpb24gLSBzZWxmIGV4cGxhaW5lZFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xuXG4gIHByaXZhdGUgc2NlbmU6IGFueTtcbiAgcHJpdmF0ZSBldmVudFJlZ2lzdHJhdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgUmVnaXN0cmF0aW9uW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGV2ZW50QnVpbGRlcjogQ2VzaXVtRXZlbnRCdWlsZGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHBsb250ZXJTZXJ2aWNlOiBQbG9udGVyU2VydmljZSkge1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmV2ZW50QnVpbGRlci5pbml0KCk7XG4gICAgdGhpcy5zY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRvIG1hcCBldmVudFxuICAgKiBAcGFyYW0gaW5wdXQgRXZlbnQgUmVnaXN0cmF0aW9uIElucHV0XG4gICAqXG4gICAqIEByZXR1cm5zIERpc3Bvc2FibGVPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PlxuICAgKi9cbiAgcmVnaXN0ZXIoaW5wdXQ6IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQpOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGlmICh0aGlzLnNjZW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2VzaXVtU2VydmljZSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgeWV0IC0gTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgbXVzdCBiZSBpbmplY3RlZCAgdW5kZXIgYWMtbWFwJyk7XG4gICAgfVxuXG4gICAgaW5wdXQucGljayA9IGlucHV0LnBpY2sgfHwgUGlja09wdGlvbnMuTk9fUElDSztcbiAgICBpbnB1dC5wcmlvcml0eSA9IGlucHV0LnByaW9yaXR5IHx8IDA7XG5cbiAgICBpZiAoaW5wdXQuZW50aXR5VHlwZSAmJiBpbnB1dC5waWNrID09PSBQaWNrT3B0aW9ucy5OT19QSUNLKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hcEV2ZW50c01hbmFnZXJTZXJ2aWNlOiBjYW5cXCd0IHJlZ2lzdGVyIGFuIGV2ZW50ICcgK1xuICAgICAgICAnd2l0aCBlbnRpdHlUeXBlIGFuZCBQaWNrT3B0aW9ucy5OT19QSUNLIC0gSXQgZG9lc25cXCd0IG1ha2Ugc2Vuc2UgJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnROYW1lID0gQ2VzaXVtRXZlbnRCdWlsZGVyLmdldEV2ZW50RnVsbE5hbWUoaW5wdXQuZXZlbnQsIGlucHV0Lm1vZGlmaWVyKTtcblxuICAgIGlmICghdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuaGFzKGV2ZW50TmFtZSkpIHtcbiAgICAgIHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLnNldChldmVudE5hbWUsIFtdKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudFJlZ2lzdHJhdGlvbiA9IHRoaXMuY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oXG4gICAgICBpbnB1dC5ldmVudCxcbiAgICAgIGlucHV0Lm1vZGlmaWVyLFxuICAgICAgaW5wdXQuZW50aXR5VHlwZSxcbiAgICAgIGlucHV0LnBpY2ssXG4gICAgICBpbnB1dC5wcmlvcml0eSxcbiAgICAgIGlucHV0LnBpY2tGaWx0ZXIpO1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk9ic2VydmFibGU6IGFueSA9IGV2ZW50UmVnaXN0cmF0aW9uLm9ic2VydmFibGU7XG4gICAgcmVnaXN0cmF0aW9uT2JzZXJ2YWJsZS5kaXNwb3NlID0gKCkgPT4gdGhpcy5kaXNwb3NlT2JzZXJ2YWJsZShldmVudFJlZ2lzdHJhdGlvbiwgZXZlbnROYW1lKTtcbiAgICB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5nZXQoZXZlbnROYW1lKS5wdXNoKGV2ZW50UmVnaXN0cmF0aW9uKTtcblxuICAgIHRoaXMuc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZSk7XG4gICAgcmV0dXJuIDxEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4+IHJlZ2lzdHJhdGlvbk9ic2VydmFibGU7XG4gIH1cblxuICBwcml2YXRlIGRpc3Bvc2VPYnNlcnZhYmxlKGV2ZW50UmVnaXN0cmF0aW9uOiBSZWdpc3RyYXRpb24sIGV2ZW50TmFtZTogc3RyaW5nKSB7XG4gICAgZXZlbnRSZWdpc3RyYXRpb24uc3RvcHBlci5uZXh0KDEpO1xuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbnMgPSB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5nZXQoZXZlbnROYW1lKTtcbiAgICBjb25zdCBpbmRleCA9IHJlZ2lzdHJhdGlvbnMuaW5kZXhPZihldmVudFJlZ2lzdHJhdGlvbik7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcmVnaXN0cmF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICB0aGlzLnNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBzb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWdpc3RyYXRpb25zID0gdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgcmVnaXN0cmF0aW9ucy5zb3J0KChhLCBiKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSk7XG4gICAgaWYgKHJlZ2lzdHJhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQWN0aXZlIHJlZ2lzdHJhdGlvbnMgYnkgcHJpb3JpdHlcbiAgICBjb25zdCBjdXJyZW50UHJpb3JpdHkgPSByZWdpc3RyYXRpb25zWzBdLnByaW9yaXR5O1xuICAgIHJlZ2lzdHJhdGlvbnMuZm9yRWFjaCgocmVnaXN0cmF0aW9uKSA9PiB7XG4gICAgICByZWdpc3RyYXRpb24uaXNQYXVzZWQgPSByZWdpc3RyYXRpb24ucHJpb3JpdHkgPCBjdXJyZW50UHJpb3JpdHk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oZXZlbnQ6IENlc2l1bUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eVR5cGU6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrT3B0aW9uOiBQaWNrT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tGaWx0ZXI/OiAoYW55KSA9PiBib29sZWFuKTogUmVnaXN0cmF0aW9uIHtcbiAgICBjb25zdCBjZXNpdW1FdmVudE9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQoZXZlbnQsIG1vZGlmaWVyKTtcbiAgICBjb25zdCBzdG9wcGVyID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uID0gbmV3IFJlZ2lzdHJhdGlvbih1bmRlZmluZWQsIHN0b3BwZXIsIHByaW9yaXR5LCBmYWxzZSk7XG4gICAgbGV0IG9ic2VydmFibGU6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+O1xuXG4gICAgaWYgKCFDZXNpdW1EcmFnRHJvcEhlbHBlci5kcmFnRXZlbnRzLmhhcyhldmVudCkpIHtcbiAgICAgIG9ic2VydmFibGUgPSBjZXNpdW1FdmVudE9ic2VydmFibGUucGlwZShcbiAgICAgICAgZmlsdGVyKCgpID0+ICFyZWdpc3RyYXRpb24uaXNQYXVzZWQpLFxuICAgICAgICBtYXAoKG1vdmVtZW50KSA9PiB0aGlzLnRyaWdnZXJQaWNrKG1vdmVtZW50LCBwaWNrT3B0aW9uKSksXG4gICAgICAgIGZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQuY2VzaXVtRW50aXRpZXMgIT09IG51bGwgfHwgZW50aXR5VHlwZSA9PT0gdW5kZWZpbmVkKSxcbiAgICAgICAgbWFwKChwaWNrc0FuZE1vdmVtZW50KSA9PiB0aGlzLmFkZEVudGl0aWVzKHBpY2tzQW5kTW92ZW1lbnQsIGVudGl0eVR5cGUsIHBpY2tPcHRpb24sIHBpY2tGaWx0ZXIpKSxcbiAgICAgICAgZmlsdGVyKChyZXN1bHQpID0+IHJlc3VsdC5lbnRpdGllcyAhPT0gbnVsbCB8fCAoZW50aXR5VHlwZSA9PT0gdW5kZWZpbmVkICYmICFwaWNrRmlsdGVyKSksXG4gICAgICAgIHN3aXRjaE1hcCgoZW50aXRpZXNBbmRNb3ZlbWVudCkgPT4gdGhpcy5wbG9udGVyKGVudGl0aWVzQW5kTW92ZW1lbnQsIHBpY2tPcHRpb24pKSxcbiAgICAgICAgdGFrZVVudGlsKHN0b3BwZXIpLCApO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYnNlcnZhYmxlID0gdGhpcy5jcmVhdGVEcmFnRXZlbnQoZXZlbnQsIG1vZGlmaWVyLCBlbnRpdHlUeXBlLCBwaWNrT3B0aW9uLCBwcmlvcml0eSwgcGlja0ZpbHRlcikucGlwZSh0YWtlVW50aWwoc3RvcHBlcikpO1xuICAgIH1cblxuICAgIHJlZ2lzdHJhdGlvbi5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZTtcbiAgICByZXR1cm4gcmVnaXN0cmF0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEcmFnRXZlbnQoZXZlbnQ6IENlc2l1bUV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5VHlwZTogYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrT3B0aW9uOiBQaWNrT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0ZpbHRlcj86IChhbnkpID0+IGJvb2xlYW4pOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PiB7XG4gICAgY29uc3QgeyBtb3VzZURvd25FdmVudCwgbW91c2VVcEV2ZW50IH0gPSBDZXNpdW1EcmFnRHJvcEhlbHBlci5nZXREcmFnRXZlbnRUeXBlcyhldmVudCk7XG5cbiAgICBjb25zdCBtb3VzZVVwT2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRCdWlsZGVyLmdldChtb3VzZVVwRXZlbnQpO1xuICAgIGNvbnN0IG1vdXNlTW92ZU9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQoQ2VzaXVtRXZlbnQuTU9VU0VfTU9WRSk7XG5cbiAgICBjb25zdCBtb3VzZURvd25SZWdpc3RyYXRpb24gPSB0aGlzLmNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKG1vdXNlRG93bkV2ZW50LCBtb2RpZmllciwgZW50aXR5VHlwZSwgcGlja09wdGlvbiwgcHJpb3JpdHksIHBpY2tGaWx0ZXIpO1xuXG4gICAgY29uc3QgZHJvcFN1YmplY3QgPSBuZXcgU3ViamVjdDxFdmVudFJlc3VsdD4oKTtcbiAgICBjb25zdCBkcmFnT2JzZXJ2ZXIgPSBtb3VzZURvd25SZWdpc3RyYXRpb24ub2JzZXJ2YWJsZS5waXBlKG1lcmdlTWFwKGUgPT4ge1xuICAgICAgbGV0IGxhc3RNb3ZlOiBhbnkgPSBudWxsO1xuICAgICAgY29uc3QgZHJhZ1N0YXJ0UG9zaXRpb25YID0gZS5tb3ZlbWVudC5zdGFydFBvc2l0aW9uLng7XG4gICAgICBjb25zdCBkcmFnU3RhcnRQb3NpdGlvblkgPSBlLm1vdmVtZW50LnN0YXJ0UG9zaXRpb24ueTtcbiAgICAgIHJldHVybiBtb3VzZU1vdmVPYnNlcnZhYmxlLnBpcGUobWFwKChtb3ZlbWVudCkgPT4ge1xuICAgICAgICBsYXN0TW92ZSA9IHtcbiAgICAgICAgICBtb3ZlbWVudDoge1xuICAgICAgICAgICAgZHJvcDogZmFsc2UsXG4gICAgICAgICAgICBzdGFydFBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcbiAgICAgICAgICAgICAgeTogZHJhZ1N0YXJ0UG9zaXRpb25ZLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uOiBtb3ZlbWVudC5lbmRQb3NpdGlvbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVudGl0aWVzOiBlLmVudGl0aWVzLFxuICAgICAgICAgIGNlc2l1bUVudGl0aWVzOiBlLmNlc2l1bUVudGl0aWVzXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsYXN0TW92ZTtcbiAgICAgIH0pLCB0YWtlVW50aWwobW91c2VVcE9ic2VydmFibGUpLCB0YXAodW5kZWZpbmVkLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgLy8gT24gY29tcGxldGVcbiAgICAgICAgaWYgKGxhc3RNb3ZlKSB7XG4gICAgICAgICAgY29uc3QgZHJvcEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgbGFzdE1vdmUpO1xuICAgICAgICAgIGRyb3BFdmVudC5tb3ZlbWVudC5kcm9wID0gdHJ1ZTtcbiAgICAgICAgICBkcm9wU3ViamVjdC5uZXh0KGRyb3BFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pLCApO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBtZXJnZShkcmFnT2JzZXJ2ZXIsIGRyb3BTdWJqZWN0KTtcblxuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUGljayhtb3ZlbWVudDogYW55LCBwaWNrT3B0aW9uczogUGlja09wdGlvbnMpIHtcbiAgICBsZXQgcGlja3M6IGFueSA9IFtdO1xuICAgIHN3aXRjaCAocGlja09wdGlvbnMpIHtcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuUElDS19PTkU6XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLlBJQ0tfQUxMOlxuICAgICAgICBwaWNrcyA9IHRoaXMuc2NlbmUuZHJpbGxQaWNrKG1vdmVtZW50LmVuZFBvc2l0aW9uKTtcbiAgICAgICAgcGlja3MgPSBwaWNrcy5sZW5ndGggPT09IDAgPyBudWxsIDogcGlja3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNUOlxuICAgICAgICBjb25zdCBwaWNrID0gdGhpcy5zY2VuZS5waWNrKG1vdmVtZW50LmVuZFBvc2l0aW9uKTtcbiAgICAgICAgcGlja3MgPSBwaWNrID09PSB1bmRlZmluZWQgPyBudWxsIDogW3BpY2tdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuTk9fUElDSzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBQaWNrcyBjYW4gYmUgY2VzaXVtIGVudGl0eSBvciBjZXNpdW0gcHJpbWl0aXZlXG4gICAgaWYgKHBpY2tzKSB7XG4gICAgICBwaWNrcyA9IHBpY2tzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmlkICYmIHBpY2suaWQgaW5zdGFuY2VvZiBDZXNpdW0uRW50aXR5ID8gcGljay5pZCA6IHBpY2sucHJpbWl0aXZlKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBtb3ZlbWVudDogbW92ZW1lbnQsIGNlc2l1bUVudGl0aWVzOiBwaWNrcyB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRFbnRpdGllcyhwaWNrc0FuZE1vdmVtZW50OiBhbnksIGVudGl0eVR5cGU6IGFueSwgcGlja09wdGlvbjogUGlja09wdGlvbnMsIHBpY2tGaWx0ZXI/OiAoYW55KSA9PiBib29sZWFuKTogRXZlbnRSZXN1bHQge1xuXG4gICAgaWYgKHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMgPT09IG51bGwpIHtcbiAgICAgIHBpY2tzQW5kTW92ZW1lbnQuZW50aXRpZXMgPSBudWxsO1xuICAgICAgcmV0dXJuIHBpY2tzQW5kTW92ZW1lbnQ7XG4gICAgfVxuICAgIGxldCBlbnRpdGllcyA9IFtdO1xuICAgIGlmIChwaWNrT3B0aW9uICE9PSBQaWNrT3B0aW9ucy5OT19QSUNLKSB7XG4gICAgICBpZiAoZW50aXR5VHlwZSkge1xuICAgICAgICBlbnRpdGllcyA9IHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMubWFwKChwaWNrOiBhbnkpID0+IHBpY2suYWNFbnRpdHkpLmZpbHRlcigoYWNFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgIHJldHVybiBhY0VudGl0eSAmJiBhY0VudGl0eSBpbnN0YW5jZW9mIGVudGl0eVR5cGU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXRpZXMgPSBwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmFjRW50aXR5KTtcbiAgICAgIH1cblxuICAgICAgZW50aXRpZXMgPSBVdGlsc1NlcnZpY2UudW5pcXVlKGVudGl0aWVzKTtcbiAgICAgIGVudGl0aWVzID0gKHBpY2tGaWx0ZXIgJiYgZW50aXRpZXMpID8gZW50aXRpZXMuZmlsdGVyKHBpY2tGaWx0ZXIpIDogZW50aXRpZXM7XG4gICAgICBpZiAoZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGVudGl0aWVzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwaWNrc0FuZE1vdmVtZW50LmVudGl0aWVzID0gZW50aXRpZXM7XG5cbiAgICByZXR1cm4gcGlja3NBbmRNb3ZlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgcGxvbnRlcihlbnRpdGllc0FuZE1vdmVtZW50OiBFdmVudFJlc3VsdCwgcGlja09wdGlvbjogUGlja09wdGlvbnMpOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PiB7XG4gICAgaWYgKHBpY2tPcHRpb24gPT09IFBpY2tPcHRpb25zLlBJQ0tfT05FICYmIGVudGl0aWVzQW5kTW92ZW1lbnQuZW50aXRpZXMgIT09IG51bGwgJiYgZW50aXRpZXNBbmRNb3ZlbWVudC5lbnRpdGllcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVySXQoZW50aXRpZXNBbmRNb3ZlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoZW50aXRpZXNBbmRNb3ZlbWVudCk7XG4gICAgfVxuICB9XG59XG4iXX0=