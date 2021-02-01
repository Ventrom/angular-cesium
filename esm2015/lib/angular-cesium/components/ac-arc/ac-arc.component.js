import { __decorate, __metadata } from "tslib";
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
let AcArcComponent = class AcArcComponent extends EntityOnMapComponent {
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
};
AcArcComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: MapLayersService }
];
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
export { AcArcComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJjL2FjLWFyYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUVoRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBTUgsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLG9CQUFvQjtJQVN0RCxZQUFZLFNBQTJCLEVBQUUsU0FBMkI7UUFDbEUsS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUcsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pELElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxhQUFhLENBQUMsYUFBYTtZQUM1RCxhQUFhLENBQUMsWUFBWSxLQUFLLGFBQWEsQ0FBQyxhQUFhO1lBQzFELGNBQWMsQ0FBQyxZQUFZLEtBQUssY0FBYyxDQUFDLGFBQWEsRUFBRTtZQUM5RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0NBQ0YsQ0FBQTs7WUExQndCLGdCQUFnQjtZQUFhLGdCQUFnQjs7QUFOcEU7SUFEQyxLQUFLLEVBQUU7O3FEQUNXO0FBRW5CO0lBREMsS0FBSyxFQUFFOztxREFDVztBQUVuQjtJQURDLEtBQUssRUFBRTs7c0RBQ1k7QUFQVCxjQUFjO0lBSjFCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQztxQ0FVdUIsZ0JBQWdCLEVBQWEsZ0JBQWdCO0dBVHpELGNBQWMsQ0FtQzFCO1NBbkNZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGFuIGFyYy5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgQW4gYXJjIGlzIG5vdCBuYXRpdmVseSBpbXBsZW1lbnRlZCBpbiBjZXNpdW0uXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYXJjLWRlc2MgZ2VvbWV0cnlQcm9wcz1cIntcbiAqICAgICAgICAgIGNlbnRlcjogYXJjLmNlbnRlcixcbiAqICAgICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXG4gKiAgICAgICAgICBkZWx0YTogYXJjLmRlbHRhLFxuICogICAgICAgICAgcmFkaXVzOiBhcmMucmFkaXVzXG4gKiAgICAgICB9XCJcbiAqICAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XG4gKiAgICAgICAgICBhdHRyaWJ1dGVzOiBhcmMuYXR0cmlidXRlc1xuICogICAgICAgfVwiXG4gKiAgICAgICBwcmltaXRpdmVQcm9wcz1cIntcbiAqICAgICAgICAgIGFwcGVhcmFuY2U6IGFyYy5hcHBlYXJhbmNlXG4gKiAgICAgICB9XCI+XG4gKiAgICA8L2FjLWFyYy1kZXNjPlxuICogICAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYXJjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0FyY0NvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKVxuICBnZW9tZXRyeVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIGluc3RhbmNlUHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgcHJpbWl0aXZlUHJvcHM6IGFueTtcblxuICBjb25zdHJ1Y3RvcihhcmNEcmF3ZXI6IEFyY0RyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKGFyY0RyYXdlciwgbWFwTGF5ZXJzKTtcbiAgfVxuXG4gIHVwZGF0ZU9uTWFwKCkge1xuICAgIGlmICh0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbU1hcCgpO1xuICAgICAgdGhpcy5kcmF3T25NYXAoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3T25NYXAoKSB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5zZWxmUHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZCh0aGlzLmdlb21ldHJ5UHJvcHMsIHRoaXMuaW5zdGFuY2VQcm9wcywgdGhpcy5wcmltaXRpdmVQcm9wcyk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgZ2VvbWV0cnlQcm9wcyA9IGNoYW5nZXNbJ2dlb21ldHJ5UHJvcHMnXTtcbiAgICBjb25zdCBpbnN0YW5jZVByb3BzID0gY2hhbmdlc1snaW5zdGFuY2VQcm9wcyddO1xuICAgIGNvbnN0IHByaW1pdGl2ZVByb3BzID0gY2hhbmdlc1sncHJpbWl0aXZlUHJvcHMnXTtcbiAgICBpZiAoZ2VvbWV0cnlQcm9wcy5jdXJyZW50VmFsdWUgIT09IGdlb21ldHJ5UHJvcHMucHJldmlvdXNWYWx1ZSB8fFxuICAgICAgaW5zdGFuY2VQcm9wcy5jdXJyZW50VmFsdWUgIT09IGluc3RhbmNlUHJvcHMucHJldmlvdXNWYWx1ZSB8fFxuICAgICAgcHJpbWl0aXZlUHJvcHMuY3VycmVudFZhbHVlICE9PSBwcmltaXRpdmVQcm9wcy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZU9uTWFwKCk7XG4gICAgfVxuICB9XG59XG4iXX0=