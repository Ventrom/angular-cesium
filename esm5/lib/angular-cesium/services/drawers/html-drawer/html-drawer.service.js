import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
var HtmlDrawerService = /** @class */ (function (_super) {
    __extends(HtmlDrawerService, _super);
    function HtmlDrawerService(_cesiumService) {
        var _this = _super.call(this, Cesium.HtmlCollection, _cesiumService) || this;
        _this._cesiumService = _cesiumService;
        return _this;
    }
    HtmlDrawerService.prototype.add = function (cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return _super.prototype.add.call(this, cesiumProps);
    };
    HtmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    HtmlDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], HtmlDrawerService);
    return HtmlDrawerService;
}(PrimitivesDrawerService));
export { HtmlDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFHekY7SUFBdUMscUNBQXVCO0lBQzVELDJCQUFvQixjQUE2QjtRQUFqRCxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLFNBQzdDO1FBRm1CLG9CQUFjLEdBQWQsY0FBYyxDQUFlOztJQUVqRCxDQUFDO0lBRUQsK0JBQUcsR0FBSCxVQUFJLFdBQWdCO1FBQ2xCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDMUUsT0FBTyxpQkFBTSxHQUFHLFlBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Z0JBUm1DLGFBQWE7O0lBRHRDLGlCQUFpQjtRQUQ3QixVQUFVLEVBQUU7eUNBRXlCLGFBQWE7T0FEdEMsaUJBQWlCLENBVTdCO0lBQUQsd0JBQUM7Q0FBQSxBQVZELENBQXVDLHVCQUF1QixHQVU3RDtTQVZZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkh0bWxDb2xsZWN0aW9uLCBfY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY2VzaXVtUHJvcHMuc2NlbmUgPSB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY2VzaXVtUHJvcHMubWFwQ29udGFpbmVyID0gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKTtcbiAgICByZXR1cm4gc3VwZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgfVxufVxuIl19