// tslint:disable
import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
// tslint:enable
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new Cesium.PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
export class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcStaticPolylineDescComponent, deps: [{ token: i1.StaticPolylineDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcStaticPolylineDescComponent, selector: "ac-static-polyline-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcStaticPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polyline-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticPolylineDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUsxQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7O0FBRXRILGdCQUFnQjtBQUVoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFLSCxNQUFNLE9BQU8sNkJBQThCLFNBQVEsd0JBQXdCO0lBQ3pFLFlBQVkscUJBQWtELEVBQUUsWUFBMEIsRUFDOUUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNqRixDQUFDOzsySEFKVSw2QkFBNkI7K0dBQTdCLDZCQUE2QixzRkFGOUIsRUFBRTs0RkFFRCw2QkFBNkI7a0JBSnpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcblxuLy8gdHNsaW50OmVuYWJsZVxuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1wbG95bGluZS1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyBpbXBsZW1lbnRhdGlvbiBvZiBhbiBwb2x5bGluZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHRhYy1zdGF0aWMtcG9seWxpbmUtZGVzY1xuICogICAgICAgICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgICBcdHdpZHRoOiBwb2x5Lmdlb21ldHJ5LndpZHRoLFxuICogICAgICAgICAgICBcdHBvc2l0aW9uczogcG9seS5nZW9tZXRyeS5wb3NpdGlvbnNcbiAqICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICogICAgICAgICAgICAgICAgICBDZXNpdW0uQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLmZyb21Db2xvcihDZXNpdW0uQ29sb3IuZnJvbVJhbmRvbSgpKVxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgICAgIGFwcGVhcmFuY2U6IG5ldyBDZXNpdW0uUG9seWxpbmVDb2xvckFwcGVhcmFuY2UoKVxuICogICAgfVwiJmd0Jmx0L2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjJmd0XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjU3RhdGljUG9seWxpbmVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIocG9seWxpbmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=