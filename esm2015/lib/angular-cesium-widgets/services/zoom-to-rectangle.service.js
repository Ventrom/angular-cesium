import { __decorate, __metadata, __param } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
import { CameraService } from '../../angular-cesium/services/camera/camera.service';
import { CesiumService } from '../../angular-cesium/services/cesium/cesium.service';
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
let ZoomToRectangleService = class ZoomToRectangleService {
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
};
ZoomToRectangleService.ctorParameters = () => [
    { type: MapsManagerService },
    { type: CameraService, decorators: [{ type: Optional }] },
    { type: CesiumService, decorators: [{ type: Optional }] }
];
ZoomToRectangleService = __decorate([
    Injectable(),
    __param(1, Optional()),
    __param(2, Optional()),
    __metadata("design:paramtypes", [MapsManagerService,
        CameraService,
        CesiumService])
], ZoomToRectangleService);
export { ZoomToRectangleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvem9vbS10by1yZWN0YW5nbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDckcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQVNwRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUVILE1BQU0sQ0FBTixJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDdEIsK0NBQVEsQ0FBQTtJQUNSLG1EQUFVLENBQUE7SUFDVixpREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpXLFlBQVksS0FBWixZQUFZLFFBSXZCO0FBR0QsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFDakMsWUFDVSxXQUErQixFQUMzQixhQUE0QixFQUM1QixhQUE0QjtRQUZoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFRakMscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFDL0MsbUJBQWMsR0FBRztZQUN2QiwwQkFBMEIsRUFBRSxHQUFHO1lBQy9CLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFdBQVcsRUFBRSwyQkFBMkI7WUFDeEMsZUFBZSxFQUFFLGlCQUFpQjtZQUNsQyxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLFNBQVMsRUFBRSxDQUFDO1lBQ1osWUFBWSxFQUFFLElBQUk7WUFDbEIsV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJO1NBQy9CLENBQUM7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RTtJQUlSLFdBQUEsUUFBUSxFQUFFLENBQUE7SUFDVixXQUFBLFFBQVEsRUFBRSxDQUFBO3FDQUZVLGtCQUFrQjtRQUNaLGFBQWE7UUFDYixhQUFhO0dBSi9CLHNCQUFzQixDQXFObEM7U0FyTlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuaW50ZXJmYWNlIFpvb21EYXRhIHtcbiAgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgYm9yZGVyRWxlbWVudD86IEhUTUxFbGVtZW50O1xuICByZXNldE9uRXNjYXBlUHJlc3NGdW5jPzogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcbn1cblxuLyoqXG4gKiBUaGUgU2VydmljZSBpcyBhcyBhIFwiem9vbSB0byByZWN0YW5nbGVcIiB0b29sXG4gKlxuICogZXhhbXBsZTpcbiAqIGBgYFxuICogY29uc3RydWN0b3IoXG4gKiAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAqICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICogICBwcml2YXRlIHpvb21Ub1JlY3RhbmdsZVNlcnZpY2U6IFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXG4gKiApIHtcbiAqICAgdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmluaXQoY2VzaXVtU2VydmljZSwgY2FtZXJhU2VydmljZSk7XG4gKiB9XG4gKiAuLi5cbiAqIHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5hY3RpdmF0ZSh7b25Db21wbGV0ZTogKCkgPT4gdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmRpc2FibGUoKX0pO1xuICogYGBgXG4gKlxuICogYGluaXQoKWAgLSBpbml0aWFsaXplIHRoZSBzZXJ2aWNlIHdpdGggQ2FtZXJhU2VydmljZSBhbmQgQ2VzaXVtU2VydmljZS5cbiAqIElmIG5vIG1hcElkIGlzIHByb3ZpZGVkIHRvIGFjdGl2YXRlKCkgLSBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgY2FsbGluZyBgYWN0aXZhdGUoKWAuXG4gKlxuICogYGRpc2FibGUoKWAgLSBkaXNhYmxlcyB0aGUgdG9vbC5cbiAqXG4gKiBgYWN0aXZhdGUoKWAgLVxuICogQHBhcmFtIG9wdGlvbnNcbiAqIHtcbiAqICBvblN0YXJ0IC0gb3B0aW9uYWwgLSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBzdGFydCBkcmF3aW5nIHRoZSByZWN0YW5nbGVcbiAqICBvbkNvbXBsZXRlIC0gb3B0aW9uYWwgLSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdG9vbCB6b29tIGluXG4gKiAgYXV0b0Rpc2FibGVPblpvb20gLSBvcHRpb25hbCAtIGRldGVybWluZXMgaWYgdGhlIHRvb2wgc2hvdWxkIGF1dG8gZGlzYWJsZSBhZnRlciB6b29tIC0gZGVmYXVsdDogdHJ1ZVxuICogIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzIC0gb3B0aW9uYWwgLSB6b29tIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzIC0gZGVmYXVsdDogMC41XG4gKiAgYm9yZGVyU3R5bGUgLSBvcHRpb25hbCAtIHRoZSBzdHlsZSBvZiB0aGUgcmVjdGFuZ2xlIGVsZW1lbnQgYm9yZGVyIC0gZGVmYXVsdDogJzNweCBkYXNoZWQgI0ZGRkZGRidcbiAqICBiYWNrZ3JvdW5kQ29sb3IgLSBvcHRpb25hbCAtIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSByZWN0YW5nbGUgZWxlbWVudCAtIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAqICByZXNldEtleUNvZGUgLSBvcHRpb25hbCAtIHRoZSBrZXkgY29kZSBvZiB0aGUga2V5IHRoYXQgaXMgdXNlZCB0byByZXNldCB0aGUgZHJhd2luZyBvZiB0aGUgcmVjdGFuZ2xlIC0gZGVmYXVsdDogMjcgKEVTQyBrZXkpXG4gKiAgdGhyZXNob2xkIC0gb3B0aW9uYWwgLSB0aGUgbWluaW11bSBhcmVhIG9mIHRoZSBzY3JlZW4gcmVjdGFuZ2xlIChpbiBwaXhlbHMpIHRoYXQgaXMgcmVxdWlyZWQgdG8gcGVyZm9ybSB6b29tIC0gZGVmYXVsdDogOVxuICogIGtlZXBSb3RhdGlvbiAtIG9wdGlvbmFsIC0gd2hldGhlciBvciBub3QgdG8ga2VlcCB0aGUgcm90YXRpb24gd2hlbiB6b29taW5nIGluIC0gZGVmYXVsdDogdHJ1ZVxuICogIG1vdXNlQnV0dG9uIC0gb3B0aW9uYWwgLSBzZXRzIHRoZSBtb3VzZSBidXR0b24gZm9yIGRyYXdpbmcgdGhlIHJlY3RhbmdsZSAtIGRlZmF1bHQ6IGxlZnQgbW91c2UgYnV0dG9uICgwKVxuICogfVxuICogQHBhcmFtIG1hcElkIC0gb3B0aW9uYWwgLSB0aGUgbWFwSWQgb2YgdGhlIG1hcCB0aGF0IHRoZSB0b29sIHdpbGwgYmUgdXNlZCBpbi5cbiAqXG4gKi9cblxuZXhwb3J0IGVudW0gTW91c2VCdXR0b25zIHtcbiAgTEVGVCA9IDAsXG4gIE1JRERMRSA9IDEsXG4gIFJJR0hUID0gMixcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFpvb21Ub1JlY3RhbmdsZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG1hcHNNYW5hZ2VyOiBNYXBzTWFuYWdlclNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHt9XG5cbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2U7XG5cbiAgcHJpdmF0ZSBtYXBzWm9vbUVsZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIFpvb21EYXRhPigpO1xuICBwcml2YXRlIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzOiAwLjUsXG4gICAgcmVzZXRLZXlDb2RlOiAyNyxcbiAgICBib3JkZXJTdHlsZTogJzJweCBzb2xpZCByZ2JhKDAsMCwwLDAuNSknLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMC4yKScsXG4gICAgYXV0b0Rpc2FibGVPblpvb206IHRydWUsXG4gICAgdGhyZXNob2xkOiA5LFxuICAgIGtlZXBSb3RhdGlvbjogdHJ1ZSxcbiAgICBtb3VzZUJ1dHRvbjogTW91c2VCdXR0b25zLkxFRlQsXG4gIH07XG5cbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlKSB7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UgPSBjZXNpdW1TZXJ2aWNlO1xuICB9XG5cbiAgYWN0aXZhdGUoXG4gICAgb3B0aW9uczoge1xuICAgICAgb25TdGFydD86IChhY01hcD86IEFjTWFwQ29tcG9uZW50KSA9PiBhbnk7XG4gICAgICBvbkNvbXBsZXRlPzogKGFjTWFwPzogQWNNYXBDb21wb25lbnQpID0+IGFueTtcbiAgICAgIG1vdXNlQnV0dG9uPzogTW91c2VCdXR0b25zO1xuICAgICAgYXV0b0Rpc2FibGVPblpvb20/OiBib29sZWFuO1xuICAgICAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHM/OiBudW1iZXI7XG4gICAgICB0aHJlc2hvbGQ/OiBudW1iZXI7XG4gICAgICBrZWVwUm90YXRpb24/OiBib29sZWFuO1xuICAgICAgYm9yZGVyU3R5bGU/OiBzdHJpbmc7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gICAgICByZXNldEtleUNvZGU/OiBudW1iZXI7XG4gICAgfSA9IHt9LFxuICAgIG1hcElkPzogc3RyaW5nLFxuICApIHtcbiAgICBpZiAoKCF0aGlzLmNhbWVyYVNlcnZpY2UgfHwgIXRoaXMuY2VzaXVtU2VydmljZSkgJiYgIW1hcElkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgYSBtYXBJZCBpZiB0aGUgc2VydmljZSB3YXNuJ3QgaW5pdGlhbGl6ZWRgKTtcbiAgICB9XG4gICAgY29uc3QgZmluYWxPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgbGV0IGNhbWVyYVNlcnZpY2UgPSB0aGlzLmNhbWVyYVNlcnZpY2U7XG4gICAgbGV0IG1hcENvbnRhaW5lcjtcbiAgICBsZXQgbWFwO1xuICAgIGlmICh0aGlzLmNlc2l1bVNlcnZpY2UpIHtcbiAgICAgIG1hcENvbnRhaW5lciA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jb250YWluZXI7XG4gICAgICBtYXAgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCk7XG4gICAgfVxuICAgIGlmIChtYXBJZCkge1xuICAgICAgbWFwID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAobWFwSWQpO1xuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgbm90IGZvdW5kIHdpdGggaWQ6ICR7bWFwSWR9YCk7XG4gICAgICB9XG4gICAgICBjYW1lcmFTZXJ2aWNlID0gbWFwLmdldENhbWVyYVNlcnZpY2UoKTtcbiAgICAgIG1hcENvbnRhaW5lciA9IG1hcC5nZXRDZXNpdW1WaWV3ZXIoKS5jb250YWluZXI7XG4gICAgfVxuXG4gICAgaWYgKCFjYW1lcmFTZXJ2aWNlIHx8ICFtYXBDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSBhIG1hcElkIGlmIHRoZSBzZXJ2aWNlIHdhc24ndCBpbml0aWFsaXplZGApO1xuICAgIH1cbiAgICB0aGlzLmRpc2FibGUobWFwSWQpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1hcENvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gJzAnO1xuICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgIG1hcENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnN0IG1hcFpvb21EYXRhOiBab29tRGF0YSA9IHsgY29udGFpbmVyIH07XG4gICAgdGhpcy5tYXBzWm9vbUVsZW1lbnRzLnNldChtYXBJZCB8fCB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0SWQoKSwgbWFwWm9vbURhdGEpO1xuICAgIGxldCBtb3VzZSA9IHtcbiAgICAgIGVuZFg6IDAsXG4gICAgICBlbmRZOiAwLFxuICAgICAgc3RhcnRYOiAwLFxuICAgICAgc3RhcnRZOiAwLFxuICAgIH07XG4gICAgbGV0IGJvcmRlckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGFpbmVyLm9ubW91c2Vkb3duID0gZSA9PiB7XG4gICAgICBpZiAoZS5idXR0b24gIT09IGZpbmFsT3B0aW9ucy5tb3VzZUJ1dHRvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vblN0YXJ0KSB7XG4gICAgICAgICAgb3B0aW9ucy5vblN0YXJ0KG1hcCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWN0ID0gKGUuY3VycmVudFRhcmdldCBhcyBhbnkpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gICAgICAgIG1vdXNlLnN0YXJ0WCA9IG9mZnNldFg7XG4gICAgICAgIG1vdXNlLnN0YXJ0WSA9IG9mZnNldFk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5jbGFzc05hbWUgPSAnem9vbS10by1yZWN0YW5nbGUtYm9yZGVyJztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuYm9yZGVyID0gZmluYWxPcHRpb25zLmJvcmRlclN0eWxlO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGZpbmFsT3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUubGVmdCA9IG1vdXNlLnN0YXJ0WCArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gbW91c2Uuc3RhcnRZICsgJ3B4JztcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJvcmRlckVsZW1lbnQpO1xuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gYm9yZGVyRWxlbWVudDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29udGFpbmVyLm9ubW91c2V1cCA9IGUgPT4ge1xuICAgICAgaWYgKGJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHpvb21BcHBsaWVkO1xuICAgICAgICBpZiAobW91c2UgJiYgTWF0aC5hYnMobW91c2UuZW5kWCAtIG1vdXNlLnN0YXJ0WCkgKiBNYXRoLmFicyhtb3VzZS5lbmRZIC0gbW91c2Uuc3RhcnRZKSA+IGZpbmFsT3B0aW9ucy50aHJlc2hvbGQpIHtcbiAgICAgICAgICB6b29tQXBwbGllZCA9IHRoaXMuem9vbUNhbWVyYVRvUmVjdGFuZ2xlKFxuICAgICAgICAgICAgY2FtZXJhU2VydmljZSxcbiAgICAgICAgICAgIG1vdXNlLFxuICAgICAgICAgICAgZmluYWxPcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzLFxuICAgICAgICAgICAgZmluYWxPcHRpb25zLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYm9yZGVyRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgbW91c2UgPSB7XG4gICAgICAgICAgZW5kWDogMCxcbiAgICAgICAgICBlbmRZOiAwLFxuICAgICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIWZpbmFsT3B0aW9ucy5vbkNvbXBsZXRlKSB7XG4gICAgICAgICAgZmluYWxPcHRpb25zLm9uQ29tcGxldGUobWFwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxPcHRpb25zLmF1dG9EaXNhYmxlT25ab29tICYmIHpvb21BcHBsaWVkKSB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKG1hcElkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb250YWluZXIub25tb3VzZW1vdmUgPSBlID0+IHtcbiAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIGFueSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgbW91c2UuZW5kWCA9IG9mZnNldFg7XG4gICAgICAgIG1vdXNlLmVuZFkgPSBvZmZzZXRZO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLndpZHRoID0gTWF0aC5hYnMobW91c2UuZW5kWCAtIG1vdXNlLnN0YXJ0WCkgKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmhlaWdodCA9IE1hdGguYWJzKG1vdXNlLmVuZFkgLSBtb3VzZS5zdGFydFkpICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5taW4obW91c2Uuc3RhcnRYLCBtb3VzZS5lbmRYKSArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gTWF0aC5taW4obW91c2Uuc3RhcnRZLCBtb3VzZS5lbmRZKSArICdweCc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc2V0T25Fc2NhcGVQcmVzcyA9IGUgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gZmluYWxPcHRpb25zLnJlc2V0S2V5Q29kZSAmJiBib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1hcFpvb21EYXRhLmJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1vdXNlID0ge1xuICAgICAgICAgIGVuZFg6IDAsXG4gICAgICAgICAgZW5kWTogMCxcbiAgICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgICAgc3RhcnRZOiAwLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJlc2V0T25Fc2NhcGVQcmVzcyk7XG4gICAgbWFwWm9vbURhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYyA9IHJlc2V0T25Fc2NhcGVQcmVzcztcbiAgfVxuXG4gIGRpc2FibGUobWFwSWQ/OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuY2VzaXVtU2VydmljZSAmJiAhbWFwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWYgdGhlIHNlcnZpY2Ugd2FzIG5vdCBpbml0aWFsaXplZCB3aXRoIENlc2l1bVNlcnZpY2UsIG1hcElkIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IHRoaXMubWFwc1pvb21FbGVtZW50cy5nZXQobWFwSWQgfHwgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldElkKCkpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBkYXRhLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIGlmIChkYXRhLmJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgZGF0YS5ib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYykge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5tYXBzWm9vbUVsZW1lbnRzLmRlbGV0ZShtYXBJZCk7XG4gIH1cblxuICBwcml2YXRlIHpvb21DYW1lcmFUb1JlY3RhbmdsZShcbiAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHBvc2l0aW9uczogeyBlbmRYOiBudW1iZXI7IGVuZFk6IG51bWJlcjsgc3RhcnRYOiBudW1iZXI7IHN0YXJ0WTogbnVtYmVyIH0sXG4gICAgYW5pbWF0aW9uRHVyYXRpb24sXG4gICAgb3B0aW9ucyxcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY2FtZXJhID0gY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKTtcbiAgICBjb25zdCBjYXJ0ZXNpYW4xID0gY2FtZXJhLnBpY2tFbGxpcHNvaWQoeyB4OiBwb3NpdGlvbnMuc3RhcnRYLCB5OiBwb3NpdGlvbnMuc3RhcnRZIH0pO1xuICAgIGNvbnN0IGNhcnRlc2lhbjIgPSBjYW1lcmEucGlja0VsbGlwc29pZCh7IHg6IHBvc2l0aW9ucy5lbmRYLCB5OiBwb3NpdGlvbnMuZW5kWSB9KTtcbiAgICBpZiAoIWNhcnRlc2lhbjEgfHwgIWNhcnRlc2lhbjIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgY2FydG9ncmFwaGljMSA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjYXJ0ZXNpYW4xKTtcbiAgICBjb25zdCBjYXJ0b2dyYXBoaWMyID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjIpO1xuICAgIGNhbWVyYVNlcnZpY2UuY2FtZXJhRmx5VG8oe1xuICAgICAgZGVzdGluYXRpb246IG5ldyBDZXNpdW0uUmVjdGFuZ2xlKFxuICAgICAgICBNYXRoLm1pbihjYXJ0b2dyYXBoaWMxLmxvbmdpdHVkZSwgY2FydG9ncmFwaGljMi5sb25naXR1ZGUpLFxuICAgICAgICBNYXRoLm1pbihjYXJ0b2dyYXBoaWMxLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMyLmxhdGl0dWRlKSxcbiAgICAgICAgTWF0aC5tYXgoY2FydG9ncmFwaGljMS5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYzIubG9uZ2l0dWRlKSxcbiAgICAgICAgTWF0aC5tYXgoY2FydG9ncmFwaGljMS5sYXRpdHVkZSwgY2FydG9ncmFwaGljMi5sYXRpdHVkZSksXG4gICAgICApLFxuICAgICAgb3JpZW50YXRpb246IG9wdGlvbnMua2VlcFJvdGF0aW9uID8geyBoZWFkaW5nOiBjYW1lcmEuaGVhZGluZyB9IDogdW5kZWZpbmVkLFxuICAgICAgZHVyYXRpb246IGFuaW1hdGlvbkR1cmF0aW9uLFxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=