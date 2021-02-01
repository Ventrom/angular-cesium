import { __decorate, __extends, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-point-desc props="{
 *     pixelSize : point.pixelSize, //optional
 *     position : point.positions,
 *     color : point.color  //optional
 *   }">
 *   </ac-point-desc>
 *  ```
 */
var AcPointDescComponent = /** @class */ (function (_super) {
    __extends(AcPointDescComponent, _super);
    function AcPointDescComponent(pointDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, pointDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPointDescComponent_1 = AcPointDescComponent;
    var AcPointDescComponent_1;
    AcPointDescComponent.ctorParameters = function () { return [
        { type: PointDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcPointDescComponent = AcPointDescComponent_1 = __decorate([
        Component({
            selector: 'ac-point-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcPointDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [PointDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcPointDescComponent);
    return AcPointDescComponent;
}(BasicDesc));
export { AcPointDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9pbnQtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvaW50LWRlc2MvYWMtcG9pbnQtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFFOUY7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFNSDtJQUEwQyx3Q0FBUztJQUVqRCw4QkFBWSxrQkFBc0MsRUFBRSxZQUEwQixFQUNsRSxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sa0JBQWtCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQzdFLENBQUM7NkJBTFUsb0JBQW9COzs7Z0JBRUMsa0JBQWtCO2dCQUFnQixZQUFZO2dCQUNoRCxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFIdkUsb0JBQW9CO1FBTGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFvQixFQUFwQixDQUFvQixDQUFDLEVBQUMsQ0FBQztTQUN2RixDQUFDO3lDQUdnQyxrQkFBa0IsRUFBZ0IsWUFBWTtZQUNoRCxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BSHZFLG9CQUFvQixDQU1oQztJQUFELDJCQUFDO0NBQUEsQUFORCxDQUEwQyxTQUFTLEdBTWxEO1NBTlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2ludCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBQb2ludEdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvaW50R3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgIDxhYy1wb2ludC1kZXNjIHByb3BzPVwie1xuICogICAgIHBpeGVsU2l6ZSA6IHBvaW50LnBpeGVsU2l6ZSwgLy9vcHRpb25hbFxuICogICAgIHBvc2l0aW9uIDogcG9pbnQucG9zaXRpb25zLFxuICogICAgIGNvbG9yIDogcG9pbnQuY29sb3IgIC8vb3B0aW9uYWxcbiAqICAgfVwiPlxuICogICA8L2FjLXBvaW50LWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvaW50LWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjUG9pbnREZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY1BvaW50RGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IocG9pbnREcmF3ZXJTZXJ2aWNlOiBQb2ludERyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIocG9pbnREcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=