/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class AcStaticEllipseDescComponent extends BasicStaticPrimitiveDesc {
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
AcStaticEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-ellipse-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticEllipseDescComponent.ctorParameters = () => [
    { type: StaticEllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGdGQUFnRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEI1SCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsd0JBQXdCOzs7Ozs7O0lBQ3hFLFlBQVksYUFBeUMsRUFBRSxZQUEwQixFQUNyRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7WUFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsUUFBUSxFQUFFLEVBQUU7YUFDYjs7OztZQTdCUSwwQkFBMEI7WUFKMUIsWUFBWTtZQUNaLGdCQUFnQjtZQUNoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLWVsbGlwc2UtZGVzYyBpbnN0ZWFkXG4gKlxuICogIFRoaXMgaXMgYSBzdGF0aWMgKHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gYXJlIG5vdCB1cGRhdGVkKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBlbGxpcHNlLlxuICogIF9fdXNhZ2U6X19cbiAqICBgYGBcbiAqICAmbHQ7YWMtc3RhdGljLWVsbGlwc2UtZGVzYy1kZXNjXG4gKiAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGVsbGlwc2UuZ2VvbWV0cnkuY2VudGVyLFxuICogICAgICAgICAgc2VtaU1ham9yQXhpczogZWxsaXBzZS5nZW9tZXRyeS5zZW1pTWFqb3JBeGlzLFxuICogICAgICAgICAgc2VtaU1pbm9yQXhpczogZWxsaXBzZS5nZW9tZXRyeS5zZW1pTWlub3JBeGlzLFxuICogICAgICAgICAgaGVpZ2h0OiBlbGxpcHNlLmdlb21ldHJ5LmhlaWdodCxcbiAqICAgICAgICAgIHJvdGF0aW9uOiBlbGxpcHNlLmdlb21ldHJ5LnJvdGF0aW9uXG4gKiAgICAgIH1cIlxuICogICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogZWxsaXBzZS5hdHRyaWJ1dGVzIC8vT3B0aW9uYWxcbiAqICAgICAgfVwiXG4gKiAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgYXBwZWFyYW5jZTogZWxsaXBzZS5hcHBlYXJhbmNlIC8vT3B0aW9uYWxcbiAqICAgICAgfVwiJmd0O1xuICogICZsdDsvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy1kZXNjJmd0O1xuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtZWxsaXBzZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjU3RhdGljRWxsaXBzZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=