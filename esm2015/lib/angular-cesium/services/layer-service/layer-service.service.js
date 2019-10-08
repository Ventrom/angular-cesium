/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
export class LayerService {
    constructor() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get cache() {
        return this._cache;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set cache(value) {
        this._cache = value;
    }
    /**
     * @return {?}
     */
    get zIndex() {
        return this._zIndex;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set zIndex(value) {
        if (value !== this._zIndex) {
            this.layerUpdate.emit();
        }
        this._zIndex = value;
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set show(value) {
        if (value !== this._show) {
            this.layerUpdate.emit();
        }
        this._show = value;
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set options(value) {
        this._options = value;
        this.layerUpdate.emit();
    }
    /**
     * @return {?}
     */
    get context() {
        return this._context;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    set context(context) {
        this._context = context;
        this.layerUpdate.emit();
    }
    /**
     * @param {?} name
     * @return {?}
     */
    setEntityName(name) {
        this._entityName = name;
    }
    /**
     * @return {?}
     */
    getEntityName() {
        return this._entityName;
    }
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    registerDescription(descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    }
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    unregisterDescription(descriptionComponent) {
        /** @type {?} */
        const index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    }
    /**
     * @return {?}
     */
    getDescriptions() {
        return this.descriptions;
    }
    /**
     * @return {?}
     */
    layerUpdates() {
        return this.layerUpdate;
    }
}
LayerService.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._context;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._options;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._show;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._zIndex;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._entityName;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._cache;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype.descriptions;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype.layerUpdate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS3pELE1BQU0sT0FBTyxZQUFZO0lBRHpCO1FBT1UsV0FBTSxHQUFHLElBQUksQ0FBQztRQUNkLGlCQUFZLEdBQW1CLEVBQUUsQ0FBQztRQUNsQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUE4RTNDLENBQUM7Ozs7SUE1RUMsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7Ozs7O0lBRUQsSUFBSSxLQUFLLENBQUMsS0FBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDOzs7O0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7Ozs7O0lBRUQsSUFBSSxNQUFNLENBQUMsS0FBYTtRQUN0QixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDOzs7O0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBYztRQUNyQixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDOzs7O0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7O0lBRUQsSUFBSSxPQUFPLENBQUMsS0FBbUI7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs7O0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7O0lBRUQsSUFBSSxPQUFPLENBQUMsT0FBTztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsYUFBYSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs7OztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQzs7Ozs7SUFFRCxtQkFBbUIsQ0FBQyxvQkFBa0M7UUFDcEQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxxQkFBcUIsQ0FBQyxvQkFBa0M7O2NBQ2hELEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztRQUM3RCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7Ozs7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7OztZQXRGRixVQUFVOzs7Ozs7O0lBRVQsZ0NBQXNCOzs7OztJQUN0QixnQ0FBK0I7Ozs7O0lBQy9CLDZCQUF1Qjs7Ozs7SUFDdkIsK0JBQXdCOzs7OztJQUN4QixtQ0FBNEI7Ozs7O0lBQzVCLDhCQUFzQjs7Ozs7SUFDdEIsb0NBQTBDOzs7OztJQUMxQyxtQ0FBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElEZXNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9kZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBMYXllck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5ZXItb3B0aW9ucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMYXllclNlcnZpY2Uge1xuICBwcml2YXRlIF9jb250ZXh0OiBhbnk7XG4gIHByaXZhdGUgX29wdGlvbnM6IExheWVyT3B0aW9ucztcbiAgcHJpdmF0ZSBfc2hvdzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgX2VudGl0eU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBfY2FjaGUgPSB0cnVlO1xuICBwcml2YXRlIGRlc2NyaXB0aW9uczogSURlc2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBsYXllclVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXQgY2FjaGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xuICB9XG5cbiAgc2V0IGNhY2hlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2FjaGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4O1xuICB9XG5cbiAgc2V0IHpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICAgIH1cbiAgICB0aGlzLl96SW5kZXggPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzaG93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93O1xuICB9XG5cbiAgc2V0IHNob3codmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Nob3cpIHtcbiAgICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICAgIH1cbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3B0aW9ucygpOiBMYXllck9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICB9XG5cbiAgc2V0IG9wdGlvbnModmFsdWU6IExheWVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcbiAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgfVxuXG4gIGdldCBjb250ZXh0KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XG4gIH1cblxuICBzZXQgY29udGV4dChjb250ZXh0KSB7XG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gIH1cblxuICBzZXRFbnRpdHlOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX2VudGl0eU5hbWUgPSBuYW1lO1xuICB9XG5cbiAgZ2V0RW50aXR5TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdHlOYW1lO1xuICB9XG5cbiAgcmVnaXN0ZXJEZXNjcmlwdGlvbihkZXNjcmlwdGlvbkNvbXBvbmVudDogSURlc2NyaXB0aW9uKSB7XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpIDwgMCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMucHVzaChkZXNjcmlwdGlvbkNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlckRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uQ29tcG9uZW50OiBJRGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGdldERlc2NyaXB0aW9ucygpOiBJRGVzY3JpcHRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb25zO1xuICB9XG5cbiAgbGF5ZXJVcGRhdGVzKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5sYXllclVwZGF0ZTtcbiAgfVxufVxuIl19