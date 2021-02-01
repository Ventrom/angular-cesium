var AcBillboardDescComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-desc>
 *  ```
 */
let AcBillboardDescComponent = AcBillboardDescComponent_1 = class AcBillboardDescComponent extends BasicDesc {
    constructor(billboardDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardDrawer, layerService, computationCache, cesiumProperties);
    }
};
AcBillboardDescComponent.ctorParameters = () => [
    { type: BillboardDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcBillboardDescComponent = AcBillboardDescComponent_1 = __decorate([
    Component({
        selector: 'ac-billboard-desc',
        template: '',
        providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardDescComponent_1) }]
    }),
    __metadata("design:paramtypes", [BillboardDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcBillboardDescComponent);
export { AcBillboardDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvcmFkLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1iaWxsYm9yYWQtZGVzYy9hYy1iaWxsYm9yYWQtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBRTlGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFPSCxJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBeUIsU0FBUSxTQUFTO0lBRXJELFlBQVksZUFBdUMsRUFBRSxZQUEwQixFQUNuRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQTs7WUFKOEIsc0JBQXNCO1lBQWdCLFlBQVk7WUFDakQsZ0JBQWdCO1lBQW9CLGdCQUFnQjs7QUFIdkUsd0JBQXdCO0lBTHBDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxtQkFBbUI7UUFDN0IsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQywwQkFBd0IsQ0FBQyxFQUFDLENBQUM7S0FDM0YsQ0FBQztxQ0FHNkIsc0JBQXNCLEVBQWdCLFlBQVk7UUFDakQsZ0JBQWdCLEVBQW9CLGdCQUFnQjtHQUh2RSx3QkFBd0IsQ0FNcEM7U0FOWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJpbGxib2FyZERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1kcmF3ZXIvYmlsbGJvYXJkLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGJpbGxib2FyZCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBCaWxsYm9hcmRHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9CaWxsYm9hcmRHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYmlsbGJvYXJkLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcbiAqICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICBzY2FsZTogdHJhY2suc2NhbGUsXG4gKiAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcbiAqICAgICAgbmFtZTogdHJhY2submFtZVxuICogICAgfVwiPlxuICogICAgPC9hYy1iaWxsYm9hcmQtZGVzYz5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1iaWxsYm9hcmQtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNCaWxsYm9hcmREZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0JpbGxib2FyZERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGJpbGxib2FyZERyYXdlcjogQmlsbGJvYXJkRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihiaWxsYm9hcmREcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==