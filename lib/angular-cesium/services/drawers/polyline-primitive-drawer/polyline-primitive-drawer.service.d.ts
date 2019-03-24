import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
export declare class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    add(cesiumProps: any): any;
    update(cesiumObject: any, cesiumProps: any): void;
    withColorMaterial(cesiumProps: any): any;
}
