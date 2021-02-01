import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
var ComputationCache = /** @class */ (function () {
    function ComputationCache() {
        this._cache = new Map();
    }
    ComputationCache.prototype.get = function (expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        var value = insertFn();
        this._cache.set(expression, value);
        return value;
    };
    ComputationCache.prototype.clear = function () {
        this._cache.clear();
    };
    ComputationCache = __decorate([
        Injectable()
    ], ComputationCache);
    return ComputationCache;
}());
export { ComputationCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7SUFBQTtRQUNVLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0lBZTFDLENBQUM7SUFiQyw4QkFBRyxHQUFILFVBQUksVUFBa0IsRUFBRSxRQUFxQjtRQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFFRCxJQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsZ0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQWZVLGdCQUFnQjtRQUQ1QixVQUFVLEVBQUU7T0FDQSxnQkFBZ0IsQ0FnQjVCO0lBQUQsdUJBQUM7Q0FBQSxBQWhCRCxJQWdCQztTQWhCWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21wdXRhdGlvbkNhY2hlIHtcbiAgcHJpdmF0ZSBfY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuXG4gIGdldChleHByZXNzaW9uOiBzdHJpbmcsIGluc2VydEZuOiAoKCkgPT4gYW55KSk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlLmhhcyhleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldChleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IGluc2VydEZuKCk7XG4gICAgdGhpcy5fY2FjaGUuc2V0KGV4cHJlc3Npb24sIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICB9XG59XG4iXX0=