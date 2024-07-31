import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/rectangle-dawer/rectangle-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
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
export class AcRectangleComponent extends EntityOnMapComponent {
    constructor(rectangleDrawer, mapLayers) {
        super(rectangleDrawer, mapLayers);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcRectangleComponent, deps: [{ token: i1.RectangleDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcRectangleComponent, selector: "ac-rectangle", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcRectangleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-rectangle',
                    template: ''
                }]
        }], ctorParameters: () => [{ type: i1.RectangleDrawerService }, { type: i2.MapLayersService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1yZWN0YW5nbGUvYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBRzVGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBS0gsTUFBTSxPQUFPLG9CQUFxQixTQUFRLG9CQUFvQjtJQUM1RCxZQUFZLGVBQXVDLEVBQUUsU0FBMkI7UUFDOUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDOzhHQUhVLG9CQUFvQjtrR0FBcEIsb0JBQW9CLDJFQUZyQixFQUFFOzsyRkFFRCxvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgcmVjdGFuZ2xlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBSZWN0YW5nbGVHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9SZWN0YW5nbGVHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1yZWN0YW5nbGUgcHJvcHM9XCJ7XG4gKiAgICAgIGNvb3JkaW5hdGVzOiByZWN0YW5nbGUuY29vcmRpbmF0ZXMsXG4gKiAgICAgIG1hdGVyaWFsOiByZWN0YW5nbGUubWF0ZXJpYWwsXG4gKiAgICAgIGhlaWdodDogcmVjdGFuZ2xlLmhlaWdodFxuICogICAgfVwiPlxuICogICAgPC9hYy1yZWN0YW5nbGU+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXJlY3RhbmdsZScsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1JlY3RhbmdsZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocmVjdGFuZ2xlRHJhd2VyOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihyZWN0YW5nbGVEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==