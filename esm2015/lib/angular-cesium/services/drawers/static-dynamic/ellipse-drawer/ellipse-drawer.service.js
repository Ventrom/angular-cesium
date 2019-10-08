/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CesiumService } from '../../../cesium/cesium.service';
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 * + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 * + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 * + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 * +
 */
export class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.EllipseGeometry, cesiumService);
    }
}
StaticEllipseDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticEllipseDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7Ozs7Ozs7QUFTbkcsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHFCQUFxQjs7OztJQUNuRSxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OztZQUpGLFVBQVU7Ozs7WUFWRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuXG4vKipcbiArICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGFuIGVsbGlwc2Ugb3ZlciB0aGUgQ2VzaXVtIG1hcC5cbiArICogIFRoaXMgaW1wbGVtZW50YXRpb24gdXNlcyBzaW1wbGUgRWxsaXBzZUdlb21ldHJ5IGFuZCBQcmltaXRpdmUgcGFyYW1ldGVycy5cbiArICogIFRoaXMgZG9lc24ndCBhbGxvdyB1cyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gb2YgdGhlIGVsbGlwc2VzLiBGb3IgdGhhdCB5b3UgbWF5IHVzZSB0aGUgZHluYW1pYyBlbGxpcHNlIGNvbXBvbmVudC5cbiArICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkVsbGlwc2VHZW9tZXRyeSwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==