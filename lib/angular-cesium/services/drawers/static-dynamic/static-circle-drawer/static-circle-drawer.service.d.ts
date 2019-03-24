import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
export declare class StaticCircleDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService: CesiumService);
}
