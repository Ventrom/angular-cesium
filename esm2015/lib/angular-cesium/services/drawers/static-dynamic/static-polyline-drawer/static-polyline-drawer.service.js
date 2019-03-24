/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
export class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        /** @type {?} */
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((/**
             * @param {?} readyPrimitive
             * @return {?}
             */
            (readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            }));
        }
        return primitive;
    }
}
StaticPolylineDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StaticPolylineDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7Ozs7O0FBT25HLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxxQkFBcUI7Ozs7SUFDcEUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Ozs7Ozs7OztJQUtELE1BQU0sQ0FBQyxTQUFjLEVBQUUsYUFBa0IsRUFBRSxhQUFrQixFQUFFLGNBQW1COztjQUMxRSxLQUFLLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSztRQUVsRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsU0FBUyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN6RDthQUFNO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSTs7OztZQUFDLENBQUMsY0FBbUIsRUFBRSxFQUFFO2dCQUMvRCxjQUFjLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNyRSxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7O1lBckJGLFVBQVU7Ozs7WUFQRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGUgcG9seWxpbmUgY29tcG9uZW50LlxuICogIFRoaXMgYWxzbyBhbGxvd3MgdXMgdG8gY2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcG9seWxpbmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZnVuY3Rpb24gY2FuIG9ubHkgY2hhbmdlIHRoZSBwcmltaXRpdmUgY29sb3IuXG4gICAqL1xuICB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KSB7XG4gICAgY29uc3QgY29sb3IgPSBpbnN0YW5jZVByb3BzLmF0dHJpYnV0ZXMuY29sb3IudmFsdWU7XG5cbiAgICBpZiAocHJpbWl0aXZlLnJlYWR5KSB7XG4gICAgICBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvciA9IGNvbG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBDZXNpdW0ud2hlbihwcmltaXRpdmUucmVhZHlQcm9taXNlKS50aGVuKChyZWFkeVByaW1pdGl2ZTogYW55KSA9PiB7XG4gICAgICAgIHJlYWR5UHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKCkuY29sb3IudmFsdWUgPSBjb2xvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cbn1cbiJdfQ==