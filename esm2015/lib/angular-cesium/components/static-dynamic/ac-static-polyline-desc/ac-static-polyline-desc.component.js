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
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-polyline-desc',
                template: ''
            },] }
];
AcStaticPolylineDescComponent.ctorParameters = () => [
    { type: StaticPolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxnR0FBZ0csQ0FBQztBQUM3SSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNEVBQTRFLENBQUM7QUFFdEgsZ0JBQWdCO0FBRWhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CRztBQUtILE1BQU0sT0FBTyw2QkFBOEIsU0FBUSx3QkFBd0I7SUFDekUsWUFBWSxxQkFBa0QsRUFBRSxZQUEwQixFQUM5RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUUsRUFBRTthQUNiOzs7WUFoQ1EsMkJBQTJCO1lBQzNCLFlBQVk7WUFFWixnQkFBZ0I7WUFEaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtcGxveWxpbmUtZGVzYyBpbnN0ZWFkXG4gKlxuICogIFRoaXMgaXMgYSBzdGF0aWMgaW1wbGVtZW50YXRpb24gb2YgYW4gcG9seWxpbmUuXG4gKiAgX191c2FnZTpfX1xuICogIGBgYFxuICogICAgJmx0YWMtc3RhdGljLXBvbHlsaW5lLWRlc2NcbiAqICAgICAgICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgICAgXHR3aWR0aDogcG9seS5nZW9tZXRyeS53aWR0aCxcbiAqICAgICAgICAgICAgXHRwb3NpdGlvbnM6IHBvbHkuZ2VvbWV0cnkucG9zaXRpb25zXG4gKiAgICAgICAgICAgIH1cIlxuICogICAgICAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAqICAgICAgICAgICAgICAgICAgQ2VzaXVtLkNvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS5mcm9tQ29sb3IoQ2VzaXVtLkNvbG9yLmZyb21SYW5kb20oKSlcbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgIH1cIlxuICogICAgICAgICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgICAgICBhcHBlYXJhbmNlOiBuZXcgQ2VzaXVtLlBvbHlsaW5lQ29sb3JBcHBlYXJhbmNlKClcbiAqICAgIH1cIiZndCZsdC9hYy1zdGF0aWMtcG9seWxpbmUtZGVzYyZndFxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtcG9seWxpbmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY1BvbHlsaW5lRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XG4gIGNvbnN0cnVjdG9yKHBvbHlsaW5lRHJhd2VyU2VydmljZTogU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKHBvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19