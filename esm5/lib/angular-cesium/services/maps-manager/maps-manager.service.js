/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?=} id
     * @return {?}
     */
    MapsManagerService.prototype.getMap = /**
     * @param {?=} id
     * @return {?}
     */
    function (id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    };
    /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    MapsManagerService.prototype._registerMap = /**
     * @param {?} id
     * @param {?} acMap
     * @return {?}
     */
    function (id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        /** @type {?} */
        var mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error("Map with id: " + mapId + " already exist");
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    MapsManagerService.prototype._removeMapById = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        if (this._Maps.has(id) && this._Maps.get(id) === this.firstMap) {
            /** @type {?} */
            var iter = this._Maps.values();
            iter.next(); // skip firstMap
            this.firstMap = iter.next().value;
        }
        return this._Maps.delete(id);
    };
    /**
     * @private
     * @return {?}
     */
    MapsManagerService.prototype.generateDefaultId = /**
     * @private
     * @return {?}
     */
    function () {
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
    /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    MapsManagerService.prototype.sync2DMapsCameras = /**
     * Binds multiple 2D map's cameras together.
     * @param {?} mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     * @return {?}
     */
    function (mapsConfiguration) {
        var _this = this;
        /** @type {?} */
        var DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        /** @type {?} */
        var maps = mapsConfiguration.map((/**
         * @param {?} config
         * @return {?}
         */
        function (config) {
            /** @type {?} */
            var map = _this.getMap(config.id);
            if (!map) {
                throw new Error("Couldn't find map with id: " + config.id);
            }
            return { map: map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        }));
        maps.forEach((/**
         * @param {?} masterMapConfig
         * @return {?}
         */
        function (masterMapConfig) {
            /** @type {?} */
            var masterMap = masterMapConfig.map;
            /** @type {?} */
            var options = masterMapConfig.options;
            /** @type {?} */
            var masterCamera = masterMap.getCameraService().getCamera();
            /** @type {?} */
            var masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            /** @type {?} */
            var removeCallback = masterCamera.changed.addEventListener((/**
             * @return {?}
             */
            function () {
                maps.forEach((/**
                 * @param {?} slaveMapConfig
                 * @return {?}
                 */
                function (slaveMapConfig) {
                    /** @type {?} */
                    var slaveMap = slaveMapConfig.map;
                    /** @type {?} */
                    var slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    /** @type {?} */
                    var slaveCamera = slaveMap.getCameraService().getCamera();
                    /** @type {?} */
                    var slaveCameraCartographic = slaveCamera.positionCartographic;
                    /** @type {?} */
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
                }));
            }));
            _this.eventRemoveCallbacks.push(removeCallback);
        }));
    };
    /**
     * Unsyncs maps cameras
     */
    /**
     * Unsyncs maps cameras
     * @return {?}
     */
    MapsManagerService.prototype.unsyncMapsCameras = /**
     * Unsyncs maps cameras
     * @return {?}
     */
    function () {
        this.eventRemoveCallbacks.forEach((/**
         * @param {?} removeCallback
         * @return {?}
         */
        function (removeCallback) { return removeCallback(); }));
        this.eventRemoveCallbacks = [];
    };
    MapsManagerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapsManagerService.ctorParameters = function () { return []; };
    return MapsManagerService;
}());
export { MapsManagerService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBTzNDO0lBT0U7UUFMUSxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBRTFDLHlCQUFvQixHQUFlLEVBQUUsQ0FBQztJQUc5QyxDQUFDOzs7OztJQUVELG1DQUFNOzs7O0lBQU4sVUFBTyxFQUFXO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDdEI7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7OztJQUVELHlDQUFZOzs7OztJQUFaLFVBQWEsRUFBVSxFQUFFLEtBQXFCO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCOztZQUVLLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBZ0IsS0FBSyxtQkFBZ0IsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7SUFFRCwyQ0FBYzs7OztJQUFkLFVBQWUsRUFBVTtRQUN2QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7O2dCQUN4RCxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZ0JBQWdCO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztTQUNuQztRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFTyw4Q0FBaUI7Ozs7SUFBekI7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixPQUFPLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7Ozs7OztPQU1HOzs7Ozs7Ozs7SUFDSCw4Q0FBaUI7Ozs7Ozs7O0lBQWpCLFVBQWtCLGlCQUE2RTtRQUEvRixpQkErQ0M7O1lBOUNPLG1CQUFtQixHQUFHLElBQUk7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7O1lBQ25CLElBQUksR0FBc0YsaUJBQWlCLENBQUMsR0FBRzs7OztRQUFDLFVBQUEsTUFBTTs7Z0JBQ3BILEdBQUcsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDUixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUE4QixNQUFNLENBQUMsRUFBSSxDQUFDLENBQUM7YUFDNUQ7WUFFRCxPQUFPLEVBQUMsR0FBRyxLQUFBLEVBQUUsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUMsRUFBQyxDQUFDO1FBQ3RGLENBQUMsRUFBQztRQUVGLElBQUksQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxlQUFlOztnQkFDcEIsU0FBUyxHQUFHLGVBQWUsQ0FBQyxHQUFHOztnQkFDL0IsT0FBTyxHQUFHLGVBQWUsQ0FBQyxPQUFPOztnQkFDakMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFNBQVMsRUFBRTs7Z0JBQ3ZELHdCQUF3QixHQUFHLFlBQVksQ0FBQyxvQkFBb0I7WUFDbEUsWUFBWSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUksbUJBQW1CLENBQUM7O2dCQUN0RSxjQUFjLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0I7OztZQUFDO2dCQUMzRCxJQUFJLENBQUMsT0FBTzs7OztnQkFBQyxVQUFBLGNBQWM7O3dCQUNuQixRQUFRLEdBQUcsY0FBYyxDQUFDLEdBQUc7O3dCQUM3QixlQUFlLEdBQUcsY0FBYyxDQUFDLE9BQU87b0JBQzlDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTt3QkFDMUIsT0FBTztxQkFDUjs7d0JBRUssV0FBVyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFNBQVMsRUFBRTs7d0JBQ3JELHVCQUF1QixHQUFHLFdBQVcsQ0FBQyxvQkFBb0I7O3dCQUMxRCxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUM7d0JBQzlELFNBQVMsRUFBRSx3QkFBd0IsQ0FBQyxTQUFTO3dCQUM3QyxRQUFRLEVBQUUsd0JBQXdCLENBQUMsUUFBUTt3QkFDM0MsTUFBTSxFQUFFLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsTUFBTTtxQkFDcEcsQ0FBQztvQkFFRixJQUFJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO3dCQUN2RSxXQUFXLENBQUMsT0FBTyxDQUFDOzRCQUNsQixXQUFXLEVBQUUsUUFBUTs0QkFDckIsV0FBVyxFQUFFO2dDQUNYLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztnQ0FDNUIsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLOzZCQUN6Qjt5QkFDRixDQUFDLENBQUM7cUJBQ0o7Z0JBQ0gsQ0FBQyxFQUFDLENBQUM7WUFDTCxDQUFDLEVBQUM7WUFDRixLQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNILDhDQUFpQjs7OztJQUFqQjtRQUNFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxjQUFjLElBQUksT0FBQSxjQUFjLEVBQUUsRUFBaEIsQ0FBZ0IsRUFBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQzs7Z0JBMUdGLFVBQVU7Ozs7SUEyR1gseUJBQUM7Q0FBQSxBQTNHRCxJQTJHQztTQTFHWSxrQkFBa0I7Ozs7OztJQUM3Qiw4Q0FBNkI7Ozs7O0lBQzdCLG1DQUFrRDs7Ozs7SUFDbEQsc0NBQXNCOzs7OztJQUN0QixrREFBOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBtYW5hZ2VzIGBhYy1tYXBgIGluc3RhbmNlcy4gYGFjLW1hcGAgcmVnaXN0ZXIgaXRzZWxmIHRvIHRoaXMgc2VydmljZS5cbiAqICBUaGlzIGFsbG93cyByZXRyaWV2YWwgb2YgbWFwcyBwcm92aWRlZCBzZXJ2aWNlcyBvdXRzaWRlIG9mIGBhYy1tYXBgIHNjb3BlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwc01hbmFnZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWZhdWx0SWRDb3VudGVyID0gMDtcbiAgcHJpdmF0ZSBfTWFwcyA9IG5ldyBNYXA8c3RyaW5nLCBBY01hcENvbXBvbmVudD4oKTtcbiAgcHJpdmF0ZSBmaXJzdE1hcDogYW55O1xuICBwcml2YXRlIGV2ZW50UmVtb3ZlQ2FsbGJhY2tzOiBGdW5jdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBnZXRNYXAoaWQ/OiBzdHJpbmcpOiBBY01hcENvbXBvbmVudCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RNYXA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9NYXBzLmdldChpZCk7XG4gIH1cblxuICBfcmVnaXN0ZXJNYXAoaWQ6IHN0cmluZywgYWNNYXA6IEFjTWFwQ29tcG9uZW50KTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuZmlyc3RNYXApIHtcbiAgICAgIHRoaXMuZmlyc3RNYXAgPSBhY01hcDtcbiAgICB9XG5cbiAgICBjb25zdCBtYXBJZCA9IGlkID8gaWQgOiB0aGlzLmdlbmVyYXRlRGVmYXVsdElkKCk7XG4gICAgaWYgKHRoaXMuX01hcHMuaGFzKG1hcElkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgd2l0aCBpZDogJHttYXBJZH0gYWxyZWFkeSBleGlzdGApO1xuICAgIH1cbiAgICB0aGlzLl9NYXBzLnNldChtYXBJZCwgYWNNYXApO1xuICAgIHJldHVybiBtYXBJZDtcbiAgfVxuXG4gIF9yZW1vdmVNYXBCeUlkKGlkOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5fTWFwcy5oYXMoaWQpICYmIHRoaXMuX01hcHMuZ2V0KGlkKSA9PT0gdGhpcy5maXJzdE1hcCkge1xuICAgICAgY29uc3QgaXRlciA9IHRoaXMuX01hcHMudmFsdWVzKCk7XG4gICAgICBpdGVyLm5leHQoKTsgLy8gc2tpcCBmaXJzdE1hcFxuICAgICAgdGhpcy5maXJzdE1hcCA9IGl0ZXIubmV4dCgpLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fTWFwcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZURlZmF1bHRJZCgpOiBzdHJpbmcge1xuICAgIHRoaXMuZGVmYXVsdElkQ291bnRlcisrO1xuICAgIHJldHVybiAnZGVmYXVsdC1tYXAtaWQtJyArIHRoaXMuZGVmYXVsdElkQ291bnRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kcyBtdWx0aXBsZSAyRCBtYXAncyBjYW1lcmFzIHRvZ2V0aGVyLlxuICAgKiBAcGFyYW0gbWFwc0NvbmZpZ3VyYXRpb24gLSBiaW5kaW5nIG9wdGlvbnMuXG4gICAqIG1hcElkIC0gdGhlIGlkIG9mIHRoZSBtYXBzIHRvIGJpbmQuXG4gICAqIHNlbnNpdGl2aXR5IC0gdGhlIGFtb3VudCB0aGUgY2FtZXJhIHBvc2l0aW9uIHNob3VsZCBjaGFuZ2UgaW4gb3JkZXIgdG8gc3luYyBvdGhlciBtYXBzLlxuICAgKiBiaW5kWm9vbSAtIHNob3VsZCBiaW5kIHpvb20gbGV2ZWxcbiAgICovXG4gIHN5bmMyRE1hcHNDYW1lcmFzKG1hcHNDb25maWd1cmF0aW9uOiB7IGlkOiBzdHJpbmc7IHNlbnNpdGl2aXR5PzogbnVtYmVyOyBiaW5kWm9vbT86IGJvb2xlYW4gfVtdKSB7XG4gICAgY29uc3QgREVGQVVMVF9TRU5TSVRJVklUWSA9IDAuMDE7XG4gICAgdGhpcy51bnN5bmNNYXBzQ2FtZXJhcygpO1xuICAgIGNvbnN0IG1hcHM6IHsgbWFwOiBBY01hcENvbXBvbmVudDsgb3B0aW9ucz86IHsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9IH1bXSA9IG1hcHNDb25maWd1cmF0aW9uLm1hcChjb25maWcgPT4ge1xuICAgICAgY29uc3QgbWFwID0gdGhpcy5nZXRNYXAoY29uZmlnLmlkKTtcbiAgICAgIGlmICghbWFwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGRuJ3QgZmluZCBtYXAgd2l0aCBpZDogJHtjb25maWcuaWR9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7bWFwLCBvcHRpb25zOiB7c2Vuc2l0aXZpdHk6IGNvbmZpZy5zZW5zaXRpdml0eSwgYmluZFpvb206IGNvbmZpZy5iaW5kWm9vbX19O1xuICAgIH0pO1xuXG4gICAgbWFwcy5mb3JFYWNoKG1hc3Rlck1hcENvbmZpZyA9PiB7XG4gICAgICBjb25zdCBtYXN0ZXJNYXAgPSBtYXN0ZXJNYXBDb25maWcubWFwO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IG1hc3Rlck1hcENvbmZpZy5vcHRpb25zO1xuICAgICAgY29uc3QgbWFzdGVyQ2FtZXJhID0gbWFzdGVyTWFwLmdldENhbWVyYVNlcnZpY2UoKS5nZXRDYW1lcmEoKTtcbiAgICAgIGNvbnN0IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYyA9IG1hc3RlckNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcbiAgICAgIG1hc3RlckNhbWVyYS5wZXJjZW50YWdlQ2hhbmdlZCA9IG9wdGlvbnMuc2Vuc2l0aXZpdHkgfHwgREVGQVVMVF9TRU5TSVRJVklUWTtcbiAgICAgIGNvbnN0IHJlbW92ZUNhbGxiYWNrID0gbWFzdGVyQ2FtZXJhLmNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgIG1hcHMuZm9yRWFjaChzbGF2ZU1hcENvbmZpZyA9PiB7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXAgPSBzbGF2ZU1hcENvbmZpZy5tYXA7XG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXBPcHRpb25zID0gc2xhdmVNYXBDb25maWcub3B0aW9ucztcbiAgICAgICAgICBpZiAoc2xhdmVNYXAgPT09IG1hc3Rlck1hcCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhID0gc2xhdmVNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhQ2FydG9ncmFwaGljID0gc2xhdmVDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBDZXNpdW0uRWxsaXBzb2lkLldHUzg0LmNhcnRvZ3JhcGhpY1RvQ2FydGVzaWFuKHtcbiAgICAgICAgICAgIGxvbmdpdHVkZTogbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxvbmdpdHVkZSxcbiAgICAgICAgICAgIGxhdGl0dWRlOiBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMubGF0aXR1ZGUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNsYXZlTWFwT3B0aW9ucy5iaW5kWm9vbSA/IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQgOiBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoc2xhdmVNYXAuZ2V0Q2VzaXVtVmlld2VyKCkuc2NlbmUubW9kZSAhPT0gQ2VzaXVtLlNjZW5lTW9kZS5NT1JQSElORykge1xuICAgICAgICAgICAgc2xhdmVDYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiBzbGF2ZUNhbWVyYS5oZWFkaW5nLFxuICAgICAgICAgICAgICAgIHBpdGNoOiBzbGF2ZUNhbWVyYS5waXRjaCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MucHVzaChyZW1vdmVDYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5zeW5jcyBtYXBzIGNhbWVyYXNcbiAgICovXG4gIHVuc3luY01hcHNDYW1lcmFzKCkge1xuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MuZm9yRWFjaChyZW1vdmVDYWxsYmFjayA9PiByZW1vdmVDYWxsYmFjaygpKTtcbiAgICB0aGlzLmV2ZW50UmVtb3ZlQ2FsbGJhY2tzID0gW107XG4gIH1cbn1cbiJdfQ==