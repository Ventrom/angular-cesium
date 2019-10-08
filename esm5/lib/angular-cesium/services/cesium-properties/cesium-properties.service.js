/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { JsonMapper } from '../json-mapper/json-mapper.service';
import { Parse } from 'angular2parse';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';
var CesiumProperties = /** @class */ (function () {
    function CesiumProperties(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @return {?}
     */
    CesiumProperties.prototype._compile = /**
     * @param {?} expression
     * @param {?=} withCache
     * @return {?}
     */
    function (expression, withCache) {
        var _this = this;
        if (withCache === void 0) { withCache = true; }
        /** @type {?} */
        var cesiumDesc = {};
        /** @type {?} */
        var propsMap = new Map();
        /** @type {?} */
        var resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((/**
         * @param {?} resultExpression
         * @param {?} prop
         * @return {?}
         */
        function (resultExpression, prop) { return propsMap.set(prop, {
            expression: resultExpression,
            get: _this._parser.eval(resultExpression)
        }); }));
        propsMap.forEach((/**
         * @param {?} value
         * @param {?} prop
         * @return {?}
         */
        function (value, prop) {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = "cache.get(`" + value.expression + "`, () => propsMap.get('" + prop + "').get(context))";
            }
            else {
                cesiumDesc[prop || 'undefined'] = "propsMap.get('" + prop + "').get(context)";
            }
        }));
        /** @type {?} */
        var fnBody = "return " + JSON.stringify(cesiumDesc).replace(/"/g, '') + ";";
        /** @type {?} */
        var getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return (/**
         * @param {?} cache
         * @param {?} context
         * @return {?}
         */
        function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        });
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    CesiumProperties.prototype._build = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        /** @type {?} */
        var props = Array.from(this._jsonMapper.map(expression).keys());
        /** @type {?} */
        var smartAssigner = SmartAssigner.create(props);
        return (/**
         * @param {?} oldVal
         * @param {?} newVal
         * @return {?}
         */
        function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        });
    };
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    CesiumProperties.prototype.createEvaluator = /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    function (expression, withCache, newEvaluator) {
        if (withCache === void 0) { withCache = true; }
        if (newEvaluator === void 0) { newEvaluator = false; }
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        /** @type {?} */
        var evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    CesiumProperties.prototype.createAssigner = /**
     * @param {?} expression
     * @return {?}
     */
    function (expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        /** @type {?} */
        var assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    };
    CesiumProperties.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumProperties.ctorParameters = function () { return [
        { type: Parse },
        { type: JsonMapper }
    ]; };
    return CesiumProperties;
}());
export { CesiumProperties };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CesiumProperties.prototype._assignersCache;
    /**
     * @type {?}
     * @private
     */
    CesiumProperties.prototype._evaluatorsCache;
    /**
     * @type {?}
     * @private
     */
    CesiumProperties.prototype._parser;
    /**
     * @type {?}
     * @private
     */
    CesiumProperties.prototype._jsonMapper;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBR3pFO0lBS0UsMEJBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDOzs7Ozs7SUFFRCxtQ0FBUTs7Ozs7SUFBUixVQUFTLFVBQWtCLEVBQUUsU0FBZ0I7UUFBN0MsaUJBeUJDO1FBekI0QiwwQkFBQSxFQUFBLGdCQUFnQjs7WUFDckMsVUFBVSxHQUFHLEVBQUU7O1lBQ2YsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFpRDs7WUFFbkUsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUVsRCxTQUFTLENBQUMsT0FBTzs7Ozs7UUFBQyxVQUFDLGdCQUFnQixFQUFFLElBQUksSUFBSyxPQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsR0FBRyxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pDLENBQUMsRUFINEMsQ0FHNUMsRUFBQyxDQUFDO1FBRUosUUFBUSxDQUFDLE9BQU87Ozs7O1FBQUMsVUFBQyxLQUFLLEVBQUUsSUFBSTtZQUMzQixJQUFJLFNBQVMsRUFBRTtnQkFDYixVQUFVLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHLGdCQUFlLEtBQUssQ0FBQyxVQUFVLCtCQUEyQixJQUFJLHFCQUFrQixDQUFDO2FBQ3BIO2lCQUFNO2dCQUNMLFVBQVUsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLEdBQUcsbUJBQWlCLElBQUksb0JBQWlCLENBQUM7YUFDMUU7UUFDSCxDQUFDLEVBQUMsQ0FBQzs7WUFFRyxNQUFNLEdBQUcsWUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQUc7O1lBQ2xFLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUM7UUFFbEU7Ozs7O1FBQU8sU0FBUyxtQkFBbUIsQ0FBQyxLQUF1QixFQUFFLE9BQWU7WUFDMUUsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxDQUFDLEVBQUM7SUFDSixDQUFDOzs7OztJQUVELGlDQUFNOzs7O0lBQU4sVUFBTyxVQUFrQjs7WUFDakIsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O1lBQzNELGFBQWEsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUVqRDs7Ozs7UUFBTyxTQUFTLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxNQUFjO1lBQzlELE9BQU8sYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLEVBQUM7SUFDSixDQUFDOzs7Ozs7O0lBRUQsMENBQWU7Ozs7OztJQUFmLFVBQWdCLFVBQWtCLEVBQUUsU0FBZ0IsRUFBRSxZQUFvQjtRQUF0QywwQkFBQSxFQUFBLGdCQUFnQjtRQUFFLDZCQUFBLEVBQUEsb0JBQW9CO1FBQ3hFLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7O1lBRUssV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7OztJQUVELHlDQUFjOzs7O0lBQWQsVUFBZSxVQUFrQjtRQUMvQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDN0M7O1lBRUssUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOztnQkFqRUYsVUFBVTs7OztnQkFKRixLQUFLO2dCQURMLFVBQVU7O0lBdUVuQix1QkFBQztDQUFBLEFBbEVELElBa0VDO1NBakVZLGdCQUFnQjs7Ozs7O0lBQzNCLDJDQUF3Rjs7Ozs7SUFDeEYsNENBQW1HOzs7OztJQUV2RixtQ0FBc0I7Ozs7O0lBQ3RCLHVDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25NYXBwZXIgfSBmcm9tICcuLi9qc29uLW1hcHBlci9qc29uLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBhcnNlIH0gZnJvbSAnYW5ndWxhcjJwYXJzZSc7XG5pbXBvcnQgeyBTbWFydEFzc2lnbmVyIH0gZnJvbSAnLi4vc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1Qcm9wZXJ0aWVzIHtcbiAgcHJpdmF0ZSBfYXNzaWduZXJzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xuICBwcml2YXRlIF9ldmFsdWF0b3JzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9qc29uTWFwcGVyOiBKc29uTWFwcGVyKSB7XG4gIH1cblxuICBfY29tcGlsZShleHByZXNzaW9uOiBzdHJpbmcsIHdpdGhDYWNoZSA9IHRydWUpOiAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBjZXNpdW1EZXNjID0ge307XG4gICAgY29uc3QgcHJvcHNNYXAgPSBuZXcgTWFwPHN0cmluZywgeyBleHByZXNzaW9uOiBzdHJpbmcsIGdldDogRnVuY3Rpb24gfT4oKTtcblxuICAgIGNvbnN0IHJlc3VsdE1hcCA9IHRoaXMuX2pzb25NYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuXG4gICAgcmVzdWx0TWFwLmZvckVhY2goKHJlc3VsdEV4cHJlc3Npb24sIHByb3ApID0+IHByb3BzTWFwLnNldChwcm9wLCB7XG4gICAgICBleHByZXNzaW9uOiByZXN1bHRFeHByZXNzaW9uLFxuICAgICAgZ2V0OiB0aGlzLl9wYXJzZXIuZXZhbChyZXN1bHRFeHByZXNzaW9uKVxuICAgIH0pKTtcblxuICAgIHByb3BzTWFwLmZvckVhY2goKHZhbHVlLCBwcm9wKSA9PiB7XG4gICAgICBpZiAod2l0aENhY2hlKSB7XG4gICAgICAgIGNlc2l1bURlc2NbcHJvcCB8fCAndW5kZWZpbmVkJ10gPSBgY2FjaGUuZ2V0KFxcYCR7dmFsdWUuZXhwcmVzc2lvbn1cXGAsICgpID0+IHByb3BzTWFwLmdldCgnJHtwcm9wfScpLmdldChjb250ZXh0KSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2VzaXVtRGVzY1twcm9wIHx8ICd1bmRlZmluZWQnXSA9IGBwcm9wc01hcC5nZXQoJyR7cHJvcH0nKS5nZXQoY29udGV4dClgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZm5Cb2R5ID0gYHJldHVybiAke0pTT04uc3RyaW5naWZ5KGNlc2l1bURlc2MpLnJlcGxhY2UoL1wiL2csICcnKX07YDtcbiAgICBjb25zdCBnZXRGbiA9IG5ldyBGdW5jdGlvbigncHJvcHNNYXAnLCAnY2FjaGUnLCAnY29udGV4dCcsIGZuQm9keSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZXZhbHVhdGVDZXNpdW1Qcm9wcyhjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KTogT2JqZWN0IHtcbiAgICAgIHJldHVybiBnZXRGbihwcm9wc01hcCwgY2FjaGUsIGNvbnRleHQpO1xuICAgIH07XG4gIH1cblxuICBfYnVpbGQoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBwcm9wcyA9IEFycmF5LmZyb20odGhpcy5fanNvbk1hcHBlci5tYXAoZXhwcmVzc2lvbikua2V5cygpKTtcbiAgICBjb25zdCBzbWFydEFzc2lnbmVyID0gU21hcnRBc3NpZ25lci5jcmVhdGUocHJvcHMpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFzc2lnbkNlc2l1bVByb3BzKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkge1xuICAgICAgcmV0dXJuIHNtYXJ0QXNzaWduZXIob2xkVmFsLCBuZXdWYWwpO1xuICAgIH07XG4gIH1cblxuICBjcmVhdGVFdmFsdWF0b3IoZXhwcmVzc2lvbjogc3RyaW5nLCB3aXRoQ2FjaGUgPSB0cnVlLCBuZXdFdmFsdWF0b3IgPSBmYWxzZSk6IChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGlmICghbmV3RXZhbHVhdG9yICYmIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2YWx1YXRvckZuID0gdGhpcy5fY29tcGlsZShleHByZXNzaW9uLCB3aXRoQ2FjaGUpO1xuICAgIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5zZXQoZXhwcmVzc2lvbiwgZXZhbHVhdG9yRm4pO1xuXG4gICAgcmV0dXJuIGV2YWx1YXRvckZuO1xuICB9XG5cbiAgY3JlYXRlQXNzaWduZXIoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBpZiAodGhpcy5fYXNzaWduZXJzQ2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXNzaWduZXJzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2lnbkZuID0gdGhpcy5fYnVpbGQoZXhwcmVzc2lvbik7XG4gICAgdGhpcy5fYXNzaWduZXJzQ2FjaGUuc2V0KGV4cHJlc3Npb24sIGFzc2lnbkZuKTtcblxuICAgIHJldHVybiBhc3NpZ25GbjtcbiAgfVxufVxuIl19