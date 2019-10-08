/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input } from '@angular/core';
import { ConfigurationService } from '../../cesium-enhancements/ConfigurationService';
import { SceneMode } from '../../models/scene-mode.enum';
import { CameraService } from '../../services/camera/camera.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { MapsManagerService } from '../../services/maps-manager/maps-manager.service';
import { PlonterService } from '../../services/plonter/plonter.service';
import { ScreenshotService } from '../../services/screenshot/screenshot.service';
/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getCesiumViewer()
 * 2. Use MapManagerService.getMap().getCesiumViewer() or if more then one map: MapManagerService.getMap(mapId).getCesiumViewer()
 *
 *
 * \@example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
export class AcMapComponent {
    /**
     * @param {?} _cesiumService
     * @param {?} _cameraService
     * @param {?} _elemRef
     * @param {?} document
     * @param {?} mapsManagerService
     * @param {?} billboardDrawerService
     * @param {?} labelDrawerService
     * @param {?} ellipseDrawerService
     * @param {?} polylineDrawerService
     * @param {?} polygonDrawerService
     * @param {?} arcDrawerService
     * @param {?} pointDrawerService
     * @param {?} czmlDrawerService
     * @param {?} mapEventsManager
     * @param {?} keyboardControlService
     * @param {?} mapLayersService
     * @param {?} configurationService
     * @param {?} screenshotService
     * @param {?} contextMenuService
     * @param {?} coordinateConverter
     */
    constructor(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, configurationService, screenshotService, contextMenuService, coordinateConverter) {
        this._cesiumService = _cesiumService;
        this._cameraService = _cameraService;
        this._elemRef = _elemRef;
        this.document = document;
        this.mapsManagerService = mapsManagerService;
        this.billboardDrawerService = billboardDrawerService;
        this.labelDrawerService = labelDrawerService;
        this.ellipseDrawerService = ellipseDrawerService;
        this.polylineDrawerService = polylineDrawerService;
        this.polygonDrawerService = polygonDrawerService;
        this.arcDrawerService = arcDrawerService;
        this.pointDrawerService = pointDrawerService;
        this.czmlDrawerService = czmlDrawerService;
        this.mapEventsManager = mapEventsManager;
        this.keyboardControlService = keyboardControlService;
        this.mapLayersService = mapLayersService;
        this.configurationService = configurationService;
        this.screenshotService = screenshotService;
        this.contextMenuService = contextMenuService;
        this.coordinateConverter = coordinateConverter;
        /**
         * Disable default plonter context menu
         */
        this.disableDefaultPlonter = false;
        this.mapContainer = this.document.createElement('div');
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        this.mapContainer.className = 'map-container';
        this._cesiumService.init(this.mapContainer, this);
        this._cameraService.init(this._cesiumService);
        this.mapEventsManager.init();
        this.billboardDrawerService.init();
        this.labelDrawerService.init();
        this.ellipseDrawerService.init();
        this.polylineDrawerService.init();
        this.polygonDrawerService.init();
        this.arcDrawerService.init();
        this.pointDrawerService.init();
        this.czmlDrawerService.init();
        this.keyboardControlService.init();
        this.contextMenuService.init(this.mapEventsManager);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            /** @type {?} */
            const element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const element = this.document.getElementById(this.containerId);
                if (element) {
                    element.appendChild(this.mapContainer);
                }
                else {
                    throw new Error(`No element found with id: ${this.containerId}`);
                }
            }), 0);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    }
    /**
     * @return {?} ac-map's cesium service
     */
    getCesiumSerivce() {
        return this._cesiumService;
    }
    /**
     * @return {?} map's cesium viewer
     */
    getCesiumViewer() {
        return this._cesiumService.getViewer();
    }
    /**
     * @return {?}
     */
    getCameraService() {
        return this._cameraService;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.mapId;
    }
    /**
     * @return {?}
     */
    getMapContainer() {
        return this.mapContainer;
    }
    /**
     * @return {?}
     */
    getMapEventsManager() {
        return this.mapEventsManager;
    }
    /**
     * @return {?}
     */
    getContextMenuService() {
        return this.contextMenuService;
    }
    /**
     * @return {?}
     */
    getScreenshotService() {
        return this.screenshotService;
    }
    /**
     * @return {?}
     */
    getKeyboardControlService() {
        return this.keyboardControlService;
    }
    /**
     * @return {?}
     */
    getCoordinateConverter() {
        return this.coordinateConverter;
    }
}
AcMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-map',
                template: `
    <ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `,
                providers: [
                    CesiumService,
                    BillboardDrawerService,
                    CesiumEventBuilder,
                    KeyboardControlService,
                    MapEventsManagerService,
                    PlonterService,
                    LabelDrawerService,
                    PolylineDrawerService,
                    PolylinePrimitiveDrawerService,
                    EllipseDrawerService,
                    PointDrawerService,
                    ArcDrawerService,
                    CzmlDrawerService,
                    PolygonDrawerService,
                    MapLayersService,
                    CameraService,
                    ScreenshotService,
                    ContextMenuService,
                    CoordinateConverter,
                ]
            }] }
];
/** @nocollapse */
AcMapComponent.ctorParameters = () => [
    { type: CesiumService },
    { type: CameraService },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: MapsManagerService },
    { type: BillboardDrawerService },
    { type: LabelDrawerService },
    { type: EllipseDrawerService },
    { type: PolylineDrawerService },
    { type: PolygonDrawerService },
    { type: ArcDrawerService },
    { type: PointDrawerService },
    { type: CzmlDrawerService },
    { type: MapEventsManagerService },
    { type: KeyboardControlService },
    { type: MapLayersService },
    { type: ConfigurationService },
    { type: ScreenshotService },
    { type: ContextMenuService },
    { type: CoordinateConverter }
];
AcMapComponent.propDecorators = {
    disableDefaultPlonter: [{ type: Input }],
    mapId: [{ type: Input }],
    flyTo: [{ type: Input }],
    sceneMode: [{ type: Input }],
    containerId: [{ type: Input }]
};
if (false) {
    /**
     * Disable default plonter context menu
     * @type {?}
     */
    AcMapComponent.prototype.disableDefaultPlonter;
    /**
     * Set the id name of the map
     * default: 'default-map-id-[index]'
     * @type {?}
     */
    AcMapComponent.prototype.mapId;
    /**
     * flyTo options according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     * @type {?}
     */
    AcMapComponent.prototype.flyTo;
    /**
     * Sets the map's SceneMode
     * @type {?}
     */
    AcMapComponent.prototype.sceneMode;
    /**
     * Optional - the container element's id in which the map's canvas will be appended to.
     * If not supplied - the container element will be the parent element of ac-map;
     * @type {?}
     */
    AcMapComponent.prototype.containerId;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.mapContainer;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype._cesiumService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype._cameraService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype._elemRef;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.document;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.mapsManagerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.billboardDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.labelDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.ellipseDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.polylineDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.polygonDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.arcDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.pointDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.czmlDrawerService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.keyboardControlService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.mapLayersService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.configurationService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.screenshotService;
    /** @type {?} */
    AcMapComponent.prototype.contextMenuService;
    /**
     * @type {?}
     * @private
     */
    AcMapComponent.prototype.coordinateConverter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDdkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1B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LGlCQUFpQjtvQkFDakIsa0JBQWtCO29CQUNsQixtQkFBbUI7aUJBQ3BCO2FBQ0Y7Ozs7WUEvRFEsYUFBYTtZQURiLGFBQWE7WUFIYSxVQUFVOzRDQTJHeEMsTUFBTSxTQUFDLFFBQVE7WUF2Rlgsa0JBQWtCO1lBWmxCLHNCQUFzQjtZQUd0QixrQkFBa0I7WUFEbEIsb0JBQW9CO1lBSXBCLHFCQUFxQjtZQURyQixvQkFBb0I7WUFOcEIsZ0JBQWdCO1lBS2hCLGtCQUFrQjtZQUhsQixpQkFBaUI7WUFTakIsdUJBQXVCO1lBRnZCLHNCQUFzQjtZQUd0QixnQkFBZ0I7WUFsQmhCLG9CQUFvQjtZQXFCcEIsaUJBQWlCO1lBakJqQixrQkFBa0I7WUFDbEIsbUJBQW1COzs7b0NBa0V6QixLQUFLO29CQU9MLEtBQUs7b0JBTUwsS0FBSzt3QkFNTCxLQUFLOzBCQU9MLEtBQUs7Ozs7Ozs7SUExQk4sK0NBQzhCOzs7Ozs7SUFNOUIsK0JBQ2M7Ozs7O0lBS2QsK0JBQ1c7Ozs7O0lBS1gsbUNBQ3FCOzs7Ozs7SUFNckIscUNBQ29COzs7OztJQUVwQixzQ0FBa0M7Ozs7O0lBR2hDLHdDQUFxQzs7Ozs7SUFDckMsd0NBQXFDOzs7OztJQUNyQyxrQ0FBNEI7Ozs7O0lBQzVCLGtDQUFrQzs7Ozs7SUFDbEMsNENBQThDOzs7OztJQUM5QyxnREFBc0Q7Ozs7O0lBQ3RELDRDQUE4Qzs7Ozs7SUFDOUMsOENBQWtEOzs7OztJQUNsRCwrQ0FBb0Q7Ozs7O0lBQ3BELDhDQUFrRDs7Ozs7SUFDbEQsMENBQTBDOzs7OztJQUMxQyw0Q0FBOEM7Ozs7O0lBQzlDLDJDQUE0Qzs7Ozs7SUFDNUMsMENBQWlEOzs7OztJQUNqRCxnREFBc0Q7Ozs7O0lBQ3RELDBDQUEwQzs7Ozs7SUFDMUMsOENBQWtEOzs7OztJQUNsRCwyQ0FBNEM7O0lBQzVDLDRDQUE2Qzs7Ozs7SUFDN0MsNkNBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1kcmF3ZXIvYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtZHJhd2VyL2xhYmVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtZHJhd2VyL3BvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgS2V5Ym9hcmRDb250cm9sU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2tleWJvYXJkLWNvbnRyb2wva2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50QnVpbGRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY2VzaXVtLWV2ZW50LWJ1aWxkZXInO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2NyZWVuc2hvdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zY3JlZW5zaG90L3NjcmVlbnNob3Quc2VydmljZSc7XG5cbi8qKlxuICogVGhpcyBpcyBhIG1hcCBpbXBsZW1lbnRhdGlvbiwgY3JlYXRlcyB0aGUgY2VzaXVtIG1hcC5cbiAqIEV2ZXJ5IGxheWVyIHNob3VsZCBiZSB0YWcgaW5zaWRlIGFjLW1hcCB0YWdcbiAqXG4gKiBBY2Nlc3NpbmcgY2VzaXVtIHZpZXdlcjpcbiAqIDEuIGFjTWFwQ29tcG9uZW50LmdldENlc2l1bVZpZXdlcigpXG4gKiAyLiBVc2UgTWFwTWFuYWdlclNlcnZpY2UuZ2V0TWFwKCkuZ2V0Q2VzaXVtVmlld2VyKCkgb3IgaWYgbW9yZSB0aGVuIG9uZSBtYXA6IE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcChtYXBJZCkuZ2V0Q2VzaXVtVmlld2VyKClcbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIDxhYy1tYXA+XG4gKiAgICAgPGFjLW1hcC1sYXllci1wcm92aWRlcj48L2FjLW1hcC1sYXllci1wcm92aWRlcj5cbiAqICAgICA8ZHluYW1pYy1lbGxpcHNlLWxheWVyICNsYXllcj48L2R5bmFtaWMtZWxsaXBzZS1sYXllcj5cbiAqIDwvYWMtbWFwPlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1tYXAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhYy1kZWZhdWx0LXBsb250ZXIgKm5nSWY9XCIhZGlzYWJsZURlZmF1bHRQbG9udGVyXCI+PC9hYy1kZWZhdWx0LXBsb250ZXI+XG4gICAgPGFjLWNvbnRleHQtbWVudS13cmFwcGVyPjwvYWMtY29udGV4dC1tZW51LXdyYXBwZXI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICBgLFxuICBwcm92aWRlcnM6IFtcbiAgICBDZXNpdW1TZXJ2aWNlLFxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgQ2VzaXVtRXZlbnRCdWlsZGVyLFxuICAgIEtleWJvYXJkQ29udHJvbFNlcnZpY2UsXG4gICAgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgUGxvbnRlclNlcnZpY2UsXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIEFyY0RyYXdlclNlcnZpY2UsXG4gICAgQ3ptbERyYXdlclNlcnZpY2UsXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgTWFwTGF5ZXJzU2VydmljZSxcbiAgICBDYW1lcmFTZXJ2aWNlLFxuICAgIFNjcmVlbnNob3RTZXJ2aWNlLFxuICAgIENvbnRleHRNZW51U2VydmljZSxcbiAgICBDb29yZGluYXRlQ29udmVydGVyLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogRGlzYWJsZSBkZWZhdWx0IHBsb250ZXIgY29udGV4dCBtZW51XG4gICAqL1xuICBASW5wdXQoKVxuICBkaXNhYmxlRGVmYXVsdFBsb250ZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogU2V0IHRoZSBpZCBuYW1lIG9mIHRoZSBtYXBcbiAgICogZGVmYXVsdDogJ2RlZmF1bHQtbWFwLWlkLVtpbmRleF0nXG4gICAqL1xuICBASW5wdXQoKVxuICBtYXBJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBmbHlUbyBvcHRpb25zIGFjY29yZGluZyB0byBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW0jZmx5VG9cbiAgICovXG4gIEBJbnB1dCgpXG4gIGZseVRvOiBhbnk7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1hcCdzIFNjZW5lTW9kZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2NlbmVNb2RlOiBTY2VuZU1vZGU7XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIC0gdGhlIGNvbnRhaW5lciBlbGVtZW50J3MgaWQgaW4gd2hpY2ggdGhlIG1hcCdzIGNhbnZhcyB3aWxsIGJlIGFwcGVuZGVkIHRvLlxuICAgKiBJZiBub3Qgc3VwcGxpZWQgLSB0aGUgY29udGFpbmVyIGVsZW1lbnQgd2lsbCBiZSB0aGUgcGFyZW50IGVsZW1lbnQgb2YgYWMtbWFwO1xuICAgKi9cbiAgQElucHV0KClcbiAgY29udGFpbmVySWQ6IHN0cmluZztcblxuICBwcml2YXRlIG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICBwcml2YXRlIF9jYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudCxcbiAgICBwcml2YXRlIG1hcHNNYW5hZ2VyU2VydmljZTogTWFwc01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYmlsbGJvYXJkRHJhd2VyU2VydmljZTogQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGxhYmVsRHJhd2VyU2VydmljZTogTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxsaXBzZURyYXdlclNlcnZpY2U6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5Z29uRHJhd2VyU2VydmljZTogUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBhcmNEcmF3ZXJTZXJ2aWNlOiBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9pbnREcmF3ZXJTZXJ2aWNlOiBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjem1sRHJhd2VyU2VydmljZTogQ3ptbERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGtleWJvYXJkQ29udHJvbFNlcnZpY2U6IEtleWJvYXJkQ29udHJvbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBtYXBMYXllcnNTZXJ2aWNlOiBNYXBMYXllcnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblNlcnZpY2U6IENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgc2NyZWVuc2hvdFNlcnZpY2U6IFNjcmVlbnNob3RTZXJ2aWNlLFxuICAgIHB1YmxpYyBjb250ZXh0TWVudVNlcnZpY2U6IENvbnRleHRNZW51U2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICkge1xuICAgIHRoaXMubWFwQ29udGFpbmVyID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLm1hcENvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLm1hcENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgdGhpcy5tYXBDb250YWluZXIuY2xhc3NOYW1lID0gJ21hcC1jb250YWluZXInO1xuICAgIHRoaXMuX2Nlc2l1bVNlcnZpY2UuaW5pdCh0aGlzLm1hcENvbnRhaW5lciwgdGhpcyk7XG4gICAgdGhpcy5fY2FtZXJhU2VydmljZS5pbml0KHRoaXMuX2Nlc2l1bVNlcnZpY2UpO1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlci5pbml0KCk7XG4gICAgdGhpcy5iaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmxhYmVsRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5lbGxpcHNlRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5wb2x5bGluZURyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9seWdvbkRyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuYXJjRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5wb2ludERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuY3ptbERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXBJZCA9IHRoaXMubWFwc01hbmFnZXJTZXJ2aWNlLl9yZWdpc3Rlck1hcCh0aGlzLm1hcElkLCB0aGlzKTtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVySWQpIHtcbiAgICAgIHRoaXMuX2VsZW1SZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hcENvbnRhaW5lcik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzY2VuZU1vZGUnXSkge1xuICAgICAgdGhpcy5fY2FtZXJhU2VydmljZS5zZXRTY2VuZU1vZGUoY2hhbmdlc1snc2NlbmVNb2RlJ10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2ZseVRvJ10pIHtcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2UuY2FtZXJhRmx5VG8oY2hhbmdlc1snZmx5VG8nXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snY29udGFpbmVySWQnXSAmJiAhY2hhbmdlc1snY29udGFpbmVySWQnXS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhbmdlc1snY29udGFpbmVySWQnXS5jdXJyZW50VmFsdWUpO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hcENvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHtjaGFuZ2VzWydjb250YWluZXJJZCddLmN1cnJlbnRWYWx1ZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLmRyYXdBbGxMYXllcnMoKTtcbiAgICBpZiAodGhpcy5jb250YWluZXJJZCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVySWQpO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZWxlbWVudCBmb3VuZCB3aXRoIGlkOiAke3RoaXMuY29udGFpbmVySWR9YCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNvbnN0IHZpZXdlciA9IHRoaXMuZ2V0Q2VzaXVtVmlld2VyKCk7XG4gICAgdmlld2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLm1hcENvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB0aGlzLm1hcHNNYW5hZ2VyU2VydmljZS5fcmVtb3ZlTWFwQnlJZCh0aGlzLm1hcElkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBhYy1tYXAncyBjZXNpdW0gc2VydmljZVxuICAgKi9cbiAgZ2V0Q2VzaXVtU2VyaXZjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtU2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBtYXAncyBjZXNpdW0gdmlld2VyXG4gICAqL1xuICBnZXRDZXNpdW1WaWV3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XG4gIH1cblxuXG4gIGdldENhbWVyYVNlcnZpY2UoKTogQ2FtZXJhU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbWVyYVNlcnZpY2U7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBJZDtcbiAgfVxuXG5cbiAgZ2V0TWFwQ29udGFpbmVyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcENvbnRhaW5lcjtcbiAgfVxuXG5cbiAgZ2V0TWFwRXZlbnRzTWFuYWdlcigpOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMubWFwRXZlbnRzTWFuYWdlcjtcbiAgfVxuXG4gIGdldENvbnRleHRNZW51U2VydmljZSgpOiBDb250ZXh0TWVudVNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHRNZW51U2VydmljZTtcbiAgfVxuXG4gIGdldFNjcmVlbnNob3RTZXJ2aWNlKCkge1xuICAgIHJldHVybiB0aGlzLnNjcmVlbnNob3RTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0S2V5Ym9hcmRDb250cm9sU2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0Q29vcmRpbmF0ZUNvbnZlcnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyO1xuICB9XG59XG4iXX0=