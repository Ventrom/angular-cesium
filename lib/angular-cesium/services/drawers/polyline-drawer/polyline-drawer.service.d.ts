import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
/**
 *  This drawer is responsible of drawing polylines.
 */
export declare class PolylineDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
}
