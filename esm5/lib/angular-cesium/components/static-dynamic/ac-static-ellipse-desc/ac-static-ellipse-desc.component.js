/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import { StaticEllipseDrawerService } from '../../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service';
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
var AcStaticEllipseDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcStaticEllipseDescComponent, _super);
    function AcStaticEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticEllipseDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-ellipse-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticEllipseDescComponent.ctorParameters = function () { return [
        { type: StaticEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticEllipseDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticEllipseDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUN0SCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxnRkFBZ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCNUg7SUFJa0Qsd0RBQXdCO0lBQ3hFLHNDQUFZLGFBQXlDLEVBQUUsWUFBMEIsRUFDckUsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDeEUsQ0FBQzs7Z0JBUkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxFQUFFO2lCQUNiOzs7O2dCQTdCUSwwQkFBMEI7Z0JBSjFCLFlBQVk7Z0JBQ1osZ0JBQWdCO2dCQUNoQixnQkFBZ0I7O0lBcUN6QixtQ0FBQztDQUFBLEFBVEQsQ0FJa0Qsd0JBQXdCLEdBS3pFO1NBTFksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1lbGxpcHNlLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYW4gZWxsaXBzZS5cbiAqICBfX3VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgJmx0O2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MtZGVzY1xuICogICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgY2VudGVyOiBlbGxpcHNlLmdlb21ldHJ5LmNlbnRlcixcbiAqICAgICAgICAgIHNlbWlNYWpvckF4aXM6IGVsbGlwc2UuZ2VvbWV0cnkuc2VtaU1ham9yQXhpcyxcbiAqICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2VvbWV0cnkuc2VtaU1pbm9yQXhpcyxcbiAqICAgICAgICAgIGhlaWdodDogZWxsaXBzZS5nZW9tZXRyeS5oZWlnaHQsXG4gKiAgICAgICAgICByb3RhdGlvbjogZWxsaXBzZS5nZW9tZXRyeS5yb3RhdGlvblxuICogICAgICB9XCJcbiAqICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgIGF0dHJpYnV0ZXM6IGVsbGlwc2UuYXR0cmlidXRlcyAvL09wdGlvbmFsXG4gKiAgICAgIH1cIlxuICogICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgIGFwcGVhcmFuY2U6IGVsbGlwc2UuYXBwZWFyYW5jZSAvL09wdGlvbmFsXG4gKiAgICAgIH1cIiZndDtcbiAqICAmbHQ7L2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MtZGVzYyZndDtcbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLWVsbGlwc2UtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY0VsbGlwc2VEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19