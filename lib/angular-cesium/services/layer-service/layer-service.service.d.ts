import { EventEmitter } from '@angular/core';
import { IDescription } from '../../models/description';
import { LayerOptions } from '../../models/layer-options';
export declare class LayerService {
    private _context;
    private _options;
    private _show;
    private _zIndex;
    private _entityName;
    private _cache;
    private descriptions;
    private layerUpdate;
    cache: boolean;
    zIndex: number;
    show: boolean;
    options: LayerOptions;
    context: any;
    setEntityName(name: string): void;
    getEntityName(): string;
    registerDescription(descriptionComponent: IDescription): void;
    unregisterDescription(descriptionComponent: IDescription): void;
    getDescriptions(): IDescription[];
    layerUpdates(): EventEmitter<any>;
}
