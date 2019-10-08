/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
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
    /**
     * @param {?} ellipseDrawerService
     * @param {?} mapLayers
     */
    constructor(ellipseDrawerService, mapLayers) {
        super(ellipseDrawerService, mapLayers);
    }
    /**
     * @private
     * @return {?}
     */
    updateEllipseProps() {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    }
    /**
     * @return {?}
     */
    drawOnMap() {
        this.updateEllipseProps();
        super.drawOnMap();
    }
    /**
     * @return {?}
     */
    updateOnMap() {
        this.updateEllipseProps();
        super.updateOnMap();
    }
}
AcCircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-circle',
                template: ''
            }] }
];
/** @nocollapse */
AcCircleComponent.ctorParameters = () => [
    { type: EllipseDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtY2lyY2xlL2FjLWNpcmNsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDcEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QmhGLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxvQkFBb0I7Ozs7O0lBRXpELFlBQVksb0JBQTBDLEVBQUUsU0FBMkI7UUFDakYsS0FBSyxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7O0lBRU8sa0JBQWtCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUM1QixDQUFDOzs7O0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7WUF4QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxXQUFXO2dCQUNyQixRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBekJRLG9CQUFvQjtZQUNwQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgY2lyY2xlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBzZW1pTWFqb3JBeGlzIGFucyBzZW1pTWlub3JBeGlzIGFyZSByZXBsYWNlZCB3aXRoIHJhZGl1cyBwcm9wZXJ0eS5cbiAqICBBbGwgb3RoZXIgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRWxsaXBzZUdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1jaXJjbGUgW3Byb3BzXT1cIntcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgIHJhZGl1czo0MDAwMC4wLFxuICogICAgZ3JhbnVsYXJpdHk6MC4wMyxcbiAqICB9XCI+XG4gKiAgPC9hYy1jaXJjbGU+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtY2lyY2xlJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0NpcmNsZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVFbGxpcHNlUHJvcHMoKSB7XG4gICAgdGhpcy5wcm9wcy5zZW1pTWFqb3JBeGlzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgdGhpcy5wcm9wcy5zZW1pTWlub3JBeGlzID0gdGhpcy5wcm9wcy5yYWRpdXM7XG4gICAgdGhpcy5wcm9wcy5yb3RhdGlvbiA9IDAuMDtcbiAgfVxuXG4gIGRyYXdPbk1hcCgpIHtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VQcm9wcygpO1xuICAgIHN1cGVyLmRyYXdPbk1hcCgpO1xuICB9XG5cbiAgdXBkYXRlT25NYXAoKSB7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlUHJvcHMoKTtcbiAgICBzdXBlci51cGRhdGVPbk1hcCgpO1xuICB9XG59XG4iXX0=