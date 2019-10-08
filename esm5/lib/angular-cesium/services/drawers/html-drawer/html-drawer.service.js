/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
var HtmlDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(HtmlDrawerService, _super);
    function HtmlDrawerService(_cesiumService) {
        var _this = _super.call(this, Cesium.HtmlCollection, _cesiumService) || this;
        _this._cesiumService = _cesiumService;
        return _this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    HtmlDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return _super.prototype.add.call(this, cesiumProps);
    };
    HtmlDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    HtmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return HtmlDrawerService;
}(PrimitivesDrawerService));
export { HtmlDrawerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    HtmlDrawerService.prototype._cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBRXpGO0lBQ3VDLDZDQUF1QjtJQUM1RCwyQkFBb0IsY0FBNkI7UUFBakQsWUFDRSxrQkFBTSxNQUFNLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxTQUM3QztRQUZtQixvQkFBYyxHQUFkLGNBQWMsQ0FBZTs7SUFFakQsQ0FBQzs7Ozs7SUFFRCwrQkFBRzs7OztJQUFILFVBQUksV0FBZ0I7UUFDbEIsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELFdBQVcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMxRSxPQUFPLGlCQUFNLEdBQUcsWUFBQyxXQUFXLENBQUMsQ0FBQztJQUNoQyxDQUFDOztnQkFWRixVQUFVOzs7O2dCQUhGLGFBQWE7O0lBY3RCLHdCQUFDO0NBQUEsQUFYRCxDQUN1Qyx1QkFBdUIsR0FVN0Q7U0FWWSxpQkFBaUI7Ozs7OztJQUNoQiwyQ0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBIdG1sRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5IdG1sQ29sbGVjdGlvbiwgX2Nlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xuICAgIGNlc2l1bVByb3BzLnNjZW5lID0gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNlc2l1bVByb3BzLm1hcENvbnRhaW5lciA9IHRoaXMuX2Nlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0TWFwQ29udGFpbmVyKCk7XG4gICAgcmV0dXJuIHN1cGVyLmFkZChjZXNpdW1Qcm9wcyk7XG4gIH1cbn1cbiJdfQ==