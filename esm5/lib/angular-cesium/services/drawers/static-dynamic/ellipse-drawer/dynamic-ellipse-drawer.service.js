/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { Checker } from '../../../../utils/checker';
import { EllipsePrimitive } from 'primitive-primitives';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
var DynamicEllipseDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicEllipseDrawerService, _super);
    function DynamicEllipseDrawerService(cesiumService) {
        return _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    DynamicEllipseDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return _super.prototype.add.call(this, new EllipsePrimitive(cesiumProps));
    };
    /**
     * @param {?} ellipse
     * @param {?} cesiumProps
     * @return {?}
     */
    DynamicEllipseDrawerService.prototype.update = /**
     * @param {?} ellipse
     * @param {?} cesiumProps
     * @return {?}
     */
    function (ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    };
    DynamicEllipseDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DynamicEllipseDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return DynamicEllipseDrawerService;
}(PrimitivesDrawerService));
export { DynamicEllipseDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbURBQW1ELENBQUM7Ozs7Ozs7QUFTNUY7SUFDaUQsdURBQXVCO0lBQ3RFLHFDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLENBQUM7SUFDbEQsQ0FBQzs7Ozs7SUFFRCx5Q0FBRzs7OztJQUFILFVBQUksV0FBZ0I7UUFDbEIsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUV4RixPQUFPLGlCQUFNLEdBQUcsWUFBQyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7Ozs7O0lBRUQsNENBQU07Ozs7O0lBQU4sVUFBTyxPQUFZLEVBQUUsV0FBZ0I7UUFDbkMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O2dCQWhCRixVQUFVOzs7O2dCQVpGLGFBQWE7O0lBNkJ0QixrQ0FBQztDQUFBLEFBakJELENBQ2lELHVCQUF1QixHQWdCdkU7U0FoQlksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbHMvY2hlY2tlcic7XG5pbXBvcnQgeyBFbGxpcHNlUHJpbWl0aXZlIH0gZnJvbSAncHJpbWl0aXZlLXByaW1pdGl2ZXMnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIGR5bmFtaWMgdmVyc2lvbiBvZiB0aGUgZWxsaXBzZSBjb21wb25lbnQuXG4gKiAgV2UgYXJlIHVzaW5nIHRoZSBwcmltaXRpdmUtcHJpbWl0aXZlcyBpbXBsZW1lbnRhdGlvbiBvZiBhbiBlbGxpcHNlLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb3Rlbnhkcy9QcmltaXRpdmUtcHJpbWl0aXZlc1xuICogIFRoaXMgYWxsb3dzIHVzIHRvIGNoYW5nZSB0aGUgcG9zaXRpb24gb2YgdGhlIGVsbGlwc2VzIHdpdGhvdXQgY3JlYXRpbmcgYSBuZXcgcHJpbWl0aXZlIG9iamVjdFxuICogIGFzIENlc2l1bSBkb2VzIG5vdCBhbGxvdyB1cGRhdGluZyBhbiBlbGxpcHNlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlByaW1pdGl2ZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xuICAgIENoZWNrZXIudGhyb3dJZkFueU5vdFByZXNlbnQoY2VzaXVtUHJvcHMsIFsnY2VudGVyJywgJ3NlbWlNYWpvckF4aXMnLCAnc2VtaU1pbm9yQXhpcyddKTtcblxuICAgIHJldHVybiBzdXBlci5hZGQobmV3IEVsbGlwc2VQcmltaXRpdmUoY2VzaXVtUHJvcHMpKTtcbiAgfVxuXG4gIHVwZGF0ZShlbGxpcHNlOiBhbnksIGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xuICAgIGVsbGlwc2UudXBkYXRlTG9jYXRpb25EYXRhKGNlc2l1bVByb3BzKTtcblxuICAgIHJldHVybiBlbGxpcHNlO1xuICB9XG59XG4iXX0=