import { __decorate, __metadata, __param } from "tslib";
import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
let CesiumService = class CesiumService {
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    init(mapContainer, map) {
        this.map = map;
        this.ngZone.runOutsideAngular(() => {
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        });
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas() {
        return this.cesiumViewer.canvas;
    }
    getMap() {
        return this.map;
    }
};
CesiumService.ctorParameters = () => [
    { type: NgZone },
    { type: ViewerFactory },
    { type: ViewerConfiguration, decorators: [{ type: Optional }] }
];
CesiumService = __decorate([
    Injectable(),
    __param(2, Optional()),
    __metadata("design:paramtypes", [NgZone, ViewerFactory, ViewerConfiguration])
], CesiumService);
export { CesiumService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFHM0Y7O0dBRUc7QUFFSCxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBSXhCLFlBQW9CLE1BQWMsRUFBVSxhQUE0QixFQUFzQixtQkFBd0M7UUFBbEgsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQXNCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFDdEksQ0FBQztJQUVELElBQUksQ0FBQyxZQUF5QixFQUFFLEdBQW1CO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTNFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNwRyxJQUFJLE9BQU8sY0FBYyxLQUFLLFVBQVUsRUFBRTtnQkFDeEMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQTJCLENBQUM7SUFDdkQsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUE7O1lBM0M2QixNQUFNO1lBQXlCLGFBQWE7WUFBMkMsbUJBQW1CLHVCQUEzRCxRQUFROztBQUp4RSxhQUFhO0lBRHpCLFVBQVUsRUFBRTtJQUtnRSxXQUFBLFFBQVEsRUFBRSxDQUFBO3FDQUF6RCxNQUFNLEVBQXlCLGFBQWEsRUFBMkMsbUJBQW1CO0dBSjNILGFBQWEsQ0ErQ3pCO1NBL0NZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3ZXJGYWN0b3J5IH0gZnJvbSAnLi4vdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZSc7XG5pbXBvcnQgeyBWaWV3ZXJDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vdmlld2VyLWNvbmZpZ3VyYXRpb24vdmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG4vKipcbiAqICBTZXJ2aWNlIHRoYXQgaW5pdGlhbGl6ZSBjZXNpdW0gdmlld2VyIGFuZCBleHBvc2UgY2VzaXVtIHZpZXdlciBhbmQgc2NlbmUuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1TZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjZXNpdW1WaWV3ZXI6IGFueTtcbiAgcHJpdmF0ZSBtYXA6IEFjTWFwQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgdmlld2VyRmFjdG9yeTogVmlld2VyRmFjdG9yeSwgQE9wdGlvbmFsKCkgcHJpdmF0ZSB2aWV3ZXJDb25maWd1cmF0aW9uOiBWaWV3ZXJDb25maWd1cmF0aW9uKSB7XG4gIH1cblxuICBpbml0KG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG1hcDogQWNNYXBDb21wb25lbnQpIHtcbiAgICB0aGlzLm1hcCA9IG1hcDtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uID8gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uLmdldE5leHRWaWV3ZXJPcHRpb25zKCkgOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmNlc2l1bVZpZXdlciA9IHRoaXMudmlld2VyRmFjdG9yeS5jcmVhdGVWaWV3ZXIobWFwQ29udGFpbmVyLCBvcHRpb25zKTtcblxuICAgICAgY29uc3Qgdmlld2VyTW9kaWZpZXIgPSB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24gJiYgdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uLmdldE5leHRWaWV3ZXJNb2RpZmllcigpO1xuICAgICAgaWYgKHR5cGVvZiB2aWV3ZXJNb2RpZmllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2aWV3ZXJNb2RpZmllcih0aGlzLmNlc2l1bVZpZXdlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlXG4gICAqIEByZXR1cm5zIGNlc2l1bVZpZXdlclxuICAgKi9cbiAgZ2V0Vmlld2VyKCkge1xuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vU2NlbmUuaHRtbD9jbGFzc0ZpbHRlcj1zY2VuZVxuICAgKiBAcmV0dXJucyBjZXNpdW0gc2NlbmVcbiAgICovXG4gIGdldFNjZW5lKCkge1xuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlci5zY2VuZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc19BUElcbiAgICogQHJldHVybnMgY2VzaXVtIGNhbnZhc1xuICAgKi9cbiAgZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXIuY2FudmFzIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICB9XG5cbiAgZ2V0TWFwKCk6IEFjTWFwQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5tYXA7XG4gIH1cbn1cbiJdfQ==