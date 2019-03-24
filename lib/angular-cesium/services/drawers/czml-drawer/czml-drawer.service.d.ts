import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { EntitiesDrawerOptions } from '../../../models/entities-drawer-options';
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
export declare class CzmlDrawerService extends BasicDrawerService {
    private cesiumService;
    czmlStream: any;
    constructor(cesiumService: CesiumService);
    init(options?: EntitiesDrawerOptions): any[];
    add(cesiumProps: any): any;
    update(entity: any, cesiumProps: any): void;
    remove(entity: any): void;
    removeAll(): void;
    setShow(showValue: boolean): void;
}
