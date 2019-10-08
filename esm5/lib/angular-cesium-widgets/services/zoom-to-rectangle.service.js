/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
import { CameraService } from '../../angular-cesium/services/camera/camera.service';
import { CesiumService } from '../../angular-cesium/services/cesium/cesium.service';
/**
 * @record
 */
function ZoomData() { }
if (false) {
    /** @type {?} */
    ZoomData.prototype.container;
    /** @type {?|undefined} */
    ZoomData.prototype.borderElement;
    /** @type {?|undefined} */
    ZoomData.prototype.resetOnEscapePressFunc;
}
/**
 * The Service is as a "zoom to rectangle" tool
 *
 * example:
 * ```
 * constructor(
 *   private cameraService: CameraService,
 *   private cesiumService: CesiumService,
 *   private zoomToRectangleService: ZoomToRectangleService,
 * ) {
 *   this.zoomToRectangleService.init(cesiumService, cameraService);
 * }
 * ...
 * this.zoomToRectangleService.activate({onComplete: () => this.zoomToRectangleService.disable()});
 * ```
 *
 * `init()` - initialize the service with CameraService and CesiumService.
 * If no mapId is provided to activate() - must be called before calling `activate()`.
 *
 * `disable()` - disables the tool.
 *
 * `activate()` -
 * @param options
 * {
 *  onStart - optional - a callback that will be called when the user start drawing the rectangle
 *  onComplete - optional - a callback that will be called when the tool zoom in
 *  autoDisableOnZoom - optional - determines if the tool should auto disable after zoom - default: true
 *  animationDurationInSeconds - optional - zoom animation duration in seconds - default: 0.5
 *  borderStyle - optional - the style of the rectangle element border - default: '3px dashed #FFFFFF'
 *  backgroundColor - optional - the background color of the rectangle element - default: 'transparent'
 *  resetKeyCode - optional - the key code of the key that is used to reset the drawing of the rectangle - default: 27 (ESC key)
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */
var ZoomToRectangleService = /** @class */ (function () {
    function ZoomToRectangleService(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
        };
    }
    /**
     * @param {?} cesiumService
     * @param {?} cameraService
     * @return {?}
     */
    ZoomToRectangleService.prototype.init = /**
     * @param {?} cesiumService
     * @param {?} cameraService
     * @return {?}
     */
    function (cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    };
    /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    ZoomToRectangleService.prototype.activate = /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    function (options, mapId) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        /** @type {?} */
        var finalOptions = Object.assign({}, this.defaultOptions, options);
        /** @type {?} */
        var cameraService = this.cameraService;
        /** @type {?} */
        var mapContainer;
        /** @type {?} */
        var map;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
            map = this.cesiumService.getMap();
        }
        if (mapId) {
            map = this.mapsManager.getMap(mapId);
            if (!map) {
                throw new Error("Map not found with id: " + mapId);
            }
            cameraService = map.getCameraService();
            mapContainer = map.getCesiumViewer().container;
        }
        if (!cameraService || !mapContainer) {
            throw new Error("The function must receive a mapId if the service wasn't initialized");
        }
        this.disable(mapId);
        /** @type {?} */
        var container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        /** @type {?} */
        var mapZoomData = { container: container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        /** @type {?} */
        var mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        /** @type {?} */
        var borderElement;
        container.onmousedown = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                /** @type {?} */
                var rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                var offsetX = e.clientX - rect.left;
                /** @type {?} */
                var offsetY = e.clientY - rect.top;
                mouse.startX = offsetX;
                mouse.startY = offsetY;
                borderElement = document.createElement('div');
                borderElement.className = 'zoom-to-rectangle-border';
                borderElement.style.position = 'absolute';
                borderElement.style.border = finalOptions.borderStyle;
                borderElement.style.backgroundColor = finalOptions.backgroundColor;
                borderElement.style.left = mouse.startX + 'px';
                borderElement.style.top = mouse.startY + 'px';
                container.appendChild(borderElement);
                mapZoomData.borderElement = borderElement;
            }
        });
        container.onmouseup = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (borderElement) {
                /** @type {?} */
                var zoomApplied = _this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds);
                if (borderElement) {
                    borderElement.remove();
                    borderElement = undefined;
                    mapZoomData.borderElement = undefined;
                }
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
                if (!!finalOptions.onComplete) {
                    finalOptions.onComplete(map);
                }
                if (finalOptions.autoDisableOnZoom && zoomApplied) {
                    _this.disable(mapId);
                }
            }
        });
        container.onmousemove = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (borderElement) {
                /** @type {?} */
                var rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                var offsetX = e.clientX - rect.left;
                /** @type {?} */
                var offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        });
        /** @type {?} */
        var resetOnEscapePress = (/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (e.keyCode === finalOptions.resetKeyCode && borderElement) {
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
            }
        });
        document.addEventListener('keydown', resetOnEscapePress);
        mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
    };
    /**
     * @param {?=} mapId
     * @return {?}
     */
    ZoomToRectangleService.prototype.disable = /**
     * @param {?=} mapId
     * @return {?}
     */
    function (mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        /** @type {?} */
        var data = this.mapsZoomElements.get(mapId || this.cesiumService.getMap().getId());
        if (data) {
            data.container.remove();
            if (data.borderElement) {
                data.borderElement.remove();
            }
            if (data.resetOnEscapePressFunc) {
                document.removeEventListener('keydown', data.resetOnEscapePressFunc);
            }
        }
        this.mapsZoomElements.delete(mapId);
    };
    /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    ZoomToRectangleService.prototype.zoomCameraToRectangle = /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    function (cameraService, positions, animationDuration) {
        /** @type {?} */
        var camera = cameraService.getCamera();
        /** @type {?} */
        var cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        /** @type {?} */
        var cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        /** @type {?} */
        var cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        /** @type {?} */
        var cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            duration: animationDuration,
        });
        return true;
    };
    ZoomToRectangleService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ZoomToRectangleService.ctorParameters = function () { return [
        { type: MapsManagerService },
        { type: CameraService, decorators: [{ type: Optional }] },
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    return ZoomToRectangleService;
}());
export { ZoomToRectangleService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ZoomToRectangleService.prototype.cameraService;
    /**
     * @type {?}
     * @private
     */
    ZoomToRectangleService.prototype.cesiumService;
    /**
     * @type {?}
     * @private
     */
    ZoomToRectangleService.prototype.mapsZoomElements;
    /**
     * @type {?}
     * @private
     */
    ZoomToRectangleService.prototype.defaultOptions;
    /**
     * @type {?}
     * @private
     */
    ZoomToRectangleService.prototype.mapsManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvem9vbS10by1yZWN0YW5nbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDckcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxREFBcUQsQ0FBQzs7OztBQUdwRix1QkFJQzs7O0lBSEMsNkJBQXVCOztJQUN2QixpQ0FBNEI7O0lBQzVCLDBDQUE0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDOUQ7SUFFRSxnQ0FDVSxXQUErQixFQUMzQixhQUE0QixFQUM1QixhQUE0QjtRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFTakMscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFDL0MsbUJBQWMsR0FBRztZQUN2QiwwQkFBMEIsRUFBRSxHQUFHO1lBQy9CLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsZUFBZSxFQUFFLGlCQUFpQjtZQUNsQyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUM7SUFaRixDQUFDOzs7Ozs7SUFjRCxxQ0FBSTs7Ozs7SUFBSixVQUFLLGFBQTRCLEVBQUUsYUFBNEI7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDckMsQ0FBQzs7Ozs7O0lBRUQseUNBQVE7Ozs7O0lBQVIsVUFDRSxPQVFNLEVB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QUMsRUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FDekQ7WUFDRCxRQUFRLEVBQUUsaUJBQWlCO1NBQzVCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Z0JBck1GLFVBQVU7Ozs7Z0JBL0NGLGtCQUFrQjtnQkFDbEIsYUFBYSx1QkFrRGpCLFFBQVE7Z0JBakRKLGFBQWEsdUJBa0RqQixRQUFROztJQWlNYiw2QkFBQztDQUFBLEFBdE1ELElBc01DO1NBck1ZLHNCQUFzQjs7Ozs7O0lBUWpDLCtDQUFxQzs7Ozs7SUFDckMsK0NBQXFDOzs7OztJQUVyQyxrREFBdUQ7Ozs7O0lBQ3ZELGdEQU1FOzs7OztJQWhCQSw2Q0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG5pbnRlcmZhY2UgWm9vbURhdGEge1xuICBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBib3JkZXJFbGVtZW50PzogSFRNTEVsZW1lbnQ7XG4gIHJlc2V0T25Fc2NhcGVQcmVzc0Z1bmM/OiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xufVxuXG4vKipcbiAqIFRoZSBTZXJ2aWNlIGlzIGFzIGEgXCJ6b29tIHRvIHJlY3RhbmdsZVwiIHRvb2xcbiAqXG4gKiBleGFtcGxlOlxuICogYGBgXG4gKiBjb25zdHJ1Y3RvcihcbiAqICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICogICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gKiAgIHByaXZhdGUgem9vbVRvUmVjdGFuZ2xlU2VydmljZTogWm9vbVRvUmVjdGFuZ2xlU2VydmljZSxcbiAqICkge1xuICogICB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuaW5pdChjZXNpdW1TZXJ2aWNlLCBjYW1lcmFTZXJ2aWNlKTtcbiAqIH1cbiAqIC4uLlxuICogdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmFjdGl2YXRlKHtvbkNvbXBsZXRlOiAoKSA9PiB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuZGlzYWJsZSgpfSk7XG4gKiBgYGBcbiAqXG4gKiBgaW5pdCgpYCAtIGluaXRpYWxpemUgdGhlIHNlcnZpY2Ugd2l0aCBDYW1lcmFTZXJ2aWNlIGFuZCBDZXNpdW1TZXJ2aWNlLlxuICogSWYgbm8gbWFwSWQgaXMgcHJvdmlkZWQgdG8gYWN0aXZhdGUoKSAtIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBjYWxsaW5nIGBhY3RpdmF0ZSgpYC5cbiAqXG4gKiBgZGlzYWJsZSgpYCAtIGRpc2FibGVzIHRoZSB0b29sLlxuICpcbiAqIGBhY3RpdmF0ZSgpYCAtXG4gKiBAcGFyYW0gb3B0aW9uc1xuICoge1xuICogIG9uU3RhcnQgLSBvcHRpb25hbCAtIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0IGRyYXdpbmcgdGhlIHJlY3RhbmdsZVxuICogIG9uQ29tcGxldGUgLSBvcHRpb25hbCAtIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB0b29sIHpvb20gaW5cbiAqICBhdXRvRGlzYWJsZU9uWm9vbSAtIG9wdGlvbmFsIC0gZGV0ZXJtaW5lcyBpZiB0aGUgdG9vbCBzaG91bGQgYXV0byBkaXNhYmxlIGFmdGVyIHpvb20gLSBkZWZhdWx0OiB0cnVlXG4gKiAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHMgLSBvcHRpb25hbCAtIHpvb20gYW5pbWF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHMgLSBkZWZhdWx0OiAwLjVcbiAqICBib3JkZXJTdHlsZSAtIG9wdGlvbmFsIC0gdGhlIHN0eWxlIG9mIHRoZSByZWN0YW5nbGUgZWxlbWVudCBib3JkZXIgLSBkZWZhdWx0OiAnM3B4IGRhc2hlZCAjRkZGRkZGJ1xuICogIGJhY2tncm91bmRDb2xvciAtIG9wdGlvbmFsIC0gdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIHJlY3RhbmdsZSBlbGVtZW50IC0gZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xuICogIHJlc2V0S2V5Q29kZSAtIG9wdGlvbmFsIC0gdGhlIGtleSBjb2RlIG9mIHRoZSBrZXkgdGhhdCBpcyB1c2VkIHRvIHJlc2V0IHRoZSBkcmF3aW5nIG9mIHRoZSByZWN0YW5nbGUgLSBkZWZhdWx0OiAyNyAoRVNDIGtleSlcbiAqIH1cbiAqIEBwYXJhbSBtYXBJZCAtIG9wdGlvbmFsIC0gdGhlIG1hcElkIG9mIHRoZSBtYXAgdGhhdCB0aGUgdG9vbCB3aWxsIGJlIHVzZWQgaW4uXG4gKlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBab29tVG9SZWN0YW5nbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gIH1cblxuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZTtcblxuICBwcml2YXRlIG1hcHNab29tRWxlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgWm9vbURhdGE+KCk7XG4gIHByaXZhdGUgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHM6IDAuNSxcbiAgICByZXNldEtleUNvZGU6IDI3LFxuICAgIGJvcmRlclN0eWxlOiAnMnB4IHNvbGlkIHJnYmEoMCwwLDAsMC41KScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjIpJyxcbiAgICBhdXRvRGlzYWJsZU9uWm9vbTogdHJ1ZSxcbiAgfTtcblxuICBpbml0KGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UpIHtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuY2VzaXVtU2VydmljZSA9IGNlc2l1bVNlcnZpY2U7XG4gIH1cblxuICBhY3RpdmF0ZShcbiAgICBvcHRpb25zOiB7XG4gICAgICBvblN0YXJ0PzogKGFjTWFwPzogQWNNYXBDb21wb25lbnQpID0+IGFueTtcbiAgICAgIG9uQ29tcGxldGU/OiAoYWNNYXA/OiBBY01hcENvbXBvbmVudCkgPT4gYW55O1xuICAgICAgYXV0b0Rpc2FibGVPblpvb20/OiBib29sZWFuO1xuICAgICAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHM/OiBudW1iZXI7XG4gICAgICBib3JkZXJTdHlsZT86IHN0cmluZztcbiAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgICAgIHJlc2V0S2V5Q29kZT86IG51bWJlcjtcbiAgICB9ID0ge30sXG4gICAgbWFwSWQ/OiBzdHJpbmcsXG4gICkge1xuICAgIGlmICgoIXRoaXMuY2FtZXJhU2VydmljZSB8fCAhdGhpcy5jZXNpdW1TZXJ2aWNlKSAmJiAhbWFwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSBhIG1hcElkIGlmIHRoZSBzZXJ2aWNlIHdhc24ndCBpbml0aWFsaXplZGApO1xuICAgIH1cbiAgICBjb25zdCBmaW5hbE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICBsZXQgY2FtZXJhU2VydmljZSA9IHRoaXMuY2FtZXJhU2VydmljZTtcbiAgICBsZXQgbWFwQ29udGFpbmVyO1xuICAgIGxldCBtYXA7XG4gICAgaWYgKHRoaXMuY2VzaXVtU2VydmljZSkge1xuICAgICAgbWFwQ29udGFpbmVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNvbnRhaW5lcjtcbiAgICAgIG1hcCA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKTtcbiAgICB9XG4gICAgaWYgKG1hcElkKSB7XG4gICAgICBtYXAgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcChtYXBJZCk7XG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCBub3QgZm91bmQgd2l0aCBpZDogJHttYXBJZH1gKTtcbiAgICAgIH1cbiAgICAgIGNhbWVyYVNlcnZpY2UgPSBtYXAuZ2V0Q2FtZXJhU2VydmljZSgpO1xuICAgICAgbWFwQ29udGFpbmVyID0gbWFwLmdldENlc2l1bVZpZXdlcigpLmNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBpZiAoIWNhbWVyYVNlcnZpY2UgfHwgIW1hcENvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIGEgbWFwSWQgaWYgdGhlIHNlcnZpY2Ugd2Fzbid0IGluaXRpYWxpemVkYCk7XG4gICAgfVxuICAgIHRoaXMuZGlzYWJsZShtYXBJZCk7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWFwQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XG4gICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgbWFwQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgY29uc3QgbWFwWm9vbURhdGE6IFpvb21EYXRhID0ge2NvbnRhaW5lcn07XG4gICAgdGhpcy5tYXBzWm9vbUVsZW1lbnRzLnNldChtYXBJZCB8fCB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0SWQoKSwgbWFwWm9vbURhdGEpO1xuICAgIGxldCBtb3VzZSA9IHtcbiAgICAgIGVuZFg6IDAsXG4gICAgICBlbmRZOiAwLFxuICAgICAgc3RhcnRYOiAwLFxuICAgICAgc3RhcnRZOiAwLFxuICAgIH07XG4gICAgbGV0IGJvcmRlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGFpbmVyLm9ubW91c2Vkb3duID0gZSA9PiB7XG4gICAgICBpZiAoIWJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vblN0YXJ0KSB7XG4gICAgICAgICAgb3B0aW9ucy5vblN0YXJ0KG1hcCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWN0ID0gKGUuY3VycmVudFRhcmdldCBhcyBhbnkpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIG1vdXNlLnN0YXJ0WCA9IG9mZnNldFg7XG4gICAgICAgIG1vdXNlLnN0YXJ0WSA9IG9mZnNldFk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5jbGFzc05hbWUgPSAnem9vbS10by1yZWN0YW5nbGUtYm9yZGVyJztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuYm9yZGVyID0gZmluYWxPcHRpb25zLmJvcmRlclN0eWxlO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZpbmFsT3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUubGVmdCA9IG1vdXNlLnN0YXJ0WCArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gbW91c2Uuc3RhcnRZICsgJ3B4JztcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJvcmRlckVsZW1lbnQpO1xuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gYm9yZGVyRWxlbWVudDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyLm9ubW91c2V1cCA9IGUgPT4ge1xuICAgICAgaWYgKGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3Qgem9vbUFwcGxpZWQgPSB0aGlzLnpvb21DYW1lcmFUb1JlY3RhbmdsZShjYW1lcmFTZXJ2aWNlLCBtb3VzZSwgZmluYWxPcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzKTtcbiAgICAgICAgaWYgKGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgICBib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAgIGJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBtb3VzZSA9IHtcbiAgICAgICAgICBlbmRYOiAwLFxuICAgICAgICAgIGVuZFk6IDAsXG4gICAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICAgIHN0YXJ0WTogMCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEhZmluYWxPcHRpb25zLm9uQ29tcGxldGUpIHtcbiAgICAgICAgICBmaW5hbE9wdGlvbnMub25Db21wbGV0ZShtYXApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbE9wdGlvbnMuYXV0b0Rpc2FibGVPblpvb20gJiYgem9vbUFwcGxpZWQpIHtcbiAgICAgICAgICB0aGlzLmRpc2FibGUobWFwSWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGUgPT4ge1xuICAgICAgaWYgKGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICBtb3VzZS5lbmRYID0gb2Zmc2V0WDtcbiAgICAgICAgbW91c2UuZW5kWSA9IG9mZnNldFk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUud2lkdGggPSBNYXRoLmFicyhtb3VzZS5lbmRYIC0gbW91c2Uuc3RhcnRYKSArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5hYnMobW91c2UuZW5kWSAtIG1vdXNlLnN0YXJ0WSkgKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBNYXRoLm1pbihtb3VzZS5zdGFydFgsIG1vdXNlLmVuZFgpICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS50b3AgPSBNYXRoLm1pbihtb3VzZS5zdGFydFksIG1vdXNlLmVuZFkpICsgJ3B4JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVzZXRPbkVzY2FwZVByZXNzID0gZSA9PiB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSBmaW5hbE9wdGlvbnMucmVzZXRLZXlDb2RlICYmIGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbW91c2UgPSB7XG4gICAgICAgICAgZW5kWDogMCxcbiAgICAgICAgICBlbmRZOiAwLFxuICAgICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVzZXRPbkVzY2FwZVByZXNzKTtcbiAgICBtYXBab29tRGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jID0gcmVzZXRPbkVzY2FwZVByZXNzO1xuICB9XG5cbiAgZGlzYWJsZShtYXBJZD86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5jZXNpdW1TZXJ2aWNlICYmICFtYXBJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJZiB0aGUgc2VydmljZSB3YXMgbm90IGluaXRpYWxpemVkIHdpdGggQ2VzaXVtU2VydmljZSwgbWFwSWQgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gdGhpcy5tYXBzWm9vbUVsZW1lbnRzLmdldChtYXBJZCB8fCB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0SWQoKSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEuY29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgaWYgKGRhdGEuYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBkYXRhLmJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBkYXRhLnJlc2V0T25Fc2NhcGVQcmVzc0Z1bmMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1hcHNab29tRWxlbWVudHMuZGVsZXRlKG1hcElkKTtcbiAgfVxuXG4gIHByaXZhdGUgem9vbUNhbWVyYVRvUmVjdGFuZ2xlKFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcG9zaXRpb25zOiB7IGVuZFg6IG51bWJlcjsgZW5kWTogbnVtYmVyOyBzdGFydFg6IG51bWJlcjsgc3RhcnRZOiBudW1iZXIgfSxcbiAgICBhbmltYXRpb25EdXJhdGlvbixcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKTtcbiAgICBjb25zdCBjYXJ0ZXNpYW4xID0gY2FtZXJhLnBpY2tFbGxpcHNvaWQoe3g6IHBvc2l0aW9ucy5zdGFydFgsIHk6IHBvc2l0aW9ucy5zdGFydFl9KTtcbiAgICBjb25zdCBjYXJ0ZXNpYW4yID0gY2FtZXJhLnBpY2tFbGxpcHNvaWQoe3g6IHBvc2l0aW9ucy5lbmRYLCB5OiBwb3NpdGlvbnMuZW5kWX0pO1xuICAgIGlmICghY2FydGVzaWFuMSB8fCAhY2FydGVzaWFuMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjYXJ0b2dyYXBoaWMxID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjEpO1xuICAgIGNvbnN0IGNhcnRvZ3JhcGhpYzIgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuMik7XG4gICAgY2FtZXJhU2VydmljZS5jYW1lcmFGbHlUbyh7XG4gICAgICBkZXN0aW5hdGlvbjogbmV3IENlc2l1bS5SZWN0YW5nbGUoXG4gICAgICAgIE1hdGgubWluKGNhcnRvZ3JhcGhpYzEubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMyLmxvbmdpdHVkZSksXG4gICAgICAgIE1hdGgubWluKGNhcnRvZ3JhcGhpYzEubGF0aXR1ZGUsIGNhcnRvZ3JhcGhpYzIubGF0aXR1ZGUpLFxuICAgICAgICBNYXRoLm1heChjYXJ0b2dyYXBoaWMxLmxvbmdpdHVkZSwgY2FydG9ncmFwaGljMi5sb25naXR1ZGUpLFxuICAgICAgICBNYXRoLm1heChjYXJ0b2dyYXBoaWMxLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMyLmxhdGl0dWRlKSxcbiAgICAgICksXG4gICAgICBkdXJhdGlvbjogYW5pbWF0aW9uRHVyYXRpb24sXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==