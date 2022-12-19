// tslint:disable
import { Component } from '@angular/core';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
// tslint:enable
/**
 * @deprecated use ac-polylinc-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-dynamic-polyline-desc element must be a child of ac-layer element.
 *  __Usage:__
 *  ```
 *    &lt;ac-dynamic-polyline-desc props="{width : polyline.width, //optional
 *                                      positions: polyline.positions,
 *                                      material: polyline.material //optional
 *                                      }"
 *    &gt;
 *    &lt;/ac-dynamic-polyline-desc&gt;
 * ```
 */
export class AcDynamicPolylineDescComponent extends BasicDesc {
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDynamicPolylineDescComponent, deps: [{ token: i1.DynamicPolylineDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcDynamicPolylineDescComponent, selector: "ac-dynamic-polyline-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDynamicPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-polyline-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.DynamicPolylineDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLXBvbHlsaW5lLWRlc2MvYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saURBQWlELENBQUM7Ozs7OztBQU01RSxnQkFBZ0I7QUFDaEI7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFLSCxNQUFNLE9BQU8sOEJBQStCLFNBQVEsU0FBUztJQUUzRCxZQUFZLDRCQUEwRCxFQUFFLFlBQTBCLEVBQ3RGLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsNEJBQTRCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDeEYsQ0FBQzs7NEhBTFUsOEJBQThCO2dIQUE5Qiw4QkFBOEIsdUZBRi9CLEVBQUU7NEZBRUQsOEJBQThCO2tCQUoxQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwwQkFBMEI7b0JBQ3BDLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLXBvbHlsaW5jLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgZHluYW1pYyhwb3NpdGlvbiBpcyB1cGRhdGFibGUpIGltcGxlbWVudGF0aW9uIG9mIGFuIHBvbHlsaW5lLlxuICogIFRoZSBhYy1keW5hbWljLXBvbHlsaW5lLWRlc2MgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1wb2x5bGluZS1kZXNjIHByb3BzPVwie3dpZHRoIDogcG9seWxpbmUud2lkdGgsIC8vb3B0aW9uYWxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHBvbHlsaW5lLnBvc2l0aW9ucyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogcG9seWxpbmUubWF0ZXJpYWwgLy9vcHRpb25hbFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cIlxuICogICAgJmd0O1xuICogICAgJmx0Oy9hYy1keW5hbWljLXBvbHlsaW5lLWRlc2MmZ3Q7XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjRHluYW1pY1BvbHlsaW5lRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZTogRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=