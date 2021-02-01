import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing polygons.
 */
var PolygonDrawerService = /** @class */ (function (_super) {
    __extends(PolygonDrawerService, _super);
    function PolygonDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.polygon) || this;
    }
    PolygonDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolygonDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolygonDrawerService);
    return PolygonDrawerService;
}(EntitiesDrawerService));
export { PolygonDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRTNFOztHQUVHO0FBRUg7SUFBMEMsd0NBQXFCO0lBQzdELDhCQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLGFBQWEsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDO0lBQzVDLENBQUM7O2dCQUYwQixhQUFhOztJQUQ3QixvQkFBb0I7UUFEaEMsVUFBVSxFQUFFO3lDQUVnQixhQUFhO09BRDdCLG9CQUFvQixDQUloQztJQUFELDJCQUFDO0NBQUEsQUFKRCxDQUEwQyxxQkFBcUIsR0FJOUQ7U0FKWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgcG9seWdvbnMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5Z29uRHJhd2VyU2VydmljZSBleHRlbmRzIEVudGl0aWVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihjZXNpdW1TZXJ2aWNlLCBHcmFwaGljc1R5cGUucG9seWdvbik7XG4gIH1cbn1cbiJdfQ==