import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service';
/**
 *
 *
 *  This is a dynamic(position is updatable) implementation of an ellipse.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-dynamic-ellipse-desc props="{
 *      center: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    ">
 *    &lt;/ac-dynamic-ellipse-desc&gt;
 *  ```
 *  __param:__ {Cesium.Cartesian3} center
 *  __param:__ {number} semiMajorAxis
 *  __param:__ {number} semiMinorAxis
 *  __param:__ {number} rotation
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
var AcDynamicEllipseDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicEllipseDescComponent, _super);
    function AcDynamicEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicEllipseDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcDynamicEllipseDescComponent = __decorate([
        Component({
            selector: 'ac-dynamic-ellipse-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [DynamicEllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcDynamicEllipseDescComponent);
    return AcDynamicEllipseDescComponent;
}(BasicDesc));
export { AcDynamicEllipseDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx3RkFBd0YsQ0FBQztBQUVySTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBS0g7SUFBbUQsaURBQVM7SUFDMUQsdUNBQVksYUFBMEMsRUFBRSxZQUEwQixFQUN0RSxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RSxDQUFDOztnQkFIMEIsMkJBQTJCO2dCQUFnQixZQUFZO2dCQUNwRCxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFGdkUsNkJBQTZCO1FBSnpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO3lDQUUyQiwyQkFBMkIsRUFBZ0IsWUFBWTtZQUNwRCxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BRnZFLDZCQUE2QixDQUt6QztJQUFELG9DQUFDO0NBQUEsQUFMRCxDQUFtRCxTQUFTLEdBSzNEO1NBTFksNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICpcbiAqXG4gKiAgVGhpcyBpcyBhIGR5bmFtaWMocG9zaXRpb24gaXMgdXBkYXRhYmxlKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBlbGxpcHNlLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjIHByb3BzPVwie1xuICogICAgICBjZW50ZXI6IGRhdGEucG9zaXRpb24sXG4gKiAgICAgIHNlbWlNYWpvckF4aXM6MjUwMDAwLjAsXG4gKiAgICAgIHNlbWlNaW5vckF4aXM6NDAwMDAwLjAsXG4gKiAgICAgIHJvdGF0aW9uIDogMC43ODUzOTgsXG4gKiAgICAgIHdpZHRoOjMsIC8vIE9wdGlvbmFsXG4gKiAgICAgIGdyYW51bGFyaXR5OjAuMDggLy8gT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICAgXCI+XG4gKiAgICAmbHQ7L2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjJmd0O1xuICogIGBgYFxuICogIF9fcGFyYW06X18ge0Nlc2l1bS5DYXJ0ZXNpYW4zfSBjZW50ZXJcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHNlbWlNYWpvckF4aXNcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHNlbWlNaW5vckF4aXNcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHJvdGF0aW9uXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzFdIHdpZHRoXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzAuMDAzXSBncmFudWxhcml0eVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1keW5hbWljLWVsbGlwc2UtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNEeW5hbWljRWxsaXBzZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19