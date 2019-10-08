/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class AcStaticPolygonDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} polygonDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolygonDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polygon-desc',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticPolygonDescComponent.ctorParameters = () => [
    { type: StaticPolygonDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MvYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQztBQUN0SCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx1RkFBdUYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0Qm5JLE1BQU0sT0FBTyw0QkFBNkIsU0FBUSx3QkFBd0I7Ozs7Ozs7SUFDeEUsWUFBWSxhQUF5QyxFQUFFLFlBQTBCLEVBQ3JFLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBM0JRLDBCQUEwQjtZQUoxQixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLXBsb3lnb24tZGVzYyBpbnN0ZWFkXG4gKlxuICogIFRoaXMgaXMgYSBzdGF0aWMgKHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gYXJlIG5vdCB1cGRhdGVkKSBpbXBsZW1lbnRhdGlvbiBvZiBhIHBvbHlnb24uXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLXN0YXRpYy1wb2x5Z29uLWRlc2NcbiAqICAgICAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgICAgICAgIHBvbHlnb25IaWVyYXJjaHk6IHBvbHlnb24uZ2VvbWV0cnkucG9seWdvbkhpZXJhcmNoeSxcbiAqICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBwb2x5Z29uLmdlb21ldHJ5LmhlaWdodCxcbiAqICAgICAgICAgICAgICAgICAgICAgZ3JhbnVsYXJpdHk6IHBvbHlnb24uZ2VvbWV0cnkuZ3JhbnVsYXJpdHlcbiAqICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHBvbHlnb24uYXR0cmlidXRlc1xuICogICAgICAgICAgICAgICAgIH1cIlxuICogICAgICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICAgICAgICAgICAgIGFwcGVhcmFuY2U6IHBvbHlnb24uYXBwZWFyYW5jZVxuICogICAgICAgICAgICAgICAgIH1cIlxuICogICAgJmd0OyZsdDsvYWMtc3RhdGljLXBvbHlnb24tZGVzYyZndDtcbiAqICAgIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtcG9seWdvbi1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY1BvbHlnb25EZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcbiAgY29uc3RydWN0b3IocG9seWdvbkRyYXdlcjogU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIocG9seWdvbkRyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19