/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
/**
 * + This drawer is responsible for drawing a polygon over the Cesium map.
 * + This implementation uses simple PolygonGeometry and Primitive parameters.
 * + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
export class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolygonGeometry, cesiumService);
    }
}
StaticPolygonDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticPolygonDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDbkcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7Ozs7QUFRL0QsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHFCQUFxQjs7OztJQUNuRSxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OztZQUpGLFVBQVU7Ozs7WUFQRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKyBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBhIHBvbHlnb24gb3ZlciB0aGUgQ2VzaXVtIG1hcC5cbiArIFRoaXMgaW1wbGVtZW50YXRpb24gdXNlcyBzaW1wbGUgUG9seWdvbkdlb21ldHJ5IGFuZCBQcmltaXRpdmUgcGFyYW1ldGVycy5cbiArIFRoaXMgZG9lc24ndCBhbGxvdyB1cyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gb2YgdGhlIHBvbHlnb25zLiBGb3IgdGhhdCB5b3UgbWF5IHVzZSB0aGUgZHluYW1pYyBwb2x5Z29uIGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5Z29uR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xuICB9XG59XG4iXX0=