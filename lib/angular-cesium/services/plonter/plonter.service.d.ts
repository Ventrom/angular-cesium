import { EventEmitter } from '@angular/core';
import { AcEntity } from '../../models/ac-entity';
import { Subject } from 'rxjs';
import { EventResult, Movement } from '../map-events-mananger/map-events-manager';
/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
export declare class PlonterService {
    private _plonterShown;
    private _entitesToPlonter;
    private _plonterObserver;
    private _eventResult;
    private _plonterChangeNotifier;
    constructor();
    readonly plonterChangeNotifier: EventEmitter<any>;
    readonly plonterShown: boolean;
    readonly entitesToPlonter: AcEntity[];
    readonly plonterClickPosition: Movement;
    plonterIt(eventResult: EventResult): Subject<EventResult>;
    resolvePlonter(entity: AcEntity): void;
}
