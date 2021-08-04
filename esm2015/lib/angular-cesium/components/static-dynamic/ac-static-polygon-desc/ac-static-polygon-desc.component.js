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
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolygonDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polygon-desc',
                template: ''
            },] }
];
AcStaticPolygonDescComponent.ctorParameters = () => [
    { type: StaticPolygonDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLXBvbHlnb24tZGVzYy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFDdEgsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sdUZBQXVGLENBQUM7QUFFbkksZ0JBQWdCO0FBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUtILE1BQU0sT0FBTyw0QkFBNkIsU0FBUSx3QkFBd0I7SUFDeEUsWUFBWSxhQUF5QyxFQUFFLFlBQTBCLEVBQ3JFLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7WUEzQlEsMEJBQTBCO1lBSjFCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcblxuLy8gdHNsaW50OmVuYWJsZVxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtcGxveWdvbi1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyAocG9zaXRpb24sIGNvbG9yLCBldGMuLiBhcmUgbm90IHVwZGF0ZWQpIGltcGxlbWVudGF0aW9uIG9mIGEgcG9seWdvbi5cbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtc3RhdGljLXBvbHlnb24tZGVzY1xuICogICAgICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgICAgICAgICAgICAgcG9seWdvbkhpZXJhcmNoeTogcG9seWdvbi5nZW9tZXRyeS5wb2x5Z29uSGllcmFyY2h5LFxuICogICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHBvbHlnb24uZ2VvbWV0cnkuaGVpZ2h0LFxuICogICAgICAgICAgICAgICAgICAgICBncmFudWxhcml0eTogcG9seWdvbi5nZW9tZXRyeS5ncmFudWxhcml0eVxuICogICAgICAgICAgICAgICAgIH1cIlxuICogICAgICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogcG9seWdvbi5hdHRyaWJ1dGVzXG4gKiAgICAgICAgICAgICAgICAgfVwiXG4gKiAgICAgICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgICAgICAgICAgICAgYXBwZWFyYW5jZTogcG9seWdvbi5hcHBlYXJhbmNlXG4gKiAgICAgICAgICAgICAgICAgfVwiXG4gKiAgICAmZ3Q7Jmx0Oy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjJmd0O1xuICogICAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjU3RhdGljUG9seWdvbkRlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2Mge1xuICBjb25zdHJ1Y3Rvcihwb2x5Z29uRHJhd2VyOiBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihwb2x5Z29uRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=