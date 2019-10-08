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
var AcStaticCircleDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcStaticCircleDescComponent, _super);
    function AcStaticCircleDescComponent(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, staticCircleDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcStaticCircleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-static-circle',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcStaticCircleDescComponent.ctorParameters = function () { return [
        { type: StaticCircleDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcStaticCircleDescComponent;
}(BasicStaticPrimitiveDesc));
export { AcStaticCircleDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWNpcmNsZS1kZXNjL2FjLXN0YXRpYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUN0SCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw0RkFBNEYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0J2STtJQUlpRCx1REFBd0I7SUFDdkUscUNBQVksa0JBQTZDLEVBQUUsWUFBMEIsRUFDekUsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLGtCQUFrQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUM3RSxDQUFDOztnQkFSRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBekJRLHlCQUF5QjtnQkFKekIsWUFBWTtnQkFDWixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjs7SUFpQ3pCLGtDQUFDO0NBQUEsQUFURCxDQUlpRCx3QkFBd0IsR0FLeEU7U0FMWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1jaXJjbGUtZHJhd2VyL3N0YXRpYy1jaXJjbGUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1jaXJjbGUtZGVzY1xuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYW4gY2lyY2xlLlxuICogIF9fdXNhZ2U6X19cbiAqICBgYGBcbiAqICAgICZsdDthYy1zdGF0aWMtY2lyY2xlLWRlc2NcbiAqICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogY2lyY2xlLmdlb21ldHJ5LmNlbnRlcixcbiAqICAgICAgICAgIHJhZGl1czogY2lyY2xlLmdlb21ldHJ5LnJhZGl1cyxcbiAqICAgICAgfVwiXG4gKiAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhdHRyaWJ1dGVzOiBjaXJjbGUuYXR0cmlidXRlcyAvL09wdGlvbmFsXG4gKiAgICAgIH1cIlxuICogICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgIGFwcGVhcmFuY2U6IGNpcmNsZS5hcHBlYXJhbmNlIC8vT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICAgJmx0Oy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MmZ3Q7XG4gKiAgICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLWNpcmNsZScsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY0NpcmNsZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2Mge1xuICBjb25zdHJ1Y3RvcihzdGF0aWNDaXJjbGVEcmF3ZXI6IFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoc3RhdGljQ2lyY2xlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=