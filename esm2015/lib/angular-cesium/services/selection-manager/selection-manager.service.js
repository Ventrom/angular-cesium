/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class SelectionManagerService {
    /**
     * @param {?} mapsManager
     */
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    /**
     * @return {?}
     */
    selectedEntities$() {
        return this.selectedEntitiesItems$.asObservable();
    }
    /**
     * @return {?}
     */
    selectedEntities() {
        return this.selectedEntitiesItems$.getValue();
    }
    /**
     * @return {?}
     */
    selectedEntity$() {
        return this.selectedEntitySubject$;
    }
    /**
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    toggleSelection(entity, addSelectedIndicator) {
        /** @type {?} */
        const current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    }
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    addToSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        /** @type {?} */
        const current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next([...current, entity]);
    }
    /**
     * @private
     * @param {?} entity
     * @param {?} addSelectedIndicator
     * @return {?}
     */
    removeSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        /** @type {?} */
        const current = this.selectedEntities();
        /** @type {?} */
        const entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    }
    /**
     * @param {?=} selectionOptions
     * @param {?=} addSelectedIndicator
     * @param {?=} eventPriority
     * @param {?=} mapId
     * @return {?}
     */
    initSelection(selectionOptions, addSelectedIndicator = true, eventPriority, mapId) {
        /** @type {?} */
        const mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        /** @type {?} */
        const eventSubscription = this.mapEventsManagerService.register({
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
        result => result.entities)), filter((/**
         * @param {?} entities
         * @return {?}
         */
        entities => entities && entities.length > 0)))
            .subscribe((/**
         * @param {?} entities
         * @return {?}
         */
        entities => {
            /** @type {?} */
            const entity = entities[0];
            this.toggleSelection(entity, addSelectedIndicator);
        }));
    }
}
SelectionManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SelectionManagerService.ctorParameters = () => [
    { type: MapsManagerService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3NlbGVjdGlvbi1tYW5hZ2VyL3NlbGVjdGlvbi1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFFOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBRTdFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7O0FBRzFFLHNDQUlDOzs7SUFIQyxpQ0FBb0I7O0lBQ3BCLG9DQUErQjs7SUFDL0Isc0NBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNuQixNQUFNLE9BQU8sdUJBQXVCOzs7O0lBS2xDLFlBQW9CLFdBQStCO1FBQS9CLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUpuRCwyQkFBc0IsR0FBZ0MsSUFBSSxlQUFlLENBQWEsRUFBRSxDQUFDLENBQUM7UUFDMUYsMkJBQXNCLEdBQXNCLElBQUksT0FBTyxFQUFZLENBQUM7SUFJcEUsQ0FBQzs7OztJQUVELGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BELENBQUM7Ozs7SUFFRCxnQkFBZ0I7UUFDZCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoRCxDQUFDOzs7O0lBRUQsZUFBZTtRQUNi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SSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNyRCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7OztZQWpGRixVQUFVOzs7O1lBdENGLGtCQUFrQjs7OztJQXdDekIseURBQTBGOztJQUMxRix5REFBb0U7Ozs7O0lBQ3BFLDBEQUF5RDs7Ozs7SUFFN0MsOENBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IENlc2l1bUV2ZW50TW9kaWZpZXIgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQtbW9kaWZpZXIuZW51bSc7XG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uT3B0aW9ucyB7XG4gIGV2ZW50PzogQ2VzaXVtRXZlbnQ7XG4gIG1vZGlmaWVyPzogQ2VzaXVtRXZlbnRNb2RpZmllcjtcbiAgZW50aXR5VHlwZT86IGFueTtcbn1cblxuLyoqXG4gKiBNYW5hZ2VzIGVudGl0eSBzZWxlY3Rpb24gc2VydmljZSBmb3IgYW55IGdpdmVuIG1vdXNlIGV2ZW50IGFuZCBtb2RpZmllclxuICogdGhlIHNlcnZpY2Ugd2lsbCBtYW5hZ2UgdGhlIGxpc3Qgb2Ygc2VsZWN0ZWQgaXRlbXMuXG4gKiBjaGVjayBvdXQgdGhlIGV4YW1wbGVcbiAqIHlvdSBtdXN0IHByb3ZpZGUgdGhlIHNlcnZpY2UgeW91cnNlbGZcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqIGBgYFxuICogLy8gcHJvdmlkZSB0aGUgc2VydmljZSBpbiBzb21lIGNvbXBvbmVudFxuICogQENvbXBvbmVudCh7XG4gKiAvLy4uLlxuICogIHByb3ZpZGVyczogW1NlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlXVxuICogfVxuICpcbiAqIC8vIFVzYWdlIGV4YW1wbGU6XG4gKiAvLyBpbml0IHNlbGVjdGlvblxuICogY29uc3Qgc2VsZWN0ZWRJbmRpY2F0b3IgPSB0dXJlOyAvLyBvcHRpb25hbCBkZWZhdWx0IHRydWUsIGlmIHRydWUgYSBib29sZWFuIFwic2VsZWN0ZWRcIiBwcm9wZXJ0eSB3aWxsIGJlIGFkZGVkIHRvIHRoZSBzZWxlY3RlZCBlbnRpdHlcbiAqIHNlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlLmluaXRTZWxlY3Rpb24oeyBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAqIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kaWZpZXI6IENlc2l1bUV2ZW50TW9kaWZpZXIuQ1RSTFxuICogXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxzZWxlY3RlZEluZGljYXRvcik7XG4gKiAvLyBHZXQgc2VsZWN0ZWRcbiAqIGNvbnN0IHNlbGVjdGVkID0gc2VsZWN0aW9uTWFuYWdlclNlcnZpY2Uuc2VsZWN0ZWQoKTtcbiAqXG4gKiAvLyBPciBhcyBvYnNlcnZlclxuICogY29uc3Qgc2VsZWN0ZWQkID0gc2VsZWN0aW9uTWFuYWdlclNlcnZpY2Uuc2VsZWN0ZWQkKCk7XG4gKlxuICogYGBgXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uTWFuYWdlclNlcnZpY2Uge1xuICBzZWxlY3RlZEVudGl0aWVzSXRlbXMkOiBCZWhhdmlvclN1YmplY3Q8QWNFbnRpdHlbXT4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFjRW50aXR5W10+KFtdKTtcbiAgc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JDogU3ViamVjdDxBY0VudGl0eT4gPSBuZXcgU3ViamVjdDxBY0VudGl0eT4oKTtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyU2VydmljZTogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlKSB7XG4gIH1cblxuICBzZWxlY3RlZEVudGl0aWVzJCgpOiBPYnNlcnZhYmxlPEFjRW50aXR5W10+IHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgc2VsZWN0ZWRFbnRpdGllcygpOiBBY0VudGl0eVtdIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVudGl0aWVzSXRlbXMkLmdldFZhbHVlKCk7XG4gIH1cblxuICBzZWxlY3RlZEVudGl0eSQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JDtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbihlbnRpdHk6IEFjRW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcjogYm9vbGVhbikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnNlbGVjdGVkRW50aXRpZXMoKTtcbiAgICBpZiAoY3VycmVudC5pbmRleE9mKGVudGl0eSkgPT09IC0xKSB7XG4gICAgICB0aGlzLmFkZFRvU2VsZWN0ZWQoZW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoZW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZGRUb1NlbGVjdGVkKGVudGl0eTogQWNFbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yOiBib29sZWFuKSB7XG4gICAgaWYgKGFkZFNlbGVjdGVkSW5kaWNhdG9yKSB7XG4gICAgICBlbnRpdHlbJ3NlbGVjdGVkJ10gPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnNlbGVjdGVkRW50aXRpZXMoKTtcbiAgICB0aGlzLnNlbGVjdGVkRW50aXR5U3ViamVjdCQubmV4dChlbnRpdHkpO1xuICAgIHRoaXMuc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJC5uZXh0KFsuLi5jdXJyZW50LCBlbnRpdHldKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU2VsZWN0ZWQoZW50aXR5OiBBY0VudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3I6IGJvb2xlYW4pIHtcbiAgICBpZiAoYWRkU2VsZWN0ZWRJbmRpY2F0b3IpIHtcbiAgICAgIGVudGl0eVsnc2VsZWN0ZWQnXSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnNlbGVjdGVkRW50aXRpZXMoKTtcbiAgICBjb25zdCBlbnRpdHlJbmRleCA9IGN1cnJlbnQuaW5kZXhPZihlbnRpdHkpO1xuICAgIGlmIChlbnRpdHlJbmRleCAhPT0gLTEpIHtcbiAgICAgIGN1cnJlbnQuc3BsaWNlKGVudGl0eUluZGV4LCAxKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJC5uZXh0KGN1cnJlbnQpO1xuICAgICAgdGhpcy5zZWxlY3RlZEVudGl0eVN1YmplY3QkLm5leHQoZW50aXR5KTtcbiAgICB9XG4gIH1cblxuICBpbml0U2VsZWN0aW9uKHNlbGVjdGlvbk9wdGlvbnM/OiBTZWxlY3Rpb25PcHRpb25zLCBhZGRTZWxlY3RlZEluZGljYXRvciA9IHRydWUsIGV2ZW50UHJpb3JpdHk/OiBudW1iZXIsIG1hcElkPzogc3RyaW5nKSB7XG4gICAgY29uc3QgbWFwQ29tcG9uZW50ID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAobWFwSWQpO1xuICAgIGlmICghbWFwQ29tcG9uZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyU2VydmljZSA9IG1hcENvbXBvbmVudC5nZXRNYXBFdmVudHNNYW5hZ2VyKCk7XG5cbiAgICBpZiAoIXNlbGVjdGlvbk9wdGlvbnMpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24oc2VsZWN0aW9uT3B0aW9ucywge2V2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLfSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnRTdWJzY3JpcHRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLnJlZ2lzdGVyKHtcbiAgICAgIGV2ZW50OiBzZWxlY3Rpb25PcHRpb25zLmV2ZW50LFxuICAgICAgcGljazogUGlja09wdGlvbnMuUElDS19PTkUsXG4gICAgICBtb2RpZmllcjogc2VsZWN0aW9uT3B0aW9ucy5tb2RpZmllcixcbiAgICAgIGVudGl0eVR5cGU6IHNlbGVjdGlvbk9wdGlvbnMuZW50aXR5VHlwZSxcbiAgICAgIHByaW9yaXR5OiBldmVudFByaW9yaXR5LFxuICAgIH0pO1xuXG4gICAgZXZlbnRTdWJzY3JpcHRpb24ucGlwZShcbiAgICAgIG1hcChyZXN1bHQgPT4gcmVzdWx0LmVudGl0aWVzKSxcbiAgICAgIGZpbHRlcihlbnRpdGllcyA9PiBlbnRpdGllcyAmJiBlbnRpdGllcy5sZW5ndGggPiAwKSlcbiAgICAgIC5zdWJzY3JpYmUoZW50aXRpZXMgPT4ge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSBlbnRpdGllc1swXTtcbiAgICAgICAgdGhpcy50b2dnbGVTZWxlY3Rpb24oZW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcik7XG4gICAgICB9KTtcbiAgfVxufVxuIl19