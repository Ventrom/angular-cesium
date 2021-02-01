import { __decorate } from "tslib";
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
let ContextMenuService = class ContextMenuService {
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
};
ContextMenuService = __decorate([
    Injectable()
], ContextMenuService);
export { ContextMenuService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFNN0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFFSCxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQUEvQjtRQUNVLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQU96QiwrQkFBMEIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLCtCQUEwQixHQUF1QjtZQUN2RCxnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLHdCQUF3QixFQUFFLEVBQUU7U0FDN0IsQ0FBQztJQTBFSixDQUFDO0lBeEVDLElBQUkseUJBQXlCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixDQUFDO0lBQ3pDLENBQUM7SUFFRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFHRCxJQUFJLENBQUMsZ0JBQXlDO1FBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxDQUFJLGdCQUFxQixFQUFFLFFBQW9CLEVBQUUsVUFBaUMsRUFBRTtRQUN0RixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUMzRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztnQkFDMUQsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVO2dCQUM3QixJQUFJLEVBQUUsV0FBVyxDQUFDLE9BQU87Z0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QjthQUNqRCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztTQUN4QztRQUNELElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNGLENBQUE7QUF4Rlksa0JBQWtCO0lBRDlCLFVBQVUsRUFBRTtHQUNBLGtCQUFrQixDQXdGOUI7U0F4Rlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NvbnRleHQtbWVudS1vcHRpb25zJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBCYXNpY0NvbnRleHRNZW51IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Jhc2ljLWNvbnRleHQtbWVudSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuXG4vKipcbiAqIFRoZSBTZXJ2aWNlIG1hbmFnZXMgYSBzaW5nbGV0b24gY29udGV4dCBtZW51IG92ZXIgdGhlIG1hcC4gSXQgc2hvdWxkIGJlIGluaXRpYWxpemVkIHdpdGggTWFwRXZlbnRzTWFuYWdlci5cbiAqIFRoZSBTZXJ2aWNlIGFsbG93cyBvcGVuaW5nIGFuZCBjbG9zaW5nIG9mIHRoZSBjb250ZXh0IG1lbnUgYW5kIHBhc3NpbmcgZGF0YSB0byB0aGUgY29udGV4dCBtZW51IGlubmVyIGNvbXBvbmVudC5cbiAqXG4gKiBub3RpY2UsIGBkYXRhYCB3aWxsIGJlIGluamVjdGVkIHRvIHlvdXIgY3VzdG9tIG1lbnUgY29tcG9uZW50IGludG8gdGhlIGBkYXRhYCBmaWVsZCBpbiB0aGUgY29tcG9uZW50LlxuICogX19Vc2FnZSA6X19cbiAqIGBgYFxuICogIG5nT25Jbml0KCkge1xuICogICB0aGlzLmNsaWNrRXZlbnQkID0gdGhpcy5ldmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHsgZXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLCBwaWNrOiBQaWNrT3B0aW9ucy5QSUNLX09ORSB9KTtcbiAqICAgdGhpcy5jbGlja0V2ZW50JC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAqICAgIGlmIChyZXN1bHQuZW50aXRpZXMpIHtcbiAqICAgICAgY29uc3QgcGlja2VkTWFya2VyID0gcmVzdWx0LmVudGl0aWVzWzBdO1xuICogICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vcGVuKE1hcENvbnRleHRtZW51Q29tcG9uZW50LCBwaWNrZWRNYXJrZXIucG9zaXRpb24sIHtcbiAqICAgICAgICBkYXRhOiB7XG4gKiAgICAgICAgICBteURhdGE6IGRhdGEsXG4gKiAgICAgICAgICBvbkRlbGV0ZTogKCkgPT4gdGhpcy5kZWxldGUocGlja2VkTWFya2VyLmlkKVxuICogICAgICAgIH1cbiAqICAgICAgfSk7XG4gKiAgICB9XG4gKiAgIH0pO1xuICogIH1cbiAqXG4gKlxuICogIHByaXZhdGUgZGVsZXRlKGlkKSB7XG4gKiAgICB0aGlzLm1hcE1lbnUuY2xvc2UoKTtcbiAqICAgIHRoaXMuZGV0YWlsZWRTaXRlU2VydmljZS5yZW1vdmVNYXJrZXIoaWQpO1xuICogIH1cbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfc2hvd0NvbnRleHRNZW51ID0gZmFsc2U7XG4gIHByaXZhdGUgX29wdGlvbnM6IENvbnRleHRNZW51T3B0aW9ucztcbiAgcHJpdmF0ZSBfcG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2NvbnRlbnQ6IEJhc2ljQ29udGV4dE1lbnU7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgbGVmdENsaWNrUmVnaXN0cmF0aW9uOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIGxlZnRDbGlja1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9vbk9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX29uQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX2RlZmF1bHRDb250ZXh0TWVudU9wdGlvbnM6IENvbnRleHRNZW51T3B0aW9ucyA9IHtcbiAgICBjbG9zZU9uTGVmdENMaWNrOiB0cnVlLFxuICAgIGNsb3NlT25MZWZ0Q2xpY2tQcmlvcml0eTogMTAsXG4gIH07XG5cbiAgZ2V0IGNvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyO1xuICB9XG5cbiAgZ2V0IHNob3dDb250ZXh0TWVudSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0NvbnRleHRNZW51O1xuICB9XG5cbiAgZ2V0IG9wdGlvbnMoKTogQ29udGV4dE1lbnVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuXG4gIGdldCBwb3NpdGlvbigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cblxuICBnZXQgY29udGVudCgpOiBCYXNpY0NvbnRleHRNZW51IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIGdldCBvbk9wZW4oKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9vbk9wZW47XG4gIH1cblxuICBnZXQgb25DbG9zZSgpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX29uQ2xvc2U7XG4gIH1cblxuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UpIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICB9XG5cbiAgb3BlbjxEPihjb250ZW50Q29tcG9uZW50OiBhbnksIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBvcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnM8RD4gPSB7fSkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudENvbXBvbmVudDtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSB0cnVlO1xuICAgIGlmICh0aGlzLm1hcEV2ZW50c01hbmFnZXIgJiYgdGhpcy5fb3B0aW9ucy5jbG9zZU9uTGVmdENMaWNrKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgICBwcmlvcml0eTogdGhpcy5fb3B0aW9ucy5jbG9zZU9uTGVmdENsaWNrUHJpb3JpdHksXG4gICAgICB9KTtcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uID0gdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fb25PcGVuLmVtaXQoKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24pIHtcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcbiAgICB0aGlzLl9vbkNsb3NlLmVtaXQoKTtcbiAgfVxufVxuIl19