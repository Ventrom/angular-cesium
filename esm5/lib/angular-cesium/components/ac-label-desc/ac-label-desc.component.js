/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-desc>
 *  ```
 */
var AcLabelDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcLabelDescComponent, _super);
    function AcLabelDescComponent(labelDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, labelDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcLabelDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-label-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcLabelDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcLabelDescComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcLabelDescComponent;
}(BasicDesc));
export { AcLabelDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxhYmVsLWRlc2MvYWMtbGFiZWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUI5RjtJQUswQyxnREFBUztJQUVqRCw4QkFBWSxXQUErQixFQUFFLFlBQTBCLEVBQzNELGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxXQUFXLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ3RFLENBQUM7O2dCQVZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLEVBQUU7b0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVOzs7NEJBQUMsY0FBTSxPQUFBLG9CQUFvQixFQUFwQixDQUFvQixFQUFDLEVBQUMsQ0FBQztpQkFDdkY7Ozs7Z0JBekJRLGtCQUFrQjtnQkFEbEIsWUFBWTtnQkFEWixnQkFBZ0I7Z0JBRGhCLGdCQUFnQjs7SUFtQ3pCLDJCQUFDO0NBQUEsQUFYRCxDQUswQyxTQUFTLEdBTWxEO1NBTlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBsYWJlbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBMYWJlbEdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0xhYmVsR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWxhYmVsLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICB0ZXh0OiB0cmFjay5uYW1lLFxuICogICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgfVwiPlxuICogICAgPC9hYy1sYWJlbC1kZXNjPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWxhYmVsLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjTGFiZWxEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0xhYmVsRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IobGFiZWxEcmF3ZXI6IExhYmVsRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihsYWJlbERyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19