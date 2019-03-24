import { ChangeDetectorRef, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 *
 * usage:
 * ```typescript
 * // We want to open the context menu on mouse right click.
 * // Register to mouse right click with the MapEventsManager
 * this.mapEventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
 *    .subscribe(event => {
 *       const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition, true);
 *       if (!position) {
 *         return;
 *       }
 *       // Open the context menu on the position that was clicked and pass some data to ContextMenuComponent.
 *       this.contextMenuService.open(
 *         ContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
export declare class AcContextMenuWrapperComponent implements OnInit, OnDestroy {
    contextMenuService: ContextMenuService;
    private cd;
    private componentFactoryResolver;
    private contextMenuChangeSubscription;
    private contextMenuOpenSubscription;
    viewContainerRef: ViewContainerRef;
    constructor(contextMenuService: ContextMenuService, cd: ChangeDetectorRef, componentFactoryResolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
