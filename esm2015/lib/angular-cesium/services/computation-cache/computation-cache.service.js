/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class ComputationCache {
    constructor() {
        this._cache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?} insertFn
     * @return {?}
     */
    get(expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        /** @type {?} */
        const value = insertFn();
        this._cache.set(expression, value);
        return value;
    }
    /**
     * @return {?}
     */
    clear() {
        this._cache.clear();
    }
}
ComputationCache.decorators = [
    { type: Injectable }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    ComputationCache.prototype._cache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLGdCQUFnQjtJQUQ3QjtRQUVVLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0lBZTFDLENBQUM7Ozs7OztJQWJDLEdBQUcsQ0FBQyxVQUFrQixFQUFFLFFBQXFCO1FBQzNDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQzs7Y0FFSyxLQUFLLEdBQUcsUUFBUSxFQUFFO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7WUFoQkYsVUFBVTs7Ozs7OztJQUVULGtDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbXB1dGF0aW9uQ2FjaGUge1xuICBwcml2YXRlIF9jYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG5cbiAgZ2V0KGV4cHJlc3Npb246IHN0cmluZywgaW5zZXJ0Rm46ICgoKSA9PiBhbnkpKTogYW55IHtcbiAgICBpZiAodGhpcy5fY2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gaW5zZXJ0Rm4oKTtcbiAgICB0aGlzLl9jYWNoZS5zZXQoZXhwcmVzc2lvbiwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2NhY2hlLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==