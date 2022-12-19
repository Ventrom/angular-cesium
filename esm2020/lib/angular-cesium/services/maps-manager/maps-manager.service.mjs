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
}
MapsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MapsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sa0JBQWtCO0lBTTdCO1FBTFEscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBMEIsQ0FBQztRQUUxQyx5QkFBb0IsR0FBZSxFQUFFLENBQUM7SUFHOUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFXO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDdEI7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxZQUFZLENBQUMsRUFBVSxFQUFFLEtBQXFCO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO1FBRUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ2pELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxF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QXdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNO3FCQUNwRyxDQUFDLENBQUM7b0JBRUgsSUFBSSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTt3QkFDdkUsV0FBVyxDQUFDLE9BQU8sQ0FBQzs0QkFDbEIsV0FBVyxFQUFFLFFBQVE7NEJBQ3JCLFdBQVcsRUFBRTtnQ0FDWCxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU87Z0NBQzVCLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSzs2QkFDekI7eUJBQ0YsQ0FBQyxDQUFDO3FCQUNKO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztJQUNqQyxDQUFDOztnSEF6R1Usa0JBQWtCO29IQUFsQixrQkFBa0I7NEZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbi8qKlxuICogIFRoZSBzZXJ2aWNlIG1hbmFnZXMgYGFjLW1hcGAgaW5zdGFuY2VzLiBgYWMtbWFwYCByZWdpc3RlciBpdHNlbGYgdG8gdGhpcyBzZXJ2aWNlLlxuICogIFRoaXMgYWxsb3dzIHJldHJpZXZhbCBvZiBtYXBzIHByb3ZpZGVkIHNlcnZpY2VzIG91dHNpZGUgb2YgYGFjLW1hcGAgc2NvcGUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXBzTWFuYWdlclNlcnZpY2Uge1xuICBwcml2YXRlIGRlZmF1bHRJZENvdW50ZXIgPSAwO1xuICBwcml2YXRlIF9NYXBzID0gbmV3IE1hcDxzdHJpbmcsIEFjTWFwQ29tcG9uZW50PigpO1xuICBwcml2YXRlIGZpcnN0TWFwOiBhbnk7XG4gIHByaXZhdGUgZXZlbnRSZW1vdmVDYWxsYmFja3M6IEZ1bmN0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGdldE1hcChpZD86IHN0cmluZyk6IEFjTWFwQ29tcG9uZW50IHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXJzdE1hcDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX01hcHMuZ2V0KGlkKTtcbiAgfVxuXG4gIF9yZWdpc3Rlck1hcChpZDogc3RyaW5nLCBhY01hcDogQWNNYXBDb21wb25lbnQpOiBzdHJpbmcge1xuICAgIGlmICghdGhpcy5maXJzdE1hcCkge1xuICAgICAgdGhpcy5maXJzdE1hcCA9IGFjTWFwO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcElkID0gaWQgPyBpZCA6IHRoaXMuZ2VuZXJhdGVEZWZhdWx0SWQoKTtcbiAgICBpZiAodGhpcy5fTWFwcy5oYXMobWFwSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCB3aXRoIGlkOiAke21hcElkfSBhbHJlYWR5IGV4aXN0YCk7XG4gICAgfVxuICAgIHRoaXMuX01hcHMuc2V0KG1hcElkLCBhY01hcCk7XG4gICAgcmV0dXJuIG1hcElkO1xuICB9XG5cbiAgX3JlbW92ZU1hcEJ5SWQoaWQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9NYXBzLmhhcyhpZCkgJiYgdGhpcy5fTWFwcy5nZXQoaWQpID09PSB0aGlzLmZpcnN0TWFwKSB7XG4gICAgICBjb25zdCBpdGVyID0gdGhpcy5fTWFwcy52YWx1ZXMoKTtcbiAgICAgIGl0ZXIubmV4dCgpOyAvLyBza2lwIGZpcnN0TWFwXG4gICAgICB0aGlzLmZpcnN0TWFwID0gaXRlci5uZXh0KCkudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9NYXBzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlRGVmYXVsdElkKCk6IHN0cmluZyB7XG4gICAgdGhpcy5kZWZhdWx0SWRDb3VudGVyKys7XG4gICAgcmV0dXJuICdkZWZhdWx0LW1hcC1pZC0nICsgdGhpcy5kZWZhdWx0SWRDb3VudGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpbmRzIG11bHRpcGxlIDJEIG1hcCdzIGNhbWVyYXMgdG9nZXRoZXIuXG4gICAqIEBwYXJhbSBtYXBzQ29uZmlndXJhdGlvbiAtIGJpbmRpbmcgb3B0aW9ucy5cbiAgICogbWFwSWQgLSB0aGUgaWQgb2YgdGhlIG1hcHMgdG8gYmluZC5cbiAgICogc2Vuc2l0aXZpdHkgLSB0aGUgYW1vdW50IHRoZSBjYW1lcmEgcG9zaXRpb24gc2hvdWxkIGNoYW5nZSBpbiBvcmRlciB0byBzeW5jIG90aGVyIG1hcHMuXG4gICAqIGJpbmRab29tIC0gc2hvdWxkIGJpbmQgem9vbSBsZXZlbFxuICAgKi9cbiAgc3luYzJETWFwc0NhbWVyYXMobWFwc0NvbmZpZ3VyYXRpb246IHsgaWQ6IHN0cmluZzsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9W10pIHtcbiAgICBjb25zdCBERUZBVUxUX1NFTlNJVElWSVRZID0gMC4wMTtcbiAgICB0aGlzLnVuc3luY01hcHNDYW1lcmFzKCk7XG4gICAgY29uc3QgbWFwczogeyBtYXA6IEFjTWFwQ29tcG9uZW50OyBvcHRpb25zPzogeyBzZW5zaXRpdml0eT86IG51bWJlcjsgYmluZFpvb20/OiBib29sZWFuIH0gfVtdID0gbWFwc0NvbmZpZ3VyYXRpb24ubWFwKGNvbmZpZyA9PiB7XG4gICAgICBjb25zdCBtYXAgPSB0aGlzLmdldE1hcChjb25maWcuaWQpO1xuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIG1hcCB3aXRoIGlkOiAke2NvbmZpZy5pZH1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHttYXAsIG9wdGlvbnM6IHtzZW5zaXRpdml0eTogY29uZmlnLnNlbnNpdGl2aXR5LCBiaW5kWm9vbTogY29uZmlnLmJpbmRab29tfX07XG4gICAgfSk7XG5cbiAgICBtYXBzLmZvckVhY2gobWFzdGVyTWFwQ29uZmlnID0+IHtcbiAgICAgIGNvbnN0IG1hc3Rlck1hcCA9IG1hc3Rlck1hcENvbmZpZy5tYXA7XG4gICAgICBjb25zdCBvcHRpb25zID0gbWFzdGVyTWFwQ29uZmlnLm9wdGlvbnM7XG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmEgPSBtYXN0ZXJNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xuICAgICAgY29uc3QgbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljID0gbWFzdGVyQ2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgICAgbWFzdGVyQ2FtZXJhLnBlcmNlbnRhZ2VDaGFuZ2VkID0gb3B0aW9ucy5zZW5zaXRpdml0eSB8fCBERUZBVUxUX1NFTlNJVElWSVRZO1xuICAgICAgY29uc3QgcmVtb3ZlQ2FsbGJhY2sgPSBtYXN0ZXJDYW1lcmEuY2hhbmdlZC5hZGRFdmVudExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgbWFwcy5mb3JFYWNoKHNsYXZlTWFwQ29uZmlnID0+IHtcbiAgICAgICAgICBjb25zdCBzbGF2ZU1hcCA9IHNsYXZlTWFwQ29uZmlnLm1hcDtcbiAgICAgICAgICBjb25zdCBzbGF2ZU1hcE9wdGlvbnMgPSBzbGF2ZU1hcENvbmZpZy5vcHRpb25zO1xuICAgICAgICAgIGlmIChzbGF2ZU1hcCA9PT0gbWFzdGVyTWFwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgc2xhdmVDYW1lcmEgPSBzbGF2ZU1hcC5nZXRDYW1lcmFTZXJ2aWNlKCkuZ2V0Q2FtZXJhKCk7XG4gICAgICAgICAgY29uc3Qgc2xhdmVDYW1lcmFDYXJ0b2dyYXBoaWMgPSBzbGF2ZUNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IENlc2l1bS5FbGxpcHNvaWQuV0dTODQuY2FydG9ncmFwaGljVG9DYXJ0ZXNpYW4oe1xuICAgICAgICAgICAgbG9uZ2l0dWRlOiBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMubG9uZ2l0dWRlLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGhlaWdodDogc2xhdmVNYXBPcHRpb25zLmJpbmRab29tID8gbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmhlaWdodCA6IHNsYXZlQ2FtZXJhQ2FydG9ncmFwaGljLmhlaWdodCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChzbGF2ZU1hcC5nZXRDZXNpdW1WaWV3ZXIoKS5zY2VuZS5tb2RlICE9PSBDZXNpdW0uU2NlbmVNb2RlLk1PUlBISU5HKSB7XG4gICAgICAgICAgICBzbGF2ZUNhbWVyYS5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgZGVzdGluYXRpb246IHBvc2l0aW9uLFxuICAgICAgICAgICAgICBvcmllbnRhdGlvbjoge1xuICAgICAgICAgICAgICAgIGhlYWRpbmc6IHNsYXZlQ2FtZXJhLmhlYWRpbmcsXG4gICAgICAgICAgICAgICAgcGl0Y2g6IHNsYXZlQ2FtZXJhLnBpdGNoLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcy5wdXNoKHJlbW92ZUNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN5bmNzIG1hcHMgY2FtZXJhc1xuICAgKi9cbiAgdW5zeW5jTWFwc0NhbWVyYXMoKSB7XG4gICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcy5mb3JFYWNoKHJlbW92ZUNhbGxiYWNrID0+IHJlbW92ZUNhbGxiYWNrKCkpO1xuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MgPSBbXTtcbiAgfVxufVxuIl19