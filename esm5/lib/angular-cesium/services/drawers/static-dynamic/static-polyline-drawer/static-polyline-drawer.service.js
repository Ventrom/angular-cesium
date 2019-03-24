/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
var StaticPolylineDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(StaticPolylineDrawerService, _super);
    function StaticPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineGeometry, cesiumService) || this;
    }
    /**
     * Update function can only change the primitive color.
     */
    /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPolylineDrawerService.prototype.update = /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (primitive, geometryProps, instanceProps, primitiveProps) {
        /** @type {?} */
        var color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((/**
             * @param {?} readyPrimitive
             * @return {?}
             */
            function (readyPrimitive) {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            }));
        }
        return primitive;
    };
    StaticPolylineDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticPolylineDrawerService;
}(StaticPrimitiveDrawer));
export { StaticPolylineDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDOzs7OztBQU1uRztJQUNpRCx1REFBcUI7SUFDcEUscUNBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQztJQUMvQyxDQUFDO0lBRUQ7O09BRUc7Ozs7Ozs7OztJQUNILDRDQUFNOzs7Ozs7OztJQUFOLFVBQU8sU0FBYyxFQUFFLGFBQWtCLEVBQUUsYUFBa0IsRUFBRSxjQUFtQjs7WUFDMUUsS0FBSyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFFbEQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ25CLFNBQVMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDekQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUk7Ozs7WUFBQyxVQUFDLGNBQW1CO2dCQUMzRCxjQUFjLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNyRSxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7Z0JBckJGLFVBQVU7Ozs7Z0JBUEYsYUFBYTs7SUE2QnRCLGtDQUFDO0NBQUEsQUF0QkQsQ0FDaUQscUJBQXFCLEdBcUJyRTtTQXJCWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoZSBwb2x5bGluZSBjb21wb25lbnQuXG4gKiAgVGhpcyBhbHNvIGFsbG93cyB1cyB0byBjaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwb2x5bGluZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBmdW5jdGlvbiBjYW4gb25seSBjaGFuZ2UgdGhlIHByaW1pdGl2ZSBjb2xvci5cbiAgICovXG4gIHVwZGF0ZShwcmltaXRpdmU6IGFueSwgZ2VvbWV0cnlQcm9wczogYW55LCBpbnN0YW5jZVByb3BzOiBhbnksIHByaW1pdGl2ZVByb3BzOiBhbnkpIHtcbiAgICBjb25zdCBjb2xvciA9IGluc3RhbmNlUHJvcHMuYXR0cmlidXRlcy5jb2xvci52YWx1ZTtcblxuICAgIGlmIChwcmltaXRpdmUucmVhZHkpIHtcbiAgICAgIHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcygpLmNvbG9yID0gY29sb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIENlc2l1bS53aGVuKHByaW1pdGl2ZS5yZWFkeVByb21pc2UpLnRoZW4oKHJlYWR5UHJpbWl0aXZlOiBhbnkpID0+IHtcbiAgICAgICAgcmVhZHlQcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvci52YWx1ZSA9IGNvbG9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxufVxuIl19