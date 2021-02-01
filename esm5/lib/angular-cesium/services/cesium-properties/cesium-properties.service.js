import { __decorate, __metadata } from "tslib";
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
    CesiumProperties.prototype._compile = function (expression, withCache) {
        var _this = this;
        if (withCache === void 0) { withCache = true; }
        var cesiumDesc = {};
        var propsMap = new Map();
        var resultMap = this._jsonMapper.map(expression);
        resultMap.forEach(function (resultExpression, prop) { return propsMap.set(prop, {
            expression: resultExpression,
            get: _this._parser.eval(resultExpression)
        }); });
        propsMap.forEach(function (value, prop) {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = "cache.get(`" + value.expression + "`, () => propsMap.get('" + prop + "').get(context))";
            }
            else {
                cesiumDesc[prop || 'undefined'] = "propsMap.get('" + prop + "').get(context)";
            }
        });
        var fnBody = "return " + JSON.stringify(cesiumDesc).replace(/"/g, '') + ";";
        var getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        };
    };
    CesiumProperties.prototype._build = function (expression) {
        var props = Array.from(this._jsonMapper.map(expression).keys());
        var smartAssigner = SmartAssigner.create(props);
        return function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        };
    };
    CesiumProperties.prototype.createEvaluator = function (expression, withCache, newEvaluator) {
        if (withCache === void 0) { withCache = true; }
        if (newEvaluator === void 0) { newEvaluator = false; }
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        var evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    };
    CesiumProperties.prototype.createAssigner = function (expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        var assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    };
    CesiumProperties.ctorParameters = function () { return [
        { type: Parse },
        { type: JsonMapper }
    ]; };
    CesiumProperties = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Parse,
            JsonMapper])
    ], CesiumProperties);
    return CesiumProperties;
}());
export { CesiumProperties };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBSXpFO0lBSUUsMEJBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDO0lBRUQsbUNBQVEsR0FBUixVQUFTLFVBQWtCLEVBQUUsU0FBZ0I7UUFBN0MsaUJBeUJDO1FBekI0QiwwQkFBQSxFQUFBLGdCQUFnQjtRQUMzQyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWlELENBQUM7UUFFMUUsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFbkQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGdCQUFnQixFQUFFLElBQUksSUFBSyxPQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsR0FBRyxFQUFFLEtBQUksQ0FBQyxPQUFPLENB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Z3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKc29uTWFwcGVyIH0gZnJvbSAnLi4vanNvbi1tYXBwZXIvanNvbi1tYXBwZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQYXJzZSB9IGZyb20gJ2FuZ3VsYXIycGFyc2UnO1xuaW1wb3J0IHsgU21hcnRBc3NpZ25lciB9IGZyb20gJy4uL3NtYXJ0LWFzc2lnbmVyL3NtYXJ0LWFzc2lnbmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2VzaXVtUHJvcGVydGllcyB7XG4gIHByaXZhdGUgX2Fzc2lnbmVyc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIChvbGRWYWw6IE9iamVjdCwgbmV3VmFsOiBPYmplY3QpID0+IE9iamVjdD4oKTtcbiAgcHJpdmF0ZSBfZXZhbHVhdG9yc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Q+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcGFyc2VyOiBQYXJzZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfanNvbk1hcHBlcjogSnNvbk1hcHBlcikge1xuICB9XG5cbiAgX2NvbXBpbGUoZXhwcmVzc2lvbjogc3RyaW5nLCB3aXRoQ2FjaGUgPSB0cnVlKTogKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgY29uc3QgY2VzaXVtRGVzYyA9IHt9O1xuICAgIGNvbnN0IHByb3BzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHsgZXhwcmVzc2lvbjogc3RyaW5nLCBnZXQ6IEZ1bmN0aW9uIH0+KCk7XG5cbiAgICBjb25zdCByZXN1bHRNYXAgPSB0aGlzLl9qc29uTWFwcGVyLm1hcChleHByZXNzaW9uKTtcblxuICAgIHJlc3VsdE1hcC5mb3JFYWNoKChyZXN1bHRFeHByZXNzaW9uLCBwcm9wKSA9PiBwcm9wc01hcC5zZXQocHJvcCwge1xuICAgICAgZXhwcmVzc2lvbjogcmVzdWx0RXhwcmVzc2lvbixcbiAgICAgIGdldDogdGhpcy5fcGFyc2VyLmV2YWwocmVzdWx0RXhwcmVzc2lvbilcbiAgICB9KSk7XG5cbiAgICBwcm9wc01hcC5mb3JFYWNoKCh2YWx1ZSwgcHJvcCkgPT4ge1xuICAgICAgaWYgKHdpdGhDYWNoZSkge1xuICAgICAgICBjZXNpdW1EZXNjW3Byb3AgfHwgJ3VuZGVmaW5lZCddID0gYGNhY2hlLmdldChcXGAke3ZhbHVlLmV4cHJlc3Npb259XFxgLCAoKSA9PiBwcm9wc01hcC5nZXQoJyR7cHJvcH0nKS5nZXQoY29udGV4dCkpYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNlc2l1bURlc2NbcHJvcCB8fCAndW5kZWZpbmVkJ10gPSBgcHJvcHNNYXAuZ2V0KCcke3Byb3B9JykuZ2V0KGNvbnRleHQpYDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGZuQm9keSA9IGByZXR1cm4gJHtKU09OLnN0cmluZ2lmeShjZXNpdW1EZXNjKS5yZXBsYWNlKC9cIi9nLCAnJyl9O2A7XG4gICAgY29uc3QgZ2V0Rm4gPSBuZXcgRnVuY3Rpb24oJ3Byb3BzTWFwJywgJ2NhY2hlJywgJ2NvbnRleHQnLCBmbkJvZHkpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGV2YWx1YXRlQ2VzaXVtUHJvcHMoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCk6IE9iamVjdCB7XG4gICAgICByZXR1cm4gZ2V0Rm4ocHJvcHNNYXAsIGNhY2hlLCBjb250ZXh0KTtcbiAgICB9O1xuICB9XG5cbiAgX2J1aWxkKGV4cHJlc3Npb246IHN0cmluZyk6IChvbGRWYWw6IE9iamVjdCwgbmV3VmFsOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgY29uc3QgcHJvcHMgPSBBcnJheS5mcm9tKHRoaXMuX2pzb25NYXBwZXIubWFwKGV4cHJlc3Npb24pLmtleXMoKSk7XG4gICAgY29uc3Qgc21hcnRBc3NpZ25lciA9IFNtYXJ0QXNzaWduZXIuY3JlYXRlKHByb3BzKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBhc3NpZ25DZXNpdW1Qcm9wcyhvbGRWYWw6IE9iamVjdCwgbmV3VmFsOiBPYmplY3QpIHtcbiAgICAgIHJldHVybiBzbWFydEFzc2lnbmVyKG9sZFZhbCwgbmV3VmFsKTtcbiAgICB9O1xuICB9XG5cbiAgY3JlYXRlRXZhbHVhdG9yKGV4cHJlc3Npb246IHN0cmluZywgd2l0aENhY2hlID0gdHJ1ZSwgbmV3RXZhbHVhdG9yID0gZmFsc2UpOiAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBpZiAoIW5ld0V2YWx1YXRvciAmJiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXZhbHVhdG9yc0NhY2hlLmdldChleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmFsdWF0b3JGbiA9IHRoaXMuX2NvbXBpbGUoZXhwcmVzc2lvbiwgd2l0aENhY2hlKTtcbiAgICB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuc2V0KGV4cHJlc3Npb24sIGV2YWx1YXRvckZuKTtcblxuICAgIHJldHVybiBldmFsdWF0b3JGbjtcbiAgfVxuXG4gIGNyZWF0ZUFzc2lnbmVyKGV4cHJlc3Npb246IHN0cmluZyk6IChvbGRWYWw6IE9iamVjdCwgbmV3VmFsOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgaWYgKHRoaXMuX2Fzc2lnbmVyc0NhY2hlLmhhcyhleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Fzc2lnbmVyc0NhY2hlLmdldChleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBhc3NpZ25GbiA9IHRoaXMuX2J1aWxkKGV4cHJlc3Npb24pO1xuICAgIHRoaXMuX2Fzc2lnbmVyc0NhY2hlLnNldChleHByZXNzaW9uLCBhc3NpZ25Gbik7XG5cbiAgICByZXR1cm4gYXNzaWduRm47XG4gIH1cbn1cbiJdfQ==