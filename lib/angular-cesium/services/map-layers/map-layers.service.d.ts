import { CesiumService } from '../cesium/cesium.service';
export declare class MapLayersService {
    private cesiumService;
    private layersDataSources;
    constructor(cesiumService: CesiumService);
    registerLayerDataSources(dataSources: any[], zIndex: number): void;
    drawAllLayers(): void;
    updateAndRefresh(dataSources: any[], newZIndex: number): void;
    removeDataSources(dataSources: any[]): void;
}
