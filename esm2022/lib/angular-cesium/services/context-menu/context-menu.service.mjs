import { EventEmitter, Injectable } from '@angular/core';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import * as i0 from "@angular/core";
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 *
 * notice, `data` will be injected to your custom menu component into the `data` field in the component.
 * __Usage :__
 * ```
 *  ngOnInit() {
 *   this.clickEvent$ = this.eventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.PICK_ONE });
 *   this.clickEvent$.subscribe(result => {
 *    if (result.entities) {
 *      const pickedMarker = result.entities[0];
 *      this.contextMenuService.open(MapContextmenuComponent, pickedMarker.position, {
 *        data: {
 *          myData: data,
 *          onDelete: () => this.delete(pickedMarker.id)
 *        }
 *      });
 *    }
 *   });
 *  }
 *
 *
 *  private delete(id) {
 *    this.mapMenu.close();
 *    this.detailedSiteService.removeMarker(id);
 *  }
 * ```
 */
export class ContextMenuService {
    constructor() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    get contextMenuChangeNotifier() {
        return this._contextMenuChangeNotifier;
    }
    get showContextMenu() {
        return this._showContextMenu;
    }
    get options() {
        return this._options;
    }
    get position() {
        return this._position;
    }
    get content() {
        return this._content;
    }
    get onOpen() {
        return this._onOpen;
    }
    get onClose() {
        return this._onClose;
    }
    init(mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    }
    open(contentComponent, position, options = {}) {
        this.close();
        this._content = contentComponent;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe(() => {
                this.leftClickSubscription.unsubscribe();
                this.close();
            });
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    }
    close() {
        this._content = undefined;
        this._position = undefined;
        this._options = undefined;
        this._showContextMenu = false;
        if (this.leftClickRegistration) {
            this.leftClickRegistration.dispose();
            this.leftClickRegistration = undefined;
        }
        if (this.leftClickSubscription) {
            this.leftClickSubscription.unsubscribe();
            this.leftClickSubscription = undefined;
        }
        this._contextMenuChangeNotifier.emit();
        this._onClose.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ContextMenuService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ContextMenuService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOztBQU03RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFVSxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFPekIsK0JBQTBCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QiwrQkFBMEIsR0FBdUI7WUFDdkQsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0Qix3QkFBd0IsRUFBRSxFQUFFO1NBQzdCLENBQUM7S0EwRUg7SUF4RUMsSUFBSSx5QkFBeUI7UUFDM0IsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUdELElBQUksQ0FBQyxnQkFBeUM7UUFDNUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLENBQUksZ0JBQXFCLEVBQUUsUUFBb0IsRUFBRSxVQUFpQyxFQUFFO1FBQ3RGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDNUQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Z0JBQzFELEtBQUssRUFBRSxXQUFXLENBQUMsVUFBVTtnQkFDN0IsSUFBSSxFQUFFLFdBQVcsQ0FBQyxPQUFPO2dCQUN6QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0I7YUFDakQsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNyRSxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzhHQXZGVSxrQkFBa0I7a0hBQWxCLGtCQUFrQjs7MkZBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvbnRleHRNZW51T3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9jb250ZXh0LW1lbnUtb3B0aW9ucyc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0TWVudSB9IGZyb20gJy4uLy4uL21vZGVscy9iYXNpYy1jb250ZXh0LW1lbnUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cblxuLyoqXG4gKiBUaGUgU2VydmljZSBtYW5hZ2VzIGEgc2luZ2xldG9uIGNvbnRleHQgbWVudSBvdmVyIHRoZSBtYXAuIEl0IHNob3VsZCBiZSBpbml0aWFsaXplZCB3aXRoIE1hcEV2ZW50c01hbmFnZXIuXG4gKiBUaGUgU2VydmljZSBhbGxvd3Mgb3BlbmluZyBhbmQgY2xvc2luZyBvZiB0aGUgY29udGV4dCBtZW51IGFuZCBwYXNzaW5nIGRhdGEgdG8gdGhlIGNvbnRleHQgbWVudSBpbm5lciBjb21wb25lbnQuXG4gKlxuICogbm90aWNlLCBgZGF0YWAgd2lsbCBiZSBpbmplY3RlZCB0byB5b3VyIGN1c3RvbSBtZW51IGNvbXBvbmVudCBpbnRvIHRoZSBgZGF0YWAgZmllbGQgaW4gdGhlIGNvbXBvbmVudC5cbiAqIF9fVXNhZ2UgOl9fXG4gKiBgYGBcbiAqICBuZ09uSW5pdCgpIHtcbiAqICAgdGhpcy5jbGlja0V2ZW50JCA9IHRoaXMuZXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7IGV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSywgcGljazogUGlja09wdGlvbnMuUElDS19PTkUgfSk7XG4gKiAgIHRoaXMuY2xpY2tFdmVudCQuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gKiAgICBpZiAocmVzdWx0LmVudGl0aWVzKSB7XG4gKiAgICAgIGNvbnN0IHBpY2tlZE1hcmtlciA9IHJlc3VsdC5lbnRpdGllc1swXTtcbiAqICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub3BlbihNYXBDb250ZXh0bWVudUNvbXBvbmVudCwgcGlja2VkTWFya2VyLnBvc2l0aW9uLCB7XG4gKiAgICAgICAgZGF0YToge1xuICogICAgICAgICAgbXlEYXRhOiBkYXRhLFxuICogICAgICAgICAgb25EZWxldGU6ICgpID0+IHRoaXMuZGVsZXRlKHBpY2tlZE1hcmtlci5pZClcbiAqICAgICAgICB9XG4gKiAgICAgIH0pO1xuICogICAgfVxuICogICB9KTtcbiAqICB9XG4gKlxuICpcbiAqICBwcml2YXRlIGRlbGV0ZShpZCkge1xuICogICAgdGhpcy5tYXBNZW51LmNsb3NlKCk7XG4gKiAgICB0aGlzLmRldGFpbGVkU2l0ZVNlcnZpY2UucmVtb3ZlTWFya2VyKGlkKTtcbiAqICB9XG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51U2VydmljZSB7XG4gIHByaXZhdGUgX3Nob3dDb250ZXh0TWVudSA9IGZhbHNlO1xuICBwcml2YXRlIF9vcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnM7XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9jb250ZW50OiBCYXNpY0NvbnRleHRNZW51O1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIGxlZnRDbGlja1JlZ2lzdHJhdGlvbjogRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBsZWZ0Q2xpY2tTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBfb25PcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9vbkNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnMgPSB7XG4gICAgY2xvc2VPbkxlZnRDTGljazogdHJ1ZSxcbiAgICBjbG9zZU9uTGVmdENsaWNrUHJpb3JpdHk6IDEwLFxuICB9O1xuXG4gIGdldCBjb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcjtcbiAgfVxuXG4gIGdldCBzaG93Q29udGV4dE1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dDb250ZXh0TWVudTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IENvbnRleHRNZW51T3B0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKTogQmFzaWNDb250ZXh0TWVudSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBnZXQgb25PcGVuKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fb25PcGVuO1xuICB9XG5cbiAgZ2V0IG9uQ2xvc2UoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9vbkNsb3NlO1xuICB9XG5cblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgfVxuXG4gIG9wZW48RD4oY29udGVudENvbXBvbmVudDogYW55LCBwb3NpdGlvbjogQ2FydGVzaWFuMywgb3B0aW9uczogQ29udGV4dE1lbnVPcHRpb25zPEQ+ID0ge30pIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnRDb21wb25lbnQ7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdENvbnRleHRNZW51T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5tYXBFdmVudHNNYW5hZ2VyICYmIHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDTGljaykge1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgICAgcHJpb3JpdHk6IHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbiA9IHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHRoaXMuX29uT3Blbi5lbWl0KCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX29wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fb25DbG9zZS5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==