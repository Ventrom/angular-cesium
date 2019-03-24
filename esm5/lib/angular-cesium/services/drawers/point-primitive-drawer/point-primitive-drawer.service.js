/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
var PointPrimitiveDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(PointPrimitiveDrawerService, _super);
    function PointPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PointPrimitiveCollection, cesiumService) || this;
    }
    PointPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PointPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PointPrimitiveDrawerService;
}(PrimitivesDrawerService));
export { PointPrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7OztBQU16RjtJQUNpRCx1REFBdUI7SUFDdEUscUNBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLHdCQUF3QixFQUFFLGFBQWEsQ0FBQztJQUN2RCxDQUFDOztnQkFKRixVQUFVOzs7O2dCQVBGLGFBQWE7O0lBWXRCLGtDQUFDO0NBQUEsQUFMRCxDQUNpRCx1QkFBdUIsR0FJdkU7U0FKWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgcG9pbnRzIGFzIHByaW1pdGl2ZXMuXG4gKiAgVGhpcyBkcmF3ZXIgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBQb2ludERyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgcG9pbnRzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvaW50UHJpbWl0aXZlQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==