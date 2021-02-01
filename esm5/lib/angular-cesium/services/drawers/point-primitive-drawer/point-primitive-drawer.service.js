import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
var PointPrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PointPrimitiveDrawerService, _super);
    function PointPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PointPrimitiveCollection, cesiumService) || this;
    }
    PointPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PointPrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PointPrimitiveDrawerService);
    return PointPrimitiveDrawerService;
}(PrimitivesDrawerService));
export { PointPrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFekY7OztHQUdHO0FBRUg7SUFBaUQsK0NBQXVCO0lBQ3RFLHFDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxhQUFhLENBQUM7SUFDdkQsQ0FBQzs7Z0JBRjBCLGFBQWE7O0lBRDdCLDJCQUEyQjtRQUR2QyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IsMkJBQTJCLENBSXZDO0lBQUQsa0NBQUM7Q0FBQSxBQUpELENBQWlELHVCQUF1QixHQUl2RTtTQUpZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgb2YgZHJhd2luZyBwb2ludHMgYXMgcHJpbWl0aXZlcy5cbiAqICBUaGlzIGRyYXdlciBpcyBtb3JlIGVmZmljaWVudCB0aGFuIFBvaW50RHJhd2VyU2VydmljZSB3aGVuIGRyYXdpbmcgZHluYW1pYyBwb2ludHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUG9pbnRQcmltaXRpdmVDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19