import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */
export class AcCircleComponent extends EntityOnMapComponent {
    constructor(ellipseDrawerService, mapLayers) {
        super(ellipseDrawerService, mapLayers);
    }
    updateEllipseProps() {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    }
    drawOnMap() {
        this.updateEllipseProps();
        super.drawOnMap();
    }
    updateOnMap() {
        this.updateEllipseProps();
        super.updateOnMap();
    }
}
AcCircleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcCircleComponent, deps: [{ token: i1.EllipseDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcCircleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcCircleComponent, selector: "ac-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcCircleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-circle',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipseDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jaXJjbGUvYWMtY2lyY2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBSTVGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU1ILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxvQkFBb0I7SUFFekQsWUFBWSxvQkFBMEMsRUFBRSxTQUEyQjtRQUNqRixLQUFLLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDNUIsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7K0dBcEJVLGlCQUFpQjttR0FBakIsaUJBQWlCLHdFQUZsQixFQUFFOzRGQUVELGlCQUFpQjtrQkFKN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgY2lyY2xlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBzZW1pTWFqb3JBeGlzIGFucyBzZW1pTWlub3JBeGlzIGFyZSByZXBsYWNlZCB3aXRoIHJhZGl1cyBwcm9wZXJ0eS5cbiAqICBBbGwgb3RoZXIgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1jaXJjbGUgW3Byb3BzXT1cIntcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgIHJhZGl1czo0MDAwMC4wLFxuICogICAgZ3JhbnVsYXJpdHk6MC4wMyxcbiAqICB9XCI+XG4gKiAgPC9hYy1jaXJjbGU+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtY2lyY2xlJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0NpcmNsZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVFbGxpcHNlUHJvcHMoKSB7XG4gICAgdGhpcy5wcm9wcy5zZW1pTWFqb3JBeGlzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgdGhpcy5wcm9wcy5zZW1pTWlub3JBeGlzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgdGhpcy5wcm9wcy5yb3RhdGlvbiA9IDAuMDtcbiAgfVxuXG4gIGRyYXdPbk1hcCgpIHtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VQcm9wcygpO1xuICAgIHN1cGVyLmRyYXdPbk1hcCgpO1xuICB9XG5cbiAgdXBkYXRlT25NYXAoKSB7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlUHJvcHMoKTtcbiAgICBzdXBlci51cGRhdGVPbk1hcCgpO1xuICB9XG59XG4iXX0=