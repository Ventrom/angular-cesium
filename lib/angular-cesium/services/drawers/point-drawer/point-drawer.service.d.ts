import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
/**
 *  This drawer is responsible for drawing points.
 */
export declare class PointDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
