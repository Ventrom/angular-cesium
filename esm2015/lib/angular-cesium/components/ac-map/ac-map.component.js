import { __decorate, __metadata, __param } from "tslib";
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { ConfigurationService } from '../../cesium-enhancements/ConfigurationService';
import { SceneMode } from '../../models/scene-mode.enum';
import { CameraService } from '../../services/camera/camera.service';
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
 * @example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
let AcMapComponent = class AcMapComponent {
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
    ngOnInit() {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    }
    ngOnChanges(changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            const element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
            }
        }
    }
    ngAfterViewInit() {
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout(() => {
                const element = this.document.getElementById(this.containerId);
                if (element) {
                    element.appendChild(this.mapContainer);
                }
                else {
                    throw new Error(`No element found with id: ${this.containerId}`);
                }
            }, 0);
        }
    }
    ngOnDestroy() {
        const viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    }
    /**
     * @returns ac-map's cesium service
     */
    getCesiumService() {
        return this._cesiumService;
    }
    /**
     * @returns map's cesium viewer
     */
    getCesiumViewer() {
        return this._cesiumService.getViewer();
    }
    getCameraService() {
        return this._cameraService;
    }
    getId() {
        return this.mapId;
    }
    getMapContainer() {
        return this.mapContainer;
    }
    getMapEventsManager() {
        return this.mapEventsManager;
    }
    getContextMenuService() {
        return this.contextMenuService;
    }
    getScreenshotService() {
        return this.screenshotService;
    }
    getKeyboardControlService() {
        return this.keyboardControlService;
    }
    getCoordinateConverter() {
        return this.coordinateConverter;
    }
};
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
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcMapComponent.prototype, "disableDefaultPlonter", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], AcMapComponent.prototype, "mapId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcMapComponent.prototype, "flyTo", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], AcMapComponent.prototype, "sceneMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], AcMapComponent.prototype, "containerId", void 0);
AcMapComponent = __decorate([
    Component({
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
    }),
    __param(3, Inject(DOCUMENT)),
    __metadata("design:paramtypes", [CesiumService,
        CameraService,
        ElementRef, Object, MapsManagerService,
        BillboardDrawerService,
        LabelDrawerService,
        EllipseDrawerService,
        PolylineDrawerService,
        PolygonDrawerService,
        ArcDrawerService,
        PointDrawerService,
        CzmlDrawerService,
        MapEventsManagerService,
        KeyboardControlService,
        MapLayersService,
        ConfigurationService,
        ScreenshotService,
        ContextMenuService,
        CoordinateConverter])
], AcMapComponent);
export { AcMapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDdkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1B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akIsa0JBQWtCO1lBQ2hCLG1CQUFtQjs7QUFsRGxEO0lBREMsS0FBSyxFQUFFOzs2REFDc0I7QUFPOUI7SUFEQyxLQUFLLEVBQUU7OzZDQUNNO0FBTWQ7SUFEQyxLQUFLLEVBQUU7OzZDQUNHO0FBTVg7SUFEQyxLQUFLLEVBQUU7O2lEQUNhO0FBT3JCO0lBREMsS0FBSyxFQUFFOzttREFDWTtBQS9CVCxjQUFjO0lBN0IxQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUU7Ozs7R0FJVDtRQUNELFNBQVMsRUFBRTtZQUNULGFBQWE7WUFDYixzQkFBc0I7WUFDdEIsa0JBQWtCO1lBQ2xCLHNCQUFzQjtZQUN0Qix1QkFBdUI7WUFDdkIsY0FBYztZQUNkLGtCQUFrQjtZQUNsQixxQkFBcUI7WUFDckIsOEJBQThCO1lBQzlCLG9CQUFvQjtZQUNwQixrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLGlCQUFpQjtZQUNqQixvQkFBb0I7WUFDcEIsZ0JBQWdCO1lBQ2hCLGFBQWE7WUFDYixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLG1CQUFtQjtTQUNwQjtLQUNGLENBQUM7SUF3Q0csV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7cUNBSE8sYUFBYTtRQUNiLGFBQWE7UUFDbkIsVUFBVSxVQUVBLGtCQUFrQjtRQUNkLHNCQUFzQjtRQUMxQixrQkFBa0I7UUFDaEIsb0JBQW9CO1FBQ25CLHFCQUFxQjtRQUN0QixvQkFBb0I7UUFDeEIsZ0JBQWdCO1FBQ2Qsa0JBQWtCO1FBQ25CLGlCQUFpQjtRQUNsQix1QkFBdUI7UUFDakIsc0JBQXNCO1FBQzVCLGdCQUFnQjtRQUNaLG9CQUFvQjtRQUN2QixpQkFBaUI7UUFDakIsa0JBQWtCO1FBQ2hCLG1CQUFtQjtHQXZEdkMsY0FBYyxDQXlLMUI7U0F6S1ksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEtleWJvYXJkQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZC1jb250cm9sL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcmVlbnNob3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UnO1xuXG4vKipcbiAqIFRoaXMgaXMgYSBtYXAgaW1wbGVtZW50YXRpb24sIGNyZWF0ZXMgdGhlIGNlc2l1bSBtYXAuXG4gKiBFdmVyeSBsYXllciBzaG91bGQgYmUgdGFnIGluc2lkZSBhYy1tYXAgdGFnXG4gKlxuICogQWNjZXNzaW5nIGNlc2l1bSB2aWV3ZXI6XG4gKiAxLiBhY01hcENvbXBvbmVudC5nZXRDZXNpdW1WaWV3ZXIoKVxuICogMi4gVXNlIE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcCgpLmdldENlc2l1bVZpZXdlcigpIG9yIGlmIG1vcmUgdGhlbiBvbmUgbWFwOiBNYXBNYW5hZ2VyU2VydmljZS5nZXRNYXAobWFwSWQpLmdldENlc2l1bVZpZXdlcigpXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiA8YWMtbWFwPlxuICogICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXI+PC9hYy1tYXAtbGF5ZXItcHJvdmlkZXI+XG4gKiAgICAgPGR5bmFtaWMtZWxsaXBzZS1sYXllciAjbGF5ZXI+PC9keW5hbWljLWVsbGlwc2UtbGF5ZXI+XG4gKiA8L2FjLW1hcD5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YWMtZGVmYXVsdC1wbG9udGVyICpuZ0lmPVwiIWRpc2FibGVEZWZhdWx0UGxvbnRlclwiPjwvYWMtZGVmYXVsdC1wbG9udGVyPlxuICAgIDxhYy1jb250ZXh0LW1lbnUtd3JhcHBlcj48L2FjLWNvbnRleHQtbWVudS13cmFwcGVyPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ2VzaXVtU2VydmljZSxcbiAgICBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgIENlc2l1bUV2ZW50QnVpbGRlcixcbiAgICBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxuICAgIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIFBsb250ZXJTZXJ2aWNlLFxuICAgIExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLFxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIEN6bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIE1hcExheWVyc1NlcnZpY2UsXG4gICAgQ2FtZXJhU2VydmljZSxcbiAgICBTY3JlZW5zaG90U2VydmljZSxcbiAgICBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQWNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIERpc2FibGUgZGVmYXVsdCBwbG9udGVyIGNvbnRleHQgbWVudVxuICAgKi9cbiAgQElucHV0KClcbiAgZGlzYWJsZURlZmF1bHRQbG9udGVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaWQgbmFtZSBvZiB0aGUgbWFwXG4gICAqIGRlZmF1bHQ6ICdkZWZhdWx0LW1hcC1pZC1baW5kZXhdJ1xuICAgKi9cbiAgQElucHV0KClcbiAgbWFwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogZmx5VG8gb3B0aW9ucyBhY2NvcmRpbmcgdG8gaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBASW5wdXQoKVxuICBmbHlUbzogYW55O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNjZW5lTW9kZTogU2NlbmVNb2RlO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCAtIHRoZSBjb250YWluZXIgZWxlbWVudCdzIGlkIGluIHdoaWNoIHRoZSBtYXAncyBjYW52YXMgd2lsbCBiZSBhcHBlbmRlZCB0by5cbiAgICogSWYgbm90IHN1cHBsaWVkIC0gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdpbGwgYmUgdGhlIHBhcmVudCBlbGVtZW50IG9mIGFjLW1hcDtcbiAgICovXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcklkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBtYXBDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2Nlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtUmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQsXG4gICAgcHJpdmF0ZSBtYXBzTWFuYWdlclNlcnZpY2U6IE1hcHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXJjRHJhd2VyU2VydmljZTogQXJjRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwTGF5ZXJzU2VydmljZTogTWFwTGF5ZXJzU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25TZXJ2aWNlOiBDb25maWd1cmF0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHNjcmVlbnNob3RTZXJ2aWNlOiBTY3JlZW5zaG90U2VydmljZSxcbiAgICBwdWJsaWMgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICApIHtcbiAgICB0aGlzLm1hcENvbnRhaW5lciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdtYXAtY29udGFpbmVyJztcbiAgICB0aGlzLl9jZXNpdW1TZXJ2aWNlLmluaXQodGhpcy5tYXBDb250YWluZXIsIHRoaXMpO1xuICAgIHRoaXMuX2NhbWVyYVNlcnZpY2UuaW5pdCh0aGlzLl9jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuYmlsbGJvYXJkRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5sYWJlbERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuZWxsaXBzZURyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9seWxpbmVEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLnBvbHlnb25EcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmFyY0RyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9pbnREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmN6bWxEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFwSWQgPSB0aGlzLm1hcHNNYW5hZ2VyU2VydmljZS5fcmVnaXN0ZXJNYXAodGhpcy5tYXBJZCwgdGhpcyk7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcklkKSB7XG4gICAgICB0aGlzLl9lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2NlbmVNb2RlJ10pIHtcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2Uuc2V0U2NlbmVNb2RlKGNoYW5nZXNbJ3NjZW5lTW9kZSddLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydmbHlUbyddKSB7XG4gICAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLmNhbWVyYUZseVRvKGNoYW5nZXNbJ2ZseVRvJ10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10gJiYgIWNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uY3VycmVudFZhbHVlKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGZvdW5kIHdpdGggaWQ6ICR7Y2hhbmdlc1snY29udGFpbmVySWQnXS5jdXJyZW50VmFsdWV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5kcmF3QWxsTGF5ZXJzKCk7XG4gICAgaWYgKHRoaXMuY29udGFpbmVySWQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcklkKTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHt0aGlzLmNvbnRhaW5lcklkfWApO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ZXIgPSB0aGlzLmdldENlc2l1bVZpZXdlcigpO1xuICAgIHZpZXdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXBDb250YWluZXIucmVtb3ZlKCk7XG4gICAgdGhpcy5tYXBzTWFuYWdlclNlcnZpY2UuX3JlbW92ZU1hcEJ5SWQodGhpcy5tYXBJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYWMtbWFwJ3MgY2VzaXVtIHNlcnZpY2VcbiAgICovXG4gIGdldENlc2l1bVNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgbWFwJ3MgY2VzaXVtIHZpZXdlclxuICAgKi9cbiAgZ2V0Q2VzaXVtVmlld2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICB9XG5cblxuICBnZXRDYW1lcmFTZXJ2aWNlKCk6IENhbWVyYVNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9jYW1lcmFTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwSWQ7XG4gIH1cblxuXG4gIGdldE1hcENvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBDb250YWluZXI7XG4gIH1cblxuXG4gIGdldE1hcEV2ZW50c01hbmFnZXIoKTogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLm1hcEV2ZW50c01hbmFnZXI7XG4gIH1cblxuICBnZXRDb250ZXh0TWVudVNlcnZpY2UoKTogQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWVudVNlcnZpY2U7XG4gIH1cblxuICBnZXRTY3JlZW5zaG90U2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5zaG90U2VydmljZTtcbiAgfVxuXG4gIGdldEtleWJvYXJkQ29udHJvbFNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZTtcbiAgfVxuXG4gIGdldENvb3JkaW5hdGVDb252ZXJ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgfVxufVxuIl19