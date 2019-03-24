import { CesiumService } from '../../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
export declare class DynamicPolylineDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
}
