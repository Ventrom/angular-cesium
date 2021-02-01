import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
var CzmlDrawerService = /** @class */ (function (_super) {
    __extends(CzmlDrawerService, _super);
    function CzmlDrawerService(cesiumService) {
        var _this = _super.call(this) || this;
        _this.cesiumService = cesiumService;
        return _this;
    }
    CzmlDrawerService.prototype.init = function (options) {
        var dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    };
    // returns the packet, provided by the stream
    CzmlDrawerService.prototype.add = function (cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    };
    CzmlDrawerService.prototype.update = function (entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    };
    CzmlDrawerService.prototype.remove = function (entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    };
    CzmlDrawerService.prototype.removeAll = function () {
        this.czmlStream.entities.removeAll();
    };
    CzmlDrawerService.prototype.setShow = function (showValue) {
        this.czmlStream.entities.show = showValue;
    };
    CzmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    CzmlDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], CzmlDrawerService);
    return CzmlDrawerService;
}(BasicDrawerService));
export { CzmlDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFHMUU7O0dBRUc7QUFFSDtJQUF1QyxxQ0FBa0I7SUFJdkQsMkJBQ1UsYUFBNEI7UUFEdEMsWUFHRSxpQkFBTyxTQUNSO1FBSFMsbUJBQWEsR0FBYixhQUFhLENBQWU7O0lBR3RDLENBQUM7SUFHRCxnQ0FBSSxHQUFKLFVBQUssT0FBK0I7UUFDbEMsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELDZDQUE2QztJQUM3QywrQkFBRyxHQUFILFVBQUksV0FBZ0I7UUFFbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxrQ0FBTSxHQUFOLFVBQU8sTUFBVyxFQUFFLFdBQWdCO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsa0NBQU0sR0FBTixVQUFPLE1BQVc7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHFDQUFTLEdBQVQ7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsbUNBQU8sR0FBUCxVQUFRLFNBQWtCO1FBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7SUFDNUMsQ0FBQzs7Z0JBeEN3QixhQUFhOztJQUwzQixpQkFBaUI7UUFEN0IsVUFBVSxFQUFFO3lDQU1jLGFBQWE7T0FMM0IsaUJBQWlCLENBK0M3QjtJQUFELHdCQUFDO0NBQUEsQUEvQ0QsQ0FBdUMsa0JBQWtCLEdBK0N4RDtTQS9DWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbnRpdGllcy1kcmF3ZXItb3B0aW9ucyc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGN6bWwgZGF0YVNvdXJjZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDem1sRHJhd2VyU2VydmljZSBleHRlbmRzIEJhc2ljRHJhd2VyU2VydmljZSB7XG5cbiAgY3ptbFN0cmVhbTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG5cbiAgaW5pdChvcHRpb25zPzogRW50aXRpZXNEcmF3ZXJPcHRpb25zKSB7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSBbXTtcblxuICAgIHRoaXMuY3ptbFN0cmVhbSA9IG5ldyBDZXNpdW0uQ3ptbERhdGFTb3VyY2UoJ2N6bWwnKTtcblxuICAgIGRhdGFTb3VyY2VzLnB1c2godGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQodGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlcztcbiAgfVxuXG4gIC8vIHJldHVybnMgdGhlIHBhY2tldCwgcHJvdmlkZWQgYnkgdGhlIHN0cmVhbVxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG5cbiAgICB0aGlzLmN6bWxTdHJlYW0ucHJvY2VzcyhjZXNpdW1Qcm9wcy5jem1sUGFja2V0KTtcblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5wcm9jZXNzKGNlc2l1bVByb3BzLmN6bWxQYWNrZXQpO1xuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnJlbW92ZUJ5SWQoZW50aXR5LmFjRW50aXR5LmlkKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBzZXRTaG93KHNob3dWYWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5zaG93ID0gc2hvd1ZhbHVlO1xuICB9XG5cbn1cblxuXG4iXX0=