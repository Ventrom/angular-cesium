/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
var ComputationCache = /** @class */ (function () {
    function ComputationCache() {
        this._cache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    ComputationCache.prototype.get = /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    function (expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        /** @type {?} */
        var value = insertFn();
        this._cache.set(expression, value);
        return value;
    };
    /**
     * @return {?}
     */
    ComputationCache.prototype.clear = /**
     * @return {?}
     */
    function () {
        this._cache.clear();
    };
    ComputationCache.decorators = [
        { type: Injectable }
    ];
    return ComputationCache;
}());
export { ComputationCache };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ComputationCache.prototype._cache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7SUFBQTtRQUVVLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0lBZTFDLENBQUM7Ozs7OztJQWJDLDhCQUFHOzs7OztJQUFILFVBQUksVUFBa0IsRUFBRSxRQUFxQjtRQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7O1lBRUssS0FBSyxHQUFHLFFBQVEsRUFBRTtRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7O0lBRUQsZ0NBQUs7OztJQUFMO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDOztnQkFoQkYsVUFBVTs7SUFpQlgsdUJBQUM7Q0FBQSxBQWpCRCxJQWlCQztTQWhCWSxnQkFBZ0I7Ozs7OztJQUMzQixrQ0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21wdXRhdGlvbkNhY2hlIHtcbiAgcHJpdmF0ZSBfY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuXG4gIGdldChleHByZXNzaW9uOiBzdHJpbmcsIGluc2VydEZuOiAoKCkgPT4gYW55KSk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlLmhhcyhleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldChleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IGluc2VydEZuKCk7XG4gICAgdGhpcy5fY2FjaGUuc2V0KGV4cHJlc3Npb24sIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICB9XG59XG4iXX0=