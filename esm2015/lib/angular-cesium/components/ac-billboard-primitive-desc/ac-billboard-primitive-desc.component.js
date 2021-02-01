var AcBillboardPrimitiveDescComponent_1;
import { __decorate, __metadata } from "tslib";
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';
/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
let AcBillboardPrimitiveDescComponent = AcBillboardPrimitiveDescComponent_1 = class AcBillboardPrimitiveDescComponent extends BasicDesc {
    constructor(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
};
AcBillboardPrimitiveDescComponent.ctorParameters = () => [
    { type: BillboardPrimitiveDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcBillboardPrimitiveDescComponent = AcBillboardPrimitiveDescComponent_1 = __decorate([
    Component({
        selector: 'ac-billboard-primitive-desc',
        template: '',
        providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent_1) }]
    }),
    __metadata("design:paramtypes", [BillboardPrimitiveDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcBillboardPrimitiveDescComponent);
export { AcBillboardPrimitiveDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjL2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHNGQUFzRixDQUFDO0FBRXZJOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU9ILElBQWEsaUNBQWlDLHlDQUE5QyxNQUFhLGlDQUFrQyxTQUFRLFNBQVM7SUFFOUQsWUFBWSx3QkFBeUQsRUFBRSxZQUEwQixFQUNyRixnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLHdCQUF3QixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Q0FDRixDQUFBOztZQUp1QywrQkFBK0I7WUFBZ0IsWUFBWTtZQUNuRSxnQkFBZ0I7WUFBb0IsZ0JBQWdCOztBQUh2RSxpQ0FBaUM7SUFMN0MsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLDZCQUE2QjtRQUN2QyxRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG1DQUFpQyxDQUFDLEVBQUMsQ0FBQztLQUNwRyxDQUFDO3FDQUdzQywrQkFBK0IsRUFBZ0IsWUFBWTtRQUNuRSxnQkFBZ0IsRUFBb0IsZ0JBQWdCO0dBSHZFLGlDQUFpQyxDQU03QztTQU5ZLGlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBiaWxsYm9hcmQgcHJpbWl0aXZlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0JpbGxib2FyZC5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xuICogICAgICBpbWFnZTogdHJhY2suaW1hZ2UsXG4gKiAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgc2NhbGU6IHRyYWNrLnNjYWxlLFxuICogICAgICBjb2xvcjogdHJhY2suY29sb3IsXG4gKiAgICAgIG5hbWU6IHRyYWNrLm5hbWVcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNCaWxsYm9hcmRQcmltaXRpdmVEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0JpbGxib2FyZFByaW1pdGl2ZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGJpbGxib2FyZFByaW1pdGl2ZURyYXdlcjogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==