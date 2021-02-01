import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible of drawing polylines.
 */
var PolylineDrawerService = /** @class */ (function (_super) {
    __extends(PolylineDrawerService, _super);
    function PolylineDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polyline) || this;
    }
    PolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolylineDrawerService);
    return PolylineDrawerService;
}(EntitiesDrawerService));
export { PolylineDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRTNFOztHQUVHO0FBRUg7SUFBMkMseUNBQXFCO0lBQzlELCtCQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLGFBQWEsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQzdDLENBQUM7O2dCQUYwQixhQUFhOztJQUQ3QixxQkFBcUI7UUFEakMsVUFBVSxFQUFFO3lDQUVnQixhQUFhO09BRDdCLHFCQUFxQixDQUlqQztJQUFELDRCQUFDO0NBQUEsQUFKRCxDQUEyQyxxQkFBcUIsR0FJL0Q7U0FKWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgb2YgZHJhd2luZyBwb2x5bGluZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5bGluZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBFbnRpdGllc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoY2VzaXVtU2VydmljZSwgR3JhcGhpY3NUeXBlLnBvbHlsaW5lKTtcbiAgfVxufVxuIl19