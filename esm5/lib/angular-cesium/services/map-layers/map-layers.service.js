/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CesiumService } from '../cesium/cesium.service';
import { Injectable } from '@angular/core';
var MapLayersService = /** @class */ (function () {
    function MapLayersService(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    MapLayersService.prototype.registerLayerDataSources = /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    function (dataSources, zIndex) {
        var _this = this;
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        function (ds) {
            ds.zIndex = zIndex;
            _this.layersDataSources.push(ds);
        }));
    };
    /**
     * @return {?}
     */
    MapLayersService.prototype.drawAllLayers = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layersDataSources.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return a.zIndex - b.zIndex; }));
        this.layersDataSources.forEach((/**
         * @param {?} dataSource
         * @return {?}
         */
        function (dataSource) {
            _this.cesiumService.getViewer().dataSources.add(dataSource);
        }));
    };
    /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    MapLayersService.prototype.updateAndRefresh = /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    function (dataSources, newZIndex) {
        var _this = this;
        if (dataSources && dataSources.length) {
            dataSources.forEach((/**
             * @param {?} ds
             * @return {?}
             */
            function (ds) {
                /** @type {?} */
                var index = _this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    _this.layersDataSources[index].zIndex = newZIndex;
                }
            }));
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    };
    /**
     * @param {?} dataSources
     * @return {?}
     */
    MapLayersService.prototype.removeDataSources = /**
     * @param {?} dataSources
     * @return {?}
     */
    function (dataSources) {
        var _this = this;
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        function (ds) {
            /** @type {?} */
            var index = _this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                _this.layersDataSources.splice(index, 1);
                _this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        }));
    };
    MapLayersService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    MapLayersService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return MapLayersService;
}());
export { MapLayersService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapLayersService.prototype.layersDataSources;
    /**
     * @type {?}
     * @private
     */
    MapLayersService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDO0lBS0UsMEJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBRnhDLHNCQUFpQixHQUFVLEVBQUUsQ0FBQztJQUl0QyxDQUFDOzs7Ozs7SUFFRCxtREFBd0I7Ozs7O0lBQXhCLFVBQXlCLFdBQWtCLEVBQUUsTUFBYztRQUEzRCxpQkFLQztRQUpDLFdBQVcsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsd0NBQWE7OztJQUFiO1FBQUEsaUJBTUM7UUFMQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSTs7Ozs7UUFBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQW5CLENBQW1CLEVBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTzs7OztRQUFDLFVBQUMsVUFBVTtZQUN4QyxLQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7SUFFRCwyQ0FBZ0I7Ozs7O0lBQWhCLFVBQWlCLFdBQWtCLEVBQUUsU0FBaUI7UUFBdEQsaUJBWUM7UUFYQyxJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3JDLFdBQVcsQ0FBQyxPQUFPOzs7O1lBQUMsVUFBQyxFQUFFOztvQkFDZixLQUFLLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoQixLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztpQkFDbEQ7WUFDSCxDQUFDLEVBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7Ozs7O0lBRUQsNENBQWlCOzs7O0lBQWpCLFVBQWtCLFdBQWtCO1FBQXBDLGlCQVFDO1FBUEMsV0FBVyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLEVBQUU7O2dCQUNkLEtBQUssR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNoRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDaEIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEtBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0Q7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7O2dCQTlDRixVQUFVOzs7O2dCQUhGLGFBQWE7O0lBa0R0Qix1QkFBQztDQUFBLEFBL0NELElBK0NDO1NBOUNZLGdCQUFnQjs7Ozs7O0lBRTNCLDZDQUFzQzs7Ozs7SUFFMUIseUNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXBMYXllcnNTZXJ2aWNlIHtcblxuICBwcml2YXRlIGxheWVyc0RhdGFTb3VyY2VzOiBhbnlbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuXG4gIH1cblxuICByZWdpc3RlckxheWVyRGF0YVNvdXJjZXMoZGF0YVNvdXJjZXM6IGFueVtdLCB6SW5kZXg6IG51bWJlcikge1xuICAgIGRhdGFTb3VyY2VzLmZvckVhY2goZHMgPT4ge1xuICAgICAgZHMuekluZGV4ID0gekluZGV4O1xuICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5wdXNoKGRzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyYXdBbGxMYXllcnMoKSB7XG4gICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5zb3J0KChhLCBiKSA9PiBhLnpJbmRleCAtIGIuekluZGV4KTtcblxuICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuZm9yRWFjaCgoZGF0YVNvdXJjZSkgPT4ge1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLmFkZChkYXRhU291cmNlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUFuZFJlZnJlc2goZGF0YVNvdXJjZXM6IGFueVtdLCBuZXdaSW5kZXg6IG51bWJlcikge1xuICAgIGlmIChkYXRhU291cmNlcyAmJiBkYXRhU291cmNlcy5sZW5ndGgpIHtcbiAgICAgIGRhdGFTb3VyY2VzLmZvckVhY2goKGRzKSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5sYXllcnNEYXRhU291cmNlcy5pbmRleE9mKGRzKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXNbaW5kZXhdLnpJbmRleCA9IG5ld1pJbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5yZW1vdmVBbGwoKTtcbiAgICAgIHRoaXMuZHJhd0FsbExheWVycygpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZURhdGFTb3VyY2VzKGRhdGFTb3VyY2VzOiBhbnlbXSkge1xuICAgIGRhdGFTb3VyY2VzLmZvckVhY2goZHMgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmluZGV4T2YoZHMpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5yZW1vdmUoZHMsIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=