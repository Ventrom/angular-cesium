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
 *  This drawer is responsible for drawing cylinders.
 */
var CylinderDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(CylinderDrawerService, _super);
    function CylinderDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.cylinder) || this;
    }
    CylinderDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CylinderDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CylinderDrawerService;
}(EntitiesDrawerService));
export { CylinderDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lsaW5kZXItZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDOzs7O0FBSzNFO0lBQzJDLGlEQUFxQjtJQUM5RCwrQkFBWSxhQUE0QjtlQUN0QyxrQkFBTSxhQUFhLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUM3QyxDQUFDOztnQkFKRixVQUFVOzs7O2dCQU5GLGFBQWE7O0lBV3RCLDRCQUFDO0NBQUEsQUFMRCxDQUMyQyxxQkFBcUIsR0FJL0Q7U0FKWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgY3lsaW5kZXJzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5jeWxpbmRlcik7XG4gIH1cbn1cbiJdfQ==