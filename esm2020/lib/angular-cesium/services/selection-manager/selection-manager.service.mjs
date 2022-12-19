import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import * as i0 from "@angular/core";
import * as i1 from "../maps-manager/maps-manager.service";
/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
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
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    selectedEntities$() {
        return this.selectedEntitiesItems$.asObservable();
    }
    selectedEntities() {
        return this.selectedEntitiesItems$.getValue();
    }
    selectedEntity$() {
        return this.selectedEntitySubject$;
    }
    toggleSelection(entity, addSelectedIndicator) {
        const current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    }
    addToSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        const current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next([...current, entity]);
    }
    removeSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        const current = this.selectedEntities();
        const entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    }
    initSelection(selectionOptions, addSelectedIndicator = true, eventPriority, mapId) {
        const mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        const eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map(result => result.entities), filter(entities => entities && entities.length > 0))
            .subscribe(entities => {
            const entity = entities[0];
            this.toggleSelection(entity, addSelectedIndicator);
        });
    }
}
SelectionManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: SelectionManagerService, deps: [{ token: i1.MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable });
SelectionManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: SelectionManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: SelectionManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MapsManagerService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc2VsZWN0aW9uLW1hbmFnZXIvc2VsZWN0aW9uLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7O0FBVzdFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBRUgsTUFBTSxPQUFPLHVCQUF1QjtJQUtsQyxZQUFvQixXQUErQjtRQUEvQixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFKbkQsMkJBQXNCLEdBQWdDLElBQUksZUFBZSxDQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLDJCQUFzQixHQUFzQixJQUFJLE9BQU8sRUFBWSxDQUFDO0lBSXBFLENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUNyQyxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQWdCLEVBQUUsb0JBQTZCO1FBQzdELE1B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Q0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOztxSEFoRlUsdUJBQXVCO3lIQUF2Qix1QkFBdUI7NEZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbHRlciwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudE1vZGlmaWVyIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LW1vZGlmaWVyLmVudW0nO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcblxuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbk9wdGlvbnMge1xuICBldmVudD86IENlc2l1bUV2ZW50O1xuICBtb2RpZmllcj86IENlc2l1bUV2ZW50TW9kaWZpZXI7XG4gIGVudGl0eVR5cGU/OiBhbnk7XG59XG5cbi8qKlxuICogTWFuYWdlcyBlbnRpdHkgc2VsZWN0aW9uIHNlcnZpY2UgZm9yIGFueSBnaXZlbiBtb3VzZSBldmVudCBhbmQgbW9kaWZpZXJcbiAqIHRoZSBzZXJ2aWNlIHdpbGwgbWFuYWdlIHRoZSBsaXN0IG9mIHNlbGVjdGVkIGl0ZW1zLlxuICogY2hlY2sgb3V0IHRoZSBleGFtcGxlXG4gKiB5b3UgbXVzdCBwcm92aWRlIHRoZSBzZXJ2aWNlIHlvdXJzZWxmXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiBgYGBcbiAqIC8vIHByb3ZpZGUgdGhlIHNlcnZpY2UgaW4gc29tZSBjb21wb25lbnRcbiAqIEBDb21wb25lbnQoe1xuICogLy8uLi5cbiAqICBwcm92aWRlcnM6IFtTZWxlY3Rpb25NYW5hZ2VyU2VydmljZV1cbiAqIH1cbiAqXG4gKiAvLyBVc2FnZSBleGFtcGxlOlxuICogLy8gaW5pdCBzZWxlY3Rpb25cbiAqIGNvbnN0IHNlbGVjdGVkSW5kaWNhdG9yID0gdHVyZTsgLy8gb3B0aW9uYWwgZGVmYXVsdCB0cnVlLCBpZiB0cnVlIGEgYm9vbGVhbiBcInNlbGVjdGVkXCIgcHJvcGVydHkgd2lsbCBiZSBhZGRlZCB0byB0aGUgc2VsZWN0ZWQgZW50aXR5XG4gKiBzZWxlY3Rpb25NYW5hZ2VyU2VydmljZS5pbml0U2VsZWN0aW9uKHsgZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gKiBcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGlmaWVyOiBDZXNpdW1FdmVudE1vZGlmaWVyLkNUUkxcbiAqIFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sc2VsZWN0ZWRJbmRpY2F0b3IpO1xuICogLy8gR2V0IHNlbGVjdGVkXG4gKiBjb25zdCBzZWxlY3RlZCA9IHNlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlLnNlbGVjdGVkKCk7XG4gKlxuICogLy8gT3IgYXMgb2JzZXJ2ZXJcbiAqIGNvbnN0IHNlbGVjdGVkJCA9IHNlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlLnNlbGVjdGVkJCgpO1xuICpcbiAqIGBgYFxuICpcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbk1hbmFnZXJTZXJ2aWNlIHtcbiAgc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJDogQmVoYXZpb3JTdWJqZWN0PEFjRW50aXR5W10+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBY0VudGl0eVtdPihbXSk7XG4gIHNlbGVjdGVkRW50aXR5U3ViamVjdCQ6IFN1YmplY3Q8QWNFbnRpdHk+ID0gbmV3IFN1YmplY3Q8QWNFbnRpdHk+KCk7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlclNlcnZpY2U6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFwc01hbmFnZXI6IE1hcHNNYW5hZ2VyU2VydmljZSkge1xuICB9XG5cbiAgc2VsZWN0ZWRFbnRpdGllcyQoKTogT2JzZXJ2YWJsZTxBY0VudGl0eVtdPiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHNlbGVjdGVkRW50aXRpZXMoKTogQWNFbnRpdHlbXSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbnRpdGllc0l0ZW1zJC5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgc2VsZWN0ZWRFbnRpdHkkKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRW50aXR5U3ViamVjdCQ7XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24oZW50aXR5OiBBY0VudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3I6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zZWxlY3RlZEVudGl0aWVzKCk7XG4gICAgaWYgKGN1cnJlbnQuaW5kZXhPZihlbnRpdHkpID09PSAtMSkge1xuICAgICAgdGhpcy5hZGRUb1NlbGVjdGVkKGVudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGVudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkVG9TZWxlY3RlZChlbnRpdHk6IEFjRW50aXR5LCBhZGRTZWxlY3RlZEluZGljYXRvcjogYm9vbGVhbikge1xuICAgIGlmIChhZGRTZWxlY3RlZEluZGljYXRvcikge1xuICAgICAgZW50aXR5WydzZWxlY3RlZCddID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zZWxlY3RlZEVudGl0aWVzKCk7XG4gICAgdGhpcy5zZWxlY3RlZEVudGl0eVN1YmplY3QkLm5leHQoZW50aXR5KTtcbiAgICB0aGlzLnNlbGVjdGVkRW50aXRpZXNJdGVtcyQubmV4dChbLi4uY3VycmVudCwgZW50aXR5XSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVNlbGVjdGVkKGVudGl0eTogQWNFbnRpdHksIGFkZFNlbGVjdGVkSW5kaWNhdG9yOiBib29sZWFuKSB7XG4gICAgaWYgKGFkZFNlbGVjdGVkSW5kaWNhdG9yKSB7XG4gICAgICBlbnRpdHlbJ3NlbGVjdGVkJ10gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zZWxlY3RlZEVudGl0aWVzKCk7XG4gICAgY29uc3QgZW50aXR5SW5kZXggPSBjdXJyZW50LmluZGV4T2YoZW50aXR5KTtcbiAgICBpZiAoZW50aXR5SW5kZXggIT09IC0xKSB7XG4gICAgICBjdXJyZW50LnNwbGljZShlbnRpdHlJbmRleCwgMSk7XG4gICAgICB0aGlzLnNlbGVjdGVkRW50aXRpZXNJdGVtcyQubmV4dChjdXJyZW50KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRFbnRpdHlTdWJqZWN0JC5uZXh0KGVudGl0eSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdFNlbGVjdGlvbihzZWxlY3Rpb25PcHRpb25zPzogU2VsZWN0aW9uT3B0aW9ucywgYWRkU2VsZWN0ZWRJbmRpY2F0b3IgPSB0cnVlLCBldmVudFByaW9yaXR5PzogbnVtYmVyLCBtYXBJZD86IHN0cmluZykge1xuICAgIGNvbnN0IG1hcENvbXBvbmVudCA9IHRoaXMubWFwc01hbmFnZXIuZ2V0TWFwKG1hcElkKTtcbiAgICBpZiAoIW1hcENvbXBvbmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgPSBtYXBDb21wb25lbnQuZ2V0TWFwRXZlbnRzTWFuYWdlcigpO1xuXG4gICAgaWYgKCFzZWxlY3Rpb25PcHRpb25zKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHNlbGVjdGlvbk9wdGlvbnMsIHtldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDS30pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50U3Vic2NyaXB0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyU2VydmljZS5yZWdpc3Rlcih7XG4gICAgICBldmVudDogc2VsZWN0aW9uT3B0aW9ucy5ldmVudCxcbiAgICAgIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfT05FLFxuICAgICAgbW9kaWZpZXI6IHNlbGVjdGlvbk9wdGlvbnMubW9kaWZpZXIsXG4gICAgICBlbnRpdHlUeXBlOiBzZWxlY3Rpb25PcHRpb25zLmVudGl0eVR5cGUsXG4gICAgICBwcmlvcml0eTogZXZlbnRQcmlvcml0eSxcbiAgICB9KTtcblxuICAgIGV2ZW50U3Vic2NyaXB0aW9uLnBpcGUoXG4gICAgICBtYXAocmVzdWx0ID0+IHJlc3VsdC5lbnRpdGllcyksXG4gICAgICBmaWx0ZXIoZW50aXRpZXMgPT4gZW50aXRpZXMgJiYgZW50aXRpZXMubGVuZ3RoID4gMCkpXG4gICAgICAuc3Vic2NyaWJlKGVudGl0aWVzID0+IHtcbiAgICAgICAgY29uc3QgZW50aXR5ID0gZW50aXRpZXNbMF07XG4gICAgICAgIHRoaXMudG9nZ2xlU2VsZWN0aW9uKGVudGl0eSwgYWRkU2VsZWN0ZWRJbmRpY2F0b3IpO1xuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==