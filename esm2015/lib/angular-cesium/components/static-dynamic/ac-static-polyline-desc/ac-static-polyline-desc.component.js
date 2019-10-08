/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// tslint:disable
import { Component } from '@angular/core';
import { StaticPolylineDrawerService } from '../../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
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
    /**
     * @param {?} polylineDrawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polyline-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticPolylineDescComponent.ctorParameters = () => [
    { type: StaticPolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtcG9seWxpbmUtZGVzYy9hYy1zdGF0aWMtcG9seWxpbmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGdHQUFnRyxDQUFDO0FBQzdJLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QnRILE1BQU0sT0FBTyw2QkFBOEIsU0FBUSx3QkFBd0I7Ozs7Ozs7SUFDekUsWUFBWSxxQkFBa0QsRUFBRSxZQUEwQixFQUM5RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBaENRLDJCQUEyQjtZQUMzQixZQUFZO1lBRVosZ0JBQWdCO1lBRGhCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlsaW5lLWRyYXdlci9zdGF0aWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLXBsb3lsaW5lLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgc3RhdGljIGltcGxlbWVudGF0aW9uIG9mIGFuIHBvbHlsaW5lLlxuICogIF9fdXNhZ2U6X19cbiAqICBgYGBcbiAqICAgICZsdGFjLXN0YXRpYy1wb2x5bGluZS1kZXNjXG4gKiAgICAgICAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICAgIFx0d2lkdGg6IHBvbHkuZ2VvbWV0cnkud2lkdGgsXG4gKiAgICAgICAgICAgIFx0cG9zaXRpb25zOiBwb2x5Lmdlb21ldHJ5LnBvc2l0aW9uc1xuICogICAgICAgICAgICB9XCJcbiAqICAgICAgICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gKiAgICAgICAgICAgICAgICAgIENlc2l1bS5Db2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUuZnJvbUNvbG9yKENlc2l1bS5Db2xvci5mcm9tUmFuZG9tKCkpXG4gKiAgICAgICAgICAgICAgfVxuICogICAgICAgICAgICB9XCJcbiAqICAgICAgICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgYXBwZWFyYW5jZTogbmV3IENlc2l1bS5Qb2x5bGluZUNvbG9yQXBwZWFyYW5jZSgpXG4gKiAgICB9XCImZ3QmbHQvYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MmZ3RcbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MnLFxuICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNQb2x5bGluZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2Mge1xuICBjb25zdHJ1Y3Rvcihwb2x5bGluZURyYXdlclNlcnZpY2U6IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihwb2x5bGluZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==