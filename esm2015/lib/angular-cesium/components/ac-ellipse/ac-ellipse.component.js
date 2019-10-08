/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class AcEllipseComponent extends EntityOnMapComponent {
    /**
     * @param {?} ellipseDrawer
     * @param {?} mapLayers
     */
    constructor(ellipseDrawer, mapLayers) {
        super(ellipseDrawer, mapLayers);
    }
}
AcEllipseComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipse',
                template: ''
            }] }
];
/** @nocollapse */
AcEllipseComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWVsbGlwc2UvYWMtZWxsaXBzZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QmhGLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxvQkFBb0I7Ozs7O0lBRTFELFlBQVksYUFBbUMsRUFBRSxTQUEyQjtRQUMxRSxLQUFLLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQXpCUSxvQkFBb0I7WUFDcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBlbGxpcHNlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1lbGxpcHNlIFtwcm9wc109XCJ7XG4gKiAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gKiAgICBzZW1pTWFqb3JBeGlzOjQwMDAwLjAsXG4gKiAgICBzZW1pTWlub3JBeGlzOjI1MDAwLjAsXG4gKiAgICByb3RhdGlvbiA6IDAuNzg1Mzk4XG4gKiAgfVwiPlxuICogIDwvYWMtZWxsaXBzZT5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1lbGxpcHNlJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0VsbGlwc2VDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==