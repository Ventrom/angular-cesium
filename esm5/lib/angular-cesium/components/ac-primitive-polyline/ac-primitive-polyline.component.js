/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
var AcPrimitivePolylineComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcPrimitivePolylineComponent, _super);
    function AcPrimitivePolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPrimitivePolylineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-primitive-polyline',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPrimitivePolylineComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: MapLayersService }
    ]; };
    return AcPrimitivePolylineComponent;
}(EntityOnMapComponent));
export { AcPrimitivePolylineComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcHJpbWl0aXZlLXBvbHlsaW5lL2FjLXByaW1pdGl2ZS1wb2x5bGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG9GQUFvRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQnBJO0lBSWtELHdEQUFvQjtJQUVwRSxzQ0FBWSxjQUE4QyxFQUFFLFNBQTJCO2VBQ3JGLGtCQUFNLGNBQWMsRUFBRSxTQUFTLENBQUM7SUFDbEMsQ0FBQzs7Z0JBUkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFFBQVEsRUFBRSxFQUFFO2lCQUNiOzs7O2dCQXZCUSw4QkFBOEI7Z0JBRDlCLGdCQUFnQjs7SUE4QnpCLG1DQUFDO0NBQUEsQUFURCxDQUlrRCxvQkFBb0IsR0FLckU7U0FMWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2x5bGluZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIFBvbHlsaW5lIFByaW1pdGl2ZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvbHlsaW5lLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1wb2x5bGluZSBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgdGV4dDogJ2xhYmVsVGV4dCcsXG4gKiAgICBmb250OiAnMzBweCBzYW5zLXNlcmlmJ1xuICogICAgY29sb3I6IENlc2l1bS5Db2xvci5HUkVFTlxuICogIH1cIj47XG4gKiAgPC9hYy1wb2x5bGluZT5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1wcmltaXRpdmUtcG9seWxpbmUnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjUHJpbWl0aXZlUG9seWxpbmVDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXI6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIocG9seWxpbmVEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==