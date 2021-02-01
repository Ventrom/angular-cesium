import { __decorate, __extends, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CylinderDrawerService } from '../../services/drawers/cylinder-dawer/cylinder-drawer.service';
/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CylinderGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-cylinder-desc props="{
 *     show : cylinder.show, //optional
 *     position : cylinder.position,
 *     material : cylinder.color  //optional
 *   }">
 *   </ac-cylinder-desc>
 *  ```
 */
var AcCylinderDescComponent = /** @class */ (function (_super) {
    __extends(AcCylinderDescComponent, _super);
    function AcCylinderDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcCylinderDescComponent_1 = AcCylinderDescComponent;
    var AcCylinderDescComponent_1;
    AcCylinderDescComponent.ctorParameters = function () { return [
        { type: CylinderDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCylinderDescComponent = AcCylinderDescComponent_1 = __decorate([
        Component({
            selector: 'ac-cylinder-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcCylinderDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [CylinderDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCylinderDescComponent);
    return AcCylinderDescComponent;
}(BasicDesc));
export { AcCylinderDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY3lsaW5kZXItZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWN5bGluZGVyLWRlc2MvYWMtY3lsaW5kZXItZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFFdEc7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBTUg7SUFBNkMsMkNBQVM7SUFFcEQsaUNBQVksYUFBb0MsRUFBRSxZQUEwQixFQUNoRSxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RSxDQUFDO2dDQUxVLHVCQUF1Qjs7O2dCQUVQLHFCQUFxQjtnQkFBZ0IsWUFBWTtnQkFDOUMsZ0JBQWdCO2dCQUFvQixnQkFBZ0I7O0lBSHZFLHVCQUF1QjtRQUxuQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsa0JBQWtCO1lBQzVCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF1QixFQUF2QixDQUF1QixDQUFDLEVBQUMsQ0FBQztTQUMxRixDQUFDO3lDQUcyQixxQkFBcUIsRUFBZ0IsWUFBWTtZQUM5QyxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BSHZFLHVCQUF1QixDQU1uQztJQUFELDhCQUFDO0NBQUEsQUFORCxDQUE2QyxTQUFTLEdBTXJEO1NBTlksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDeWxpbmRlckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvaW50IGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1ib3gtZGVzYyBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBQb2ludEdyYXBoaWNzIGFuZCB0aGUgZ2VuZXJhbCBwcm9wZXJ0aWVzXG4gKiAgb2YgRW50aXR5IChsaWtlIGBwb3NpdGlvbmApXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ3lsaW5kZXJHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgPGFjLWN5bGluZGVyLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgc2hvdyA6IGN5bGluZGVyLnNob3csIC8vb3B0aW9uYWxcbiAqICAgICBwb3NpdGlvbiA6IGN5bGluZGVyLnBvc2l0aW9uLFxuICogICAgIG1hdGVyaWFsIDogY3lsaW5kZXIuY29sb3IgIC8vb3B0aW9uYWxcbiAqICAgfVwiPlxuICogICA8L2FjLWN5bGluZGVyLWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWN5bGluZGVyLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQ3lsaW5kZXJEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0N5bGluZGVyRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoZHJhd2VyU2VydmljZTogQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGRyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==