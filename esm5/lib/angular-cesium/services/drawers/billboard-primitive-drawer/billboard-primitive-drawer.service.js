/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
var BillboardPrimitiveDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(BillboardPrimitiveDrawerService, _super);
    function BillboardPrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.BillboardCollection, cesiumService) || this;
    }
    BillboardPrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    BillboardPrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return BillboardPrimitiveDrawerService;
}(PrimitivesDrawerService));
export { BillboardPrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIvYmlsbGJvYXJkLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7OztBQU16RjtJQUNxRCwyREFBdUI7SUFDMUUseUNBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLG1CQUFtQixFQUFFLGFBQWEsQ0FBQztJQUNsRCxDQUFDOztnQkFKRixVQUFVOzs7O2dCQVBGLGFBQWE7O0lBWXRCLHNDQUFDO0NBQUEsQUFMRCxDQUNxRCx1QkFBdUIsR0FJM0U7U0FKWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGJpbGxib2FyZHMgYXMgcHJpbWl0aXZlcy5cbiAqICBUaGlzIGRyYXdlciBpcyBtb3JlIGVmZmljaWVudCB0aGFuIEJpbGxib2FyZERyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgYmlsbGJvYXJkcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uQmlsbGJvYXJkQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==