import { __decorate, __metadata } from "tslib";
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
    MapEventsManagerService.prototype.init = function () {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    };
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    MapEventsManagerService.prototype.register = function (input) {
        var _this = this;
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
        var eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        var eventRegistration = this.createEventRegistration(input);
        var registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = function () { return _this.disposeObservable(eventRegistration, eventName); };
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return registrationObservable;
    };
    MapEventsManagerService.prototype.disposeObservable = function (eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        var registrations = this.eventRegistrations.get(eventName);
        var index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    };
    MapEventsManagerService.prototype.sortRegistrationsByPriority = function (eventName) {
        var registrations = this.eventRegistrations.get(eventName);
        registrations.sort(function (a, b) { return b.priority - a.priority; });
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        var currentPriority = registrations[0].priority;
        registrations.forEach(function (registration) {
            registration.isPaused = registration.priority < currentPriority;
        });
    };
    MapEventsManagerService.prototype.createEventRegistration = function (_a) {
        var _this = this;
        var event = _a.event, modifier = _a.modifier, entityType = _a.entityType, pickOption = _a.pick, priority = _a.priority, pickFilter = _a.pickFilter, pickConfig = _a.pickConfig;
        var cesiumEventObservable = this.eventBuilder.get(event, modifier);
        var stopper = new Subject();
        var registration = new Registration(undefined, stopper, priority, false);
        var observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter(function () { return !registration.isPaused; }), map(function (movement) { return _this.triggerPick(movement, pickOption, pickConfig); }), filter(function (result) { return result.cesiumEntities !== null || entityType === undefined; }), map(function (picksAndMovement) { return _this.addEntities(picksAndMovement, entityType, pickOption, pickFilter); }), filter(function (result) { return result.entities !== null || (entityType === undefined && !pickFilter); }), switchMap(function (entitiesAndMovement) { return _this.plonter(entitiesAndMovement, pickOption); }), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent({
                event: event,
                modifier: modifier,
                entityType: entityType,
                pick: pickOption,
                priority: priority,
                pickFilter: pickFilter,
                pickConfig: pickConfig
            }).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    };
    MapEventsManagerService.prototype.createDragEvent = function (_a) {
        var event = _a.event, modifier = _a.modifier, entityType = _a.entityType, pickOption = _a.pick, priority = _a.priority, pickFilter = _a.pickFilter, pickConfig = _a.pickConfig;
        var _b = CesiumDragDropHelper.getDragEventTypes(event), mouseDownEvent = _b.mouseDownEvent, mouseUpEvent = _b.mouseUpEvent;
        var mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        var mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        var mouseDownRegistration = this.createEventRegistration({
            event: mouseDownEvent,
            modifier: modifier,
            entityType: entityType,
            pick: pickOption,
            priority: priority,
            pickFilter: pickFilter,
            pickConfig: pickConfig,
        });
        var dropSubject = new Subject();
        var dragObserver = mouseDownRegistration.observable.pipe(mergeMap(function (e) {
            var lastMove = null;
            var dragStartPositionX = e.movement.startPosition.x;
            var dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map(function (movement) {
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
                complete: function () {
                    // On complete
                    if (lastMove) {
                        var dropEvent = Object.assign({}, lastMove);
                        dropEvent.movement.drop = true;
                        dropSubject.next(dropEvent);
                    }
                }
            }));
        }));
        return merge(dragObserver, dropSubject);
    };
    MapEventsManagerService.prototype.triggerPick = function (movement, pickOptions, pickConfig) {
        var picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition, pickConfig.drillPickLimit, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                var pick = this.scene.pick(movement.endPosition, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map(function (pick) { return pick.id && pick.id instanceof Cesium.Entity ? pick.id : pick.primitive; });
        }
        return { movement: movement, cesiumEntities: picks };
    };
    MapEventsManagerService.prototype.addEntities = function (picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        var entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map(function (pick) { return pick.acEntity; }).filter(function (acEntity) {
                    return acEntity && acEntity instanceof entityType;
                });
            }
            else {
                entities = picksAndMovement.cesiumEntities.map(function (pick) { return pick.acEntity; });
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
    MapEventsManagerService.prototype.plonter = function (entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return observableOf(entitiesAndMovement);
        }
    };
    MapEventsManagerService.ctorParameters = function () { return [
        { type: CesiumService },
        { type: CesiumEventBuilder },
        { type: PlonterService }
    ]; };
    MapEventsManagerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService,
            CesiumEventBuilder,
            PlonterService])
    ], MapEventsManagerService);
    return MapEventsManagerService;
}());
export { MapEventsManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQWMsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRWpGO0lBQ0Usc0JBQW1CLFVBQW1DLEVBQ2xDLE9BQXFCLEVBQ3JCLFFBQWdCLEVBQ2hCLFFBQWlCO1FBSGxCLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQ3JDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFORCxJ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Yzs7SUFQdkMsdUJBQXVCO1FBRG5DLFVBQVUsRUFBRTt5Q0FNd0IsYUFBYTtZQUNkLGtCQUFrQjtZQUNoQixjQUFjO09BUHZDLHVCQUF1QixDQTJPbkM7SUFBRCw4QkFBQztDQUFBLEFBM09ELElBMk9DO1NBM09ZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgZmlsdGVyLCBtYXAsIG1lcmdlTWFwLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcbmltcG9ydCB7IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQsIFBpY2tDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9ldmVudC1yZWdpc3RyYXRpb24taW5wdXQnO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4vY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFV0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIgfSBmcm9tICcuL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tZHJhZy1kcm9wLWhlbHBlcic7XG5cbmNsYXNzIFJlZ2lzdHJhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PixcbiAgICAgICAgICAgICAgcHVibGljICBzdG9wcGVyOiBTdWJqZWN0PGFueT4sXG4gICAgICAgICAgICAgIHB1YmxpYyAgcHJpb3JpdHk6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljICBpc1BhdXNlZDogYm9vbGVhbikge1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBzY3JlZW4gcG9zaXRpb24sIGRyYWcgYm9vbGVhbiBmb3IgZHJhZyBldmVudHMgb25seVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1vdmVtZW50IHtcbiAgc3RhcnRQb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9O1xuICBlbmRQb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9O1xuICBkcm9wPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFdmVudFJlc3VsdCB7XG4gIG1vdmVtZW50OiBNb3ZlbWVudDtcbiAgY2VzaXVtRW50aXRpZXM6IGFueVtdO1xuICBlbnRpdGllczogYW55W107XG59XG5cbi8qKlxuICogTWFuYWdlcyBhbGwgbWFwIGV2ZW50cy4gTm90aWNlIGV2ZW50cyB3aWxsIHJ1biBvdXRzaWRlIG9mIEFuZ3VsYXIgem9uZS5cbiAqIFByb3ZpZGVkIGJ5IGA8YWMtbWFwLz5gIGNvbXBvbmVudCB0aGVyZSBmb3IgY291bGQgYmUgaW5qZWN0ZWQgYXQgYW55IGNvbXBvbmVudCB1bmRlciBgPGFjLW1hcC8+YCBoaWVyYXJjaHlcbiAqIG9yIGZyb20gdGhlIGA8YWMtbWFwLz5gIGNvbXBvbmVudCByZWZlcmVuY2UgYGFjTWFwQ29tcG9uZW50LmdldE1hcEV2ZW50c01hbmFnZXIoKWBcbiAqXG4gKiBfX3VzYWdlOl9fXG4gKiBgYGBcbiAqIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLnJlZ2lzdGVyKHtldmVudCwgbW9kaWZpZXIsIHByaW9yaXR5LCBlbnRpdHlUeXBlLCBwaWNrT3B0aW9ufSkuc3Vic2NyaWJlKClcbiAqIGBgYFxuICogX19wYXJhbTpfXyB7Q2VzaXVtRXZlbnR9IGV2ZW50XG4gKiBfX3BhcmFtOl9fIHtDZXNpdW1FdmVudE1vZGlmaWVyfSBtb2RpZmllclxuICogX19wYXJhbTpfXyBwcmlvcml0eSAtIHRoZSBiaWdnZXIgdGhlIG51bWJlciB0aGUgYmlnZ2VyIHRoZSBwcmlvcml0eS4gZGVmYXVsdCA6IDAuXG4gKiBfX3BhcmFtOl9fIGVudGl0eVR5cGUgLSBlbnRpdHkgdHlwZSBjbGFzcyB0aGF0IHlvdSBhcmUgaW50ZXJlc3RlZCBsaWtlIChUcmFjaykuIHRoZSBjbGFzcyBtdXN0IGV4dGVuZHMgQWNFbnRpdHlcbiAqIF9fcGFyYW06X18gcGlja09wdGlvbiAtIHNlbGYgZXhwbGFpbmVkXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBzY2VuZTogYW55O1xuICBwcml2YXRlIGV2ZW50UmVnaXN0cmF0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBSZWdpc3RyYXRpb25bXT4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgZXZlbnRCdWlsZGVyOiBDZXNpdW1FdmVudEJ1aWxkZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgcGxvbnRlclNlcnZpY2U6IFBsb250ZXJTZXJ2aWNlKSB7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuZXZlbnRCdWlsZGVyLmluaXQoKTtcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdG8gbWFwIGV2ZW50XG4gICAqIEBwYXJhbSBpbnB1dCBFdmVudCBSZWdpc3RyYXRpb24gSW5wdXRcbiAgICpcbiAgICogQHJldHVybnMgRGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+XG4gICAqL1xuICByZWdpc3RlcihpbnB1dDogRXZlbnRSZWdpc3RyYXRpb25JbnB1dCk6IERpc3Bvc2FibGVPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PiB7XG4gICAgaWYgKHRoaXMuc2NlbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDZXNpdW1TZXJ2aWNlIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCB5ZXQgLSBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSBtdXN0IGJlIGluamVjdGVkICB1bmRlciBhYy1tYXAnKTtcbiAgICB9XG5cbiAgICBpbnB1dC5waWNrID0gaW5wdXQucGljayB8fCBQaWNrT3B0aW9ucy5OT19QSUNLO1xuICAgIGlucHV0LnByaW9yaXR5ID0gaW5wdXQucHJpb3JpdHkgfHwgMDtcbiAgICBpbnB1dC5waWNrQ29uZmlnID0gaW5wdXQucGlja0NvbmZpZyB8fCB7fTtcblxuICAgIGlmIChpbnB1dC5lbnRpdHlUeXBlICYmIGlucHV0LnBpY2sgPT09IFBpY2tPcHRpb25zLk5PX1BJQ0spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U6IGNhblxcJ3QgcmVnaXN0ZXIgYW4gZXZlbnQgJyArXG4gICAgICAgICd3aXRoIGVudGl0eVR5cGUgYW5kIFBpY2tPcHRpb25zLk5PX1BJQ0sgLSBJdCBkb2VzblxcJ3QgbWFrZSBzZW5zZSAnKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudE5hbWUgPSBDZXNpdW1FdmVudEJ1aWxkZXIuZ2V0RXZlbnRGdWxsTmFtZShpbnB1dC5ldmVudCwgaW5wdXQubW9kaWZpZXIpO1xuXG4gICAgaWYgKCF0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5oYXMoZXZlbnROYW1lKSkge1xuICAgICAgdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuc2V0KGV2ZW50TmFtZSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50UmVnaXN0cmF0aW9uID0gdGhpcy5jcmVhdGVFdmVudFJlZ2lzdHJhdGlvbihpbnB1dCk7XG4gICAgY29uc3QgcmVnaXN0cmF0aW9uT2JzZXJ2YWJsZTogYW55ID0gZXZlbnRSZWdpc3RyYXRpb24ub2JzZXJ2YWJsZTtcbiAgICByZWdpc3RyYXRpb25PYnNlcnZhYmxlLmRpc3Bvc2UgPSAoKSA9PiB0aGlzLmRpc3Bvc2VPYnNlcnZhYmxlKGV2ZW50UmVnaXN0cmF0aW9uLCBldmVudE5hbWUpO1xuICAgIHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmdldChldmVudE5hbWUpLnB1c2goZXZlbnRSZWdpc3RyYXRpb24pO1xuXG4gICAgdGhpcy5zb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lKTtcbiAgICByZXR1cm4gPERpc3Bvc2FibGVPYnNlcnZhYmxlPEV2ZW50UmVzdWx0Pj5yZWdpc3RyYXRpb25PYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwb3NlT2JzZXJ2YWJsZShldmVudFJlZ2lzdHJhdGlvbjogUmVnaXN0cmF0aW9uLCBldmVudE5hbWU6IHN0cmluZykge1xuICAgIGV2ZW50UmVnaXN0cmF0aW9uLnN0b3BwZXIubmV4dCgxKTtcbiAgICBjb25zdCByZWdpc3RyYXRpb25zID0gdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSk7XG4gICAgY29uc3QgaW5kZXggPSByZWdpc3RyYXRpb25zLmluZGV4T2YoZXZlbnRSZWdpc3RyYXRpb24pO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHJlZ2lzdHJhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgdGhpcy5zb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVnaXN0cmF0aW9ucyA9IHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmdldChldmVudE5hbWUpO1xuICAgIHJlZ2lzdHJhdGlvbnMuc29ydCgoYSwgYikgPT4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHkpO1xuICAgIGlmIChyZWdpc3RyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFjdGl2ZSByZWdpc3RyYXRpb25zIGJ5IHByaW9yaXR5XG4gICAgY29uc3QgY3VycmVudFByaW9yaXR5ID0gcmVnaXN0cmF0aW9uc1swXS5wcmlvcml0eTtcbiAgICByZWdpc3RyYXRpb25zLmZvckVhY2goKHJlZ2lzdHJhdGlvbikgPT4ge1xuICAgICAgcmVnaXN0cmF0aW9uLmlzUGF1c2VkID0gcmVnaXN0cmF0aW9uLnByaW9yaXR5IDwgY3VycmVudFByaW9yaXR5O1xuICAgIH0pO1xuXG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGljazogcGlja09wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0ZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tDb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTogRXZlbnRSZWdpc3RyYXRpb25JbnB1dCk6IFJlZ2lzdHJhdGlvbiB7XG4gICAgY29uc3QgY2VzaXVtRXZlbnRPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KGV2ZW50LCBtb2RpZmllcik7XG4gICAgY29uc3Qgc3RvcHBlciA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IG5ldyBSZWdpc3RyYXRpb24odW5kZWZpbmVkLCBzdG9wcGVyLCBwcmlvcml0eSwgZmFsc2UpO1xuICAgIGxldCBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PjtcblxuICAgIGlmICghQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIuZHJhZ0V2ZW50cy5oYXMoZXZlbnQpKSB7XG4gICAgICBvYnNlcnZhYmxlID0gY2VzaXVtRXZlbnRPYnNlcnZhYmxlLnBpcGUoXG4gICAgICAgIGZpbHRlcigoKSA9PiAhcmVnaXN0cmF0aW9uLmlzUGF1c2VkKSxcbiAgICAgICAgbWFwKChtb3ZlbWVudCkgPT4gdGhpcy50cmlnZ2VyUGljayhtb3ZlbWVudCwgcGlja09wdGlvbiwgcGlja0NvbmZpZykpLFxuICAgICAgICBmaWx0ZXIoKHJlc3VsdCkgPT4gcmVzdWx0LmNlc2l1bUVudGl0aWVzICE9PSBudWxsIHx8IGVudGl0eVR5cGUgPT09IHVuZGVmaW5lZCksXG4gICAgICAgIG1hcCgocGlja3NBbmRNb3ZlbWVudCkgPT4gdGhpcy5hZGRFbnRpdGllcyhwaWNrc0FuZE1vdmVtZW50LCBlbnRpdHlUeXBlLCBwaWNrT3B0aW9uLCBwaWNrRmlsdGVyKSksXG4gICAgICAgIGZpbHRlcigocmVzdWx0KSA9PiByZXN1bHQuZW50aXRpZXMgIT09IG51bGwgfHwgKGVudGl0eVR5cGUgPT09IHVuZGVmaW5lZCAmJiAhcGlja0ZpbHRlcikpLFxuICAgICAgICBzd2l0Y2hNYXAoKGVudGl0aWVzQW5kTW92ZW1lbnQpID0+IHRoaXMucGxvbnRlcihlbnRpdGllc0FuZE1vdmVtZW50LCBwaWNrT3B0aW9uKSksXG4gICAgICAgIHRha2VVbnRpbChzdG9wcGVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZURyYWdFdmVudCh7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBtb2RpZmllcixcbiAgICAgICAgZW50aXR5VHlwZSxcbiAgICAgICAgcGljazogcGlja09wdGlvbixcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIHBpY2tGaWx0ZXIsXG4gICAgICAgIHBpY2tDb25maWdcbiAgICAgIH0pLnBpcGUodGFrZVVudGlsKHN0b3BwZXIpKTtcbiAgICB9XG5cbiAgICByZWdpc3RyYXRpb24ub2JzZXJ2YWJsZSA9IG9ic2VydmFibGU7XG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRHJhZ0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2s6IHBpY2tPcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0ZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrQ29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9OiBFdmVudFJlZ2lzdHJhdGlvbklucHV0KTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGNvbnN0IHsgbW91c2VEb3duRXZlbnQsIG1vdXNlVXBFdmVudCB9ID0gQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIuZ2V0RHJhZ0V2ZW50VHlwZXMoZXZlbnQpO1xuXG4gICAgY29uc3QgbW91c2VVcE9ic2VydmFibGUgPSB0aGlzLmV2ZW50QnVpbGRlci5nZXQobW91c2VVcEV2ZW50KTtcbiAgICBjb25zdCBtb3VzZU1vdmVPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KENlc2l1bUV2ZW50Lk1PVVNFX01PVkUpO1xuXG4gICAgY29uc3QgbW91c2VEb3duUmVnaXN0cmF0aW9uID0gdGhpcy5jcmVhdGVFdmVudFJlZ2lzdHJhdGlvbih7XG4gICAgICBldmVudDogbW91c2VEb3duRXZlbnQsXG4gICAgICBtb2RpZmllcixcbiAgICAgIGVudGl0eVR5cGUsXG4gICAgICBwaWNrOiBwaWNrT3B0aW9uLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBwaWNrRmlsdGVyLFxuICAgICAgcGlja0NvbmZpZyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRyb3BTdWJqZWN0ID0gbmV3IFN1YmplY3Q8RXZlbnRSZXN1bHQ+KCk7XG4gICAgY29uc3QgZHJhZ09ic2VydmVyID0gbW91c2VEb3duUmVnaXN0cmF0aW9uLm9ic2VydmFibGUucGlwZShtZXJnZU1hcChlID0+IHtcbiAgICAgIGxldCBsYXN0TW92ZTogYW55ID0gbnVsbDtcbiAgICAgIGNvbnN0IGRyYWdTdGFydFBvc2l0aW9uWCA9IGUubW92ZW1lbnQuc3RhcnRQb3NpdGlvbi54O1xuICAgICAgY29uc3QgZHJhZ1N0YXJ0UG9zaXRpb25ZID0gZS5tb3ZlbWVudC5zdGFydFBvc2l0aW9uLnk7XG4gICAgICByZXR1cm4gbW91c2VNb3ZlT2JzZXJ2YWJsZS5waXBlKG1hcCgobW92ZW1lbnQpID0+IHtcbiAgICAgICAgbGFzdE1vdmUgPSB7XG4gICAgICAgICAgbW92ZW1lbnQ6IHtcbiAgICAgICAgICAgIGRyb3A6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjoge1xuICAgICAgICAgICAgICB4OiBkcmFnU3RhcnRQb3NpdGlvblgsXG4gICAgICAgICAgICAgIHk6IGRyYWdTdGFydFBvc2l0aW9uWSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmRQb3NpdGlvbjogbW92ZW1lbnQuZW5kUG9zaXRpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbnRpdGllczogZS5lbnRpdGllcyxcbiAgICAgICAgICBjZXNpdW1FbnRpdGllczogZS5jZXNpdW1FbnRpdGllc1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbGFzdE1vdmU7XG4gICAgICB9KSwgdGFrZVVudGlsKG1vdXNlVXBPYnNlcnZhYmxlKSwgdGFwKHtcbiAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAvLyBPbiBjb21wbGV0ZVxuICAgICAgICAgIGlmIChsYXN0TW92ZSkge1xuICAgICAgICAgICAgY29uc3QgZHJvcEV2ZW50ID0gT2JqZWN0LmFzc2lnbih7fSwgbGFzdE1vdmUpO1xuICAgICAgICAgICAgZHJvcEV2ZW50Lm1vdmVtZW50LmRyb3AgPSB0cnVlO1xuICAgICAgICAgICAgZHJvcFN1YmplY3QubmV4dChkcm9wRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIHJldHVybiBtZXJnZShkcmFnT2JzZXJ2ZXIsIGRyb3BTdWJqZWN0KTtcblxuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyUGljayhtb3ZlbWVudDogYW55LCBwaWNrT3B0aW9uczogUGlja09wdGlvbnMsIHBpY2tDb25maWc6IFBpY2tDb25maWd1cmF0aW9uKSB7XG4gICAgbGV0IHBpY2tzOiBhbnkgPSBbXTtcbiAgICBzd2l0Y2ggKHBpY2tPcHRpb25zKSB7XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLlBJQ0tfT05FOlxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0FMTDpcbiAgICAgICAgcGlja3MgPSB0aGlzLnNjZW5lLmRyaWxsUGljayhtb3ZlbWVudC5lbmRQb3NpdGlvbiwgcGlja0NvbmZpZy5kcmlsbFBpY2tMaW1pdCwgcGlja0NvbmZpZy5waWNrV2lkdGgsIHBpY2tDb25maWcucGlja0hlaWdodCk7XG4gICAgICAgIHBpY2tzID0gcGlja3MubGVuZ3RoID09PSAwID8gbnVsbCA6IHBpY2tzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGlja09wdGlvbnMuUElDS19GSVJTVDpcbiAgICAgICAgY29uc3QgcGljayA9IHRoaXMuc2NlbmUucGljayhtb3ZlbWVudC5lbmRQb3NpdGlvbiwgcGlja0NvbmZpZy5waWNrV2lkdGgsIHBpY2tDb25maWcucGlja0hlaWdodCk7XG4gICAgICAgIHBpY2tzID0gcGljayA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IFtwaWNrXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFBpY2tPcHRpb25zLk5PX1BJQ0s6XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gUGlja3MgY2FuIGJlIGNlc2l1bSBlbnRpdHkgb3IgY2VzaXVtIHByaW1pdGl2ZVxuICAgIGlmIChwaWNrcykge1xuICAgICAgcGlja3MgPSBwaWNrcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5pZCAmJiBwaWNrLmlkIGluc3RhbmNlb2YgQ2VzaXVtLkVudGl0eSA/IHBpY2suaWQgOiBwaWNrLnByaW1pdGl2ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbW92ZW1lbnQ6IG1vdmVtZW50LCBjZXNpdW1FbnRpdGllczogcGlja3MgfTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkRW50aXRpZXMocGlja3NBbmRNb3ZlbWVudDogYW55LCBlbnRpdHlUeXBlOiBhbnksIHBpY2tPcHRpb246IFBpY2tPcHRpb25zLCBwaWNrRmlsdGVyPzogKGFueSkgPT4gYm9vbGVhbik6IEV2ZW50UmVzdWx0IHtcblxuICAgIGlmIChwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzID09PSBudWxsKSB7XG4gICAgICBwaWNrc0FuZE1vdmVtZW50LmVudGl0aWVzID0gbnVsbDtcbiAgICAgIHJldHVybiBwaWNrc0FuZE1vdmVtZW50O1xuICAgIH1cbiAgICBsZXQgZW50aXRpZXMgPSBbXTtcbiAgICBpZiAocGlja09wdGlvbiAhPT0gUGlja09wdGlvbnMuTk9fUElDSykge1xuICAgICAgaWYgKGVudGl0eVR5cGUpIHtcbiAgICAgICAgZW50aXRpZXMgPSBwaWNrc0FuZE1vdmVtZW50LmNlc2l1bUVudGl0aWVzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmFjRW50aXR5KS5maWx0ZXIoKGFjRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gYWNFbnRpdHkgJiYgYWNFbnRpdHkgaW5zdGFuY2VvZiBlbnRpdHlUeXBlO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVudGl0aWVzID0gcGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5hY0VudGl0eSk7XG4gICAgICB9XG5cbiAgICAgIGVudGl0aWVzID0gVXRpbHNTZXJ2aWNlLnVuaXF1ZShlbnRpdGllcyk7XG4gICAgICBlbnRpdGllcyA9IChwaWNrRmlsdGVyICYmIGVudGl0aWVzKSA/IGVudGl0aWVzLmZpbHRlcihwaWNrRmlsdGVyKSA6IGVudGl0aWVzO1xuICAgICAgaWYgKGVudGl0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBlbnRpdGllcyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGlja3NBbmRNb3ZlbWVudC5lbnRpdGllcyA9IGVudGl0aWVzO1xuXG4gICAgcmV0dXJuIHBpY2tzQW5kTW92ZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIHBsb250ZXIoZW50aXRpZXNBbmRNb3ZlbWVudDogRXZlbnRSZXN1bHQsIHBpY2tPcHRpb246IFBpY2tPcHRpb25zKTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xuICAgIGlmIChwaWNrT3B0aW9uID09PSBQaWNrT3B0aW9ucy5QSUNLX09ORSAmJiBlbnRpdGllc0FuZE1vdmVtZW50LmVudGl0aWVzICE9PSBudWxsICYmIGVudGl0aWVzQW5kTW92ZW1lbnQuZW50aXRpZXMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckl0KGVudGl0aWVzQW5kTW92ZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKGVudGl0aWVzQW5kTW92ZW1lbnQpO1xuICAgIH1cbiAgfVxufVxuIl19