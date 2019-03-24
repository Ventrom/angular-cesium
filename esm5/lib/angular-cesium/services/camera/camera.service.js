/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
        return this.camera.flyTo(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7QUFPekQ7SUFjRTtRQUZRLDZCQUF3QixHQUFHLEtBQUssQ0FBQztJQUd6QyxDQUFDOzs7OztJQUVELDRCQUFJOzs7O0lBQUosVUFBSyxhQUE0QjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztRQUMxRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO0lBQzlELENBQUM7Ozs7O0lBRUQsK0NBQXVCOzs7O0lBQXZCLFVBQXdCLFFBQWtCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakUsUUFBUSxDQUNULENBQUM7SUFDSixDQUFDOzs7O0lBRUQsK0NBQXVCOzs7SUFBdkI7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QUFDOztnQkFGM0MsVUFBVTs7OztJQTZUWCxvQkFBQztDQUFBLEFBN1RELElBNlRDO1NBNVRZLGFBQWE7OztJQUN4QixzQ0FBMEM7Ozs7O0lBRTFDLCtCQUFvQjs7Ozs7SUFDcEIsOEJBQW1COzs7OztJQUNuQiwrQkFBb0I7Ozs7O0lBQ3BCLG9EQUF5Qzs7Ozs7SUFDekMsOENBQW1DOzs7OztJQUNuQyxtQ0FBNEI7Ozs7O0lBQzVCLGlDQUEwQjs7Ozs7SUFDMUIsaUNBQTBCOzs7OztJQUMxQixpREFBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBleHBvc2VzIHRoZSBzY2VuZSdzIGNhbWVyYSBhbmQgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gKiAgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQgLSAgaXMgYSAzRCBzY2VuZSBtb2RlIHRoYXQgYWN0cyBsaWtlIENlc2l1bSAyRCBtb2RlLFxuICogIGJ1dCBpcyBtb3JlIGVmZmljaWVudCBwZXJmb3JtYW5jZSB3aXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FtZXJhU2VydmljZSB7XG4gIHN0YXRpYyBQRVJGT1JNQU5DRV8yRF9BTFRJVFVERSA9IDI1MDAwMDAwO1xuXG4gIHByaXZhdGUgdmlld2VyOiBhbnk7XG4gIHByaXZhdGUgc2NlbmU6IGFueTtcbiAgcHJpdmF0ZSBjYW1lcmE6IGFueTtcbiAgcHJpdmF0ZSBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXI6IGFueTtcbiAgcHJpdmF0ZSBtb3JwaExpc3RlbmVyQ2FuY2VsRm46IGFueTtcbiAgcHJpdmF0ZSBsYXN0Um90YXRlOiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RUaWx0OiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RMb29rOiBib29sZWFuO1xuICBwcml2YXRlIGlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3ZXIgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICAgIHRoaXMuc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgICB0aGlzLmNhbWVyYSA9IHRoaXMuc2NlbmUuY2FtZXJhO1xuICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICB0aGlzLmxhc3RUaWx0ID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdDtcbiAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgfVxuXG4gIF9saXN0ZW5Ub1NjZW5lTW9kZU1vcnBoKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuID0gdGhpcy5zY2VuZS5tb3JwaFN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICBfcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpIHtcbiAgICB0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuICAgIHRoaXMuZW5hYmxlVGlsdCh0aGlzLmxhc3RUaWx0KTtcbiAgICB0aGlzLmVuYWJsZVJvdGF0ZSh0aGlzLmxhc3RSb3RhdGUpO1xuICAgIHRoaXMuZW5hYmxlTG9vayh0aGlzLmxhc3RMb29rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIGNhbWVyYVxuICAgKi9cbiAgZ2V0Q2FtZXJhKCkge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlclxuICAgKi9cbiAgZ2V0U2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNaW5pbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5taW5pbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNaW5pbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWF4aW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKi9cbiAgZ2V0TWF4aW11bVpvb20oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWF4aW11bVpvb21EaXN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqIEBwYXJhbSB6b29tIGFtb3VudFxuICAgKi9cbiAgc2V0TWF4aW11bVpvb20oYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlID0gYW1vdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRpbHRcbiAgICovXG4gIGVuYWJsZVRpbHQodGlsdDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSB0aWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHJvdGF0ZVxuICAgKi9cbiAgZW5hYmxlUm90YXRlKHJvdGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZSA9IHJvdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byBmcmVlLWxvb2tcbiAgICovXG4gIGVuYWJsZUxvb2sobG9jazogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBsb2NrO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRyYW5zbGF0ZVxuICAgKi9cbiAgZW5hYmxlVHJhbnNsYXRlKHRyYW5zbGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB6b29tXG4gICAqL1xuICBlbmFibGVab29tKHpvb206IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVab29tID0gem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgcmVjZWl2ZXMgaW5wdXRzXG4gICAqL1xuICBlbmFibGVJbnB1dHMoaW5wdXRzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlSW5wdXRzID0gaW5wdXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1hcCdzIFNjZW5lTW9kZVxuICAgKiBAcGFyYW0gc2NlbmVNb2RlIC0gVGhlIFNjZW5lTW9kZSB0byBtb3JwaCB0aGUgc2NlbmUgaW50by5cbiAgICogQHBhcmFtIGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHNjZW5lIG1vcnBoIGFuaW1hdGlvbnMsIGluIHNlY29uZHNcbiAgICovXG4gIHNldFNjZW5lTW9kZShzY2VuZU1vZGU6IFNjZW5lTW9kZSwgZHVyYXRpb24/OiBudW1iZXIpIHtcbiAgICBzd2l0Y2ggKHNjZW5lTW9kZSkge1xuICAgICAgY2FzZSBTY2VuZU1vZGUuU0NFTkUzRDoge1xuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcbiAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8zRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5DT0xVTUJVU19WSUVXOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTJEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8yRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5QRVJGT1JNQU5DRV9TQ0VORTJEOiB7XG4gICAgICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0TG9vayA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2s7XG4gICAgICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgICAgICB0aGlzLmxhc3RSb3RhdGUgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGU7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuKSB7XG4gICAgICAgICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG9Db2x1bWJ1c1ZpZXcoZHVyYXRpb24pO1xuICAgICAgICBjb25zdCBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lciA9IHRoaXMuc2NlbmUubW9ycGhDb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLnNldFZpZXcoe1xuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbURlZ3JlZXMoXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIDAuMCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICAgIENhbWVyYVNlcnZpY2UuUEVSRk9STUFOQ0VfMkRfQUxUSVRVREUsXG4gICAgICAgICAgICAgICAgICB0aGlzLmdldE1heGltdW1ab29tKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgcGl0Y2g6IENlc2l1bS5NYXRoLnRvUmFkaWFucygtOTApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9ycGhDb21wbGV0ZUV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoXG4gICAgICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMuYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbSNmbHlUb1xuICAgKi9cbiAgY2FtZXJhRmx5VG8ob3B0aW9uczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLmZseVRvKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSB0YXJnZXRcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjZmx5VG9cbiAgICogQHJldHVybnMgUHJvbWlzZTxib29sZWFuPlxuICAgKi9cbiAgZmx5VG8odGFyZ2V0OiBhbnksIG9wdGlvbnM/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3ZXIuZmx5VG8odGFyZ2V0LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyBhbW91bnQgYWxvbmcgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21JblxuICAgKi9cbiAgem9vbUluKGFtb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLnpvb21JbihhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIGFtb3VudCBhbG9uZyB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uIG9mIHRoZSBjYW1lcmEncyB2aWV3IHZlY3Rvci5cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbCN6b29tT3V0XG4gICAqL1xuICB6b29tT3V0KGFtb3VudDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLnpvb21JbihhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciN6b29tVG9cbiAgICogQHJldHVybnMgUHJvbWlzZTxib29sZWFuPlxuICAgKi9cbiAgem9vbVRvKHRhcmdldDogYW55LCBvZmZzZXQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3ZXIuem9vbVRvKHRhcmdldCwgb2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgZGVzdGluYXRpb25cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW1lcmEjc2V0Vmlld1xuICAgKiBAcGFyYW0gb3B0aW9ucyB2aWV3ZXIgb3B0aW9uc1xuICAgKi9cbiAgc2V0VmlldyhvcHRpb25zOiBhbnkpIHtcbiAgICB0aGlzLmNhbWVyYS5zZXRWaWV3KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjYW1lcmEncyByb3RhdGlvblxuICAgKi9cbiAgc2V0Um90YXRpb24oZGVncmVlc0luUmFkaWFuczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRWaWV3KHtvcmllbnRhdGlvbjoge2hlYWRpbmc6IGRlZ3JlZXNJblJhZGlhbnN9fSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ja3Mgb3IgdW5sb2NrcyBjYW1lcmEgcm90YXRpb25cbiAgICovXG4gIGxvY2tSb3RhdGlvbihsb2NrOiBib29sZWFuKSB7XG4gICAgdGhpcy5zY2VuZS5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gIWxvY2s7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSB0aGUgY2FtZXJhIHRyYWNrIGEgc3BlY2lmaWMgZW50aXR5XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3RyYWNrZWRFbnRpdHlcbiAgICogQHBhcmFtIGVudGl0eSAtIGVudGl0eSB0byB0cmFja1xuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHRyYWNrIGVudGl0eSBvcHRpb25zXG4gICAqL1xuICB0cmFja0VudGl0eShcbiAgICBlbnRpdHk/OiBhbnksXG4gICAgb3B0aW9ucz86IHsgZmx5VG86IGJvb2xlYW47IGZseVRvRHVyYXRpb24/OiBudW1iZXI7IGFsdGl0dWRlPzogbnVtYmVyIH1cbiAgKSB7XG4gICAgY29uc3QgZmx5VG8gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvKSB8fCBmYWxzZTtcblxuICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGZseVRvKSB7XG4gICAgICAgIGNvbnN0IGZseVRvRHVyYXRpb24gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvRHVyYXRpb24pIHx8IDE7XG4gICAgICAgIGNvbnN0IGFsdGl0dWRlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hbHRpdHVkZSkgfHwgMTAwMDA7XG5cbiAgICAgICAgLy8gQ2FsYyBlbnRpdHkgZmx5VG8gcG9zaXRpb24gYW5kIHdhbnRlZCBhbHRpdHVkZVxuICAgICAgICBjb25zdCBlbnRQb3NDYXIzID0gZW50aXR5LnBvc2l0aW9uLmdldFZhbHVlKENlc2l1bS5KdWxpYW5EYXRlLm5vdygpKTtcbiAgICAgICAgY29uc3QgZW50UG9zQ2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihlbnRQb3NDYXIzKTtcbiAgICAgICAgY29uc3Qgem9vbUFtb3VudCA9IGFsdGl0dWRlIC0gZW50UG9zQ2FydC5oZWlnaHQ7XG4gICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0ID0gYWx0aXR1ZGU7XG4gICAgICAgIGNvbnN0IGZseVRvUG9zaXRpb24gPSBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxvbmdpdHVkZSxcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxhdGl0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYW1lcmFGbHlUbyh7XG4gICAgICAgICAgZHVyYXRpb246IGZseVRvRHVyYXRpb24sXG4gICAgICAgICAgZGVzdGluYXRpb246IGZseVRvUG9zaXRpb24sXG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHpvb21BbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEuem9vbU91dCh6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tSW4oem9vbUFtb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gZW50aXR5O1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnRyYWNrRW50aXR5KCkge1xuICAgIHRoaXMudHJhY2tFbnRpdHkoKTtcbiAgfVxufVxuIl19