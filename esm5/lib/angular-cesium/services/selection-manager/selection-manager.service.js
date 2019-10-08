/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { MapsManagerService } from '../maps-manager/maps-manager.service';
/**
 * @record
 */
export function SelectionOptions() { }
if (false) {
    /** @type {?|undefined} */
    SelectionOptions.prototype.event;
    /** @type {?|undefined} */
    SelectionOptions.prototype.modifier;
    /** @type {?|undefined} */
    SelectionOptions.prototype.entityType;
}
/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * \@Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
var SelectionManagerService = /** @class */ (function () {
    function SelectionManagerService(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntities$ = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitiesItems$.asObservable();
    };
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntities = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitiesItems$.getValue();
    };
    /**
     * @return {?}
     */
    SelectionManagerService.prototype.selectedEntity$ = /**
     * @return {?}
     */
    function () {
        return this.selectedEntitySubject$;
    };
    /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.toggleSelection = /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        /** @type {?} */
        var current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    };
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.addToSelected = /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        /** @type {?} */
        var current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next(tslib_1.__spread(current, [entity]));
    };
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    SelectionManagerService.prototype.removeSelected = /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    function (entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        /** @type {?} */
        var current = this.selectedEntities();
        /** @type {?} */
        var entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    };
    /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    SelectionManagerService.prototype.initSelection = /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    function (selectionOptions, addSelectedIndicator, eventPriority, mapId) {
        var _this = this;
        if (addSelectedIndicator === void 0) { addSelectedIndicator = true; }
        /** @type {?} */
        var mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        /** @type {?} */
        var eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map((/**
         * @param {?} result
         * @return {?}
         */
        function (result) { return result.entities; })), filter((/**
         * @param {?} entities
         * @return {?}
         */
        function (entities) { return entities && entities.length > 0; })))
            .subscribe((/**
         * @param {?} entities
         * @return {?}
         */
        function (entities) {
            /** @type {?} */
            var entity = entities[0];
            _this.toggleSelection(entity, addSelectedIndicator);
        }));
    };
    SelectionManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    SelectionManagerService.ctorParameters = function () { return [
        { type: MapsManagerService }
    ]; };
    return SelectionManagerService;
}());
export { SelectionManagerService };
if (false) {
    /** @type {?} */
    SelectionManagerService.prototype.selectedEntitiesItems$;
    /** @type {?} */
    SelectionManagerService.prototype.selectedEntitySubject$;
    /**
     * @type {?}
     * @private
     */
    SelectionManagerService.prototype.mapEventsManagerService;
    /**
     * @type {?}
     * @private
     */
    SelectionManagerService.prototype.mapsManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3NlbGVjdGlvbi1tYW5hZ2VyL3NlbGVjdGlvbi1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUU3RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7OztBQUcxRSxzQ0FJQzs7O0lBSEMsaUNBQW9COztJQUNwQixvQ0FBK0I7O0lBQy9CLHNDQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDbkI7SUFNRSxpQ0FBb0IsV0FBK0I7UUFBL0IsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBSm5ELDJCQUFzQixHQUFnQyxJQUFJLGVBQWUsQ0FBYSxFQUFFLENBQUMsQ0FBQztRQUMxRiwyQkFBc0IsR0FBc0IsSUFBSSxPQUFPLEVBQVksQ0FBQztJQUlwRSxDQUFDOzs7O0lBRUQsbURBQWlCOzs7SUFBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxDQUFDOzs7O0lBRUQsa0RBQWdCOzs7SUFBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoRCxDQUFDOzs7O0lBRUQsaURBQWU7OztJQUFm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RUFBQyxDQUFDO2FBQ25ELFNBQVM7Ozs7UUFBQyxVQUFBLFFBQVE7O2dCQUNYLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEtBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDckQsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOztnQkFqRkYsVUFBVTs7OztnQkF0Q0Ysa0JBQWtCOztJQXdIM0IsOEJBQUM7Q0FBQSxBQWxGRCxJQWtGQztTQWpGWSx1QkFBdUI7OztJQUNsQyx5REFBMEY7O0lBQzFGLHlEQUFvRTs7Ozs7SUFDcEUsMERBQXlEOzs7OztJQUU3Qyw4Q0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRNb2RpZmllciB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC1tb2RpZmllci5lbnVtJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTZWxlY3Rpb25PcHRpb25zIHtcbiAgZXZlbnQ/OiBDZXNpdW1FdmVudDtcbiAgbW9kaWZpZXI/OiBDZXNpdW1FdmVudE1vZGlmaWVyO1xuICBlbnRpdHlUeXBlPzogYW55O1xufVxuXG4vKipcbiAqIE1hbmFnZXMgZW50aXR5IHNlbGVjdGlvbiBzZXJ2aWNlIGZvciBhbnkgZ2l2ZW4gbW91c2UgZXZlbnQgYW5kIG1vZGlmaWVyXG4gKiB0aGUgc2VydmljZSB3aWxsIG1hbmFnZSB0aGUgbGlzdCBvZiBzZWxlY3RlZCBpdGVtcy5cbiAqIGNoZWNrIG91dCB0aGUgZXhhbXBsZVxuICogeW91IG11c3QgcHJvdmlkZSB0aGUgc2VydmljZSB5b3Vyc2VsZlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogYGBgXG4gKiAvLyBwcm92aWRlIHRoZSBzZXJ2aWNlIGluIHNvbWUgY29tcG9uZW50XG4gKiBAQ29tcG9uZW50KHtcbiAqIC8vLi4uXG4gKiAgcHJvdmlkZXJzOiBbU2VsZWN0aW9uTWFuYWdlclNlcnZpY2VdXG4gKiB9XG4gKlxuICogLy8gVXNhZ2UgZXhhbXBsZTpcbiAqIC8vIGluaXQgc2VsZWN0aW9uXG4gKiBjb25zdCBzZWxlY3RlZEluZGljYXRvciA9IHR1cmU7IC8vIG9wdGlvbmFsIGRlZmF1bHQgdHJ1ZSwgaWYgdHJ1ZSBhIGJvb2xlYW4gXCJzZWxlY3RlZFwiIHByb3BlcnR5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHNlbGVjdGVkIGVudGl0eVxuICogc2VsZWN0aW9uTWFuYWdlclNlcnZpY2UuaW5pdFNlbGVjdGlvbih7IGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RpZmllcjogQ2VzaXVtRXZlbnRNb2RpZmllci5DVFJMXG4gKiBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LHNlbGVjdGVkSW5kaWNhdG9yKTtcbiAqIC8vIEdldCBzZWxlY3RlZFxuICogY29uc3Qgc2VsZWN0ZWQgPSBzZWxlY3Rpb25NYW5hZ2VyU2VydmljZS5zZWxlY3RlZCgpO1xuICpcbiAqIC8vIE9yIGFzIG9ic2VydmVyXG4gKiBjb25zdCBzZWxlY3RlZCQgPSBzZWxlY3Rpb25NYW5hZ2VyU2VydmljZS5zZWxlY3RlZCQoKTtcbiAqXG4gKiBgYGBcbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25NYW5hZ2VyU2VydmljZSB7XG4gIHNlbGVjdGVkRW50aXRpZXNJdGVtcyQ6IEJlaGF2aW9yU3ViamVjdDxBY0VudGl0eVtdPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QWNFbnRpdHlbXT4oW10pO1xuICBzZWxlY3RlZEVudGl0eVN1YmplY3QkOiBTdWJqZWN0PEFjRW50aXR5PiA9IG5ldyBTdWJqZWN0PEFjRW50aXR5PigpO1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcHNNYW5hZ2VyOiBNYXBzTWFuYWdlclNlcnZpY2UpIHtcbiAgfVxuXG4gIHNlbGVjdGVkRW50aXRpZXMkKCk6IE9ic2VydmFibGU8QWNFbnRpdHlbXT4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRW50aXRpZXNJdGVtcyQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBzZWxlY3RlZEVudGl0aWVzKCk6IEFjRW50aXR5W10ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRW50aXRpZXNJdGVtcyQuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHNlbGVjdGVkRW50aXR5JCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVudGl0eVN1YmplY3QkO1xuICB9XG5cbiAgdG9nZ2xlU2VsZWN0aW9uKGVudGl0eTogQWNFbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yOiBib29sZWFuKSB7XG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMuc2VsZWN0ZWRFbnRpdGllcygpO1xuICAgIGlmIChjdXJyZW50LmluZGV4T2YoZW50aXR5KSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuYWRkVG9TZWxlY3RlZChlbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChlbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFRvU2VsZWN0ZWQoZW50aXR5OiBBY0VudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3I6IGJvb2xlYW4pIHtcbiAgICBpZiAoYWRkU2VsZWN0ZWRJbmRpY2F0b3IpIHtcbiAgICAgIGVudGl0eVsnc2VsZWN0ZWQnXSA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMuc2VsZWN0ZWRFbnRpdGllcygpO1xuICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JC5uZXh0KGVudGl0eSk7XG4gICAgdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLm5leHQoWy4uLmN1cnJlbnQsIGVudGl0eV0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVTZWxlY3RlZChlbnRpdHk6IEFjRW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcjogYm9vbGVhbikge1xuICAgIGlmIChhZGRTZWxlY3RlZEluZGljYXRvcikge1xuICAgICAgZW50aXR5WydzZWxlY3RlZCddID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMuc2VsZWN0ZWRFbnRpdGllcygpO1xuICAgIGNvbnN0IGVudGl0eUluZGV4ID0gY3VycmVudC5pbmRleE9mKGVudGl0eSk7XG4gICAgaWYgKGVudGl0eUluZGV4ICE9PSAtMSkge1xuICAgICAgY3VycmVudC5zcGxpY2UoZW50aXR5SW5kZXgsIDEpO1xuICAgICAgdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLm5leHQoY3VycmVudCk7XG4gICAgICB0aGlzLnNlbGVjdGVkRW50aXR5U3ViamVjdCQubmV4dChlbnRpdHkpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRTZWxlY3Rpb24oc2VsZWN0aW9uT3B0aW9ucz86IFNlbGVjdGlvbk9wdGlvbnMsIGFkZFNlbGVjdGVkSW5kaWNhdG9yID0gdHJ1ZSwgZXZlbnRQcmlvcml0eT86IG51bWJlciwgbWFwSWQ/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBtYXBDb21wb25lbnQgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcChtYXBJZCk7XG4gICAgaWYgKCFtYXBDb21wb25lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlID0gbWFwQ29tcG9uZW50LmdldE1hcEV2ZW50c01hbmFnZXIoKTtcblxuICAgIGlmICghc2VsZWN0aW9uT3B0aW9ucykge1xuICAgICAgT2JqZWN0LmFzc2lnbihzZWxlY3Rpb25PcHRpb25zLCB7ZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0t9KTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudFN1YnNjcmlwdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlclNlcnZpY2UucmVnaXN0ZXIoe1xuICAgICAgZXZlbnQ6IHNlbGVjdGlvbk9wdGlvbnMuZXZlbnQsXG4gICAgICBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX09ORSxcbiAgICAgIG1vZGlmaWVyOiBzZWxlY3Rpb25PcHRpb25zLm1vZGlmaWVyLFxuICAgICAgZW50aXR5VHlwZTogc2VsZWN0aW9uT3B0aW9ucy5lbnRpdHlUeXBlLFxuICAgICAgcHJpb3JpdHk6IGV2ZW50UHJpb3JpdHksXG4gICAgfSk7XG5cbiAgICBldmVudFN1YnNjcmlwdGlvbi5waXBlKFxuICAgICAgbWFwKHJlc3VsdCA9PiByZXN1bHQuZW50aXRpZXMpLFxuICAgICAgZmlsdGVyKGVudGl0aWVzID0+IGVudGl0aWVzICYmIGVudGl0aWVzLmxlbmd0aCA+IDApKVxuICAgICAgLnN1YnNjcmliZShlbnRpdGllcyA9PiB7XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzWzBdO1xuICAgICAgICB0aGlzLnRvZ2dsZVNlbGVjdGlvbihlbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yKTtcbiAgICAgIH0pO1xuICB9XG59XG4iXX0=