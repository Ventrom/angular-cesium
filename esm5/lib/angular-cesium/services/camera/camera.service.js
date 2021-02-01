import { __decorate, __metadata } from "tslib";
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
    CameraService_1 = CameraService;
    CameraService.prototype.init = function (cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    };
    CameraService.prototype._listenToSceneModeMorph = function (callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    };
    CameraService.prototype._revertCameraProperties = function () {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    };
    /**
     * Gets the scene's camera
     */
    CameraService.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Gets the scene's screenSpaceCameraController
     */
    CameraService.prototype.getScreenSpaceCameraController = function () {
        return this.screenSpaceCameraController;
    };
    /**
     * Gets the minimum zoom value in meters
     */
    CameraService.prototype.getMinimumZoom = function () {
        return this.screenSpaceCameraController.minimumZoomDistance;
    };
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    CameraService.prototype.setMinimumZoom = function (amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    };
    /**
     * Gets the maximum zoom value in meters
     */
    CameraService.prototype.getMaximumZoom = function () {
        return this.screenSpaceCameraController.maximumZoomDistance;
    };
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    CameraService.prototype.setMaximumZoom = function (amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    };
    /**
     * Sets if the camera is able to tilt
     */
    CameraService.prototype.enableTilt = function (tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    };
    /**
     * Sets if the camera is able to rotate
     */
    CameraService.prototype.enableRotate = function (rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    };
    /**
     * Sets if the camera is able to free-look
     */
    CameraService.prototype.enableLook = function (lock) {
        this.screenSpaceCameraController.enableLook = lock;
    };
    /**
     * Sets if the camera is able to translate
     */
    CameraService.prototype.enableTranslate = function (translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    };
    /**
     * Sets if the camera is able to zoom
     */
    CameraService.prototype.enableZoom = function (zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    };
    /**
     * Sets if the camera receives inputs
     */
    CameraService.prototype.enableInputs = function (inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    };
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    CameraService.prototype.setSceneMode = function (sceneMode, duration) {
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
                var morphCompleteEventListener_1 = this.scene.morphComplete.addEventListener(function () {
                    _this.camera.setView({
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService_1.PERFORMANCE_2D_ALTITUDE, _this.getMaximumZoom())),
                        orientation: {
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener_1();
                    _this._listenToSceneModeMorph(_this._revertCameraProperties.bind(_this));
                });
                break;
            }
        }
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    CameraService.prototype.cameraFlyTo = function (options) {
        if (options) {
            return this.camera.flyTo(options);
        }
    };
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    CameraService.prototype.flyTo = function (target, options) {
        return this.viewer.flyTo(target, options);
    };
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    CameraService.prototype.zoomIn = function (amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    CameraService.prototype.zoomOut = function (amount) {
        return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
    };
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    CameraService.prototype.zoomTo = function (target, offset) {
        return this.viewer.zoomTo(target, offset);
    };
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    CameraService.prototype.setView = function (options) {
        this.camera.setView(options);
    };
    /**
     * Set camera's rotation
     */
    CameraService.prototype.setRotation = function (degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    };
    /**
     * Locks or unlocks camera rotation
     */
    CameraService.prototype.lockRotation = function (lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    };
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    CameraService.prototype.trackEntity = function (cesiumEntity, options) {
        var _this = this;
        var flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise(function (resolve) {
            if (flyTo) {
                var flyToDuration = (options && options.flyToDuration) || 1;
                var altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                var entPosCar3 = cesiumEntity.position.getValue(Cesium.JulianDate.now());
                var entPosCart = Cesium.Cartographic.fromCartesian(entPosCar3);
                var zoomAmount_1 = altitude - entPosCart.height;
                entPosCart.height = altitude;
                var flyToPosition = Cesium.Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                _this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: function () {
                        _this.viewer.trackedEntity = cesiumEntity;
                        setTimeout(function () {
                            if (zoomAmount_1 > 0) {
                                _this.camera.zoomOut(zoomAmount_1);
                            }
                            else {
                                _this.camera.zoomIn(zoomAmount_1);
                            }
                        }, 0);
                        resolve();
                    }
                });
            }
            else {
                _this.viewer.trackedEntity = cesiumEntity;
                resolve();
            }
        });
    };
    CameraService.prototype.untrackEntity = function () {
        this.trackEntity();
    };
    var CameraService_1;
    CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
    CameraService = CameraService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CameraService);
    return CameraService;
}());
export { CameraService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXpEOzs7O0dBSUc7QUFFSDtJQWFFO1FBRlEsNkJBQXdCLEdBQUcsS0FBSyxDQUFDO0lBR3pDLENBQUM7c0JBZFUsYUFBYTtJQWdCeEIsNEJBQUksR0FBSixVQUFLLGFBQTRCO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDO1FBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7SUFDOUQsQ0FBQztJQUVELCtDQUF1QixHQUF2QixVQUF3QixRQUFrQjtRQUN4QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQ2pFLFFBQVEsQ0FDVCxDQUFDO0lBQ0osQ0FBQztJQUVELCtDQUF1QixHQUF2QjtR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dGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5cbi8qKlxuICogIFRoZSBzZXJ2aWNlIGV4cG9zZXMgdGhlIHNjZW5lJ3MgY2FtZXJhIGFuZCBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXJcbiAqICBTY2VuZU1vZGUuUEVSRk9STUFOQ0VfU0NFTkUyRCAtICBpcyBhIDNEIHNjZW5lIG1vZGUgdGhhdCBhY3RzIGxpa2UgQ2VzaXVtIDJEIG1vZGUsXG4gKiAgYnV0IGlzIG1vcmUgZWZmaWNpZW50IHBlcmZvcm1hbmNlIHdpc2UuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYW1lcmFTZXJ2aWNlIHtcbiAgc3RhdGljIFBFUkZPUk1BTkNFXzJEX0FMVElUVURFID0gMjUwMDAwMDA7XG5cbiAgcHJpdmF0ZSB2aWV3ZXI6IGFueTtcbiAgcHJpdmF0ZSBzY2VuZTogYW55O1xuICBwcml2YXRlIGNhbWVyYTogYW55O1xuICBwcml2YXRlIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjogYW55O1xuICBwcml2YXRlIG1vcnBoTGlzdGVuZXJDYW5jZWxGbjogYW55O1xuICBwcml2YXRlIGxhc3RSb3RhdGU6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdFRpbHQ6IGJvb2xlYW47XG4gIHByaXZhdGUgbGFzdExvb2s6IGJvb2xlYW47XG4gIHByaXZhdGUgaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBpbml0KGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdlciA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XG4gICAgdGhpcy5zY2VuZSA9IGNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKTtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlciA9IHRoaXMuc2NlbmUuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG4gICAgdGhpcy5sYXN0Um90YXRlID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlO1xuICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgIHRoaXMubGFzdExvb2sgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rO1xuICB9XG5cbiAgX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4gPSB0aGlzLnNjZW5lLm1vcnBoU3RhcnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxuXG4gIF9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCkge1xuICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XG4gICAgdGhpcy5lbmFibGVUaWx0KHRoaXMubGFzdFRpbHQpO1xuICAgIHRoaXMuZW5hYmxlUm90YXRlKHRoaXMubGFzdFJvdGF0ZSk7XG4gICAgdGhpcy5lbmFibGVMb29rKHRoaXMubGFzdExvb2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3MgY2FtZXJhXG4gICAqL1xuICBnZXRDYW1lcmEoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHNjZW5lJ3Mgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gICAqL1xuICBnZXRTY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICovXG4gIGdldE1pbmltdW1ab29tKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWluaW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKiBAcGFyYW0gem9vbSBhbW91bnRcbiAgICovXG4gIHNldE1pbmltdW1ab29tKGFtb3VudDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZSA9IGFtb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNYXhpbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1heGltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNYXhpbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdGlsdFxuICAgKi9cbiAgZW5hYmxlVGlsdCh0aWx0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IHRpbHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gcm90YXRlXG4gICAqL1xuICBlbmFibGVSb3RhdGUocm90YXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gcm90YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIGZyZWUtbG9va1xuICAgKi9cbiAgZW5hYmxlTG9vayhsb2NrOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGxvY2s7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0aGUgY2FtZXJhIGlzIGFibGUgdG8gdHJhbnNsYXRlXG4gICAqL1xuICBlbmFibGVUcmFuc2xhdGUodHJhbnNsYXRlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVHJhbnNsYXRlID0gdHJhbnNsYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHpvb21cbiAgICovXG4gIGVuYWJsZVpvb20oem9vbTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVpvb20gPSB6b29tO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSByZWNlaXZlcyBpbnB1dHNcbiAgICovXG4gIGVuYWJsZUlucHV0cyhpbnB1dHM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVJbnB1dHMgPSBpbnB1dHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWFwJ3MgU2NlbmVNb2RlXG4gICAqIEBwYXJhbSBzY2VuZU1vZGUgLSBUaGUgU2NlbmVNb2RlIHRvIG1vcnBoIHRoZSBzY2VuZSBpbnRvLlxuICAgKiBAcGFyYW0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2Ygc2NlbmUgbW9ycGggYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xuICAgKi9cbiAgc2V0U2NlbmVNb2RlKHNjZW5lTW9kZTogU2NlbmVNb2RlLCBkdXJhdGlvbj86IG51bWJlcikge1xuICAgIHN3aXRjaCAoc2NlbmVNb2RlKSB7XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTNEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzNEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLkNPTFVNQlVTX1ZJRVc6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvQ29sdW1idXNWaWV3KGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlNDRU5FMkQ6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEKSB7XG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzJEKGR1cmF0aW9uKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQ6IHtcbiAgICAgICAgdGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgICAgICAgdGhpcy5sYXN0VGlsdCA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQ7XG4gICAgICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4pIHtcbiAgICAgICAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG4gICAgICAgIGNvbnN0IG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyID0gdGhpcy5zY2VuZS5tb3JwaENvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYW1lcmEuc2V0Vmlldyh7XG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tRGVncmVlcyhcbiAgICAgICAgICAgICAgICAwLjAsXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIE1hdGgubWluKFxuICAgICAgICAgICAgICAgICAgQ2FtZXJhU2VydmljZS5QRVJGT1JNQU5DRV8yRF9BTFRJVFVERSxcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWF4aW11bVpvb20oKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcbiAgICAgICAgICAgICAgICBwaXRjaDogQ2VzaXVtLk1hdGgudG9SYWRpYW5zKC05MClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuVG9TY2VuZU1vZGVNb3JwaChcbiAgICAgICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcy5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIGRlc3RpbmF0aW9uXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBjYW1lcmFGbHlUbyhvcHRpb25zOiBhbnkpIHtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuY2FtZXJhLmZseVRvKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI2ZseVRvXG4gICAqIEByZXR1cm5zIFByb21pc2U8Ym9vbGVhbj5cbiAgICovXG4gIGZseVRvKHRhcmdldDogYW55LCBvcHRpb25zPzogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMudmlld2VyLmZseVRvKHRhcmdldCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBjYW1lcmEncyB2aWV3IHZlY3Rvci5cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbCN6b29tSW5cbiAgICovXG4gIHpvb21JbihhbW91bnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYS56b29tSW4oYW1vdW50IHx8IHRoaXMuY2FtZXJhLmRlZmF1bHRab29tQW1vdW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBab29tcyBhbW91bnQgYWxvbmcgdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiB0aGUgY2FtZXJhJ3MgdmlldyB2ZWN0b3IuXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbU91dFxuICAgKi9cbiAgem9vbU91dChhbW91bnQ6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYS56b29tT3V0KGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbSB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3pvb21Ub1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICB6b29tVG8odGFyZ2V0OiBhbnksIG9mZnNldD86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci56b29tVG8odGFyZ2V0LCBvZmZzZXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbWVyYSNzZXRWaWV3XG4gICAqIEBwYXJhbSBvcHRpb25zIHZpZXdlciBvcHRpb25zXG4gICAqL1xuICBzZXRWaWV3KG9wdGlvbnM6IGFueSkge1xuICAgIHRoaXMuY2FtZXJhLnNldFZpZXcob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGNhbWVyYSdzIHJvdGF0aW9uXG4gICAqL1xuICBzZXRSb3RhdGlvbihkZWdyZWVzSW5SYWRpYW5zOiBudW1iZXIpIHtcbiAgICB0aGlzLnNldFZpZXcoe29yaWVudGF0aW9uOiB7aGVhZGluZzogZGVncmVlc0luUmFkaWFuc319KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrcyBvciB1bmxvY2tzIGNhbWVyYSByb3RhdGlvblxuICAgKi9cbiAgbG9ja1JvdGF0aW9uKGxvY2s6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSAhbG9jaztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHRoZSBjYW1lcmEgdHJhY2sgYSBzcGVjaWZpYyBlbnRpdHlcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjdHJhY2tlZEVudGl0eVxuICAgKiBAcGFyYW0gY2VzaXVtRW50aXR5IC0gY2VzaXVtIGVudGl0eSggYmlsbGJvYXJkLCBwb2x5Z29uLi4uKSB0byB0cmFja1xuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHRyYWNrIGVudGl0eSBvcHRpb25zXG4gICAqL1xuICB0cmFja0VudGl0eShcbiAgICBjZXNpdW1FbnRpdHk/OiBhbnksXG4gICAgb3B0aW9ucz86IHsgZmx5VG86IGJvb2xlYW47IGZseVRvRHVyYXRpb24/OiBudW1iZXI7IGFsdGl0dWRlPzogbnVtYmVyIH1cbiAgKSB7XG4gICAgY29uc3QgZmx5VG8gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvKSB8fCBmYWxzZTtcblxuICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGZseVRvKSB7XG4gICAgICAgIGNvbnN0IGZseVRvRHVyYXRpb24gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvRHVyYXRpb24pIHx8IDE7XG4gICAgICAgIGNvbnN0IGFsdGl0dWRlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hbHRpdHVkZSkgfHwgMTAwMDA7XG5cbiAgICAgICAgLy8gQ2FsYyBlbnRpdHkgZmx5VG8gcG9zaXRpb24gYW5kIHdhbnRlZCBhbHRpdHVkZVxuICAgICAgICBjb25zdCBlbnRQb3NDYXIzID0gY2VzaXVtRW50aXR5LnBvc2l0aW9uLmdldFZhbHVlKENlc2l1bS5KdWxpYW5EYXRlLm5vdygpKTtcbiAgICAgICAgY29uc3QgZW50UG9zQ2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihlbnRQb3NDYXIzKTtcbiAgICAgICAgY29uc3Qgem9vbUFtb3VudCA9IGFsdGl0dWRlIC0gZW50UG9zQ2FydC5oZWlnaHQ7XG4gICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0ID0gYWx0aXR1ZGU7XG4gICAgICAgIGNvbnN0IGZseVRvUG9zaXRpb24gPSBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxvbmdpdHVkZSxcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxhdGl0dWRlLFxuICAgICAgICAgIGVudFBvc0NhcnQuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jYW1lcmFGbHlUbyh7XG4gICAgICAgICAgZHVyYXRpb246IGZseVRvRHVyYXRpb24sXG4gICAgICAgICAgZGVzdGluYXRpb246IGZseVRvUG9zaXRpb24sXG4gICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyLnRyYWNrZWRFbnRpdHkgPSBjZXNpdW1FbnRpdHk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHpvb21BbW91bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEuem9vbU91dCh6b29tQW1vdW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYS56b29tSW4oem9vbUFtb3VudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gY2VzaXVtRW50aXR5O1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnRyYWNrRW50aXR5KCkge1xuICAgIHRoaXMudHJhY2tFbnRpdHkoKTtcbiAgfVxufVxuIl19