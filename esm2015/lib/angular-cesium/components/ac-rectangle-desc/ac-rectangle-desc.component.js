import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { RectangleDrawerService } from '../../services/drawers/rectangle-dawer/rectangle-drawer.service';
/**
 *  This is a point implementation.
 *  The ac-rectangle-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties RectangleGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-rectangle-desc props="{
 *     show : rectangle.show, //optional
 *     coordinates : rectangle.positions,
 *     material : rectangle.color  //optional
 *   }">
 *   </ac-rectangle-desc>
 *  ```
 */
export class AcRectangleDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcRectangleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-rectangle-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcRectangleDescComponent) }]
            },] }
];
AcRectangleDescComponent.ctorParameters = () => [
    { type: RectangleDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcmVjdGFuZ2xlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXJlY3RhbmdsZS1kZXNjL2FjLXJlY3RhbmdsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlFQUFpRSxDQUFDO0FBRXpHOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU1ILE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxTQUFTO0lBRXJELFlBQVksYUFBcUMsRUFBRSxZQUEwQixFQUNqRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUMsRUFBQyxDQUFDO2FBQzNGOzs7WUF4QlEsc0JBQXNCO1lBSHRCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvaW50IGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1yZWN0YW5nbGUtZGVzYyBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBSZWN0YW5nbGVHcmFwaGljcyBhbmQgdGhlIGdlbmVyYWwgcHJvcGVydGllc1xuICogIG9mIEVudGl0eVxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1JlY3RhbmdsZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICA8YWMtcmVjdGFuZ2xlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgc2hvdyA6IHJlY3RhbmdsZS5zaG93LCAvL29wdGlvbmFsXG4gKiAgICAgY29vcmRpbmF0ZXMgOiByZWN0YW5nbGUucG9zaXRpb25zLFxuICogICAgIG1hdGVyaWFsIDogcmVjdGFuZ2xlLmNvbG9yICAvL29wdGlvbmFsXG4gKiAgIH1cIj5cbiAqICAgPC9hYy1yZWN0YW5nbGUtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtcmVjdGFuZ2xlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjUmVjdGFuZ2xlRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNSZWN0YW5nbGVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihkcmF3ZXJTZXJ2aWNlOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGRyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==