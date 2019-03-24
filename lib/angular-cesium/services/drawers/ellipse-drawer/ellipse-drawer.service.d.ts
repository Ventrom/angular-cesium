import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
/**
 *  This drawer is responsible for drawing ellipses.
 */
export declare class EllipseDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
