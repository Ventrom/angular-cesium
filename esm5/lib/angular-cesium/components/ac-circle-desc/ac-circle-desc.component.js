/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 * __Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
var AcCircleDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcCircleDescComponent, _super);
    function AcCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    AcCircleDescComponent.prototype._propsEvaluator = /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    function (context) {
        /** @type {?} */
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    };
    /**
     * @protected
     * @return {?}
     */
    AcCircleDescComponent.prototype._getPropsAssigner = /**
     * @protected
     * @return {?}
     */
    function () {
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        function (cesiumObject, desc) { return Object.assign(cesiumObject, desc); });
    };
    AcCircleDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-circle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef((/**
                             * @return {?}
                             */
                            function () { return AcCircleDescComponent; })) }]
                }] }
    ];
    /** @nocollapse */
    AcCircleDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcCircleDescComponent;
}(BasicDesc));
export { AcCircleDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jaXJjbGUtZGVzYy9hYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JwRztJQUsyQyxpREFBUztJQUNsRCwrQkFBWSxhQUFtQyxFQUFFLFlBQTBCLEVBQy9ELGdCQUFrQyxFQUFFLGdCQUFrQztlQUNoRixrQkFBTSxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO0lBQ3hFLENBQUM7Ozs7OztJQUVTLCtDQUFlOzs7OztJQUF6QixVQUEwQixPQUFlOztZQUNqQyxXQUFXLEdBQUcsaUJBQU0sZUFBZSxZQUFDLE9BQU8sQ0FBQztRQUVsRCxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0MsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUxQixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7OztJQUVTLGlEQUFpQjs7OztJQUEzQjtRQUNFOzs7OztRQUFPLFVBQUMsWUFBb0IsRUFBRSxJQUFZLElBQUssT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBakMsQ0FBaUMsRUFBQztJQUNuRixDQUFDOztnQkF2QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSxFQUFFO29CQUNaLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVTs7OzRCQUFDLGNBQU0sT0FBQSxxQkFBcUIsRUFBckIsQ0FBcUIsRUFBQyxFQUFDLENBQUM7aUJBQ3hGOzs7O2dCQXhCUSxvQkFBb0I7Z0JBRnBCLFlBQVk7Z0JBRFosZ0JBQWdCO2dCQURoQixnQkFBZ0I7O0lBZ0R6Qiw0QkFBQztDQUFBLEFBeEJELENBSzJDLFNBQVMsR0FtQm5EO1NBbkJZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGEgY2lyY2xlIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIHNlbWlNYWpvckF4aXMgYW5zIHNlbWlNaW5vckF4aXMgYXJlIHJlcGxhY2VkIHdpdGggcmFkaXVzIHByb3BlcnR5LlxuICogIEFsbCBvdGhlciBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIEVsbGlwc2VHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbGxpcHNlR3JhcGhpY3MuaHRtbFxuICpcbiAqX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqICAgIDxhYy1jaXJjbGUtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgcG9zaXRpb246IGRhdGEucG9zaXRpb24sXG4gKiAgICAgIHJhZGl1czogNVxuICogICAgICBncmFudWxhcml0eTowLjA4IC8vIE9wdGlvbmFsXG4gKiAgICB9XCI+XG4gKiAgICA8L2FjLWNpcmNsZS1kZXNjPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1jaXJjbGUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNDaXJjbGVEZXNjQ29tcG9uZW50KX1dLFxufSlcbmV4cG9ydCBjbGFzcyBBY0NpcmNsZURlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2Mge1xuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyOiBFbGxpcHNlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xuICAgIGNvbnN0IGNlc2l1bVByb3BzID0gc3VwZXIuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuXG4gICAgY2VzaXVtUHJvcHMuc2VtaU1ham9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcbiAgICBjZXNpdW1Qcm9wcy5zZW1pTWlub3JBeGlzID0gY2VzaXVtUHJvcHMucmFkaXVzO1xuICAgIGRlbGV0ZSBjZXNpdW1Qcm9wcy5yYWRpdXM7XG5cbiAgICByZXR1cm4gY2VzaXVtUHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFByb3BzQXNzaWduZXIoKTogKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3QuYXNzaWduKGNlc2l1bU9iamVjdCwgZGVzYyk7XG4gIH1cbn1cbiJdfQ==