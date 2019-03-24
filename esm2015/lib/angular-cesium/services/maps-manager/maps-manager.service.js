/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?=} id
     * @return {?}
     */
    getMap(id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    }
    /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    _registerMap(id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        /** @type {?} */
        const mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error(`Map with id: ${mapId} already exist`);
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _removeMapById(id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            /** @type {?} */
            const iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    }
    /**
     * @private
     * @return {?}
     */
    generateDefaultId() {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    }
    /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    sync2DMapsCameras(mapsConfiguration) {
        /** @type {?} */
        const DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        /** @type {?} */
        const maps = mapsConfiguration.map((/**
         * @param {?} config
         * @return {?}
         */
        config => {
            /** @type {?} */
            const map = this.getMap(config.id);
            if (!map) {
                throw new Error(`Couldn't find map with id: ${config.id}`);
            }
            return { map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        }));
        maps.forEach((/**
         * @param {?} masterMapConfig
         * @return {?}
         */
        masterMapConfig => {
            /** @type {?} */
            const masterMap = masterMapConfig.map;
            /** @type {?} */
            const options = masterMapConfig.options;
            /** @type {?} */
            const masterCamera = masterMap.getCameraService().getCamera();
            /** @type {?} */
            const masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            /** @type {?} */
            const removeCallback = masterCamera.changed.addEventListener((/**
             * @return {?}
             */
            () => {
                maps.forEach((/**
                 * @param {?} slaveMapConfig
                 * @return {?}
                 */
                slaveMapConfig => {
                    /** @type {?} */
                    const slaveMap = slaveMapConfig.map;
                    /** @type {?} */
                    const slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    /** @type {?} */
                    const slaveCamera = slaveMap.getCameraService().getCamera();
                    /** @type {?} */
                    const slaveCameraCartographic = slaveCamera.positionCartographic;
                    /** @type {?} */
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
                }));
            }));
            this.eventRemoveCallbacks.push(removeCallback);
        }));
    }
    /**
     * Unsyncs maps cameras
     * @return {?}
     */
    unsyncMapsCameras() {
        this.eventRemoveCallbacks.forEach((/**
         * @param {?} removeCallback
         * @return {?}
         */
        removeCallback => removeCallback()));
        this.eventRemoveCallbacks = [];
    }
}
MapsManagerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapsManagerService.ctorParameters = () => [];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapsManagerService.prototype.defaultIdCounter;
    /**
     * @type {?}
     * @private
     */
    MapsManagerService.prototype._Maps;
    /**
     * @type {?}
     * @private
     */
    MapsManagerService.prototype.firstMap;
    /**
     * @type {?}
     * @private
     */
    MapsManagerService.prototype.eventRemoveCallbacks;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBUTNDLE1BQU0sT0FBTyxrQkFBa0I7SUFNN0I7UUFMUSxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBRTFDLHlCQUFvQixHQUFlLEVBQUUsQ0FBQztJQUc5QyxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxFQUFXO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDdEI7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7OztJQUVELFlBQVksQ0FBQyxFQUFVLEVBQUUsS0FBcUI7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7U0FDdkI7O2NBRUssS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDaEQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLGdCQUFnQixDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxFQUFVO1FBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTs7a0JBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNoQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7WUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ25DO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVPLGlCQUFpQjtRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixPQUFPLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNuRCxDQUFDOzs7Ozs7Ozs7SUFTRCxpQkFBaUIsQ0FBQyxpQkFBNkU7O2NBQ3ZGLG1CQUFtQixHQUFHLElBQUk7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7O2NBQ25CLElBQUksR0FBc0YsaUJBQWlCLENBQUMsR0FBRzs7OztRQUFDLE1BQU0sQ0FBQyxFQUFFOztrQkFDdkgsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzVEO1lBRUQsT0FBTyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBQyxFQUFDLENBQUM7UUFDdEYsQ0FBQyxFQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU87Ozs7UUFBQyxlQUFlLENBQUMsRUFBRTs7a0JBQ3ZCLFNBQVMsR0FBRyxlQUFlLENBQUMsR0FBRzs7a0JBQy9CLE9BQU8sR0FBRyxlQUFlLENBQUMsT0FBTzs7a0JBQ2pDLFlBQVksR0FBRyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFTLEVBQUU7O2tCQUN2RCx3QkFBd0IsR0FBRyxZQUFZLENBQUMsb0JBQW9CO1lBQ2xFLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLG1CQUFtQixDQUFDOztrQkFDdEUsY0FBYyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxPQUFPOzs7O2dCQUFDLGNBQWMsQ0FBQyxFQUFFOzswQkFDdEIsUUFBUSxHQUFHLGNBQWMsQ0FBQyxHQUFHOzswQkFDN0IsZUFBZSxHQUFHLGNBQWMsQ0FBQyxPQUFPO29CQUM5QyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7d0JBQzFCLE9BQU87cUJBQ1I7OzBCQUVLLFdBQVcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFTLEVBQUU7OzBCQUNyRCx1QkFBdUIsR0FBRyxXQUFXLENBQUMsb0JBQW9COzswQkFDMUQsUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDO3dCQUM5RCxTQUFTLEVBQUUsd0JBQXdCLENBQUMsU0FBUzt3QkFDN0MsUUFBUSxFQUFFLHdCQUF3QixDQUFDLFFBQVE7d0JBQzNDLE1BQU0sRUFBRSxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLE1BQU07cUJBQ3BHLENBQUM7b0JBRUYsSUFBSSxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTt3QkFDdkUsV0FBVyxDQUFDLE9BQU8sQ0FBQzs0QkFDbEIsV0FBVyxFQUFFLFFBQVE7NEJBQ3JCLFdBQVcsRUFBRTtnQ0FDWCxPQUFPLEVBQUUsV0FBVyxDQUFDLE9BQU87Z0NBQzVCLEtBQUssRUFBRSxXQUFXLENBQUMsS0FBSzs2QkFDekI7eUJBQ0YsQ0FBQyxDQUFDO3FCQUNKO2dCQUNILENBQUMsRUFBQyxDQUFDO1lBQ0wsQ0FBQyxFQUFDO1lBQ0YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBS0QsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU87Ozs7UUFBQyxjQUFjLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztJQUNqQyxDQUFDOzs7WUExR0YsVUFBVTs7Ozs7Ozs7O0lBRVQsOENBQTZCOzs7OztJQUM3QixtQ0FBa0Q7Ozs7O0lBQ2xELHNDQUFzQjs7Ozs7SUFDdEIsa0RBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuLyoqXG4gKiAgVGhlIHNlcnZpY2UgbWFuYWdlcyBgYWMtbWFwYCBpbnN0YW5jZXMuIGBhYy1tYXBgIHJlZ2lzdGVyIGl0c2VsZiB0byB0aGlzIHNlcnZpY2UuXG4gKiAgVGhpcyBhbGxvd3MgcmV0cmlldmFsIG9mIG1hcHMgcHJvdmlkZWQgc2VydmljZXMgb3V0c2lkZSBvZiBgYWMtbWFwYCBzY29wZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcHNNYW5hZ2VyU2VydmljZSB7XG4gIHByaXZhdGUgZGVmYXVsdElkQ291bnRlciA9IDA7XG4gIHByaXZhdGUgX01hcHMgPSBuZXcgTWFwPHN0cmluZywgQWNNYXBDb21wb25lbnQ+KCk7XG4gIHByaXZhdGUgZmlyc3RNYXA6IGFueTtcbiAgcHJpdmF0ZSBldmVudFJlbW92ZUNhbGxiYWNrczogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgZ2V0TWFwKGlkPzogc3RyaW5nKTogQWNNYXBDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICAgIGlmICghaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpcnN0TWFwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fTWFwcy5nZXQoaWQpO1xuICB9XG5cbiAgX3JlZ2lzdGVyTWFwKGlkOiBzdHJpbmcsIGFjTWFwOiBBY01hcENvbXBvbmVudCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmZpcnN0TWFwKSB7XG4gICAgICB0aGlzLmZpcnN0TWFwID0gYWNNYXA7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwSWQgPSBpZCA/IGlkIDogdGhpcy5nZW5lcmF0ZURlZmF1bHRJZCgpO1xuICAgIGlmICh0aGlzLl9NYXBzLmhhcyhtYXBJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwIHdpdGggaWQ6ICR7bWFwSWR9IGFscmVhZHkgZXhpc3RgKTtcbiAgICB9XG4gICAgdGhpcy5fTWFwcy5zZXQobWFwSWQsIGFjTWFwKTtcbiAgICByZXR1cm4gbWFwSWQ7XG4gIH1cblxuICBfcmVtb3ZlTWFwQnlJZChpZDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX01hcHMuaGFzKGlkKSAmJiB0aGlzLl9NYXBzLmdldChpZCkgPT09IHRoaXMuZmlyc3RNYXApIHtcbiAgICAgIGNvbnN0IGl0ZXIgPSB0aGlzLl9NYXBzLnZhbHVlcygpO1xuICAgICAgaXRlci5uZXh0KCk7IC8vIHNraXAgZmlyc3RNYXBcbiAgICAgIHRoaXMuZmlyc3RNYXAgPSBpdGVyLm5leHQoKS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX01hcHMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVEZWZhdWx0SWQoKTogc3RyaW5nIHtcbiAgICB0aGlzLmRlZmF1bHRJZENvdW50ZXIrKztcbiAgICByZXR1cm4gJ2RlZmF1bHQtbWFwLWlkLScgKyB0aGlzLmRlZmF1bHRJZENvdW50ZXI7XG4gIH1cblxuICAvKipcbiAgICogQmluZHMgbXVsdGlwbGUgMkQgbWFwJ3MgY2FtZXJhcyB0b2dldGhlci5cbiAgICogQHBhcmFtIG1hcHNDb25maWd1cmF0aW9uIC0gYmluZGluZyBvcHRpb25zLlxuICAgKiBtYXBJZCAtIHRoZSBpZCBvZiB0aGUgbWFwcyB0byBiaW5kLlxuICAgKiBzZW5zaXRpdml0eSAtIHRoZSBhbW91bnQgdGhlIGNhbWVyYSBwb3NpdGlvbiBzaG91bGQgY2hhbmdlIGluIG9yZGVyIHRvIHN5bmMgb3RoZXIgbWFwcy5cbiAgICogYmluZFpvb20gLSBzaG91bGQgYmluZCB6b29tIGxldmVsXG4gICAqL1xuICBzeW5jMkRNYXBzQ2FtZXJhcyhtYXBzQ29uZmlndXJhdGlvbjogeyBpZDogc3RyaW5nOyBzZW5zaXRpdml0eT86IG51bWJlcjsgYmluZFpvb20/OiBib29sZWFuIH1bXSkge1xuICAgIGNvbnN0IERFRkFVTFRfU0VOU0lUSVZJVFkgPSAwLjAxO1xuICAgIHRoaXMudW5zeW5jTWFwc0NhbWVyYXMoKTtcbiAgICBjb25zdCBtYXBzOiB7IG1hcDogQWNNYXBDb21wb25lbnQ7IG9wdGlvbnM/OiB7IHNlbnNpdGl2aXR5PzogbnVtYmVyOyBiaW5kWm9vbT86IGJvb2xlYW4gfSB9W10gPSBtYXBzQ29uZmlndXJhdGlvbi5tYXAoY29uZmlnID0+IHtcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMuZ2V0TWFwKGNvbmZpZy5pZCk7XG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkbid0IGZpbmQgbWFwIHdpdGggaWQ6ICR7Y29uZmlnLmlkfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge21hcCwgb3B0aW9uczoge3NlbnNpdGl2aXR5OiBjb25maWcuc2Vuc2l0aXZpdHksIGJpbmRab29tOiBjb25maWcuYmluZFpvb219fTtcbiAgICB9KTtcblxuICAgIG1hcHMuZm9yRWFjaChtYXN0ZXJNYXBDb25maWcgPT4ge1xuICAgICAgY29uc3QgbWFzdGVyTWFwID0gbWFzdGVyTWFwQ29uZmlnLm1hcDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBtYXN0ZXJNYXBDb25maWcub3B0aW9ucztcbiAgICAgIGNvbnN0IG1hc3RlckNhbWVyYSA9IG1hc3Rlck1hcC5nZXRDYW1lcmFTZXJ2aWNlKCkuZ2V0Q2FtZXJhKCk7XG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMgPSBtYXN0ZXJDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgICBtYXN0ZXJDYW1lcmEucGVyY2VudGFnZUNoYW5nZWQgPSBvcHRpb25zLnNlbnNpdGl2aXR5IHx8IERFRkFVTFRfU0VOU0lUSVZJVFk7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFjayA9IG1hc3RlckNhbWVyYS5jaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICBtYXBzLmZvckVhY2goc2xhdmVNYXBDb25maWcgPT4ge1xuICAgICAgICAgIGNvbnN0IHNsYXZlTWFwID0gc2xhdmVNYXBDb25maWcubWFwO1xuICAgICAgICAgIGNvbnN0IHNsYXZlTWFwT3B0aW9ucyA9IHNsYXZlTWFwQ29uZmlnLm9wdGlvbnM7XG4gICAgICAgICAgaWYgKHNsYXZlTWFwID09PSBtYXN0ZXJNYXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBzbGF2ZUNhbWVyYSA9IHNsYXZlTWFwLmdldENhbWVyYVNlcnZpY2UoKS5nZXRDYW1lcmEoKTtcbiAgICAgICAgICBjb25zdCBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYyA9IHNsYXZlQ2FtZXJhLnBvc2l0aW9uQ2FydG9ncmFwaGljO1xuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gQ2VzaXVtLkVsbGlwc29pZC5XR1M4NC5jYXJ0b2dyYXBoaWNUb0NhcnRlc2lhbih7XG4gICAgICAgICAgICBsb25naXR1ZGU6IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsXG4gICAgICAgICAgICBsYXRpdHVkZTogbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxhdGl0dWRlLFxuICAgICAgICAgICAgaGVpZ2h0OiBzbGF2ZU1hcE9wdGlvbnMuYmluZFpvb20gPyBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMuaGVpZ2h0IDogc2xhdmVDYW1lcmFDYXJ0b2dyYXBoaWMuaGVpZ2h0LFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKHNsYXZlTWFwLmdldENlc2l1bVZpZXdlcigpLnNjZW5lLm1vZGUgIT09IENlc2l1bS5TY2VuZU1vZGUuTU9SUEhJTkcpIHtcbiAgICAgICAgICAgIHNsYXZlQ2FtZXJhLnNldFZpZXcoe1xuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgaGVhZGluZzogc2xhdmVDYW1lcmEuaGVhZGluZyxcbiAgICAgICAgICAgICAgICBwaXRjaDogc2xhdmVDYW1lcmEucGl0Y2gsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzLnB1c2gocmVtb3ZlQ2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3luY3MgbWFwcyBjYW1lcmFzXG4gICAqL1xuICB1bnN5bmNNYXBzQ2FtZXJhcygpIHtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzLmZvckVhY2gocmVtb3ZlQ2FsbGJhY2sgPT4gcmVtb3ZlQ2FsbGJhY2soKSk7XG4gICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcyA9IFtdO1xuICB9XG59XG4iXX0=