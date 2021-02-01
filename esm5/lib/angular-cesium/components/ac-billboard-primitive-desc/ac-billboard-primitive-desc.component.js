import { __decorate, __extends, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';
/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
var AcBillboardPrimitiveDescComponent = /** @class */ (function (_super) {
    __extends(AcBillboardPrimitiveDescComponent, _super);
    function AcBillboardPrimitiveDescComponent(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardPrimitiveDescComponent_1 = AcBillboardPrimitiveDescComponent;
    var AcBillboardPrimitiveDescComponent_1;
    AcBillboardPrimitiveDescComponent.ctorParameters = function () { return [
        { type: BillboardPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcBillboardPrimitiveDescComponent = AcBillboardPrimitiveDescComponent_1 = __decorate([
        Component({
            selector: 'ac-billboard-primitive-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcBillboardPrimitiveDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [BillboardPrimitiveDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcBillboardPrimitiveDescComponent);
    return AcBillboardPrimitiveDescComponent;
}(BasicDesc));
export { AcBillboardPrimitiveDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjL2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0sc0ZBQXNGLENBQUM7QUFFdkk7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBT0g7SUFBdUQscURBQVM7SUFFOUQsMkNBQVksd0JBQXlELEVBQUUsWUFBMEIsRUFDckYsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLHdCQUF3QixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUNuRixDQUFDOzBDQUxVLGlDQUFpQzs7O2dCQUVOLCtCQUErQjtnQkFBZ0IsWUFBWTtnQkFDbkUsZ0JBQWdCO2dCQUFvQixnQkFBZ0I7O0lBSHZFLGlDQUFpQztRQUw3QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsNkJBQTZCO1lBQ3ZDLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLG1DQUFpQyxFQUFqQyxDQUFpQyxDQUFDLEVBQUMsQ0FBQztTQUNwRyxDQUFDO3lDQUdzQywrQkFBK0IsRUFBZ0IsWUFBWTtZQUNuRSxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BSHZFLGlDQUFpQyxDQU03QztJQUFELHdDQUFDO0NBQUEsQUFORCxDQUF1RCxTQUFTLEdBTS9EO1NBTlksaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGJpbGxib2FyZCBwcmltaXRpdmUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQmlsbGJvYXJkLmh0bWxcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcbiAqICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICBzY2FsZTogdHJhY2suc2NhbGUsXG4gKiAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcbiAqICAgICAgbmFtZTogdHJhY2submFtZVxuICogICAgfVwiPlxuICogICAgPC9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2M+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY0JpbGxib2FyZFByaW1pdGl2ZURlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyOiBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGJpbGxib2FyZFByaW1pdGl2ZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19