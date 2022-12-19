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
}
ZoomToRectangleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ZoomToRectangleService, deps: [{ token: i1.MapsManagerService }, { token: i2.CameraService, optional: true }, { token: i3.CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ZoomToRectangleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ZoomToRectangleService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ZoomToRectangleService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MapsManagerService }, { type: i2.CameraService, decorators: [{
                    type: Optional
                }] }, { type: i3.CesiumService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy96b29tLXRvLXJlY3RhbmdsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQVlyRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUVILE1BQU0sQ0FBTixJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDdEIsK0NBQVEsQ0FBQTtJQUNSLG1EQUFVLENBQUE7SUFDVixpREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpXLFlBQVksS0FBWixZQUFZLFFBSXZCO0FBR0QsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUNVLFdBQStCLEVBQzNCLGFBQTRCLEVBQzVCLGFBQTRCO1FBRmhDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQVFqQyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUMvQyxtQkFBYyxHQUFHO1lBQ3ZCLDBCQUEwQixFQUFFLEdBQUc7WUFDL0IsWUFBWSxFQUFFLEVBQUU7WUFDaEIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxlQUFlLEVBQUUsaUJBQWlCO1lBQ2xDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsU0FBUyxFQUFFLENBQUM7WUFDWixZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7U0FDL0IsQ0FBQztJQWZDLENBQUM7SUFpQkosSUFBSSxDQUFDLGFBQTRCLEVBQUUsYUFBNEI7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7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Q0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDOUIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLGFBQWEsQ0FBQyxXQUFXLENBQUM7WUFDeEIsV0FBVyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFDeEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FDekQ7WUFDRCxXQUFXLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzNFLFFBQVEsRUFBRSxpQkFBaUI7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOztvSEFwTlUsc0JBQXNCO3dIQUF0QixzQkFBc0I7NEZBQXRCLHNCQUFzQjtrQkFEbEMsVUFBVTs7MEJBSU4sUUFBUTs7MEJBQ1IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBab29tRGF0YSB7XG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIGJvcmRlckVsZW1lbnQ/OiBIVE1MRWxlbWVudDtcbiAgcmVzZXRPbkVzY2FwZVByZXNzRnVuYz86IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XG59XG5cbi8qKlxuICogVGhlIFNlcnZpY2UgaXMgYXMgYSBcInpvb20gdG8gcmVjdGFuZ2xlXCIgdG9vbFxuICpcbiAqIGV4YW1wbGU6XG4gKiBgYGBcbiAqIGNvbnN0cnVjdG9yKFxuICogICBwcml2YXRlIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gKiAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAqICAgcHJpdmF0ZSB6b29tVG9SZWN0YW5nbGVTZXJ2aWNlOiBab29tVG9SZWN0YW5nbGVTZXJ2aWNlLFxuICogKSB7XG4gKiAgIHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5pbml0KGNlc2l1bVNlcnZpY2UsIGNhbWVyYVNlcnZpY2UpO1xuICogfVxuICogLi4uXG4gKiB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuYWN0aXZhdGUoe29uQ29tcGxldGU6ICgpID0+IHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5kaXNhYmxlKCl9KTtcbiAqIGBgYFxuICpcbiAqIGBpbml0KClgIC0gaW5pdGlhbGl6ZSB0aGUgc2VydmljZSB3aXRoIENhbWVyYVNlcnZpY2UgYW5kIENlc2l1bVNlcnZpY2UuXG4gKiBJZiBubyBtYXBJZCBpcyBwcm92aWRlZCB0byBhY3RpdmF0ZSgpIC0gbXVzdCBiZSBjYWxsZWQgYmVmb3JlIGNhbGxpbmcgYGFjdGl2YXRlKClgLlxuICpcbiAqIGBkaXNhYmxlKClgIC0gZGlzYWJsZXMgdGhlIHRvb2wuXG4gKlxuICogYGFjdGl2YXRlKClgIC1cbiAqIEBwYXJhbSBvcHRpb25zXG4gKiB7XG4gKiAgb25TdGFydCAtIG9wdGlvbmFsIC0gYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgc3RhcnQgZHJhd2luZyB0aGUgcmVjdGFuZ2xlXG4gKiAgb25Db21wbGV0ZSAtIG9wdGlvbmFsIC0gYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHRvb2wgem9vbSBpblxuICogIGF1dG9EaXNhYmxlT25ab29tIC0gb3B0aW9uYWwgLSBkZXRlcm1pbmVzIGlmIHRoZSB0b29sIHNob3VsZCBhdXRvIGRpc2FibGUgYWZ0ZXIgem9vbSAtIGRlZmF1bHQ6IHRydWVcbiAqICBhbmltYXRpb25EdXJhdGlvbkluU2Vjb25kcyAtIG9wdGlvbmFsIC0gem9vbSBhbmltYXRpb24gZHVyYXRpb24gaW4gc2Vjb25kcyAtIGRlZmF1bHQ6IDAuNVxuICogIGJvcmRlclN0eWxlIC0gb3B0aW9uYWwgLSB0aGUgc3R5bGUgb2YgdGhlIHJlY3RhbmdsZSBlbGVtZW50IGJvcmRlciAtIGRlZmF1bHQ6ICczcHggZGFzaGVkICNGRkZGRkYnXG4gKiAgYmFja2dyb3VuZENvbG9yIC0gb3B0aW9uYWwgLSB0aGUgYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgcmVjdGFuZ2xlIGVsZW1lbnQgLSBkZWZhdWx0OiAndHJhbnNwYXJlbnQnXG4gKiAgcmVzZXRLZXlDb2RlIC0gb3B0aW9uYWwgLSB0aGUga2V5IGNvZGUgb2YgdGhlIGtleSB0aGF0IGlzIHVzZWQgdG8gcmVzZXQgdGhlIGRyYXdpbmcgb2YgdGhlIHJlY3RhbmdsZSAtIGRlZmF1bHQ6IDI3IChFU0Mga2V5KVxuICogIHRocmVzaG9sZCAtIG9wdGlvbmFsIC0gdGhlIG1pbmltdW0gYXJlYSBvZiB0aGUgc2NyZWVuIHJlY3RhbmdsZSAoaW4gcGl4ZWxzKSB0aGF0IGlzIHJlcXVpcmVkIHRvIHBlcmZvcm0gem9vbSAtIGRlZmF1bHQ6IDlcbiAqICBrZWVwUm90YXRpb24gLSBvcHRpb25hbCAtIHdoZXRoZXIgb3Igbm90IHRvIGtlZXAgdGhlIHJvdGF0aW9uIHdoZW4gem9vbWluZyBpbiAtIGRlZmF1bHQ6IHRydWVcbiAqICBtb3VzZUJ1dHRvbiAtIG9wdGlvbmFsIC0gc2V0cyB0aGUgbW91c2UgYnV0dG9uIGZvciBkcmF3aW5nIHRoZSByZWN0YW5nbGUgLSBkZWZhdWx0OiBsZWZ0IG1vdXNlIGJ1dHRvbiAoMClcbiAqIH1cbiAqIEBwYXJhbSBtYXBJZCAtIG9wdGlvbmFsIC0gdGhlIG1hcElkIG9mIHRoZSBtYXAgdGhhdCB0aGUgdG9vbCB3aWxsIGJlIHVzZWQgaW4uXG4gKlxuICovXG5cbmV4cG9ydCBlbnVtIE1vdXNlQnV0dG9ucyB7XG4gIExFRlQgPSAwLFxuICBNSURETEUgPSAxLFxuICBSSUdIVCA9IDIsXG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBab29tVG9SZWN0YW5nbGVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBtYXBzTWFuYWdlcjogTWFwc01hbmFnZXJTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgKSB7fVxuXG4gIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZTtcbiAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlO1xuXG4gIHByaXZhdGUgbWFwc1pvb21FbGVtZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBab29tRGF0YT4oKTtcbiAgcHJpdmF0ZSBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBhbmltYXRpb25EdXJhdGlvbkluU2Vjb25kczogMC41LFxuICAgIHJlc2V0S2V5Q29kZTogMjcsXG4gICAgYm9yZGVyU3R5bGU6ICcycHggc29saWQgcmdiYSgwLDAsMCwwLjUpJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDAuMiknLFxuICAgIGF1dG9EaXNhYmxlT25ab29tOiB0cnVlLFxuICAgIHRocmVzaG9sZDogOSxcbiAgICBrZWVwUm90YXRpb246IHRydWUsXG4gICAgbW91c2VCdXR0b246IE1vdXNlQnV0dG9ucy5MRUZULFxuICB9O1xuXG4gIGluaXQoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSkge1xuICAgIHRoaXMuY2FtZXJhU2VydmljZSA9IGNhbWVyYVNlcnZpY2U7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlID0gY2VzaXVtU2VydmljZTtcbiAgfVxuXG4gIGFjdGl2YXRlKFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIG9uU3RhcnQ/OiAoYWNNYXA/OiBBY01hcENvbXBvbmVudCkgPT4gYW55O1xuICAgICAgb25Db21wbGV0ZT86IChhY01hcD86IEFjTWFwQ29tcG9uZW50KSA9PiBhbnk7XG4gICAgICBtb3VzZUJ1dHRvbj86IE1vdXNlQnV0dG9ucztcbiAgICAgIGF1dG9EaXNhYmxlT25ab29tPzogYm9vbGVhbjtcbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzPzogbnVtYmVyO1xuICAgICAgdGhyZXNob2xkPzogbnVtYmVyO1xuICAgICAga2VlcFJvdGF0aW9uPzogYm9vbGVhbjtcbiAgICAgIGJvcmRlclN0eWxlPzogc3RyaW5nO1xuICAgICAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICAgICAgcmVzZXRLZXlDb2RlPzogbnVtYmVyO1xuICAgIH0gPSB7fSxcbiAgICBtYXBJZD86IHN0cmluZyxcbiAgKSB7XG4gICAgaWYgKCghdGhpcy5jYW1lcmFTZXJ2aWNlIHx8ICF0aGlzLmNlc2l1bVNlcnZpY2UpICYmICFtYXBJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIGEgbWFwSWQgaWYgdGhlIHNlcnZpY2Ugd2Fzbid0IGluaXRpYWxpemVkYCk7XG4gICAgfVxuICAgIGNvbnN0IGZpbmFsT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGxldCBjYW1lcmFTZXJ2aWNlID0gdGhpcy5jYW1lcmFTZXJ2aWNlO1xuICAgIGxldCBtYXBDb250YWluZXI7XG4gICAgbGV0IG1hcDtcbiAgICBpZiAodGhpcy5jZXNpdW1TZXJ2aWNlKSB7XG4gICAgICBtYXBDb250YWluZXIgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY29udGFpbmVyO1xuICAgICAgbWFwID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpO1xuICAgIH1cbiAgICBpZiAobWFwSWQpIHtcbiAgICAgIG1hcCA9IHRoaXMubWFwc01hbmFnZXIuZ2V0TWFwKG1hcElkKTtcbiAgICAgIGlmICghbWFwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTWFwIG5vdCBmb3VuZCB3aXRoIGlkOiAke21hcElkfWApO1xuICAgICAgfVxuICAgICAgY2FtZXJhU2VydmljZSA9IG1hcC5nZXRDYW1lcmFTZXJ2aWNlKCk7XG4gICAgICBtYXBDb250YWluZXIgPSBtYXAuZ2V0Q2VzaXVtVmlld2VyKCkuY29udGFpbmVyO1xuICAgIH1cblxuICAgIGlmICghY2FtZXJhU2VydmljZSB8fCAhbWFwQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgYSBtYXBJZCBpZiB0aGUgc2VydmljZSB3YXNuJ3QgaW5pdGlhbGl6ZWRgKTtcbiAgICB9XG4gICAgdGhpcy5kaXNhYmxlKG1hcElkKTtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBtYXBDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgY29udGFpbmVyLnN0eWxlLnRvcCA9ICcwJztcbiAgICBjb250YWluZXIuc3R5bGUubGVmdCA9ICcwJztcbiAgICBtYXBDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICBjb25zdCBtYXBab29tRGF0YTogWm9vbURhdGEgPSB7IGNvbnRhaW5lciB9O1xuICAgIHRoaXMubWFwc1pvb21FbGVtZW50cy5zZXQobWFwSWQgfHwgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldElkKCksIG1hcFpvb21EYXRhKTtcbiAgICBsZXQgbW91c2UgPSB7XG4gICAgICBlbmRYOiAwLFxuICAgICAgZW5kWTogMCxcbiAgICAgIHN0YXJ0WDogMCxcbiAgICAgIHN0YXJ0WTogMCxcbiAgICB9O1xuICAgIGxldCBib3JkZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgaWYgKGUuYnV0dG9uICE9PSBmaW5hbE9wdGlvbnMubW91c2VCdXR0b24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMub25TdGFydCkge1xuICAgICAgICAgIG9wdGlvbnMub25TdGFydChtYXApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICBtb3VzZS5zdGFydFggPSBvZmZzZXRYO1xuICAgICAgICBtb3VzZS5zdGFydFkgPSBvZmZzZXRZO1xuICAgICAgICBib3JkZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuY2xhc3NOYW1lID0gJ3pvb20tdG8tcmVjdGFuZ2xlLWJvcmRlcic7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmJvcmRlciA9IGZpbmFsT3B0aW9ucy5ib3JkZXJTdHlsZTtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmaW5hbE9wdGlvbnMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBtb3VzZS5zdGFydFggKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLnRvcCA9IG1vdXNlLnN0YXJ0WSArICdweCc7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChib3JkZXJFbGVtZW50KTtcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IGJvcmRlckVsZW1lbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNldXAgPSBlID0+IHtcbiAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGxldCB6b29tQXBwbGllZDtcbiAgICAgICAgaWYgKG1vdXNlICYmIE1hdGguYWJzKG1vdXNlLmVuZFggLSBtb3VzZS5zdGFydFgpICogTWF0aC5hYnMobW91c2UuZW5kWSAtIG1vdXNlLnN0YXJ0WSkgPiBmaW5hbE9wdGlvbnMudGhyZXNob2xkKSB7XG4gICAgICAgICAgem9vbUFwcGxpZWQgPSB0aGlzLnpvb21DYW1lcmFUb1JlY3RhbmdsZShcbiAgICAgICAgICAgIGNhbWVyYVNlcnZpY2UsXG4gICAgICAgICAgICBtb3VzZSxcbiAgICAgICAgICAgIGZpbmFsT3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbkluU2Vjb25kcyxcbiAgICAgICAgICAgIGZpbmFsT3B0aW9ucyxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1hcFpvb21EYXRhLmJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1vdXNlID0ge1xuICAgICAgICAgIGVuZFg6IDAsXG4gICAgICAgICAgZW5kWTogMCxcbiAgICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgICAgc3RhcnRZOiAwLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoISFmaW5hbE9wdGlvbnMub25Db21wbGV0ZSkge1xuICAgICAgICAgIGZpbmFsT3B0aW9ucy5vbkNvbXBsZXRlKG1hcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmFsT3B0aW9ucy5hdXRvRGlzYWJsZU9uWm9vbSAmJiB6b29tQXBwbGllZCkge1xuICAgICAgICAgIHRoaXMuZGlzYWJsZShtYXBJZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZSA9PiB7XG4gICAgICBpZiAoYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBjb25zdCByZWN0ID0gKGUuY3VycmVudFRhcmdldCBhcyBhbnkpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIG1vdXNlLmVuZFggPSBvZmZzZXRYO1xuICAgICAgICBtb3VzZS5lbmRZID0gb2Zmc2V0WTtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS53aWR0aCA9IE1hdGguYWJzKG1vdXNlLmVuZFggLSBtb3VzZS5zdGFydFgpICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBNYXRoLmFicyhtb3VzZS5lbmRZIC0gbW91c2Uuc3RhcnRZKSArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUubGVmdCA9IE1hdGgubWluKG1vdXNlLnN0YXJ0WCwgbW91c2UuZW5kWCkgKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLnRvcCA9IE1hdGgubWluKG1vdXNlLnN0YXJ0WSwgbW91c2UuZW5kWSkgKyAncHgnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZXNldE9uRXNjYXBlUHJlc3MgPSBlID0+IHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGZpbmFsT3B0aW9ucy5yZXNldEtleUNvZGUgJiYgYm9yZGVyRWxlbWVudCkge1xuICAgICAgICBib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICBib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBtb3VzZSA9IHtcbiAgICAgICAgICBlbmRYOiAwLFxuICAgICAgICAgIGVuZFk6IDAsXG4gICAgICAgICAgc3RhcnRYOiAwLFxuICAgICAgICAgIHN0YXJ0WTogMCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZXNldE9uRXNjYXBlUHJlc3MpO1xuICAgIG1hcFpvb21EYXRhLnJlc2V0T25Fc2NhcGVQcmVzc0Z1bmMgPSByZXNldE9uRXNjYXBlUHJlc3M7XG4gIH1cblxuICBkaXNhYmxlKG1hcElkPzogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmNlc2l1bVNlcnZpY2UgJiYgIW1hcElkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lmIHRoZSBzZXJ2aWNlIHdhcyBub3QgaW5pdGlhbGl6ZWQgd2l0aCBDZXNpdW1TZXJ2aWNlLCBtYXBJZCBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLm1hcHNab29tRWxlbWVudHMuZ2V0KG1hcElkIHx8IHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRJZCgpKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgZGF0YS5jb250YWluZXIucmVtb3ZlKCk7XG4gICAgICBpZiAoZGF0YS5ib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGRhdGEuYm9yZGVyRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhLnJlc2V0T25Fc2NhcGVQcmVzc0Z1bmMpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGRhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWFwc1pvb21FbGVtZW50cy5kZWxldGUobWFwSWQpO1xuICB9XG5cbiAgcHJpdmF0ZSB6b29tQ2FtZXJhVG9SZWN0YW5nbGUoXG4gICAgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwb3NpdGlvbnM6IHsgZW5kWDogbnVtYmVyOyBlbmRZOiBudW1iZXI7IHN0YXJ0WDogbnVtYmVyOyBzdGFydFk6IG51bWJlciB9LFxuICAgIGFuaW1hdGlvbkR1cmF0aW9uLFxuICAgIG9wdGlvbnMsXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNhbWVyYVNlcnZpY2UuZ2V0Q2FtZXJhKCk7XG4gICAgY29uc3QgY2FydGVzaWFuMSA9IGNhbWVyYS5waWNrRWxsaXBzb2lkKHsgeDogcG9zaXRpb25zLnN0YXJ0WCwgeTogcG9zaXRpb25zLnN0YXJ0WSB9KTtcbiAgICBjb25zdCBjYXJ0ZXNpYW4yID0gY2FtZXJhLnBpY2tFbGxpcHNvaWQoeyB4OiBwb3NpdGlvbnMuZW5kWCwgeTogcG9zaXRpb25zLmVuZFkgfSk7XG4gICAgaWYgKCFjYXJ0ZXNpYW4xIHx8ICFjYXJ0ZXNpYW4yKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGNhcnRvZ3JhcGhpYzEgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuMSk7XG4gICAgY29uc3QgY2FydG9ncmFwaGljMiA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjYXJ0ZXNpYW4yKTtcbiAgICBjYW1lcmFTZXJ2aWNlLmNhbWVyYUZseVRvKHtcbiAgICAgIGRlc3RpbmF0aW9uOiBuZXcgQ2VzaXVtLlJlY3RhbmdsZShcbiAgICAgICAgTWF0aC5taW4oY2FydG9ncmFwaGljMS5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYzIubG9uZ2l0dWRlKSxcbiAgICAgICAgTWF0aC5taW4oY2FydG9ncmFwaGljMS5sYXRpdHVkZSwgY2FydG9ncmFwaGljMi5sYXRpdHVkZSksXG4gICAgICAgIE1hdGgubWF4KGNhcnRvZ3JhcGhpYzEubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMyLmxvbmdpdHVkZSksXG4gICAgICAgIE1hdGgubWF4KGNhcnRvZ3JhcGhpYzEubGF0aXR1ZGUsIGNhcnRvZ3JhcGhpYzIubGF0aXR1ZGUpLFxuICAgICAgKSxcbiAgICAgIG9yaWVudGF0aW9uOiBvcHRpb25zLmtlZXBSb3RhdGlvbiA/IHsgaGVhZGluZzogY2FtZXJhLmhlYWRpbmcgfSA6IHVuZGVmaW5lZCxcbiAgICAgIGR1cmF0aW9uOiBhbmltYXRpb25EdXJhdGlvbixcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19