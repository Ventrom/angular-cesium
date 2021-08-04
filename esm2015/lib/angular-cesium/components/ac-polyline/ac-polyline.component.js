import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
export class AcPolylineComponent extends EntityOnMapComponent {
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPolylineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-polyline',
                template: ''
            },] }
];
AcPolylineComponent.ctorParameters = () => [
    { type: PolylineDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvbHlsaW5lL2FjLXBvbHlsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGdFQUFnRSxDQUFDO0FBRXZHOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBTUgsTUFBTSxPQUFPLG1CQUFvQixTQUFRLG9CQUFvQjtJQUUzRCxZQUFZLGNBQXFDLEVBQUUsU0FBMkI7UUFDNUUsS0FBSyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7WUFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRSxFQUFFO2FBQ2I7OztZQXZCUSxxQkFBcUI7WUFEckIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtZHJhd2VyL3BvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvbHlsaW5lIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgUG9seWxpbmUgUHJpbWl0aXZlOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9seWxpbmUuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLXBvbHlsaW5lIFtwcm9wc109XCJ7XG4gKiAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gKiAgICB0ZXh0OiAnbGFiZWxUZXh0JyxcbiAqICAgIGZvbnQ6ICczMHB4IHNhbnMtc2VyaWYnXG4gKiAgICBjb2xvcjogQ2VzaXVtLkNvbG9yLkdSRUVOXG4gKiAgfVwiPjtcbiAqICA8L2FjLXBvbHlsaW5lPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvbHlsaW5lJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1BvbHlsaW5lQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHBvbHlsaW5lRHJhd2VyOiBQb2x5bGluZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKHBvbHlsaW5lRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=