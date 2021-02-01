import { __decorate, __extends, __metadata } from "tslib";
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
var AcArcDescComponent = /** @class */ (function (_super) {
    __extends(AcArcDescComponent, _super);
    function AcArcDescComponent(arcDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, arcDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcArcDescComponent_1 = AcArcDescComponent;
    var AcArcDescComponent_1;
    AcArcDescComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcArcDescComponent = AcArcDescComponent_1 = __decorate([
        Component({
            selector: 'ac-arc-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcArcDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [ArcDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcArcDescComponent);
    return AcArcDescComponent;
}(BasicDesc));
export { AcArcDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMtZGVzYy9hYy1hcmMtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFekU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFPSDtJQUF3QyxzQ0FBUztJQUUvQyw0QkFBWSxTQUEyQixFQUFFLFlBQTBCLEVBQ3ZELGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxTQUFTLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ3BFLENBQUM7MkJBTFUsa0JBQWtCOzs7Z0JBRU4sZ0JBQWdCO2dCQUFnQixZQUFZO2dCQUNyQyxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFIdkUsa0JBQWtCO1FBTDlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLG9CQUFrQixFQUFsQixDQUFrQixDQUFDLEVBQUMsQ0FBQztTQUNyRixDQUFDO3lDQUd1QixnQkFBZ0IsRUFBZ0IsWUFBWTtZQUNyQyxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BSHZFLGtCQUFrQixDQU85QjtJQUFELHlCQUFDO0NBQUEsQUFQRCxDQUF3QyxTQUFTLEdBT2hEO1NBUFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgYW4gYXJjLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIEFuIGFyYyBpcyBub3QgY2VzaXVtIG5hdGl2ZWx5IGltcGxlbWVudGVkIGFuZCB0aGVyZWZvcmUgaXQncyBBUEkgZG9lc24ndCBhcHBlYXIgYW55d2hlcmVcbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1hcmMtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogYXJjLmNlbnRlcixcbiAqICAgICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXG4gKiAgICAgICAgICBkZWx0YTogYXJjLmRlbHRhLFxuICogICAgICAgICAgcmFkaXVzOiBhcmMucmFkaXVzLFxuICogICAgICAgICAgY29sb3IgOiBhcmMuY29sb3IgLSBUaGUgY29sb3Igc2hvdWxkIGJlIENlc2l1bS5Db2xvciB0eXBlXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWFyYy1kZXNjPlxuICogICAgYGBgXG4gKlxuICogICAgZGVzY3JpcHRpb24gb2YgdGhlIHByb3BzIDpcbiAqICAgIGNlbnRlciAtIFRoZSBhcmMgaXMgYSBzZWN0aW9uIG9mIGFuIG91dGxpbmUgb2YgYSBjaXJjbGUsIFRoaXMgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gKiAgICBhbmdsZSAtIHRoZSBpbml0aWFsIGFuZ2xlIG9mIHRoZSBhcmMgaW4gcmFkaWFuc1xuICogICAgZGVsdGEgLSB0aGUgc3ByZWFkaW5nIG9mIHRoZSBhcmMsXG4gKiAgICByYWRpdXMgLSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHRvIHRoZSBhcmNcbiAqXG4gKiAgICBmb3IgZXhhbXBsZSA6XG4gKiAgICBhbmdsZSAtIDBcbiAqICAgIGRlbHRhIC0gz4BcbiAqXG4gKiAgICB3aWxsIGRyYXcgYW4gaGFsZiBjaXJjbGVcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1hcmMtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNBcmNEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0FyY0Rlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGFyY0RyYXdlcjogQXJjRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihhcmNEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxufVxuIl19