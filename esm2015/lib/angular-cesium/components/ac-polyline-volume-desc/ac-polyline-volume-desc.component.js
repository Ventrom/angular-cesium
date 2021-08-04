import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { PolylineVolumeDrawerService } from '../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service';
/**
 *  This is a point implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineVolumeGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-polyline-volume-desc props="{
 *     show : line.show, //optional
 *     positions : line.positions,
 *     material : line.color  //optional
 *   }">
 *   </ac-polyline-volume-desc>
 *  ```
 */
export class AcPolylineVolumeDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylineVolumeDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline-volume-desc',
                template: ''
            },] }
];
AcPolylineVolumeDescComponent.ctorParameters = () => [
    { type: PolylineVolumeDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWxpbmUtdm9sdW1lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjL2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkVBQTZFLENBQUM7QUFFMUg7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBS0gsTUFBTSxPQUFPLDZCQUE4QixTQUFRLFNBQVM7SUFFMUQsWUFBWSxhQUEwQyxFQUFFLFlBQTBCLEVBQ3RFLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7OztZQVRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7WUF2QlEsMkJBQTJCO1lBSDNCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXZvbHVtZS1kYXdlci9wb2x5bGluZS12b2x1bWUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgcG9pbnQgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIFBvaW50R3JhcGhpY3MgYW5kIHRoZSBnZW5lcmFsIHByb3BlcnRpZXNcbiAqICBvZiBFbnRpdHlcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9Qb2x5bGluZVZvbHVtZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICA8YWMtcG9seWxpbmUtdm9sdW1lLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgc2hvdyA6IGxpbmUuc2hvdywgLy9vcHRpb25hbFxuICogICAgIHBvc2l0aW9ucyA6IGxpbmUucG9zaXRpb25zLFxuICogICAgIG1hdGVyaWFsIDogbGluZS5jb2xvciAgLy9vcHRpb25hbFxuICogICB9XCI+XG4gKiAgIDwvYWMtcG9seWxpbmUtdm9sdW1lLWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjUG9seWxpbmVWb2x1bWVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihkcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19