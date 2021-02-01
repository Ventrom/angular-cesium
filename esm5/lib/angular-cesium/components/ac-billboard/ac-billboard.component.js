import { __decorate, __extends, __metadata } from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }">;
 *    </ac-billboard>
 *  ```
 */
var AcBillboardComponent = /** @class */ (function (_super) {
    __extends(AcBillboardComponent, _super);
    function AcBillboardComponent(billboardDrawer, mapLayers) {
        return _super.call(this, billboardDrawer, mapLayers) || this;
    }
    AcBillboardComponent.ctorParameters = function () { return [
        { type: BillboardDrawerService },
        { type: MapLayersService }
    ]; };
    AcBillboardComponent = __decorate([
        Component({
            selector: 'ac-billboard',
            template: ''
        }),
        __metadata("design:paramtypes", [BillboardDrawerService, MapLayersService])
    ], AcBillboardComponent);
    return AcBillboardComponent;
}(EntityOnMapComponent));
export { AcBillboardComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkL2FjLWJpbGxib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQU1IO0lBQTBDLHdDQUFvQjtJQUU1RCw4QkFBWSxlQUF1QyxFQUFFLFNBQTJCO2VBQzlFLGtCQUFNLGVBQWUsRUFBRSxTQUFTLENBQUM7SUFDbkMsQ0FBQzs7Z0JBRjRCLHNCQUFzQjtnQkFBYSxnQkFBZ0I7O0lBRnJFLG9CQUFvQjtRQUpoQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUM7eUNBRzZCLHNCQUFzQixFQUFhLGdCQUFnQjtPQUZyRSxvQkFBb0IsQ0FLaEM7SUFBRCwyQkFBQztDQUFBLEFBTEQsQ0FBMEMsb0JBQW9CLEdBSzdEO1NBTFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQmlsbGJvYXJkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLWRyYXdlci9iaWxsYm9hcmQtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGJpbGxib2FyZCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgQmlsbGJvYXJkR3JhcGhpY3M6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQmlsbGJvYXJkR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWJpbGxib2FyZCBbcHJvcHNdPVwie1xuICogICAgICBpbWFnZTogaW1hZ2UsXG4gKiAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcbiAqICAgICAgc2NhbGU6IHNjYWxlLFxuICogICAgICBjb2xvcjogY29sb3IsXG4gKiAgICAgIG5hbWU6IG5hbWVcbiAqICAgIH1cIj47XG4gKiAgICA8L2FjLWJpbGxib2FyZD5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1iaWxsYm9hcmQnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjQmlsbGJvYXJkQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKGJpbGxib2FyZERyYXdlcjogQmlsbGJvYXJkRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIoYmlsbGJvYXJkRHJhd2VyLCBtYXBMYXllcnMpO1xuICB9XG59XG4iXX0=