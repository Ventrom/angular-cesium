import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
export declare class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
}
