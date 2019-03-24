import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing models.
 */
export declare class ModelDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
