/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
var DynamicPolylineDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicPolylineDrawerService, _super);
    function DynamicPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    DynamicPolylineDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DynamicPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return DynamicPolylineDrawerService;
}(PrimitivesDrawerService));
export { DynamicPolylineDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDOzs7O0FBSzVGO0lBQ2tELHdEQUF1QjtJQUN2RSxzQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDO0lBQ2pELENBQUM7O2dCQUpGLFVBQVU7Ozs7Z0JBTkYsYUFBYTs7SUFXdEIsbUNBQUM7Q0FBQSxBQUxELENBQ2tELHVCQUF1QixHQUl4RTtTQUpZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBkeW5hbWljIHZlcnNpb24gb2YgdGhlIHBvbHlsaW5lIGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUG9seWxpbmVDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19