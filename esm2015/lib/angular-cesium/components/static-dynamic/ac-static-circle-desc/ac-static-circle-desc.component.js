/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import { StaticCircleDrawerService } from '../../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service';
/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
export class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    /**
     * @param {?} staticCircleDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticCircleDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-static-circle',
                template: ''
            }] }
];
/** @nocollapse */
AcStaticCircleDescComponent.ctorParameters = () => [
    { type: StaticCircleDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWNpcmNsZS1kZXNjL2FjLXN0YXRpYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDRGQUE0RixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQnZJLE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7Ozs7Ozs7SUFDdkUsWUFBWSxrQkFBNkMsRUFBRSxZQUEwQixFQUN6RSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzlFLENBQUM7OztZQVJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUUsRUFBRTthQUNiOzs7O1lBekJRLHlCQUF5QjtZQUp6QixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLWNpcmNsZS1kZXNjXG4gKlxuICogIFRoaXMgaXMgYSBzdGF0aWMgKHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gYXJlIG5vdCB1cGRhdGVkKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBjaXJjbGUuXG4gKiAgX191c2FnZTpfX1xuICogIGBgYFxuICogICAgJmx0O2FjLXN0YXRpYy1jaXJjbGUtZGVzY1xuICogICAgICBnZW9tZXRyeVByb3BzPVwie1xuICogICAgICAgICAgY2VudGVyOiBjaXJjbGUuZ2VvbWV0cnkuY2VudGVyLFxuICogICAgICAgICAgcmFkaXVzOiBjaXJjbGUuZ2VvbWV0cnkucmFkaXVzLFxuICogICAgICB9XCJcbiAqICAgICAgaW5zdGFuY2VQcm9wcz1cIntcbiAqICAgICAgICAgIGF0dHJpYnV0ZXM6IGNpcmNsZS5hdHRyaWJ1dGVzIC8vT3B0aW9uYWxcbiAqICAgICAgfVwiXG4gKiAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xuICogICAgICAgICAgYXBwZWFyYW5jZTogY2lyY2xlLmFwcGVhcmFuY2UgLy9PcHRpb25hbFxuICogICAgICB9XCImZ3Q7XG4gKiAgICAmbHQ7L2FjLXN0YXRpYy1jaXJjbGUtZGVzYyZndDtcbiAqICAgIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtY2lyY2xlJyxcbiAgdGVtcGxhdGU6ICcnXG59KVxuZXhwb3J0IGNsYXNzIEFjU3RhdGljQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XG4gIGNvbnN0cnVjdG9yKHN0YXRpY0NpcmNsZURyYXdlcjogU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihzdGF0aWNDaXJjbGVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==