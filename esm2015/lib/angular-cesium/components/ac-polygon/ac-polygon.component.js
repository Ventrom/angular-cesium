/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class AcPolygonComponent extends EntityOnMapComponent {
    /**
     * @param {?} polygonDrawer
     * @param {?} mapLayers
     */
    constructor(polygonDrawer, mapLayers) {
        super(polygonDrawer, mapLayers);
    }
}
AcPolygonComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polygon',
                template: ''
            }] }
];
/** @nocollapse */
AcPolygonComponent.ctorParameters = () => [
    { type: PolygonDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWdvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvbHlnb24vYWMtcG9seWdvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QmhGLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxvQkFBb0I7Ozs7O0lBQzFELFlBQVksYUFBbUMsRUFBRSxTQUEyQjtRQUMxRSxLQUFLLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQVBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQXpCUSxvQkFBb0I7WUFFcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvbHlnb24gaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIF9TZXQgYGhlaWdodGAgcHJvcCBmb3IgcGVyZm9ybWFuY2UgZW5oYW5jZW1lbnRfXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgUG9seWdvbkdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvbHlnb25HcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1wb2x5Z29uIHByb3BzPVwie1xuICogICAgICBoaWVyYXJjaHk6IHBvbHlnb24uaGllcmFyY2h5LFxuICogICAgICBtYXRlcmlhbDogcG9seWdvbi5tYXRlcmlhbCxcbiAqICAgICAgaGVpZ2h0OiBwb2x5Z29uLmhlaWdodFxuICogICAgfVwiPlxuICogICAgPC9hYy1wb2x5Z29uPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1wb2x5Z29uJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1BvbHlnb25Db21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHBvbHlnb25EcmF3ZXI6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihwb2x5Z29uRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=