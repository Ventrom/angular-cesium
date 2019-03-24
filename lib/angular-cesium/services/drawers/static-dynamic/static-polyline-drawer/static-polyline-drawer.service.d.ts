import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
export declare class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService: CesiumService);
    /**
     * Update function can only change the primitive color.
     */
    update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any): any;
}
