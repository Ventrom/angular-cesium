/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
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
        get: /**
         * @return {?}
         */
        function () {
            return this._contextMenuChangeNotifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "showContextMenu", {
        get: /**
         * @return {?}
         */
        function () {
            return this._showContextMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "options", {
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "position", {
        get: /**
         * @return {?}
         */
        function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "content", {
        get: /**
         * @return {?}
         */
        function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onOpen", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextMenuService.prototype, "onClose", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onClose;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    ContextMenuService.prototype.init = /**
     * @param {?} mapEventsManager
     * @return {?}
     */
    function (mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    };
    /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    ContextMenuService.prototype.open = /**
     * @param {?} content
     * @param {?} position
     * @param {?=} options
     * @return {?}
     */
    function (content, position, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
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
            function () {
                _this.leftClickSubscription.unsubscribe();
                _this.close();
            }));
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    };
    /**
     * @return {?}
     */
    ContextMenuService.prototype.close = /**
     * @return {?}
     */
    function () {
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
    ContextMenuService.decorators = [
        { type: Injectable }
    ];
    return ContextMenuService;
}());
export { ContextMenuService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM5RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0RBQWdELENBQUM7Ozs7O0FBVzdFO0lBQUE7UUFFVSxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFPekIsK0JBQTBCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QiwrQkFBMEIsR0FBdUI7WUFDdkQsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0Qix3QkFBd0IsRUFBRSxFQUFFO1NBQzdCLENBQUM7SUEwRUosQ0FBQztJQXhFQyxzQkFBSSx5REFBeUI7Ozs7UUFBN0I7WUFDRSxPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQztRQUN6QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLCtDQUFlOzs7O1FBQW5CO1lBQ0UsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBTzs7OztRQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksd0NBQVE7Ozs7UUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHVDQUFPOzs7O1FBQVg7WUFDRSxPQUFPLElB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Q3hELHFDQUFxQzs7Ozs7SUFDckMsc0NBQXNDOzs7OztJQUN0Qyx3REFHRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvbnRleHRNZW51T3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9jb250ZXh0LW1lbnUtb3B0aW9ucyc7XG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcbmltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9jb25zdHMvY2VzaXVtLWV2ZW50LmVudW0nO1xuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuLi9tYXAtZXZlbnRzLW1hbmFuZ2VyL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcbmltcG9ydCB7IERpc3Bvc2FibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vbWFwLWV2ZW50cy1tYW5hbmdlci9kaXNwb3NhYmxlLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0TWVudSB9IGZyb20gJy4uLy4uL21vZGVscy9iYXNpYy1jb250ZXh0LW1lbnUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cblxuLyoqXG4gKiBUaGUgU2VydmljZSBtYW5hZ2VzIGEgc2luZ2xldG9uIGNvbnRleHQgbWVudSBvdmVyIHRoZSBtYXAuIEl0IHNob3VsZCBiZSBpbml0aWFsaXplZCB3aXRoIE1hcEV2ZW50c01hbmFnZXIuXG4gKiBUaGUgU2VydmljZSBhbGxvd3Mgb3BlbmluZyBhbmQgY2xvc2luZyBvZiB0aGUgY29udGV4dCBtZW51IGFuZCBwYXNzaW5nIGRhdGEgdG8gdGhlIGNvbnRleHQgbWVudSBpbm5lciBjb21wb25lbnQuXG4gKi9cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51U2VydmljZSB7XG4gIHByaXZhdGUgX3Nob3dDb250ZXh0TWVudSA9IGZhbHNlO1xuICBwcml2YXRlIF9vcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnM7XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9jb250ZW50OiBCYXNpY0NvbnRleHRNZW51O1xuICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlO1xuICBwcml2YXRlIGxlZnRDbGlja1JlZ2lzdHJhdGlvbjogRGlzcG9zYWJsZU9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSBsZWZ0Q2xpY2tTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBfb25PcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9vbkNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF9kZWZhdWx0Q29udGV4dE1lbnVPcHRpb25zOiBDb250ZXh0TWVudU9wdGlvbnMgPSB7XG4gICAgY2xvc2VPbkxlZnRDTGljazogdHJ1ZSxcbiAgICBjbG9zZU9uTGVmdENsaWNrUHJpb3JpdHk6IDEwLFxuICB9O1xuXG4gIGdldCBjb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllcjtcbiAgfVxuXG4gIGdldCBzaG93Q29udGV4dE1lbnUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dDb250ZXh0TWVudTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IENvbnRleHRNZW51T3B0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKTogQmFzaWNDb250ZXh0TWVudSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBnZXQgb25PcGVuKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fb25PcGVuO1xuICB9XG5cbiAgZ2V0IG9uQ2xvc2UoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9vbkNsb3NlO1xuICB9XG5cblxuICBpbml0KG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyID0gbWFwRXZlbnRzTWFuYWdlcjtcbiAgfVxuXG4gIG9wZW4oY29udGVudDogYW55LCBwb3NpdGlvbjogQ2FydGVzaWFuMywgb3B0aW9uczogQ29udGV4dE1lbnVPcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fY29udGVudCA9IGNvbnRlbnQ7XG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdENvbnRleHRNZW51T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5tYXBFdmVudHNNYW5hZ2VyICYmIHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDTGljaykge1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tSZWdpc3RyYXRpb24gPSB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoe1xuICAgICAgICBldmVudDogQ2VzaXVtRXZlbnQuTEVGVF9DTElDSyxcbiAgICAgICAgcGljazogUGlja09wdGlvbnMuTk9fUElDSyxcbiAgICAgICAgcHJpb3JpdHk6IHRoaXMuX29wdGlvbnMuY2xvc2VPbkxlZnRDbGlja1ByaW9yaXR5LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbiA9IHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuZW1pdCgpO1xuICAgIHRoaXMuX29uT3Blbi5lbWl0KCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLl9jb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX29wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc2hvd0NvbnRleHRNZW51ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubGVmdENsaWNrUmVnaXN0cmF0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmxlZnRDbGlja1JlZ2lzdHJhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHRoaXMubGVmdENsaWNrU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxlZnRDbGlja1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5sZWZ0Q2xpY2tTdWJzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5lbWl0KCk7XG4gICAgdGhpcy5fb25DbG9zZS5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==