import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import { StaticCircleDrawerService } from '../../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service';
/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
var AcStaticCircleDescComponent = /** @class */ (function (_super) {
    __extends(AcStaticCircleDescComponent, _super);
    function AcStaticCircleDescComponent(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, staticCircleDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticCircleDescComponent.ctorParameters = function () { return [
        { type: StaticCircleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcStaticCircleDescComponent = __decorate([
        Component({
            selector: 'ac-static-circle',
            template: ''
        }),
        __metadata("design:paramtypes", [StaticCircleDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcStaticCircleDescComponent);
    return AcStaticCircleDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticCircleDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWNpcmNsZS1kZXNjL2FjLXN0YXRpYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDRGQUE0RixDQUFDO0FBRXZJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBS0g7SUFBaUQsK0NBQXdCO0lBQ3ZFLHFDQUFZLGtCQUE2QyxFQUFFLFlBQTBCLEVBQ3pFLGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDN0UsQ0FBQzs7Z0JBSCtCLHlCQUF5QjtnQkFBZ0IsWUFBWTtnQkFDdkQsZ0JBQWdCO2dCQUFvQixnQkFBZ0I7O0lBRnZFLDJCQUEyQjtRQUp2QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQzt5Q0FFZ0MseUJBQXlCLEVBQWdCLFlBQVk7WUFDdkQsZ0JBQWdCLEVBQW9CLGdCQUFnQjtPQUZ2RSwyQkFBMkIsQ0FLdkM7SUFBRCxrQ0FBQztDQUFBLEFBTEQsQ0FBaUQsd0JBQXdCLEdBS3hFO1NBTFksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtY2lyY2xlLWRlc2NcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyAocG9zaXRpb24sIGNvbG9yLCBldGMuLiBhcmUgbm90IHVwZGF0ZWQpIGltcGxlbWVudGF0aW9uIG9mIGFuIGNpcmNsZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtc3RhdGljLWNpcmNsZS1kZXNjXG4gKiAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGNpcmNsZS5nZW9tZXRyeS5jZW50ZXIsXG4gKiAgICAgICAgICByYWRpdXM6IGNpcmNsZS5nZW9tZXRyeS5yYWRpdXMsXG4gKiAgICAgIH1cIlxuICogICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogY2lyY2xlLmF0dHJpYnV0ZXMgLy9PcHRpb25hbFxuICogICAgICB9XCJcbiAqICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBjaXJjbGUuYXBwZWFyYW5jZSAvL09wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAgICZsdDsvYWMtc3RhdGljLWNpcmNsZS1kZXNjJmd0O1xuICogICAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1jaXJjbGUnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNDaXJjbGVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3Ioc3RhdGljQ2lyY2xlRHJhd2VyOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHN0YXRpY0NpcmNsZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19