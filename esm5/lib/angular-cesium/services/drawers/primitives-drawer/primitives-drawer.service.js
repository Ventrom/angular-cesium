/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
var /**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
PrimitivesDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(PrimitivesDrawerService, _super);
    function PrimitivesDrawerService(drawerType, cesiumService) {
        var _this = _super.call(this) || this;
        _this.drawerType = drawerType;
        _this.cesiumService = cesiumService;
        _this._show = true;
        return _this;
    }
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.init = /**
     * @return {?}
     */
    function () {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    };
    /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    PrimitivesDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    function (cesiumProps) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this._cesiumCollection.add(cesiumProps);
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    PrimitivesDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    function (entity, cesiumProps) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    PrimitivesDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this._cesiumCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this._cesiumCollection.removeAll();
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    PrimitivesDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    };
    /**
     * @return {?}
     */
    PrimitivesDrawerService.prototype.getShow = /**
     * @return {?}
     */
    function () {
        return this._show;
    };
    return PrimitivesDrawerService;
}(BasicDrawerService));
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
export { PrimitivesDrawerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype._show;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype._primitiveCollectionWrap;
    /**
     * @type {?}
     * @protected
     */
    PrimitivesDrawerService.prototype._cesiumCollection;
    /**
     * @type {?}
     * @protected
     */
    PrimitivesDrawerService.prototype._propsAssigner;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype.drawerType;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDOzs7Ozs7QUFNMUU7Ozs7OztJQUFzRCxtREFBa0I7SUFNdEUsaUNBQW9CLFVBQWUsRUFBVSxhQUE0QjtRQUF6RSxZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsZ0JBQVUsR0FBVixVQUFVLENBQUs7UUFBVSxtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUxqRSxXQUFLLEdBQUcsSUFBSSxDQUFDOztJQU9yQixDQUFDOzs7O0lBRUQsc0NBQUk7OztJQUFKO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDOUUsQ0FBQzs7Ozs7O0lBRUQscUNBQUc7Ozs7O0lBQUgsVUFBSSxXQUFnQjtRQUFFLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsNkJBQWM7O1FBQ2xDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7O0lBRUQsd0NBQU07Ozs7OztJQUFOLFVBQU8sTUFBVyxFQUFFLFdBQWdCO1FBQUUsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCw2QkFBYzs7UUFDbEQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7Ozs7O0lBRUQsd0NBQU07Ozs7SUFBTixVQUFPLE1BQVc7UUFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7O0lBRUQsMkNBQVM7OztJQUFUO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JDLENBQUM7Ozs7O0lBRUQseUNBQU87Ozs7SUFBUCxVQUFRLFNBQWtCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQ2pELENBQUM7Ozs7SUFFRCx5Q0FBTzs7O0lBQVA7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQTdDRCxDQUFzRCxrQkFBa0IsR0E2Q3ZFOzs7Ozs7Ozs7Ozs7SUE1Q0Msd0NBQXFCOzs7OztJQUNyQiwyREFBc0M7Ozs7O0lBQ3RDLG9EQUFpQzs7Ozs7SUFDakMsaURBQW1DOzs7OztJQUV2Qiw2Q0FBdUI7Ozs7O0lBQUUsZ0RBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBHZW5lcmFsIHByaW1pdGl2ZXMgZHJhd2VyIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgQ2VzaXVtIHByaW1pdGl2ZXMuXG4gKiAgRHJhd2VycyB0aGUgaGFuZGxlIENlc2l1bSBwcmltaXRpdmVzIGV4dGVuZCBpdC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfc2hvdyA9IHRydWU7XG4gIHByaXZhdGUgX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwOiBhbnk7XG4gIHByb3RlY3RlZCBfY2VzaXVtQ29sbGVjdGlvbjogYW55O1xuICBwcm90ZWN0ZWQgX3Byb3BzQXNzaWduZXI6IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHJhd2VyVHlwZTogYW55LCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uID0gbmV3IHRoaXMuZHJhd2VyVHlwZSgpO1xuICAgIHRoaXMuX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwID0gbmV3IENlc2l1bS5QcmltaXRpdmVDb2xsZWN0aW9uKHtkZXN0cm95UHJpbWl0aXZlczogZmFsc2V9KTtcbiAgICB0aGlzLl9wcmltaXRpdmVDb2xsZWN0aW9uV3JhcC5hZGQodGhpcy5fY2VzaXVtQ29sbGVjdGlvbik7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJpbWl0aXZlcy5hZGQodGhpcy5fcHJpbWl0aXZlQ29sbGVjdGlvbldyYXApO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5hZGQoY2VzaXVtUHJvcHMpO1xuICB9XG5cbiAgdXBkYXRlKGVudGl0eTogYW55LCBjZXNpdW1Qcm9wczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLl9wcm9wc0Fzc2lnbmVyKSB7XG4gICAgICB0aGlzLl9wcm9wc0Fzc2lnbmVyKGVudGl0eSwgY2VzaXVtUHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24ucmVtb3ZlKGVudGl0eSk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvdyA9IHNob3dWYWx1ZTtcbiAgICB0aGlzLl9wcmltaXRpdmVDb2xsZWN0aW9uV3JhcC5zaG93ID0gc2hvd1ZhbHVlO1xuICB9XG5cbiAgZ2V0U2hvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxufVxuIl19