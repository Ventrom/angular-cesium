/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { JsonMapper } from '../json-mapper/json-mapper.service';
import { Parse } from 'angular2parse';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';
export class CesiumProperties {
    /**
     * @param {?} _parser
     * @param {?} _jsonMapper
     */
    constructor(_parser, _jsonMapper) {
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
    _compile(expression, withCache = true) {
        /** @type {?} */
        const cesiumDesc = {};
        /** @type {?} */
        const propsMap = new Map();
        /** @type {?} */
        const resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((/**
         * @param {?} resultExpression
         * @param {?} prop
         * @return {?}
         */
        (resultExpression, prop) => propsMap.set(prop, {
            expression: resultExpression,
            get: this._parser.eval(resultExpression)
        })));
        propsMap.forEach((/**
         * @param {?} value
         * @param {?} prop
         * @return {?}
         */
        (value, prop) => {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
            }
            else {
                cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
            }
        }));
        /** @type {?} */
        const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
        /** @type {?} */
        const getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return (/**
         * @param {?} cache
         * @param {?} context
         * @return {?}
         */
        function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        });
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    _build(expression) {
        /** @type {?} */
        const props = Array.from(this._jsonMapper.map(expression).keys());
        /** @type {?} */
        const smartAssigner = SmartAssigner.create(props);
        return (/**
         * @param {?} oldVal
         * @param {?} newVal
         * @return {?}
         */
        function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        });
    }
    /**
     * @param {?} expression
     * @param {?=} withCache
     * @param {?=} newEvaluator
     * @return {?}
     */
    createEvaluator(expression, withCache = true, newEvaluator = false) {
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        /** @type {?} */
        const evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    createAssigner(expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        /** @type {?} */
        const assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    }
}
CesiumProperties.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CesiumProperties.ctorParameters = () => [
    { type: Parse },
    { type: JsonMapper }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBSXpFLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7O0lBSTNCLFlBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDOzs7Ozs7SUFFRCxRQUFRLENBQUMsVUFBa0IsRUFBRSxTQUFTLEdBQUcsSUFBSTs7Y0FDckMsVUFBVSxHQUFHLEVBQUU7O2NBQ2YsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFpRDs7Y0FFbkUsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUVsRCxTQUFTLENBQUMsT0FBTzs7Ozs7UUFBQyxDQUFDLGdCQUFnQixFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDL0QsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7U0FDekMsQ0FBQyxFQUFDLENBQUM7UUFFSixRQUFRLENBQUMsT0FBTzs7Ozs7UUFBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLFNBQVMsRUFBRTtnQkFDYixVQUFVLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHLGVBQWUsS0FBSyxDQUFDLFVBQVUsMkJBQTJCLElBQUksa0JBQWtCLENBQUM7YUFDcEg7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQzthQUMxRTtRQUNILENBQUMsRUFBQyxDQUFDOztjQUVHLE1BQU0sR0FBRyxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRzs7Y0FDbEUsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQztRQUVsRTs7Ozs7UUFBTyxTQUFTLG1CQUFtQixDQUFDLEtBQXVCLEVBQUUsT0FBZTtZQUMxRSxPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLFVBQWtCOztjQUNqQixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Y0FDM0QsYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRWpEOzs7OztRQUFPLFNBQVMsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE1BQWM7WUFDOUQsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsRUFBQztJQUNKLENBQUM7Ozs7Ozs7SUFFRCxlQUFlLENBQUMsVUFBa0IsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxLQUFLO1FBQ3hFLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7O2NBRUssV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7OztJQUVELGNBQWMsQ0FBQyxVQUFrQjtRQUMvQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDN0M7O2NBRUssUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOzs7WUFqRUYsVUFBVTs7OztZQUpGLEtBQUs7WUFETCxVQUFVOzs7Ozs7O0lBT2pCLDJDQUF3Rjs7Ozs7SUFDeEYsNENBQW1HOzs7OztJQUV2RixtQ0FBc0I7Ozs7O0lBQ3RCLHVDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25NYXBwZXIgfSBmcm9tICcuLi9qc29uLW1hcHBlci9qc29uLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBhcnNlIH0gZnJvbSAnYW5ndWxhcjJwYXJzZSc7XG5pbXBvcnQgeyBTbWFydEFzc2lnbmVyIH0gZnJvbSAnLi4vc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1Qcm9wZXJ0aWVzIHtcbiAgcHJpdmF0ZSBfYXNzaWduZXJzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xuICBwcml2YXRlIF9ldmFsdWF0b3JzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9qc29uTWFwcGVyOiBKc29uTWFwcGVyKSB7XG4gIH1cblxuICBfY29tcGlsZShleHByZXNzaW9uOiBzdHJpbmcsIHdpdGhDYWNoZSA9IHRydWUpOiAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBjZXNpdW1EZXNjID0ge307XG4gICAgY29uc3QgcHJvcHNNYXAgPSBuZXcgTWFwPHN0cmluZywgeyBleHByZXNzaW9uOiBzdHJpbmcsIGdldDogRnVuY3Rpb24gfT4oKTtcblxuICAgIGNvbnN0IHJlc3VsdE1hcCA9IHRoaXMuX2pzb25NYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuXG4gICAgcmVzdWx0TWFwLmZvckVhY2goKHJlc3VsdEV4cHJlc3Npb24sIHByb3ApID0+IHByb3BzTWFwLnNldChwcm9wLCB7XG4gICAgICBleHByZXNzaW9uOiByZXN1bHRFeHByZXNzaW9uLFxuICAgICAgZ2V0OiB0aGlzLl9wYXJzZXIuZXZhbChyZXN1bHRFeHByZXNzaW9uKVxuICAgIH0pKTtcblxuICAgIHByb3BzTWFwLmZvckVhY2goKHZhbHVlLCBwcm9wKSA9PiB7XG4gICAgICBpZiAod2l0aENhY2hlKSB7XG4gICAgICAgIGNlc2l1bURlc2NbcHJvcCB8fCAndW5kZWZpbmVkJ10gPSBgY2FjaGUuZ2V0KFxcYCR7dmFsdWUuZXhwcmVzc2lvbn1cXGAsICgpID0+IHByb3BzTWFwLmdldCgnJHtwcm9wfScpLmdldChjb250ZXh0KSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2VzaXVtRGVzY1twcm9wIHx8ICd1bmRlZmluZWQnXSA9IGBwcm9wc01hcC5nZXQoJyR7cHJvcH0nKS5nZXQoY29udGV4dClgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZm5Cb2R5ID0gYHJldHVybiAke0pTT04uc3RyaW5naWZ5KGNlc2l1bURlc2MpLnJlcGxhY2UoL1wiL2csICcnKX07YDtcbiAgICBjb25zdCBnZXRGbiA9IG5ldyBGdW5jdGlvbigncHJvcHNNYXAnLCAnY2FjaGUnLCAnY29udGV4dCcsIGZuQm9keSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZXZhbHVhdGVDZXNpdW1Qcm9wcyhjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KTogT2JqZWN0IHtcbiAgICAgIHJldHVybiBnZXRGbihwcm9wc01hcCwgY2FjaGUsIGNvbnRleHQpO1xuICAgIH07XG4gIH1cblxuICBfYnVpbGQoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBwcm9wcyA9IEFycmF5LmZyb20odGhpcy5fanNvbk1hcHBlci5tYXAoZXhwcmVzc2lvbikua2V5cygpKTtcbiAgICBjb25zdCBzbWFydEFzc2lnbmVyID0gU21hcnRBc3NpZ25lci5jcmVhdGUocHJvcHMpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFzc2lnbkNlc2l1bVByb3BzKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkge1xuICAgICAgcmV0dXJuIHNtYXJ0QXNzaWduZXIob2xkVmFsLCBuZXdWYWwpO1xuICAgIH07XG4gIH1cblxuICBjcmVhdGVFdmFsdWF0b3IoZXhwcmVzc2lvbjogc3RyaW5nLCB3aXRoQ2FjaGUgPSB0cnVlLCBuZXdFdmFsdWF0b3IgPSBmYWxzZSk6IChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGlmICghbmV3RXZhbHVhdG9yICYmIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2YWx1YXRvckZuID0gdGhpcy5fY29tcGlsZShleHByZXNzaW9uLCB3aXRoQ2FjaGUpO1xuICAgIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5zZXQoZXhwcmVzc2lvbiwgZXZhbHVhdG9yRm4pO1xuXG4gICAgcmV0dXJuIGV2YWx1YXRvckZuO1xuICB9XG5cbiAgY3JlYXRlQXNzaWduZXIoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBpZiAodGhpcy5fYXNzaWduZXJzQ2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXNzaWduZXJzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2lnbkZuID0gdGhpcy5fYnVpbGQoZXhwcmVzc2lvbik7XG4gICAgdGhpcy5fYXNzaWduZXJzQ2FjaGUuc2V0KGV4cHJlc3Npb24sIGFzc2lnbkZuKTtcblxuICAgIHJldHVybiBhc3NpZ25GbjtcbiAgfVxufVxuIl19