import { OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
export declare class AcMapTerrainProviderComponent implements OnInit, OnChanges, OnDestroy {
    private cesiumService;
    /**
     * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
     */
    options: {
        url?: string;
    };
    /**
     * the provider
     */
    provider: any;
    /**
     * show (optional) - Determines if the map layer is shown.
     */
    show: boolean;
    private terrainProvider;
    private defaultTerrainProvider;
    constructor(cesiumService: CesiumService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
