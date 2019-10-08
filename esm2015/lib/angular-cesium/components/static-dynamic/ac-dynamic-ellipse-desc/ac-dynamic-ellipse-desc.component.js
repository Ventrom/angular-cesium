/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class AcDynamicEllipseDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-dynamic-ellipse-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcDynamicEllipseDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy9hYy1keW5hbWljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx3RkFBd0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQnJJLE1BQU0sT0FBTyw2QkFBOEIsU0FBUSxTQUFTOzs7Ozs7O0lBQzFELFlBQVksYUFBMEMsRUFBRSxZQUEwQixFQUN0RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7WUFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQTlCUSwyQkFBMkI7WUFGM0IsWUFBWTtZQURaLGdCQUFnQjtZQURoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKlxuICpcbiAqICBUaGlzIGlzIGEgZHluYW1pYyhwb3NpdGlvbiBpcyB1cGRhdGFibGUpIGltcGxlbWVudGF0aW9uIG9mIGFuIGVsbGlwc2UuXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1lbGxpcHNlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGNlbnRlcjogZGF0YS5wb3NpdGlvbixcbiAqICAgICAgc2VtaU1ham9yQXhpczoyNTAwMDAuMCxcbiAqICAgICAgc2VtaU1pbm9yQXhpczo0MDAwMDAuMCxcbiAqICAgICAgcm90YXRpb24gOiAwLjc4NTM5OCxcbiAqICAgICAgd2lkdGg6MywgLy8gT3B0aW9uYWxcbiAqICAgICAgZ3JhbnVsYXJpdHk6MC4wOCAvLyBPcHRpb25hbFxuICogICAgICB9XCImZ3Q7XG4gKiAgICBcIj5cbiAqICAgICZsdDsvYWMtZHluYW1pYy1lbGxpcHNlLWRlc2MmZ3Q7XG4gKiAgYGBgXG4gKiAgX19wYXJhbTpfXyB7Q2VzaXVtLkNhcnRlc2lhbjN9IGNlbnRlclxuICogIF9fcGFyYW06X18ge251bWJlcn0gc2VtaU1ham9yQXhpc1xuICogIF9fcGFyYW06X18ge251bWJlcn0gc2VtaU1pbm9yQXhpc1xuICogIF9fcGFyYW06X18ge251bWJlcn0gcm90YXRpb25cbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMV0gd2lkdGhcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMC4wMDNdIGdyYW51bGFyaXR5XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0R5bmFtaWNFbGxpcHNlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=