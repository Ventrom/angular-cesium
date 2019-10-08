/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
var AcTileset3dComponent = /** @class */ (function () {
    function AcTileset3dComponent(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        this.tilesetInstance = null;
    }
    /**
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!Checker.present(this.options.url)) {
            throw new Error('Options must have a url');
        }
        this._3dtilesCollection = new Cesium.PrimitiveCollection();
        this.cesiumService.getScene().primitives.add(this._3dtilesCollection);
        if (this.show) {
            this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
            if (this.style) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            /** @type {?} */
            var showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.tilesetInstance) {
                    this._3dtilesCollection.add(this.tilesetInstance, this.index);
                }
                else {
                    this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
                    if (this.style) {
                        this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
                    }
                }
            }
            else if (this.tilesetInstance) {
                this._3dtilesCollection.remove(this.tilesetInstance, false);
            }
        }
        if (changes['style'] && !changes['style'].isFirstChange()) {
            /** @type {?} */
            var styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    };
    /**
     * @return {?}
     */
    AcTileset3dComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    };
    AcTileset3dComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-3d-tile-layer',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcTileset3dComponent.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    AcTileset3dComponent.propDecorators = {
        options: [{ type: Input }],
        index: [{ type: Input }],
        show: [{ type: Input }],
        style: [{ type: Input }]
    };
    return AcTileset3dComponent;
}());
export { AcTileset3dComponent };
if (false) {
    /**
     * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
     * @type {?}
     */
    AcTileset3dComponent.prototype.options;
    /**
     * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
     * @type {?}
     */
    AcTileset3dComponent.prototype.index;
    /**
     * show (optional) - Determines if the map layer is shown.
     * @type {?}
     */
    AcTileset3dComponent.prototype.show;
    /**
     * show (optional) - Sets 3Dtiles style.
     * @type {?}
     */
    AcTileset3dComponent.prototype.style;
    /** @type {?} */
    AcTileset3dComponent.prototype.tilesetInstance;
    /**
     * @type {?}
     * @private
     */
    AcTileset3dComponent.prototype._3dtilesCollection;
    /**
     * @type {?}
     * @private
     */
    AcTileset3dComponent.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdGlsZXNldC0zZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLTNkLXRpbGVzZXQvYWMtdGlsZXNldC0zZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUErQyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDckUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7O0FBYzlDO0lBZ0NFLDhCQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTs7OztRQXZCaEQsWUFBTyxHQUFxQixFQUFFLENBQUM7Ozs7UUFZL0IsU0FBSSxHQUFHLElBQUksQ0FBQztRQVFMLG9CQUFlLEdBQVEsSUFBSSxDQUFDO0lBSW5DLENBQUM7Ozs7SUFFRCx1Q0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUV0RSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2RTtTQUNGO0lBQ0gsQ0FBQzs7Ozs7SUFFRCwwQ0FBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7O2dCQUNqRCxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVk7WUFFOUMsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMvRDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3ZFO2lCQUNGO2FBQ0Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDN0Q7U0FDRjtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFOztnQkFDbkQsVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZO1lBQ2hELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7SUFDSCxDQUFDOzs7O0lBRUQsMENBQVc7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3RDtJQUNILENBQUM7O2dCQWhGRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBbEJRLGFBQWE7OzswQkF1Qm5CLEtBQUs7d0JBTUwsS0FBSzt1QkFNTCxLQUFLO3dCQU1MLEtBQUs7O0lBdURSLDJCQUFDO0NBQUEsQUFqRkQsSUFpRkM7U0E3RVksb0JBQW9COzs7Ozs7SUFJL0IsdUNBQytCOzs7OztJQUsvQixxQ0FDYzs7Ozs7SUFLZCxvQ0FDWTs7Ozs7SUFLWixxQ0FDVzs7SUFFWCwrQ0FBbUM7Ozs7O0lBQ25DLGtEQUFnQzs7Ozs7SUFFcEIsNkNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hlY2tlcic7XG5cbi8qKlxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIDNkIHRpbGVzZXQgbGF5ZXIgdG8gdGhlIG1hcCAoYWMtbWFwKS5cbiAqICBvcHRpb25zIGFjY29yZGluZyB0byBgQ2VzaXVtM0RUaWxlc2V0YCBkZWZpbml0aW9uLlxuICogIGNoZWNrIG91dDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2VzaXVtM0RUaWxlc2V0Lmh0bWxcbiAqXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtM2QtdGlsZS1sYXllciBbb3B0aW9uc109XCJvcHRpb25zT2JqZWN0XCI+XG4gKiAgICA8L2FjLTNkLXRpbGUtbGF5ZXI+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLTNkLXRpbGUtbGF5ZXInLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjVGlsZXNldDNkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DZXNpdW0zRFRpbGVzZXQuaHRtbFxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiBpbmRleCAob3B0aW9uYWwpIC0gVGhlIGluZGV4IHRvIGFkZCB0aGUgbGF5ZXIgYXQuIElmIG9taXR0ZWQsIHRoZSBsYXllciB3aWxsIGFkZGVkIG9uIHRvcCBvZiBhbGwgZXhpc3RpbmcgbGF5ZXJzLlxuICAgKi9cbiAgQElucHV0KClcbiAgaW5kZXg6IE51bWJlcjtcblxuICAvKipcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gRGV0ZXJtaW5lcyBpZiB0aGUgbWFwIGxheWVyIGlzIHNob3duLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIFNldHMgM0R0aWxlcyBzdHlsZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHN0eWxlOiBhbnk7XG5cbiAgcHVibGljIHRpbGVzZXRJbnN0YW5jZTogYW55ID0gbnVsbDtcbiAgcHJpdmF0ZSBfM2R0aWxlc0NvbGxlY3Rpb246IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghQ2hlY2tlci5wcmVzZW50KHRoaXMub3B0aW9ucy51cmwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09wdGlvbnMgbXVzdCBoYXZlIGEgdXJsJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24gPSBuZXcgQ2VzaXVtLlByaW1pdGl2ZUNvbGxlY3Rpb24oKTtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5wcmltaXRpdmVzLmFkZCh0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbik7XG5cbiAgICBpZiAodGhpcy5zaG93KSB7XG4gICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZSA9IHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLmFkZChuZXcgQ2VzaXVtLkNlc2l1bTNEVGlsZXNldCh0aGlzLm9wdGlvbnMpLCB0aGlzLmluZGV4KTtcbiAgICAgIGlmICh0aGlzLnN0eWxlKSB7XG4gICAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlLnN0eWxlID0gbmV3IENlc2l1bS5DZXNpdW0zRFRpbGVTdHlsZSh0aGlzLnN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgaWYgKHNob3dWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50aWxlc2V0SW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5hZGQodGhpcy50aWxlc2V0SW5zdGFuY2UsIHRoaXMuaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlID0gdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24uYWRkKG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlc2V0KHRoaXMub3B0aW9ucyksIHRoaXMuaW5kZXgpO1xuICAgICAgICAgIGlmICh0aGlzLnN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnRpbGVzZXRJbnN0YW5jZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snc3R5bGUnXSAmJiAhY2hhbmdlc1snc3R5bGUnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHN0eWxlVmFsdWUgPSBjaGFuZ2VzWydzdHlsZSddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICh0aGlzLnRpbGVzZXRJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy50aWxlc2V0SW5zdGFuY2UsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==