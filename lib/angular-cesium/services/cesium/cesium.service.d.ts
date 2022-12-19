import { NgZone } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
import { AcMapComponent } from '../../components/ac-map/ac-map.component';
import * as i0 from "@angular/core";
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
export declare class CesiumService {
    private ngZone;
    private viewerFactory;
    private viewerConfiguration;
    private cesiumViewer;
    private map;
    constructor(ngZone: NgZone, viewerFactory: ViewerFactory, viewerConfiguration: ViewerConfiguration);
    init(mapContainer: HTMLElement, map: AcMapComponent): void;
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer(): any;
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene(): any;
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas(): HTMLCanvasElement;
    getMap(): AcMapComponent;
    static ɵfac: i0.ɵɵFactoryDeclaration<CesiumService, [null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CesiumService>;
}
