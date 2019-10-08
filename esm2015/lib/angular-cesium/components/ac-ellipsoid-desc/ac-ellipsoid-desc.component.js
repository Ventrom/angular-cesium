/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { EllipsoidDrawerService } from '../../services/drawers/ellipoid-drawer/ellipsoid-drawer.service';
/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipsoidGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-ellipsoid-desc props="{
 *     show : ellipsoid.show, //optional
 *     radii : ellipsoid.radii,
 *     material : ellipsoid.color  //optional
 *   }">
 *   </ac-ellipsoid-desc>
 *  ```
 */
export class AcEllipsoidDescComponent extends BasicDesc {
    /**
     * @param {?} drawerService
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcEllipsoidDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-ellipsoid-desc',
                template: '',
                providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                         * @return {?}
                         */
                        () => AcEllipsoidDescComponent)) }]
            }] }
];
/** @nocollapse */
AcEllipsoidDescComponent.ctorParameters = () => [
    { type: EllipsoidDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZWxsaXBzb2lkLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1lbGxpcHNvaWQtZGVzYy9hYy1lbGxpcHNvaWQtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUVBQWlFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QnpHLE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxTQUFTOzs7Ozs7O0lBRXJELFlBQVksYUFBcUMsRUFBRSxZQUEwQixFQUNqRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVOzs7d0JBQUMsR0FBRyxFQUFFLENBQUMsd0JBQXdCLEVBQUMsRUFBQyxDQUFDO2FBQzNGOzs7O1lBeEJRLHNCQUFzQjtZQUh0QixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzb2lkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBvaWQtZHJhd2VyL2VsbGlwc29pZC1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBwb2ludCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtYm94LWRlc2MgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICBUaGUgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgUG9pbnRHcmFwaGljcyBhbmQgdGhlIGdlbmVyYWwgcHJvcGVydGllc1xuICogIG9mIEVudGl0eVxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc29pZEdyYXBoaWNzLmh0bWxcbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogICA8YWMtZWxsaXBzb2lkLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgc2hvdyA6IGVsbGlwc29pZC5zaG93LCAvL29wdGlvbmFsXG4gKiAgICAgcmFkaWkgOiBlbGxpcHNvaWQucmFkaWksXG4gKiAgICAgbWF0ZXJpYWwgOiBlbGxpcHNvaWQuY29sb3IgIC8vb3B0aW9uYWxcbiAqICAgfVwiPlxuICogICA8L2FjLWVsbGlwc29pZC1kZXNjPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1lbGxpcHNvaWQtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNFbGxpcHNvaWREZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0VsbGlwc29pZERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuXG4gIGNvbnN0cnVjdG9yKGRyYXdlclNlcnZpY2U6IEVsbGlwc29pZERyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoZHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxufVxuIl19