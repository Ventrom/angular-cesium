import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input } from '@angular/core';
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
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQStDLE1BQU0sZUFBZSxDQUFDO0FBQ2pJLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUN0RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDekQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQzNGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BH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QUFnQjtvQkFDaEIsYUFBYTtvQkFDYixpQkFBaUI7b0JBQ2pCLGtCQUFrQjtvQkFDbEIsbUJBQW1CO2lCQUNwQjthQUNGOzs7WUFsRVEsYUFBYTtZQUdiLGFBQWE7WUFKYSxVQUFVOzRDQTJHeEMsTUFBTSxTQUFDLFFBQVE7WUF2Rlgsa0JBQWtCO1lBWmxCLHNCQUFzQjtZQUd0QixrQkFBa0I7WUFEbEIsb0JBQW9CO1lBSXBCLHFCQUFxQjtZQURyQixvQkFBb0I7WUFOcEIsZ0JBQWdCO1lBS2hCLGtCQUFrQjtZQUhsQixpQkFBaUI7WUFTakIsdUJBQXVCO1lBRnZCLHNCQUFzQjtZQUd0QixnQkFBZ0I7WUFqQmhCLG9CQUFvQjtZQW9CcEIsaUJBQWlCO1lBakJqQixrQkFBa0I7WUFDbEIsbUJBQW1COzs7b0NBa0V6QixLQUFLO29CQU9MLEtBQUs7b0JBTUwsS0FBSzt3QkFNTCxLQUFLOzBCQU9MLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0tZW5oYW5jZW1lbnRzL0NvbmZpZ3VyYXRpb25TZXJ2aWNlJztcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XG5pbXBvcnQgeyBDb250ZXh0TWVudVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmlsbGJvYXJkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLWRyYXdlci9iaWxsYm9hcmQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ3ptbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N6bWwtZHJhd2VyL2N6bWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGFiZWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1kcmF3ZXIvbGFiZWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1kcmF3ZXIvcG9pbnQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1kcmF3ZXIvcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBLZXlib2FyZENvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9rZXlib2FyZC1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnRCdWlsZGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWV2ZW50cy1tYW5hbmdlci9jZXNpdW0tZXZlbnQtYnVpbGRlcic7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGxvbnRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wbG9udGVyL3Bsb250ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTY3JlZW5zaG90U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NjcmVlbnNob3Qvc2NyZWVuc2hvdC5zZXJ2aWNlJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgbWFwIGltcGxlbWVudGF0aW9uLCBjcmVhdGVzIHRoZSBjZXNpdW0gbWFwLlxuICogRXZlcnkgbGF5ZXIgc2hvdWxkIGJlIHRhZyBpbnNpZGUgYWMtbWFwIHRhZ1xuICpcbiAqIEFjY2Vzc2luZyBjZXNpdW0gdmlld2VyOlxuICogMS4gYWNNYXBDb21wb25lbnQuZ2V0Q2VzaXVtVmlld2VyKClcbiAqIDIuIFVzZSBNYXBNYW5hZ2VyU2VydmljZS5nZXRNYXAoKS5nZXRDZXNpdW1WaWV3ZXIoKSBvciBpZiBtb3JlIHRoZW4gb25lIG1hcDogTWFwTWFuYWdlclNlcnZpY2UuZ2V0TWFwKG1hcElkKS5nZXRDZXNpdW1WaWV3ZXIoKVxuICpcbiAqXG4gKiBAZXhhbXBsZVxuICogPGFjLW1hcD5cbiAqICAgICA8YWMtbWFwLWxheWVyLXByb3ZpZGVyPjwvYWMtbWFwLWxheWVyLXByb3ZpZGVyPlxuICogICAgIDxkeW5hbWljLWVsbGlwc2UtbGF5ZXIgI2xheWVyPjwvZHluYW1pYy1lbGxpcHNlLWxheWVyPlxuICogPC9hYy1tYXA+XG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLW1hcCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGFjLWRlZmF1bHQtcGxvbnRlciAqbmdJZj1cIiFkaXNhYmxlRGVmYXVsdFBsb250ZXJcIj48L2FjLWRlZmF1bHQtcGxvbnRlcj5cbiAgICA8YWMtY29udGV4dC1tZW51LXdyYXBwZXI+PC9hYy1jb250ZXh0LW1lbnUtd3JhcHBlcj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHByb3ZpZGVyczogW1xuICAgIENlc2l1bVNlcnZpY2UsXG4gICAgQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICBDZXNpdW1FdmVudEJ1aWxkZXIsXG4gICAgS2V5Ym9hcmRDb250cm9sU2VydmljZSxcbiAgICBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBQbG9udGVyU2VydmljZSxcbiAgICBMYWJlbERyYXdlclNlcnZpY2UsXG4gICAgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcbiAgICBFbGxpcHNlRHJhd2VyU2VydmljZSxcbiAgICBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgQXJjRHJhd2VyU2VydmljZSxcbiAgICBDem1sRHJhd2VyU2VydmljZSxcbiAgICBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBNYXBMYXllcnNTZXJ2aWNlLFxuICAgIENhbWVyYVNlcnZpY2UsXG4gICAgU2NyZWVuc2hvdFNlcnZpY2UsXG4gICAgQ29udGV4dE1lbnVTZXJ2aWNlLFxuICAgIENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIEFjTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBEaXNhYmxlIGRlZmF1bHQgcGxvbnRlciBjb250ZXh0IG1lbnVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVEZWZhdWx0UGxvbnRlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGlkIG5hbWUgb2YgdGhlIG1hcFxuICAgKiBkZWZhdWx0OiAnZGVmYXVsdC1tYXAtaWQtW2luZGV4XSdcbiAgICovXG4gIEBJbnB1dCgpXG4gIG1hcElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGZseVRvIG9wdGlvbnMgYWNjb3JkaW5nIHRvIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sP2NsYXNzRmlsdGVyPWNhbSNmbHlUb1xuICAgKi9cbiAgQElucHV0KClcbiAgZmx5VG86IGFueTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgbWFwJ3MgU2NlbmVNb2RlXG4gICAqL1xuICBASW5wdXQoKVxuICBzY2VuZU1vZGU6IFNjZW5lTW9kZTtcblxuICAvKipcbiAgICogT3B0aW9uYWwgLSB0aGUgY29udGFpbmVyIGVsZW1lbnQncyBpZCBpbiB3aGljaCB0aGUgbWFwJ3MgY2FudmFzIHdpbGwgYmUgYXBwZW5kZWQgdG8uXG4gICAqIElmIG5vdCBzdXBwbGllZCAtIHRoZSBjb250YWluZXIgZWxlbWVudCB3aWxsIGJlIHRoZSBwYXJlbnQgZWxlbWVudCBvZiBhYy1tYXA7XG4gICAqL1xuICBASW5wdXQoKVxuICBjb250YWluZXJJZDogc3RyaW5nO1xuXG4gIHByaXZhdGUgbWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxlbVJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50LFxuICAgIHByaXZhdGUgbWFwc01hbmFnZXJTZXJ2aWNlOiBNYXBzTWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBiaWxsYm9hcmREcmF3ZXJTZXJ2aWNlOiBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgbGFiZWxEcmF3ZXJTZXJ2aWNlOiBMYWJlbERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5bGluZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIHBvbHlnb25EcmF3ZXJTZXJ2aWNlOiBQb2x5Z29uRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGFyY0RyYXdlclNlcnZpY2U6IEFyY0RyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2ludERyYXdlclNlcnZpY2U6IFBvaW50RHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGN6bWxEcmF3ZXJTZXJ2aWNlOiBDem1sRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUga2V5Ym9hcmRDb250cm9sU2VydmljZTogS2V5Ym9hcmRDb250cm9sU2VydmljZSxcbiAgICBwcml2YXRlIG1hcExheWVyc1NlcnZpY2U6IE1hcExheWVyc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uU2VydmljZTogQ29uZmlndXJhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzY3JlZW5zaG90U2VydmljZTogU2NyZWVuc2hvdFNlcnZpY2UsXG4gICAgcHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgKSB7XG4gICAgdGhpcy5tYXBDb250YWluZXIgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICB0aGlzLm1hcENvbnRhaW5lci5jbGFzc05hbWUgPSAnbWFwLWNvbnRhaW5lcic7XG4gICAgdGhpcy5fY2VzaXVtU2VydmljZS5pbml0KHRoaXMubWFwQ29udGFpbmVyLCB0aGlzKTtcbiAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLmluaXQodGhpcy5fY2VzaXVtU2VydmljZSk7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyLmluaXQoKTtcbiAgICB0aGlzLmJpbGxib2FyZERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMubGFiZWxEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmVsbGlwc2VEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLnBvbHlsaW5lRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5wb2x5Z29uRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5hcmNEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLnBvaW50RHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5jem1sRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5pbml0KHRoaXMubWFwRXZlbnRzTWFuYWdlcik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLm1hcElkID0gdGhpcy5tYXBzTWFuYWdlclNlcnZpY2UuX3JlZ2lzdGVyTWFwKHRoaXMubWFwSWQsIHRoaXMpO1xuICAgIGlmICghdGhpcy5jb250YWluZXJJZCkge1xuICAgICAgdGhpcy5fZWxlbVJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3NjZW5lTW9kZSddKSB7XG4gICAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLnNldFNjZW5lTW9kZShjaGFuZ2VzWydzY2VuZU1vZGUnXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snZmx5VG8nXSkge1xuICAgICAgdGhpcy5fY2FtZXJhU2VydmljZS5jYW1lcmFGbHlUbyhjaGFuZ2VzWydmbHlUbyddLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydjb250YWluZXJJZCddICYmICFjaGFuZ2VzWydjb250YWluZXJJZCddLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChjaGFuZ2VzWydjb250YWluZXJJZCddLmN1cnJlbnRWYWx1ZSk7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZWxlbWVudCBmb3VuZCB3aXRoIGlkOiAke2NoYW5nZXNbJ2NvbnRhaW5lcklkJ10uY3VycmVudFZhbHVlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcExheWVyc1NlcnZpY2UuZHJhd0FsbExheWVycygpO1xuICAgIGlmICh0aGlzLmNvbnRhaW5lcklkKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb250YWluZXJJZCk7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hcENvbnRhaW5lcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGZvdW5kIHdpdGggaWQ6ICR7dGhpcy5jb250YWluZXJJZH1gKTtcbiAgICAgICAgfVxuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgY29uc3Qgdmlld2VyID0gdGhpcy5nZXRDZXNpdW1WaWV3ZXIoKTtcbiAgICB2aWV3ZXIuZGVzdHJveSgpO1xuICAgIHRoaXMubWFwQ29udGFpbmVyLnJlbW92ZSgpO1xuICAgIHRoaXMubWFwc01hbmFnZXJTZXJ2aWNlLl9yZW1vdmVNYXBCeUlkKHRoaXMubWFwSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIGFjLW1hcCdzIGNlc2l1bSBzZXJ2aWNlXG4gICAqL1xuICBnZXRDZXNpdW1TZXJ2aWNlKCkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1TZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIG1hcCdzIGNlc2l1bSB2aWV3ZXJcbiAgICovXG4gIGdldENlc2l1bVZpZXdlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKTtcbiAgfVxuXG5cbiAgZ2V0Q2FtZXJhU2VydmljZSgpOiBDYW1lcmFTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5fY2FtZXJhU2VydmljZTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLm1hcElkO1xuICB9XG5cblxuICBnZXRNYXBDb250YWluZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwQ29udGFpbmVyO1xuICB9XG5cblxuICBnZXRNYXBFdmVudHNNYW5hZ2VyKCk6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5tYXBFdmVudHNNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0Q29udGV4dE1lbnVTZXJ2aWNlKCk6IENvbnRleHRNZW51U2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0U2NyZWVuc2hvdFNlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuc2hvdFNlcnZpY2U7XG4gIH1cblxuICBnZXRLZXlib2FyZENvbnRyb2xTZXJ2aWNlKCkge1xuICAgIHJldHVybiB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2U7XG4gIH1cblxuICBnZXRDb29yZGluYXRlQ29udmVydGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXI7XG4gIH1cbn1cbiJdfQ==