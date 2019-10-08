/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, forwardRef } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-layer element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc props="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius,
 *          color : arc.color - The color should be Cesium.Color type
 *    }">
 *    </ac-arc-desc>
 *    ```
 *
 *    description of the props :
 *    center - The arc is a section of an outline of a circle, This is the center of the circle
 *    angle - the initial angle of the arc in radians
 *    delta - the spreading of the arc,
 *    radius - the distance from the center to the arc
 *
 *    for example :
 *    angle - 0
 *    delta - π
 *
 *    will draw an half circle
 */
export class AcArcDescComponent extends BasicDesc {
    /**
     * @param {?} arcDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-arc-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcArcDescComponent)) }]
            }] }
];
/** @nocollapse */
AcArcDescComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMtZGVzYy9hYy1hcmMtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDekUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFNBQVM7Ozs7Ozs7SUFFL0MsWUFBWSxTQUEyQixFQUFFLFlBQTBCLEVBQ3ZELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVOzs7d0JBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLEVBQUMsRUFBQyxDQUFDO2FBQ3JGOzs7O1lBckNRLGdCQUFnQjtZQUhoQixZQUFZO1lBRVosZ0JBQWdCO1lBRGhCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGFuIGFyYy5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBBbiBhcmMgaXMgbm90IGNlc2l1bSBuYXRpdmVseSBpbXBsZW1lbnRlZCBhbmQgdGhlcmVmb3JlIGl0J3MgQVBJIGRvZXNuJ3QgYXBwZWFyIGFueXdoZXJlXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYXJjLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gKiAgICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICogICAgICAgICAgZGVsdGE6IGFyYy5kZWx0YSxcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1cyxcbiAqICAgICAgICAgIGNvbG9yIDogYXJjLmNvbG9yIC0gVGhlIGNvbG9yIHNob3VsZCBiZSBDZXNpdW0uQ29sb3IgdHlwZVxuICogICAgfVwiPlxuICogICAgPC9hYy1hcmMtZGVzYz5cbiAqICAgIGBgYFxuICpcbiAqICAgIGRlc2NyaXB0aW9uIG9mIHRoZSBwcm9wcyA6XG4gKiAgICBjZW50ZXIgLSBUaGUgYXJjIGlzIGEgc2VjdGlvbiBvZiBhbiBvdXRsaW5lIG9mIGEgY2lyY2xlLCBUaGlzIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICogICAgYW5nbGUgLSB0aGUgaW5pdGlhbCBhbmdsZSBvZiB0aGUgYXJjIGluIHJhZGlhbnNcbiAqICAgIGRlbHRhIC0gdGhlIHNwcmVhZGluZyBvZiB0aGUgYXJjLFxuICogICAgcmFkaXVzIC0gdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlciB0byB0aGUgYXJjXG4gKlxuICogICAgZm9yIGV4YW1wbGUgOlxuICogICAgYW5nbGUgLSAwXG4gKiAgICBkZWx0YSAtIM+AXG4gKlxuICogICAgd2lsbCBkcmF3IGFuIGhhbGYgY2lyY2xlXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYXJjLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQXJjRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcmNEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihhcmNEcmF3ZXI6IEFyY0RyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoYXJjRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cbn1cbiJdfQ==