import { __decorate, __metadata } from "tslib";
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
let AcRectangleComponent = class AcRectangleComponent extends EntityOnMapComponent {
    constructor(rectangleDrawer, mapLayers) {
        super(rectangleDrawer, mapLayers);
    }
};
AcRectangleComponent.ctorParameters = () => [
    { type: RectangleDrawerService },
    { type: MapLayersService }
];
AcRectangleComponent = __decorate([
    Component({
        selector: 'ac-rectangle',
        template: ''
    }),
    __metadata("design:paramtypes", [RectangleDrawerService, MapLayersService])
], AcRectangleComponent);
export { AcRectangleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcmVjdGFuZ2xlL2FjLXJlY3RhbmdsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDekcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFLSCxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFxQixTQUFRLG9CQUFvQjtJQUM1RCxZQUFZLGVBQXVDLEVBQUUsU0FBMkI7UUFDOUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0YsQ0FBQTs7WUFIOEIsc0JBQXNCO1lBQWEsZ0JBQWdCOztBQURyRSxvQkFBb0I7SUFKaEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLEVBQUU7S0FDYixDQUFDO3FDQUU2QixzQkFBc0IsRUFBYSxnQkFBZ0I7R0FEckUsb0JBQW9CLENBSWhDO1NBSlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgcmVjdGFuZ2xlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBSZWN0YW5nbGVHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9SZWN0YW5nbGVHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1yZWN0YW5nbGUgcHJvcHM9XCJ7XG4gKiAgICAgIGNvb3JkaW5hdGVzOiByZWN0YW5nbGUuY29vcmRpbmF0ZXMsXG4gKiAgICAgIG1hdGVyaWFsOiByZWN0YW5nbGUubWF0ZXJpYWwsXG4gKiAgICAgIGhlaWdodDogcmVjdGFuZ2xlLmhlaWdodFxuICogICAgfVwiPlxuICogICAgPC9hYy1yZWN0YW5nbGU+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXJlY3RhbmdsZScsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1JlY3RhbmdsZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocmVjdGFuZ2xlRHJhd2VyOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihyZWN0YW5nbGVEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==