/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
export class HtmlDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} _cesiumService
     */
    constructor(_cesiumService) {
        super(Cesium.HtmlCollection, _cesiumService);
        this._cesiumService = _cesiumService;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return super.add(cesiumProps);
    }
}
HtmlDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
HtmlDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    HtmlDrawerService.prototype._cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFHekYsTUFBTSxPQUFPLGlCQUFrQixTQUFRLHVCQUF1Qjs7OztJQUM1RCxZQUFvQixjQUE2QjtRQUMvQyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUQzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtJQUVqRCxDQUFDOzs7OztJQUVELEdBQUcsQ0FBQyxXQUFnQjtRQUNsQixXQUFXLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsV0FBVyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzFFLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoQyxDQUFDOzs7WUFWRixVQUFVOzs7O1lBSEYsYUFBYTs7Ozs7OztJQUtSLDJDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkh0bWxDb2xsZWN0aW9uLCBfY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY2VzaXVtUHJvcHMuc2NlbmUgPSB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY2VzaXVtUHJvcHMubWFwQ29udGFpbmVyID0gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKTtcbiAgICByZXR1cm4gc3VwZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgfVxufVxuIl19