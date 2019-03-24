/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
export class PointPrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PointPrimitiveCollection, cesiumService);
    }
}
PointPrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PointPrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7Ozs7O0FBT3pGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSx1QkFBdUI7Ozs7SUFDdEUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7OztZQUpGLFVBQVU7Ozs7WUFQRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHBvaW50cyBhcyBwcmltaXRpdmVzLlxuICogIFRoaXMgZHJhd2VyIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gUG9pbnREcmF3ZXJTZXJ2aWNlIHdoZW4gZHJhd2luZyBkeW5hbWljIHBvaW50cy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2ludFByaW1pdGl2ZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG59XG4iXX0=