/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing billboards.
 */
var BillboardDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(BillboardDrawerService, _super);
    function BillboardDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.billboard) || this;
    }
    BillboardDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BillboardDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return BillboardDrawerService;
}(EntitiesDrawerService));
export { BillboardDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ25GLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQzs7OztBQUszRTtJQUM0QyxrREFBcUI7SUFDL0QsZ0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sYUFBYSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUM7SUFDOUMsQ0FBQzs7Z0JBSkYsVUFBVTs7OztnQkFQRixhQUFhOztJQVl0Qiw2QkFBQztDQUFBLEFBTEQsQ0FDNEMscUJBQXFCLEdBSWhFO1NBSlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi4vZW50aXRpZXMtZHJhd2VyL2VudW1zL2dyYXBoaWNzLXR5cGUuZW51bSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGJpbGxib2FyZHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5iaWxsYm9hcmQpO1xuICB9XG59XG4iXX0=