import { Injectable } from '@angular/core';
import { SmartAssigner } from '../smart-assigner/smart-assigner.service';
import * as i0 from "@angular/core";
import * as i1 from "angular2parse";
import * as i2 from "../json-mapper/json-mapper.service";
export class CesiumProperties {
    constructor(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    _compile(expression, withCache = true) {
        const cesiumDesc = {};
        const propsMap = new Map();
        const resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((resultExpression, prop) => propsMap.set(prop, {
            expression: resultExpression,
            get: this._parser.eval(resultExpression)
        }));
        propsMap.forEach((value, prop) => {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
            }
            else {
                cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
            }
        });
        const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
        const getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        };
    }
    _build(expression) {
        const props = Array.from(this._jsonMapper.map(expression).keys());
        const smartAssigner = SmartAssigner.create(props);
        return function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        };
    }
    createEvaluator(expression, withCache = true, newEvaluator = false) {
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        const evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    }
    createAssigner(expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        const assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    }
}
CesiumProperties.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumProperties, deps: [{ token: i1.Parse }, { token: i2.JsonMapper }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumProperties.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumProperties });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumProperties, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Parse }, { type: i2.JsonMapper }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7OztBQUl6RSxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCLFlBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQWtCLEVBQUUsU0FBUyxHQUFHLElBQUk7UUFDM0MsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFpRCxDQUFDO1FBRTFFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRW5ELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUosUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLFNBQVMsRUFBRTtnQkFDYixVQUFVLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHLGVBQWUsS0FBSyxDQUFDLFVBQVUsMkJBQTJCLElBQUksa0JBQWtCLENBQUM7YUFDcEg7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQzthQUMxRTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUN6RSxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRSxPQUFPLFNBQVMsbUJBQW1CLENBQUMsS0FBdUIsRUFBRSxPQUFlO1lBQzFFLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFrQjtRQUN2QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbEUsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxPQUFPLFNBQVMsaUJBQWlCLENBQUMsTUFBYyxFQUFFLE1BQWM7WUFDOUQsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxlQUFlLENBQUMsVUFBa0IsRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxLQUFLO1FBQ3hFLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsY0FBYyxDQUFDLFVBQWtCO1FBQy9CLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDeEMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7OzhHQWhFVSxnQkFBZ0I7a0hBQWhCLGdCQUFnQjs0RkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSnNvbk1hcHBlciB9IGZyb20gJy4uL2pzb24tbWFwcGVyL2pzb24tbWFwcGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFyc2UgfSBmcm9tICdhbmd1bGFyMnBhcnNlJztcbmltcG9ydCB7IFNtYXJ0QXNzaWduZXIgfSBmcm9tICcuLi9zbWFydC1hc3NpZ25lci9zbWFydC1hc3NpZ25lci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bVByb3BlcnRpZXMge1xuICBwcml2YXRlIF9hc3NpZ25lcnNDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCAob2xkVmFsOiBPYmplY3QsIG5ld1ZhbDogT2JqZWN0KSA9PiBPYmplY3Q+KCk7XG4gIHByaXZhdGUgX2V2YWx1YXRvcnNDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhcnNlcjogUGFyc2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2pzb25NYXBwZXI6IEpzb25NYXBwZXIpIHtcbiAgfVxuXG4gIF9jb21waWxlKGV4cHJlc3Npb246IHN0cmluZywgd2l0aENhY2hlID0gdHJ1ZSk6IChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGNvbnN0IGNlc2l1bURlc2MgPSB7fTtcbiAgICBjb25zdCBwcm9wc01hcCA9IG5ldyBNYXA8c3RyaW5nLCB7IGV4cHJlc3Npb246IHN0cmluZywgZ2V0OiBGdW5jdGlvbiB9PigpO1xuXG4gICAgY29uc3QgcmVzdWx0TWFwID0gdGhpcy5fanNvbk1hcHBlci5tYXAoZXhwcmVzc2lvbik7XG5cbiAgICByZXN1bHRNYXAuZm9yRWFjaCgocmVzdWx0RXhwcmVzc2lvbiwgcHJvcCkgPT4gcHJvcHNNYXAuc2V0KHByb3AsIHtcbiAgICAgIGV4cHJlc3Npb246IHJlc3VsdEV4cHJlc3Npb24sXG4gICAgICBnZXQ6IHRoaXMuX3BhcnNlci5ldmFsKHJlc3VsdEV4cHJlc3Npb24pXG4gICAgfSkpO1xuXG4gICAgcHJvcHNNYXAuZm9yRWFjaCgodmFsdWUsIHByb3ApID0+IHtcbiAgICAgIGlmICh3aXRoQ2FjaGUpIHtcbiAgICAgICAgY2VzaXVtRGVzY1twcm9wIHx8ICd1bmRlZmluZWQnXSA9IGBjYWNoZS5nZXQoXFxgJHt2YWx1ZS5leHByZXNzaW9ufVxcYCwgKCkgPT4gcHJvcHNNYXAuZ2V0KCcke3Byb3B9JykuZ2V0KGNvbnRleHQpKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjZXNpdW1EZXNjW3Byb3AgfHwgJ3VuZGVmaW5lZCddID0gYHByb3BzTWFwLmdldCgnJHtwcm9wfScpLmdldChjb250ZXh0KWA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBmbkJvZHkgPSBgcmV0dXJuICR7SlNPTi5zdHJpbmdpZnkoY2VzaXVtRGVzYykucmVwbGFjZSgvXCIvZywgJycpfTtgO1xuICAgIGNvbnN0IGdldEZuID0gbmV3IEZ1bmN0aW9uKCdwcm9wc01hcCcsICdjYWNoZScsICdjb250ZXh0JywgZm5Cb2R5KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBldmFsdWF0ZUNlc2l1bVByb3BzKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpOiBPYmplY3Qge1xuICAgICAgcmV0dXJuIGdldEZuKHByb3BzTWFwLCBjYWNoZSwgY29udGV4dCk7XG4gICAgfTtcbiAgfVxuXG4gIF9idWlsZChleHByZXNzaW9uOiBzdHJpbmcpOiAob2xkVmFsOiBPYmplY3QsIG5ld1ZhbDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGNvbnN0IHByb3BzID0gQXJyYXkuZnJvbSh0aGlzLl9qc29uTWFwcGVyLm1hcChleHByZXNzaW9uKS5rZXlzKCkpO1xuICAgIGNvbnN0IHNtYXJ0QXNzaWduZXIgPSBTbWFydEFzc2lnbmVyLmNyZWF0ZShwcm9wcyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gYXNzaWduQ2VzaXVtUHJvcHMob2xkVmFsOiBPYmplY3QsIG5ld1ZhbDogT2JqZWN0KSB7XG4gICAgICByZXR1cm4gc21hcnRBc3NpZ25lcihvbGRWYWwsIG5ld1ZhbCk7XG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUV2YWx1YXRvcihleHByZXNzaW9uOiBzdHJpbmcsIHdpdGhDYWNoZSA9IHRydWUsIG5ld0V2YWx1YXRvciA9IGZhbHNlKTogKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgaWYgKCFuZXdFdmFsdWF0b3IgJiYgdGhpcy5fZXZhbHVhdG9yc0NhY2hlLmhhcyhleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5nZXQoZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgY29uc3QgZXZhbHVhdG9yRm4gPSB0aGlzLl9jb21waWxlKGV4cHJlc3Npb24sIHdpdGhDYWNoZSk7XG4gICAgdGhpcy5fZXZhbHVhdG9yc0NhY2hlLnNldChleHByZXNzaW9uLCBldmFsdWF0b3JGbik7XG5cbiAgICByZXR1cm4gZXZhbHVhdG9yRm47XG4gIH1cblxuICBjcmVhdGVBc3NpZ25lcihleHByZXNzaW9uOiBzdHJpbmcpOiAob2xkVmFsOiBPYmplY3QsIG5ld1ZhbDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGlmICh0aGlzLl9hc3NpZ25lcnNDYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hc3NpZ25lcnNDYWNoZS5nZXQoZXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgY29uc3QgYXNzaWduRm4gPSB0aGlzLl9idWlsZChleHByZXNzaW9uKTtcbiAgICB0aGlzLl9hc3NpZ25lcnNDYWNoZS5zZXQoZXhwcmVzc2lvbiwgYXNzaWduRm4pO1xuXG4gICAgcmV0dXJuIGFzc2lnbkZuO1xuICB9XG59XG4iXX0=