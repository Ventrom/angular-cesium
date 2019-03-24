/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class AcHtmlManager {
    constructor() {
        this._entities = new Map();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    has(id) {
        return this._entities.has(id);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    get(id) {
        return this._entities.get(id);
    }
    /**
     * @param {?} id
     * @param {?} info
     * @return {?}
     */
    addOrUpdate(id, info) {
        this._entities.set(id, info);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        this._entities.delete(id);
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    forEach(callback) {
        this._entities.forEach(callback);
    }
}
AcHtmlManager.decorators = [
    { type: Injectable }
];
/** @nocollapse */
AcHtmlManager.ctorParameters = () => [];
if (false) {
    /**
     * @type {?}
     * @private
     */
    AcHtmlManager.prototype._entities;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLGFBQWE7SUFHeEI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFZLENBQUM7SUFDdkMsQ0FBQzs7Ozs7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Ozs7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Ozs7O0lBRUQsV0FBVyxDQUFDLEVBQU8sRUFBRSxJQUFxQztRQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7O0lBRUQsT0FBTyxDQUFDLFFBQWE7UUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7O1lBMUJGLFVBQVU7Ozs7Ozs7OztJQUVULGtDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFjSHRtbE1hbmFnZXIge1xuICBwcml2YXRlIF9lbnRpdGllczogTWFwPGFueSwgYW55PjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9lbnRpdGllcyA9IG5ldyBNYXA8YW55LCBhbnk+KCk7XG4gIH1cblxuICBoYXMoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5oYXMoaWQpO1xuICB9XG5cbiAgZ2V0KGlkOiBzdHJpbmcpOiB7IGVudGl0eTogYW55LCBwcmltaXRpdmU6IGFueSB9IHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKTtcbiAgfVxuXG4gIGFkZE9yVXBkYXRlKGlkOiBhbnksIGluZm86IHsgZW50aXR5OiBhbnksIHByaW1pdGl2ZTogYW55IH0pIHtcbiAgICB0aGlzLl9lbnRpdGllcy5zZXQoaWQsIGluZm8pO1xuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9lbnRpdGllcy5kZWxldGUoaWQpO1xuICB9XG5cbiAgZm9yRWFjaChjYWxsYmFjazogYW55KSB7XG4gICAgdGhpcy5fZW50aXRpZXMuZm9yRWFjaChjYWxsYmFjayk7XG4gIH1cbn1cbiJdfQ==