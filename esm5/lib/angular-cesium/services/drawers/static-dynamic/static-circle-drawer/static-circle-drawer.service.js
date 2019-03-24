/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
var StaticCircleDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(StaticCircleDrawerService, _super);
    function StaticCircleDrawerService(cesiumService) {
        return _super.call(this, Cesium.CircleGeometry, cesiumService) || this;
    }
    StaticCircleDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    StaticCircleDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return StaticCircleDrawerService;
}(StaticPrimitiveDrawer));
export { StaticCircleDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDOzs7O0FBS25HO0lBQytDLHFEQUFxQjtJQUNsRSxtQ0FBWSxhQUE0QjtlQUN0QyxrQkFBTSxNQUFNLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQztJQUM3QyxDQUFDOztnQkFKRixVQUFVOzs7O2dCQU5GLGFBQWE7O0lBV3RCLGdDQUFDO0NBQUEsQUFMRCxDQUMrQyxxQkFBcUIsR0FJbkU7U0FKWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoZSBjaXJjbGUgY29tcG9uZW50LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uQ2lyY2xlR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xuICB9XG59XG4iXX0=