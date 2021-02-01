import { __decorate, __metadata } from "tslib";
import { CesiumService } from '../cesium/cesium.service';
import { Injectable } from '@angular/core';
var MapLayersService = /** @class */ (function () {
    function MapLayersService(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    MapLayersService.prototype.registerLayerDataSources = function (dataSources, zIndex) {
        var _this = this;
        dataSources.forEach(function (ds) {
            ds.zIndex = zIndex;
            _this.layersDataSources.push(ds);
        });
    };
    MapLayersService.prototype.drawAllLayers = function () {
        var _this = this;
        this.layersDataSources.sort(function (a, b) { return a.zIndex - b.zIndex; });
        this.layersDataSources.forEach(function (dataSource) {
            _this.cesiumService.getViewer().dataSources.add(dataSource);
        });
    };
    MapLayersService.prototype.updateAndRefresh = function (dataSources, newZIndex) {
        var _this = this;
        if (dataSources && dataSources.length) {
            dataSources.forEach(function (ds) {
                var index = _this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    _this.layersDataSources[index].zIndex = newZIndex;
                }
            });
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    };
    MapLayersService.prototype.removeDataSources = function (dataSources) {
        var _this = this;
        dataSources.forEach(function (ds) {
            var index = _this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                _this.layersDataSources.splice(index, 1);
                _this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        });
    };
    MapLayersService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    MapLayersService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], MapLayersService);
    return MapLayersService;
}());
export { MapLayersService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDO0lBSUUsMEJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBRnhDLHNCQUFpQixHQUFVLEVBQUUsQ0FBQztJQUl0QyxDQUFDO0lBRUQsbURBQXdCLEdBQXhCLFVBQXlCLFdBQWtCLEVBQUUsTUFBYztRQUEzRCxpQkFLQztRQUpDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0NBQWEsR0FBYjtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQW5CLENBQW1CLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTtZQUN4QyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMkNBQWdCLEdBQWhCLFVBQWlCLFdBQWtCLEVBQUUsU0FBaUI7UUFBdEQsaUJBWUM7UUFYQyxJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3JDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFO2dCQUNyQixJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7aUJBQ2xEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQsNENBQWlCLEdBQWpCLFVBQWtCLFdBQWtCO1FBQXBDLGlCQVFDO1FBUEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7WUFDcEIsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDaEIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0Q7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXpDa0MsYUFBYTs7SUFKckMsZ0JBQWdCO1FBRDVCLFVBQVUsRUFBRTt5Q0FLd0IsYUFBYTtPQUpyQyxnQkFBZ0IsQ0E4QzVCO0lBQUQsdUJBQUM7Q0FBQSxBQTlDRCxJQThDQztTQTlDWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcExheWVyc1NlcnZpY2Uge1xuXG4gIHByaXZhdGUgbGF5ZXJzRGF0YVNvdXJjZXM6IGFueVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG5cbiAgfVxuXG4gIHJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkYXRhU291cmNlczogYW55W10sIHpJbmRleDogbnVtYmVyKSB7XG4gICAgZGF0YVNvdXJjZXMuZm9yRWFjaChkcyA9PiB7XG4gICAgICBkcy56SW5kZXggPSB6SW5kZXg7XG4gICAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnB1c2goZHMpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJhd0FsbExheWVycygpIHtcbiAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpO1xuXG4gICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5mb3JFYWNoKChkYXRhU291cmNlKSA9PiB7XG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMuYWRkKGRhdGFTb3VyY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQW5kUmVmcmVzaChkYXRhU291cmNlczogYW55W10sIG5ld1pJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGRhdGFTb3VyY2VzICYmIGRhdGFTb3VyY2VzLmxlbmd0aCkge1xuICAgICAgZGF0YVNvdXJjZXMuZm9yRWFjaCgoZHMpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmluZGV4T2YoZHMpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlc1tpbmRleF0uekluZGV4ID0gbmV3WkluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLnJlbW92ZUFsbCgpO1xuICAgICAgdGhpcy5kcmF3QWxsTGF5ZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRGF0YVNvdXJjZXMoZGF0YVNvdXJjZXM6IGFueVtdKSB7XG4gICAgZGF0YVNvdXJjZXMuZm9yRWFjaChkcyA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuaW5kZXhPZihkcyk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLnJlbW92ZShkcywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==