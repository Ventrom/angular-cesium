import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
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
import { PlonterService } from '../../services/plonter/plonter.service';
import { ScreenshotService } from '../../services/screenshot/screenshot.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
import * as i2 from "../../services/camera/camera.service";
import * as i3 from "../../services/maps-manager/maps-manager.service";
import * as i4 from "../../services/drawers/billboard-drawer/billboard-drawer.service";
import * as i5 from "../../services/drawers/label-drawer/label-drawer.service";
import * as i6 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i7 from "../../services/drawers/polyline-drawer/polyline-drawer.service";
import * as i8 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i9 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i10 from "../../services/drawers/point-drawer/point-drawer.service";
import * as i11 from "../../services/drawers/czml-drawer/czml-drawer.service";
import * as i12 from "../../services/map-events-mananger/map-events-manager";
import * as i13 from "../../services/keyboard-control/keyboard-control.service";
import * as i14 from "../../services/map-layers/map-layers.service";
import * as i15 from "../../cesium-enhancements/ConfigurationService";
import * as i16 from "../../services/screenshot/screenshot.service";
import * as i17 from "../../services/context-menu/context-menu.service";
import * as i18 from "../../services/coordinate-converter/coordinate-converter.service";
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
export class AcMapComponent {
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
        this.disableDefaultPlonter = true;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcMapComponent, deps: [{ token: i1.CesiumService }, { token: i2.CameraService }, { token: i0.ElementRef }, { token: DOCUMENT }, { token: i3.MapsManagerService }, { token: i4.BillboardDrawerService }, { token: i5.LabelDrawerService }, { token: i6.EllipseDrawerService }, { token: i7.PolylineDrawerService }, { token: i8.PolygonDrawerService }, { token: i9.ArcDrawerService }, { token: i10.PointDrawerService }, { token: i11.CzmlDrawerService }, { token: i12.MapEventsManagerService }, { token: i13.KeyboardControlService }, { token: i14.MapLayersService }, { token: i15.ConfigurationService }, { token: i16.ScreenshotService }, { token: i17.ContextMenuService }, { token: i18.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcMapComponent, selector: "ac-map", inputs: { disableDefaultPlonter: "disableDefaultPlonter", mapId: "mapId", flyTo: "flyTo", sceneMode: "sceneMode", containerId: "containerId" }, providers: [
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
        ], usesOnChanges: true, ngImport: i0, template: `
    <ng-content></ng-content>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcMapComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map',
                    template: `
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
                    ],
                }]
        }], ctorParameters: () => [{ type: i1.CesiumService }, { type: i2.CameraService }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.MapsManagerService }, { type: i4.BillboardDrawerService }, { type: i5.LabelDrawerService }, { type: i6.EllipseDrawerService }, { type: i7.PolylineDrawerService }, { type: i8.PolygonDrawerService }, { type: i9.ArcDrawerService }, { type: i10.PointDrawerService }, { type: i11.CzmlDrawerService }, { type: i12.MapEventsManagerService }, { type: i13.KeyboardControlService }, { type: i14.MapLayersService }, { type: i15.ConfigurationService }, { type: i16.ScreenshotService }, { type: i17.ContextMenuService }, { type: i18.CoordinateConverter }], propDecorators: { disableDefaultPlonter: [{
                type: Input
            }], mapId: [{
                type: Input
            }], flyTo: [{
                type: Input
            }], sceneMode: [{
                type: Input
            }], containerId: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFpQixTQUFTLEVBQWMsTUFBTSxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBR3JFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN0RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUMxRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUNwSSxPQUFPLEVB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a0JBM0IxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxRQUFRO29CQUNsQixRQUFRLEVBQUU7O0dBRVQ7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULGFBQWE7d0JBQ2Isc0JBQXNCO3dCQUN0QixrQkFBa0I7d0JBQ2xCLHNCQUFzQjt3QkFDdEIsdUJBQXVCO3dCQUN2QixjQUFjO3dCQUNkLGtCQUFrQjt3QkFDbEIscUJBQXFCO3dCQUNyQiw4QkFBOEI7d0JBQzlCLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixnQkFBZ0I7d0JBQ2hCLGlCQUFpQjt3QkFDakIsb0JBQW9CO3dCQUNwQixnQkFBZ0I7d0JBQ2hCLGFBQWE7d0JBQ2IsaUJBQWlCO3dCQUNqQixrQkFBa0I7d0JBQ2xCLG1CQUFtQjtxQkFDcEI7aUJBQ0Y7OzBCQXdDSSxNQUFNOzJCQUFDLFFBQVE7bWxCQWxDbEIscUJBQXFCO3NCQURwQixLQUFLO2dCQVFOLEtBQUs7c0JBREosS0FBSztnQkFPTixLQUFLO3NCQURKLEtBQUs7Z0JBT04sU0FBUztzQkFEUixLQUFLO2dCQVFOLFdBQVc7c0JBRFYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UnO1xuaW1wb3J0IHsgU2NlbmVNb2RlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3NjZW5lLW1vZGUuZW51bSc7XG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDem1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvaW50LWRyYXdlci9wb2ludC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEtleWJvYXJkQ29udHJvbFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9rZXlib2FyZC1jb250cm9sL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFNjcmVlbnNob3RTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UnO1xuXG4vKipcbiAqIFRoaXMgaXMgYSBtYXAgaW1wbGVtZW50YXRpb24sIGNyZWF0ZXMgdGhlIGNlc2l1bSBtYXAuXG4gKiBFdmVyeSBsYXllciBzaG91bGQgYmUgdGFnIGluc2lkZSBhYy1tYXAgdGFnXG4gKlxuICogQWNjZXNzaW5nIGNlc2l1bSB2aWV3ZXI6XG4gKiAxLiBhY01hcENvbXBvbmVudC5nZXRDZXNpdW1WaWV3ZXIoKVxuICogMi4gVXNlIE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcCgpLmdldENlc2l1bVZpZXdlcigpIG9yIGlmIG1vcmUgdGhlbiBvbmUgbWFwOiBNYXBNYW5hZ2VyU2VydmljZS5nZXRNYXAobWFwSWQpLmdldENlc2l1bVZpZXdlcigpXG4gKlxuICpcbiAqIEBleGFtcGxlXG4gKiA8YWMtbWFwPlxuICogICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXI+PC9hYy1tYXAtbGF5ZXItcHJvdmlkZXI+XG4gKiAgICAgPGR5bmFtaWMtZWxsaXBzZS1sYXllciAjbGF5ZXI+PC9keW5hbWljLWVsbGlwc2UtbGF5ZXI+XG4gKiA8L2FjLW1hcD5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtbWFwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHByb3ZpZGVyczogW1xuICAgIENlc2l1bVNlcnZpY2UsXG4gICAgQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICBDZXNpdW1FdmVudEJ1aWxkZXIsXG4gICAgS2V5Ym9hcmRDb250cm9sU2VydmljZSxcbiAgICBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBQbG9udGVyU2VydmljZSxcbiAgICBMYWJlbERyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgQXJjRHJhd2VyU2VydmljZSxcbiAgICBDem1sRHJhd2VyU2VydmljZSxcbiAgICBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBNYXBMYXllcnNTZXJ2aWNlLFxuICAgIENhbWVyYVNlcnZpY2UsXG4gICAgU2NyZWVuc2hvdFNlcnZpY2UsXG4gICAgQ29udGV4dE1lbnVTZXJ2aWNlLFxuICAgIENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEFjTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBEaXNhYmxlIGRlZmF1bHQgcGxvbnRlciBjb250ZXh0IG1lbnVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVEZWZhdWx0UGxvbnRlciA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaWQgbmFtZSBvZiB0aGUgbWFwXG4gICAqIGRlZmF1bHQ6ICdkZWZhdWx0LW1hcC1pZC1baW5kZXhdJ1xuICAgKi9cbiAgQElucHV0KClcbiAgbWFwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogZmx5VG8gb3B0aW9ucyBhY2NvcmRpbmcgdG8gaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXG4gICAqL1xuICBASW5wdXQoKVxuICBmbHlUbzogYW55O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNjZW5lTW9kZTogU2NlbmVNb2RlO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCAtIHRoZSBjb250YWluZXIgZWxlbWVudCdzIGlkIGluIHdoaWNoIHRoZSBtYXAncyBjYW52YXMgd2lsbCBiZSBhcHBlbmRlZCB0by5cbiAgICogSWYgbm90IHN1cHBsaWVkIC0gdGhlIGNvbnRhaW5lciBlbGVtZW50IHdpbGwgYmUgdGhlIHBhcmVudCBlbGVtZW50IG9mIGFjLW1hcDtcbiAgICovXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcklkOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBtYXBDb250YWluZXI6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2Nlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfY2FtZXJhU2VydmljZTogQ2FtZXJhU2VydmljZSxcbiAgICBwcml2YXRlIF9lbGVtUmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQsXG4gICAgcHJpdmF0ZSBtYXBzTWFuYWdlclNlcnZpY2U6IE1hcHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGJpbGxib2FyZERyYXdlclNlcnZpY2U6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGVsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvbHlsaW5lRHJhd2VyU2VydmljZTogUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYXJjRHJhd2VyU2VydmljZTogQXJjRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvaW50RHJhd2VyU2VydmljZTogUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxuICAgIHByaXZhdGUgbWFwTGF5ZXJzU2VydmljZTogTWFwTGF5ZXJzU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZ3VyYXRpb25TZXJ2aWNlOiBDb25maWd1cmF0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIHNjcmVlbnNob3RTZXJ2aWNlOiBTY3JlZW5zaG90U2VydmljZSxcbiAgICBwdWJsaWMgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICApIHtcbiAgICB0aGlzLm1hcENvbnRhaW5lciA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdtYXAtY29udGFpbmVyJztcbiAgICB0aGlzLl9jZXNpdW1TZXJ2aWNlLmluaXQodGhpcy5tYXBDb250YWluZXIsIHRoaXMpO1xuICAgIHRoaXMuX2NhbWVyYVNlcnZpY2UuaW5pdCh0aGlzLl9jZXNpdW1TZXJ2aWNlKTtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuYmlsbGJvYXJkRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5sYWJlbERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuZWxsaXBzZURyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9seWxpbmVEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLnBvbHlnb25EcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmFyY0RyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9pbnREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmN6bWxEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubWFwSWQgPSB0aGlzLm1hcHNNYW5hZ2VyU2VydmljZS5fcmVnaXN0ZXJNYXAodGhpcy5tYXBJZCwgdGhpcyk7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcklkKSB7XG4gICAgICB0aGlzLl9lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snc2NlbmVNb2RlJ10pIHtcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2Uuc2V0U2NlbmVNb2RlKGNoYW5nZXNbJ3NjZW5lTW9kZSddLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydmbHlUbyddKSB7XG4gICAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLmNhbWVyYUZseVRvKGNoYW5nZXNbJ2ZseVRvJ10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10gJiYgIWNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uZmlyc3RDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uY3VycmVudFZhbHVlKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGZvdW5kIHdpdGggaWQ6ICR7Y2hhbmdlc1snY29udGFpbmVySWQnXS5jdXJyZW50VmFsdWV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5kcmF3QWxsTGF5ZXJzKCk7XG4gICAgaWYgKHRoaXMuY29udGFpbmVySWQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNvbnRhaW5lcklkKTtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHt0aGlzLmNvbnRhaW5lcklkfWApO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3ZXIgPSB0aGlzLmdldENlc2l1bVZpZXdlcigpO1xuICAgIHZpZXdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5tYXBDb250YWluZXIucmVtb3ZlKCk7XG4gICAgdGhpcy5tYXBzTWFuYWdlclNlcnZpY2UuX3JlbW92ZU1hcEJ5SWQodGhpcy5tYXBJZCk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYWMtbWFwJ3MgY2VzaXVtIHNlcnZpY2VcbiAgICovXG4gIGdldENlc2l1bVNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgbWFwJ3MgY2VzaXVtIHZpZXdlclxuICAgKi9cbiAgZ2V0Q2VzaXVtVmlld2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpO1xuICB9XG5cblxuICBnZXRDYW1lcmFTZXJ2aWNlKCk6IENhbWVyYVNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9jYW1lcmFTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwSWQ7XG4gIH1cblxuXG4gIGdldE1hcENvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBDb250YWluZXI7XG4gIH1cblxuXG4gIGdldE1hcEV2ZW50c01hbmFnZXIoKTogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLm1hcEV2ZW50c01hbmFnZXI7XG4gIH1cblxuICBnZXRDb250ZXh0TWVudVNlcnZpY2UoKTogQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWVudVNlcnZpY2U7XG4gIH1cblxuICBnZXRTY3JlZW5zaG90U2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5zaG90U2VydmljZTtcbiAgfVxuXG4gIGdldEtleWJvYXJkQ29udHJvbFNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZTtcbiAgfVxuXG4gIGdldENvb3JkaW5hdGVDb252ZXJ0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcjtcbiAgfVxufVxuIl19