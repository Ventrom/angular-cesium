import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
export declare class PointPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
}
