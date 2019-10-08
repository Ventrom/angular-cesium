/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
/**
 *  This is a polyline primitive implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-primitive-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-primitive-desc>
 * ```
 */
var AcPolylinePrimitiveDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcPolylinePrimitiveDescComponent, _super);
    function AcPolylinePrimitiveDescComponent(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylinePrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcPolylinePrimitiveDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcPolylinePrimitiveDescComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolylinePrimitiveDescComponent;
}(BasicDesc));
export { AcPolylinePrimitiveDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYy9hYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG9GQUFvRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQWtCcEk7SUFLc0QsNERBQVM7SUFFN0QsMENBQVksOEJBQThELEVBQUUsWUFBMEIsRUFDMUYsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLDhCQUE4QixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN6RixDQUFDOztnQkFWRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVOzs7NEJBQUMsY0FBTSxPQUFBLGdDQUFnQyxFQUFoQyxDQUFnQyxFQUFDLEVBQUMsQ0FBQztpQkFDbkc7Ozs7Z0JBdEJRLDhCQUE4QjtnQkFIOUIsWUFBWTtnQkFDWixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjs7SUE4QnpCLHVDQUFDO0NBQUEsQUFYRCxDQUtzRCxTQUFTLEdBTTlEO1NBTlksZ0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvbHlsaW5lIHByaW1pdGl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIFBvbHlsaW5lIFByaW1pdGl2ZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvbHlsaW5lLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICAgPGFjLXBvbHlsaW5lLXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xuICogICAgICB3aWR0aCA6IHBvbHlsaW5lLndpZHRoLFxuICogICAgICBwb3NpdGlvbnM6IHBvbHlsaW5lLnBvc2l0aW9ucyxcbiAqICAgICAgbWF0ZXJpYWw6IHBvbHlsaW5lLm1hdGVyaWFsXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLXBvbHlsaW5lLXByaW1pdGl2ZS1kZXNjPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvbHlsaW5lLXByaW1pdGl2ZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY1BvbHlsaW5lUHJpbWl0aXZlRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNQb2x5bGluZVByaW1pdGl2ZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZTogUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19