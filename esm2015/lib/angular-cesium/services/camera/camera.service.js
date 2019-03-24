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
        return this.camera.flyTo(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7QUFRekQsTUFBTSxPQUFPLGFBQWE7SUFheEI7UUFGUSw2QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFHekMsQ0FBQzs7Ozs7SUFFRCxJQUFJLENBQUMsYUFBNEI7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUM7UUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsQ0FBQztJQUM5RCxDQUFDOzs7OztJQUVELHVCQUF1QixDQUFDLFFBQWtCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FDakUsUUFBUSxDQUNULENBQUM7SUFDSixDQUFDOzs7O0lBRUQsdUJBQXVCO1FBQ3JCLElBQUks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QyxFQUFFO2dDQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs2QkFDakM7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQ2hDO3dCQUNILENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQzt3QkFDTixPQUFPLEVBQUUsQ0FBQztvQkFDWixDQUFDLENBQUE7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDOztBQTFUTSxxQ0FBdUIsR0FBRyxRQUFRLENBQUM7O1lBRjNDLFVBQVU7Ozs7OztJQUVULHNDQUEwQzs7Ozs7SUFFMUMsK0JBQW9COzs7OztJQUNwQiw4QkFBbUI7Ozs7O0lBQ25CLCtCQUFvQjs7Ozs7SUFDcEIsb0RBQXlDOzs7OztJQUN6Qyw4Q0FBbUM7Ozs7O0lBQ25DLG1DQUE0Qjs7Ozs7SUFDNUIsaUNBQTBCOzs7OztJQUMxQixpQ0FBMEI7Ozs7O0lBQzFCLGlEQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5cbi8qKlxuICogIFRoZSBzZXJ2aWNlIGV4cG9zZXMgdGhlIHNjZW5lJ3MgY2FtZXJhIGFuZCBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXJcbiAqICBTY2VuZU1vZGUuUEVSRk9STUFOQ0VfU0NFTkUyRCAtICBpcyBhIDNEIHNjZW5lIG1vZGUgdGhhdCBhY3RzIGxpa2UgQ2VzaXVtIDJEIG1vZGUsXG4gKiAgYnV0IGlzIG1vcmUgZWZmaWNpZW50IHBlcmZvcm1hbmNlIHdpc2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYW1lcmFTZXJ2aWNlIHtcbiAgc3RhdGljIFBFUkZPUk1BTkNFXzJEX0FMVElUVURFID0gMjUwMDAwMDA7XG5cbiAgcHJpdmF0ZSB2aWV3ZXI6IGFueTtcbiAgcHJpdmF0ZSBzY2VuZTogYW55O1xuICBwcml2YXRlIGNhbWVyYTogYW55O1xuICBwcml2YXRlIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjogYW55O1xuICBwcml2YXRlIG1vcnBoTGlzdGVuZXJDYW5jZWxGbjogYW55O1xuICBwcml2YXRlIGxhc3RSb3RhdGU6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdFRpbHQ6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdExvb2s6IGJvb2xlYW47XG4gIHByaXZhdGUgaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBpbml0KGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdlciA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XG4gICAgdGhpcy5zY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlciA9IHRoaXMuc2NlbmUuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG4gICAgdGhpcy5sYXN0Um90YXRlID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlO1xuICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgIHRoaXMubGFzdExvb2sgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rO1xuICB9XG5cbiAgX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4gPSB0aGlzLnNjZW5lLm1vcnBoU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIF9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCkge1xuICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG4gICAgdGhpcy5lbmFibGVUaWx0KHRoaXMubGFzdFRpbHQpO1xuICAgIHRoaXMuZW5hYmxlUm90YXRlKHRoaXMubGFzdFJvdGF0ZSk7XG4gICAgdGhpcy5lbmFibGVMb29rKHRoaXMubGFzdExvb2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3MgY2FtZXJhXG4gICAqL1xuICBnZXRDYW1lcmEoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3Mgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gICAqL1xuICBnZXRTY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICovXG4gIGdldE1pbmltdW1ab29tKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWluaW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKiBAcGFyYW0gem9vbSBhbW91bnRcbiAgICovXG4gIHNldE1pbmltdW1ab29tKGFtb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZSA9IGFtb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNYXhpbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1heGltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNYXhpbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdGlsdFxuICAgKi9cbiAgZW5hYmxlVGlsdCh0aWx0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IHRpbHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gcm90YXRlXG4gICAqL1xuICBlbmFibGVSb3RhdGUocm90YXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gcm90YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIGZyZWUtbG9va1xuICAgKi9cbiAgZW5hYmxlTG9vayhsb2NrOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGxvY2s7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdHJhbnNsYXRlXG4gICAqL1xuICBlbmFibGVUcmFuc2xhdGUodHJhbnNsYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHpvb21cbiAgICovXG4gIGVuYWJsZVpvb20oem9vbTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVpvb20gPSB6b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSByZWNlaXZlcyBpbnB1dHNcbiAgICovXG4gIGVuYWJsZUlucHV0cyhpbnB1dHM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVJbnB1dHMgPSBpbnB1dHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWFwJ3MgU2NlbmVNb2RlXG4gICAqIEBwYXJhbSBzY2VuZU1vZGUgLSBUaGUgU2NlbmVNb2RlIHRvIG1vcnBoIHRoZSBzY2VuZSBpbnRvLlxuICAgKiBAcGFyYW0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2Ygc2NlbmUgbW9ycGggYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0U2NlbmVNb2RlKHNjZW5lTW9kZTogU2NlbmVNb2RlLCBkdXJhdGlvbj86IG51bWJlcikge1xuICAgIHN3aXRjaCAoc2NlbmVNb2RlKSB7XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTNEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzNEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLkNPTFVNQlVTX1ZJRVc6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvQ29sdW1idXNWaWV3KGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlNDRU5FMkQ6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzJEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQ6IHtcbiAgICAgICAgdGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgICAgICAgdGhpcy5sYXN0VGlsdCA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQ7XG4gICAgICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4pIHtcbiAgICAgICAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG4gICAgICAgIGNvbnN0IG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyID0gdGhpcy5zY2VuZS5tb3JwaENvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tRGVncmVlcyhcbiAgICAgICAgICAgICAgICAwLjAsXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgICAgQ2FtZXJhU2VydmljZS5QRVJGT1JNQU5DRV8yRF9BTFRJVFVERSxcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWF4aW11bVpvb20oKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBwaXRjaDogQ2VzaXVtLk1hdGgudG9SYWRpYW5zKC05MClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuVG9TY2VuZU1vZGVNb3JwaChcbiAgICAgICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcy5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIGRlc3RpbmF0aW9uXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBjYW1lcmFGbHlUbyhvcHRpb25zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuZmx5VG8ob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciNmbHlUb1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICBmbHlUbyh0YXJnZXQ6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci5mbHlUbyh0YXJnZXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIGFtb3VudCBhbG9uZyB0aGUgY2FtZXJhJ3MgdmlldyB2ZWN0b3IuXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbUluXG4gICAqL1xuICB6b29tSW4oYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbUluKGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21PdXRcbiAgICovXG4gIHpvb21PdXQoYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbUluKGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3pvb21Ub1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICB6b29tVG8odGFyZ2V0OiBhbnksIG9mZnNldD86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci56b29tVG8odGFyZ2V0LCBvZmZzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbWVyYSNzZXRWaWV3XG4gICAqIEBwYXJhbSBvcHRpb25zIHZpZXdlciBvcHRpb25zXG4gICAqL1xuICBzZXRWaWV3KG9wdGlvbnM6IGFueSkge1xuICAgIHRoaXMuY2FtZXJhLnNldFZpZXcob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNhbWVyYSdzIHJvdGF0aW9uXG4gICAqL1xuICBzZXRSb3RhdGlvbihkZWdyZWVzSW5SYWRpYW5zOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFZpZXcoe29yaWVudGF0aW9uOiB7aGVhZGluZzogZGVncmVlc0luUmFkaWFuc319KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrcyBvciB1bmxvY2tzIGNhbWVyYSByb3RhdGlvblxuICAgKi9cbiAgbG9ja1JvdGF0aW9uKGxvY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSAhbG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHRoZSBjYW1lcmEgdHJhY2sgYSBzcGVjaWZpYyBlbnRpdHlcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjdHJhY2tlZEVudGl0eVxuICAgKiBAcGFyYW0gZW50aXR5IC0gZW50aXR5IHRvIHRyYWNrXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gdHJhY2sgZW50aXR5IG9wdGlvbnNcbiAgICovXG4gIHRyYWNrRW50aXR5KFxuICAgIGVudGl0eT86IGFueSxcbiAgICBvcHRpb25zPzogeyBmbHlUbzogYm9vbGVhbjsgZmx5VG9EdXJhdGlvbj86IG51bWJlcjsgYWx0aXR1ZGU/OiBudW1iZXIgfVxuICApIHtcbiAgICBjb25zdCBmbHlUbyA9IChvcHRpb25zICYmIG9wdGlvbnMuZmx5VG8pIHx8IGZhbHNlO1xuXG4gICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoZmx5VG8pIHtcbiAgICAgICAgY29uc3QgZmx5VG9EdXJhdGlvbiA9IChvcHRpb25zICYmIG9wdGlvbnMuZmx5VG9EdXJhdGlvbikgfHwgMTtcbiAgICAgICAgY29uc3QgYWx0aXR1ZGUgPSAob3B0aW9ucyAmJiBvcHRpb25zLmFsdGl0dWRlKSB8fCAxMDAwMDtcblxuICAgICAgICAvLyBDYWxjIGVudGl0eSBmbHlUbyBwb3NpdGlvbiBhbmQgd2FudGVkIGFsdGl0dWRlXG4gICAgICAgIGNvbnN0IGVudFBvc0NhcjMgPSBlbnRpdHkucG9zaXRpb24uZ2V0VmFsdWUoQ2VzaXVtLkp1bGlhbkRhdGUubm93KCkpO1xuICAgICAgICBjb25zdCBlbnRQb3NDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGVudFBvc0NhcjMpO1xuICAgICAgICBjb25zdCB6b29tQW1vdW50ID0gYWx0aXR1ZGUgLSBlbnRQb3NDYXJ0LmhlaWdodDtcbiAgICAgICAgZW50UG9zQ2FydC5oZWlnaHQgPSBhbHRpdHVkZTtcbiAgICAgICAgY29uc3QgZmx5VG9Qb3NpdGlvbiA9IENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKFxuICAgICAgICAgIGVudFBvc0NhcnQubG9uZ2l0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQubGF0aXR1ZGUsXG4gICAgICAgICAgZW50UG9zQ2FydC5oZWlnaHRcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNhbWVyYUZseVRvKHtcbiAgICAgICAgICBkdXJhdGlvbjogZmx5VG9EdXJhdGlvbixcbiAgICAgICAgICBkZXN0aW5hdGlvbjogZmx5VG9Qb3NpdGlvbixcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IGVudGl0eTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoem9vbUFtb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tT3V0KHpvb21BbW91bnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLnpvb21Jbih6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBlbnRpdHk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVudHJhY2tFbnRpdHkoKSB7XG4gICAgdGhpcy50cmFja0VudGl0eSgpO1xuICB9XG59XG4iXX0=