/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
var AcMapComponent = /** @class */ (function () {
    function AcMapComponent(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, configurationService, screenshotService, contextMenuService, coordinateConverter) {
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
    AcMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcMapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            /** @type {?} */
            var element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error("No element found with id: " + changes['containerId'].currentValue);
            }
        }
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var element = _this.document.getElementById(_this.containerId);
                if (element) {
                    element.appendChild(_this.mapContainer);
                }
                else {
                    throw new Error("No element found with id: " + _this.containerId);
                }
            }), 0);
        }
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    };
    /**
     * @returns ac-map's cesium service
     */
    /**
     * @return {?} ac-map's cesium service
     */
    AcMapComponent.prototype.getCesiumSerivce = /**
     * @return {?} ac-map's cesium service
     */
    function () {
        return this._cesiumService;
    };
    /**
     * @returns map's cesium viewer
     */
    /**
     * @return {?} map's cesium viewer
     */
    AcMapComponent.prototype.getCesiumViewer = /**
     * @return {?} map's cesium viewer
     */
    function () {
        return this._cesiumService.getViewer();
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getCameraService = /**
     * @return {?}
     */
    function () {
        return this._cameraService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.mapId;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getMapContainer = /**
     * @return {?}
     */
    function () {
        return this.mapContainer;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getMapEventsManager = /**
     * @return {?}
     */
    function () {
        return this.mapEventsManager;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getContextMenuService = /**
     * @return {?}
     */
    function () {
        return this.contextMenuService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getScreenshotService = /**
     * @return {?}
     */
    function () {
        return this.screenshotService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getKeyboardControlService = /**
     * @return {?}
     */
    function () {
        return this.keyboardControlService;
    };
    /**
     * @return {?}
     */
    AcMapComponent.prototype.getCoordinateConverter = /**
     * @return {?}
     */
    function () {
        return this.coordinateConverter;
    };
    AcMapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-map',
                    template: "\n    <ac-default-plonter *ngIf=\"!disableDefaultPlonter\"></ac-default-plonter>\n    <ac-context-menu-wrapper></ac-context-menu-wrapper>\n    <ng-content></ng-content>\n  ",
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
    AcMapComponent.ctorParameters = function () { return [
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
    ]; };
    AcMapComponent.propDecorators = {
        disableDefaultPlonter: [{ type: Input }],
        mapId: [{ type: Input }],
        flyTo: [{ type: Input }],
        sceneMode: [{ type: Input }],
        containerId: [{ type: Input }]
    };
    return AcMapComponent;
}());
export { AcMapComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDdkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1B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LDhDQUFrRDs7Ozs7SUFDbEQsMkNBQTRDOztJQUM1Qyw0Q0FBNkM7Ozs7O0lBQzdDLDZDQUFnRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlJztcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEtleWJvYXJkQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZC1jb250cm9sL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcmVlbnNob3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UnO1xuXG4vKipcbiAqIFRoaXMgaXMgYSBtYXAgaW1wbGVtZW50YXRpb24sIGNyZWF0ZXMgdGhlIGNlc2l1bSBtYXAuXG4gKiBFdmVyeSBsYXllciBzaG91bGQgYmUgdGFnIGluc2lkZSBhYy1tYXAgdGFnXG4gKlxuICogQWNjZXNzaW5nIGNlc2l1bSB2aWV3ZXI6XG4gKiAxLiBhY01hcENvbXBvbmVudC5nZXRDZXNpdW1WaWV3ZXIoKVxuICogMi4gVXNlIE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcCgpLmdldENlc2l1bVZpZXdlcigpIG9yIGlmIG1vcmUgdGhlbiBvbmUgbWFwOiBNYXBNYW5hZ2VyU2VydmljZS5nZXRNYXAobWFwSWQpLmdldENlc2l1bVZpZXdlcigpXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiA8YWMtbWFwPlxuICogICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXI+PC9hYy1tYXAtbGF5ZXItcHJvdmlkZXI+XG4gKiAgICAgPGR5bmFtaWMtZWxsaXBzZS1sYXllciAjbGF5ZXI+PC9keW5hbWljLWVsbGlwc2UtbGF5ZXI+XG4gKiA8L2FjLW1hcD5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YWMtZGVmYXVsdC1wbG9udGVyICpuZ0lmPVwiIWRpc2FibGVEZWZhdWx0UGxvbnRlclwiPjwvYWMtZGVmYXVsdC1wbG9udGVyPlxuICAgIDxhYy1jb250ZXh0LW1lbnUtd3JhcHBlcj48L2FjLWNvbnRleHQtbWVudS13cmFwcGVyPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ2VzaXVtU2VydmljZSxcbiAgICBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgIENlc2l1bUV2ZW50QnVpbGRlcixcbiAgICBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxuICAgIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIFBsb250ZXJTZXJ2aWNlLFxuICAgIExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIEN6bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIE1hcExheWVyc1NlcnZpY2UsXG4gICAgQ2FtZXJhU2VydmljZSxcbiAgICBTY3JlZW5zaG90U2VydmljZSxcbiAgICBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQWNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIERpc2FibGUgZGVmYXVsdCBwbG9udGVyIGNvbnRleHQgbWVudVxuICAgKi9cbiAgQElucHV0KClcbiAgZGlzYWJsZURlZmF1bHRQbG9udGVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaWQgbmFtZSBvZiB0aGUgbWFwXG4gICAqIGRlZmF1bHQ6ICdkZWZhdWx0LW1hcC1pZC1baW5kZXhdJ1xuICAgKi9cbiAgQElucHV0KClcbiAgbWFwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogZmx5VG8gb3B0aW9ucyBhY2NvcmRpbmcgdG8gaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBASW5wdXQoKVxuICBmbHlUbzogYW55O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNjZW5lTW9kZTogU2NlbmVNb2RlO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCAtIHRoZSBjb250YWluZXIgZWxlbWVudCdzIGlkIGluIHdoaWNoIHRoZSBtYXAncyBjYW52YXMgd2lsbCBiZSBhcHBlbmRlZCB0by5cbiAgICogSWYgbm90IHN1cHBsaWVkIC0gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdpbGwgYmUgdGhlIHBhcmVudCBlbGVtZW50IG9mIGFjLW1hcDtcbiAgICovXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcklkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBtYXBDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2Nlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtUmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQsXG4gICAgcHJpdmF0ZSBtYXBzTWFuYWdlclNlcnZpY2U6IE1hcHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXJjRHJhd2VyU2VydmljZTogQXJjRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwTGF5ZXJzU2VydmljZTogTWFwTGF5ZXJzU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25TZXJ2aWNlOiBDb25maWd1cmF0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHNjcmVlbnNob3RTZXJ2aWNlOiBTY3JlZW5zaG90U2VydmljZSxcbiAgICBwdWJsaWMgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICApIHtcbiAgICB0aGlzLm1hcENvbnRhaW5lciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdtYXAtY29udGFpbmVyJztcbiAgICB0aGlzLl9jZXNpdW1TZXJ2aWNlLmluaXQodGhpcy5tYXBDb250YWluZXIsIHRoaXMpO1xuICAgIHRoaXMuX2NhbWVyYVNlcnZpY2UuaW5pdCh0aGlzLl9jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuYmlsbGJvYXJkRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5sYWJlbERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuZWxsaXBzZURyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9seWxpbmVEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLnBvbHlnb25EcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmFyY0RyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9pbnREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmN6bWxEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFwSWQgPSB0aGlzLm1hcHNNYW5hZ2VyU2VydmljZS5fcmVnaXN0ZXJNYXAodGhpcy5tYXBJZCwgdGhpcyk7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcklkKSB7XG4gICAgICB0aGlzLl9lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2NlbmVNb2RlJ10pIHtcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2Uuc2V0U2NlbmVNb2RlKGNoYW5nZXNbJ3NjZW5lTW9kZSddLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydmbHlUbyddKSB7XG4gICAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLmNhbWVyYUZseVRvKGNoYW5nZXNbJ2ZseVRvJ10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10gJiYgIWNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uY3VycmVudFZhbHVlKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGZvdW5kIHdpdGggaWQ6ICR7Y2hhbmdlc1snY29udGFpbmVySWQnXS5jdXJyZW50VmFsdWV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5kcmF3QWxsTGF5ZXJzKCk7XG4gICAgaWYgKHRoaXMuY29udGFpbmVySWQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcklkKTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHt0aGlzLmNvbnRhaW5lcklkfWApO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ZXIgPSB0aGlzLmdldENlc2l1bVZpZXdlcigpO1xuICAgIHZpZXdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXBDb250YWluZXIucmVtb3ZlKCk7XG4gICAgdGhpcy5tYXBzTWFuYWdlclNlcnZpY2UuX3JlbW92ZU1hcEJ5SWQodGhpcy5tYXBJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYWMtbWFwJ3MgY2VzaXVtIHNlcnZpY2VcbiAgICovXG4gIGdldENlc2l1bVNlcml2Y2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgbWFwJ3MgY2VzaXVtIHZpZXdlclxuICAgKi9cbiAgZ2V0Q2VzaXVtVmlld2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICB9XG5cblxuICBnZXRDYW1lcmFTZXJ2aWNlKCk6IENhbWVyYVNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9jYW1lcmFTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwSWQ7XG4gIH1cblxuXG4gIGdldE1hcENvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBDb250YWluZXI7XG4gIH1cblxuXG4gIGdldE1hcEV2ZW50c01hbmFnZXIoKTogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLm1hcEV2ZW50c01hbmFnZXI7XG4gIH1cblxuICBnZXRDb250ZXh0TWVudVNlcnZpY2UoKTogQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWVudVNlcnZpY2U7XG4gIH1cblxuICBnZXRTY3JlZW5zaG90U2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5zaG90U2VydmljZTtcbiAgfVxuXG4gIGdldEtleWJvYXJkQ29udHJvbFNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZTtcbiAgfVxuXG4gIGdldENvb3JkaW5hdGVDb252ZXJ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgfVxufVxuIl19