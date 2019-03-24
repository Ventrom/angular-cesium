/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing polylines.
 */
var PolylineVolumeDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(PolylineVolumeDrawerService, _super);
    function PolylineVolumeDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polylineVolume) || this;
    }
    PolylineVolumeDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolylineVolumeDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolylineVolumeDrawerService;
}(EntitiesDrawerService));
export { PolylineVolumeDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtdm9sdW1lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS12b2x1bWUtZGF3ZXIvcG9seWxpbmUtdm9sdW1lLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBSzNFO0lBQ2lELHVEQUFxQjtJQUNwRSxxQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxhQUFhLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQztJQUNuRCxDQUFDOztnQkFKRixVQUFVOzs7O2dCQU5GLGFBQWE7O0lBV3RCLGtDQUFDO0NBQUEsQUFMRCxDQUNpRCxxQkFBcUIsR0FJckU7U0FKWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgcG9seWxpbmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5wb2x5bGluZVZvbHVtZSk7XG4gIH1cbn1cbiJdfQ==