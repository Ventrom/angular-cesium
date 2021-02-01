import { __decorate, __extends, __metadata } from "tslib";
// tslint:disable
import { Component } from '@angular/core';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { DynamicPolylineDrawerService } from '../../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
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
var AcDynamicPolylineDescComponent = /** @class */ (function (_super) {
    __extends(AcDynamicPolylineDescComponent, _super);
    function AcDynamicPolylineDescComponent(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcDynamicPolylineDescComponent.ctorParameters = function () { return [
        { type: DynamicPolylineDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcDynamicPolylineDescComponent = __decorate([
        Component({
            selector: 'ac-dynamic-polyline-desc',
            template: ''
        }),
        __metadata("design:paramtypes", [DynamicPolylineDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcDynamicPolylineDescComponent);
    return AcDynamicPolylineDescComponent;
}(BasicDesc));
export { AcDynamicPolylineDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjL2FjLWR5bmFtaWMtcG9seWxpbmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQUFpQjtBQUNqQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0dBQWtHLENBQUM7QUFFaEosZ0JBQWdCO0FBQ2hCOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBS0g7SUFBb0Qsa0RBQVM7SUFFM0Qsd0NBQVksNEJBQTBELEVBQUUsWUFBMEIsRUFDdEYsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLDRCQUE0QixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN2RixDQUFDOztnQkFIeUMsNEJBQTRCO2dCQUFnQixZQUFZO2dCQUNwRSxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFIdkUsOEJBQThCO1FBSjFDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSwwQkFBMEI7WUFDcEMsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO3lDQUcwQyw0QkFBNEIsRUFBZ0IsWUFBWTtZQUNwRSxnQkFBZ0IsRUFBb0IsZ0JBQWdCO09BSHZFLDhCQUE4QixDQU0xQztJQUFELHFDQUFDO0NBQUEsQUFORCxDQUFvRCxTQUFTLEdBTTVEO1NBTlksOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIvZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8vIHRzbGludDplbmFibGVcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLXBvbHlsaW5jLWRlc2MgaW5zdGVhZFxuICpcbiAqICBUaGlzIGlzIGEgZHluYW1pYyhwb3NpdGlvbiBpcyB1cGRhdGFibGUpIGltcGxlbWVudGF0aW9uIG9mIGFuIHBvbHlsaW5lLlxuICogIFRoZSBhYy1keW5hbWljLXBvbHlsaW5lLWRlc2MgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1wb2x5bGluZS1kZXNjIHByb3BzPVwie3dpZHRoIDogcG9seWxpbmUud2lkdGgsIC8vb3B0aW9uYWxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbnM6IHBvbHlsaW5lLnBvc2l0aW9ucyxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogcG9seWxpbmUubWF0ZXJpYWwgLy9vcHRpb25hbFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cIlxuICogICAgJmd0O1xuICogICAgJmx0Oy9hYy1keW5hbWljLXBvbHlsaW5lLWRlc2MmZ3Q7XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjRHluYW1pY1BvbHlsaW5lRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZTogRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihkeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG59XG4iXX0=