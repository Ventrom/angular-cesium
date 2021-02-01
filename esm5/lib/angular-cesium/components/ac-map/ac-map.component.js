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
    AcMapComponent.prototype.ngOnInit = function () {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    };
    AcMapComponent.prototype.ngOnChanges = function (changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            var element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error("No element found with id: " + changes['containerId'].currentValue);
            }
        }
    };
    AcMapComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout(function () {
                var element = _this.document.getElementById(_this.containerId);
                if (element) {
                    element.appendChild(_this.mapContainer);
                }
                else {
                    throw new Error("No element found with id: " + _this.containerId);
                }
            }, 0);
        }
    };
    AcMapComponent.prototype.ngOnDestroy = function () {
        var viewer = this.getCesiumViewer();
        viewer.destroy();
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    };
    /**
     * @returns ac-map's cesium service
     */
    AcMapComponent.prototype.getCesiumService = function () {
        return this._cesiumService;
    };
    /**
     * @returns map's cesium viewer
     */
    AcMapComponent.prototype.getCesiumViewer = function () {
        return this._cesiumService.getViewer();
    };
    AcMapComponent.prototype.getCameraService = function () {
        return this._cameraService;
    };
    AcMapComponent.prototype.getId = function () {
        return this.mapId;
    };
    AcMapComponent.prototype.getMapContainer = function () {
        return this.mapContainer;
    };
    AcMapComponent.prototype.getMapEventsManager = function () {
        return this.mapEventsManager;
    };
    AcMapComponent.prototype.getContextMenuService = function () {
        return this.contextMenuService;
    };
    AcMapComponent.prototype.getScreenshotService = function () {
        return this.screenshotService;
    };
    AcMapComponent.prototype.getKeyboardControlService = function () {
        return this.keyboardControlService;
    };
    AcMapComponent.prototype.getCoordinateConverter = function () {
        return this.coordinateConverter;
    };
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
    return AcMapComponent;
}());
export { AcMapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0RBQWtELENBQUM7QUFDdEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDdkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1B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QUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtLWVuaGFuY2VtZW50cy9Db25maWd1cmF0aW9uU2VydmljZSc7XG5pbXBvcnQgeyBTY2VuZU1vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvc2NlbmUtbW9kZS5lbnVtJztcbmltcG9ydCB7IENhbWVyYVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jYW1lcmEvY2FtZXJhLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1kcmF3ZXIvYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExhYmVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtZHJhd2VyL2xhYmVsLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25EcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5Z29uLWRyYXdlci9wb2x5Z29uLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtZHJhd2VyL3BvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgS2V5Ym9hcmRDb250cm9sU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2tleWJvYXJkLWNvbnRyb2wva2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bUV2ZW50QnVpbGRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvY2VzaXVtLWV2ZW50LWJ1aWxkZXInO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwcy1tYW5hZ2VyL21hcHMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2NyZWVuc2hvdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zY3JlZW5zaG90L3NjcmVlbnNob3Quc2VydmljZSc7XG5cbi8qKlxuICogVGhpcyBpcyBhIG1hcCBpbXBsZW1lbnRhdGlvbiwgY3JlYXRlcyB0aGUgY2VzaXVtIG1hcC5cbiAqIEV2ZXJ5IGxheWVyIHNob3VsZCBiZSB0YWcgaW5zaWRlIGFjLW1hcCB0YWdcbiAqXG4gKiBBY2Nlc3NpbmcgY2VzaXVtIHZpZXdlcjpcbiAqIDEuIGFjTWFwQ29tcG9uZW50LmdldENlc2l1bVZpZXdlcigpXG4gKiAyLiBVc2UgTWFwTWFuYWdlclNlcnZpY2UuZ2V0TWFwKCkuZ2V0Q2VzaXVtVmlld2VyKCkgb3IgaWYgbW9yZSB0aGVuIG9uZSBtYXA6IE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcChtYXBJZCkuZ2V0Q2VzaXVtVmlld2VyKClcbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIDxhYy1tYXA+XG4gKiAgICAgPGFjLW1hcC1sYXllci1wcm92aWRlcj48L2FjLW1hcC1sYXllci1wcm92aWRlcj5cbiAqICAgICA8ZHluYW1pYy1lbGxpcHNlLWxheWVyICNsYXllcj48L2R5bmFtaWMtZWxsaXBzZS1sYXllcj5cbiAqIDwvYWMtbWFwPlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1tYXAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhYy1kZWZhdWx0LXBsb250ZXIgKm5nSWY9XCIhZGlzYWJsZURlZmF1bHRQbG9udGVyXCI+PC9hYy1kZWZhdWx0LXBsb250ZXI+XG4gICAgPGFjLWNvbnRleHQtbWVudS13cmFwcGVyPjwvYWMtY29udGV4dC1tZW51LXdyYXBwZXI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICBgLFxuICBwcm92aWRlcnM6IFtcbiAgICBDZXNpdW1TZXJ2aWNlLFxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXG4gICAgQ2VzaXVtRXZlbnRCdWlsZGVyLFxuICAgIEtleWJvYXJkQ29udHJvbFNlcnZpY2UsXG4gICAgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXG4gICAgUGxvbnRlclNlcnZpY2UsXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcbiAgICBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsXG4gICAgRWxsaXBzZURyYXdlclNlcnZpY2UsXG4gICAgUG9pbnREcmF3ZXJTZXJ2aWNlLFxuICAgIEFyY0RyYXdlclNlcnZpY2UsXG4gICAgQ3ptbERyYXdlclNlcnZpY2UsXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgTWFwTGF5ZXJzU2VydmljZSxcbiAgICBDYW1lcmFTZXJ2aWNlLFxuICAgIFNjcmVlbnNob3RTZXJ2aWNlLFxuICAgIENvbnRleHRNZW51U2VydmljZSxcbiAgICBDb29yZGluYXRlQ29udmVydGVyLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBBY01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogRGlzYWJsZSBkZWZhdWx0IHBsb250ZXIgY29udGV4dCBtZW51XG4gICAqL1xuICBASW5wdXQoKVxuICBkaXNhYmxlRGVmYXVsdFBsb250ZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogU2V0IHRoZSBpZCBuYW1lIG9mIHRoZSBtYXBcbiAgICogZGVmYXVsdDogJ2RlZmF1bHQtbWFwLWlkLVtpbmRleF0nXG4gICAqL1xuICBASW5wdXQoKVxuICBtYXBJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBmbHlUbyBvcHRpb25zIGFjY29yZGluZyB0byBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW0jZmx5VG9cbiAgICovXG4gIEBJbnB1dCgpXG4gIGZseVRvOiBhbnk7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG1hcCdzIFNjZW5lTW9kZVxuICAgKi9cbiAgQElucHV0KClcbiAgc2NlbmVNb2RlOiBTY2VuZU1vZGU7XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIC0gdGhlIGNvbnRhaW5lciBlbGVtZW50J3MgaWQgaW4gd2hpY2ggdGhlIG1hcCdzIGNhbnZhcyB3aWxsIGJlIGFwcGVuZGVkIHRvLlxuICAgKiBJZiBub3Qgc3VwcGxpZWQgLSB0aGUgY29udGFpbmVyIGVsZW1lbnQgd2lsbCBiZSB0aGUgcGFyZW50IGVsZW1lbnQgb2YgYWMtbWFwO1xuICAgKi9cbiAgQElucHV0KClcbiAgY29udGFpbmVySWQ6IHN0cmluZztcblxuICBwcml2YXRlIG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICBwcml2YXRlIF9jYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2VsZW1SZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudCxcbiAgICBwcml2YXRlIG1hcHNNYW5hZ2VyU2VydmljZTogTWFwc01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgYmlsbGJvYXJkRHJhd2VyU2VydmljZTogQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcbiAgICBwcml2YXRlIGxhYmVsRHJhd2VyU2VydmljZTogTGFiZWxEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxsaXBzZURyYXdlclNlcnZpY2U6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZURyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBwb2x5Z29uRHJhd2VyU2VydmljZTogUG9seWdvbkRyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBhcmNEcmF3ZXJTZXJ2aWNlOiBBcmNEcmF3ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcG9pbnREcmF3ZXJTZXJ2aWNlOiBQb2ludERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjem1sRHJhd2VyU2VydmljZTogQ3ptbERyYXdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIGtleWJvYXJkQ29udHJvbFNlcnZpY2U6IEtleWJvYXJkQ29udHJvbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBtYXBMYXllcnNTZXJ2aWNlOiBNYXBMYXllcnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblNlcnZpY2U6IENvbmZpZ3VyYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgc2NyZWVuc2hvdFNlcnZpY2U6IFNjcmVlbnNob3RTZXJ2aWNlLFxuICAgIHB1YmxpYyBjb250ZXh0TWVudVNlcnZpY2U6IENvbnRleHRNZW51U2VydmljZSxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICkge1xuICAgIHRoaXMubWFwQ29udGFpbmVyID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLm1hcENvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLm1hcENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgdGhpcy5tYXBDb250YWluZXIuY2xhc3NOYW1lID0gJ21hcC1jb250YWluZXInO1xuICAgIHRoaXMuX2Nlc2l1bVNlcnZpY2UuaW5pdCh0aGlzLm1hcENvbnRhaW5lciwgdGhpcyk7XG4gICAgdGhpcy5fY2FtZXJhU2VydmljZS5pbml0KHRoaXMuX2Nlc2l1bVNlcnZpY2UpO1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlci5pbml0KCk7XG4gICAgdGhpcy5iaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcbiAgICB0aGlzLmxhYmVsRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5lbGxpcHNlRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5wb2x5bGluZURyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMucG9seWdvbkRyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuYXJjRHJhd2VyU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5wb2ludERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMuY3ptbERyYXdlclNlcnZpY2UuaW5pdCgpO1xuICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5pbml0KCk7XG4gICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuaW5pdCh0aGlzLm1hcEV2ZW50c01hbmFnZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5tYXBJZCA9IHRoaXMubWFwc01hbmFnZXJTZXJ2aWNlLl9yZWdpc3Rlck1hcCh0aGlzLm1hcElkLCB0aGlzKTtcbiAgICBpZiAoIXRoaXMuY29udGFpbmVySWQpIHtcbiAgICAgIHRoaXMuX2VsZW1SZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hcENvbnRhaW5lcik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzY2VuZU1vZGUnXSkge1xuICAgICAgdGhpcy5fY2FtZXJhU2VydmljZS5zZXRTY2VuZU1vZGUoY2hhbmdlc1snc2NlbmVNb2RlJ10uY3VycmVudFZhbHVlKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2ZseVRvJ10pIHtcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2UuY2FtZXJhRmx5VG8oY2hhbmdlc1snZmx5VG8nXS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snY29udGFpbmVySWQnXSAmJiAhY2hhbmdlc1snY29udGFpbmVySWQnXS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2hhbmdlc1snY29udGFpbmVySWQnXS5jdXJyZW50VmFsdWUpO1xuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1hcENvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHtjaGFuZ2VzWydjb250YWluZXJJZCddLmN1cnJlbnRWYWx1ZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLmRyYXdBbGxMYXllcnMoKTtcbiAgICBpZiAodGhpcy5jb250YWluZXJJZCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVySWQpO1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gZWxlbWVudCBmb3VuZCB3aXRoIGlkOiAke3RoaXMuY29udGFpbmVySWR9YCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNvbnN0IHZpZXdlciA9IHRoaXMuZ2V0Q2VzaXVtVmlld2VyKCk7XG4gICAgdmlld2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLm1hcENvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB0aGlzLm1hcHNNYW5hZ2VyU2VydmljZS5fcmVtb3ZlTWFwQnlJZCh0aGlzLm1hcElkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBhYy1tYXAncyBjZXNpdW0gc2VydmljZVxuICAgKi9cbiAgZ2V0Q2VzaXVtU2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtU2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBtYXAncyBjZXNpdW0gdmlld2VyXG4gICAqL1xuICBnZXRDZXNpdW1WaWV3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XG4gIH1cblxuXG4gIGdldENhbWVyYVNlcnZpY2UoKTogQ2FtZXJhU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbWVyYVNlcnZpY2U7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBJZDtcbiAgfVxuXG5cbiAgZ2V0TWFwQ29udGFpbmVyKCkge1xuICAgIHJldHVybiB0aGlzLm1hcENvbnRhaW5lcjtcbiAgfVxuXG5cbiAgZ2V0TWFwRXZlbnRzTWFuYWdlcigpOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMubWFwRXZlbnRzTWFuYWdlcjtcbiAgfVxuXG4gIGdldENvbnRleHRNZW51U2VydmljZSgpOiBDb250ZXh0TWVudVNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLmNvbnRleHRNZW51U2VydmljZTtcbiAgfVxuXG4gIGdldFNjcmVlbnNob3RTZXJ2aWNlKCkge1xuICAgIHJldHVybiB0aGlzLnNjcmVlbnNob3RTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0S2V5Ym9hcmRDb250cm9sU2VydmljZSgpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlO1xuICB9XG5cbiAgZ2V0Q29vcmRpbmF0ZUNvbnZlcnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb29yZGluYXRlQ29udmVydGVyO1xuICB9XG59XG4iXX0=