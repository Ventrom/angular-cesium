/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { SceneMode } from '../../models/scene-mode.enum';
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
var CameraService = /** @class */ (function () {
    function CameraService() {
        this.isSceneModePerformance2D = false;
    }
    /**
     * @param {?} cesiumService
     * @return {?}
     */
    CameraService.prototype.init = /**
     * @param {?} cesiumService
     * @return {?}
     */
    function (cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    CameraService.prototype._listenToSceneModeMorph = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    };
    /**
     * @return {?}
     */
    CameraService.prototype._revertCameraProperties = /**
     * @return {?}
     */
    function () {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    };
    /**
     * Gets the scene's camera
     */
    /**
     * Gets the scene's camera
     * @return {?}
     */
    CameraService.prototype.getCamera = /**
     * Gets the scene's camera
     * @return {?}
     */
    function () {
        return this.camera;
    };
    /**
     * Gets the scene's screenSpaceCameraController
     */
    /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    CameraService.prototype.getScreenSpaceCameraController = /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController;
    };
    /**
     * Gets the minimum zoom value in meters
     */
    /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    CameraService.prototype.getMinimumZoom = /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController.minimumZoomDistance;
    };
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.setMinimumZoom = /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    };
    /**
     * Gets the maximum zoom value in meters
     */
    /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    CameraService.prototype.getMaximumZoom = /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    function () {
        return this.screenSpaceCameraController.maximumZoomDistance;
    };
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.setMaximumZoom = /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    };
    /**
     * Sets if the camera is able to tilt
     */
    /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    CameraService.prototype.enableTilt = /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    function (tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    };
    /**
     * Sets if the camera is able to rotate
     */
    /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    CameraService.prototype.enableRotate = /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    function (rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    };
    /**
     * Sets if the camera is able to free-look
     */
    /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    CameraService.prototype.enableLook = /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    function (lock) {
        this.screenSpaceCameraController.enableLook = lock;
    };
    /**
     * Sets if the camera is able to translate
     */
    /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    CameraService.prototype.enableTranslate = /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    function (translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    };
    /**
     * Sets if the camera is able to zoom
     */
    /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    CameraService.prototype.enableZoom = /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    function (zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    };
    /**
     * Sets if the camera receives inputs
     */
    /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    CameraService.prototype.enableInputs = /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    function (inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    };
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    CameraService.prototype.setSceneMode = /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    function (sceneMode, duration) {
        var _this = this;
        switch (sceneMode) {
            case SceneMode.SCENE3D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo3D(duration);
                break;
            }
            case SceneMode.COLUMBUS_VIEW: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphToColumbusView(duration);
                break;
            }
            case SceneMode.SCENE2D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo2D(duration);
                break;
            }
            case SceneMode.PERFORMANCE_SCENE2D: {
                this.isSceneModePerformance2D = true;
                this.lastLook = this.screenSpaceCameraController.enableLook;
                this.lastTilt = this.screenSpaceCameraController.enableTilt;
                this.lastRotate = this.screenSpaceCameraController.enableRotate;
                this.screenSpaceCameraController.enableTilt = false;
                this.screenSpaceCameraController.enableRotate = false;
                this.screenSpaceCameraController.enableLook = false;
                if (this.morphListenerCancelFn) {
                    this.morphListenerCancelFn();
                }
                this.scene.morphToColumbusView(duration);
                /** @type {?} */
                var morphCompleteEventListener_1 = this.scene.morphComplete.addEventListener((/**
                 * @return {?}
                 */
                function () {
                    _this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, _this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener_1();
                    _this._listenToSceneModeMorph(_this._revertCameraProperties.bind(_this));
                }));
                break;
            }
        }
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    CameraService.prototype.cameraFlyTo = /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    function (options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    };
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    CameraService.prototype.flyTo = /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    function (target, options) {
        return this.viewer.flyTo(target, options);
    };
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.zoomIn = /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    CameraService.prototype.zoomOut = /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    CameraService.prototype.zoomTo = /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    function (target, offset) {
        return this.viewer.zoomTo(target, offset);
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    CameraService.prototype.setView = /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    function (options) {
        this.camera.setView(options);
    };
    /**
     * Set camera's rotation
     */
    /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    CameraService.prototype.setRotation = /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    function (degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    };
    /**
     * Locks or unlocks camera rotation
     */
    /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    CameraService.prototype.lockRotation = /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    function (lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    };
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param entity - entity to track
     * @param options - track entity options
     */
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    CameraService.prototype.trackEntity = /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    function (entity, options) {
        var _this = this;
        /** @type {?} */
        var flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            if (flyTo) {
                /** @type {?} */
                var flyToDuration = (options && options.flyToDuration) || 1;
                /** @type {?} */
                var altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                /** @type {?} */
                var entPosCar3 = entity.position.getValue(Cesium.JulianDate.now());
                /** @type {?} */
                var entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                /** @type {?} */
                var zoomAmount_1 = altitude - entPosCart.height;
                entPosCart.height = altitude;
                /** @type {?} */
                var flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                _this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: (/**
                     * @return {?}
                     */
                    function () {
                        _this.viewer.trackedEntity = entity;
                        setTimeout((/**
                         * @return {?}
                         */
                        function () {
                            if (zoomAmount_1 > 0) {
                                _this.camera.zoomOut(zoomAmount_1);
                            }
                            else {
                                _this.camera.zoomIn(zoomAmount_1);
                            }
                        }), 0);
                        resolve();
                    })
                });
            }
            else {
                _this.viewer.trackedEntity = entity;
                resolve();
            }
        }));
    };
    /**
     * @return {?}
     */
    CameraService.prototype.untrackEntity = /**
     * @return {?}
     */
    function () {
        this.trackEntity();
    };
    CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
    CameraService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CameraService.ctorParameters = function () { return []; };
    return CameraService;
}());
export { CameraService };
if (false) {
    /** @type {?} */
    CameraService.PERFORMANCE_2D_ALTITUDE;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.viewer;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.scene;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.camera;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.screenSpaceCameraController;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.morphListenerCancelFn;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.lastRotate;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.lastTilt;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.lastLook;
    /**
     * @type {?}
     * @private
     */
    CameraService.prototype.isSceneModePerformance2D;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7QUFPekQ7SUFjRTtRQUZRLDZCQUF3QixHQUFHLEtBQUssQ0FBQztJQUd6QyxDQUFDOzs7OztJQUVELDRCQUFJOzs7O0lBQUosVUFBSyxhQUE0QjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztRQUMxRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO0lBQzlELENBQUM7Ozs7O0lBRUQsK0NBQXVCOzs7O0lBQXZCLFVBQXdCLFFBQWtCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakUsUUFBUSxDQUNULENBQUM7SUFDSixDQUFDOzs7O0lBRUQsK0NBQXVCOzs7SUFBdkI7UUFDRSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxpQ0FBUzs7OztJQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxzREFBOEI7Ozs7SUFBOUI7UUFDRSxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsc0NBQWM7Ozs7SUFBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixDQUFDO0lBQzlELENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNILHNDQUFjOzs7OztJQUFkLFVBQWUsTUFBYztRQUMzQixJQUFJLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxzQ0FBYzs7OztJQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7O0lBQ0gsc0NBQWM7Ozs7O0lBQWQsVUFBZSxNQUFjO1FBQzNCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUM7SUFDaEUsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxrQ0FBVTs7Ozs7SUFBVixVQUFXLElBQWE7UUFDdEIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxvQ0FBWTs7Ozs7SUFBWixVQUFhLE1BQWU7UUFDMUIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDekQsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxrQ0FBVTs7Ozs7SUFBVixVQUFXLElBQWE7UUFDdEIsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCx1Q0FBZTs7Ozs7SUFBZixVQUFnQixTQUFrQjtRQUNoQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILGtDQUFVOzs7OztJQUFWLFVBQVcsSUFBYTtRQUN0QixJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUNyRCxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNILG9DQUFZOzs7OztJQUFaLFVBQWEsTUFBZTtRQUMxQixJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILG9DQUFZOzs7Ozs7SUFBWixVQUFhLFNBQW9CLEVBQUUsUUFBaUI7UUFBcEQsaUJBaUVDO1FBaEVDLFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QixJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtvQkFDakMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7aUJBQ2hDO2dCQUVELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUvQixNQUFNO2FBQ1A7WUFDRCxLQUFLLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2lCQUNoQztnQkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV6QyxNQUFNO2FBQ1A7WUFDRCxLQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2lCQUNoQztnQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFL0IsTUFBTTthQUNQO1lBQ0QsS0FBSyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztnQkFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO2dCQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7Z0JBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksQ0FBQztnQkFDaEUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3BELElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDcEQsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2lCQUM5QjtnQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztvQkFDbkMsNEJBQTBCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCOzs7Z0JBQzFFO29CQUNFLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO3dCQUNsQixXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQ3hDLEdBQUcsRUFDSCxHQUFHLEVBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FDTixhQUFhLENBQUMsdUJBQXVCLEVBQ3JDLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FDdEIsQ0FDRjt3QkFDRCxXQUFXLEVBQUU7NEJBQ1gsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO3lCQUNsQztxQkFDRixDQUFDLENBQUM7b0JBQ0gsNEJBQTBCLEVBQUUsQ0FBQztvQkFDN0IsS0FBSSxDQUFDLHVCQUF1QixDQUMxQixLQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUN4QyxDQUFDO2dCQUNKLENBQUMsRUFDRjtnQkFFRCxNQUFNO2FBQ1A7U0FDRjtJQUNILENBQUM7SUFFRDs7O09BR0c7Ozs7Ozs7SUFDSCxtQ0FBVzs7Ozs7O0lBQVgsVUFBWSxPQUFZO1FBQ3RCLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILDZCQUFLOzs7Ozs7O0lBQUwsVUFBTSxNQUFXLEVBQUUsT0FBYTtRQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0gsOEJBQU07Ozs7OztJQUFOLFVBQU8sTUFBYztRQUNuQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7OztJQUNILCtCQUFPOzs7Ozs7SUFBUCxVQUFRLE1BQWM7UUFDcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7OztJQUNILDhCQUFNOzs7Ozs7O0lBQU4sVUFBTyxNQUFXLEVBQUUsTUFBWTtRQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNILCtCQUFPOzs7Ozs7SUFBUCxVQUFRLE9BQVk7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOztPQUVHOzs7Ozs7SUFDSCxtQ0FBVzs7Ozs7SUFBWCxVQUFZLGdCQUF3QjtRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsV0FBVyxFQUFFLEVBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7T0FFRzs7Ozs7O0lBQ0gsb0NBQVk7Ozs7O0lBQVosVUFBYSxJQUFhO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzlELENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSCxtQ0FBVzs7Ozs7OztJQUFYLFVBQ0UsTUFBWSxFQUNaLE9BQXVFO1FBRnpFLGlCQTJDQzs7WUF2Q08sS0FBSyxHQUFHLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLO1FBRWpELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztRQUN0QyxPQUFPLElBQUksT0FBTzs7OztRQUFDLFVBQUEsT0FBTztZQUN4QixJQUFJLEtBQUssRUFBRTs7b0JBQ0gsYUFBYSxHQUFHLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDOztvQkFDdkQsUUFBUSxHQUFHLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLOzs7b0JBR2pELFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDOztvQkFDOUQsVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQzs7b0JBQzFELFlBQVUsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU07Z0JBQy9DLFVBQVUsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDOztvQkFDdkIsYUFBYSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUNqRCxVQUFVLENBQUMsU0FBUyxFQUNwQixVQUFVLENBQUMsUUFBUSxFQUNuQixVQUFVLENBQUMsTUFBTSxDQUNsQjtnQkFFRCxLQUFJLENBQUMsV0FBVyxDQUFDO29CQUNmLFFBQVEsRUFBRSxhQUFhO29CQUN2QixXQUFXLEVBQUUsYUFBYTtvQkFDMUIsUUFBUTs7O29CQUFFO3dCQUNSLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQzt3QkFDbkMsVUFBVTs7O3dCQUFDOzRCQUNULElBQUksWUFBVSxHQUFHLENBQUMsRUFBRTtnQ0FDbEIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBVSxDQUFDLENBQUM7NkJBQ2pDO2lDQUFNO2dDQUNMLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVUsQ0FBQyxDQUFDOzZCQUNoQzt3QkFDSCxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ04sT0FBTyxFQUFFLENBQUM7b0JBQ1osQ0FBQyxDQUFBO2lCQUNGLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLEtBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUM7YUFDWDtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELHFDQUFhOzs7SUFBYjtRQUNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBNVRNLHFDQUF1QixHQUFHLFFBQVEsQ0FBQzs7Z0JBRjNDLFVBQVU7Ozs7SUErVFgsb0JBQUM7Q0FBQSxBQS9URCxJQStUQztTQTlUWSxhQUFhOzs7SUFDeEIsc0NBQTBDOzs7OztJQUUxQywrQkFBb0I7Ozs7O0lBQ3BCLDhCQUFtQjs7Ozs7SUFDbkIsK0JBQW9COzs7OztJQUNwQixvREFBeUM7Ozs7O0lBQ3pDLDhDQUFtQzs7Ozs7SUFDbkMsbUNBQTRCOzs7OztJQUM1QixpQ0FBMEI7Ozs7O0lBQzFCLGlDQUEwQjs7Ozs7SUFDMUIsaURBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBTY2VuZU1vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvc2NlbmUtbW9kZS5lbnVtJztcblxuLyoqXG4gKiAgVGhlIHNlcnZpY2UgZXhwb3NlcyB0aGUgc2NlbmUncyBjYW1lcmEgYW5kIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlclxuICogIFNjZW5lTW9kZS5QRVJGT1JNQU5DRV9TQ0VORTJEIC0gIGlzIGEgM0Qgc2NlbmUgbW9kZSB0aGF0IGFjdHMgbGlrZSBDZXNpdW0gMkQgbW9kZSxcbiAqICBidXQgaXMgbW9yZSBlZmZpY2llbnQgcGVyZm9ybWFuY2Ugd2lzZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENhbWVyYVNlcnZpY2Uge1xuICBzdGF0aWMgUEVSRk9STUFOQ0VfMkRfQUxUSVRVREUgPSAyNTAwMDAwMDtcblxuICBwcml2YXRlIHZpZXdlcjogYW55O1xuICBwcml2YXRlIHNjZW5lOiBhbnk7XG4gIHByaXZhdGUgY2FtZXJhOiBhbnk7XG4gIHByaXZhdGUgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyOiBhbnk7XG4gIHByaXZhdGUgbW9ycGhMaXN0ZW5lckNhbmNlbEZuOiBhbnk7XG4gIHByaXZhdGUgbGFzdFJvdGF0ZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsYXN0VGlsdDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBsYXN0TG9vazogYm9vbGVhbjtcbiAgcHJpdmF0ZSBpc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGluaXQoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHRoaXMudmlld2VyID0gY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKTtcbiAgICB0aGlzLnNjZW5lID0gY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyID0gdGhpcy5zY2VuZS5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXI7XG4gICAgdGhpcy5jYW1lcmEgPSB0aGlzLnNjZW5lLmNhbWVyYTtcbiAgICB0aGlzLmxhc3RSb3RhdGUgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGU7XG4gICAgdGhpcy5sYXN0VGlsdCA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQ7XG4gICAgdGhpcy5sYXN0TG9vayA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2s7XG4gIH1cblxuICBfbGlzdGVuVG9TY2VuZU1vZGVNb3JwaChjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbiA9IHRoaXMuc2NlbmUubW9ycGhTdGFydC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgX3JldmVydENhbWVyYVByb3BlcnRpZXMoKSB7XG4gICAgdGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSBmYWxzZTtcbiAgICB0aGlzLmVuYWJsZVRpbHQodGhpcy5sYXN0VGlsdCk7XG4gICAgdGhpcy5lbmFibGVSb3RhdGUodGhpcy5sYXN0Um90YXRlKTtcbiAgICB0aGlzLmVuYWJsZUxvb2sodGhpcy5sYXN0TG9vayk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc2NlbmUncyBjYW1lcmFcbiAgICovXG4gIGdldENhbWVyYSgpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgc2NlbmUncyBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXJcbiAgICovXG4gIGdldFNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcigpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXI7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWluaW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKi9cbiAgZ2V0TWluaW11bVpvb20oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtaW5pbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqIEBwYXJhbSB6b29tIGFtb3VudFxuICAgKi9cbiAgc2V0TWluaW11bVpvb20oYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5taW5pbXVtWm9vbURpc3RhbmNlID0gYW1vdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1heGltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICovXG4gIGdldE1heGltdW1ab29tKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWF4aW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKiBAcGFyYW0gem9vbSBhbW91bnRcbiAgICovXG4gIHNldE1heGltdW1ab29tKGFtb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWF4aW11bVpvb21EaXN0YW5jZSA9IGFtb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB0aWx0XG4gICAqL1xuICBlbmFibGVUaWx0KHRpbHQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0ID0gdGlsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byByb3RhdGVcbiAgICovXG4gIGVuYWJsZVJvdGF0ZShyb3RhdGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSByb3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gZnJlZS1sb29rXG4gICAqL1xuICBlbmFibGVMb29rKGxvY2s6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rID0gbG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB0cmFuc2xhdGVcbiAgICovXG4gIGVuYWJsZVRyYW5zbGF0ZSh0cmFuc2xhdGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUcmFuc2xhdGUgPSB0cmFuc2xhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gem9vbVxuICAgKi9cbiAgZW5hYmxlWm9vbSh6b29tOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlWm9vbSA9IHpvb207XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIHJlY2VpdmVzIGlucHV0c1xuICAgKi9cbiAgZW5hYmxlSW5wdXRzKGlucHV0czogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUlucHV0cyA9IGlucHV0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcbiAgICogQHBhcmFtIHNjZW5lTW9kZSAtIFRoZSBTY2VuZU1vZGUgdG8gbW9ycGggdGhlIHNjZW5lIGludG8uXG4gICAqIEBwYXJhbSBkdXJhdGlvbiAtIFRoZSBkdXJhdGlvbiBvZiBzY2VuZSBtb3JwaCBhbmltYXRpb25zLCBpbiBzZWNvbmRzXG4gICAqL1xuICBzZXRTY2VuZU1vZGUoc2NlbmVNb2RlOiBTY2VuZU1vZGUsIGR1cmF0aW9uPzogbnVtYmVyKSB7XG4gICAgc3dpdGNoIChzY2VuZU1vZGUpIHtcbiAgICAgIGNhc2UgU2NlbmVNb2RlLlNDRU5FM0Q6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvM0QoZHVyYXRpb24pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBTY2VuZU1vZGUuQ09MVU1CVVNfVklFVzoge1xuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcbiAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG9Db2x1bWJ1c1ZpZXcoZHVyYXRpb24pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBTY2VuZU1vZGUuU0NFTkUyRDoge1xuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcbiAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvMkQoZHVyYXRpb24pO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBTY2VuZU1vZGUuUEVSRk9STUFOQ0VfU0NFTkUyRDoge1xuICAgICAgICB0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdExvb2sgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rO1xuICAgICAgICB0aGlzLmxhc3RUaWx0ID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdDtcbiAgICAgICAgdGhpcy5sYXN0Um90YXRlID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlO1xuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbikge1xuICAgICAgICAgIHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvQ29sdW1idXNWaWV3KGR1cmF0aW9uKTtcbiAgICAgICAgY29uc3QgbW9ycGhDb21wbGV0ZUV2ZW50TGlzdGVuZXIgPSB0aGlzLnNjZW5lLm1vcnBoQ29tcGxldGUuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbWVyYS5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgZGVzdGluYXRpb246IENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21EZWdyZWVzKFxuICAgICAgICAgICAgICAgIDAuMCxcbiAgICAgICAgICAgICAgICAwLjAsXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICBDYW1lcmFTZXJ2aWNlLlBFUkZPUk1BTkNFXzJEX0FMVElUVURFLFxuICAgICAgICAgICAgICAgICAgdGhpcy5nZXRNYXhpbXVtWm9vbSgpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBvcmllbnRhdGlvbjoge1xuICAgICAgICAgICAgICAgIHBpdGNoOiBDZXNpdW0uTWF0aC50b1JhZGlhbnMoLTkwKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5Ub1NjZW5lTW9kZU1vcnBoKFxuICAgICAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgZGVzdGluYXRpb25cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW0jZmx5VG9cbiAgICovXG4gIGNhbWVyYUZseVRvKG9wdGlvbnM6IGFueSkge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW1lcmEuZmx5VG8ob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSB0YXJnZXRcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjZmx5VG9cbiAgICogQHJldHVybnMgUHJvbWlzZTxib29sZWFuPlxuICAgKi9cbiAgZmx5VG8odGFyZ2V0OiBhbnksIG9wdGlvbnM/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3ZXIuZmx5VG8odGFyZ2V0LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyBhbW91bnQgYWxvbmcgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21JblxuICAgKi9cbiAgem9vbUluKGFtb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLnpvb21JbihhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIGFtb3VudCBhbG9uZyB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uIG9mIHRoZSBjYW1lcmEncyB2aWV3IHZlY3Rvci5cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbCN6b29tT3V0XG4gICAqL1xuICB6b29tT3V0KGFtb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLnpvb21JbihhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciN6b29tVG9cbiAgICogQHJldHVybnMgUHJvbWlzZTxib29sZWFuPlxuICAgKi9cbiAgem9vbVRvKHRhcmdldDogYW55LCBvZmZzZXQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3ZXIuem9vbVRvKHRhcmdldCwgb2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgZGVzdGluYXRpb25cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW1lcmEjc2V0Vmlld1xuICAgKiBAcGFyYW0gb3B0aW9ucyB2aWV3ZXIgb3B0aW9uc1xuICAgKi9cbiAgc2V0VmlldyhvcHRpb25zOiBhbnkpIHtcbiAgICB0aGlzLmNhbWVyYS5zZXRWaWV3KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjYW1lcmEncyByb3RhdGlvblxuICAgKi9cbiAgc2V0Um90YXRpb24oZGVncmVlc0luUmFkaWFuczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRWaWV3KHtvcmllbnRhdGlvbjoge2hlYWRpbmc6IGRlZ3JlZXNJblJhZGlhbnN9fSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ja3Mgb3IgdW5sb2NrcyBjYW1lcmEgcm90YXRpb25cbiAgICovXG4gIGxvY2tSb3RhdGlvbihsb2NrOiBib29sZWFuKSB7XG4gICAgdGhpcy5zY2VuZS5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gIWxvY2s7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSB0aGUgY2FtZXJhIHRyYWNrIGEgc3BlY2lmaWMgZW50aXR5XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3RyYWNrZWRFbnRpdHlcbiAgICogQHBhcmFtIGVudGl0eSAtIGVudGl0eSB0byB0cmFja1xuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHRyYWNrIGVudGl0eSBvcHRpb25zXG4gICAqL1xuICB0cmFja0VudGl0eShcbiAgICBlbnRpdHk/OiBhbnksXG4gICAgb3B0aW9ucz86IHsgZmx5VG86IGJvb2xlYW47IGZseVRvRHVyYXRpb24/OiBudW1iZXI7IGFsdGl0dWRlPzogbnVtYmVyIH1cbiAgKSB7XG4gICAgY29uc3QgZmx5VG8gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvKSB8fCBmYWxzZTtcblxuICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGZseVRvKSB7XG4gICAgICAgIGNvbnN0IGZseVRvRHVyYXRpb24gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvRHVyYXRpb24pIHx8IDE7XG4gICAgICAgIGNvbnN0IGFsdGl0dWRlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hbHRpdHVkZSkgfHwgMTAwMDA7XG5cbiAgICAgICAgLy8gQ2FsYyBlbnRpdHkgZmx5VG8gcG9zaXRpb24gYW5kIHdhbnRlZCBhbHRpdHVkZVxuICAgICAgICBjb25zdCBlbnRQb3NDYXIzID0gZW50aXR5LnBvc2l0aW9uLmdldFZhbHVlKENlc2l1bS5KdWxpYW5EYXRlLm5vdygpKTtcbiAgICAgICAgY29uc3QgZW50UG9zQ2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihlbnRQb3NDYXIzKTtcbiAgICAgICAgY29uc3Qgem9vbUFtb3VudCA9IGFsdGl0dWRlIC0gZW50UG9zQ2FydC5oZWlnaHQ7XG4gICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0ID0gYWx0aXR1ZGU7XG4gICAgICAgIGNvbnN0IGZseVRvUG9zaXRpb24gPSBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxvbmdpdHVkZSxcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxhdGl0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYW1lcmFGbHlUbyh7XG4gICAgICAgICAgZHVyYXRpb246IGZseVRvRHVyYXRpb24sXG4gICAgICAgICAgZGVzdGluYXRpb246IGZseVRvUG9zaXRpb24sXG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHpvb21BbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEuem9vbU91dCh6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tSW4oem9vbUFtb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gZW50aXR5O1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnRyYWNrRW50aXR5KCkge1xuICAgIHRoaXMudHJhY2tFbnRpdHkoKTtcbiAgfVxufVxuIl19