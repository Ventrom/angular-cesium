import { Injectable } from '@angular/core';
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
export class MapsManagerService {
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
}
MapsManagerService.decorators = [
    { type: Injectable }
];
MapsManagerService.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDOzs7R0FHRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFNN0I7UUFMUSxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBRTFDLHlCQUFvQixHQUFlLEVBQUUsQ0FBQztJQUc5QyxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQVc7UUFDaEIsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFVLEVBQUUsS0FBcUI7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7UUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLGdCQUFnQixDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVB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d0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE1BQU07cUJBQ3BHLENBQUMsQ0FBQztvQkFFSCxJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO3dCQUN2RSxXQUFXLENBQUMsT0FBTyxDQUFDOzRCQUNsQixXQUFXLEVBQUUsUUFBUTs0QkFDckIsV0FBVyxFQUFFO2dDQUNYLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztnQ0FDNUIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLOzZCQUN6Qjt5QkFDRixDQUFDLENBQUM7cUJBQ0o7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxpQkFBaUI7UUFDZixJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLENBQUM7OztZQTFHRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuLyoqXG4gKiAgVGhlIHNlcnZpY2UgbWFuYWdlcyBgYWMtbWFwYCBpbnN0YW5jZXMuIGBhYy1tYXBgIHJlZ2lzdGVyIGl0c2VsZiB0byB0aGlzIHNlcnZpY2UuXG4gKiAgVGhpcyBhbGxvd3MgcmV0cmlldmFsIG9mIG1hcHMgcHJvdmlkZWQgc2VydmljZXMgb3V0c2lkZSBvZiBgYWMtbWFwYCBzY29wZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcHNNYW5hZ2VyU2VydmljZSB7XG4gIHByaXZhdGUgZGVmYXVsdElkQ291bnRlciA9IDA7XG4gIHByaXZhdGUgX01hcHMgPSBuZXcgTWFwPHN0cmluZywgQWNNYXBDb21wb25lbnQ+KCk7XG4gIHByaXZhdGUgZmlyc3RNYXA6IGFueTtcbiAgcHJpdmF0ZSBldmVudFJlbW92ZUNhbGxiYWNrczogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgZ2V0TWFwKGlkPzogc3RyaW5nKTogQWNNYXBDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpcnN0TWFwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fTWFwcy5nZXQoaWQpO1xuICB9XG5cbiAgX3JlZ2lzdGVyTWFwKGlkOiBzdHJpbmcsIGFjTWFwOiBBY01hcENvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmZpcnN0TWFwKSB7XG4gICAgICB0aGlzLmZpcnN0TWFwID0gYWNNYXA7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwSWQgPSBpZCA/IGlkIDogdGhpcy5nZW5lcmF0ZURlZmF1bHRJZCgpO1xuICAgIGlmICh0aGlzLl9NYXBzLmhhcyhtYXBJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwIHdpdGggaWQ6ICR7bWFwSWR9IGFscmVhZHkgZXhpc3RgKTtcbiAgICB9XG4gICAgdGhpcy5fTWFwcy5zZXQobWFwSWQsIGFjTWFwKTtcbiAgICByZXR1cm4gbWFwSWQ7XG4gIH1cblxuICBfcmVtb3ZlTWFwQnlJZChpZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX01hcHMuaGFzKGlkKSAmJiB0aGlzLl9NYXBzLmdldChpZCkgPT09IHRoaXMuZmlyc3RNYXApIHtcbiAgICAgIGNvbnN0IGl0ZXIgPSB0aGlzLl9NYXBzLnZhbHVlcygpO1xuICAgICAgaXRlci5uZXh0KCk7IC8vIHNraXAgZmlyc3RNYXBcbiAgICAgIHRoaXMuZmlyc3RNYXAgPSBpdGVyLm5leHQoKS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX01hcHMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVEZWZhdWx0SWQoKTogc3RyaW5nIHtcbiAgICB0aGlzLmRlZmF1bHRJZENvdW50ZXIrKztcbiAgICByZXR1cm4gJ2RlZmF1bHQtbWFwLWlkLScgKyB0aGlzLmRlZmF1bHRJZENvdW50ZXI7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgbXVsdGlwbGUgMkQgbWFwJ3MgY2FtZXJhcyB0b2dldGhlci5cbiAgICogQHBhcmFtIG1hcHNDb25maWd1cmF0aW9uIC0gYmluZGluZyBvcHRpb25zLlxuICAgKiBtYXBJZCAtIHRoZSBpZCBvZiB0aGUgbWFwcyB0byBiaW5kLlxuICAgKiBzZW5zaXRpdml0eSAtIHRoZSBhbW91bnQgdGhlIGNhbWVyYSBwb3NpdGlvbiBzaG91bGQgY2hhbmdlIGluIG9yZGVyIHRvIHN5bmMgb3RoZXIgbWFwcy5cbiAgICogYmluZFpvb20gLSBzaG91bGQgYmluZCB6b29tIGxldmVsXG4gICAqL1xuICBzeW5jMkRNYXBzQ2FtZXJhcyhtYXBzQ29uZmlndXJhdGlvbjogeyBpZDogc3RyaW5nOyBzZW5zaXRpdml0eT86IG51bWJlcjsgYmluZFpvb20/OiBib29sZWFuIH1bXSkge1xuICAgIGNvbnN0IERFRkFVTFRfU0VOU0lUSVZJVFkgPSAwLjAxO1xuICAgIHRoaXMudW5zeW5jTWFwc0NhbWVyYXMoKTtcbiAgICBjb25zdCBtYXBzOiB7IG1hcDogQWNNYXBDb21wb25lbnQ7IG9wdGlvbnM/OiB7IHNlbnNpdGl2aXR5PzogbnVtYmVyOyBiaW5kWm9vbT86IGJvb2xlYW4gfSB9W10gPSBtYXBzQ29uZmlndXJhdGlvbi5tYXAoY29uZmlnID0+IHtcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMuZ2V0TWFwKGNvbmZpZy5pZCk7XG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IGZpbmQgbWFwIHdpdGggaWQ6ICR7Y29uZmlnLmlkfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge21hcCwgb3B0aW9uczoge3NlbnNpdGl2aXR5OiBjb25maWcuc2Vuc2l0aXZpdHksIGJpbmRab29tOiBjb25maWcuYmluZFpvb219fTtcbiAgICB9KTtcblxuICAgIG1hcHMuZm9yRWFjaChtYXN0ZXJNYXBDb25maWcgPT4ge1xuICAgICAgY29uc3QgbWFzdGVyTWFwID0gbWFzdGVyTWFwQ29uZmlnLm1hcDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBtYXN0ZXJNYXBDb25maWcub3B0aW9ucztcbiAgICAgIGNvbnN0IG1hc3RlckNhbWVyYSA9IG1hc3Rlck1hcC5nZXRDYW1lcmFTZXJ2aWNlKCkuZ2V0Q2FtZXJhKCk7XG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMgPSBtYXN0ZXJDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgICBtYXN0ZXJDYW1lcmEucGVyY2VudGFnZUNoYW5nZWQgPSBvcHRpb25zLnNlbnNpdGl2aXR5IHx8IERFRkFVTFRfU0VOU0lUSVZJVFk7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFjayA9IG1hc3RlckNhbWVyYS5jaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICBtYXBzLmZvckVhY2goc2xhdmVNYXBDb25maWcgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsYXZlTWFwID0gc2xhdmVNYXBDb25maWcubWFwO1xuICAgICAgICAgIGNvbnN0IHNsYXZlTWFwT3B0aW9ucyA9IHNsYXZlTWFwQ29uZmlnLm9wdGlvbnM7XG4gICAgICAgICAgaWYgKHNsYXZlTWFwID09PSBtYXN0ZXJNYXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzbGF2ZUNhbWVyYSA9IHNsYXZlTWFwLmdldENhbWVyYVNlcnZpY2UoKS5nZXRDYW1lcmEoKTtcbiAgICAgICAgICBjb25zdCBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYyA9IHNsYXZlQ2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gQ2VzaXVtLkVsbGlwc29pZC5XR1M4NC5jYXJ0b2dyYXBoaWNUb0NhcnRlc2lhbih7XG4gICAgICAgICAgICBsb25naXR1ZGU6IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxhdGl0dWRlLFxuICAgICAgICAgICAgaGVpZ2h0OiBzbGF2ZU1hcE9wdGlvbnMuYmluZFpvb20gPyBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMuaGVpZ2h0IDogc2xhdmVDYW1lcmFDYXJ0b2dyYXBoaWMuaGVpZ2h0LFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHNsYXZlTWFwLmdldENlc2l1bVZpZXdlcigpLnNjZW5lLm1vZGUgIT09IENlc2l1bS5TY2VuZU1vZGUuTU9SUEhJTkcpIHtcbiAgICAgICAgICAgIHNsYXZlQ2FtZXJhLnNldFZpZXcoe1xuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgaGVhZGluZzogc2xhdmVDYW1lcmEuaGVhZGluZyxcbiAgICAgICAgICAgICAgICBwaXRjaDogc2xhdmVDYW1lcmEucGl0Y2gsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzLnB1c2gocmVtb3ZlQ2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3luY3MgbWFwcyBjYW1lcmFzXG4gICAqL1xuICB1bnN5bmNNYXBzQ2FtZXJhcygpIHtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzLmZvckVhY2gocmVtb3ZlQ2FsbGJhY2sgPT4gcmVtb3ZlQ2FsbGJhY2soKSk7XG4gICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcyA9IFtdO1xuICB9XG59XG4iXX0=