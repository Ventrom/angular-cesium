import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';
/**
 *  This drawer is responsible for drawing billboards.
 */
var BillboardDrawerService = /** @class */ (function (_super) {
    __extends(BillboardDrawerService, _super);
    function BillboardDrawerService(cesiumService) {
        return _super.call(this, cesiumService, GraphicsType.billboard) || this;
    }
    BillboardDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    BillboardDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], BillboardDrawerService);
    return BillboardDrawerService;
}(EntitiesDrawerService));
export { BillboardDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbkYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRTNFOztHQUVHO0FBRUg7SUFBNEMsMENBQXFCO0lBQy9ELGdDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLGFBQWEsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDO0lBQzlDLENBQUM7O2dCQUYwQixhQUFhOztJQUQ3QixzQkFBc0I7UUFEbEMsVUFBVSxFQUFFO3lDQUVnQixhQUFhO09BRDdCLHNCQUFzQixDQUlsQztJQUFELDZCQUFDO0NBQUEsQUFKRCxDQUE0QyxxQkFBcUIsR0FJaEU7U0FKWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHcmFwaGljc1R5cGUgfSBmcm9tICcuLi9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYmlsbGJvYXJkcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJpbGxib2FyZERyYXdlclNlcnZpY2UgZXh0ZW5kcyBFbnRpdGllc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoY2VzaXVtU2VydmljZSwgR3JhcGhpY3NUeXBlLmJpbGxib2FyZCk7XG4gIH1cbn1cbiJdfQ==