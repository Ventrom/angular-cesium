/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
var CzmlDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(CzmlDrawerService, _super);
    function CzmlDrawerService(cesiumService) {
        var _this = _super.call(this) || this;
        _this.cesiumService = cesiumService;
        return _this;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    CzmlDrawerService.prototype.init = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    };
    // returns the packet, provided by the stream
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    CzmlDrawerService.prototype.add = 
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    CzmlDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    function (entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    CzmlDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    };
    /**
     * @return {?}
     */
    CzmlDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.czmlStream.entities.removeAll();
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    CzmlDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this.czmlStream.entities.show = showValue;
    };
    CzmlDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CzmlDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return CzmlDrawerService;
}(BasicDrawerService));
export { CzmlDrawerService };
if (false) {
    /** @type {?} */
    CzmlDrawerService.prototype.czmlStream;
    /**
     * @type {?}
     * @private
     */
    CzmlDrawerService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7O0FBTTFFO0lBQ3VDLDZDQUFrQjtJQUl2RCwyQkFDVSxhQUE0QjtRQUR0QyxZQUdFLGlCQUFPLFNBQ1I7UUFIUyxtQkFBYSxHQUFiLGFBQWEsQ0FBZTs7SUFHdEMsQ0FBQzs7Ozs7SUFHRCxnQ0FBSTs7OztJQUFKLFVBQUssT0FBK0I7O1lBQzVCLFdBQVcsR0FBRyxFQUFFO1FBRXRCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELDZDQUE2Qzs7Ozs7O0lBQzdDLCtCQUFHOzs7Ozs7SUFBSCxVQUFJLFdBQWdCO1FBRWxCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFFRCxrQ0FBTTs7Ozs7SUFBTixVQUFPLE1BQVcsRUFBRSxXQUFnQjtRQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7Ozs7SUFFRCxrQ0FBTTs7OztJQUFOLFVBQU8sTUFBVztRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7O0lBRUQscUNBQVM7OztJQUFUO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7Ozs7SUFFRCxtQ0FBTzs7OztJQUFQLFVBQVEsU0FBa0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUM1QyxDQUFDOztnQkE5Q0YsVUFBVTs7OztnQkFQRixhQUFhOztJQXVEdEIsd0JBQUM7Q0FBQSxBQWhERCxDQUN1QyxrQkFBa0IsR0ErQ3hEO1NBL0NZLGlCQUFpQjs7O0lBRTVCLHVDQUFnQjs7Ozs7SUFHZCwwQ0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbnRpdGllcy1kcmF3ZXItb3B0aW9ucyc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGN6bWwgZGF0YVNvdXJjZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDem1sRHJhd2VyU2VydmljZSBleHRlbmRzIEJhc2ljRHJhd2VyU2VydmljZSB7XG5cbiAgY3ptbFN0cmVhbTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG5cbiAgaW5pdChvcHRpb25zPzogRW50aXRpZXNEcmF3ZXJPcHRpb25zKSB7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSBbXTtcblxuICAgIHRoaXMuY3ptbFN0cmVhbSA9IG5ldyBDZXNpdW0uQ3ptbERhdGFTb3VyY2UoJ2N6bWwnKTtcblxuICAgIGRhdGFTb3VyY2VzLnB1c2godGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQodGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlcztcbiAgfVxuXG4gIC8vIHJldHVybnMgdGhlIHBhY2tldCwgcHJvdmlkZWQgYnkgdGhlIHN0cmVhbVxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG5cbiAgICB0aGlzLmN6bWxTdHJlYW0ucHJvY2VzcyhjZXNpdW1Qcm9wcy5jem1sUGFja2V0KTtcblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5wcm9jZXNzKGNlc2l1bVByb3BzLmN6bWxQYWNrZXQpO1xuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnJlbW92ZUJ5SWQoZW50aXR5LmFjRW50aXR5LmlkKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBzZXRTaG93KHNob3dWYWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5zaG93ID0gc2hvd1ZhbHVlO1xuICB9XG5cbn1cblxuXG4iXX0=