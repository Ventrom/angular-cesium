/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
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
    /**
     * @return {?}
     */
    get contextMenuChangeNotifier() {
        return this._contextMenuChangeNotifier;
    }
    /**
     * @return {?}
     */
    get showContextMenu() {
        return this._showContextMenu;
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @return {?}
     */
    get position() {
        return this._position;
    }
    /**
     * @return {?}
     */
    get content() {
        return this._content;
    }
    /**
     * @return {?}
     */
    get onOpen() {
        return this._onOpen;
    }
    /**
     * @return {?}
     */
    get onClose() {
        return this._onClose;
    }
    /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    init(mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    }
    /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    open(content, position, options = {}) {
        this.close();
        this._content = content;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe((/**
             * @return {?}
             */
            () => {
                this.leftClickSubscription.unsubscribe();
                this.close();
            }));
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    }
    /**
     * @return {?}
     */
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._showContextMenu;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._options;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._position;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._content;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype.mapEventsManager;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype.leftClickRegistration;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype.leftClickSubscription;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._contextMenuChangeNotifier;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._onOpen;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._onClose;
    /**
     * @type {?}
     * @private
     */
    ContextMenuService.prototype._defaultContextMenuOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0RBQWdELENBQUM7Ozs7O0FBWTdFLE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFFVSxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFPekIsK0JBQTBCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QiwrQkFBMEIsR0FBdUI7WUFDdkQsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0Qix3QkFBd0IsRUFBRSxFQUFFO1NBQzdCLENBQUM7SUEwRUosQ0FBQzs7OztJQXhFQyxJQUFJLHlCQUF5QjtRQUMzQixPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQztJQUN6QyxDQUFDOzs7O0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7OztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDOzs7OztJQUdELElBQUksQ0FBQyxnQkFBeUM7UUFDNUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7Ozs7Ozs7SUFFRCxJQUFJLENBQUMsT0FBWSxFQUFFLFFBQW9CLEVBQUUsVUFBOEIsRUFBRTtRQUN2RSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDM0QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Z0JBQzFELEtBQUssRUFBRSxXQUFXLENBQUMsVUFBVTtnQkFDN0IsSUFBSSxFQUFFLFdBQVcsQ0FBQyxPQUFPO2dCQUN6QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0I7YUFDakQsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ3JFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQyxFQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztTQUN4QztRQUNELElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7O1lBeEZGLFVBQVU7Ozs7Ozs7SUFFVCw4Q0FBaUM7Ozs7O0lBQ2pDLHNDQUFxQzs7Ozs7SUFDckMsdUNBQThCOzs7OztJQUM5QixzQ0FBbUM7Ozs7O0lBQ25DLDhDQUFrRDs7Ozs7SUFDbEQsbURBQXlEOzs7OztJQUN6RCxtREFBNEM7Ozs7O0lBQzVDLHdEQUF3RDs7Ozs7SUFDeEQscUNBQXFDOzs7OztJQUNyQyxzQ0FBc0M7Ozs7O0lBQ3RDLHdEQUdFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NvbnRleHQtbWVudS1vcHRpb25zJztcbmltcG9ydCB7IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9tYXAtZXZlbnRzLW1hbmFnZXInO1xuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XG5pbXBvcnQgeyBQaWNrT3B0aW9ucyB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvY29uc3RzL3BpY2tPcHRpb25zLmVudW0nO1xuaW1wb3J0IHsgRGlzcG9zYWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Rpc3Bvc2FibGUtb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBCYXNpY0NvbnRleHRNZW51IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Jhc2ljLWNvbnRleHQtbWVudSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuXG4vKipcbiAqIFRoZSBTZXJ2aWNlIG1hbmFnZXMgYSBzaW5nbGV0b24gY29udGV4dCBtZW51IG92ZXIgdGhlIG1hcC4gSXQgc2hvdWxkIGJlIGluaXRpYWxpemVkIHdpdGggTWFwRXZlbnRzTWFuYWdlci5cbiAqIFRoZSBTZXJ2aWNlIGFsbG93cyBvcGVuaW5nIGFuZCBjbG9zaW5nIG9mIHRoZSBjb250ZXh0IG1lbnUgYW5kIHBhc3NpbmcgZGF0YSB0byB0aGUgY29udGV4dCBtZW51IGlubmVyIGNvbXBvbmVudC5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfc2hvd0NvbnRleHRNZW51ID0gZmFsc2U7XG4gIHByaXZhdGUgX29wdGlvbnM6IENvbnRleHRNZW51T3B0aW9ucztcbiAgcHJpdmF0ZSBfcG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2NvbnRlbnQ6IEJhc2ljQ29udGV4dE1lbnU7XG4gIHByaXZhdGUgbWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U7XG4gIHByaXZhdGUgbGVmdENsaWNrUmVnaXN0cmF0aW9uOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIGxlZnRDbGlja1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9vbk9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX29uQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByaXZhdGUgX2RlZmF1bHRDb250ZXh0TWVudU9wdGlvbnM6IENvbnRleHRNZW51T3B0aW9ucyA9IHtcbiAgICBjbG9zZU9uTGVmdENMaWNrOiB0cnVlLFxuICAgIGNsb3NlT25MZWZ0Q2xpY2tQcmlvcml0eTogMTAsXG4gIH07XG5cbiAgZ2V0IGNvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyO1xuICB9XG5cbiAgZ2V0IHNob3dDb250ZXh0TWVudSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0NvbnRleHRNZW51O1xuICB9XG5cbiAgZ2V0IG9wdGlvbnMoKTogQ29udGV4dE1lbnVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuXG4gIGdldCBwb3NpdGlvbigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gIH1cblxuICBnZXQgY29udGVudCgpOiBCYXNpY0NvbnRleHRNZW51IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuXG4gIGdldCBvbk9wZW4oKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9vbk9wZW47XG4gIH1cblxuICBnZXQgb25DbG9zZSgpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX29uQ2xvc2U7XG4gIH1cblxuXG4gIGluaXQobWFwRXZlbnRzTWFuYWdlcjogTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UpIHtcbiAgICB0aGlzLm1hcEV2ZW50c01hbmFnZXIgPSBtYXBFdmVudHNNYW5hZ2VyO1xuICB9XG5cbiAgb3Blbihjb250ZW50OiBhbnksIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBvcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9jb250ZW50ID0gY29udGVudDtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSB0cnVlO1xuICAgIGlmICh0aGlzLm1hcEV2ZW50c01hbmFnZXIgJiYgdGhpcy5fb3B0aW9ucy5jbG9zZU9uTGVmdENMaWNrKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbiA9IHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7XG4gICAgICAgIGV2ZW50OiBDZXNpdW1FdmVudC5MRUZUX0NMSUNLLFxuICAgICAgICBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLLFxuICAgICAgICBwcmlvcml0eTogdGhpcy5fb3B0aW9ucy5jbG9zZU9uTGVmdENsaWNrUHJpb3JpdHksXG4gICAgICB9KTtcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uID0gdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fb25PcGVuLmVtaXQoKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuX2NvbnRlbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9zaG93Q29udGV4dE1lbnUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24pIHtcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLmVtaXQoKTtcbiAgICB0aGlzLl9vbkNsb3NlLmVtaXQoKTtcbiAgfVxufVxuIl19