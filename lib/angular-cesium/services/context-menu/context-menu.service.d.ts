import { EventEmitter } from '@angular/core';
import { Cartesian3 } from '../../models/cartesian3';
import { ContextMenuOptions } from '../../models/context-menu-options';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { BasicContextMenu } from '../../models/basic-context-menu';
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 */
export declare class ContextMenuService {
    private _showContextMenu;
    private _options;
    private _position;
    private _content;
    private mapEventsManager;
    private leftClickRegistration;
    private leftClickSubscription;
    private _contextMenuChangeNotifier;
    private _onOpen;
    private _onClose;
    private _defaultContextMenuOptions;
    readonly contextMenuChangeNotifier: EventEmitter<any>;
    readonly showContextMenu: boolean;
    readonly options: ContextMenuOptions;
    readonly position: Cartesian3;
    readonly content: BasicContextMenu;
    readonly onOpen: EventEmitter<any>;
    readonly onClose: EventEmitter<any>;
    init(mapEventsManager: MapEventsManagerService): void;
    open(content: any, position: Cartesian3, options?: ContextMenuOptions): void;
    close(): void;
}
