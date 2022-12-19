import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
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
export class AcBillboardPrimitiveDescComponent extends BasicDesc {
    constructor(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardPrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcBillboardPrimitiveDescComponent, deps: [{ token: i1.BillboardPrimitiveDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardPrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcBillboardPrimitiveDescComponent, selector: "ac-billboard-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcBillboardPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: i1.BillboardPrimitiveDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQU16RTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFPSCxNQUFNLE9BQU8saUNBQWtDLFNBQVEsU0FBUztJQUU5RCxZQUFZLHdCQUF5RCxFQUFFLFlBQTBCLEVBQ3JGLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsd0JBQXdCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDcEYsQ0FBQzs7K0hBTFUsaUNBQWlDO21IQUFqQyxpQ0FBaUMsc0RBRmpDLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUNBQWlDLENBQUMsRUFBQyxDQUFDLGlEQUR6RixFQUFFOzRGQUdELGlDQUFpQztrQkFMN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsRUFBQyxDQUFDO2lCQUNwRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBiaWxsYm9hcmQgcHJpbWl0aXZlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZTpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0JpbGxib2FyZC5odG1sXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xuICogICAgICBpbWFnZTogdHJhY2suaW1hZ2UsXG4gKiAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgc2NhbGU6IHRyYWNrLnNjYWxlLFxuICogICAgICBjb2xvcjogdHJhY2suY29sb3IsXG4gKiAgICAgIG5hbWU6IHRyYWNrLm5hbWVcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNCaWxsYm9hcmRQcmltaXRpdmVEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0JpbGxib2FyZFByaW1pdGl2ZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGJpbGxib2FyZFByaW1pdGl2ZURyYXdlcjogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihiaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==