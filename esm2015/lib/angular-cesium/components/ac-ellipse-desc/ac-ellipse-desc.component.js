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
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcEllipseDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipse-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcEllipseDescComponent) }]
            },] }
];
AcEllipseDescComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1lbGxpcHNlLWRlc2MvYWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBRXBHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFNSCxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsU0FBUztJQUNuRCxZQUFZLGFBQW1DLEVBQUUsWUFBMEIsRUFDL0QsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQzs7O1lBVEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsQ0FBQzthQUN6Rjs7O1lBekJRLG9CQUFvQjtZQUZwQixZQUFZO1lBRFosZ0JBQWdCO1lBRGhCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGVsbGlwc2UgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgX1NldCBgaGVpZ2h0YCBwcm9wIGZvciBwZXJmb3JtYW5jZSBlbmhhbmNlbWVudF9cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1lbGxpcHNlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIHBvc2l0aW9uOiBkYXRhLnBvc2l0aW9uLFxuICogICAgICBzZW1pTWFqb3JBeGlzOjI1MDAwMC4wLFxuICogICAgICBzZW1pTWlub3JBeGlzOjQwMDAwMC4wLFxuICogICAgICBoZWlnaHQ6IDBcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtZWxsaXBzZS1kZXNjPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1lbGxpcHNlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjRWxsaXBzZURlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjRWxsaXBzZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=