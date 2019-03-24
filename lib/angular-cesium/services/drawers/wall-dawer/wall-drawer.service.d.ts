import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing polygons.
 */
export declare class WallDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
