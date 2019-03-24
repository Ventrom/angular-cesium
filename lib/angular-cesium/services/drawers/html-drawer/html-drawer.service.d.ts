import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
export declare class HtmlDrawerService extends PrimitivesDrawerService {
    private _cesiumService;
    constructor(_cesiumService: CesiumService);
    add(cesiumProps: any): any;
}
