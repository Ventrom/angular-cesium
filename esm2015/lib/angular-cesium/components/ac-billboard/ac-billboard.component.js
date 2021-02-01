import { __decorate, __metadata } from "tslib";
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
let AcBillboardComponent = class AcBillboardComponent extends EntityOnMapComponent {
    constructor(billboardDrawer, mapLayers) {
        super(billboardDrawer, mapLayers);
    }
};
AcBillboardComponent.ctorParameters = () => [
    { type: BillboardDrawerService },
    { type: MapLayersService }
];
AcBillboardComponent = __decorate([
    Component({
        selector: 'ac-billboard',
        template: ''
    }),
    __metadata("design:paramtypes", [BillboardDrawerService, MapLayersService])
], AcBillboardComponent);
export { AcBillboardComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkL2FjLWJpbGxib2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDNUYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDMUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQU1ILElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQXFCLFNBQVEsb0JBQW9CO0lBRTVELFlBQVksZUFBdUMsRUFBRSxTQUEyQjtRQUM5RSxLQUFLLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRixDQUFBOztZQUg4QixzQkFBc0I7WUFBYSxnQkFBZ0I7O0FBRnJFLG9CQUFvQjtJQUpoQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4QixRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUM7cUNBRzZCLHNCQUFzQixFQUFhLGdCQUFnQjtHQUZyRSxvQkFBb0IsQ0FLaEM7U0FMWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgYmlsbGJvYXJkIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBCaWxsYm9hcmRHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9CaWxsYm9hcmRHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYmlsbGJvYXJkIFtwcm9wc109XCJ7XG4gKiAgICAgIGltYWdlOiBpbWFnZSxcbiAqICAgICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgICBzY2FsZTogc2NhbGUsXG4gKiAgICAgIGNvbG9yOiBjb2xvcixcbiAqICAgICAgbmFtZTogbmFtZVxuICogICAgfVwiPjtcbiAqICAgIDwvYWMtYmlsbGJvYXJkPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWJpbGxib2FyZCcsXG4gIHRlbXBsYXRlOiAnJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNCaWxsYm9hcmRDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoYmlsbGJvYXJkRHJhd2VyOiBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgICBzdXBlcihiaWxsYm9hcmREcmF3ZXIsIG1hcExheWVycyk7XG4gIH1cbn1cbiJdfQ==