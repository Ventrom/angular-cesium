import { Injectable, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angular-cesium/services/maps-manager/maps-manager.service";
import * as i2 from "../../angular-cesium/services/camera/camera.service";
import * as i3 from "../../angular-cesium/services/cesium/cesium.service";
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
 *  threshold - optional - the minimum area of the screen rectangle (in pixels) that is required to perform zoom - default: 9
 *  keepRotation - optional - whether or not to keep the rotation when zooming in - default: true
 *  mouseButton - optional - sets the mouse button for drawing the rectangle - default: left mouse button (0)
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */
export var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["LEFT"] = 0] = "LEFT";
    MouseButtons[MouseButtons["MIDDLE"] = 1] = "MIDDLE";
    MouseButtons[MouseButtons["RIGHT"] = 2] = "RIGHT";
})(MouseButtons || (MouseButtons = {}));
export class ZoomToRectangleService {
    constructor(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
            threshold: 9,
            keepRotation: true,
            mouseButton: MouseButtons.LEFT,
        };
    }
    init(cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    }
    activate(options = {}, mapId) {
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        const finalOptions = Object.assign({}, this.defaultOptions, options);
        let cameraService = this.cameraService;
        let mapContainer;
        let map;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
            map = this.cesiumService.getMap();
        }
        if (mapId) {
            map = this.mapsManager.getMap(mapId);
            if (!map) {
                throw new Error(`Map not found with id: ${mapId}`);
            }
            cameraService = map.getCameraService();
            mapContainer = map.getCesiumViewer().container;
        }
        if (!cameraService || !mapContainer) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        this.disable(mapId);
        const container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        const mapZoomData = { container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        let mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        let borderElement;
        container.onmousedown = e => {
            if (e.button !== finalOptions.mouseButton) {
                return;
            }
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
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
        };
        container.onmouseup = e => {
            if (borderElement) {
                let zoomApplied;
                if (mouse && Math.abs(mouse.endX - mouse.startX) * Math.abs(mouse.endY - mouse.startY) > finalOptions.threshold) {
                    zoomApplied = this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds, finalOptions);
                }
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
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
                    this.disable(mapId);
                }
            }
        };
        container.onmousemove = e => {
            if (borderElement) {
                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        };
        const resetOnEscapePress = e => {
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
        };
        document.addEventListener('keydown', resetOnEscapePress);
        mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
    }
    disable(mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        const data = this.mapsZoomElements.get(mapId || this.cesiumService.getMap().getId());
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
    }
    zoomCameraToRectangle(cameraService, positions, animationDuration, options) {
        const camera = cameraService.getCamera();
        const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        const cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        const cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            orientation: options.keepRotation ? { heading: camera.heading } : undefined,
            duration: animationDuration,
        });
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ZoomToRectangleService, deps: [{ token: i1.MapsManagerService }, { token: i2.CameraService, optional: true }, { token: i3.CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ZoomToRectangleService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ZoomToRectangleService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.MapsManagerService }, { type: i2.CameraService, decorators: [{
                    type: Optional
                }] }, { type: i3.CesiumService, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy96b29tLXRvLXJlY3RhbmdsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQVlyRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUVILE1BQU0sQ0FBTixJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDdEIsK0NBQVEsQ0FBQTtJQUNSLG1EQUFVLENBQUE7SUFDVixpREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpXLFlBQVksS0FBWixZQUFZLFFBSXZCO0FBR0QsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUNVLFdBQStCLEVBQzNCLGFBQTRCLEVBQzVCLGFBQTRCO1FBRmhDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQVFqQyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUMvQyxtQkFBYyxHQUFHO1lBQ3ZCLDBCQUEwQixFQUFFLEdBQUc7WUFDL0IsWUFBWSxFQUFFLEVBQUU7WUFDaEIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxlQUFlLEVBQUUsaUJBQWlCO1lBQ2xDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsU0FBUyxFQUFFLENBQUM7WUFDWixZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7U0FDL0IsQ0FBQztJQWZDLENBQUM7SUFpQkosSUFBSSxDQUFDLGFBQTRCLEVBQUUsYUFBNEI7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7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QkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBRGxDLFVBQVU7OzBCQUlOLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xuXG5pbnRlcmZhY2UgWm9vbURhdGEge1xuICBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBib3JkZXJFbGVtZW50PzogSFRNTEVsZW1lbnQ7XG4gIHJlc2V0T25Fc2NhcGVQcmVzc0Z1bmM/OiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xufVxuXG4vKipcbiAqIFRoZSBTZXJ2aWNlIGlzIGFzIGEgXCJ6b29tIHRvIHJlY3RhbmdsZVwiIHRvb2xcbiAqXG4gKiBleGFtcGxlOlxuICogYGBgXG4gKiBjb25zdHJ1Y3RvcihcbiAqICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICogICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gKiAgIHByaXZhdGUgem9vbVRvUmVjdGFuZ2xlU2VydmljZTogWm9vbVRvUmVjdGFuZ2xlU2VydmljZSxcbiAqICkge1xuICogICB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuaW5pdChjZXNpdW1TZXJ2aWNlLCBjYW1lcmFTZXJ2aWNlKTtcbiAqIH1cbiAqIC4uLlxuICogdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmFjdGl2YXRlKHtvbkNvbXBsZXRlOiAoKSA9PiB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuZGlzYWJsZSgpfSk7XG4gKiBgYGBcbiAqXG4gKiBgaW5pdCgpYCAtIGluaXRpYWxpemUgdGhlIHNlcnZpY2Ugd2l0aCBDYW1lcmFTZXJ2aWNlIGFuZCBDZXNpdW1TZXJ2aWNlLlxuICogSWYgbm8gbWFwSWQgaXMgcHJvdmlkZWQgdG8gYWN0aXZhdGUoKSAtIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBjYWxsaW5nIGBhY3RpdmF0ZSgpYC5cbiAqXG4gKiBgZGlzYWJsZSgpYCAtIGRpc2FibGVzIHRoZSB0b29sLlxuICpcbiAqIGBhY3RpdmF0ZSgpYCAtXG4gKiBAcGFyYW0gb3B0aW9uc1xuICoge1xuICogIG9uU3RhcnQgLSBvcHRpb25hbCAtIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0IGRyYXdpbmcgdGhlIHJlY3RhbmdsZVxuICogIG9uQ29tcGxldGUgLSBvcHRpb25hbCAtIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB0b29sIHpvb20gaW5cbiAqICBhdXRvRGlzYWJsZU9uWm9vbSAtIG9wdGlvbmFsIC0gZGV0ZXJtaW5lcyBpZiB0aGUgdG9vbCBzaG91bGQgYXV0byBkaXNhYmxlIGFmdGVyIHpvb20gLSBkZWZhdWx0OiB0cnVlXG4gKiAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHMgLSBvcHRpb25hbCAtIHpvb20gYW5pbWF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHMgLSBkZWZhdWx0OiAwLjVcbiAqICBib3JkZXJTdHlsZSAtIG9wdGlvbmFsIC0gdGhlIHN0eWxlIG9mIHRoZSByZWN0YW5nbGUgZWxlbWVudCBib3JkZXIgLSBkZWZhdWx0OiAnM3B4IGRhc2hlZCAjRkZGRkZGJ1xuICogIGJhY2tncm91bmRDb2xvciAtIG9wdGlvbmFsIC0gdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIHJlY3RhbmdsZSBlbGVtZW50IC0gZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xuICogIHJlc2V0S2V5Q29kZSAtIG9wdGlvbmFsIC0gdGhlIGtleSBjb2RlIG9mIHRoZSBrZXkgdGhhdCBpcyB1c2VkIHRvIHJlc2V0IHRoZSBkcmF3aW5nIG9mIHRoZSByZWN0YW5nbGUgLSBkZWZhdWx0OiAyNyAoRVNDIGtleSlcbiAqICB0aHJlc2hvbGQgLSBvcHRpb25hbCAtIHRoZSBtaW5pbXVtIGFyZWEgb2YgdGhlIHNjcmVlbiByZWN0YW5nbGUgKGluIHBpeGVscykgdGhhdCBpcyByZXF1aXJlZCB0byBwZXJmb3JtIHpvb20gLSBkZWZhdWx0OiA5XG4gKiAga2VlcFJvdGF0aW9uIC0gb3B0aW9uYWwgLSB3aGV0aGVyIG9yIG5vdCB0byBrZWVwIHRoZSByb3RhdGlvbiB3aGVuIHpvb21pbmcgaW4gLSBkZWZhdWx0OiB0cnVlXG4gKiAgbW91c2VCdXR0b24gLSBvcHRpb25hbCAtIHNldHMgdGhlIG1vdXNlIGJ1dHRvbiBmb3IgZHJhd2luZyB0aGUgcmVjdGFuZ2xlIC0gZGVmYXVsdDogbGVmdCBtb3VzZSBidXR0b24gKDApXG4gKiB9XG4gKiBAcGFyYW0gbWFwSWQgLSBvcHRpb25hbCAtIHRoZSBtYXBJZCBvZiB0aGUgbWFwIHRoYXQgdGhlIHRvb2wgd2lsbCBiZSB1c2VkIGluLlxuICpcbiAqL1xuXG5leHBvcnQgZW51bSBNb3VzZUJ1dHRvbnMge1xuICBMRUZUID0gMCxcbiAgTUlERExFID0gMSxcbiAgUklHSFQgPSAyLFxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgWm9vbVRvUmVjdGFuZ2xlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbWFwc01hbmFnZXI6IE1hcHNNYW5hZ2VyU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICkge31cblxuICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2U7XG4gIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZTtcblxuICBwcml2YXRlIG1hcHNab29tRWxlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgWm9vbURhdGE+KCk7XG4gIHByaXZhdGUgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHM6IDAuNSxcbiAgICByZXNldEtleUNvZGU6IDI3LFxuICAgIGJvcmRlclN0eWxlOiAnMnB4IHNvbGlkIHJnYmEoMCwwLDAsMC41KScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjIpJyxcbiAgICBhdXRvRGlzYWJsZU9uWm9vbTogdHJ1ZSxcbiAgICB0aHJlc2hvbGQ6IDksXG4gICAga2VlcFJvdGF0aW9uOiB0cnVlLFxuICAgIG1vdXNlQnV0dG9uOiBNb3VzZUJ1dHRvbnMuTEVGVCxcbiAgfTtcblxuICBpbml0KGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UpIHtcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xuICAgIHRoaXMuY2VzaXVtU2VydmljZSA9IGNlc2l1bVNlcnZpY2U7XG4gIH1cblxuICBhY3RpdmF0ZShcbiAgICBvcHRpb25zOiB7XG4gICAgICBvblN0YXJ0PzogKGFjTWFwPzogQWNNYXBDb21wb25lbnQpID0+IGFueTtcbiAgICAgIG9uQ29tcGxldGU/OiAoYWNNYXA/OiBBY01hcENvbXBvbmVudCkgPT4gYW55O1xuICAgICAgbW91c2VCdXR0b24/OiBNb3VzZUJ1dHRvbnM7XG4gICAgICBhdXRvRGlzYWJsZU9uWm9vbT86IGJvb2xlYW47XG4gICAgICBhbmltYXRpb25EdXJhdGlvbkluU2Vjb25kcz86IG51bWJlcjtcbiAgICAgIHRocmVzaG9sZD86IG51bWJlcjtcbiAgICAgIGtlZXBSb3RhdGlvbj86IGJvb2xlYW47XG4gICAgICBib3JkZXJTdHlsZT86IHN0cmluZztcbiAgICAgIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgICAgIHJlc2V0S2V5Q29kZT86IG51bWJlcjtcbiAgICB9ID0ge30sXG4gICAgbWFwSWQ/OiBzdHJpbmcsXG4gICkge1xuICAgIGlmICgoIXRoaXMuY2FtZXJhU2VydmljZSB8fCAhdGhpcy5jZXNpdW1TZXJ2aWNlKSAmJiAhbWFwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSBhIG1hcElkIGlmIHRoZSBzZXJ2aWNlIHdhc24ndCBpbml0aWFsaXplZGApO1xuICAgIH1cbiAgICBjb25zdCBmaW5hbE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICBsZXQgY2FtZXJhU2VydmljZSA9IHRoaXMuY2FtZXJhU2VydmljZTtcbiAgICBsZXQgbWFwQ29udGFpbmVyO1xuICAgIGxldCBtYXA7XG4gICAgaWYgKHRoaXMuY2VzaXVtU2VydmljZSkge1xuICAgICAgbWFwQ29udGFpbmVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNvbnRhaW5lcjtcbiAgICAgIG1hcCA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKTtcbiAgICB9XG4gICAgaWYgKG1hcElkKSB7XG4gICAgICBtYXAgPSB0aGlzLm1hcHNNYW5hZ2VyLmdldE1hcChtYXBJZCk7XG4gICAgICBpZiAoIW1hcCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCBub3QgZm91bmQgd2l0aCBpZDogJHttYXBJZH1gKTtcbiAgICAgIH1cbiAgICAgIGNhbWVyYVNlcnZpY2UgPSBtYXAuZ2V0Q2FtZXJhU2VydmljZSgpO1xuICAgICAgbWFwQ29udGFpbmVyID0gbWFwLmdldENlc2l1bVZpZXdlcigpLmNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBpZiAoIWNhbWVyYVNlcnZpY2UgfHwgIW1hcENvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIGEgbWFwSWQgaWYgdGhlIHNlcnZpY2Ugd2Fzbid0IGluaXRpYWxpemVkYCk7XG4gICAgfVxuICAgIHRoaXMuZGlzYWJsZShtYXBJZCk7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWFwQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICBjb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XG4gICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgbWFwQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgY29uc3QgbWFwWm9vbURhdGE6IFpvb21EYXRhID0geyBjb250YWluZXIgfTtcbiAgICB0aGlzLm1hcHNab29tRWxlbWVudHMuc2V0KG1hcElkIHx8IHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRJZCgpLCBtYXBab29tRGF0YSk7XG4gICAgbGV0IG1vdXNlID0ge1xuICAgICAgZW5kWDogMCxcbiAgICAgIGVuZFk6IDAsXG4gICAgICBzdGFydFg6IDAsXG4gICAgICBzdGFydFk6IDAsXG4gICAgfTtcbiAgICBsZXQgYm9yZGVyRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgICBjb250YWluZXIub25tb3VzZWRvd24gPSBlID0+IHtcbiAgICAgIGlmIChlLmJ1dHRvbiAhPT0gZmluYWxPcHRpb25zLm1vdXNlQnV0dG9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm9uU3RhcnQpIHtcbiAgICAgICAgICBvcHRpb25zLm9uU3RhcnQobWFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY3QgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIGFueSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgbW91c2Uuc3RhcnRYID0gb2Zmc2V0WDtcbiAgICAgICAgbW91c2Uuc3RhcnRZID0gb2Zmc2V0WTtcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBib3JkZXJFbGVtZW50LmNsYXNzTmFtZSA9ICd6b29tLXRvLXJlY3RhbmdsZS1ib3JkZXInO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5ib3JkZXIgPSBmaW5hbE9wdGlvbnMuYm9yZGVyU3R5bGU7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZmluYWxPcHRpb25zLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5sZWZ0ID0gbW91c2Uuc3RhcnRYICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS50b3AgPSBtb3VzZS5zdGFydFkgKyAncHgnO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYm9yZGVyRWxlbWVudCk7XG4gICAgICAgIG1hcFpvb21EYXRhLmJvcmRlckVsZW1lbnQgPSBib3JkZXJFbGVtZW50O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb250YWluZXIub25tb3VzZXVwID0gZSA9PiB7XG4gICAgICBpZiAoYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBsZXQgem9vbUFwcGxpZWQ7XG4gICAgICAgIGlmIChtb3VzZSAmJiBNYXRoLmFicyhtb3VzZS5lbmRYIC0gbW91c2Uuc3RhcnRYKSAqIE1hdGguYWJzKG1vdXNlLmVuZFkgLSBtb3VzZS5zdGFydFkpID4gZmluYWxPcHRpb25zLnRocmVzaG9sZCkge1xuICAgICAgICAgIHpvb21BcHBsaWVkID0gdGhpcy56b29tQ2FtZXJhVG9SZWN0YW5nbGUoXG4gICAgICAgICAgICBjYW1lcmFTZXJ2aWNlLFxuICAgICAgICAgICAgbW91c2UsXG4gICAgICAgICAgICBmaW5hbE9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHMsXG4gICAgICAgICAgICBmaW5hbE9wdGlvbnMsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICBib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBtb3VzZSA9IHtcbiAgICAgICAgICBlbmRYOiAwLFxuICAgICAgICAgIGVuZFk6IDAsXG4gICAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICAgIHN0YXJ0WTogMCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCEhZmluYWxPcHRpb25zLm9uQ29tcGxldGUpIHtcbiAgICAgICAgICBmaW5hbE9wdGlvbnMub25Db21wbGV0ZShtYXApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbE9wdGlvbnMuYXV0b0Rpc2FibGVPblpvb20gJiYgem9vbUFwcGxpZWQpIHtcbiAgICAgICAgICB0aGlzLmRpc2FibGUobWFwSWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGUgPT4ge1xuICAgICAgaWYgKGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcmVjdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICBtb3VzZS5lbmRYID0gb2Zmc2V0WDtcbiAgICAgICAgbW91c2UuZW5kWSA9IG9mZnNldFk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUud2lkdGggPSBNYXRoLmFicyhtb3VzZS5lbmRYIC0gbW91c2Uuc3RhcnRYKSArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5hYnMobW91c2UuZW5kWSAtIG1vdXNlLnN0YXJ0WSkgKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBNYXRoLm1pbihtb3VzZS5zdGFydFgsIG1vdXNlLmVuZFgpICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS50b3AgPSBNYXRoLm1pbihtb3VzZS5zdGFydFksIG1vdXNlLmVuZFkpICsgJ3B4JztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVzZXRPbkVzY2FwZVByZXNzID0gZSA9PiB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSBmaW5hbE9wdGlvbnMucmVzZXRLZXlDb2RlICYmIGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbW91c2UgPSB7XG4gICAgICAgICAgZW5kWDogMCxcbiAgICAgICAgICBlbmRZOiAwLFxuICAgICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVzZXRPbkVzY2FwZVByZXNzKTtcbiAgICBtYXBab29tRGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jID0gcmVzZXRPbkVzY2FwZVByZXNzO1xuICB9XG5cbiAgZGlzYWJsZShtYXBJZD86IHN0cmluZykge1xuICAgIGlmICghdGhpcy5jZXNpdW1TZXJ2aWNlICYmICFtYXBJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJZiB0aGUgc2VydmljZSB3YXMgbm90IGluaXRpYWxpemVkIHdpdGggQ2VzaXVtU2VydmljZSwgbWFwSWQgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgIH1cbiAgICBjb25zdCBkYXRhID0gdGhpcy5tYXBzWm9vbUVsZW1lbnRzLmdldChtYXBJZCB8fCB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0SWQoKSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGRhdGEuY29udGFpbmVyLnJlbW92ZSgpO1xuICAgICAgaWYgKGRhdGEuYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBkYXRhLmJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBkYXRhLnJlc2V0T25Fc2NhcGVQcmVzc0Z1bmMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1hcHNab29tRWxlbWVudHMuZGVsZXRlKG1hcElkKTtcbiAgfVxuXG4gIHByaXZhdGUgem9vbUNhbWVyYVRvUmVjdGFuZ2xlKFxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcG9zaXRpb25zOiB7IGVuZFg6IG51bWJlcjsgZW5kWTogbnVtYmVyOyBzdGFydFg6IG51bWJlcjsgc3RhcnRZOiBudW1iZXIgfSxcbiAgICBhbmltYXRpb25EdXJhdGlvbixcbiAgICBvcHRpb25zLFxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCBjYW1lcmEgPSBjYW1lcmFTZXJ2aWNlLmdldENhbWVyYSgpO1xuICAgIGNvbnN0IGNhcnRlc2lhbjEgPSBjYW1lcmEucGlja0VsbGlwc29pZCh7IHg6IHBvc2l0aW9ucy5zdGFydFgsIHk6IHBvc2l0aW9ucy5zdGFydFkgfSk7XG4gICAgY29uc3QgY2FydGVzaWFuMiA9IGNhbWVyYS5waWNrRWxsaXBzb2lkKHsgeDogcG9zaXRpb25zLmVuZFgsIHk6IHBvc2l0aW9ucy5lbmRZIH0pO1xuICAgIGlmICghY2FydGVzaWFuMSB8fCAhY2FydGVzaWFuMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBjYXJ0b2dyYXBoaWMxID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjEpO1xuICAgIGNvbnN0IGNhcnRvZ3JhcGhpYzIgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuMik7XG4gICAgY2FtZXJhU2VydmljZS5jYW1lcmFGbHlUbyh7XG4gICAgICBkZXN0aW5hdGlvbjogbmV3IENlc2l1bS5SZWN0YW5nbGUoXG4gICAgICAgIE1hdGgubWluKGNhcnRvZ3JhcGhpYzEubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMyLmxvbmdpdHVkZSksXG4gICAgICAgIE1hdGgubWluKGNhcnRvZ3JhcGhpYzEubGF0aXR1ZGUsIGNhcnRvZ3JhcGhpYzIubGF0aXR1ZGUpLFxuICAgICAgICBNYXRoLm1heChjYXJ0b2dyYXBoaWMxLmxvbmdpdHVkZSwgY2FydG9ncmFwaGljMi5sb25naXR1ZGUpLFxuICAgICAgICBNYXRoLm1heChjYXJ0b2dyYXBoaWMxLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMyLmxhdGl0dWRlKSxcbiAgICAgICksXG4gICAgICBvcmllbnRhdGlvbjogb3B0aW9ucy5rZWVwUm90YXRpb24gPyB7IGhlYWRpbmc6IGNhbWVyYS5oZWFkaW5nIH0gOiB1bmRlZmluZWQsXG4gICAgICBkdXJhdGlvbjogYW5pbWF0aW9uRHVyYXRpb24sXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiJdfQ==