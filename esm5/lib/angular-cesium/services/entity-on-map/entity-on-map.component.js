/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Input } from '@angular/core';
/**
 *  Extend this class to create drawing on map components.
 */
var EntityOnMapComponent = /** @class */ (function () {
    function EntityOnMapComponent(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = false;
        /** @type {?} */
        var dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.removeFromMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    };
    /**
     * @return {?}
     */
    EntityOnMapComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    };
    EntityOnMapComponent.propDecorators = {
        props: [{ type: Input }]
    };
    return EntityOnMapComponent;
}());
export { EntityOnMapComponent };
if (false) {
    /** @type {?} */
    EntityOnMapComponent.prototype.props;
    /**
     * @type {?}
     * @protected
     */
    EntityOnMapComponent.prototype.selfPrimitive;
    /**
     * @type {?}
     * @protected
     */
    EntityOnMapComponent.prototype.selfPrimitiveIsDraw;
    /**
     * @type {?}
     * @protected
     */
    EntityOnMapComponent.prototype.dataSources;
    /**
     * @type {?}
     * @protected
     */
    EntityOnMapComponent.prototype._drawer;
    /**
     * @type {?}
     * @private
     */
    EntityOnMapComponent.prototype.mapLayers;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQzs7OztBQU9uRjtJQVFFLDhCQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQzs7OztJQUVELHVDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7O1lBQzNCLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtRQUN2QyxJQUFJLFdBQVcsRUFBRTtZQUNmLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQy9CLDJEQUEyRDtTQUM1RDtRQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7OztJQUVELDBDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjs7WUFDMUIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7OztJQUVELHdDQUFTOzs7SUFBVDtRQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7O0lBRUQsNENBQWE7OztJQUFiO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7O0lBRUQsMENBQVc7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7Ozs7SUFFRCwwQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7d0JBOUNBLEtBQUs7O0lBK0NSLDJCQUFDO0NBQUEsQUFoREQsSUFnREM7U0FoRFksb0JBQW9COzs7SUFDL0IscUNBQ1c7Ozs7O0lBRVgsNkNBQTZCOzs7OztJQUM3QixtREFBdUM7Ozs7O0lBQ3ZDLDJDQUEyQjs7Ozs7SUFFZix1Q0FBcUM7Ozs7O0lBQUUseUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIEV4dGVuZCB0aGlzIGNsYXNzIHRvIGNyZWF0ZSBkcmF3aW5nIG9uIG1hcCBjb21wb25lbnRzLlxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5T25NYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgcHJvcHM6IGFueTtcblxuICBwcm90ZWN0ZWQgc2VsZlByaW1pdGl2ZTogYW55O1xuICBwcm90ZWN0ZWQgc2VsZlByaW1pdGl2ZUlzRHJhdzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGRhdGFTb3VyY2VzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9kcmF3ZXI6IEJhc2ljRHJhd2VyU2VydmljZSwgcHJpdmF0ZSBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IGZhbHNlO1xuICAgIGNvbnN0IGRhdGFTb3VyY2VzID0gdGhpcy5fZHJhd2VyLmluaXQoKTtcbiAgICBpZiAoZGF0YVNvdXJjZXMpIHtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlcztcbiAgICAgIC8vIHRoaXMubWFwTGF5ZXJzLnJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkYXRhU291cmNlcywgMCk7XG4gICAgfVxuICAgIHRoaXMuZHJhd09uTWFwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJvcHMgPSBjaGFuZ2VzWydwcm9wcyddO1xuICAgIGlmIChwcm9wcy5jdXJyZW50VmFsdWUgIT09IHByb3BzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlT25NYXAoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3T25NYXAoKSB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5zZWxmUHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZCh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21NYXAoKSB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdlci5yZW1vdmUodGhpcy5zZWxmUHJpbWl0aXZlKTtcbiAgfVxuXG4gIHVwZGF0ZU9uTWFwKCkge1xuICAgIGlmICh0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kcmF3ZXIudXBkYXRlKHRoaXMuc2VsZlByaW1pdGl2ZSwgdGhpcy5wcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnMucmVtb3ZlRGF0YVNvdXJjZXModGhpcy5kYXRhU291cmNlcyk7XG4gICAgdGhpcy5yZW1vdmVGcm9tTWFwKCk7XG4gIH1cbn1cbiJdfQ==