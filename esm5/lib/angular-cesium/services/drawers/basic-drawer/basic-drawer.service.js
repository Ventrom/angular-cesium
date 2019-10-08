/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *  Abstract drawer. All drawers extends this class.
 */
/**
 * @abstract
 */
var /**
 * @abstract
 */
BasicDrawerService = /** @class */ (function () {
    function BasicDrawerService() {
    }
    /**
     * @param {?} assigner
     * @return {?}
     */
    BasicDrawerService.prototype.setPropsAssigner = /**
     * @param {?} assigner
     * @return {?}
     */
    function (assigner) {
        this._propsAssigner = assigner;
    };
    return BasicDrawerService;
}());
/**
 * @abstract
 */
export { BasicDrawerService };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    BasicDrawerService.prototype._propsAssigner;
    /**
     * @abstract
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    BasicDrawerService.prototype.add = function (cesiumProps, args) { };
    /**
     * @abstract
     * @param {?} primitive
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    BasicDrawerService.prototype.update = function (primitive, cesiumProps, args) { };
    /**
     * @abstract
     * @param {?} primitive
     * @return {?}
     */
    BasicDrawerService.prototype.remove = function (primitive) { };
    /**
     * @abstract
     * @return {?}
     */
    BasicDrawerService.prototype.removeAll = function () { };
    /**
     * @abstract
     * @param {?} showValue
     * @return {?}
     */
    BasicDrawerService.prototype.setShow = function (showValue) { };
    /**
     * @abstract
     * @param {?=} options
     * @return {?}
     */
    BasicDrawerService.prototype.init = function (options) { };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUE7Ozs7SUFHRTtJQUNBLENBQUM7Ozs7O0lBY0QsNkNBQWdCOzs7O0lBQWhCLFVBQWlCLFFBQWtCO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkM7Ozs7Ozs7Ozs7SUFwQkMsNENBQW1DOzs7Ozs7O0lBS25DLG9FQUFvRDs7Ozs7Ozs7SUFFcEQsa0ZBQXdFOzs7Ozs7SUFFeEUsK0RBQXNDOzs7OztJQUV0Qyx5REFBMkI7Ozs7OztJQUUzQixnRUFBMkM7Ozs7OztJQUUzQywyREFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICBBYnN0cmFjdCBkcmF3ZXIuIEFsbCBkcmF3ZXJzIGV4dGVuZHMgdGhpcyBjbGFzcy5cbiAqL1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIF9wcm9wc0Fzc2lnbmVyOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGFic3RyYWN0IGFkZChjZXNpdW1Qcm9wczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueTtcblxuICBhYnN0cmFjdCB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGNlc2l1bVByb3BzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogdm9pZDtcblxuICBhYnN0cmFjdCByZW1vdmUocHJpbWl0aXZlOiBhbnkpOiB2b2lkO1xuXG4gIGFic3RyYWN0IHJlbW92ZUFsbCgpOiB2b2lkO1xuXG4gIGFic3RyYWN0IHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKTogdm9pZDtcblxuICBhYnN0cmFjdCBpbml0KG9wdGlvbnM/OiBhbnkpOiBhbnk7XG5cbiAgc2V0UHJvcHNBc3NpZ25lcihhc3NpZ25lcjogRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9wcm9wc0Fzc2lnbmVyID0gYXNzaWduZXI7XG4gIH1cbn1cbiJdfQ==