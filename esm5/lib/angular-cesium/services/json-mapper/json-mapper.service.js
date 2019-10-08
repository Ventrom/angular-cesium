/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { JsonStringMapper } from 'json-string-mapper';
var JsonMapper = /** @class */ (function () {
    function JsonMapper() {
        this._mapper = new JsonStringMapper();
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    JsonMapper.prototype.map = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        return this._mapper.map(expression);
    };
    JsonMapper.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    JsonMapper.ctorParameters = function () { return []; };
    return JsonMapper;
}());
export { JsonMapper };
if (false) {
    /**
     * @type {?}
     * @private
     */
    JsonMapper.prototype._mapper;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tYXBwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2pzb24tbWFwcGVyL2pzb24tbWFwcGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFdEQ7SUFJRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUM7Ozs7O0lBRUQsd0JBQUc7Ozs7SUFBSCxVQUFJLFVBQWtCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7Z0JBVkYsVUFBVTs7OztJQVdYLGlCQUFDO0NBQUEsQUFYRCxJQVdDO1NBVlksVUFBVTs7Ozs7O0lBQ3JCLDZCQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TdHJpbmdNYXBwZXIgfSBmcm9tICdqc29uLXN0cmluZy1tYXBwZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvbk1hcHBlciB7XG4gIHByaXZhdGUgX21hcHBlcjogSnNvblN0cmluZ01hcHBlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9tYXBwZXIgPSBuZXcgSnNvblN0cmluZ01hcHBlcigpO1xuICB9XG5cbiAgbWFwKGV4cHJlc3Npb246IHN0cmluZyk6IE1hcDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9tYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuICB9XG59XG4iXX0=