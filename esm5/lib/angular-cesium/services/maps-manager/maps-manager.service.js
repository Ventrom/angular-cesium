import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
var MapsManagerService = /** @class */ (function () {
    function MapsManagerService() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    MapsManagerService.prototype.getMap = function (id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    };
    MapsManagerService.prototype._registerMap = function (id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        var mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error("Map with id: " + mapId + " already exist");
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    };
    MapsManagerService.prototype._removeMapById = function (id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            var iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    };
    MapsManagerService.prototype.generateDefaultId = function () {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    };
    /**
     * Binds multiple 2D map's cameras together.
     * @param mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     */
    MapsManagerService.prototype.sync2DMapsCameras = function (mapsConfiguration) {
        var _this = this;
        var DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        var maps = mapsConfiguration.map(function (config) {
            var map = _this.getMap(config.id);
            if (!map) {
                throw new Error("Couldn't find map with id: " + config.id);
            }
            return { map: map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        });
        maps.forEach(function (masterMapConfig) {
            var masterMap = masterMapConfig.map;
            var options = masterMapConfig.options;
            var masterCamera = masterMap.getCameraService().getCamera();
            var masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            var removeCallback = masterCamera.changed.addEventListener(function () {
                maps.forEach(function (slaveMapConfig) {
                    var slaveMap = slaveMapConfig.map;
                    var slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    var slaveCamera = slaveMap.getCameraService().getCamera();
                    var slaveCameraCartographic = slaveCamera.positionCartographic;
                    var position = Cesium.Ellipsoid.WGS84.cartographicToCartesian({
                        longitude: masterCameraCartographic.longitude,
                        latitude: masterCameraCartographic.latitude,
                        height: slaveMapOptions.bindZoom ? masterCameraCartographic.height : slaveCameraCartographic.height,
                    });
                    if (slaveMap.getCesiumViewer().scene.mode !== Cesium.SceneMode.MORPHING) {
                        slaveCamera.setView({
                            destination: position,
                            orientation: {
                                heading: slaveCamera.heading,
                                pitch: slaveCamera.pitch,
                            },
                        });
                    }
                });
            });
            _this.eventRemoveCallbacks.push(removeCallback);
        });
    };
    /**
     * Unsyncs maps cameras
     */
    MapsManagerService.prototype.unsyncMapsCameras = function () {
        this.eventRemoveCallbacks.forEach(function (removeCallback) { return removeCallback(); });
        this.eventRemoveCallbacks = [];
    };
    MapsManagerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], MapsManagerService);
    return MapsManagerService;
}());
export { MapsManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7OztHQUdHO0FBRUg7SUFNRTtRQUxRLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFFMUMseUJBQW9CLEdBQWUsRUFBRSxDQUFDO0lBRzlDLENBQUM7SUFFRCxtQ0FBTSxHQUFOLFVBQU8sRUFBVztRQUNoQixJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQseUNBQVksR0FBWixVQUFhLEVBQVUsRUFBRSxLQUFxQjtRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN2QjtRQUVELElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWdCLEtBQUssbUJBQWdCLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QixPQUFPLEtBQUss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dUJBQXVCLENBQUMsTUFBTTtxQkFDcEcsQ0FBQyxDQUFDO29CQUVILElBQUksUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7d0JBQ3ZFLFdBQVcsQ0FBQyxPQUFPLENBQUM7NEJBQ2xCLFdBQVcsRUFBRSxRQUFROzRCQUNyQixXQUFXLEVBQUU7Z0NBQ1gsT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPO2dDQUM1QixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7NkJBQ3pCO3lCQUNGLENBQUMsQ0FBQztxQkFDSjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILDhDQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxjQUFjLElBQUksT0FBQSxjQUFjLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQXpHVSxrQkFBa0I7UUFEOUIsVUFBVSxFQUFFOztPQUNBLGtCQUFrQixDQTBHOUI7SUFBRCx5QkFBQztDQUFBLEFBMUdELElBMEdDO1NBMUdZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbi8qKlxuICogIFRoZSBzZXJ2aWNlIG1hbmFnZXMgYGFjLW1hcGAgaW5zdGFuY2VzLiBgYWMtbWFwYCByZWdpc3RlciBpdHNlbGYgdG8gdGhpcyBzZXJ2aWNlLlxuICogIFRoaXMgYWxsb3dzIHJldHJpZXZhbCBvZiBtYXBzIHByb3ZpZGVkIHNlcnZpY2VzIG91dHNpZGUgb2YgYGFjLW1hcGAgc2NvcGUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXBzTWFuYWdlclNlcnZpY2Uge1xuICBwcml2YXRlIGRlZmF1bHRJZENvdW50ZXIgPSAwO1xuICBwcml2YXRlIF9NYXBzID0gbmV3IE1hcDxzdHJpbmcsIEFjTWFwQ29tcG9uZW50PigpO1xuICBwcml2YXRlIGZpcnN0TWFwOiBhbnk7XG4gIHByaXZhdGUgZXZlbnRSZW1vdmVDYWxsYmFja3M6IEZ1bmN0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGdldE1hcChpZD86IHN0cmluZyk6IEFjTWFwQ29tcG9uZW50IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXJzdE1hcDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX01hcHMuZ2V0KGlkKTtcbiAgfVxuXG4gIF9yZWdpc3Rlck1hcChpZDogc3RyaW5nLCBhY01hcDogQWNNYXBDb21wb25lbnQpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5maXJzdE1hcCkge1xuICAgICAgdGhpcy5maXJzdE1hcCA9IGFjTWFwO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcElkID0gaWQgPyBpZCA6IHRoaXMuZ2VuZXJhdGVEZWZhdWx0SWQoKTtcbiAgICBpZiAodGhpcy5fTWFwcy5oYXMobWFwSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCB3aXRoIGlkOiAke21hcElkfSBhbHJlYWR5IGV4aXN0YCk7XG4gICAgfVxuICAgIHRoaXMuX01hcHMuc2V0KG1hcElkLCBhY01hcCk7XG4gICAgcmV0dXJuIG1hcElkO1xuICB9XG5cbiAgX3JlbW92ZU1hcEJ5SWQoaWQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9NYXBzLmhhcyhpZCkgJiYgdGhpcy5fTWFwcy5nZXQoaWQpID09PSB0aGlzLmZpcnN0TWFwKSB7XG4gICAgICBjb25zdCBpdGVyID0gdGhpcy5fTWFwcy52YWx1ZXMoKTtcbiAgICAgIGl0ZXIubmV4dCgpOyAvLyBza2lwIGZpcnN0TWFwXG4gICAgICB0aGlzLmZpcnN0TWFwID0gaXRlci5uZXh0KCkudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9NYXBzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlRGVmYXVsdElkKCk6IHN0cmluZyB7XG4gICAgdGhpcy5kZWZhdWx0SWRDb3VudGVyKys7XG4gICAgcmV0dXJuICdkZWZhdWx0LW1hcC1pZC0nICsgdGhpcy5kZWZhdWx0SWRDb3VudGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIG11bHRpcGxlIDJEIG1hcCdzIGNhbWVyYXMgdG9nZXRoZXIuXG4gICAqIEBwYXJhbSBtYXBzQ29uZmlndXJhdGlvbiAtIGJpbmRpbmcgb3B0aW9ucy5cbiAgICogbWFwSWQgLSB0aGUgaWQgb2YgdGhlIG1hcHMgdG8gYmluZC5cbiAgICogc2Vuc2l0aXZpdHkgLSB0aGUgYW1vdW50IHRoZSBjYW1lcmEgcG9zaXRpb24gc2hvdWxkIGNoYW5nZSBpbiBvcmRlciB0byBzeW5jIG90aGVyIG1hcHMuXG4gICAqIGJpbmRab29tIC0gc2hvdWxkIGJpbmQgem9vbSBsZXZlbFxuICAgKi9cbiAgc3luYzJETWFwc0NhbWVyYXMobWFwc0NvbmZpZ3VyYXRpb246IHsgaWQ6IHN0cmluZzsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9W10pIHtcbiAgICBjb25zdCBERUZBVUxUX1NFTlNJVElWSVRZID0gMC4wMTtcbiAgICB0aGlzLnVuc3luY01hcHNDYW1lcmFzKCk7XG4gICAgY29uc3QgbWFwczogeyBtYXA6IEFjTWFwQ29tcG9uZW50OyBvcHRpb25zPzogeyBzZW5zaXRpdml0eT86IG51bWJlcjsgYmluZFpvb20/OiBib29sZWFuIH0gfVtdID0gbWFwc0NvbmZpZ3VyYXRpb24ubWFwKGNvbmZpZyA9PiB7XG4gICAgICBjb25zdCBtYXAgPSB0aGlzLmdldE1hcChjb25maWcuaWQpO1xuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIG1hcCB3aXRoIGlkOiAke2NvbmZpZy5pZH1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHttYXAsIG9wdGlvbnM6IHtzZW5zaXRpdml0eTogY29uZmlnLnNlbnNpdGl2aXR5LCBiaW5kWm9vbTogY29uZmlnLmJpbmRab29tfX07XG4gICAgfSk7XG5cbiAgICBtYXBzLmZvckVhY2gobWFzdGVyTWFwQ29uZmlnID0+IHtcbiAgICAgIGNvbnN0IG1hc3Rlck1hcCA9IG1hc3Rlck1hcENvbmZpZy5tYXA7XG4gICAgICBjb25zdCBvcHRpb25zID0gbWFzdGVyTWFwQ29uZmlnLm9wdGlvbnM7XG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmEgPSBtYXN0ZXJNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xuICAgICAgY29uc3QgbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljID0gbWFzdGVyQ2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgICAgbWFzdGVyQ2FtZXJhLnBlcmNlbnRhZ2VDaGFuZ2VkID0gb3B0aW9ucy5zZW5zaXRpdml0eSB8fCBERUZBVUxUX1NFTlNJVElWSVRZO1xuICAgICAgY29uc3QgcmVtb3ZlQ2FsbGJhY2sgPSBtYXN0ZXJDYW1lcmEuY2hhbmdlZC5hZGRFdmVudExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgbWFwcy5mb3JFYWNoKHNsYXZlTWFwQ29uZmlnID0+IHtcbiAgICAgICAgICBjb25zdCBzbGF2ZU1hcCA9IHNsYXZlTWFwQ29uZmlnLm1hcDtcbiAgICAgICAgICBjb25zdCBzbGF2ZU1hcE9wdGlvbnMgPSBzbGF2ZU1hcENvbmZpZy5vcHRpb25zO1xuICAgICAgICAgIGlmIChzbGF2ZU1hcCA9PT0gbWFzdGVyTWFwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc2xhdmVDYW1lcmEgPSBzbGF2ZU1hcC5nZXRDYW1lcmFTZXJ2aWNlKCkuZ2V0Q2FtZXJhKCk7XG4gICAgICAgICAgY29uc3Qgc2xhdmVDYW1lcmFDYXJ0b2dyYXBoaWMgPSBzbGF2ZUNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IENlc2l1bS5FbGxpcHNvaWQuV0dTODQuY2FydG9ncmFwaGljVG9DYXJ0ZXNpYW4oe1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGhlaWdodDogc2xhdmVNYXBPcHRpb25zLmJpbmRab29tID8gbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmhlaWdodCA6IHNsYXZlQ2FtZXJhQ2FydG9ncmFwaGljLmhlaWdodCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChzbGF2ZU1hcC5nZXRDZXNpdW1WaWV3ZXIoKS5zY2VuZS5tb2RlICE9PSBDZXNpdW0uU2NlbmVNb2RlLk1PUlBISU5HKSB7XG4gICAgICAgICAgICBzbGF2ZUNhbWVyYS5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgZGVzdGluYXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICBvcmllbnRhdGlvbjoge1xuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHNsYXZlQ2FtZXJhLmhlYWRpbmcsXG4gICAgICAgICAgICAgICAgcGl0Y2g6IHNsYXZlQ2FtZXJhLnBpdGNoLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcy5wdXNoKHJlbW92ZUNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN5bmNzIG1hcHMgY2FtZXJhc1xuICAgKi9cbiAgdW5zeW5jTWFwc0NhbWVyYXMoKSB7XG4gICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcy5mb3JFYWNoKHJlbW92ZUNhbGxiYWNrID0+IHJlbW92ZUNhbGxiYWNrKCkpO1xuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MgPSBbXTtcbiAgfVxufVxuIl19