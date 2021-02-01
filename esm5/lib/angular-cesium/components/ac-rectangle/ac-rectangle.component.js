import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { RectangleDrawerService } from '../../services/drawers/rectangle-dawer/rectangle-drawer.service';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a rectangle implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and RectangleGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-rectangle props="{
 *      coordinates: rectangle.coordinates,
 *      material: rectangle.material,
 *      height: rectangle.height
 *    }">
 *    </ac-rectangle>
 *  ```
 */
var AcRectangleComponent = /** @class */ (function (_super) {
    __extends(AcRectangleComponent, _super);
    function AcRectangleComponent(rectangleDrawer, mapLayers) {
        return _super.call(this, rectangleDrawer, mapLayers) || this;
    }
    AcRectangleComponent.ctorParameters = function () { return [
        { type: RectangleDrawerService },
        { type: MapLayersService }
    ]; };
    AcRectangleComponent = __decorate([
        Component({
            selector: 'ac-rectangle',
            template: ''
        }),
        __metadata("design:paramtypes", [RectangleDrawerService, MapLayersService])
    ], AcRectangleComponent);
    return AcRectangleComponent;
}(EntityOnMapComponent));
export { AcRectangleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcmVjdGFuZ2xlL2FjLXJlY3RhbmdsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDekcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFLSDtJQUEwQyx3Q0FBb0I7SUFDNUQsOEJBQVksZUFBdUMsRUFBRSxTQUEyQjtlQUM5RSxrQkFBTSxlQUFlLEVBQUUsU0FBUyxDQUFDO0lBQ25DLENBQUM7O2dCQUY0QixzQkFBc0I7Z0JBQWEsZ0JBQWdCOztJQURyRSxvQkFBb0I7UUFKaEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGNBQWM7WUFDeEIsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO3lDQUU2QixzQkFBc0IsRUFBYSxnQkFBZ0I7T0FEckUsb0JBQW9CLENBSWhDO0lBQUQsMkJBQUM7Q0FBQSxBQUpELENBQTBDLG9CQUFvQixHQUk3RDtTQUpZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcmVjdGFuZ2xlLWRhd2VyL3JlY3RhbmdsZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHJlY3RhbmdsZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgUmVjdGFuZ2xlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUmVjdGFuZ2xlR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtcmVjdGFuZ2xlIHByb3BzPVwie1xuICogICAgICBjb29yZGluYXRlczogcmVjdGFuZ2xlLmNvb3JkaW5hdGVzLFxuICogICAgICBtYXRlcmlhbDogcmVjdGFuZ2xlLm1hdGVyaWFsLFxuICogICAgICBoZWlnaHQ6IHJlY3RhbmdsZS5oZWlnaHRcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtcmVjdGFuZ2xlPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1yZWN0YW5nbGUnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNSZWN0YW5nbGVDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHJlY3RhbmdsZURyYXdlcjogUmVjdGFuZ2xlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIocmVjdGFuZ2xlRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=