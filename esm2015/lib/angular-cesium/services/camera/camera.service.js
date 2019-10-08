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
export class CameraService {
    constructor() {
        this.isSceneModePerformance2D = false;
    }
    /**
     * @param {?} cesiumService
     * @return {?}
     */
    init(cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    _listenToSceneModeMorph(callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    }
    /**
     * @return {?}
     */
    _revertCameraProperties() {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    }
    /**
     * Gets the scene's camera
     * @return {?}
     */
    getCamera() {
        return this.camera;
    }
    /**
     * Gets the scene's screenSpaceCameraController
     * @return {?}
     */
    getScreenSpaceCameraController() {
        return this.screenSpaceCameraController;
    }
    /**
     * Gets the minimum zoom value in meters
     * @return {?}
     */
    getMinimumZoom() {
        return this.screenSpaceCameraController.minimumZoomDistance;
    }
    /**
     * Sets the minimum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    setMinimumZoom(amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    }
    /**
     * Gets the maximum zoom value in meters
     * @return {?}
     */
    getMaximumZoom() {
        return this.screenSpaceCameraController.maximumZoomDistance;
    }
    /**
     * Sets the maximum zoom value in meters
     * @param {?} amount
     * @return {?}
     */
    setMaximumZoom(amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    }
    /**
     * Sets if the camera is able to tilt
     * @param {?} tilt
     * @return {?}
     */
    enableTilt(tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    }
    /**
     * Sets if the camera is able to rotate
     * @param {?} rotate
     * @return {?}
     */
    enableRotate(rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    }
    /**
     * Sets if the camera is able to free-look
     * @param {?} lock
     * @return {?}
     */
    enableLook(lock) {
        this.screenSpaceCameraController.enableLook = lock;
    }
    /**
     * Sets if the camera is able to translate
     * @param {?} translate
     * @return {?}
     */
    enableTranslate(translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    }
    /**
     * Sets if the camera is able to zoom
     * @param {?} zoom
     * @return {?}
     */
    enableZoom(zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    }
    /**
     * Sets if the camera receives inputs
     * @param {?} inputs
     * @return {?}
     */
    enableInputs(inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    }
    /**
     * Sets the map's SceneMode
     * @param {?} sceneMode - The SceneMode to morph the scene into.
     * @param {?=} duration - The duration of scene morph animations, in seconds
     * @return {?}
     */
    setSceneMode(sceneMode, duration) {
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
                const morphCompleteEventListener = this.scene.morphComplete.addEventListener((/**
                 * @return {?}
                 */
                () => {
                    this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener();
                    this._listenToSceneModeMorph(this._revertCameraProperties.bind(this));
                }));
                break;
            }
        }
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @param {?} options
     * @return {?}
     */
    cameraFlyTo(options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    }
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @param {?} target
     * @param {?=} options
     * @return {?} Promise<boolean>
     */
    flyTo(target, options) {
        return this.viewer.flyTo(target, options);
    }
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     * @param {?} amount
     * @return {?}
     */
    zoomIn(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     * @param {?} amount
     * @return {?}
     */
    zoomOut(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @param {?} target
     * @param {?=} offset
     * @return {?} Promise<boolean>
     */
    zoomTo(target, offset) {
        return this.viewer.zoomTo(target, offset);
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param {?} options viewer options
     * @return {?}
     */
    setView(options) {
        this.camera.setView(options);
    }
    /**
     * Set camera's rotation
     * @param {?} degreesInRadians
     * @return {?}
     */
    setRotation(degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    }
    /**
     * Locks or unlocks camera rotation
     * @param {?} lock
     * @return {?}
     */
    lockRotation(lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    }
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param {?=} entity - entity to track
     * @param {?=} options - track entity options
     * @return {?}
     */
    trackEntity(entity, options) {
        /** @type {?} */
        const flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            if (flyTo) {
                /** @type {?} */
                const flyToDuration = (options && options.flyToDuration) || 1;
                /** @type {?} */
                const altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                /** @type {?} */
                const entPosCar3 = entity.position.getValue(Cesium.JulianDate.now());
                /** @type {?} */
                const entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                /** @type {?} */
                const zoomAmount = altitude - entPosCart.height;
                entPosCart.height = altitude;
                /** @type {?} */
                const flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: (/**
                     * @return {?}
                     */
                    () => {
                        this.viewer.trackedEntity = entity;
                        setTimeout((/**
                         * @return {?}
                         */
                        () => {
                            if (zoomAmount > 0) {
                                this.camera.zoomOut(zoomAmount);
                            }
                            else {
                                this.camera.zoomIn(zoomAmount);
                            }
                        }), 0);
                        resolve();
                    })
                });
            }
            else {
                this.viewer.trackedEntity = entity;
                resolve();
            }
        }));
    }
    /**
     * @return {?}
     */
    untrackEntity() {
        this.trackEntity();
    }
}
CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
CameraService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CameraService.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7QUFRekQsTUFBTSxPQUFPLGFBQWE7SUFheEI7UUFGUSw2QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFHekMsQ0FBQzs7Ozs7SUFFRCxJQUFJLENBQUMsYUFBNEI7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUM7UUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsQ0FBQztJQUM5RCxDQUFDOzs7OztJQUVELHVCQUF1QixDQUFDLFFBQWtCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakUsUUFBUSxDQUNULENBQUM7SUFDSixDQUFDOzs7O0lBRUQsdUJBQXVCO1FBQ3JCLElBQUks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OzRCQUNkLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtnQ0FDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQ2pDO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzZCQUNoQzt3QkFDSCxDQUFDLEdBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ04sT0FBTyxFQUFFLENBQUM7b0JBQ1osQ0FBQyxDQUFBO2lCQUNGLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUM7YUFDWDtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQzs7QUE1VE0scUNBQXVCLEdBQUcsUUFBUSxDQUFDOztZQUYzQyxVQUFVOzs7Ozs7SUFFVCxzQ0FBMEM7Ozs7O0lBRTFDLCtCQUFvQjs7Ozs7SUFDcEIsOEJBQW1COzs7OztJQUNuQiwrQkFBb0I7Ozs7O0lBQ3BCLG9EQUF5Qzs7Ozs7SUFDekMsOENBQW1DOzs7OztJQUNuQyxtQ0FBNEI7Ozs7O0lBQzVCLGlDQUEwQjs7Ozs7SUFDMUIsaUNBQTBCOzs7OztJQUMxQixpREFBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBleHBvc2VzIHRoZSBzY2VuZSdzIGNhbWVyYSBhbmQgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gKiAgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQgLSAgaXMgYSAzRCBzY2VuZSBtb2RlIHRoYXQgYWN0cyBsaWtlIENlc2l1bSAyRCBtb2RlLFxuICogIGJ1dCBpcyBtb3JlIGVmZmljaWVudCBwZXJmb3JtYW5jZSB3aXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FtZXJhU2VydmljZSB7XG4gIHN0YXRpYyBQRVJGT1JNQU5DRV8yRF9BTFRJVFVERSA9IDI1MDAwMDAwO1xuXG4gIHByaXZhdGUgdmlld2VyOiBhbnk7XG4gIHByaXZhdGUgc2NlbmU6IGFueTtcbiAgcHJpdmF0ZSBjYW1lcmE6IGFueTtcbiAgcHJpdmF0ZSBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXI6IGFueTtcbiAgcHJpdmF0ZSBtb3JwaExpc3RlbmVyQ2FuY2VsRm46IGFueTtcbiAgcHJpdmF0ZSBsYXN0Um90YXRlOiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RUaWx0OiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RMb29rOiBib29sZWFuO1xuICBwcml2YXRlIGlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3ZXIgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICAgIHRoaXMuc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgICB0aGlzLmNhbWVyYSA9IHRoaXMuc2NlbmUuY2FtZXJhO1xuICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICB0aGlzLmxhc3RUaWx0ID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdDtcbiAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgfVxuXG4gIF9saXN0ZW5Ub1NjZW5lTW9kZU1vcnBoKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuID0gdGhpcy5zY2VuZS5tb3JwaFN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICBfcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpIHtcbiAgICB0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuICAgIHRoaXMuZW5hYmxlVGlsdCh0aGlzLmxhc3RUaWx0KTtcbiAgICB0aGlzLmVuYWJsZVJvdGF0ZSh0aGlzLmxhc3RSb3RhdGUpO1xuICAgIHRoaXMuZW5hYmxlTG9vayh0aGlzLmxhc3RMb29rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIGNhbWVyYVxuICAgKi9cbiAgZ2V0Q2FtZXJhKCkge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlclxuICAgKi9cbiAgZ2V0U2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNaW5pbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5taW5pbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNaW5pbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWF4aW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKi9cbiAgZ2V0TWF4aW11bVpvb20oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWF4aW11bVpvb21EaXN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqIEBwYXJhbSB6b29tIGFtb3VudFxuICAgKi9cbiAgc2V0TWF4aW11bVpvb20oYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlID0gYW1vdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRpbHRcbiAgICovXG4gIGVuYWJsZVRpbHQodGlsdDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSB0aWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHJvdGF0ZVxuICAgKi9cbiAgZW5hYmxlUm90YXRlKHJvdGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZSA9IHJvdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byBmcmVlLWxvb2tcbiAgICovXG4gIGVuYWJsZUxvb2sobG9jazogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBsb2NrO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRyYW5zbGF0ZVxuICAgKi9cbiAgZW5hYmxlVHJhbnNsYXRlKHRyYW5zbGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB6b29tXG4gICAqL1xuICBlbmFibGVab29tKHpvb206IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVab29tID0gem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgcmVjZWl2ZXMgaW5wdXRzXG4gICAqL1xuICBlbmFibGVJbnB1dHMoaW5wdXRzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlSW5wdXRzID0gaW5wdXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1hcCdzIFNjZW5lTW9kZVxuICAgKiBAcGFyYW0gc2NlbmVNb2RlIC0gVGhlIFNjZW5lTW9kZSB0byBtb3JwaCB0aGUgc2NlbmUgaW50by5cbiAgICogQHBhcmFtIGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHNjZW5lIG1vcnBoIGFuaW1hdGlvbnMsIGluIHNlY29uZHNcbiAgICovXG4gIHNldFNjZW5lTW9kZShzY2VuZU1vZGU6IFNjZW5lTW9kZSwgZHVyYXRpb24/OiBudW1iZXIpIHtcbiAgICBzd2l0Y2ggKHNjZW5lTW9kZSkge1xuICAgICAgY2FzZSBTY2VuZU1vZGUuU0NFTkUzRDoge1xuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcbiAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8zRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5DT0xVTUJVU19WSUVXOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTJEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8yRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5QRVJGT1JNQU5DRV9TQ0VORTJEOiB7XG4gICAgICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0TG9vayA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2s7XG4gICAgICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgICAgICB0aGlzLmxhc3RSb3RhdGUgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGU7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuKSB7XG4gICAgICAgICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG9Db2x1bWJ1c1ZpZXcoZHVyYXRpb24pO1xuICAgICAgICBjb25zdCBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lciA9IHRoaXMuc2NlbmUubW9ycGhDb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLnNldFZpZXcoe1xuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbURlZ3JlZXMoXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIDAuMCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICAgIENhbWVyYVNlcnZpY2UuUEVSRk9STUFOQ0VfMkRfQUxUSVRVREUsXG4gICAgICAgICAgICAgICAgICB0aGlzLmdldE1heGltdW1ab29tKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgcGl0Y2g6IENlc2l1bS5NYXRoLnRvUmFkaWFucygtOTApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9ycGhDb21wbGV0ZUV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoXG4gICAgICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMuYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbSNmbHlUb1xuICAgKi9cbiAgY2FtZXJhRmx5VG8ob3B0aW9uczogYW55KSB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbWVyYS5mbHlUbyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciNmbHlUb1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICBmbHlUbyh0YXJnZXQ6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci5mbHlUbyh0YXJnZXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIGFtb3VudCBhbG9uZyB0aGUgY2FtZXJhJ3MgdmlldyB2ZWN0b3IuXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbUluXG4gICAqL1xuICB6b29tSW4oYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbUluKGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21PdXRcbiAgICovXG4gIHpvb21PdXQoYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbUluKGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3pvb21Ub1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICB6b29tVG8odGFyZ2V0OiBhbnksIG9mZnNldD86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci56b29tVG8odGFyZ2V0LCBvZmZzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbWVyYSNzZXRWaWV3XG4gICAqIEBwYXJhbSBvcHRpb25zIHZpZXdlciBvcHRpb25zXG4gICAqL1xuICBzZXRWaWV3KG9wdGlvbnM6IGFueSkge1xuICAgIHRoaXMuY2FtZXJhLnNldFZpZXcob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNhbWVyYSdzIHJvdGF0aW9uXG4gICAqL1xuICBzZXRSb3RhdGlvbihkZWdyZWVzSW5SYWRpYW5zOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFZpZXcoe29yaWVudGF0aW9uOiB7aGVhZGluZzogZGVncmVlc0luUmFkaWFuc319KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrcyBvciB1bmxvY2tzIGNhbWVyYSByb3RhdGlvblxuICAgKi9cbiAgbG9ja1JvdGF0aW9uKGxvY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSAhbG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHRoZSBjYW1lcmEgdHJhY2sgYSBzcGVjaWZpYyBlbnRpdHlcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjdHJhY2tlZEVudGl0eVxuICAgKiBAcGFyYW0gZW50aXR5IC0gZW50aXR5IHRvIHRyYWNrXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gdHJhY2sgZW50aXR5IG9wdGlvbnNcbiAgICovXG4gIHRyYWNrRW50aXR5KFxuICAgIGVudGl0eT86IGFueSxcbiAgICBvcHRpb25zPzogeyBmbHlUbzogYm9vbGVhbjsgZmx5VG9EdXJhdGlvbj86IG51bWJlcjsgYWx0aXR1ZGU/OiBudW1iZXIgfVxuICApIHtcbiAgICBjb25zdCBmbHlUbyA9IChvcHRpb25zICYmIG9wdGlvbnMuZmx5VG8pIHx8IGZhbHNlO1xuXG4gICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoZmx5VG8pIHtcbiAgICAgICAgY29uc3QgZmx5VG9EdXJhdGlvbiA9IChvcHRpb25zICYmIG9wdGlvbnMuZmx5VG9EdXJhdGlvbikgfHwgMTtcbiAgICAgICAgY29uc3QgYWx0aXR1ZGUgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFsdGl0dWRlKSB8fCAxMDAwMDtcblxuICAgICAgICAvLyBDYWxjIGVudGl0eSBmbHlUbyBwb3NpdGlvbiBhbmQgd2FudGVkIGFsdGl0dWRlXG4gICAgICAgIGNvbnN0IGVudFBvc0NhcjMgPSBlbnRpdHkucG9zaXRpb24uZ2V0VmFsdWUoQ2VzaXVtLkp1bGlhbkRhdGUubm93KCkpO1xuICAgICAgICBjb25zdCBlbnRQb3NDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGVudFBvc0NhcjMpO1xuICAgICAgICBjb25zdCB6b29tQW1vdW50ID0gYWx0aXR1ZGUgLSBlbnRQb3NDYXJ0LmhlaWdodDtcbiAgICAgICAgZW50UG9zQ2FydC5oZWlnaHQgPSBhbHRpdHVkZTtcbiAgICAgICAgY29uc3QgZmx5VG9Qb3NpdGlvbiA9IENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKFxuICAgICAgICAgIGVudFBvc0NhcnQubG9uZ2l0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQubGF0aXR1ZGUsXG4gICAgICAgICAgZW50UG9zQ2FydC5oZWlnaHRcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNhbWVyYUZseVRvKHtcbiAgICAgICAgICBkdXJhdGlvbjogZmx5VG9EdXJhdGlvbixcbiAgICAgICAgICBkZXN0aW5hdGlvbjogZmx5VG9Qb3NpdGlvbixcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoem9vbUFtb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tT3V0KHpvb21BbW91bnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLnpvb21Jbih6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVudHJhY2tFbnRpdHkoKSB7XG4gICAgdGhpcy50cmFja0VudGl0eSgpO1xuICB9XG59XG4iXX0=