import { __decorate, __metadata } from "tslib";
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
let AcDynamicPolylineDescComponent = class AcDynamicPolylineDescComponent extends BasicDesc {
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
};
AcDynamicPolylineDescComponent.ctorParameters = () => [
    { type: DynamicPolylineDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcDynamicPolylineDescComponent = __decorate([
    Component({
        selector: 'ac-dynamic-polyline-desc',
        template: ''
    }),
    __metadata("design:paramtypes", [DynamicPolylineDrawerService, LayerService,
        ComputationCache, CesiumProperties])
], AcDynamicPolylineDescComponent);
export { AcDynamicPolylineDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjL2FjLWR5bmFtaWMtcG9seWxpbmUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQUFpQjtBQUNqQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFDckYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0dBQWtHLENBQUM7QUFFaEosZ0JBQWdCO0FBQ2hCOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBS0gsSUFBYSw4QkFBOEIsR0FBM0MsTUFBYSw4QkFBK0IsU0FBUSxTQUFTO0lBRTNELFlBQVksNEJBQTBELEVBQUUsWUFBMEIsRUFDdEYsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN4RixDQUFDO0NBQ0YsQ0FBQTs7WUFKMkMsNEJBQTRCO1lBQWdCLFlBQVk7WUFDcEUsZ0JBQWdCO1lBQW9CLGdCQUFnQjs7QUFIdkUsOEJBQThCO0lBSjFDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSwwQkFBMEI7UUFDcEMsUUFBUSxFQUFFLEVBQUU7S0FDYixDQUFDO3FDQUcwQyw0QkFBNEIsRUFBZ0IsWUFBWTtRQUNwRSxnQkFBZ0IsRUFBb0IsZ0JBQWdCO0dBSHZFLDhCQUE4QixDQU0xQztTQU5ZLDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyL2R5bmFtaWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vLyB0c2xpbnQ6ZW5hYmxlXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1wb2x5bGluYy1kZXNjIGluc3RlYWRcbiAqXG4gKiAgVGhpcyBpcyBhIGR5bmFtaWMocG9zaXRpb24gaXMgdXBkYXRhYmxlKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBwb2x5bGluZS5cbiAqICBUaGUgYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLWR5bmFtaWMtcG9seWxpbmUtZGVzYyBwcm9wcz1cInt3aWR0aCA6IHBvbHlsaW5lLndpZHRoLCAvL29wdGlvbmFsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zOiBwb2x5bGluZS5wb3NpdGlvbnMsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IHBvbHlsaW5lLm1hdGVyaWFsIC8vb3B0aW9uYWxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XCJcbiAqICAgICZndDtcbiAqICAgICZsdDsvYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjJmd0O1xuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWR5bmFtaWMtcG9seWxpbmUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0R5bmFtaWNQb2x5bGluZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGR5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2U6IER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19