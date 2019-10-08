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
export class BasicDrawerService {
    constructor() {
    }
    /**
     * @param {?} assigner
     * @return {?}
     */
    setPropsAssigner(assigner) {
        this._propsAssigner = assigner;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsTUFBTSxPQUFnQixrQkFBa0I7SUFHdEM7SUFDQSxDQUFDOzs7OztJQWNELGdCQUFnQixDQUFDLFFBQWtCO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjs7Ozs7O0lBcEJDLDRDQUFtQzs7Ozs7OztJQUtuQyxvRUFBb0Q7Ozs7Ozs7O0lBRXBELGtGQUF3RTs7Ozs7O0lBRXhFLCtEQUFzQzs7Ozs7SUFFdEMseURBQTJCOzs7Ozs7SUFFM0IsZ0VBQTJDOzs7Ozs7SUFFM0MsMkRBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAgQWJzdHJhY3QgZHJhd2VyLiBBbGwgZHJhd2VycyBleHRlbmRzIHRoaXMgY2xhc3MuXG4gKi9cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2ljRHJhd2VyU2VydmljZSB7XG4gIHByb3RlY3RlZCBfcHJvcHNBc3NpZ25lcjogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBhYnN0cmFjdCBhZGQoY2VzaXVtUHJvcHM6IGFueSwgLi4uYXJnczogYW55W10pOiBhbnk7XG5cbiAgYWJzdHJhY3QgdXBkYXRlKHByaW1pdGl2ZTogYW55LCBjZXNpdW1Qcm9wczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgcmVtb3ZlKHByaW1pdGl2ZTogYW55KTogdm9pZDtcblxuICBhYnN0cmFjdCByZW1vdmVBbGwoKTogdm9pZDtcblxuICBhYnN0cmFjdCBzZXRTaG93KHNob3dWYWx1ZTogYm9vbGVhbik6IHZvaWQ7XG5cbiAgYWJzdHJhY3QgaW5pdChvcHRpb25zPzogYW55KTogYW55O1xuXG4gIHNldFByb3BzQXNzaWduZXIoYXNzaWduZXI6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lciA9IGFzc2lnbmVyO1xuICB9XG59XG4iXX0=