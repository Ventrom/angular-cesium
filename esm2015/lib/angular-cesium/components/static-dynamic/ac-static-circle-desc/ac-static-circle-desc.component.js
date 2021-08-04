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
export class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-circle',
                template: ''
            },] }
];
AcStaticCircleDescComponent.ctorParameters = () => [
    { type: StaticCircleDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MvYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUN0SCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0RkFBNEYsQ0FBQztBQUV2STs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUtILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7SUFDdkUsWUFBWSxrQkFBNkMsRUFBRSxZQUEwQixFQUN6RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzlFLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUUsRUFBRTthQUNiOzs7WUF6QlEseUJBQXlCO1lBSnpCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtY2lyY2xlLWRlc2NcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyAocG9zaXRpb24sIGNvbG9yLCBldGMuLiBhcmUgbm90IHVwZGF0ZWQpIGltcGxlbWVudGF0aW9uIG9mIGFuIGNpcmNsZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtc3RhdGljLWNpcmNsZS1kZXNjXG4gKiAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGNpcmNsZS5nZW9tZXRyeS5jZW50ZXIsXG4gKiAgICAgICAgICByYWRpdXM6IGNpcmNsZS5nZW9tZXRyeS5yYWRpdXMsXG4gKiAgICAgIH1cIlxuICogICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogY2lyY2xlLmF0dHJpYnV0ZXMgLy9PcHRpb25hbFxuICogICAgICB9XCJcbiAqICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBjaXJjbGUuYXBwZWFyYW5jZSAvL09wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAgICZsdDsvYWMtc3RhdGljLWNpcmNsZS1kZXNjJmd0O1xuICogICAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1jaXJjbGUnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNDaXJjbGVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3Ioc3RhdGljQ2lyY2xlRHJhd2VyOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHN0YXRpY0NpcmNsZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19