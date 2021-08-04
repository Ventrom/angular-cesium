import { EventEmitter, Injectable } from '@angular/core';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
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
}
ContextMenuService.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUl6RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saURBQWlELENBQUM7QUFDOUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBTTdFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQUQvQjtRQUVVLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQU96QiwrQkFBMEIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLCtCQUEwQixHQUF1QjtZQUN2RCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLHdCQUF3QixFQUFFLEVBQUU7U0FDN0IsQ0FBQztJQTBFSixDQUFDO0lBeEVDLElBQUkseUJBQXlCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxJQUFJLENBQUMsZ0JBQXlDO1FBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxDQUFJLGdCQUFxQixFQUFFLFFBQW9CLEVBQUUsVUFBaUMsRUFBRTtRQUN0RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUMzRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztnQkFDMUQsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVO2dCQUM3QixJQUFJLEVBQUUsV0FBVyxDQUFDLE9BQU87Z0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QjthQUNqRCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztTQUN4QztRQUNELElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7O1lBeEZGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb250ZXh0TWVudU9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvY29udGV4dC1tZW51LW9wdGlvbnMnO1xuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XG5pbXBvcnQgeyBDZXNpdW1FdmVudCB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcbmltcG9ydCB7IFBpY2tPcHRpb25zIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvcGlja09wdGlvbnMuZW51bSc7XG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IEJhc2ljQ29udGV4dE1lbnUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYmFzaWMtY29udGV4dC1tZW51JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5cbi8qKlxuICogVGhlIFNlcnZpY2UgbWFuYWdlcyBhIHNpbmdsZXRvbiBjb250ZXh0IG1lbnUgb3ZlciB0aGUgbWFwLiBJdCBzaG91bGQgYmUgaW5pdGlhbGl6ZWQgd2l0aCBNYXBFdmVudHNNYW5hZ2VyLlxuICogVGhlIFNlcnZpY2UgYWxsb3dzIG9wZW5pbmcgYW5kIGNsb3Npbmcgb2YgdGhlIGNvbnRleHQgbWVudSBhbmQgcGFzc2luZyBkYXRhIHRvIHRoZSBjb250ZXh0IG1lbnUgaW5uZXIgY29tcG9uZW50LlxuICpcbiAqIG5vdGljZSwgYGRhdGFgIHdpbGwgYmUgaW5qZWN0ZWQgdG8geW91ciBjdXN0b20gbWVudSBjb21wb25lbnQgaW50byB0aGUgYGRhdGFgIGZpZWxkIGluIHRoZSBjb21wb25lbnQuXG4gKiBfX1VzYWdlIDpfX1xuICogYGBgXG4gKiAgbmdPbkluaXQoKSB7XG4gKiAgIHRoaXMuY2xpY2tFdmVudCQgPSB0aGlzLmV2ZW50c01hbmFnZXIucmVnaXN0ZXIoeyBldmVudDogQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0ssIHBpY2s6IFBpY2tPcHRpb25zLlBJQ0tfT05FIH0pO1xuICogICB0aGlzLmNsaWNrRXZlbnQkLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICogICAgaWYgKHJlc3VsdC5lbnRpdGllcykge1xuICogICAgICBjb25zdCBwaWNrZWRNYXJrZXIgPSByZXN1bHQuZW50aXRpZXNbMF07XG4gKiAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oTWFwQ29udGV4dG1lbnVDb21wb25lbnQsIHBpY2tlZE1hcmtlci5wb3NpdGlvbiwge1xuICogICAgICAgIGRhdGE6IHtcbiAqICAgICAgICAgIG15RGF0YTogZGF0YSxcbiAqICAgICAgICAgIG9uRGVsZXRlOiAoKSA9PiB0aGlzLmRlbGV0ZShwaWNrZWRNYXJrZXIuaWQpXG4gKiAgICAgICAgfVxuICogICAgICB9KTtcbiAqICAgIH1cbiAqICAgfSk7XG4gKiAgfVxuICpcbiAqXG4gKiAgcHJpdmF0ZSBkZWxldGUoaWQpIHtcbiAqICAgIHRoaXMubWFwTWVudS5jbG9zZSgpO1xuICogICAgdGhpcy5kZXRhaWxlZFNpdGVTZXJ2aWNlLnJlbW92ZU1hcmtlcihpZCk7XG4gKiAgfVxuICogYGBgXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudVNlcnZpY2Uge1xuICBwcml2YXRlIF9zaG93Q29udGV4dE1lbnUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfb3B0aW9uczogQ29udGV4dE1lbnVPcHRpb25zO1xuICBwcml2YXRlIF9wb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfY29udGVudDogQmFzaWNDb250ZXh0TWVudTtcbiAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZTtcbiAgcHJpdmF0ZSBsZWZ0Q2xpY2tSZWdpc3RyYXRpb246IERpc3Bvc2FibGVPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgbGVmdENsaWNrU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX29uT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBfb25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBfZGVmYXVsdENvbnRleHRNZW51T3B0aW9uczogQ29udGV4dE1lbnVPcHRpb25zID0ge1xuICAgIGNsb3NlT25MZWZ0Q0xpY2s6IHRydWUsXG4gICAgY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5OiAxMCxcbiAgfTtcblxuICBnZXQgY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcigpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXI7XG4gIH1cblxuICBnZXQgc2hvd0NvbnRleHRNZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93Q29udGV4dE1lbnU7XG4gIH1cblxuICBnZXQgb3B0aW9ucygpOiBDb250ZXh0TWVudU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIGdldCBjb250ZW50KCk6IEJhc2ljQ29udGV4dE1lbnUge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50O1xuICB9XG5cbiAgZ2V0IG9uT3BlbigpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX29uT3BlbjtcbiAgfVxuXG4gIGdldCBvbkNsb3NlKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fb25DbG9zZTtcbiAgfVxuXG5cbiAgaW5pdChtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSkge1xuICAgIHRoaXMubWFwRXZlbnRzTWFuYWdlciA9IG1hcEV2ZW50c01hbmFnZXI7XG4gIH1cblxuICBvcGVuPEQ+KGNvbnRlbnRDb21wb25lbnQ6IGFueSwgcG9zaXRpb246IENhcnRlc2lhbjMsIG9wdGlvbnM6IENvbnRleHRNZW51T3B0aW9uczxEPiA9IHt9KSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50Q29tcG9uZW50O1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2RlZmF1bHRDb250ZXh0TWVudU9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMuX3Nob3dDb250ZXh0TWVudSA9IHRydWU7XG4gICAgaWYgKHRoaXMubWFwRXZlbnRzTWFuYWdlciAmJiB0aGlzLl9vcHRpb25zLmNsb3NlT25MZWZ0Q0xpY2spIHtcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uID0gdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHtcbiAgICAgICAgZXZlbnQ6IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0ssXG4gICAgICAgIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0ssXG4gICAgICAgIHByaW9yaXR5OiB0aGlzLl9vcHRpb25zLmNsb3NlT25MZWZ0Q2xpY2tQcmlvcml0eSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24gPSB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcbiAgICB0aGlzLl9vbk9wZW4uZW1pdCgpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5fY29udGVudCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9vcHRpb25zID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Nob3dDb250ZXh0TWVudSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbikge1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24uZGlzcG9zZSgpO1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHRoaXMuX29uQ2xvc2UuZW1pdCgpO1xuICB9XG59XG4iXX0=