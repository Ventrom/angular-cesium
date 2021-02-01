import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
var DynamicPolylineDrawerService = /** @class */ (function (_super) {
    __extends(DynamicPolylineDrawerService, _super);
    function DynamicPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    DynamicPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    DynamicPolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], DynamicPolylineDrawerService);
    return DynamicPolylineDrawerService;
}(PrimitivesDrawerService));
export { DynamicPolylineDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFFNUY7O0dBRUc7QUFFSDtJQUFrRCxnREFBdUI7SUFDdkUsc0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQztJQUNqRCxDQUFDOztnQkFGMEIsYUFBYTs7SUFEN0IsNEJBQTRCO1FBRHhDLFVBQVUsRUFBRTt5Q0FFZ0IsYUFBYTtPQUQ3Qiw0QkFBNEIsQ0FJeEM7SUFBRCxtQ0FBQztDQUFBLEFBSkQsQ0FBa0QsdUJBQXVCLEdBSXhFO1NBSlksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGR5bmFtaWMgdmVyc2lvbiBvZiB0aGUgcG9seWxpbmUgY29tcG9uZW50LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG59XG4iXX0=