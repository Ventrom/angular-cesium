/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { PolylineVolumeDrawerService } from '../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service';
/**
 *  This is a point implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineVolumeGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-polyline-volume-desc props="{
 *     show : line.show, //optional
 *     positions : line.positions,
 *     material : line.color  //optional
 *   }">
 *   </ac-polyline-volume-desc>
 *  ```
 */
var AcPolylineVolumeDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcPolylineVolumeDescComponent, _super);
    function AcPolylineVolumeDescComponent(drawerService, layerService, computationCache, cesiumProperties) {
        return _super.call(this, drawerService, layerService, computationCache, cesiumProperties) || this;
    }
    AcPolylineVolumeDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-polyline-volume-desc',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcPolylineVolumeDescComponent.ctorParameters = function () { return [
        { type: PolylineVolumeDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    return AcPolylineVolumeDescComponent;
}(BasicDesc));
export { AcPolylineVolumeDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWxpbmUtdm9sdW1lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1wb2x5bGluZS12b2x1bWUtZGVzYy9hYy1wb2x5bGluZS12b2x1bWUtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkVBQTZFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQjFIO0lBSW1ELHlEQUFTO0lBRTFELHVDQUFZLGFBQTBDLEVBQUUsWUFBMEIsRUFDdEUsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDeEUsQ0FBQzs7Z0JBVEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSxFQUFFO2lCQUNiOzs7O2dCQXZCUSwyQkFBMkI7Z0JBSDNCLFlBQVk7Z0JBQ1osZ0JBQWdCO2dCQUNoQixnQkFBZ0I7O0lBK0J6QixvQ0FBQztDQUFBLEFBVkQsQ0FJbUQsU0FBUyxHQU0zRDtTQU5ZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS12b2x1bWUtZGF3ZXIvcG9seWxpbmUtdm9sdW1lLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhIHBvaW50IGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBQb2ludEdyYXBoaWNzIGFuZCB0aGUgZ2VuZXJhbCBwcm9wZXJ0aWVzXG4gKiAgb2YgRW50aXR5XG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbnRpdHkuaHRtbFxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9seWxpbmVWb2x1bWVHcmFwaGljcy5odG1sXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICAgPGFjLXBvbHlsaW5lLXZvbHVtZS1kZXNjIHByb3BzPVwie1xuICogICAgIHNob3cgOiBsaW5lLnNob3csIC8vb3B0aW9uYWxcbiAqICAgICBwb3NpdGlvbnMgOiBsaW5lLnBvc2l0aW9ucyxcbiAqICAgICBtYXRlcmlhbCA6IGxpbmUuY29sb3IgIC8vb3B0aW9uYWxcbiAqICAgfVwiPlxuICogICA8L2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1wb2x5bGluZS12b2x1bWUtZGVzYycsXG4gIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBBY1BvbHlsaW5lVm9sdW1lRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XG5cbiAgY29uc3RydWN0b3IoZHJhd2VyU2VydmljZTogUG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGRyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cbn1cbiJdfQ==