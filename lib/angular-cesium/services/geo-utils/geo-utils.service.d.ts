import { CesiumService } from '../cesium/cesium.service';
import { Cartesian3 } from '../../models/cartesian3';
import { Vec3 } from '../../models/vec3';
export declare class GeoUtilsService {
    private cesiumService;
    static pointByLocationDistanceAndAzimuth(currentLocation: any, meterDistance: number, radianAzimuth: number, deprecated?: any): any;
    static _pointByLocationDistanceAndAzimuth(cartographicLocation: any, distance: number, radianAzimuth: number): any;
    static distance(pos0: Cartesian3, pos1: Cartesian3): number;
    static getPositionsDelta(position0: Cartesian3, position1: Cartesian3): Vec3;
    static addDeltaToPosition(position: Cartesian3, delta: Vec3, updateReference?: boolean): Cartesian3;
    static middleCartesian3Point(position0: Cartesian3, position1: Cartesian3): any;
    constructor(cesiumService: CesiumService);
    screenPositionToCartesian3(screenPos: {
        x: number;
        y: number;
    }): any;
}
