import { Component } from '@angular/core';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
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
export class AcDynamicCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
}
AcDynamicCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDynamicCircleDescComponent, deps: [{ token: i1.DynamicEllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcDynamicCircleDescComponent, selector: "ac-dynamic-circle-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDynamicCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-circle-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.DynamicEllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtZHluYW1pYy1jaXJjbGUtZGVzYy9hYy1keW5hbWljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQzs7Ozs7O0FBRzVFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFLSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsU0FBUztJQUN6RCxZQUFZLGFBQTBDLEVBQUUsWUFBMEIsRUFDdEUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVTLGVBQWUsQ0FBQyxPQUFlO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkQsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLFdBQVcsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUvQyxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzswSEFiVSw0QkFBNEI7OEdBQTVCLDRCQUE0QixxRkFGN0IsRUFBRTs0RkFFRCw0QkFBNEI7a0JBSnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtY2lyY2xlLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgZHluYW1pYyhwb3NpdGlvbiBpcyB1cGRhdGFibGUpIGltcGxlbWVudGF0aW9uIG9mIGFuIGNpcmNsZS5cbiBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGNlbnRlcjogZGF0YS5wb3NpdGlvbixcbiAqICAgICAgcmFkaXVzOiA1XG4gKiAgICAgIHJvdGF0aW9uIDogMC43ODUzOTgsXG4gKiAgICAgIHdpZHRoOjMsIC8vIE9wdGlvbmFsXG4gKiAgICAgIGdyYW51bGFyaXR5OjAuMDggLy8gT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICAgJmx0Oy9hYy1keW5hbWljLWNpcmNsZS1kZXNjJmd0O1xuICogIGBgYFxuICpcbiAqICBfX3BhcmFtX186IHtDZXNpdW0uQ2FydGVzaWFuM30gY2VudGVyXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gcm90YXRpb25cbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSByYWRpdXMgaW4gbWV0ZXJzXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzFdIHdpZHRoXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzAuMDAzXSBncmFudWxhcml0eVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1keW5hbWljLWNpcmNsZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjRHluYW1pY0NpcmNsZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJvcHNFdmFsdWF0b3IoY29udGV4dDogT2JqZWN0KTogYW55IHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHN1cGVyLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcblxuICAgIGNlc2l1bVByb3BzLnNlbWlNYWpvckF4aXMgPSBjZXNpdW1Qcm9wcy5yYWRpdXM7XG4gICAgY2VzaXVtUHJvcHMuc2VtaU1pbm9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxufVxuIl19