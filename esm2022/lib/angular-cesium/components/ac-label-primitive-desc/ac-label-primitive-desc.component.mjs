import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/label-primitive-drawer/label-primitive-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-primitive-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-primitive-desc>
 *  ```
 */
export class AcLabelPrimitiveDescComponent extends BasicDesc {
    constructor(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcLabelPrimitiveDescComponent, deps: [{ token: i1.LabelPrimitiveDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelPrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcLabelPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-label-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelPrimitiveDescComponent) }],
                }]
        }], ctorParameters: () => [{ type: i1.LabelPrimitiveDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjL2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQU16RTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQU9ILE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxTQUFTO0lBRTFELFlBQVksb0JBQWlELEVBQUUsWUFBMEIsRUFDN0UsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNoRixDQUFDOzhHQUxVLDZCQUE2QjtrR0FBN0IsNkJBQTZCLGtEQUY3QixDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDZCQUE2QixDQUFDLEVBQUMsQ0FBQyxpREFEckYsRUFBRTs7MkZBR0QsNkJBQTZCO2tCQUx6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO29CQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxFQUFDLENBQUM7aUJBQ2hHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGxhYmVsIHByaW1pdGl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmU6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9MYWJlbC5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICB0ZXh0OiB0cmFjay5uYW1lLFxuICogICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgfVwiPlxuICogICAgPC9hYy1sYWJlbC1wcmltaXRpdmUtZGVzYz5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1sYWJlbC1wcmltaXRpdmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNMYWJlbFByaW1pdGl2ZURlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjTGFiZWxQcmltaXRpdmVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihsYWJlbFByaW1pdGl2ZURyYXdlcjogTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGxhYmVsUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=