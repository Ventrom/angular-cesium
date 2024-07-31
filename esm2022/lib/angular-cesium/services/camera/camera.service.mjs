import { Injectable } from '@angular/core';
import { SceneMode } from '../../models/scene-mode.enum';
import * as i0 from "@angular/core";
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
export class CameraService {
    static { this.PERFORMANCE_2D_ALTITUDE = 25000000; }
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
                        destination: Cesium.Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CameraService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CameraService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CameraService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7QUFFekQ7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxhQUFhO2FBQ2pCLDRCQUF1QixHQUFHLFFBQVEsQUFBWCxDQUFZO0lBWTFDO1FBRlEsNkJBQXdCLEdBQUcsS0FBSyxDQUFDO0lBR3pDLENBQUM7SUFFRCxJQUFJLENBQUMsYUFBNEI7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUM7UUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxZQUFZLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsVUFBVSxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsQ0FBQztJQUM5RCxDQUFDO0lBRUQsdUJBQXVCLENBQUMsUUFBa0I7UUFDeEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGdCQUFn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ZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xuXG4vKipcbiAqICBUaGUgc2VydmljZSBleHBvc2VzIHRoZSBzY2VuZSdzIGNhbWVyYSBhbmQgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXG4gKiAgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQgLSAgaXMgYSAzRCBzY2VuZSBtb2RlIHRoYXQgYWN0cyBsaWtlIENlc2l1bSAyRCBtb2RlLFxuICogIGJ1dCBpcyBtb3JlIGVmZmljaWVudCBwZXJmb3JtYW5jZSB3aXNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FtZXJhU2VydmljZSB7XG4gIHN0YXRpYyBQRVJGT1JNQU5DRV8yRF9BTFRJVFVERSA9IDI1MDAwMDAwO1xuXG4gIHByaXZhdGUgdmlld2VyOiBhbnk7XG4gIHByaXZhdGUgc2NlbmU6IGFueTtcbiAgcHJpdmF0ZSBjYW1lcmE6IGFueTtcbiAgcHJpdmF0ZSBzY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXI6IGFueTtcbiAgcHJpdmF0ZSBtb3JwaExpc3RlbmVyQ2FuY2VsRm46IGFueTtcbiAgcHJpdmF0ZSBsYXN0Um90YXRlOiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RUaWx0OiBib29sZWFuO1xuICBwcml2YXRlIGxhc3RMb29rOiBib29sZWFuO1xuICBwcml2YXRlIGlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3ZXIgPSBjZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICAgIHRoaXMuc2NlbmUgPSBjZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgICB0aGlzLmNhbWVyYSA9IHRoaXMuc2NlbmUuY2FtZXJhO1xuICAgIHRoaXMubGFzdFJvdGF0ZSA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZTtcbiAgICB0aGlzLmxhc3RUaWx0ID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdDtcbiAgICB0aGlzLmxhc3RMb29rID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vaztcbiAgfVxuXG4gIF9saXN0ZW5Ub1NjZW5lTW9kZU1vcnBoKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuID0gdGhpcy5zY2VuZS5tb3JwaFN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICBfcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpIHtcbiAgICB0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IGZhbHNlO1xuICAgIHRoaXMuZW5hYmxlVGlsdCh0aGlzLmxhc3RUaWx0KTtcbiAgICB0aGlzLmVuYWJsZVJvdGF0ZSh0aGlzLmxhc3RSb3RhdGUpO1xuICAgIHRoaXMuZW5hYmxlTG9vayh0aGlzLmxhc3RMb29rKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIGNhbWVyYVxuICAgKi9cbiAgZ2V0Q2FtZXJhKCkge1xuICAgIHJldHVybiB0aGlzLmNhbWVyYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIHNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlclxuICAgKi9cbiAgZ2V0U2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqL1xuICBnZXRNaW5pbXVtWm9vbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5taW5pbXVtWm9vbURpc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XG4gICAqL1xuICBzZXRNaW5pbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1pbmltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWF4aW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xuICAgKi9cbiAgZ2V0TWF4aW11bVpvb20oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWF4aW11bVpvb21EaXN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXG4gICAqIEBwYXJhbSB6b29tIGFtb3VudFxuICAgKi9cbiAgc2V0TWF4aW11bVpvb20oYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5tYXhpbXVtWm9vbURpc3RhbmNlID0gYW1vdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRpbHRcbiAgICovXG4gIGVuYWJsZVRpbHQodGlsdDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSB0aWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHJvdGF0ZVxuICAgKi9cbiAgZW5hYmxlUm90YXRlKHJvdGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZSA9IHJvdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byBmcmVlLWxvb2tcbiAgICovXG4gIGVuYWJsZUxvb2sobG9jazogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBsb2NrO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHRyYW5zbGF0ZVxuICAgKi9cbiAgZW5hYmxlVHJhbnNsYXRlKHRyYW5zbGF0ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRyYW5zbGF0ZSA9IHRyYW5zbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB6b29tXG4gICAqL1xuICBlbmFibGVab29tKHpvb206IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVab29tID0gem9vbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgcmVjZWl2ZXMgaW5wdXRzXG4gICAqL1xuICBlbmFibGVJbnB1dHMoaW5wdXRzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlSW5wdXRzID0gaW5wdXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1hcCdzIFNjZW5lTW9kZVxuICAgKiBAcGFyYW0gc2NlbmVNb2RlIC0gVGhlIFNjZW5lTW9kZSB0byBtb3JwaCB0aGUgc2NlbmUgaW50by5cbiAgICogQHBhcmFtIGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHNjZW5lIG1vcnBoIGFuaW1hdGlvbnMsIGluIHNlY29uZHNcbiAgICovXG4gIHNldFNjZW5lTW9kZShzY2VuZU1vZGU6IFNjZW5lTW9kZSwgZHVyYXRpb24/OiBudW1iZXIpIHtcbiAgICBzd2l0Y2ggKHNjZW5lTW9kZSkge1xuICAgICAgY2FzZSBTY2VuZU1vZGUuU0NFTkUzRDoge1xuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcbiAgICAgICAgICB0aGlzLl9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8zRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5DT0xVTUJVU19WSUVXOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUb0NvbHVtYnVzVmlldyhkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5TQ0VORTJEOiB7XG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8yRChkdXJhdGlvbik7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFNjZW5lTW9kZS5QRVJGT1JNQU5DRV9TQ0VORTJEOiB7XG4gICAgICAgIHRoaXMuaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0TG9vayA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2s7XG4gICAgICAgIHRoaXMubGFzdFRpbHQgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0O1xuICAgICAgICB0aGlzLmxhc3RSb3RhdGUgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGU7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2sgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuKSB7XG4gICAgICAgICAgdGhpcy5tb3JwaExpc3RlbmVyQ2FuY2VsRm4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG9Db2x1bWJ1c1ZpZXcoZHVyYXRpb24pO1xuICAgICAgICBjb25zdCBtb3JwaENvbXBsZXRlRXZlbnRMaXN0ZW5lciA9IHRoaXMuc2NlbmUubW9ycGhDb21wbGV0ZS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLnNldFZpZXcoe1xuICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbURlZ3JlZXMoXG4gICAgICAgICAgICAgICAgMC4wLFxuICAgICAgICAgICAgICAgIDAuMCxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICAgIENhbWVyYVNlcnZpY2UuUEVSRk9STUFOQ0VfMkRfQUxUSVRVREUsXG4gICAgICAgICAgICAgICAgICB0aGlzLmdldE1heGltdW1ab29tKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgcGl0Y2g6IENlc2l1bS5NYXRoLnRvUmFkaWFucygtOTApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbW9ycGhDb21wbGV0ZUV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoXG4gICAgICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMuYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbSNmbHlUb1xuICAgKi9cbiAgY2FtZXJhRmx5VG8ob3B0aW9uczogYW55KSB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbWVyYS5mbHlUbyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciNmbHlUb1xuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XG4gICAqL1xuICBmbHlUbyh0YXJnZXQ6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIHJldHVybiB0aGlzLnZpZXdlci5mbHlUbyh0YXJnZXQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21zIGFtb3VudCBhbG9uZyB0aGUgY2FtZXJhJ3MgdmlldyB2ZWN0b3IuXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbUluXG4gICAqL1xuICB6b29tSW4oYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbUluKGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21PdXRcbiAgICovXG4gIHpvb21PdXQoYW1vdW50OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuem9vbU91dChhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb20gdGhlIGNhbWVyYSB0byBhIHRhcmdldFxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciN6b29tVG9cbiAgICogQHJldHVybnMgUHJvbWlzZTxib29sZWFuPlxuICAgKi9cbiAgem9vbVRvKHRhcmdldDogYW55LCBvZmZzZXQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3ZXIuem9vbVRvKHRhcmdldCwgb2Zmc2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgZGVzdGluYXRpb25cbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW1lcmEjc2V0Vmlld1xuICAgKiBAcGFyYW0gb3B0aW9ucyB2aWV3ZXIgb3B0aW9uc1xuICAgKi9cbiAgc2V0VmlldyhvcHRpb25zOiBhbnkpIHtcbiAgICB0aGlzLmNhbWVyYS5zZXRWaWV3KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjYW1lcmEncyByb3RhdGlvblxuICAgKi9cbiAgc2V0Um90YXRpb24oZGVncmVlc0luUmFkaWFuczogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXRWaWV3KHtvcmllbnRhdGlvbjoge2hlYWRpbmc6IGRlZ3JlZXNJblJhZGlhbnN9fSk7XG4gIH1cblxuICAvKipcbiAgICogTG9ja3Mgb3IgdW5sb2NrcyBjYW1lcmEgcm90YXRpb25cbiAgICovXG4gIGxvY2tSb3RhdGlvbihsb2NrOiBib29sZWFuKSB7XG4gICAgdGhpcy5zY2VuZS5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gIWxvY2s7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSB0aGUgY2FtZXJhIHRyYWNrIGEgc3BlY2lmaWMgZW50aXR5XG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VyI3RyYWNrZWRFbnRpdHlcbiAgICogQHBhcmFtIGNlc2l1bUVudGl0eSAtIGNlc2l1bSBlbnRpdHkoIGJpbGxib2FyZCwgcG9seWdvbi4uLikgdG8gdHJhY2tcbiAgICogQHBhcmFtIG9wdGlvbnMgLSB0cmFjayBlbnRpdHkgb3B0aW9uc1xuICAgKi9cbiAgdHJhY2tFbnRpdHkoXG4gICAgY2VzaXVtRW50aXR5PzogYW55LFxuICAgIG9wdGlvbnM/OiB7IGZseVRvOiBib29sZWFuOyBmbHlUb0R1cmF0aW9uPzogbnVtYmVyOyBhbHRpdHVkZT86IG51bWJlciB9XG4gICkge1xuICAgIGNvbnN0IGZseVRvID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5mbHlUbykgfHwgZmFsc2U7XG5cbiAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPihyZXNvbHZlID0+IHtcbiAgICAgIGlmIChmbHlUbykge1xuICAgICAgICBjb25zdCBmbHlUb0R1cmF0aW9uID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5mbHlUb0R1cmF0aW9uKSB8fCAxO1xuICAgICAgICBjb25zdCBhbHRpdHVkZSA9IChvcHRpb25zICYmIG9wdGlvbnMuYWx0aXR1ZGUpIHx8IDEwMDAwO1xuXG4gICAgICAgIC8vIENhbGMgZW50aXR5IGZseVRvIHBvc2l0aW9uIGFuZCB3YW50ZWQgYWx0aXR1ZGVcbiAgICAgICAgY29uc3QgZW50UG9zQ2FyMyA9IGNlc2l1bUVudGl0eS5wb3NpdGlvbi5nZXRWYWx1ZShDZXNpdW0uSnVsaWFuRGF0ZS5ub3coKSk7XG4gICAgICAgIGNvbnN0IGVudFBvc0NhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oZW50UG9zQ2FyMyk7XG4gICAgICAgIGNvbnN0IHpvb21BbW91bnQgPSBhbHRpdHVkZSAtIGVudFBvc0NhcnQuaGVpZ2h0O1xuICAgICAgICBlbnRQb3NDYXJ0LmhlaWdodCA9IGFsdGl0dWRlO1xuICAgICAgICBjb25zdCBmbHlUb1Bvc2l0aW9uID0gQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoXG4gICAgICAgICAgZW50UG9zQ2FydC5sb25naXR1ZGUsXG4gICAgICAgICAgZW50UG9zQ2FydC5sYXRpdHVkZSxcbiAgICAgICAgICBlbnRQb3NDYXJ0LmhlaWdodFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY2FtZXJhRmx5VG8oe1xuICAgICAgICAgIGR1cmF0aW9uOiBmbHlUb0R1cmF0aW9uLFxuICAgICAgICAgIGRlc3RpbmF0aW9uOiBmbHlUb1Bvc2l0aW9uLFxuICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gY2VzaXVtRW50aXR5O1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh6b29tQW1vdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLnpvb21PdXQoem9vbUFtb3VudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEuem9vbUluKHpvb21BbW91bnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IGNlc2l1bUVudGl0eTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdW50cmFja0VudGl0eSgpIHtcbiAgICB0aGlzLnRyYWNrRW50aXR5KCk7XG4gIH1cbn1cbiJdfQ==