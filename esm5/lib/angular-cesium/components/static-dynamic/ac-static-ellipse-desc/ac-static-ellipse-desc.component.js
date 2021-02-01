import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import { StaticEllipseDrawerService } from '../../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service';
/**
 *
 * @deprecated use ac-ellipse-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an ellipse.
 *  __usage:__
 *  ```
 *  &lt;ac-static-ellipse-desc-desc
 *      geometryProps="{
 *          center: ellipse.geometry.center,
 *          semiMajorAxis: ellipse.geometry.semiMajorAxis,
 *          semiMinorAxis: ellipse.geometry.semiMinorAxis,
 *          height: ellipse.geometry.height,
 *          rotation: ellipse.geometry.rotation
 *      }"
 *      instanceProps="{
 *          attributes: ellipse.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: ellipse.appearance //Optional
 *      }"&gt;
 *  &lt;/ac-static-ellipse-desc-desc&gt;
 *  ```
 */
var AcStaticEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticEllipseDescComponent, _super);
    function AcStaticEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticEllipseDescComponent.ctorParameters = function () { return [
        { type: StaticEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticEllipseDescComponent = __decorate([
        Component({
            selector: 'ac-static-ellipse-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticEllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticEllipseDescComponent);
    return AcStaticEllipseDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticEllipseDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGdGQUFnRixDQUFDO0FBRTVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUtIO0lBQWtELGdEQUF3QjtJQUN4RSxzQ0FBWSxhQUF5QyxFQUFFLFlBQTBCLEVBQ3JFLGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ3hFLENBQUM7O2dCQUgwQiwwQkFBMEI7Z0JBQWdCLFlBQVk7Z0JBQ25ELGdCQUFnQjtnQkFBb0IsZ0JBQWdCOztJQUZ2RSw0QkFBNEI7UUFKeEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUM7eUNBRTJCLDBCQUEwQixFQUFnQixZQUFZO1lBQ25ELGdCQUFnQixFQUFvQixnQkFBZ0I7T0FGdkUsNEJBQTRCLENBS3hDO0lBQUQsbUNBQUM7Q0FBQSxBQUxELENBQWtELHdCQUF3QixHQUt6RTtTQUxZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtZWxsaXBzZS1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyAocG9zaXRpb24sIGNvbG9yLCBldGMuLiBhcmUgbm90IHVwZGF0ZWQpIGltcGxlbWVudGF0aW9uIG9mIGFuIGVsbGlwc2UuXG4gKiAgX191c2FnZTpfX1xuICogIGBgYFxuICogICZsdDthYy1zdGF0aWMtZWxsaXBzZS1kZXNjLWRlc2NcbiAqICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogZWxsaXBzZS5nZW9tZXRyeS5jZW50ZXIsXG4gKiAgICAgICAgICBzZW1pTWFqb3JBeGlzOiBlbGxpcHNlLmdlb21ldHJ5LnNlbWlNYWpvckF4aXMsXG4gKiAgICAgICAgICBzZW1pTWlub3JBeGlzOiBlbGxpcHNlLmdlb21ldHJ5LnNlbWlNaW5vckF4aXMsXG4gKiAgICAgICAgICBoZWlnaHQ6IGVsbGlwc2UuZ2VvbWV0cnkuaGVpZ2h0LFxuICogICAgICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2VvbWV0cnkucm90YXRpb25cbiAqICAgICAgfVwiXG4gKiAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhdHRyaWJ1dGVzOiBlbGxpcHNlLmF0dHJpYnV0ZXMgLy9PcHRpb25hbFxuICogICAgICB9XCJcbiAqICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBlbGxpcHNlLmFwcGVhcmFuY2UgLy9PcHRpb25hbFxuICogICAgICB9XCImZ3Q7XG4gKiAgJmx0Oy9hYy1zdGF0aWMtZWxsaXBzZS1kZXNjLWRlc2MmZ3Q7XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==