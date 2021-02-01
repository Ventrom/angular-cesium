import { __decorate, __extends, __metadata } from "tslib";
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
var AcPrimitivePolylineComponent = /** @class */ (function (_super) {
    __extends(AcPrimitivePolylineComponent, _super);
    function AcPrimitivePolylineComponent(polylineDrawer, mapLayers) {
        return _super.call(this, polylineDrawer, mapLayers) || this;
    }
    AcPrimitivePolylineComponent.ctorParameters = function () { return [
        { type: PolylinePrimitiveDrawerService },
        { type: MapLayersService }
    ]; };
    AcPrimitivePolylineComponent = __decorate([
        Component({
            selector: 'ac-primitive-polyline',
            template: ''
        }),
        __metadata("design:paramtypes", [PolylinePrimitiveDrawerService, MapLayersService])
    ], AcPrimitivePolylineComponent);
    return AcPrimitivePolylineComponent;
}(EntityOnMapComponent));
export { AcPrimitivePolylineComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcHJpbWl0aXZlLXBvbHlsaW5lL2FjLXByaW1pdGl2ZS1wb2x5bGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDaEYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFcEk7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFNSDtJQUFrRCxnREFBb0I7SUFFcEUsc0NBQVksY0FBOEMsRUFBRSxTQUEyQjtlQUNyRixrQkFBTSxjQUFjLEVBQUUsU0FBUyxDQUFDO0lBQ2xDLENBQUM7O2dCQUYyQiw4QkFBOEI7Z0JBQWEsZ0JBQWdCOztJQUY1RSw0QkFBNEI7UUFKeEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUM7eUNBRzRCLDhCQUE4QixFQUFhLGdCQUFnQjtPQUY1RSw0QkFBNEIsQ0FLeEM7SUFBRCxtQ0FBQztDQUFBLEFBTEQsQ0FBa0Qsb0JBQW9CLEdBS3JFO1NBTFksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgcG9seWxpbmUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBQb2x5bGluZSBQcmltaXRpdmU6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9Qb2x5bGluZS5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtcG9seWxpbmUgW3Byb3BzXT1cIntcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgIHRleHQ6ICdsYWJlbFRleHQnLFxuICogICAgZm9udDogJzMwcHggc2Fucy1zZXJpZidcbiAqICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuR1JFRU5cbiAqICB9XCI+O1xuICogIDwvYWMtcG9seWxpbmU+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtcHJpbWl0aXZlLXBvbHlsaW5lJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1ByaW1pdGl2ZVBvbHlsaW5lQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHBvbHlsaW5lRHJhd2VyOiBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKHBvbHlsaW5lRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=