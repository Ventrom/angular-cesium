/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
/**
 * + This drawer is responsible for drawing a polygon over the Cesium map.
 * + This implementation uses simple PolygonGeometry and Primitive parameters.
 * + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
var StaticPolygonDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(StaticPolygonDrawerService, _super);
    function StaticPolygonDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolygonGeometry, cesiumService) || this;
    }
    StaticPolygonDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticPolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticPolygonDrawerService;
}(StaticPrimitiveDrawer));
export { StaticPolygonDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQ25HLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7Ozs7O0FBTy9EO0lBQ2dELHNEQUFxQjtJQUNuRSxvQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxNQUFNLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQztJQUM5QyxDQUFDOztnQkFKRixVQUFVOzs7O2dCQVBGLGFBQWE7O0lBWXRCLGlDQUFDO0NBQUEsQUFMRCxDQUNnRCxxQkFBcUIsR0FJcEU7U0FKWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG4vKipcbiArIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGEgcG9seWdvbiBvdmVyIHRoZSBDZXNpdW0gbWFwLlxuICsgVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHNpbXBsZSBQb2x5Z29uR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxuICsgVGhpcyBkb2Vzbid0IGFsbG93IHVzIHRvIGNoYW5nZSB0aGUgcG9zaXRpb24sIGNvbG9yLCBldGMuLiBvZiB0aGUgcG9seWdvbnMuIEZvciB0aGF0IHlvdSBtYXkgdXNlIHRoZSBkeW5hbWljIHBvbHlnb24gY29tcG9uZW50LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UgZXh0ZW5kcyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlnb25HZW9tZXRyeSwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==