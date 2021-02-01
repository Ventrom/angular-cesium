import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
var AcLabelComponent = /** @class */ (function (_super) {
    __extends(AcLabelComponent, _super);
    function AcLabelComponent(labelDrawer, mapLayers) {
        return _super.call(this, labelDrawer, mapLayers) || this;
    }
    AcLabelComponent.ctorParameters = function () { return [
        { type: LabelDrawerService },
        { type: MapLayersService }
    ]; };
    AcLabelComponent = __decorate([
        Component({
            selector: 'ac-label',
            template: ''
        }),
        __metadata("design:paramtypes", [LabelDrawerService, MapLayersService])
    ], AcLabelComponent);
    return AcLabelComponent;
}(EntityOnMapComponent));
export { AcLabelComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGFiZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYWJlbC9hYy1sYWJlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBTUg7SUFBc0Msb0NBQW9CO0lBRXhELDBCQUFZLFdBQStCLEVBQUUsU0FBMkI7ZUFDdEUsa0JBQU0sV0FBVyxFQUFFLFNBQVMsQ0FBQztJQUMvQixDQUFDOztnQkFGd0Isa0JBQWtCO2dCQUFhLGdCQUFnQjs7SUFGN0QsZ0JBQWdCO1FBSjVCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQzt5Q0FHeUIsa0JBQWtCLEVBQWEsZ0JBQWdCO09BRjdELGdCQUFnQixDQUs1QjtJQUFELHVCQUFDO0NBQUEsQUFMRCxDQUFzQyxvQkFBb0IsR0FLekQ7U0FMWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgbGFiZWwgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIExhYmVsR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vTGFiZWxHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtbGFiZWwgW3Byb3BzXT1cIntcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgIHRleHQ6ICdsYWJlbFRleHQnLFxuICogICAgZm9udDogJzMwcHggc2Fucy1zZXJpZicsXG4gKiAgICBmaWxsQ29sb3IgOiBhcXVhbWFyaW5lXG4gKiAgfVwiPlxuICogIDwvYWMtbGFiZWw+O1xuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWxhYmVsJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0xhYmVsQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKGxhYmVsRHJhd2VyOiBMYWJlbERyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICAgIHN1cGVyKGxhYmVsRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=