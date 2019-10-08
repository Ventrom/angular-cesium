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
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 * __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cesium.Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
export class AcDynamicCircleDescComponent extends BasicDesc {
    /**
     * @param {?} ellipseDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    _propsEvaluator(context) {
        /** @type {?} */
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
}
AcDynamicCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-dynamic-circle-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcDynamicCircleDescComponent.ctorParameters = () => [
    { type: DynamicEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MvYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx3RkFBd0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QnJJLE1BQU0sT0FBTyw0QkFBNkIsU0FBUSxTQUFTOzs7Ozs7O0lBQ3pELFlBQVksYUFBMEMsRUFBRSxZQUEwQixFQUN0RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7Ozs7SUFFUyxlQUFlLENBQUMsT0FBZTs7Y0FDakMsV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBRWxELFdBQVcsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUMvQyxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFFL0MsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7O1lBakJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBM0JRLDJCQUEyQjtZQUYzQixZQUFZO1lBRFosZ0JBQWdCO1lBRGhCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1jaXJjbGUtZGVzYyBpbnN0ZWFkXG4gKlxuICogIFRoaXMgaXMgYSBkeW5hbWljKHBvc2l0aW9uIGlzIHVwZGF0YWJsZSkgaW1wbGVtZW50YXRpb24gb2YgYW4gY2lyY2xlLlxuIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1jaXJjbGUtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgY2VudGVyOiBkYXRhLnBvc2l0aW9uLFxuICogICAgICByYWRpdXM6IDVcbiAqICAgICAgcm90YXRpb24gOiAwLjc4NTM5OCxcbiAqICAgICAgd2lkdGg6MywgLy8gT3B0aW9uYWxcbiAqICAgICAgZ3JhbnVsYXJpdHk6MC4wOCAvLyBPcHRpb25hbFxuICogICAgICB9XCImZ3Q7XG4gKiAgICAmbHQ7L2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MmZ3Q7XG4gKiAgYGBgXG4gKlxuICogIF9fcGFyYW1fXzoge0Nlc2l1bS5DYXJ0ZXNpYW4zfSBjZW50ZXJcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSByb3RhdGlvblxuICogICBfX3BhcmFtX186IHtudW1iZXJ9IHJhZGl1cyBpbiBtZXRlcnNcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMV0gd2lkdGhcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMC4wMDNdIGdyYW51bGFyaXR5XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNEeW5hbWljQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xuICAgIGNvbnN0IGNlc2l1bVByb3BzID0gc3VwZXIuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuXG4gICAgY2VzaXVtUHJvcHMuc2VtaU1ham9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcbiAgICBjZXNpdW1Qcm9wcy5zZW1pTWlub3JBeGlzID0gY2VzaXVtUHJvcHMucmFkaXVzO1xuXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xuICB9XG59XG4iXX0=