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
var ContextMenuService = /** @class */ (function () {
    function ContextMenuService() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    Object.defineProperty(ContextMenuService.prototype, "contextMenuChangeNotifier", {
        get: function () {
            return this._contextMenuChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "showContextMenu", {
        get: function () {
            return this._showContextMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onOpen", {
        get: function () {
            return this._onOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onClose", {
        get: function () {
            return this._onClose;
        },
        enumerable: true,
        configurable: true
    });
    ContextMenuService.prototype.init = function (mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    };
    ContextMenuService.prototype.open = function (contentComponent, position, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
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
            this.leftClickSubscription = this.leftClickRegistration.subscribe(function () {
                _this.leftClickSubscription.unsubscribe();
                _this.close();
            });
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    };
    ContextMenuService.prototype.close = function () {
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
    };
    ContextMenuService = __decorate([
        Injectable()
    ], ContextMenuService);
    return ContextMenuService;
}());
export { ContextMenuService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFNN0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFFSDtJQUFBO1FBQ1UscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBT3pCLCtCQUEwQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEQsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsK0JBQTBCLEdBQXVCO1lBQ3ZELGdCQUFnQixFQUFFLElBQUk7WUFDdEIsd0JBQXdCLEVBQUUsRUFBRTtTQUM3QixDQUFDO0lBMEVKLENBQUM7SUF4RUMsc0JBQUkseURBQXlCO2FBQTdCO1lBQ0UsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDekMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQ0FBZTthQUFuQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQy9CLENBQUM7OztPQUFBO0lBRUQsc0JBQUksdUNBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHdDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksc0NBQU07YUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHVDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7O09BQUE7SUFHRCxpQ0FBSSxHQUFKLFVBQUssZ0JBQXlDO1FBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztJQUMzQyxDQUFDO0lBRUQsaUNBQUksR0FBSixVQUFRLGdCQUFxQixFQUFFLFFBQW9CLEVBQUUsT0FBbUM7UUFBeEYsaUJBb0JDO1FBcEJvRCx3QkFBQSxFQUFBLFlBQW1DO1FBQ3RGLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQzNELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO2dCQUMxRCxLQUFLLEVBQUUsV0FBVyxDQUFDLFVBQVU7Z0JBQzdCLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTztnQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCO2FBQ2pELENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDO2dCQUNoRSxLQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3pDLEtBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsa0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7U0FDeEM7UUFDRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUF2RlUsa0JBQWtCO1FBRDlCLFVBQVUsRUFBRTtPQUNBLGtCQUFrQixDQXdGOUI7SUFBRCx5QkFBQztDQUFBLEFBeEZELElBd0ZDO1NBeEZZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvbnRleHRNZW51T3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9jb250ZXh0LW1lbnUtb3B0aW9ucyc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0TWVudSB9IGZyb20gJy4uLy4uL21vZGVscy9iYXNpYy1jb250ZXh0LW1lbnUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cblxuLyoqXG4gKiBUaGUgU2VydmljZSBtYW5hZ2VzIGEgc2luZ2xldG9uIGNvbnRleHQgbWVudSBvdmVyIHRoZSBtYXAuIEl0IHNob3VsZCBiZSBpbml0aWFsaXplZCB3aXRoIE1hcEV2ZW50c01hbmFnZXIuXG4gKiBUaGUgU2VydmljZSBhbGxvd3Mgb3BlbmluZyBhbmQgY2xvc2luZyBvZiB0aGUgY29udGV4dCBtZW51IGFuZCBwYXNzaW5nIGRhdGEgdG8gdGhlIGNvbnRleHQgbWVudSBpbm5lciBjb21wb25lbnQuXG4gKlxuICogbm90aWNlLCBgZGF0YWAgd2lsbCBiZSBpbmplY3RlZCB0byB5b3VyIGN1c3RvbSBtZW51IGNvbXBvbmVudCBpbnRvIHRoZSBgZGF0YWAgZmllbGQgaW4gdGhlIGNvbXBvbmVudC5cbiAqIF9fVXNhZ2UgOl9fXG4gKiBgYGBcbiAqICBuZ09uSW5pdCgpIHtcbiAqICAgdGhpcy5jbGlja0V2ZW50JCA9IHRoaXMuZXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7IGV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSywgcGljazogUGlja09wdGlvbnMuUElDS19PTkUgfSk7XG4gKiAgIHRoaXMuY2xpY2tFdmVudCQuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gKiAgICBpZiAocmVzdWx0LmVudGl0aWVzKSB7XG4gKiAgICAgIGNvbnN0IHBpY2tlZE1hcmtlciA9IHJlc3VsdC5lbnRpdGllc1swXTtcbiAqICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub3BlbihNYXBDb250ZXh0bWVudUNvbXBvbmVudCwgcGlja2VkTWFya2VyLnBvc2l0aW9uLCB7XG4gKiAgICAgICAgZGF0YToge1xuICogICAgICAgICAgbXlEYXRhOiBkYXRhLFxuICogICAgICAgICAgb25EZWxldGU6ICgpID0+IHRoaXMuZGVsZXRlKHBpY2tlZE1hcmtlci5pZClcbiAqICAgICAgICB9XG4gKiAgICAgIH0pO1xuICogICAgfVxuICogICB9KTtcbiAqICB9XG4gKlxuICpcbiAqICBwcml2YXRlIGRlbGV0ZShpZCkge1xuICogICAgdGhpcy5tYXBNZW51LmNsb3NlKCk7XG4gKiAgICB0aGlzLmRldGFpbGVkU2l0ZVNlcnZpY2UucmVtb3ZlTWFya2VyKGlkKTtcbiAqICB9XG4gKiBgYGBcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51U2VydmljZSB7XG4gIHByaXZhdGUgX3Nob3dDb250ZXh0TWVudSA9IGZhbHNlO1xuICBwcml2YXRlIF9vcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnM7XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9jb250ZW50OiBCYXNpY0NvbnRleHRNZW51O1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIGxlZnRDbGlja1JlZ2lzdHJhdGlvbjogRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBsZWZ0Q2xpY2tTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBfb25PcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9vbkNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnMgPSB7XG4gICAgY2xvc2VPbkxlZnRDTGljazogdHJ1ZSxcbiAgICBjbG9zZU9uTGVmdENsaWNrUHJpb3JpdHk6IDEwLFxuICB9O1xuXG4gIGdldCBjb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcjtcbiAgfVxuXG4gIGdldCBzaG93Q29udGV4dE1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dDb250ZXh0TWVudTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IENvbnRleHRNZW51T3B0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKTogQmFzaWNDb250ZXh0TWVudSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBnZXQgb25PcGVuKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fb25PcGVuO1xuICB9XG5cbiAgZ2V0IG9uQ2xvc2UoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9vbkNsb3NlO1xuICB9XG5cblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgfVxuXG4gIG9wZW48RD4oY29udGVudENvbXBvbmVudDogYW55LCBwb3NpdGlvbjogQ2FydGVzaWFuMywgb3B0aW9uczogQ29udGV4dE1lbnVPcHRpb25zPEQ+ID0ge30pIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnRDb21wb25lbnQ7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdENvbnRleHRNZW51T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5tYXBFdmVudHNNYW5hZ2VyICYmIHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDTGljaykge1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgICAgcHJpb3JpdHk6IHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbiA9IHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHRoaXMuX29uT3Blbi5lbWl0KCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX29wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fb25DbG9zZS5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==