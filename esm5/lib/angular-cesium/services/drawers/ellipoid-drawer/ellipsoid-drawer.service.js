/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
var EllipsoidDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(EllipsoidDrawerService, _super);
    function EllipsoidDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.ellipsoid) || this;
    }
    EllipsoidDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    EllipsoidDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return EllipsoidDrawerService;
}(EntitiesDrawerService));
export { EllipsoidDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbGxpcG9pZC1kcmF3ZXIvZWxsaXBzb2lkLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBSzNFO0lBQzRDLGtEQUFxQjtJQUMvRCxnQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxhQUFhLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQztJQUM5QyxDQUFDOztnQkFKRixVQUFVOzs7O2dCQU5GLGFBQWE7O0lBV3RCLDZCQUFDO0NBQUEsQUFMRCxDQUM0QyxxQkFBcUIsR0FJaEU7U0FKWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgZWxsaXBzb2lkLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRWxsaXBzb2lkRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUuZWxsaXBzb2lkKTtcbiAgfVxufVxuIl19