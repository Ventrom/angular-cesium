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
export class ZoomToRectangleService {
    /**
     * @param {?} mapsManager
     * @param {?} cameraService
     * @param {?} cesiumService
     */
    constructor(mapsManager, cameraService, cesiumService) {
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
    init(cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?=} options
     * @param {?=} mapId
     * @return {?}
     */
    activate(options = {}, mapId) {
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        /** @type {?} */
        const finalOptions = Object.assign({}, this.defaultOptions, options);
        /** @type {?} */
        let cameraService = this.cameraService;
        /** @type {?} */
        let mapContainer;
        /** @type {?} */
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
        /** @type {?} */
        const container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        /** @type {?} */
        const mapZoomData = { container };
        this.mapsZoomElements.set(mapId || this.cesiumService.getMap().getId(), mapZoomData);
        /** @type {?} */
        let mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        /** @type {?} */
        let borderElement;
        container.onmousedown = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                /** @type {?} */
                const rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                const offsetX = e.clientX - rect.left;
                /** @type {?} */
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
        });
        container.onmouseup = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (borderElement) {
                /** @type {?} */
                const zoomApplied = this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds);
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
                    this.disable(mapId);
                }
            }
        });
        container.onmousemove = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
            if (borderElement) {
                /** @type {?} */
                const rect = ((/** @type {?} */ (e.currentTarget))).getBoundingClientRect();
                /** @type {?} */
                const offsetX = e.clientX - rect.left;
                /** @type {?} */
                const offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        });
        /** @type {?} */
        const resetOnEscapePress = (/**
         * @param {?} e
         * @return {?}
         */
        e => {
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
    }
    /**
     * @param {?=} mapId
     * @return {?}
     */
    disable(mapId) {
        if (!this.cesiumService && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        /** @type {?} */
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
    /**
     * @private
     * @param {?} cameraService
     * @param {?} positions
     * @param {?} animationDuration
     * @return {?}
     */
    zoomCameraToRectangle(cameraService, positions, animationDuration) {
        /** @type {?} */
        const camera = cameraService.getCamera();
        /** @type {?} */
        const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        /** @type {?} */
        const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        /** @type {?} */
        const cartographic1 = Cesium.Cartographic.fromCartesian(cartesian1);
        /** @type {?} */
        const cartographic2 = Cesium.Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Cesium.Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            duration: animationDuration,
        });
        return true;
    }
}
ZoomToRectangleService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ZoomToRectangleService.ctorParameters = () => [
    { type: MapsManagerService },
    { type: CameraService, decorators: [{ type: Optional }] },
    { type: CesiumService, decorators: [{ type: Optional }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvc2VydmljZXMvem9vbS10by1yZWN0YW5nbGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUVBQWlFLENBQUM7QUFDckcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxREFBcUQsQ0FBQzs7OztBQUdwRix1QkFJQzs7O0lBSEMsNkJBQXVCOztJQUN2QixpQ0FBNEI7O0lBQzVCLDBDQUE0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDOUQsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7O0lBQ2pDLFlBQ1UsV0FBK0IsRUFDM0IsYUFBNEIsRUFDNUIsYUFBNEI7UUFGaEMsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBU2pDLHFCQUFnQixHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO1FBQy9DLG1CQUFjLEdBQUc7WUFDdkIsMEJBQTBCLEVBQUUsR0FBRztZQUMvQixZQUFZLEVBQUUsRUFBRTtZQUNoQixXQUFXLEVBQUUsMkJBQTJCO1lBQ3hDLGVBQWUsRUFBRSxpQkFBaUI7WUFDbEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDO0lBWkYsQ0FBQzs7Ozs7O0lBY0QsSUFBSSxDQUFDLGFBQTRCLEVBQUUsYUFBNEI7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDckMsQ0FBQzs7Ozs7O0lBRUQsUUFBUSxDQUNOLFVBUUks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LGFBQWEsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUN6RDtZQUNELFFBQVEsRUFBRSxpQkFBaUI7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7WUFyTUYsVUFBVTs7OztZQS9DRixrQkFBa0I7WUFDbEIsYUFBYSx1QkFrRGpCLFFBQVE7WUFqREosYUFBYSx1QkFrRGpCLFFBQVE7Ozs7Ozs7SUFJWCwrQ0FBcUM7Ozs7O0lBQ3JDLCtDQUFxQzs7Ozs7SUFFckMsa0RBQXVEOzs7OztJQUN2RCxnREFNRTs7Ozs7SUFoQkEsNkNBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuaW50ZXJmYWNlIFpvb21EYXRhIHtcbiAgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgYm9yZGVyRWxlbWVudD86IEhUTUxFbGVtZW50O1xuICByZXNldE9uRXNjYXBlUHJlc3NGdW5jPzogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcbn1cblxuLyoqXG4gKiBUaGUgU2VydmljZSBpcyBhcyBhIFwiem9vbSB0byByZWN0YW5nbGVcIiB0b29sXG4gKlxuICogZXhhbXBsZTpcbiAqIGBgYFxuICogY29uc3RydWN0b3IoXG4gKiAgIHByaXZhdGUgY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAqICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICogICBwcml2YXRlIHpvb21Ub1JlY3RhbmdsZVNlcnZpY2U6IFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXG4gKiApIHtcbiAqICAgdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmluaXQoY2VzaXVtU2VydmljZSwgY2FtZXJhU2VydmljZSk7XG4gKiB9XG4gKiAuLi5cbiAqIHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5hY3RpdmF0ZSh7b25Db21wbGV0ZTogKCkgPT4gdGhpcy56b29tVG9SZWN0YW5nbGVTZXJ2aWNlLmRpc2FibGUoKX0pO1xuICogYGBgXG4gKlxuICogYGluaXQoKWAgLSBpbml0aWFsaXplIHRoZSBzZXJ2aWNlIHdpdGggQ2FtZXJhU2VydmljZSBhbmQgQ2VzaXVtU2VydmljZS5cbiAqIElmIG5vIG1hcElkIGlzIHByb3ZpZGVkIHRvIGFjdGl2YXRlKCkgLSBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgY2FsbGluZyBgYWN0aXZhdGUoKWAuXG4gKlxuICogYGRpc2FibGUoKWAgLSBkaXNhYmxlcyB0aGUgdG9vbC5cbiAqXG4gKiBgYWN0aXZhdGUoKWAgLVxuICogQHBhcmFtIG9wdGlvbnNcbiAqIHtcbiAqICBvblN0YXJ0IC0gb3B0aW9uYWwgLSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBzdGFydCBkcmF3aW5nIHRoZSByZWN0YW5nbGVcbiAqICBvbkNvbXBsZXRlIC0gb3B0aW9uYWwgLSBhIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdG9vbCB6b29tIGluXG4gKiAgYXV0b0Rpc2FibGVPblpvb20gLSBvcHRpb25hbCAtIGRldGVybWluZXMgaWYgdGhlIHRvb2wgc2hvdWxkIGF1dG8gZGlzYWJsZSBhZnRlciB6b29tIC0gZGVmYXVsdDogdHJ1ZVxuICogIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzIC0gb3B0aW9uYWwgLSB6b29tIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBzZWNvbmRzIC0gZGVmYXVsdDogMC41XG4gKiAgYm9yZGVyU3R5bGUgLSBvcHRpb25hbCAtIHRoZSBzdHlsZSBvZiB0aGUgcmVjdGFuZ2xlIGVsZW1lbnQgYm9yZGVyIC0gZGVmYXVsdDogJzNweCBkYXNoZWQgI0ZGRkZGRidcbiAqICBiYWNrZ3JvdW5kQ29sb3IgLSBvcHRpb25hbCAtIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSByZWN0YW5nbGUgZWxlbWVudCAtIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAqICByZXNldEtleUNvZGUgLSBvcHRpb25hbCAtIHRoZSBrZXkgY29kZSBvZiB0aGUga2V5IHRoYXQgaXMgdXNlZCB0byByZXNldCB0aGUgZHJhd2luZyBvZiB0aGUgcmVjdGFuZ2xlIC0gZGVmYXVsdDogMjcgKEVTQyBrZXkpXG4gKiB9XG4gKiBAcGFyYW0gbWFwSWQgLSBvcHRpb25hbCAtIHRoZSBtYXBJZCBvZiB0aGUgbWFwIHRoYXQgdGhlIHRvb2wgd2lsbCBiZSB1c2VkIGluLlxuICpcbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgWm9vbVRvUmVjdGFuZ2xlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbWFwc01hbmFnZXI6IE1hcHNNYW5hZ2VyU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICkge1xuICB9XG5cbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xuICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2U7XG5cbiAgcHJpdmF0ZSBtYXBzWm9vbUVsZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIFpvb21EYXRhPigpO1xuICBwcml2YXRlIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzOiAwLjUsXG4gICAgcmVzZXRLZXlDb2RlOiAyNyxcbiAgICBib3JkZXJTdHlsZTogJzJweCBzb2xpZCByZ2JhKDAsMCwwLDAuNSknLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMC4yKScsXG4gICAgYXV0b0Rpc2FibGVPblpvb206IHRydWUsXG4gIH07XG5cbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlKSB7XG4gICAgdGhpcy5jYW1lcmFTZXJ2aWNlID0gY2FtZXJhU2VydmljZTtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UgPSBjZXNpdW1TZXJ2aWNlO1xuICB9XG5cbiAgYWN0aXZhdGUoXG4gICAgb3B0aW9uczoge1xuICAgICAgb25TdGFydD86IChhY01hcD86IEFjTWFwQ29tcG9uZW50KSA9PiBhbnk7XG4gICAgICBvbkNvbXBsZXRlPzogKGFjTWFwPzogQWNNYXBDb21wb25lbnQpID0+IGFueTtcbiAgICAgIGF1dG9EaXNhYmxlT25ab29tPzogYm9vbGVhbjtcbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzPzogbnVtYmVyO1xuICAgICAgYm9yZGVyU3R5bGU/OiBzdHJpbmc7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gICAgICByZXNldEtleUNvZGU/OiBudW1iZXI7XG4gICAgfSA9IHt9LFxuICAgIG1hcElkPzogc3RyaW5nLFxuICApIHtcbiAgICBpZiAoKCF0aGlzLmNhbWVyYVNlcnZpY2UgfHwgIXRoaXMuY2VzaXVtU2VydmljZSkgJiYgIW1hcElkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgYSBtYXBJZCBpZiB0aGUgc2VydmljZSB3YXNuJ3QgaW5pdGlhbGl6ZWRgKTtcbiAgICB9XG4gICAgY29uc3QgZmluYWxPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgbGV0IGNhbWVyYVNlcnZpY2UgPSB0aGlzLmNhbWVyYVNlcnZpY2U7XG4gICAgbGV0IG1hcENvbnRhaW5lcjtcbiAgICBsZXQgbWFwO1xuICAgIGlmICh0aGlzLmNlc2l1bVNlcnZpY2UpIHtcbiAgICAgIG1hcENvbnRhaW5lciA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jb250YWluZXI7XG4gICAgICBtYXAgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCk7XG4gICAgfVxuICAgIGlmIChtYXBJZCkge1xuICAgICAgbWFwID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAobWFwSWQpO1xuICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgbm90IGZvdW5kIHdpdGggaWQ6ICR7bWFwSWR9YCk7XG4gICAgICB9XG4gICAgICBjYW1lcmFTZXJ2aWNlID0gbWFwLmdldENhbWVyYVNlcnZpY2UoKTtcbiAgICAgIG1hcENvbnRhaW5lciA9IG1hcC5nZXRDZXNpdW1WaWV3ZXIoKS5jb250YWluZXI7XG4gICAgfVxuXG4gICAgaWYgKCFjYW1lcmFTZXJ2aWNlIHx8ICFtYXBDb250YWluZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIG11c3QgcmVjZWl2ZSBhIG1hcElkIGlmIHRoZSBzZXJ2aWNlIHdhc24ndCBpbml0aWFsaXplZGApO1xuICAgIH1cbiAgICB0aGlzLmRpc2FibGUobWFwSWQpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1hcENvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gJzAnO1xuICAgIGNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzAnO1xuICAgIG1hcENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgIGNvbnN0IG1hcFpvb21EYXRhOiBab29tRGF0YSA9IHtjb250YWluZXJ9O1xuICAgIHRoaXMubWFwc1pvb21FbGVtZW50cy5zZXQobWFwSWQgfHwgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldElkKCksIG1hcFpvb21EYXRhKTtcbiAgICBsZXQgbW91c2UgPSB7XG4gICAgICBlbmRYOiAwLFxuICAgICAgZW5kWTogMCxcbiAgICAgIHN0YXJ0WDogMCxcbiAgICAgIHN0YXJ0WTogMCxcbiAgICB9O1xuICAgIGxldCBib3JkZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgaWYgKCFib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMub25TdGFydCkge1xuICAgICAgICAgIG9wdGlvbnMub25TdGFydChtYXApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuICAgICAgICBtb3VzZS5zdGFydFggPSBvZmZzZXRYO1xuICAgICAgICBtb3VzZS5zdGFydFkgPSBvZmZzZXRZO1xuICAgICAgICBib3JkZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuY2xhc3NOYW1lID0gJ3pvb20tdG8tcmVjdGFuZ2xlLWJvcmRlcic7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmJvcmRlciA9IGZpbmFsT3B0aW9ucy5ib3JkZXJTdHlsZTtcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBmaW5hbE9wdGlvbnMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBtb3VzZS5zdGFydFggKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLnRvcCA9IG1vdXNlLnN0YXJ0WSArICdweCc7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChib3JkZXJFbGVtZW50KTtcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IGJvcmRlckVsZW1lbnQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnRhaW5lci5vbm1vdXNldXAgPSBlID0+IHtcbiAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHpvb21BcHBsaWVkID0gdGhpcy56b29tQ2FtZXJhVG9SZWN0YW5nbGUoY2FtZXJhU2VydmljZSwgbW91c2UsIGZpbmFsT3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbkluU2Vjb25kcyk7XG4gICAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XG4gICAgICAgICAgYm9yZGVyRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICBib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1hcFpvb21EYXRhLmJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgbW91c2UgPSB7XG4gICAgICAgICAgZW5kWDogMCxcbiAgICAgICAgICBlbmRZOiAwLFxuICAgICAgICAgIHN0YXJ0WDogMCxcbiAgICAgICAgICBzdGFydFk6IDAsXG4gICAgICAgIH07XG4gICAgICAgIGlmICghIWZpbmFsT3B0aW9ucy5vbkNvbXBsZXRlKSB7XG4gICAgICAgICAgZmluYWxPcHRpb25zLm9uQ29tcGxldGUobWFwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxPcHRpb25zLmF1dG9EaXNhYmxlT25ab29tICYmIHpvb21BcHBsaWVkKSB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlKG1hcElkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb250YWluZXIub25tb3VzZW1vdmUgPSBlID0+IHtcbiAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIGFueSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgbW91c2UuZW5kWCA9IG9mZnNldFg7XG4gICAgICAgIG1vdXNlLmVuZFkgPSBvZmZzZXRZO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLndpZHRoID0gTWF0aC5hYnMobW91c2UuZW5kWCAtIG1vdXNlLnN0YXJ0WCkgKyAncHgnO1xuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmhlaWdodCA9IE1hdGguYWJzKG1vdXNlLmVuZFkgLSBtb3VzZS5zdGFydFkpICsgJ3B4JztcbiAgICAgICAgYm9yZGVyRWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5taW4obW91c2Uuc3RhcnRYLCBtb3VzZS5lbmRYKSArICdweCc7XG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gTWF0aC5taW4obW91c2Uuc3RhcnRZLCBtb3VzZS5lbmRZKSArICdweCc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlc2V0T25Fc2NhcGVQcmVzcyA9IGUgPT4ge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gZmluYWxPcHRpb25zLnJlc2V0S2V5Q29kZSAmJiBib3JkZXJFbGVtZW50KSB7XG4gICAgICAgIGJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1hcFpvb21EYXRhLmJvcmRlckVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1vdXNlID0ge1xuICAgICAgICAgIGVuZFg6IDAsXG4gICAgICAgICAgZW5kWTogMCxcbiAgICAgICAgICBzdGFydFg6IDAsXG4gICAgICAgICAgc3RhcnRZOiAwLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJlc2V0T25Fc2NhcGVQcmVzcyk7XG4gICAgbWFwWm9vbURhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYyA9IHJlc2V0T25Fc2NhcGVQcmVzcztcbiAgfVxuXG4gIGRpc2FibGUobWFwSWQ/OiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuY2VzaXVtU2VydmljZSAmJiAhbWFwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWYgdGhlIHNlcnZpY2Ugd2FzIG5vdCBpbml0aWFsaXplZCB3aXRoIENlc2l1bVNlcnZpY2UsIG1hcElkIG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICB9XG4gICAgY29uc3QgZGF0YSA9IHRoaXMubWFwc1pvb21FbGVtZW50cy5nZXQobWFwSWQgfHwgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldElkKCkpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBkYXRhLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIGlmIChkYXRhLmJvcmRlckVsZW1lbnQpIHtcbiAgICAgICAgZGF0YS5ib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYykge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5tYXBzWm9vbUVsZW1lbnRzLmRlbGV0ZShtYXBJZCk7XG4gIH1cblxuICBwcml2YXRlIHpvb21DYW1lcmFUb1JlY3RhbmdsZShcbiAgICBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHBvc2l0aW9uczogeyBlbmRYOiBudW1iZXI7IGVuZFk6IG51bWJlcjsgc3RhcnRYOiBudW1iZXI7IHN0YXJ0WTogbnVtYmVyIH0sXG4gICAgYW5pbWF0aW9uRHVyYXRpb24sXG4gICk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNhbWVyYSA9IGNhbWVyYVNlcnZpY2UuZ2V0Q2FtZXJhKCk7XG4gICAgY29uc3QgY2FydGVzaWFuMSA9IGNhbWVyYS5waWNrRWxsaXBzb2lkKHt4OiBwb3NpdGlvbnMuc3RhcnRYLCB5OiBwb3NpdGlvbnMuc3RhcnRZfSk7XG4gICAgY29uc3QgY2FydGVzaWFuMiA9IGNhbWVyYS5waWNrRWxsaXBzb2lkKHt4OiBwb3NpdGlvbnMuZW5kWCwgeTogcG9zaXRpb25zLmVuZFl9KTtcbiAgICBpZiAoIWNhcnRlc2lhbjEgfHwgIWNhcnRlc2lhbjIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgY2FydG9ncmFwaGljMSA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjYXJ0ZXNpYW4xKTtcbiAgICBjb25zdCBjYXJ0b2dyYXBoaWMyID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjIpO1xuICAgIGNhbWVyYVNlcnZpY2UuY2FtZXJhRmx5VG8oe1xuICAgICAgZGVzdGluYXRpb246IG5ldyBDZXNpdW0uUmVjdGFuZ2xlKFxuICAgICAgICBNYXRoLm1pbihjYXJ0b2dyYXBoaWMxLmxvbmdpdHVkZSwgY2FydG9ncmFwaGljMi5sb25naXR1ZGUpLFxuICAgICAgICBNYXRoLm1pbihjYXJ0b2dyYXBoaWMxLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMyLmxhdGl0dWRlKSxcbiAgICAgICAgTWF0aC5tYXgoY2FydG9ncmFwaGljMS5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYzIubG9uZ2l0dWRlKSxcbiAgICAgICAgTWF0aC5tYXgoY2FydG9ncmFwaGljMS5sYXRpdHVkZSwgY2FydG9ncmFwaGljMi5sYXRpdHVkZSksXG4gICAgICApLFxuICAgICAgZHVyYXRpb246IGFuaW1hdGlvbkR1cmF0aW9uLFxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=