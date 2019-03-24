import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
export declare class EllipsoidDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
