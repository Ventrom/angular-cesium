import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-ellipse [props]="{
 *    position: position,
 *    semiMajorAxis:40000.0,
 *    semiMinorAxis:25000.0,
 *    rotation : 0.785398
 *  }">
 *  </ac-ellipse>
 *  ```
 */
export class AcEllipseComponent extends EntityOnMapComponent {
    constructor(ellipseDrawer, mapLayers) {
        super(ellipseDrawer, mapLayers);
    }
}
AcEllipseComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcEllipseComponent, deps: [{ token: i1.EllipseDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcEllipseComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcEllipseComponent, selector: "ac-ellipse", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcEllipseComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-ellipse',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipseDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtZWxsaXBzZS9hYy1lbGxpcHNlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBSTVGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU1ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxvQkFBb0I7SUFFMUQsWUFBWSxhQUFtQyxFQUFFLFNBQTJCO1FBQzFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0hBSlUsa0JBQWtCO29HQUFsQixrQkFBa0IseUVBRm5CLEVBQUU7NEZBRUQsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsRUFBRTtpQkFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gZWxsaXBzZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgRWxsaXBzZUdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc2VHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtZWxsaXBzZSBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgc2VtaU1ham9yQXhpczo0MDAwMC4wLFxuICogICAgc2VtaU1pbm9yQXhpczoyNTAwMC4wLFxuICogICAgcm90YXRpb24gOiAwLjc4NTM5OFxuICogIH1cIj5cbiAqICA8L2FjLWVsbGlwc2U+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZWxsaXBzZScsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNFbGxpcHNlQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=