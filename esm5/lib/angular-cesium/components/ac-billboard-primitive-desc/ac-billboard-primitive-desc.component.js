/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';
/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
var AcBillboardPrimitiveDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcBillboardPrimitiveDescComponent, _super);
    function AcBillboardPrimitiveDescComponent(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcBillboardPrimitiveDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-billboard-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcBillboardPrimitiveDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcBillboardPrimitiveDescComponent.ctorParameters = function () { return [
        { type: BillboardPrimitiveDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcBillboardPrimitiveDescComponent;
}(BasicDesc));
export { AcBillboardPrimitiveDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjL2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHNGQUFzRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJ2STtJQUt1RCw2REFBUztJQUU5RCwyQ0FBWSx3QkFBeUQsRUFBRSxZQUEwQixFQUNyRixnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sd0JBQXdCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ25GLENBQUM7O2dCQVZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVU7Ozs0QkFBQyxjQUFNLE9BQUEsaUNBQWlDLEVBQWpDLENBQWlDLEVBQUMsRUFBQyxDQUFDO2lCQUNwRzs7OztnQkF6QlEsK0JBQStCO2dCQUgvQixZQUFZO2dCQUNaLGdCQUFnQjtnQkFDaEIsZ0JBQWdCOztJQWlDekIsd0NBQUM7Q0FBQSxBQVhELENBS3VELFNBQVMsR0FNL0Q7U0FOWSxpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgYmlsbGJvYXJkIHByaW1pdGl2ZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmU6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9CaWxsYm9hcmQuaHRtbFxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgaW1hZ2U6IHRyYWNrLmltYWdlLFxuICogICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgIHNjYWxlOiB0cmFjay5zY2FsZSxcbiAqICAgICAgY29sb3I6IHRyYWNrLmNvbG9yLFxuICogICAgICBuYW1lOiB0cmFjay5uYW1lXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYz5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCl9XSxcbn0pXG5leHBvcnQgY2xhc3MgQWNCaWxsYm9hcmRQcmltaXRpdmVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3RvcihiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXI6IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=