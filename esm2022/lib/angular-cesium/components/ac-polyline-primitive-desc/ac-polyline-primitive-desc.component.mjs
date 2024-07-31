import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a polyline primitive implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-primitive-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-primitive-desc>
 * ```
 */
export class AcPolylinePrimitiveDescComponent extends BasicDesc {
    constructor(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcPolylinePrimitiveDescComponent, deps: [{ token: i1.PolylinePrimitiveDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcPolylinePrimitiveDescComponent, selector: "ac-polyline-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylinePrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcPolylinePrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polyline-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylinePrimitiveDescComponent) }],
                }]
        }], ctorParameters: () => [{ type: i1.PolylinePrimitiveDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvbHlsaW5lLXByaW1pdGl2ZS1kZXNjL2FjLXBvbHlsaW5lLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQU16RTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFNSCxNQUFNLE9BQU8sZ0NBQWlDLFNBQVEsU0FBUztJQUU3RCxZQUFZLDhCQUE4RCxFQUFFLFlBQTBCLEVBQzFGLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsOEJBQThCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDMUYsQ0FBQzs4R0FMVSxnQ0FBZ0M7a0dBQWhDLGdDQUFnQyxxREFGaEMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFDLENBQUMsaURBRHhGLEVBQUU7OzJGQUdELGdDQUFnQztrQkFMNUMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsRUFBQyxDQUFDO2lCQUNuRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2x5bGluZSBwcmltaXRpdmUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBQb2x5bGluZSBQcmltaXRpdmU6XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9Qb2x5bGluZS5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgIDxhYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgd2lkdGggOiBwb2x5bGluZS53aWR0aCxcbiAqICAgICAgcG9zaXRpb25zOiBwb2x5bGluZS5wb3NpdGlvbnMsXG4gKiAgICAgIG1hdGVyaWFsOiBwb2x5bGluZS5tYXRlcmlhbFxuICogICAgfVwiPlxuICogICAgPC9hYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYz5cbiAqIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1wb2x5bGluZS1wcmltaXRpdmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNQb2x5bGluZVByaW1pdGl2ZURlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjUG9seWxpbmVQcmltaXRpdmVEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcblxuICBjb25zdHJ1Y3Rvcihwb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihwb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==