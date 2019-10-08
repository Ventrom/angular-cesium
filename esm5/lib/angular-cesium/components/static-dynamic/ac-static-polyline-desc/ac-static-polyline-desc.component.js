/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// tslint:disable
import { Component } from '@angular/core';
import { StaticPolylineDrawerService } from '../../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
// tslint:enable
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new Cesium.PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
var AcStaticPolylineDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcStaticPolylineDescComponent, _super);
    function AcStaticPolylineDescComponent(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolylineDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-polyline-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticPolylineDescComponent.ctorParameters = function () { return [
        { type: StaticPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticPolylineDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticPolylineDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtcG9seWxpbmUtZGVzYy9hYy1zdGF0aWMtcG9seWxpbmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxnR0FBZ0csQ0FBQztBQUM3SSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJ0SDtJQUltRCx5REFBd0I7SUFDekUsdUNBQVkscUJBQWtELEVBQUUsWUFBMEIsRUFDOUUsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLHFCQUFxQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUNoRixDQUFDOztnQkFSRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBaENRLDJCQUEyQjtnQkFDM0IsWUFBWTtnQkFFWixnQkFBZ0I7Z0JBRGhCLGdCQUFnQjs7SUFvQ3pCLG9DQUFDO0NBQUEsQUFURCxDQUltRCx3QkFBd0IsR0FLMUU7U0FMWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcblxuLy8gdHNsaW50OmVuYWJsZVxuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1wbG95bGluZS1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyBpbXBsZW1lbnRhdGlvbiBvZiBhbiBwb2x5bGluZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHRhYy1zdGF0aWMtcG9seWxpbmUtZGVzY1xuICogICAgICAgICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgICBcdHdpZHRoOiBwb2x5Lmdlb21ldHJ5LndpZHRoLFxuICogICAgICAgICAgICBcdHBvc2l0aW9uczogcG9seS5nZW9tZXRyeS5wb3NpdGlvbnNcbiAqICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICogICAgICAgICAgICAgICAgICBDZXNpdW0uQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLmZyb21Db2xvcihDZXNpdW0uQ29sb3IuZnJvbVJhbmRvbSgpKVxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgICAgIGFwcGVhcmFuY2U6IG5ldyBDZXNpdW0uUG9seWxpbmVDb2xvckFwcGVhcmFuY2UoKVxuICogICAgfVwiJmd0Jmx0L2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjJmd0XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjU3RhdGljUG9seWxpbmVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIocG9seWxpbmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=