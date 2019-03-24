import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing polylines.
 */
export declare class PolylineVolumeDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}