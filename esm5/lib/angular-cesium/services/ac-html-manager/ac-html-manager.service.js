/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var AcHtmlManager = /** @class */ (function () {
    function AcHtmlManager() {
        this._entities = new Map();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.has = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this._entities.has(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this._entities.get(id);
    };
    /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    AcHtmlManager.prototype.addOrUpdate = /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    function (id, info) {
        this._entities.set(id, info);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlManager.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this._entities.delete(id);
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    AcHtmlManager.prototype.forEach = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) {
        this._entities.forEach(callback);
    };
    AcHtmlManager.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    AcHtmlManager.ctorParameters = function () { return []; };
    return AcHtmlManager;
}());
export { AcHtmlManager };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AcHtmlManager.prototype._entities;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7SUFJRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVksQ0FBQztJQUN2QyxDQUFDOzs7OztJQUVELDJCQUFHOzs7O0lBQUgsVUFBSSxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDOzs7OztJQUVELDJCQUFHOzs7O0lBQUgsVUFBSSxFQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDOzs7Ozs7SUFFRCxtQ0FBVzs7Ozs7SUFBWCxVQUFZLEVBQU8sRUFBRSxJQUFxQztRQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFRCw4QkFBTTs7OztJQUFOLFVBQU8sRUFBVTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7O0lBRUQsK0JBQU87Ozs7SUFBUCxVQUFRLFFBQWE7UUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7Z0JBMUJGLFVBQVU7Ozs7SUEyQlgsb0JBQUM7Q0FBQSxBQTNCRCxJQTJCQztTQTFCWSxhQUFhOzs7Ozs7SUFDeEIsa0NBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQWNIdG1sTWFuYWdlciB7XG4gIHByaXZhdGUgX2VudGl0aWVzOiBNYXA8YW55LCBhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2VudGl0aWVzID0gbmV3IE1hcDxhbnksIGFueT4oKTtcbiAgfVxuXG4gIGhhcyhpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IHsgZW50aXR5OiBhbnksIHByaW1pdGl2ZTogYW55IH0ge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5nZXQoaWQpO1xuICB9XG5cbiAgYWRkT3JVcGRhdGUoaWQ6IGFueSwgaW5mbzogeyBlbnRpdHk6IGFueSwgcHJpbWl0aXZlOiBhbnkgfSkge1xuICAgIHRoaXMuX2VudGl0aWVzLnNldChpZCwgaW5mbyk7XG4gIH1cblxuICByZW1vdmUoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuX2VudGl0aWVzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBmb3JFYWNoKGNhbGxiYWNrOiBhbnkpIHtcbiAgICB0aGlzLl9lbnRpdGllcy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgfVxufVxuIl19