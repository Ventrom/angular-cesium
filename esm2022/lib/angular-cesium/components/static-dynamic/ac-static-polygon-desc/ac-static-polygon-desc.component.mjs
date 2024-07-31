// tslint:disable
import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
// tslint:enable
/**
 * @deprecated use ac-ploygon-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of a polygon.
 *  __Usage:__
 *  ```
 *    &lt;ac-static-polygon-desc
 *          geometryProps="{
 *                     polygonHierarchy: polygon.geometry.polygonHierarchy,
 *                     height: polygon.geometry.height,
 *                     granularity: polygon.geometry.granularity
 *                 }"
 *          instanceProps="{
 *                     attributes: polygon.attributes
 *                 }"
 *          primitiveProps="{
 *                     appearance: polygon.appearance
 *                 }"
 *    &gt;&lt;/ac-static-polygon-desc&gt;
 *    ```
 */
export class AcStaticPolygonDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcStaticPolygonDescComponent, deps: [{ token: i1.StaticPolygonDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcStaticPolygonDescComponent, selector: "ac-static-polygon-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcStaticPolygonDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polygon-desc',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.StaticPolygonDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLXBvbHlnb24tZGVzYy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkxQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7O0FBR3RILGdCQUFnQjtBQUNoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFLSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsd0JBQXdCO0lBQ3hFLFlBQVksYUFBeUMsRUFBRSxZQUEwQixFQUNyRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzhHQUpVLDRCQUE0QjtrR0FBNUIsNEJBQTRCLHFGQUY3QixFQUFFOzsyRkFFRCw0QkFBNEI7a0JBSnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1wbG95Z29uLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYSBwb2x5Z29uLlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1zdGF0aWMtcG9seWdvbi1kZXNjXG4gKiAgICAgICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBwb2x5Z29uSGllcmFyY2h5OiBwb2x5Z29uLmdlb21ldHJ5LnBvbHlnb25IaWVyYXJjaHksXG4gKiAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogcG9seWdvbi5nZW9tZXRyeS5oZWlnaHQsXG4gKiAgICAgICAgICAgICAgICAgICAgIGdyYW51bGFyaXR5OiBwb2x5Z29uLmdlb21ldHJ5LmdyYW51bGFyaXR5XG4gKiAgICAgICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBwb2x5Z29uLmF0dHJpYnV0ZXNcbiAqICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBhcHBlYXJhbmNlOiBwb2x5Z29uLmFwcGVhcmFuY2VcbiAqICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICZndDsmbHQ7L2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MmZ3Q7XG4gKiAgICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLXBvbHlnb24tZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XG4gIGNvbnN0cnVjdG9yKHBvbHlnb25EcmF3ZXI6IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHBvbHlnb25EcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==