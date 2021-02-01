import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
let MapsManagerService = class MapsManagerService {
    constructor() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    getMap(id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    }
    _registerMap(id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        const mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error(`Map with id: ${mapId} already exist`);
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    }
    _removeMapById(id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            const iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    }
    generateDefaultId() {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    }
    /**
     * Binds multiple 2D map's cameras together.
     * @param mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     */
    sync2DMapsCameras(mapsConfiguration) {
        const DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        const maps = mapsConfiguration.map(config => {
            const map = this.getMap(config.id);
            if (!map) {
                throw new Error(`Couldn't find map with id: ${config.id}`);
            }
            return { map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        });
        maps.forEach(masterMapConfig => {
            const masterMap = masterMapConfig.map;
            const options = masterMapConfig.options;
            const masterCamera = masterMap.getCameraService().getCamera();
            const masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            const removeCallback = masterCamera.changed.addEventListener(() => {
                maps.forEach(slaveMapConfig => {
                    const slaveMap = slaveMapConfig.map;
                    const slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    const slaveCamera = slaveMap.getCameraService().getCamera();
                    const slaveCameraCartographic = slaveCamera.positionCartographic;
                    const position = Cesium.Ellipsoid.WGS84.cartographicToCartesian({
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
            this.eventRemoveCallbacks.push(removeCallback);
        });
    }
    /**
     * Unsyncs maps cameras
     */
    unsyncMapsCameras() {
        this.eventRemoveCallbacks.forEach(removeCallback => removeCallback());
        this.eventRemoveCallbacks = [];
    }
};
MapsManagerService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], MapsManagerService);
export { MapsManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7OztHQUdHO0FBRUgsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFNN0I7UUFMUSxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBRTFDLHlCQUFvQixHQUFlLEVBQUUsQ0FBQztJQUc5QyxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFVLEVBQUUsS0FBcUI7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7UUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLGdCQUFnQixDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENB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QUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE1BQU07cUJBQ3BHLENBQUMsQ0FBQztvQkFFSCxJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO3dCQUN2RSxXQUFXLENBQUMsT0FBTyxDQUFDOzRCQUNsQixXQUFXLEVBQUUsUUFBUTs0QkFDckIsV0FBVyxFQUFFO2dDQUNYLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztnQ0FDNUIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLOzZCQUN6Qjt5QkFDRixDQUFDLENBQUM7cUJBQ0o7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUI7UUFDZixJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDRixDQUFBO0FBMUdZLGtCQUFrQjtJQUQ5QixVQUFVLEVBQUU7O0dBQ0Esa0JBQWtCLENBMEc5QjtTQTFHWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBtYW5hZ2VzIGBhYy1tYXBgIGluc3RhbmNlcy4gYGFjLW1hcGAgcmVnaXN0ZXIgaXRzZWxmIHRvIHRoaXMgc2VydmljZS5cbiAqICBUaGlzIGFsbG93cyByZXRyaWV2YWwgb2YgbWFwcyBwcm92aWRlZCBzZXJ2aWNlcyBvdXRzaWRlIG9mIGBhYy1tYXBgIHNjb3BlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwc01hbmFnZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0SWRDb3VudGVyID0gMDtcbiAgcHJpdmF0ZSBfTWFwcyA9IG5ldyBNYXA8c3RyaW5nLCBBY01hcENvbXBvbmVudD4oKTtcbiAgcHJpdmF0ZSBmaXJzdE1hcDogYW55O1xuICBwcml2YXRlIGV2ZW50UmVtb3ZlQ2FsbGJhY2tzOiBGdW5jdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBnZXRNYXAoaWQ/OiBzdHJpbmcpOiBBY01hcENvbXBvbmVudCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RNYXA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9NYXBzLmdldChpZCk7XG4gIH1cblxuICBfcmVnaXN0ZXJNYXAoaWQ6IHN0cmluZywgYWNNYXA6IEFjTWFwQ29tcG9uZW50KTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuZmlyc3RNYXApIHtcbiAgICAgIHRoaXMuZmlyc3RNYXAgPSBhY01hcDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBJZCA9IGlkID8gaWQgOiB0aGlzLmdlbmVyYXRlRGVmYXVsdElkKCk7XG4gICAgaWYgKHRoaXMuX01hcHMuaGFzKG1hcElkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgd2l0aCBpZDogJHttYXBJZH0gYWxyZWFkeSBleGlzdGApO1xuICAgIH1cbiAgICB0aGlzLl9NYXBzLnNldChtYXBJZCwgYWNNYXApO1xuICAgIHJldHVybiBtYXBJZDtcbiAgfVxuXG4gIF9yZW1vdmVNYXBCeUlkKGlkOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5fTWFwcy5oYXMoaWQpICYmIHRoaXMuX01hcHMuZ2V0KGlkKSA9PT0gdGhpcy5maXJzdE1hcCkge1xuICAgICAgY29uc3QgaXRlciA9IHRoaXMuX01hcHMudmFsdWVzKCk7XG4gICAgICBpdGVyLm5leHQoKTsgLy8gc2tpcCBmaXJzdE1hcFxuICAgICAgdGhpcy5maXJzdE1hcCA9IGl0ZXIubmV4dCgpLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fTWFwcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZURlZmF1bHRJZCgpOiBzdHJpbmcge1xuICAgIHRoaXMuZGVmYXVsdElkQ291bnRlcisrO1xuICAgIHJldHVybiAnZGVmYXVsdC1tYXAtaWQtJyArIHRoaXMuZGVmYXVsdElkQ291bnRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBtdWx0aXBsZSAyRCBtYXAncyBjYW1lcmFzIHRvZ2V0aGVyLlxuICAgKiBAcGFyYW0gbWFwc0NvbmZpZ3VyYXRpb24gLSBiaW5kaW5nIG9wdGlvbnMuXG4gICAqIG1hcElkIC0gdGhlIGlkIG9mIHRoZSBtYXBzIHRvIGJpbmQuXG4gICAqIHNlbnNpdGl2aXR5IC0gdGhlIGFtb3VudCB0aGUgY2FtZXJhIHBvc2l0aW9uIHNob3VsZCBjaGFuZ2UgaW4gb3JkZXIgdG8gc3luYyBvdGhlciBtYXBzLlxuICAgKiBiaW5kWm9vbSAtIHNob3VsZCBiaW5kIHpvb20gbGV2ZWxcbiAgICovXG4gIHN5bmMyRE1hcHNDYW1lcmFzKG1hcHNDb25maWd1cmF0aW9uOiB7IGlkOiBzdHJpbmc7IHNlbnNpdGl2aXR5PzogbnVtYmVyOyBiaW5kWm9vbT86IGJvb2xlYW4gfVtdKSB7XG4gICAgY29uc3QgREVGQVVMVF9TRU5TSVRJVklUWSA9IDAuMDE7XG4gICAgdGhpcy51bnN5bmNNYXBzQ2FtZXJhcygpO1xuICAgIGNvbnN0IG1hcHM6IHsgbWFwOiBBY01hcENvbXBvbmVudDsgb3B0aW9ucz86IHsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9IH1bXSA9IG1hcHNDb25maWd1cmF0aW9uLm1hcChjb25maWcgPT4ge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5nZXRNYXAoY29uZmlnLmlkKTtcbiAgICAgIGlmICghbWFwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBtYXAgd2l0aCBpZDogJHtjb25maWcuaWR9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bWFwLCBvcHRpb25zOiB7c2Vuc2l0aXZpdHk6IGNvbmZpZy5zZW5zaXRpdml0eSwgYmluZFpvb206IGNvbmZpZy5iaW5kWm9vbX19O1xuICAgIH0pO1xuXG4gICAgbWFwcy5mb3JFYWNoKG1hc3Rlck1hcENvbmZpZyA9PiB7XG4gICAgICBjb25zdCBtYXN0ZXJNYXAgPSBtYXN0ZXJNYXBDb25maWcubWFwO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IG1hc3Rlck1hcENvbmZpZy5vcHRpb25zO1xuICAgICAgY29uc3QgbWFzdGVyQ2FtZXJhID0gbWFzdGVyTWFwLmdldENhbWVyYVNlcnZpY2UoKS5nZXRDYW1lcmEoKTtcbiAgICAgIGNvbnN0IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYyA9IG1hc3RlckNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICAgIG1hc3RlckNhbWVyYS5wZXJjZW50YWdlQ2hhbmdlZCA9IG9wdGlvbnMuc2Vuc2l0aXZpdHkgfHwgREVGQVVMVF9TRU5TSVRJVklUWTtcbiAgICAgIGNvbnN0IHJlbW92ZUNhbGxiYWNrID0gbWFzdGVyQ2FtZXJhLmNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgIG1hcHMuZm9yRWFjaChzbGF2ZU1hcENvbmZpZyA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXAgPSBzbGF2ZU1hcENvbmZpZy5tYXA7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXBPcHRpb25zID0gc2xhdmVNYXBDb25maWcub3B0aW9ucztcbiAgICAgICAgICBpZiAoc2xhdmVNYXAgPT09IG1hc3Rlck1hcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhID0gc2xhdmVNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhQ2FydG9ncmFwaGljID0gc2xhdmVDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBDZXNpdW0uRWxsaXBzb2lkLldHUzg0LmNhcnRvZ3JhcGhpY1RvQ2FydGVzaWFuKHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMubGF0aXR1ZGUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNsYXZlTWFwT3B0aW9ucy5iaW5kWm9vbSA/IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQgOiBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoc2xhdmVNYXAuZ2V0Q2VzaXVtVmlld2VyKCkuc2NlbmUubW9kZSAhPT0gQ2VzaXVtLlNjZW5lTW9kZS5NT1JQSElORykge1xuICAgICAgICAgICAgc2xhdmVDYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiBzbGF2ZUNhbWVyYS5oZWFkaW5nLFxuICAgICAgICAgICAgICAgIHBpdGNoOiBzbGF2ZUNhbWVyYS5waXRjaCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MucHVzaChyZW1vdmVDYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5zeW5jcyBtYXBzIGNhbWVyYXNcbiAgICovXG4gIHVuc3luY01hcHNDYW1lcmFzKCkge1xuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MuZm9yRWFjaChyZW1vdmVDYWxsYmFjayA9PiByZW1vdmVDYWxsYmFjaygpKTtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzID0gW107XG4gIH1cbn1cbiJdfQ==