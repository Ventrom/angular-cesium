/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service';
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
var AcDynamicEllipseDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcDynamicEllipseDescComponent, _super);
    function AcDynamicEllipseDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicEllipseDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-dynamic-ellipse-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcDynamicEllipseDescComponent.ctorParameters = function () { return [
        { type: DynamicEllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcDynamicEllipseDescComponent;
}(BasicDesc));
export { AcDynamicEllipseDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDNUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sd0ZBQXdGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJySTtJQUltRCx5REFBUztJQUMxRCx1Q0FBWSxhQUEwQyxFQUFFLFlBQTBCLEVBQ3RFLGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ3hFLENBQUM7O2dCQVJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjs7OztnQkE5QlEsMkJBQTJCO2dCQUYzQixZQUFZO2dCQURaLGdCQUFnQjtnQkFEaEIsZ0JBQWdCOztJQXdDekIsb0NBQUM7Q0FBQSxBQVRELENBSW1ELFNBQVMsR0FLM0Q7U0FMWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKlxuICpcbiAqICBUaGlzIGlzIGEgZHluYW1pYyhwb3NpdGlvbiBpcyB1cGRhdGFibGUpIGltcGxlbWVudGF0aW9uIG9mIGFuIGVsbGlwc2UuXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1lbGxpcHNlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGNlbnRlcjogZGF0YS5wb3NpdGlvbixcbiAqICAgICAgc2VtaU1ham9yQXhpczoyNTAwMDAuMCxcbiAqICAgICAgc2VtaU1pbm9yQXhpczo0MDAwMDAuMCxcbiAqICAgICAgcm90YXRpb24gOiAwLjc4NTM5OCxcbiAqICAgICAgd2lkdGg6MywgLy8gT3B0aW9uYWxcbiAqICAgICAgZ3JhbnVsYXJpdHk6MC4wOCAvLyBPcHRpb25hbFxuICogICAgICB9XCImZ3Q7XG4gKiAgICBcIj5cbiAqICAgICZsdDsvYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MmZ3Q7XG4gKiAgYGBgXG4gKiAgX19wYXJhbTpfXyB7Q2VzaXVtLkNhcnRlc2lhbjN9IGNlbnRlclxuICogIF9fcGFyYW06X18ge251bWJlcn0gc2VtaU1ham9yQXhpc1xuICogIF9fcGFyYW06X18ge251bWJlcn0gc2VtaU1pbm9yQXhpc1xuICogIF9fcGFyYW06X18ge251bWJlcn0gcm90YXRpb25cbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMV0gd2lkdGhcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMC4wMDNdIGdyYW51bGFyaXR5XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0R5bmFtaWNFbGxpcHNlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=