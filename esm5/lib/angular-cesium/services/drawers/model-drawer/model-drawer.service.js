import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing models.
 */
var ModelDrawerService = /** @class */ (function (_super) {
    __extends(ModelDrawerService, _super);
    function ModelDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.model) || this;
    }
    ModelDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    ModelDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], ModelDrawerService);
    return ModelDrawerService;
}(EntitiesDrawerService));
export { ModelDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL21vZGVsLWRyYXdlci9tb2RlbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNuRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRTNFOztHQUVHO0FBRUg7SUFBd0Msc0NBQXFCO0lBQzNELDRCQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLGFBQWEsRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQzFDLENBQUM7O2dCQUYwQixhQUFhOztJQUQ3QixrQkFBa0I7UUFEOUIsVUFBVSxFQUFFO3lDQUVnQixhQUFhO09BRDdCLGtCQUFrQixDQUk5QjtJQUFELHlCQUFDO0NBQUEsQUFKRCxDQUF3QyxxQkFBcUIsR0FJNUQ7U0FKWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgbW9kZWxzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9kZWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKGNlc2l1bVNlcnZpY2UsIEdyYXBoaWNzVHlwZS5tb2RlbCk7XG4gIH1cbn1cbiJdfQ==