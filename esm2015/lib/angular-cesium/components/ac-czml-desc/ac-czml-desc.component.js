import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
let AcCzmlDescComponent = class AcCzmlDescComponent extends BasicDesc {
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
};
AcCzmlDescComponent.ctorParameters = () => [
    { type: CzmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcCzmlDescComponent = __decorate([
    Component({
        selector: 'ac-czml-desc',
        template: ''
    }),
    __metadata("design:paramtypes", [CzmlDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcCzmlDescComponent);
export { AcCzmlDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY3ptbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtY3ptbC1kZXNjL2FjLWN6bWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFbEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBQzNGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUVsRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFLSCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFvQixTQUFRLFNBQVM7SUFDaEQsWUFBWSxVQUE2QixFQUFFLFlBQTBCLEVBQ3pELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Q0FHRixDQUFBOztZQU55QixpQkFBaUI7WUFBZ0IsWUFBWTtZQUN2QyxnQkFBZ0I7WUFBb0IsZ0JBQWdCOztBQUZ2RSxtQkFBbUI7SUFKL0IsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLEVBQUU7S0FDYixDQUFDO3FDQUV3QixpQkFBaUIsRUFBZ0IsWUFBWTtRQUN2QyxnQkFBZ0IsRUFBb0IsZ0JBQWdCO0dBRnZFLG1CQUFtQixDQU8vQjtTQVBZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIGN6bWwgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWN6bWwtZGVzYyBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICpcbiAqICBTZWUgQ1pNTCBHdWlkZSBmb3IgdGhlIHN0cnVjdHVyZSBvZiBwcm9wcy5jem1sUGFja2V0OlxuICogICsgaHR0cHM6Ly9naXRodWIuY29tL0FuYWx5dGljYWxHcmFwaGljc0luYy9jem1sLXdyaXRlci93aWtpL0NaTUwtU3RydWN0dXJlXG4gKlxuICogIEF0dGVudGlvbjogdGhlIGZpcnN0IGN6bWxQYWNrZXQgaW4gdGhlIHN0cmVhbSBuZWVkcyB0byBiZSBhIGRvY3VtZW50XG4gKiAgd2l0aCBhbiBpZCBhbmQgYSBuYW1lIGF0dHJpYnV0ZS4gU2VlIHRoaXMgZXhhbXBsZVxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0FwcHMvU2FuZGNhc3RsZS9pbmRleC5odG1sP3NyYz1DWk1MJTIwUG9pbnQlMjAtJTIwVGltZSUyMER5bmFtaWMuaHRtbCZsYWJlbD1DWk1MXG4gKlxuICogIFRvIHNlZSBhIHdvcmtpbmcgZXhhbXBsZSwgdXNlIHRoZSBkZW1vIGFwcCBhbmRcbiAqICArIHVuY29tbWVudCA8Y3ptbC1sYXllcj48L2N6bWwtbGF5ZXI+IGluIGRlbW8tbWFwLmNvbXBvbmVudC5odG1sXG4gKiAgKyBzZXQgdGhlIHByb3BlcnRpZXMgJ3RpbWVsaW5lJywgJ2FuaW1hdGlvbicgYW5kICdzaG91bGRBbmltYXRlJyB0cnVlIGluIHZpZXdlck9wdGlvbnMgb2YgZGVtby1tYXAuY29tcG9uZW50LnRzXG4gKlxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtY3ptbC1kZXNjIHByb3BzPVwie1xuICogICAgICBjem1sUGFja2V0OiBjem1sUGFja2V0XG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWN6bWwtZGVzYz5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtY3ptbC1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY0N6bWxEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IoY3ptbERyYXdlcjogQ3ptbERyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoY3ptbERyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG5cbn1cbiJdfQ==