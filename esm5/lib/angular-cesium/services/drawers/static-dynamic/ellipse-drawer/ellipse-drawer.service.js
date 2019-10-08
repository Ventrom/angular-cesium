/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { CesiumService } from '../../../cesium/cesium.service';
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 * + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 * + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 * + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 * +
 */
var StaticEllipseDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(StaticEllipseDrawerService, _super);
    function StaticEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.EllipseGeometry, cesiumService) || this;
    }
    StaticEllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticEllipseDrawerService;
}(StaticPrimitiveDrawer));
export { StaticEllipseDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDOzs7Ozs7O0FBUW5HO0lBQ2dELHNEQUFxQjtJQUNuRSxvQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxNQUFNLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQztJQUM5QyxDQUFDOztnQkFKRixVQUFVOzs7O2dCQVZGLGFBQWE7O0lBZXRCLGlDQUFDO0NBQUEsQUFMRCxDQUNnRCxxQkFBcUIsR0FJcEU7U0FKWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG5cbi8qKlxuICsgKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYW4gZWxsaXBzZSBvdmVyIHRoZSBDZXNpdW0gbWFwLlxuICsgKiAgVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHNpbXBsZSBFbGxpcHNlR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxuICsgKiAgVGhpcyBkb2Vzbid0IGFsbG93IHVzIHRvIGNoYW5nZSB0aGUgcG9zaXRpb24sIGNvbG9yLCBldGMuLiBvZiB0aGUgZWxsaXBzZXMuIEZvciB0aGF0IHlvdSBtYXkgdXNlIHRoZSBkeW5hbWljIGVsbGlwc2UgY29tcG9uZW50LlxuICsgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uRWxsaXBzZUdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19