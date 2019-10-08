/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
var AcLabelComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcLabelComponent, _super);
    function AcLabelComponent(labelDrawer, mapLayers) {
        return _super.call(this, labelDrawer, mapLayers) || this;
    }
    AcLabelComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-label',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcLabelComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: MapLayersService }
    ]; };
    return AcLabelComponent;
}(EntityOnMapComponent));
export { AcLabelComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYWJlbC9hYy1sYWJlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJoRjtJQUlzQyw0Q0FBb0I7SUFFeEQsMEJBQVksV0FBK0IsRUFBRSxTQUEyQjtlQUN0RSxrQkFBTSxXQUFXLEVBQUUsU0FBUyxDQUFDO0lBQy9CLENBQUM7O2dCQVJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBekJRLGtCQUFrQjtnQkFDbEIsZ0JBQWdCOztJQThCekIsdUJBQUM7Q0FBQSxBQVRELENBSXNDLG9CQUFvQixHQUt6RDtTQUxZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IExhYmVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtZHJhd2VyL2xhYmVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBsYWJlbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgTGFiZWxHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9MYWJlbEdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1sYWJlbCBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgdGV4dDogJ2xhYmVsVGV4dCcsXG4gKiAgICBmb250OiAnMzBweCBzYW5zLXNlcmlmJyxcbiAqICAgIGZpbGxDb2xvciA6IGFxdWFtYXJpbmVcbiAqICB9XCI+XG4gKiAgPC9hYy1sYWJlbD47XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbGFiZWwnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjTGFiZWxDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IobGFiZWxEcmF3ZXI6IExhYmVsRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIobGFiZWxEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==