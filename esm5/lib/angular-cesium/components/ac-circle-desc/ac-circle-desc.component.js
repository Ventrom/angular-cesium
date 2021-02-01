import { __decorate, __extends, __metadata } from "tslib";
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
 *__Usage :__
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
    __extends(AcCircleDescComponent, _super);
    function AcCircleDescComponent(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, ellipseDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    AcCircleDescComponent_1 = AcCircleDescComponent;
    AcCircleDescComponent.prototype._propsEvaluator = function (context) {
        var cesiumProps = _super.prototype._propsEvaluator.call(this, context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    };
    AcCircleDescComponent.prototype._getPropsAssigner = function () {
        return function (cesiumObject, desc) { return Object.assign(cesiumObject, desc); };
    };
    var AcCircleDescComponent_1;
    AcCircleDescComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcCircleDescComponent = AcCircleDescComponent_1 = __decorate([
        Component({
            selector: 'ac-circle-desc',
            template: '',
            providers: [{ provide: BasicDesc, useExisting: forwardRef(function () { return AcCircleDescComponent_1; }) }]
        }),
        __metadata("design:paramtypes", [EllipseDrawerService, LayerService,
            ComputationCache, CesiumProperties])
    ], AcCircleDescComponent);
    return AcCircleDescComponent;
}(BasicDesc));
export { AcCircleDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jaXJjbGUtZGVzYy9hYy1jaXJjbGUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBQzlGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFFcEc7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBTUg7SUFBMkMseUNBQVM7SUFDbEQsK0JBQVksYUFBbUMsRUFBRSxZQUEwQixFQUMvRCxnQkFBa0MsRUFBRSxnQkFBa0M7ZUFDaEYsa0JBQU0sYUFBYSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztJQUN4RSxDQUFDOzhCQUpVLHFCQUFxQjtJQU10QiwrQ0FBZSxHQUF6QixVQUEwQixPQUFlO1FBQ3ZDLElBQU0sV0FBVyxHQUFHLGlCQUFNLGVBQWUsWUFBQyxPQUFPLENBQUMsQ0FBQztRQUVuRCxXQUFXLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDL0MsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUxQixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRVMsaURBQWlCLEdBQTNCO1FBQ0UsT0FBTyxVQUFDLFlBQW9CLEVBQUUsSUFBWSxJQUFLLE9BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQWpDLENBQWlDLENBQUM7SUFDbkYsQ0FBQzs7O2dCQWpCMEIsb0JBQW9CO2dCQUFnQixZQUFZO2dCQUM3QyxnQkFBZ0I7Z0JBQW9CLGdCQUFnQjs7SUFGdkUscUJBQXFCO1FBTGpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsdUJBQXFCLEVBQXJCLENBQXFCLENBQUMsRUFBQyxDQUFDO1NBQ3hGLENBQUM7eUNBRTJCLG9CQUFvQixFQUFnQixZQUFZO1lBQzdDLGdCQUFnQixFQUFvQixnQkFBZ0I7T0FGdkUscUJBQXFCLENBbUJqQztJQUFELDRCQUFDO0NBQUEsQUFuQkQsQ0FBMkMsU0FBUyxHQW1CbkQ7U0FuQlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBjaXJjbGUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgc2VtaU1ham9yQXhpcyBhbnMgc2VtaU1pbm9yQXhpcyBhcmUgcmVwbGFjZWQgd2l0aCByYWRpdXMgcHJvcGVydHkuXG4gKiAgQWxsIG90aGVyIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgRWxsaXBzZUdyYXBoaWNzOlxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc2VHcmFwaGljcy5odG1sXG4gKlxuICpfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLWNpcmNsZS1kZXNjIHByb3BzPVwie1xuICogICAgICBwb3NpdGlvbjogZGF0YS5wb3NpdGlvbixcbiAqICAgICAgcmFkaXVzOiA1XG4gKiAgICAgIGdyYW51bGFyaXR5OjAuMDggLy8gT3B0aW9uYWxcbiAqICAgIH1cIj5cbiAqICAgIDwvYWMtY2lyY2xlLWRlc2M+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWNpcmNsZS1kZXNjJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzaWNEZXNjLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBY0NpcmNsZURlc2NDb21wb25lbnQpfV0sXG59KVxuZXhwb3J0IGNsYXNzIEFjQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXI6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSBzdXBlci5fcHJvcHNFdmFsdWF0b3IoY29udGV4dCk7XG5cbiAgICBjZXNpdW1Qcm9wcy5zZW1pTWFqb3JBeGlzID0gY2VzaXVtUHJvcHMucmFkaXVzO1xuICAgIGNlc2l1bVByb3BzLnNlbWlNaW5vckF4aXMgPSBjZXNpdW1Qcm9wcy5yYWRpdXM7XG4gICAgZGVsZXRlIGNlc2l1bVByb3BzLnJhZGl1cztcblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0UHJvcHNBc3NpZ25lcigpOiAoY2VzaXVtT2JqZWN0OiBPYmplY3QsIGRlc2M6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICByZXR1cm4gKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IE9iamVjdC5hc3NpZ24oY2VzaXVtT2JqZWN0LCBkZXNjKTtcbiAgfVxufVxuIl19