import { __decorate, __metadata } from "tslib";
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
let AcDynamicEllipseDescComponent = class AcDynamicEllipseDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
};
AcDynamicEllipseDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcDynamicEllipseDescComponent = __decorate([
    Component({
        selector: 'ac-dynamic-ellipse-desc',
        template: ''
    }),
    __metadata("design:paramtypes", [DynamicEllipseDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcDynamicEllipseDescComponent);
export { AcDynamicEllipseDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx3RkFBd0YsQ0FBQztBQUVySTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBS0gsSUFBYSw2QkFBNkIsR0FBMUMsTUFBYSw2QkFBOEIsU0FBUSxTQUFTO0lBQzFELFlBQVksYUFBMEMsRUFBRSxZQUEwQixFQUN0RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0NBQ0YsQ0FBQTs7WUFKNEIsMkJBQTJCO1lBQWdCLFlBQVk7WUFDcEQsZ0JBQWdCO1lBQW9CLGdCQUFnQjs7QUFGdkUsNkJBQTZCO0lBSnpDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSx5QkFBeUI7UUFDbkMsUUFBUSxFQUFFLEVBQUU7S0FDYixDQUFDO3FDQUUyQiwyQkFBMkIsRUFBZ0IsWUFBWTtRQUNwRCxnQkFBZ0IsRUFBb0IsZ0JBQWdCO0dBRnZFLDZCQUE2QixDQUt6QztTQUxZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqXG4gKlxuICogIFRoaXMgaXMgYSBkeW5hbWljKHBvc2l0aW9uIGlzIHVwZGF0YWJsZSkgaW1wbGVtZW50YXRpb24gb2YgYW4gZWxsaXBzZS5cbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1keW5hbWljLWVsbGlwc2UtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgY2VudGVyOiBkYXRhLnBvc2l0aW9uLFxuICogICAgICBzZW1pTWFqb3JBeGlzOjI1MDAwMC4wLFxuICogICAgICBzZW1pTWlub3JBeGlzOjQwMDAwMC4wLFxuICogICAgICByb3RhdGlvbiA6IDAuNzg1Mzk4LFxuICogICAgICB3aWR0aDozLCAvLyBPcHRpb25hbFxuICogICAgICBncmFudWxhcml0eTowLjA4IC8vIE9wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAgIFwiPlxuICogICAgJmx0Oy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYyZndDtcbiAqICBgYGBcbiAqICBfX3BhcmFtOl9fIHtDZXNpdW0uQ2FydGVzaWFuM30gY2VudGVyXG4gKiAgX19wYXJhbTpfXyB7bnVtYmVyfSBzZW1pTWFqb3JBeGlzXG4gKiAgX19wYXJhbTpfXyB7bnVtYmVyfSBzZW1pTWlub3JBeGlzXG4gKiAgX19wYXJhbTpfXyB7bnVtYmVyfSByb3RhdGlvblxuICogICBfX3BhcmFtX186IHtudW1iZXJ9IFsxXSB3aWR0aFxuICogICBfX3BhcmFtX186IHtudW1iZXJ9IFswLjAwM10gZ3JhbnVsYXJpdHlcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjRHluYW1pY0VsbGlwc2VEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==