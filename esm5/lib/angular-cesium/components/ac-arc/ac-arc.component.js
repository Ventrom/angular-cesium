/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */
var AcArcComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcArcComponent, _super);
    function AcArcComponent(arcDrawer, mapLayers) {
        return _super.call(this, arcDrawer, mapLayers) || this;
    }
    /**
     * @return {?}
     */
    AcArcComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    };
    /**
     * @return {?}
     */
    AcArcComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AcArcComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var geometryProps = changes['geometryProps'];
        /** @type {?} */
        var instanceProps = changes['instanceProps'];
        /** @type {?} */
        var primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    };
    AcArcComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-arc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcArcComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: MapLayersService }
    ]; };
    AcArcComponent.propDecorators = {
        geometryProps: [{ type: Input }],
        instanceProps: [{ type: Input }],
        primitiveProps: [{ type: Input }]
    };
    return AcArcComponent;
}(EntityOnMapComponent));
export { AcArcComponent };
if (false) {
    /** @type {?} */
    AcArcComponent.prototype.geometryProps;
    /** @type {?} */
    AcArcComponent.prototype.instanceProps;
    /** @type {?} */
    AcArcComponent.prototype.primitiveProps;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJjL2FjLWFyYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJoRjtJQUlvQywwQ0FBb0I7SUFTdEQsd0JBQVksU0FBMkIsRUFBRSxTQUEyQjtlQUNsRSxrQkFBTSxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFRCxvQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQzs7OztJQUVELGtDQUFTOzs7SUFBVDtRQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUcsQ0FBQzs7Ozs7SUFFRCxvQ0FBVzs7OztJQUFYLFVBQVksT0FBc0I7O1lBQzFCLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDOztZQUN4QyxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQzs7WUFDeEMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNoRCxJQUFJLGFBQWEsQ0FBQyxZQUFZLEtBQUssYUFBYSxDQUFDLGFBQWE7WUFDNUQsYUFBYSxDQUFDLFlBQVksS0FBSyxhQUFhLENBQUMsYUFBYTtZQUMxRCxjQUFjLENBQUMsWUFBWSxLQUFLLGNBQWMsQ0FBQyxhQUFhLEVBQUU7WUFDOUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7Z0JBdENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsUUFBUTtvQkFDbEIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBN0JRLGdCQUFnQjtnQkFDaEIsZ0JBQWdCOzs7Z0NBK0J0QixLQUFLO2dDQUVMLEtBQUs7aUNBRUwsS0FBSzs7SUE2QlIscUJBQUM7Q0FBQSxBQXZDRCxDQUlvQyxvQkFBb0IsR0FtQ3ZEO1NBbkNZLGNBQWM7OztJQUV6Qix1Q0FDbUI7O0lBQ25CLHVDQUNtQjs7SUFDbkIsd0NBQ29CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBhbiBhcmMuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIEFuIGFyYyBpcyBub3QgbmF0aXZlbHkgaW1wbGVtZW50ZWQgaW4gY2VzaXVtLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWFyYy1kZXNjIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gKiAgICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICogICAgICAgICAgZGVsdGE6IGFyYy5kZWx0YSxcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1c1xuICogICAgICAgfVwiXG4gKiAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogYXJjLmF0dHJpYnV0ZXNcbiAqICAgICAgIH1cIlxuICogICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBhcmMuYXBwZWFyYW5jZVxuICogICAgICAgfVwiPlxuICogICAgPC9hYy1hcmMtZGVzYz5cbiAqICAgIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFyYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcmNDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KClcbiAgZ2VvbWV0cnlQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBpbnN0YW5jZVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIHByaW1pdGl2ZVByb3BzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoYXJjRHJhd2VyOiBBcmNEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihhcmNEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cblxuICB1cGRhdGVPbk1hcCgpIHtcbiAgICBpZiAodGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3KSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcbiAgICAgIHRoaXMuZHJhd09uTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09uTWFwKCkge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuc2VsZlByaW1pdGl2ZSA9IHRoaXMuX2RyYXdlci5hZGQodGhpcy5nZW9tZXRyeVByb3BzLCB0aGlzLmluc3RhbmNlUHJvcHMsIHRoaXMucHJpbWl0aXZlUHJvcHMpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGdlb21ldHJ5UHJvcHMgPSBjaGFuZ2VzWydnZW9tZXRyeVByb3BzJ107XG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IGNoYW5nZXNbJ2luc3RhbmNlUHJvcHMnXTtcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IGNoYW5nZXNbJ3ByaW1pdGl2ZVByb3BzJ107XG4gICAgaWYgKGdlb21ldHJ5UHJvcHMuY3VycmVudFZhbHVlICE9PSBnZW9tZXRyeVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIGluc3RhbmNlUHJvcHMuY3VycmVudFZhbHVlICE9PSBpbnN0YW5jZVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIHByaW1pdGl2ZVByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gcHJpbWl0aXZlUHJvcHMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xuICAgIH1cbiAgfVxufVxuIl19