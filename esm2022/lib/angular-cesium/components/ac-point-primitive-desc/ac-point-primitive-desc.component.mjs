import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/point-primitive-drawer/point-primitive-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Point.html
 *
 *  __Usage :__
 *  ```
 *    <ac-point-primitive-desc props="{
 *      position: track.position,
 *      color: Cesium.Color.RED
 *    }">
 *    </ac-point-primitive-desc>
 *  ```
 */
export class AcPointPrimitiveDescComponent extends BasicDesc {
    constructor(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcPointPrimitiveDescComponent, deps: [{ token: i1.PointPrimitiveDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcPointPrimitiveDescComponent, selector: "ac-point-primitive-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcPointPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-point-primitive-desc',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.PointPrimitiveDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9pbnQtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLXBvaW50LXByaW1pdGl2ZS1kZXNjL2FjLXBvaW50LXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7Ozs7O0FBTXpFOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBTUgsTUFBTSxPQUFPLDZCQUE4QixTQUFRLFNBQVM7SUFFMUQsWUFBWSwyQkFBd0QsRUFBRSxZQUEwQixFQUNwRixnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLDJCQUEyQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7OEdBTFUsNkJBQTZCO2tHQUE3Qiw2QkFBNkIsc0ZBRjlCLEVBQUU7OzJGQUVELDZCQUE2QjtrQkFKekMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUUsRUFBRTtpQkFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBsYWJlbCBwcmltaXRpdmUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9pbnQuaHRtbFxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLXBvaW50LXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xuICogICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgIGNvbG9yOiBDZXNpdW0uQ29sb3IuUkVEXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLXBvaW50LXByaW1pdGl2ZS1kZXNjPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLXBvaW50LXByaW1pdGl2ZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1BvaW50UHJpbWl0aXZlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IocG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIocG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=