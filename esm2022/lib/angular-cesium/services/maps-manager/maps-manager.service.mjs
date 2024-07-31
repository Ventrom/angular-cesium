import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapsManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sa0JBQWtCO0lBTTdCO1FBTFEscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBMEIsQ0FBQztRQUUxQyx5QkFBb0IsR0FBZSxFQUFFLENBQUM7SUFHOUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFXO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQVUsRUFBRSxLQUFxQjtRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLEtBQUssZ0JBQWdCLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELGNBQWMsQ0FBQyxFQUFVO1FBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9ELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZ0JBQWdCO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNwQyxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLE9BQU8saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ25ELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxpQkFBaUIsQ0FBQyxpQkFBNkU7UUFDN0YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsTUFBTSxJQUFJLEdBQXNGLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM3SCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0QsQ0FBQztZQUVELE9BQU8sRUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsRUFBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUM3QixNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDO1lBQ3RDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUM7WUFDeEMsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUQsTUFBTSx3QkFBd0IsR0FBRyxZQUFZLENBQUMsb0JBQW9CLENBQUM7WUFDbkUsWUFBWSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksbUJBQW1CLENBQUM7WUFDNUUsTUFBTSxjQUFjLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQzVCLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUM7b0JBQ3BDLE1BQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUM7b0JBQy9DLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRSxDQUFDO3dCQUMzQixPQUFPO29CQUNULENBQUM7b0JBRUQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzVELE1BQU0sdUJBQXVCLEdBQUcsV0FBVyxDQUFDLG9CQUFvQixDQUFDO29CQUNqRSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQzt3QkFDOUQsU0FBUyxFQUFFLHdCQUF3QixDQUFDLFNBQVM7d0JBQzdDLFFBQVEsRUFBRSx3QkFBd0IsQ0FBQyxRQUFRO3dCQUMzQyxNQUFNLEVBQUUsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNO3FCQUNwRyxDQUFDLENBQUM7b0JBRUgsSUFBSSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUN4RSxXQUFXLENBQUMsT0FBTyxDQUFDOzRCQUNsQixXQUFXLEVBQUUsUUFBUTs0QkFDckIsV0FBVyxFQUFFO2dDQUNYLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztnQ0FDNUIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLOzZCQUN6Qjt5QkFDRixDQUFDLENBQUM7b0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQjtRQUNmLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQzs4R0F6R1Usa0JBQWtCO2tIQUFsQixrQkFBa0I7OzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBtYW5hZ2VzIGBhYy1tYXBgIGluc3RhbmNlcy4gYGFjLW1hcGAgcmVnaXN0ZXIgaXRzZWxmIHRvIHRoaXMgc2VydmljZS5cbiAqICBUaGlzIGFsbG93cyByZXRyaWV2YWwgb2YgbWFwcyBwcm92aWRlZCBzZXJ2aWNlcyBvdXRzaWRlIG9mIGBhYy1tYXBgIHNjb3BlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwc01hbmFnZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0SWRDb3VudGVyID0gMDtcbiAgcHJpdmF0ZSBfTWFwcyA9IG5ldyBNYXA8c3RyaW5nLCBBY01hcENvbXBvbmVudD4oKTtcbiAgcHJpdmF0ZSBmaXJzdE1hcDogYW55O1xuICBwcml2YXRlIGV2ZW50UmVtb3ZlQ2FsbGJhY2tzOiBGdW5jdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBnZXRNYXAoaWQ/OiBzdHJpbmcpOiBBY01hcENvbXBvbmVudCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RNYXA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9NYXBzLmdldChpZCk7XG4gIH1cblxuICBfcmVnaXN0ZXJNYXAoaWQ6IHN0cmluZywgYWNNYXA6IEFjTWFwQ29tcG9uZW50KTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuZmlyc3RNYXApIHtcbiAgICAgIHRoaXMuZmlyc3RNYXAgPSBhY01hcDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBJZCA9IGlkID8gaWQgOiB0aGlzLmdlbmVyYXRlRGVmYXVsdElkKCk7XG4gICAgaWYgKHRoaXMuX01hcHMuaGFzKG1hcElkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgd2l0aCBpZDogJHttYXBJZH0gYWxyZWFkeSBleGlzdGApO1xuICAgIH1cbiAgICB0aGlzLl9NYXBzLnNldChtYXBJZCwgYWNNYXApO1xuICAgIHJldHVybiBtYXBJZDtcbiAgfVxuXG4gIF9yZW1vdmVNYXBCeUlkKGlkOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5fTWFwcy5oYXMoaWQpICYmIHRoaXMuX01hcHMuZ2V0KGlkKSA9PT0gdGhpcy5maXJzdE1hcCkge1xuICAgICAgY29uc3QgaXRlciA9IHRoaXMuX01hcHMudmFsdWVzKCk7XG4gICAgICBpdGVyLm5leHQoKTsgLy8gc2tpcCBmaXJzdE1hcFxuICAgICAgdGhpcy5maXJzdE1hcCA9IGl0ZXIubmV4dCgpLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fTWFwcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZURlZmF1bHRJZCgpOiBzdHJpbmcge1xuICAgIHRoaXMuZGVmYXVsdElkQ291bnRlcisrO1xuICAgIHJldHVybiAnZGVmYXVsdC1tYXAtaWQtJyArIHRoaXMuZGVmYXVsdElkQ291bnRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBtdWx0aXBsZSAyRCBtYXAncyBjYW1lcmFzIHRvZ2V0aGVyLlxuICAgKiBAcGFyYW0gbWFwc0NvbmZpZ3VyYXRpb24gLSBiaW5kaW5nIG9wdGlvbnMuXG4gICAqIG1hcElkIC0gdGhlIGlkIG9mIHRoZSBtYXBzIHRvIGJpbmQuXG4gICAqIHNlbnNpdGl2aXR5IC0gdGhlIGFtb3VudCB0aGUgY2FtZXJhIHBvc2l0aW9uIHNob3VsZCBjaGFuZ2UgaW4gb3JkZXIgdG8gc3luYyBvdGhlciBtYXBzLlxuICAgKiBiaW5kWm9vbSAtIHNob3VsZCBiaW5kIHpvb20gbGV2ZWxcbiAgICovXG4gIHN5bmMyRE1hcHNDYW1lcmFzKG1hcHNDb25maWd1cmF0aW9uOiB7IGlkOiBzdHJpbmc7IHNlbnNpdGl2aXR5PzogbnVtYmVyOyBiaW5kWm9vbT86IGJvb2xlYW4gfVtdKSB7XG4gICAgY29uc3QgREVGQVVMVF9TRU5TSVRJVklUWSA9IDAuMDE7XG4gICAgdGhpcy51bnN5bmNNYXBzQ2FtZXJhcygpO1xuICAgIGNvbnN0IG1hcHM6IHsgbWFwOiBBY01hcENvbXBvbmVudDsgb3B0aW9ucz86IHsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9IH1bXSA9IG1hcHNDb25maWd1cmF0aW9uLm1hcChjb25maWcgPT4ge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5nZXRNYXAoY29uZmlnLmlkKTtcbiAgICAgIGlmICghbWFwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBtYXAgd2l0aCBpZDogJHtjb25maWcuaWR9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bWFwLCBvcHRpb25zOiB7c2Vuc2l0aXZpdHk6IGNvbmZpZy5zZW5zaXRpdml0eSwgYmluZFpvb206IGNvbmZpZy5iaW5kWm9vbX19O1xuICAgIH0pO1xuXG4gICAgbWFwcy5mb3JFYWNoKG1hc3Rlck1hcENvbmZpZyA9PiB7XG4gICAgICBjb25zdCBtYXN0ZXJNYXAgPSBtYXN0ZXJNYXBDb25maWcubWFwO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IG1hc3Rlck1hcENvbmZpZy5vcHRpb25zO1xuICAgICAgY29uc3QgbWFzdGVyQ2FtZXJhID0gbWFzdGVyTWFwLmdldENhbWVyYVNlcnZpY2UoKS5nZXRDYW1lcmEoKTtcbiAgICAgIGNvbnN0IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYyA9IG1hc3RlckNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICAgIG1hc3RlckNhbWVyYS5wZXJjZW50YWdlQ2hhbmdlZCA9IG9wdGlvbnMuc2Vuc2l0aXZpdHkgfHwgREVGQVVMVF9TRU5TSVRJVklUWTtcbiAgICAgIGNvbnN0IHJlbW92ZUNhbGxiYWNrID0gbWFzdGVyQ2FtZXJhLmNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgIG1hcHMuZm9yRWFjaChzbGF2ZU1hcENvbmZpZyA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXAgPSBzbGF2ZU1hcENvbmZpZy5tYXA7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXBPcHRpb25zID0gc2xhdmVNYXBDb25maWcub3B0aW9ucztcbiAgICAgICAgICBpZiAoc2xhdmVNYXAgPT09IG1hc3Rlck1hcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhID0gc2xhdmVNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhQ2FydG9ncmFwaGljID0gc2xhdmVDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBDZXNpdW0uRWxsaXBzb2lkLldHUzg0LmNhcnRvZ3JhcGhpY1RvQ2FydGVzaWFuKHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMubGF0aXR1ZGUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNsYXZlTWFwT3B0aW9ucy5iaW5kWm9vbSA/IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQgOiBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoc2xhdmVNYXAuZ2V0Q2VzaXVtVmlld2VyKCkuc2NlbmUubW9kZSAhPT0gQ2VzaXVtLlNjZW5lTW9kZS5NT1JQSElORykge1xuICAgICAgICAgICAgc2xhdmVDYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiBzbGF2ZUNhbWVyYS5oZWFkaW5nLFxuICAgICAgICAgICAgICAgIHBpdGNoOiBzbGF2ZUNhbWVyYS5waXRjaCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MucHVzaChyZW1vdmVDYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5zeW5jcyBtYXBzIGNhbWVyYXNcbiAgICovXG4gIHVuc3luY01hcHNDYW1lcmFzKCkge1xuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MuZm9yRWFjaChyZW1vdmVDYWxsYmFjayA9PiByZW1vdmVDYWxsYmFjaygpKTtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzID0gW107XG4gIH1cbn1cbiJdfQ==