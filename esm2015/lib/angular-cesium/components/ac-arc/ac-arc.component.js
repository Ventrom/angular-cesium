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
}
AcArcComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-arc',
                template: ''
            },] }
];
AcArcComponent.ctorParameters = () => [
    { type: ArcDrawerService },
    { type: MapLayersService }
];
AcArcComponent.propDecorators = {
    geometryProps: [{ type: Input }],
    instanceProps: [{ type: Input }],
    primitiveProps: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1hcmMvYWMtYXJjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDeEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQU1ILE1BQU0sT0FBTyxjQUFlLFNBQVEsb0JBQW9CO0lBU3RELFlBQVksU0FBMkIsRUFBRSxTQUEyQjtRQUNsRSxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1RyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakQsSUFBSSxhQUFhLENBQUMsWUFBWSxLQUFLLGFBQWEsQ0FBQyxhQUFhO1lBQzVELGFBQWEsQ0FBQyxZQUFZLEtBQUssYUFBYSxDQUFDLGFBQWE7WUFDMUQsY0FBYyxDQUFDLFlBQVksS0FBSyxjQUFjLENBQUMsYUFBYSxFQUFFO1lBQzlELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7OztZQXRDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxFQUFFO2FBQ2I7OztZQTdCUSxnQkFBZ0I7WUFDaEIsZ0JBQWdCOzs7NEJBK0J0QixLQUFLOzRCQUVMLEtBQUs7NkJBRUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEFyY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgYW4gYXJjLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBBbiBhcmMgaXMgbm90IG5hdGl2ZWx5IGltcGxlbWVudGVkIGluIGNlc2l1bS5cbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1hcmMtZGVzYyBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgY2VudGVyOiBhcmMuY2VudGVyLFxuICogICAgICAgICAgYW5nbGU6IGFyYy5hbmdsZSxcbiAqICAgICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXG4gKiAgICAgICAgICByYWRpdXM6IGFyYy5yYWRpdXNcbiAqICAgICAgIH1cIlxuICogICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgIGF0dHJpYnV0ZXM6IGFyYy5hdHRyaWJ1dGVzXG4gKiAgICAgICB9XCJcbiAqICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgYXBwZWFyYW5jZTogYXJjLmFwcGVhcmFuY2VcbiAqICAgICAgIH1cIj5cbiAqICAgIDwvYWMtYXJjLWRlc2M+XG4gKiAgICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1hcmMnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjQXJjQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpXG4gIGdlb21ldHJ5UHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgaW5zdGFuY2VQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBwcmltaXRpdmVQcm9wczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGFyY0RyYXdlcjogQXJjRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIoYXJjRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlT25NYXAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdykge1xuICAgICAgdGhpcy5yZW1vdmVGcm9tTWFwKCk7XG4gICAgICB0aGlzLmRyYXdPbk1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdPbk1hcCgpIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLnNlbGZQcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKHRoaXMuZ2VvbWV0cnlQcm9wcywgdGhpcy5pbnN0YW5jZVByb3BzLCB0aGlzLnByaW1pdGl2ZVByb3BzKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBnZW9tZXRyeVByb3BzID0gY2hhbmdlc1snZ2VvbWV0cnlQcm9wcyddO1xuICAgIGNvbnN0IGluc3RhbmNlUHJvcHMgPSBjaGFuZ2VzWydpbnN0YW5jZVByb3BzJ107XG4gICAgY29uc3QgcHJpbWl0aXZlUHJvcHMgPSBjaGFuZ2VzWydwcmltaXRpdmVQcm9wcyddO1xuICAgIGlmIChnZW9tZXRyeVByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gZ2VvbWV0cnlQcm9wcy5wcmV2aW91c1ZhbHVlIHx8XG4gICAgICBpbnN0YW5jZVByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gaW5zdGFuY2VQcm9wcy5wcmV2aW91c1ZhbHVlIHx8XG4gICAgICBwcmltaXRpdmVQcm9wcy5jdXJyZW50VmFsdWUgIT09IHByaW1pdGl2ZVByb3BzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlT25NYXAoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==