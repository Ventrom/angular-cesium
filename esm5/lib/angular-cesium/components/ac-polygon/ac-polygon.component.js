import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
var AcPolygonComponent = /** @class */ (function (_super) {
    __extends(AcPolygonComponent, _super);
    function AcPolygonComponent(polygonDrawer, mapLayers) {
        return _super.call(this, polygonDrawer, mapLayers) || this;
    }
    AcPolygonComponent.ctorParameters = function () { return [
        { type: PolygonDrawerService },
        { type: MapLayersService }
    ]; };
    AcPolygonComponent = __decorate([
        Component({
            selector: 'ac-polygon',
            template: ''
        }),
        __metadata("design:paramtypes", [PolygonDrawerService, MapLayersService])
    ], AcPolygonComponent);
    return AcPolygonComponent;
}(EntityOnMapComponent));
export { AcPolygonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWdvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvbHlnb24vYWMtcG9seWdvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBS0g7SUFBd0Msc0NBQW9CO0lBQzFELDRCQUFZLGFBQW1DLEVBQUUsU0FBMkI7ZUFDMUUsa0JBQU0sYUFBYSxFQUFFLFNBQVMsQ0FBQztJQUNqQyxDQUFDOztnQkFGMEIsb0JBQW9CO2dCQUFhLGdCQUFnQjs7SUFEakUsa0JBQWtCO1FBSjlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQzt5Q0FFMkIsb0JBQW9CLEVBQWEsZ0JBQWdCO09BRGpFLGtCQUFrQixDQUk5QjtJQUFELHlCQUFDO0NBQUEsQUFKRCxDQUF3QyxvQkFBb0IsR0FJM0Q7U0FKWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgcG9seWdvbiBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgX1NldCBgaGVpZ2h0YCBwcm9wIGZvciBwZXJmb3JtYW5jZSBlbmhhbmNlbWVudF9cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBQb2x5Z29uR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9seWdvbkdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICAgPGFjLXBvbHlnb24gcHJvcHM9XCJ7XG4gKiAgICAgIGhpZXJhcmNoeTogcG9seWdvbi5oaWVyYXJjaHksXG4gKiAgICAgIG1hdGVyaWFsOiBwb2x5Z29uLm1hdGVyaWFsLFxuICogICAgICBoZWlnaHQ6IHBvbHlnb24uaGVpZ2h0XG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLXBvbHlnb24+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvbHlnb24nLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjUG9seWdvbkNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocG9seWdvbkRyYXdlcjogUG9seWdvbkRyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKHBvbHlnb25EcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==