/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ModelDrawerService } from '../../services/drawers/model-drawer/model-drawer.service';
/**
 *  This is a model implementation.
 *  The ac-model element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and ModelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/ModelGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-model-desc props="{
 *       position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 *       uri : '../../SampleData/models/CesiumGround/Cesium_Ground.gltf'
 *   }
 *    }">
 *    </ac-model-desc>
 *  ```
 */
export class AcModelDescComponent extends BasicDesc {
    /**
     * @param {?} modelDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(modelDrawer, layerService, computationCache, cesiumProperties) {
        super(modelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcModelDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-model-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcModelDescComponent)) }]
            }] }
];
/** @nocollapse */
AcModelDescComponent.ctorParameters = () => [
    { type: ModelDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbW9kZWwtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLW1vZGVsLWRlc2MvYWMtbW9kZWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMERBQTBELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCOUYsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFNBQVM7Ozs7Ozs7SUFFakQsWUFBWSxXQUErQixFQUFFLFlBQTBCLEVBQzNELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7OztZQVZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVOzs7d0JBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEVBQUMsRUFBQyxDQUFDO2FBQ3ZGOzs7O1lBdkJRLGtCQUFrQjtZQUhsQixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBNb2RlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL21vZGVsLWRyYXdlci9tb2RlbC1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBtb2RlbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtbW9kZWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBNb2RlbEdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL01vZGVsR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtbW9kZWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgIHBvc2l0aW9uIDogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbURlZ3JlZXMoLTEyMy4wNzQ0NjE5LCA0NC4wNTAzNzA2KSxcbiAqICAgICAgIHVyaSA6ICcuLi8uLi9TYW1wbGVEYXRhL21vZGVscy9DZXNpdW1Hcm91bmQvQ2VzaXVtX0dyb3VuZC5nbHRmJ1xuICogICB9XG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLW1vZGVsLWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLW1vZGVsLWRlc2MnLFxuICB0ZW1wbGF0ZTogJycsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjTW9kZWxEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY01vZGVsRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IobW9kZWxEcmF3ZXI6IE1vZGVsRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihtb2RlbERyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19