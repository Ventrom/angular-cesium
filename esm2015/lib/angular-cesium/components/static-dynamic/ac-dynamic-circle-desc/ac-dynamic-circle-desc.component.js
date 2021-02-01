import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service';
/**
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cesium.Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
let AcDynamicCircleDescComponent = class AcDynamicCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
};
AcDynamicCircleDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcDynamicCircleDescComponent = __decorate([
    Component({
        selector: 'ac-dynamic-circle-desc',
        template: ''
    }),
    __metadata("design:paramtypes", [DynamicEllipseDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcDynamicCircleDescComponent);
export { AcDynamicCircleDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MvYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx3RkFBd0YsQ0FBQztBQUVySTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBS0gsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNkIsU0FBUSxTQUFTO0lBQ3pELFlBQVksYUFBMEMsRUFBRSxZQUEwQixFQUN0RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVuRCxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0MsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRS9DLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFBOztZQWI0QiwyQkFBMkI7WUFBZ0IsWUFBWTtZQUNwRCxnQkFBZ0I7WUFBb0IsZ0JBQWdCOztBQUZ2RSw0QkFBNEI7SUFKeEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHdCQUF3QjtRQUNsQyxRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUM7cUNBRTJCLDJCQUEyQixFQUFnQixZQUFZO1FBQ3BELGdCQUFnQixFQUFvQixnQkFBZ0I7R0FGdkUsNEJBQTRCLENBY3hDO1NBZFksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLWNpcmNsZS1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIGR5bmFtaWMocG9zaXRpb24gaXMgdXBkYXRhYmxlKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBjaXJjbGUuXG4gX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1keW5hbWljLWNpcmNsZS1kZXNjIHByb3BzPVwie1xuICogICAgICBjZW50ZXI6IGRhdGEucG9zaXRpb24sXG4gKiAgICAgIHJhZGl1czogNVxuICogICAgICByb3RhdGlvbiA6IDAuNzg1Mzk4LFxuICogICAgICB3aWR0aDozLCAvLyBPcHRpb25hbFxuICogICAgICBncmFudWxhcml0eTowLjA4IC8vIE9wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAgICZsdDsvYWMtZHluYW1pYy1jaXJjbGUtZGVzYyZndDtcbiAqICBgYGBcbiAqXG4gKiAgX19wYXJhbV9fOiB7Q2VzaXVtLkNhcnRlc2lhbjN9IGNlbnRlclxuICogICBfX3BhcmFtX186IHtudW1iZXJ9IHJvdGF0aW9uXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gcmFkaXVzIGluIG1ldGVyc1xuICogICBfX3BhcmFtX186IHtudW1iZXJ9IFsxXSB3aWR0aFxuICogICBfX3BhcmFtX186IHtudW1iZXJ9IFswLjAwM10gZ3JhbnVsYXJpdHlcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZHluYW1pYy1jaXJjbGUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0R5bmFtaWNDaXJjbGVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSBzdXBlci5fcHJvcHNFdmFsdWF0b3IoY29udGV4dCk7XG5cbiAgICBjZXNpdW1Qcm9wcy5zZW1pTWFqb3JBeGlzID0gY2VzaXVtUHJvcHMucmFkaXVzO1xuICAgIGNlc2l1bVByb3BzLnNlbWlNaW5vckF4aXMgPSBjZXNpdW1Qcm9wcy5yYWRpdXM7XG5cbiAgICByZXR1cm4gY2VzaXVtUHJvcHM7XG4gIH1cbn1cbiJdfQ==