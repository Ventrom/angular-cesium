import { CesiumService } from '../cesium/cesium.service';
import { CesiumEvent } from './consts/cesium-event.enum';
import { CesiumEventModifier } from './consts/cesium-event-modifier.enum';
import { ConnectableObservable } from 'rxjs';
export declare class CesiumEventBuilder {
    private cesiumService;
    constructor(cesiumService: CesiumService);
    static longPressEvents: Set<CesiumEvent>;
    private eventsHandler;
    private cesiumEventsObservables;
    static getEventFullName(event: CesiumEvent, modifier?: CesiumEventModifier): string;
    init(): void;
    get(event: CesiumEvent, modifier?: CesiumEventModifier): ConnectableObservable<any>;
    private createCesiumEventObservable;
    private createSpecialCesiumEventObservable;
}
