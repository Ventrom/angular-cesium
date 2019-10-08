/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(AcArcDescComponent, _super);
    function AcArcDescComponent(arcDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, arcDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcArcDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-arc-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcArcDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcArcDescComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcArcDescComponent;
}(BasicDesc));
export { AcArcDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMtZGVzYy9hYy1hcmMtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ3pFO0lBS3dDLDhDQUFTO0lBRS9DLDRCQUFZLFNBQTJCLEVBQUUsWUFBMEIsRUFDdkQsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLFNBQVMsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDcEUsQ0FBQzs7Z0JBVkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVU7Ozs0QkFBQyxjQUFNLE9BQUEsa0JBQWtCLEVBQWxCLENBQWtCLEVBQUMsRUFBQyxDQUFDO2lCQUNyRjs7OztnQkFyQ1EsZ0JBQWdCO2dCQUhoQixZQUFZO2dCQUVaLGdCQUFnQjtnQkFEaEIsZ0JBQWdCOztJQStDekIseUJBQUM7Q0FBQSxBQVpELENBS3dDLFNBQVMsR0FPaEQ7U0FQWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBhbiBhcmMuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgQW4gYXJjIGlzIG5vdCBjZXNpdW0gbmF0aXZlbHkgaW1wbGVtZW50ZWQgYW5kIHRoZXJlZm9yZSBpdCdzIEFQSSBkb2Vzbid0IGFwcGVhciBhbnl3aGVyZVxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWFyYy1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgY2VudGVyOiBhcmMuY2VudGVyLFxuICogICAgICAgICAgYW5nbGU6IGFyYy5hbmdsZSxcbiAqICAgICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXG4gKiAgICAgICAgICByYWRpdXM6IGFyYy5yYWRpdXMsXG4gKiAgICAgICAgICBjb2xvciA6IGFyYy5jb2xvciAtIFRoZSBjb2xvciBzaG91bGQgYmUgQ2VzaXVtLkNvbG9yIHR5cGVcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtYXJjLWRlc2M+XG4gKiAgICBgYGBcbiAqXG4gKiAgICBkZXNjcmlwdGlvbiBvZiB0aGUgcHJvcHMgOlxuICogICAgY2VudGVyIC0gVGhlIGFyYyBpcyBhIHNlY3Rpb24gb2YgYW4gb3V0bGluZSBvZiBhIGNpcmNsZSwgVGhpcyBpcyB0aGUgY2VudGVyIG9mIHRoZSBjaXJjbGVcbiAqICAgIGFuZ2xlIC0gdGhlIGluaXRpYWwgYW5nbGUgb2YgdGhlIGFyYyBpbiByYWRpYW5zXG4gKiAgICBkZWx0YSAtIHRoZSBzcHJlYWRpbmcgb2YgdGhlIGFyYyxcbiAqICAgIHJhZGl1cyAtIHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIgdG8gdGhlIGFyY1xuICpcbiAqICAgIGZvciBleGFtcGxlIDpcbiAqICAgIGFuZ2xlIC0gMFxuICogICAgZGVsdGEgLSDPgFxuICpcbiAqICAgIHdpbGwgZHJhdyBhbiBoYWxmIGNpcmNsZVxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFyYy1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY0FyY0Rlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjQXJjRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoYXJjRHJhd2VyOiBBcmNEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGFyY0RyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG59XG4iXX0=