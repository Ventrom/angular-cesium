/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, forwardRef } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-layer element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-ellipse-desc props="{
 *      position: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      height: 0
 *    }">
 *    </ac-ellipse-desc>
 *  ```
 */
export class AcEllipseDescComponent extends BasicDesc {
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
AcEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipse-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcEllipseDescComponent)) }]
            }] }
];
/** @nocollapse */
AcEllipseDescComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtZWxsaXBzZS1kZXNjL2FjLWVsbGlwc2UtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJwRyxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsU0FBUzs7Ozs7OztJQUNuRCxZQUFZLGFBQW1DLEVBQUUsWUFBMEIsRUFDL0QsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQzs7O1lBVEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVTs7O3dCQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFDLEVBQUMsQ0FBQzthQUN6Rjs7OztZQXpCUSxvQkFBb0I7WUFGcEIsWUFBWTtZQURaLGdCQUFnQjtZQURoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBlbGxpcHNlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIF9TZXQgYGhlaWdodGAgcHJvcCBmb3IgcGVyZm9ybWFuY2UgZW5oYW5jZW1lbnRfXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgRWxsaXBzZUdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc2VHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtZWxsaXBzZS1kZXNjIHByb3BzPVwie1xuICogICAgICBwb3NpdGlvbjogZGF0YS5wb3NpdGlvbixcbiAqICAgICAgc2VtaU1ham9yQXhpczoyNTAwMDAuMCxcbiAqICAgICAgc2VtaU1pbm9yQXhpczo0MDAwMDAuMCxcbiAqICAgICAgaGVpZ2h0OiAwXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWVsbGlwc2UtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZWxsaXBzZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY0VsbGlwc2VEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0VsbGlwc2VEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19