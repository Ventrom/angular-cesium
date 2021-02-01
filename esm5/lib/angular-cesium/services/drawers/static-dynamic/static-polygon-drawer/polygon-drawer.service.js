import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
var StaticPolygonDrawerService = /** @class */ (function (_super) {
    __extends(StaticPolygonDrawerService, _super);
    function StaticPolygonDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolygonGeometry, cesiumService) || this;
    }
    StaticPolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticPolygonDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticPolygonDrawerService);
    return StaticPolygonDrawerService;
}(StaticPrimitiveDrawer));
export { StaticPolygonDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDbkcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRS9EOzs7O0dBSUc7QUFFSDtJQUFnRCw4Q0FBcUI7SUFDbkUsb0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUM7SUFDOUMsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLDBCQUEwQjtRQUR0QyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IsMEJBQTBCLENBSXRDO0lBQUQsaUNBQUM7Q0FBQSxBQUpELENBQWdELHFCQUFxQixHQUlwRTtTQUpZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICsgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYSBwb2x5Z29uIG92ZXIgdGhlIENlc2l1bSBtYXAuXG4gKyBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgc2ltcGxlIFBvbHlnb25HZW9tZXRyeSBhbmQgUHJpbWl0aXZlIHBhcmFtZXRlcnMuXG4gKyBUaGlzIGRvZXNuJ3QgYWxsb3cgdXMgdG8gY2hhbmdlIHRoZSBwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIG9mIHRoZSBwb2x5Z29ucy4gRm9yIHRoYXQgeW91IG1heSB1c2UgdGhlIGR5bmFtaWMgcG9seWdvbiBjb21wb25lbnQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUG9seWdvbkdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19