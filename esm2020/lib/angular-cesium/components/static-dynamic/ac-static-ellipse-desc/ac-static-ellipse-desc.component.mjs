import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
/**
 *
 * @deprecated use ac-ellipse-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an ellipse.
 *  __usage:__
 *  ```
 *  &lt;ac-static-ellipse-desc-desc
 *      geometryProps="{
 *          center: ellipse.geometry.center,
 *          semiMajorAxis: ellipse.geometry.semiMajorAxis,
 *          semiMinorAxis: ellipse.geometry.semiMinorAxis,
 *          height: ellipse.geometry.height,
 *          rotation: ellipse.geometry.rotation
 *      }"
 *      instanceProps="{
 *          attributes: ellipse.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: ellipse.appearance //Optional
 *      }"&gt;
 *  &lt;/ac-static-ellipse-desc-desc&gt;
 *  ```
 */
export class AcStaticEllipseDescComponent extends BasicStaticPrimitiveDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticEllipseDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcStaticEllipseDescComponent, deps: [{ token: i1.StaticEllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticEllipseDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcStaticEllipseDescComponent, selector: "ac-static-ellipse-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcStaticEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-ellipse-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticEllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy9hYy1zdGF0aWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDOzs7Ozs7QUFHdEg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBS0gsTUFBTSxPQUFPLDRCQUE2QixTQUFRLHdCQUF3QjtJQUN4RSxZQUFZLGFBQXlDLEVBQUUsWUFBMEIsRUFDckUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQzs7MEhBSlUsNEJBQTRCOzhHQUE1Qiw0QkFBNEIscUZBRjdCLEVBQUU7NEZBRUQsNEJBQTRCO2tCQUp4QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1lbGxpcHNlLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYW4gZWxsaXBzZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgJmx0O2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MtZGVzY1xuICogICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgY2VudGVyOiBlbGxpcHNlLmdlb21ldHJ5LmNlbnRlcixcbiAqICAgICAgICAgIHNlbWlNYWpvckF4aXM6IGVsbGlwc2UuZ2VvbWV0cnkuc2VtaU1ham9yQXhpcyxcbiAqICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2VvbWV0cnkuc2VtaU1pbm9yQXhpcyxcbiAqICAgICAgICAgIGhlaWdodDogZWxsaXBzZS5nZW9tZXRyeS5oZWlnaHQsXG4gKiAgICAgICAgICByb3RhdGlvbjogZWxsaXBzZS5nZW9tZXRyeS5yb3RhdGlvblxuICogICAgICB9XCJcbiAqICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgIGF0dHJpYnV0ZXM6IGVsbGlwc2UuYXR0cmlidXRlcyAvL09wdGlvbmFsXG4gKiAgICAgIH1cIlxuICogICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgIGFwcGVhcmFuY2U6IGVsbGlwc2UuYXBwZWFyYW5jZSAvL09wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAmbHQ7L2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MtZGVzYyZndDtcbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLWVsbGlwc2UtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY0VsbGlwc2VEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19