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
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-arc-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }]
            },] }
];
AcArcDescComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFyYy1kZXNjL2FjLWFyYy1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRXpFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBT0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFNBQVM7SUFFL0MsWUFBWSxTQUEyQixFQUFFLFlBQTBCLEVBQ3ZELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBQyxDQUFDO2FBQ3JGOzs7WUFyQ1EsZ0JBQWdCO1lBSGhCLFlBQVk7WUFFWixnQkFBZ0I7WUFEaEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgYW4gYXJjLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIEFuIGFyYyBpcyBub3QgY2VzaXVtIG5hdGl2ZWx5IGltcGxlbWVudGVkIGFuZCB0aGVyZWZvcmUgaXQncyBBUEkgZG9lc24ndCBhcHBlYXIgYW55d2hlcmVcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1hcmMtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogYXJjLmNlbnRlcixcbiAqICAgICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXG4gKiAgICAgICAgICBkZWx0YTogYXJjLmRlbHRhLFxuICogICAgICAgICAgcmFkaXVzOiBhcmMucmFkaXVzLFxuICogICAgICAgICAgY29sb3IgOiBhcmMuY29sb3IgLSBUaGUgY29sb3Igc2hvdWxkIGJlIENlc2l1bS5Db2xvciB0eXBlXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWFyYy1kZXNjPlxuICogICAgYGBgXG4gKlxuICogICAgZGVzY3JpcHRpb24gb2YgdGhlIHByb3BzIDpcbiAqICAgIGNlbnRlciAtIFRoZSBhcmMgaXMgYSBzZWN0aW9uIG9mIGFuIG91dGxpbmUgb2YgYSBjaXJjbGUsIFRoaXMgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gKiAgICBhbmdsZSAtIHRoZSBpbml0aWFsIGFuZ2xlIG9mIHRoZSBhcmMgaW4gcmFkaWFuc1xuICogICAgZGVsdGEgLSB0aGUgc3ByZWFkaW5nIG9mIHRoZSBhcmMsXG4gKiAgICByYWRpdXMgLSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHRvIHRoZSBhcmNcbiAqXG4gKiAgICBmb3IgZXhhbXBsZSA6XG4gKiAgICBhbmdsZSAtIDBcbiAqICAgIGRlbHRhIC0gz4BcbiAqXG4gKiAgICB3aWxsIGRyYXcgYW4gaGFsZiBjaXJjbGVcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1hcmMtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNBcmNEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0FyY0Rlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGFyY0RyYXdlcjogQXJjRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihhcmNEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxufVxuIl19