import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
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
export class AcPrimitivePolylineComponent extends EntityOnMapComponent {
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPrimitivePolylineComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-primitive-polyline',
                template: ''
            },] }
];
AcPrimitivePolylineComponent.ctorParameters = () => [
    { type: PolylinePrimitiveDrawerService },
    { type: MapLayersService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1wcmltaXRpdmUtcG9seWxpbmUvYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG9GQUFvRixDQUFDO0FBRXBJOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBTUgsTUFBTSxPQUFPLDRCQUE2QixTQUFRLG9CQUFvQjtJQUVwRSxZQUFZLGNBQThDLEVBQUUsU0FBMkI7UUFDckYsS0FBSyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7WUFSRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsUUFBUSxFQUFFLEVBQUU7YUFDYjs7O1lBdkJRLDhCQUE4QjtZQUQ5QixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2x5bGluZSBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbGFiZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIFBvbHlsaW5lIFByaW1pdGl2ZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvbHlsaW5lLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1wb2x5bGluZSBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgdGV4dDogJ2xhYmVsVGV4dCcsXG4gKiAgICBmb250OiAnMzBweCBzYW5zLXNlcmlmJ1xuICogICAgY29sb3I6IENlc2l1bS5Db2xvci5HUkVFTlxuICogIH1cIj47XG4gKiAgPC9hYy1wb2x5bGluZT5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1wcmltaXRpdmUtcG9seWxpbmUnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjUHJpbWl0aXZlUG9seWxpbmVDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXI6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIocG9seWxpbmVEcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==