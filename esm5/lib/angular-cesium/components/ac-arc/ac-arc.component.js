import { __decorate, __extends, __metadata } from "tslib";
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
    __extends(AcArcComponent, _super);
    function AcArcComponent(arcDrawer, mapLayers) {
        return _super.call(this, arcDrawer, mapLayers) || this;
    }
    AcArcComponent.prototype.updateOnMap = function () {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    };
    AcArcComponent.prototype.drawOnMap = function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    };
    AcArcComponent.prototype.ngOnChanges = function (changes) {
        var geometryProps = changes['geometryProps'];
        var instanceProps = changes['instanceProps'];
        var primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    };
    AcArcComponent.ctorParameters = function () { return [
        { type: ArcDrawerService },
        { type: MapLayersService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "geometryProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "instanceProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArcComponent.prototype, "primitiveProps", void 0);
    AcArcComponent = __decorate([
        Component({
            selector: 'ac-arc',
            template: ''
        }),
        __metadata("design:paramtypes", [ArcDrawerService, MapLayersService])
    ], AcArcComponent);
    return AcArcComponent;
}(EntityOnMapComponent));
export { AcArcComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJjL2FjLWFyYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUVoRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBTUg7SUFBb0Msa0NBQW9CO0lBU3RELHdCQUFZLFNBQTJCLEVBQUUsU0FBMkI7ZUFDbEUsa0JBQU0sU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsb0NBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRUQsa0NBQVMsR0FBVDtRQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUcsQ0FBQztJQUVELG9DQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxhQUFhLENBQUMsYUFBYTtZQUM1RCxhQUFhLENBQUMsWUFBWSxLQUFLLGFBQWEsQ0FBQyxhQUFhO1lBQzFELGNBQWMsQ0FBQyxZQUFZLEtBQUssY0FBYyxDQUFDLGFBQWEsRUFBRTtZQUM5RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDOztnQkF6QnNCLGdCQUFnQjtnQkFBYSxnQkFBZ0I7O0lBTnBFO1FBREMsS0FBSyxFQUFFOzt5REFDVztJQUVuQjtRQURDLEtBQUssRUFBRTs7eURBQ1c7SUFFbkI7UUFEQyxLQUFLLEVBQUU7OzBEQUNZO0lBUFQsY0FBYztRQUoxQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUM7eUNBVXVCLGdCQUFnQixFQUFhLGdCQUFnQjtPQVR6RCxjQUFjLENBbUMxQjtJQUFELHFCQUFDO0NBQUEsQUFuQ0QsQ0FBb0Msb0JBQW9CLEdBbUN2RDtTQW5DWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBhbiBhcmMuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIEFuIGFyYyBpcyBub3QgbmF0aXZlbHkgaW1wbGVtZW50ZWQgaW4gY2VzaXVtLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWFyYy1kZXNjIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gKiAgICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICogICAgICAgICAgZGVsdGE6IGFyYy5kZWx0YSxcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1c1xuICogICAgICAgfVwiXG4gKiAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogYXJjLmF0dHJpYnV0ZXNcbiAqICAgICAgIH1cIlxuICogICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBhcmMuYXBwZWFyYW5jZVxuICogICAgICAgfVwiPlxuICogICAgPC9hYy1hcmMtZGVzYz5cbiAqICAgIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFyYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcmNDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KClcbiAgZ2VvbWV0cnlQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBpbnN0YW5jZVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIHByaW1pdGl2ZVByb3BzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoYXJjRHJhd2VyOiBBcmNEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihhcmNEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cblxuICB1cGRhdGVPbk1hcCgpIHtcbiAgICBpZiAodGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3KSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcbiAgICAgIHRoaXMuZHJhd09uTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09uTWFwKCkge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuc2VsZlByaW1pdGl2ZSA9IHRoaXMuX2RyYXdlci5hZGQodGhpcy5nZW9tZXRyeVByb3BzLCB0aGlzLmluc3RhbmNlUHJvcHMsIHRoaXMucHJpbWl0aXZlUHJvcHMpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGdlb21ldHJ5UHJvcHMgPSBjaGFuZ2VzWydnZW9tZXRyeVByb3BzJ107XG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IGNoYW5nZXNbJ2luc3RhbmNlUHJvcHMnXTtcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IGNoYW5nZXNbJ3ByaW1pdGl2ZVByb3BzJ107XG4gICAgaWYgKGdlb21ldHJ5UHJvcHMuY3VycmVudFZhbHVlICE9PSBnZW9tZXRyeVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIGluc3RhbmNlUHJvcHMuY3VycmVudFZhbHVlICE9PSBpbnN0YW5jZVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIHByaW1pdGl2ZVByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gcHJpbWl0aXZlUHJvcHMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xuICAgIH1cbiAgfVxufVxuIl19