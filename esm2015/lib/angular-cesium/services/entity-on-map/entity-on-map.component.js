/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Input } from '@angular/core';
/**
 *  Extend this class to create drawing on map components.
 */
export class EntityOnMapComponent {
    /**
     * @param {?} _drawer
     * @param {?} mapLayers
     */
    constructor(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.selfPrimitiveIsDraw = false;
        /** @type {?} */
        const dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    }
    /**
     * @return {?}
     */
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    }
    /**
     * @return {?}
     */
    removeFromMap() {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    }
    /**
     * @return {?}
     */
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    }
}
EntityOnMapComponent.propDecorators = {
    props: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQzs7OztBQU9uRixNQUFNLE9BQU8sb0JBQW9COzs7OztJQVEvQixZQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDOztjQUMzQixXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDdkMsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQiwyREFBMkQ7U0FDNUQ7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBc0I7O2NBQzFCLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksS0FBSyxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQzlDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNELENBQUM7Ozs7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7b0JBOUNBLEtBQUs7Ozs7SUFBTixxQ0FDVzs7Ozs7SUFFWCw2Q0FBNkI7Ozs7O0lBQzdCLG1EQUF1Qzs7Ozs7SUFDdkMsMkNBQTJCOzs7OztJQUVmLHVDQUFxQzs7Ozs7SUFBRSx5Q0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgRXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRyYXdpbmcgb24gbWFwIGNvbXBvbmVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnRpdHlPbk1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBwcm9wczogYW55O1xuXG4gIHByb3RlY3RlZCBzZWxmUHJpbWl0aXZlOiBhbnk7XG4gIHByb3RlY3RlZCBzZWxmUHJpbWl0aXZlSXNEcmF3OiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZGF0YVNvdXJjZXM6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2RyYXdlcjogQmFzaWNEcmF3ZXJTZXJ2aWNlLCBwcml2YXRlIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gZmFsc2U7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSB0aGlzLl9kcmF3ZXIuaW5pdCgpO1xuICAgIGlmIChkYXRhU291cmNlcykge1xuICAgICAgdGhpcy5kYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzO1xuICAgICAgLy8gdGhpcy5tYXBMYXllcnMucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzLCAwKTtcbiAgICB9XG4gICAgdGhpcy5kcmF3T25NYXAoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwcm9wcyA9IGNoYW5nZXNbJ3Byb3BzJ107XG4gICAgaWYgKHByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gcHJvcHMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdPbk1hcCgpIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLnNlbGZQcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgcmVtb3ZlRnJvbU1hcCgpIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2VyLnJlbW92ZSh0aGlzLnNlbGZQcmltaXRpdmUpO1xuICB9XG5cbiAgdXBkYXRlT25NYXAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RyYXdlci51cGRhdGUodGhpcy5zZWxmUHJpbWl0aXZlLCB0aGlzLnByb3BzKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcExheWVycy5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmRhdGFTb3VyY2VzKTtcbiAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcbiAgfVxufVxuIl19