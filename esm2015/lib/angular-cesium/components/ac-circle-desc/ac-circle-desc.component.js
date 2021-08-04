import { Component, forwardRef } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *__Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
export class AcCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => Object.assign(cesiumObject, desc);
    }
}
AcCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-circle-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent) }]
            },] }
];
AcCircleDescComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWNpcmNsZS1kZXNjL2FjLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBRXBHOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU1ILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxTQUFTO0lBQ2xELFlBQVksYUFBbUMsRUFBRSxZQUEwQixFQUMvRCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVuRCxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0MsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUxQixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRVMsaUJBQWlCO1FBQ3pCLE9BQU8sQ0FBQyxZQUFvQixFQUFFLElBQVksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkYsQ0FBQzs7O1lBdkJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsRUFBRTtnQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDLENBQUM7YUFDeEY7OztZQXhCUSxvQkFBb0I7WUFGcEIsWUFBWTtZQURaLGdCQUFnQjtZQURoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGNpcmNsZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBzZW1pTWFqb3JBeGlzIGFucyBzZW1pTWlub3JBeGlzIGFyZSByZXBsYWNlZCB3aXRoIHJhZGl1cyBwcm9wZXJ0eS5cbiAqICBBbGwgb3RoZXIgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcbiAqXG4gKl9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtY2lyY2xlLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIHBvc2l0aW9uOiBkYXRhLnBvc2l0aW9uLFxuICogICAgICByYWRpdXM6IDVcbiAqICAgICAgZ3JhbnVsYXJpdHk6MC4wOCAvLyBPcHRpb25hbFxuICogICAgfVwiPlxuICogICAgPC9hYy1jaXJjbGUtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtY2lyY2xlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQ2lyY2xlRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNDaXJjbGVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJvcHNFdmFsdWF0b3IoY29udGV4dDogT2JqZWN0KTogYW55IHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHN1cGVyLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcblxuICAgIGNlc2l1bVByb3BzLnNlbWlNYWpvckF4aXMgPSBjZXNpdW1Qcm9wcy5yYWRpdXM7XG4gICAgY2VzaXVtUHJvcHMuc2VtaU1pbm9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcbiAgICBkZWxldGUgY2VzaXVtUHJvcHMucmFkaXVzO1xuXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRQcm9wc0Fzc2lnbmVyKCk6IChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIHJldHVybiAoY2VzaXVtT2JqZWN0OiBPYmplY3QsIGRlc2M6IE9iamVjdCkgPT4gT2JqZWN0LmFzc2lnbihjZXNpdW1PYmplY3QsIGRlc2MpO1xuICB9XG59XG4iXX0=