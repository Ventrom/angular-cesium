var CameraService_1;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { SceneMode } from '../../models/scene-mode.enum';
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
let CameraService = CameraService_1 = class CameraService {
    constructor() {
        this.isSceneModePerformance2D = false;
    }
    init(cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    }
    _listenToSceneModeMorph(callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    }
    _revertCameraProperties() {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    }
    /**
     * Gets the scene's camera
     */
    getCamera() {
        return this.camera;
    }
    /**
     * Gets the scene's screenSpaceCameraController
     */
    getScreenSpaceCameraController() {
        return this.screenSpaceCameraController;
    }
    /**
     * Gets the minimum zoom value in meters
     */
    getMinimumZoom() {
        return this.screenSpaceCameraController.minimumZoomDistance;
    }
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    setMinimumZoom(amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    }
    /**
     * Gets the maximum zoom value in meters
     */
    getMaximumZoom() {
        return this.screenSpaceCameraController.maximumZoomDistance;
    }
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    setMaximumZoom(amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    }
    /**
     * Sets if the camera is able to tilt
     */
    enableTilt(tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    }
    /**
     * Sets if the camera is able to rotate
     */
    enableRotate(rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    }
    /**
     * Sets if the camera is able to free-look
     */
    enableLook(lock) {
        this.screenSpaceCameraController.enableLook = lock;
    }
    /**
     * Sets if the camera is able to translate
     */
    enableTranslate(translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    }
    /**
     * Sets if the camera is able to zoom
     */
    enableZoom(zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    }
    /**
     * Sets if the camera receives inputs
     */
    enableInputs(inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    }
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
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
                const morphCompleteEventListener = this.scene.morphComplete.addEventListener(() => {
                    this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService_1.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener();
                    this._listenToSceneModeMorph(this._revertCameraProperties.bind(this));
                });
                break;
            }
        }
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    cameraFlyTo(options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    }
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    flyTo(target, options) {
        return this.viewer.flyTo(target, options);
    }
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    zoomIn(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    zoomOut(amount) {
        return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    zoomTo(target, offset) {
        return this.viewer.zoomTo(target, offset);
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    setView(options) {
        this.camera.setView(options);
    }
    /**
     * Set camera's rotation
     */
    setRotation(degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    }
    /**
     * Locks or unlocks camera rotation
     */
    lockRotation(lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    }
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    trackEntity(cesiumEntity, options) {
        const flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise(resolve => {
            if (flyTo) {
                const flyToDuration = (options && options.flyToDuration) || 1;
                const altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                const entPosCar3 = cesiumEntity.position.getValue(Cesium.JulianDate.now());
                const entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                const zoomAmount = altitude - entPosCart.height;
                entPosCart.height = altitude;
                const flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: () => {
                        this.viewer.trackedEntity = cesiumEntity;
                        setTimeout(() => {
                            if (zoomAmount > 0) {
                                this.camera.zoomOut(zoomAmount);
                            }
                            else {
                                this.camera.zoomIn(zoomAmount);
                            }
                        }, 0);
                        resolve();
                    }
                });
            }
            else {
                this.viewer.trackedEntity = cesiumEntity;
                resolve();
            }
        });
    }
    untrackEntity() {
        this.trackEntity();
    }
};
CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
CameraService = CameraService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], CameraService);
export { CameraService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV6RDs7OztHQUlHO0FBRUgsSUFBYSxhQUFhLHFCQUExQixNQUFhLGFBQWE7SUFheEI7UUFGUSw2QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFHekMsQ0FBQztJQUVELElBQUksQ0FBQyxhQUE0QjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztRQUMxRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFlBQVksQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO0lBQzlELENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxRQUFrQjtRQUN4QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pFLFFBQVEsQ0FDVCxDQUFDO0lBQ0osQ0FBQztJQUVELHVCQUF1QjtRQUNy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UyxFQUNwQixVQUFVLENBQUMsUUFBUSxFQUNuQixVQUFVLENBQUMsTUFBTSxDQUNsQixDQUFDO2dCQUVGLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ2YsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFdBQVcsRUFBRSxhQUFhO29CQUMxQixRQUFRLEVBQUUsR0FBRyxFQUFFO3dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQzt3QkFDekMsVUFBVSxDQUFDLEdBQUcsRUFBRTs0QkFDZCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7Z0NBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzZCQUNqQztpQ0FBTTtnQ0FDTCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQzs2QkFDaEM7d0JBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNOLE9BQU8sRUFBRSxDQUFDO29CQUNaLENBQUM7aUJBQ0YsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO2dCQUN6QyxPQUFPLEVBQUUsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQ0YsQ0FBQTtBQTdUUSxxQ0FBdUIsR0FBRyxRQUFRLENBQUM7QUFEL0IsYUFBYTtJQUR6QixVQUFVLEVBQUU7O0dBQ0EsYUFBYSxDQThUekI7U0E5VFksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5cbi8qKlxuICogIFRoZSBzZXJ2aWNlIGV4cG9zZXMgdGhlIHNjZW5lJ3MgY2FtZXJhIGFuZCBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXJcbiAqICBTY2VuZU1vZGUuUEVSRk9STUFOQ0VfU0NFTkUyRCAtICBpcyBhIDNEIHNjZW5lIG1vZGUgdGhhdCBhY3RzIGxpa2UgQ2VzaXVtIDJEIG1vZGUsXG4gKiAgYnV0IGlzIG1vcmUgZWZmaWNpZW50IHBlcmZvcm1hbmNlIHdpc2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYW1lcmFTZXJ2aWNlIHtcbiAgc3RhdGljIFBFUkZPUk1BTkNFXzJEX0FMVElUVURFID0gMjUwMDAwMDA7XG5cbiAgcHJpdmF0ZSB2aWV3ZXI6IGFueTtcbiAgcHJpdmF0ZSBzY2VuZTogYW55O1xuICBwcml2YXRlIGNhbWVyYTogYW55O1xuICBwcml2YXRlIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjogYW55O1xuICBwcml2YXRlIG1vcnBoTGlzdGVuZXJDYW5jZWxGbjogYW55O1xuICBwcml2YXRlIGxhc3RSb3RhdGU6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdFRpbHQ6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdExvb2s6IGJvb2xlYW47XG4gIHByaXZhdGUgaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBpbml0KGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdlciA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XG4gICAgdGhpcy5zY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlciA9IHRoaXMuc2NlbmUuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG4gICAgdGhpcy5sYXN0Um90YXRlID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlO1xuICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgIHRoaXMubGFzdExvb2sgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rO1xuICB9XG5cbiAgX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4gPSB0aGlzLnNjZW5lLm1vcnBoU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIF9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCkge1xuICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG4gICAgdGhpcy5lbmFibGVUaWx0KHRoaXMubGFzdFRpbHQpO1xuICAgIHRoaXMuZW5hYmxlUm90YXRlKHRoaXMubGFzdFJvdGF0ZSk7XG4gICAgdGhpcy5lbmFibGVMb29rKHRoaXMubGFzdExvb2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3MgY2FtZXJhXG4gICAqL1xuICBnZXRDYW1lcmEoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3Mgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gICAqL1xuICBnZXRTY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICovXG4gIGdldE1pbmltdW1ab29tKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWluaW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKiBAcGFyYW0gem9vbSBhbW91bnRcbiAgICovXG4gIHNldE1pbmltdW1ab29tKGFtb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZSA9IGFtb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNYXhpbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1heGltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNYXhpbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdGlsdFxuICAgKi9cbiAgZW5hYmxlVGlsdCh0aWx0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IHRpbHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gcm90YXRlXG4gICAqL1xuICBlbmFibGVSb3RhdGUocm90YXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gcm90YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIGZyZWUtbG9va1xuICAgKi9cbiAgZW5hYmxlTG9vayhsb2NrOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGxvY2s7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdHJhbnNsYXRlXG4gICAqL1xuICBlbmFibGVUcmFuc2xhdGUodHJhbnNsYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHpvb21cbiAgICovXG4gIGVuYWJsZVpvb20oem9vbTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVpvb20gPSB6b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSByZWNlaXZlcyBpbnB1dHNcbiAgICovXG4gIGVuYWJsZUlucHV0cyhpbnB1dHM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVJbnB1dHMgPSBpbnB1dHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWFwJ3MgU2NlbmVNb2RlXG4gICAqIEBwYXJhbSBzY2VuZU1vZGUgLSBUaGUgU2NlbmVNb2RlIHRvIG1vcnBoIHRoZSBzY2VuZSBpbnRvLlxuICAgKiBAcGFyYW0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2Ygc2NlbmUgbW9ycGggYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0U2NlbmVNb2RlKHNjZW5lTW9kZTogU2NlbmVNb2RlLCBkdXJhdGlvbj86IG51bWJlcikge1xuICAgIHN3aXRjaCAoc2NlbmVNb2RlKSB7XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTNEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzNEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLkNPTFVNQlVTX1ZJRVc6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvQ29sdW1idXNWaWV3KGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlNDRU5FMkQ6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzJEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQ6IHtcbiAgICAgICAgdGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgICAgICAgdGhpcy5sYXN0VGlsdCA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQ7XG4gICAgICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4pIHtcbiAgICAgICAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG4gICAgICAgIGNvbnN0IG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyID0gdGhpcy5zY2VuZS5tb3JwaENvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tRGVncmVlcyhcbiAgICAgICAgICAgICAgICAwLjAsXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgICAgQ2FtZXJhU2VydmljZS5QRVJGT1JNQU5DRV8yRF9BTFRJVFVERSxcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWF4aW11bVpvb20oKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBwaXRjaDogQ2VzaXVtLk1hdGgudG9SYWRpYW5zKC05MClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuVG9TY2VuZU1vZGVNb3JwaChcbiAgICAgICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcy5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIGRlc3RpbmF0aW9uXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBjYW1lcmFGbHlUbyhvcHRpb25zOiBhbnkpIHtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuY2FtZXJhLmZseVRvKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI2ZseVRvXG4gICAqIEByZXR1cm5zIFByb21pc2U8Ym9vbGVhbj5cbiAgICovXG4gIGZseVRvKHRhcmdldDogYW55LCBvcHRpb25zPzogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMudmlld2VyLmZseVRvKHRhcmdldCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBjYW1lcmEncyB2aWV3IHZlY3Rvci5cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbCN6b29tSW5cbiAgICovXG4gIHpvb21JbihhbW91bnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYS56b29tSW4oYW1vdW50IHx8IHRoaXMuY2FtZXJhLmRlZmF1bHRab29tQW1vdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyBhbW91bnQgYWxvbmcgdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiB0aGUgY2FtZXJhJ3MgdmlldyB2ZWN0b3IuXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbU91dFxuICAgKi9cbiAgem9vbU91dChhbW91bnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYS56b29tT3V0KGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3pvb21Ub1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICB6b29tVG8odGFyZ2V0OiBhbnksIG9mZnNldD86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci56b29tVG8odGFyZ2V0LCBvZmZzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbWVyYSNzZXRWaWV3XG4gICAqIEBwYXJhbSBvcHRpb25zIHZpZXdlciBvcHRpb25zXG4gICAqL1xuICBzZXRWaWV3KG9wdGlvbnM6IGFueSkge1xuICAgIHRoaXMuY2FtZXJhLnNldFZpZXcob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNhbWVyYSdzIHJvdGF0aW9uXG4gICAqL1xuICBzZXRSb3RhdGlvbihkZWdyZWVzSW5SYWRpYW5zOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFZpZXcoe29yaWVudGF0aW9uOiB7aGVhZGluZzogZGVncmVlc0luUmFkaWFuc319KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrcyBvciB1bmxvY2tzIGNhbWVyYSByb3RhdGlvblxuICAgKi9cbiAgbG9ja1JvdGF0aW9uKGxvY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSAhbG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHRoZSBjYW1lcmEgdHJhY2sgYSBzcGVjaWZpYyBlbnRpdHlcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjdHJhY2tlZEVudGl0eVxuICAgKiBAcGFyYW0gY2VzaXVtRW50aXR5IC0gY2VzaXVtIGVudGl0eSggYmlsbGJvYXJkLCBwb2x5Z29uLi4uKSB0byB0cmFja1xuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHRyYWNrIGVudGl0eSBvcHRpb25zXG4gICAqL1xuICB0cmFja0VudGl0eShcbiAgICBjZXNpdW1FbnRpdHk/OiBhbnksXG4gICAgb3B0aW9ucz86IHsgZmx5VG86IGJvb2xlYW47IGZseVRvRHVyYXRpb24/OiBudW1iZXI7IGFsdGl0dWRlPzogbnVtYmVyIH1cbiAgKSB7XG4gICAgY29uc3QgZmx5VG8gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvKSB8fCBmYWxzZTtcblxuICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGZseVRvKSB7XG4gICAgICAgIGNvbnN0IGZseVRvRHVyYXRpb24gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvRHVyYXRpb24pIHx8IDE7XG4gICAgICAgIGNvbnN0IGFsdGl0dWRlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hbHRpdHVkZSkgfHwgMTAwMDA7XG5cbiAgICAgICAgLy8gQ2FsYyBlbnRpdHkgZmx5VG8gcG9zaXRpb24gYW5kIHdhbnRlZCBhbHRpdHVkZVxuICAgICAgICBjb25zdCBlbnRQb3NDYXIzID0gY2VzaXVtRW50aXR5LnBvc2l0aW9uLmdldFZhbHVlKENlc2l1bS5KdWxpYW5EYXRlLm5vdygpKTtcbiAgICAgICAgY29uc3QgZW50UG9zQ2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihlbnRQb3NDYXIzKTtcbiAgICAgICAgY29uc3Qgem9vbUFtb3VudCA9IGFsdGl0dWRlIC0gZW50UG9zQ2FydC5oZWlnaHQ7XG4gICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0ID0gYWx0aXR1ZGU7XG4gICAgICAgIGNvbnN0IGZseVRvUG9zaXRpb24gPSBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxvbmdpdHVkZSxcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxhdGl0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYW1lcmFGbHlUbyh7XG4gICAgICAgICAgZHVyYXRpb246IGZseVRvRHVyYXRpb24sXG4gICAgICAgICAgZGVzdGluYXRpb246IGZseVRvUG9zaXRpb24sXG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBjZXNpdW1FbnRpdHk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHpvb21BbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEuem9vbU91dCh6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tSW4oem9vbUFtb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gY2VzaXVtRW50aXR5O1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnRyYWNrRW50aXR5KCkge1xuICAgIHRoaXMudHJhY2tFbnRpdHkoKTtcbiAgfVxufVxuIl19