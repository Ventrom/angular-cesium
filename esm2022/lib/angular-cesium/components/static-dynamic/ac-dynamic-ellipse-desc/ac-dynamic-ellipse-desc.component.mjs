import { Component } from '@angular/core';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
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
export class AcDynamicEllipseDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcDynamicEllipseDescComponent, deps: [{ token: i1.DynamicEllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcDynamicEllipseDescComponent, selector: "ac-dynamic-ellipse-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcDynamicEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-ellipse-desc',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.DynamicEllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjL2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQzs7Ozs7O0FBRzVFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFLSCxNQUFNLE9BQU8sNkJBQThCLFNBQVEsU0FBUztJQUMxRCxZQUFZLGFBQTBDLEVBQUUsWUFBMEIsRUFDdEUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQzs4R0FKVSw2QkFBNkI7a0dBQTdCLDZCQUE2QixzRkFGOUIsRUFBRTs7MkZBRUQsNkJBQTZCO2tCQUp6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICpcbiAqXG4gKiAgVGhpcyBpcyBhIGR5bmFtaWMocG9zaXRpb24gaXMgdXBkYXRhYmxlKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBlbGxpcHNlLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjIHByb3BzPVwie1xuICogICAgICBjZW50ZXI6IGRhdGEucG9zaXRpb24sXG4gKiAgICAgIHNlbWlNYWpvckF4aXM6MjUwMDAwLjAsXG4gKiAgICAgIHNlbWlNaW5vckF4aXM6NDAwMDAwLjAsXG4gKiAgICAgIHJvdGF0aW9uIDogMC43ODUzOTgsXG4gKiAgICAgIHdpZHRoOjMsIC8vIE9wdGlvbmFsXG4gKiAgICAgIGdyYW51bGFyaXR5OjAuMDggLy8gT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICAgXCI+XG4gKiAgICAmbHQ7L2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjJmd0O1xuICogIGBgYFxuICogIF9fcGFyYW06X18ge0Nlc2l1bS5DYXJ0ZXNpYW4zfSBjZW50ZXJcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHNlbWlNYWpvckF4aXNcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHNlbWlNaW5vckF4aXNcbiAqICBfX3BhcmFtOl9fIHtudW1iZXJ9IHJvdGF0aW9uXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzFdIHdpZHRoXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzAuMDAzXSBncmFudWxhcml0eVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1keW5hbWljLWVsbGlwc2UtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNEeW5hbWljRWxsaXBzZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19