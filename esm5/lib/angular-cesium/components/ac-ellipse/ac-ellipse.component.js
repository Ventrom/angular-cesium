/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(AcEllipseComponent, _super);
    function AcEllipseComponent(ellipseDrawer, mapLayers) {
        return _super.call(this, ellipseDrawer, mapLayers) || this;
    }
    AcEllipseComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-ellipse',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcEllipseComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    return AcEllipseComponent;
}(EntityOnMapComponent));
export { AcEllipseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWVsbGlwc2UvYWMtZWxsaXBzZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJoRjtJQUl3Qyw4Q0FBb0I7SUFFMUQsNEJBQVksYUFBbUMsRUFBRSxTQUEyQjtlQUMxRSxrQkFBTSxhQUFhLEVBQUUsU0FBUyxDQUFDO0lBQ2pDLENBQUM7O2dCQVJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBekJRLG9CQUFvQjtnQkFDcEIsZ0JBQWdCOztJQThCekIseUJBQUM7Q0FBQSxBQVRELENBSXdDLG9CQUFvQixHQUszRDtTQUxZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gZWxsaXBzZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgRWxsaXBzZUdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc2VHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtZWxsaXBzZSBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgc2VtaU1ham9yQXhpczo0MDAwMC4wLFxuICogICAgc2VtaU1pbm9yQXhpczoyNTAwMC4wLFxuICogICAgcm90YXRpb24gOiAwLjc4NTM5OFxuICogIH1cIj5cbiAqICA8L2FjLWVsbGlwc2U+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZWxsaXBzZScsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNFbGxpcHNlQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=