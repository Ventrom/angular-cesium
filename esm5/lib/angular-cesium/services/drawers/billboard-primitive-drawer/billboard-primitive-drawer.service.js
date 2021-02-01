import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
var BillboardPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(BillboardPrimitiveDrawerService, _super);
    function BillboardPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.BillboardCollection, cesiumService) || this;
    }
    BillboardPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    BillboardPrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], BillboardPrimitiveDrawerService);
    return BillboardPrimitiveDrawerService;
}(PrimitivesDrawerService));
export { BillboardPrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFekY7OztHQUdHO0FBRUg7SUFBcUQsbURBQXVCO0lBQzFFLHlDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLENBQUM7SUFDbEQsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLCtCQUErQjtRQUQzQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IsK0JBQStCLENBSTNDO0lBQUQsc0NBQUM7Q0FBQSxBQUpELENBQXFELHVCQUF1QixHQUkzRTtTQUpZLCtCQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYmlsbGJvYXJkcyBhcyBwcmltaXRpdmVzLlxuICogIFRoaXMgZHJhd2VyIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gQmlsbGJvYXJkRHJhd2VyU2VydmljZSB3aGVuIGRyYXdpbmcgZHluYW1pYyBiaWxsYm9hcmRzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5CaWxsYm9hcmRDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19