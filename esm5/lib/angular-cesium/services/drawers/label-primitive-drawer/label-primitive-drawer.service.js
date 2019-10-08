/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
var LabelPrimitiveDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(LabelPrimitiveDrawerService, _super);
    function LabelPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.LabelCollection, cesiumService) || this;
    }
    LabelPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    LabelPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return LabelPrimitiveDrawerService;
}(PrimitivesDrawerService));
export { LabelPrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9sYWJlbC1wcmltaXRpdmUtZHJhd2VyL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7OztBQU16RjtJQUNpRCx1REFBdUI7SUFDdEUscUNBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUM7SUFDOUMsQ0FBQzs7Z0JBSkYsVUFBVTs7OztnQkFQRixhQUFhOztJQVl0QixrQ0FBQztDQUFBLEFBTEQsQ0FDaUQsdUJBQXVCLEdBSXZFO1NBSlksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBsYWJlbHMgYXMgcHJpbWl0aXZlcy5cbiAqICBUaGlzIGRyYXdlciBpcyBtb3JlIGVmZmljaWVudCB0aGFuIExhYmVsRHJhd2VyU2VydmljZSB3aGVuIGRyYXdpbmcgZHluYW1pYyBsYWJlbHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uTGFiZWxDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19