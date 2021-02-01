import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-ellipse [props]="{
 *    position: position,
 *    semiMajorAxis:40000.0,
 *    semiMinorAxis:25000.0,
 *    rotation : 0.785398
 *  }">
 *  </ac-ellipse>
 *  ```
 */
var AcEllipseComponent = /** @class */ (function (_super) {
    __extends(AcEllipseComponent, _super);
    function AcEllipseComponent(ellipseDrawer, mapLayers) {
        return _super.call(this, ellipseDrawer, mapLayers) || this;
    }
    AcEllipseComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    AcEllipseComponent = __decorate([
        Component({
            selector: 'ac-ellipse',
            template: ''
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, MapLayersService])
    ], AcEllipseComponent);
    return AcEllipseComponent;
}(EntityOnMapComponent));
export { AcEllipseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWVsbGlwc2UvYWMtZWxsaXBzZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBTUg7SUFBd0Msc0NBQW9CO0lBRTFELDRCQUFZLGFBQW1DLEVBQUUsU0FBMkI7ZUFDMUUsa0JBQU0sYUFBYSxFQUFFLFNBQVMsQ0FBQztJQUNqQyxDQUFDOztnQkFGMEIsb0JBQW9CO2dCQUFhLGdCQUFnQjs7SUFGakUsa0JBQWtCO1FBSjlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQzt5Q0FHMkIsb0JBQW9CLEVBQWEsZ0JBQWdCO09BRmpFLGtCQUFrQixDQUs5QjtJQUFELHlCQUFDO0NBQUEsQUFMRCxDQUF3QyxvQkFBb0IsR0FLM0Q7U0FMWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGVsbGlwc2UgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIEVsbGlwc2VHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbGxpcHNlR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLWVsbGlwc2UgW3Byb3BzXT1cIntcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgIHNlbWlNYWpvckF4aXM6NDAwMDAuMCxcbiAqICAgIHNlbWlNaW5vckF4aXM6MjUwMDAuMCxcbiAqICAgIHJvdGF0aW9uIDogMC43ODUzOThcbiAqICB9XCI+XG4gKiAgPC9hYy1lbGxpcHNlPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWVsbGlwc2UnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjRWxsaXBzZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBFbGxpcHNlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbWFwTGF5ZXJzKTtcbiAgfVxufVxuIl19