import { Component, Input } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
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
export class AcArcComponent extends EntityOnMapComponent {
    constructor(arcDrawer, mapLayers) {
        super(arcDrawer, mapLayers);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    }
    ngOnChanges(changes) {
        const geometryProps = changes['geometryProps'];
        const instanceProps = changes['instanceProps'];
        const primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcArcComponent, deps: [{ token: i1.ArcDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcArcComponent, selector: "ac-arc", inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcArcComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.ArcDrawerService }, { type: i2.MapLayersService }], propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMvYWMtYXJjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7Ozs7QUFJNUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQU1ILE1BQU0sT0FBTyxjQUFlLFNBQVEsb0JBQW9CO0lBU3RELFlBQVksU0FBMkIsRUFBRSxTQUEyQjtRQUNsRSxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUcsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxhQUFhLENBQUMsYUFBYTtZQUM1RCxhQUFhLENBQUMsWUFBWSxLQUFLLGFBQWEsQ0FBQyxhQUFhO1lBQzFELGNBQWMsQ0FBQyxZQUFZLEtBQUssY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQzs4R0FsQ1UsY0FBYztrR0FBZCxjQUFjLHdNQUZmLEVBQUU7OzJGQUVELGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLFFBQVEsRUFBRSxFQUFFO2lCQUNiO29IQUlDLGFBQWE7c0JBRFosS0FBSztnQkFHTixhQUFhO3NCQURaLEtBQUs7Z0JBR04sY0FBYztzQkFEYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBhbiBhcmMuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIEFuIGFyYyBpcyBub3QgbmF0aXZlbHkgaW1wbGVtZW50ZWQgaW4gY2VzaXVtLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWFyYy1kZXNjIGdlb21ldHJ5UHJvcHM9XCJ7XG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXG4gKiAgICAgICAgICBhbmdsZTogYXJjLmFuZ2xlLFxuICogICAgICAgICAgZGVsdGE6IGFyYy5kZWx0YSxcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1c1xuICogICAgICAgfVwiXG4gKiAgICAgICBpbnN0YW5jZVByb3BzPVwie1xuICogICAgICAgICAgYXR0cmlidXRlczogYXJjLmF0dHJpYnV0ZXNcbiAqICAgICAgIH1cIlxuICogICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBhcmMuYXBwZWFyYW5jZVxuICogICAgICAgfVwiPlxuICogICAgPC9hYy1hcmMtZGVzYz5cbiAqICAgIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFyYycsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcmNDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KClcbiAgZ2VvbWV0cnlQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBpbnN0YW5jZVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIHByaW1pdGl2ZVByb3BzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoYXJjRHJhd2VyOiBBcmNEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihhcmNEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cblxuICB1cGRhdGVPbk1hcCgpIHtcbiAgICBpZiAodGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3KSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcbiAgICAgIHRoaXMuZHJhd09uTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09uTWFwKCkge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuc2VsZlByaW1pdGl2ZSA9IHRoaXMuX2RyYXdlci5hZGQodGhpcy5nZW9tZXRyeVByb3BzLCB0aGlzLmluc3RhbmNlUHJvcHMsIHRoaXMucHJpbWl0aXZlUHJvcHMpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGdlb21ldHJ5UHJvcHMgPSBjaGFuZ2VzWydnZW9tZXRyeVByb3BzJ107XG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IGNoYW5nZXNbJ2luc3RhbmNlUHJvcHMnXTtcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IGNoYW5nZXNbJ3ByaW1pdGl2ZVByb3BzJ107XG4gICAgaWYgKGdlb21ldHJ5UHJvcHMuY3VycmVudFZhbHVlICE9PSBnZW9tZXRyeVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIGluc3RhbmNlUHJvcHMuY3VycmVudFZhbHVlICE9PSBpbnN0YW5jZVByb3BzLnByZXZpb3VzVmFsdWUgfHxcbiAgICAgIHByaW1pdGl2ZVByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gcHJpbWl0aXZlUHJvcHMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xuICAgIH1cbiAgfVxufVxuIl19