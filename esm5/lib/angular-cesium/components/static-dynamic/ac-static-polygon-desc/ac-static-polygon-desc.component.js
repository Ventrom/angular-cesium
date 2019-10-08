/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// tslint:disable
import { Component } from '@angular/core';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import { StaticPolygonDrawerService } from '../../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service';
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
var AcStaticPolygonDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcStaticPolygonDescComponent, _super);
    function AcStaticPolygonDescComponent(polygonDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, polygonDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticPolygonDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-polygon-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticPolygonDescComponent.ctorParameters = function () { return [
        { type: StaticPolygonDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticPolygonDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticPolygonDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MvYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFDdEgsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sdUZBQXVGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JuSTtJQUlrRCx3REFBd0I7SUFDeEUsc0NBQVksYUFBeUMsRUFBRSxZQUEwQixFQUNyRSxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RSxDQUFDOztnQkFSRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBM0JRLDBCQUEwQjtnQkFKMUIsWUFBWTtnQkFDWixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjs7SUFtQ3pCLG1DQUFDO0NBQUEsQUFURCxDQUlrRCx3QkFBd0IsR0FLekU7U0FMWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1wbG95Z29uLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYSBwb2x5Z29uLlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1zdGF0aWMtcG9seWdvbi1kZXNjXG4gKiAgICAgICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBwb2x5Z29uSGllcmFyY2h5OiBwb2x5Z29uLmdlb21ldHJ5LnBvbHlnb25IaWVyYXJjaHksXG4gKiAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogcG9seWdvbi5nZW9tZXRyeS5oZWlnaHQsXG4gKiAgICAgICAgICAgICAgICAgICAgIGdyYW51bGFyaXR5OiBwb2x5Z29uLmdlb21ldHJ5LmdyYW51bGFyaXR5XG4gKiAgICAgICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBwb2x5Z29uLmF0dHJpYnV0ZXNcbiAqICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgICAgICAgICAgICBhcHBlYXJhbmNlOiBwb2x5Z29uLmFwcGVhcmFuY2VcbiAqICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICZndDsmbHQ7L2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MmZ3Q7XG4gKiAgICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLXBvbHlnb24tZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XG4gIGNvbnN0cnVjdG9yKHBvbHlnb25EcmF3ZXI6IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHBvbHlnb25EcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==