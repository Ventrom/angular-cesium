import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing corridors .
 */
export declare class CorridorDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
