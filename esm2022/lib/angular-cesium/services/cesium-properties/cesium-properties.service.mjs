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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumProperties, deps: [{ token: i1.Parse }, { token: i2.JsonMapper }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumProperties }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CesiumProperties, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.Parse }, { type: i2.JsonMapper }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQzs7OztBQUl6RSxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCLFlBQW9CLE9BQWMsRUFDZCxXQUF1QjtRQUR2QixZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFKbkMsb0JBQWUsR0FBRyxJQUFJLEdBQUcsRUFBc0QsQ0FBQztRQUNoRixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztJQUluRyxDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQWtCLEVBQUUsU0FBUyxHQUFHLElBQUk7UUFDM0MsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFpRCxDQUFDO1FBRTFFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRW5ELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQy9ELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUosUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMvQixJQUFJLFNBQVMsRUFBRSxDQUFDO2dCQUNkLFVBQVUsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLEdBQUcsZUFBZSxLQUFLLENBQUMsVUFBVSwyQkFBMkIsSUFBSSxrQkFBa0IsQ0FBQztZQUNySCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sVUFBVSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQztZQUMzRSxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxVQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ3pFLE1BQU0sS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRW5FLE9BQU8sU0FBUyxtQkFBbUIsQ0FBQyxLQUF1QixFQUFFLE9BQWU7WUFDMUUsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQWtCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNsRSxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxELE9BQU8sU0FBUyxpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsTUFBYztZQUM5RCxPQUFPLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWUsQ0FBQyxVQUFrQixFQUFFLFNBQVMsR0FBRyxJQUFJLEVBQUUsWUFBWSxHQUFHLEtBQUs7UUFDeEUsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDM0QsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVuRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsY0FBYyxDQUFDLFVBQWtCO1FBQy9CLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUN6QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUvQyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOzhHQWhFVSxnQkFBZ0I7a0hBQWhCLGdCQUFnQjs7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25NYXBwZXIgfSBmcm9tICcuLi9qc29uLW1hcHBlci9qc29uLW1hcHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBhcnNlIH0gZnJvbSAnYW5ndWxhcjJwYXJzZSc7XG5pbXBvcnQgeyBTbWFydEFzc2lnbmVyIH0gZnJvbSAnLi4vc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDZXNpdW1Qcm9wZXJ0aWVzIHtcbiAgcHJpdmF0ZSBfYXNzaWduZXJzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0PigpO1xuICBwcml2YXRlIF9ldmFsdWF0b3JzQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgKGNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0OiBPYmplY3QpID0+IE9iamVjdD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9qc29uTWFwcGVyOiBKc29uTWFwcGVyKSB7XG4gIH1cblxuICBfY29tcGlsZShleHByZXNzaW9uOiBzdHJpbmcsIHdpdGhDYWNoZSA9IHRydWUpOiAoY2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQ6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBjZXNpdW1EZXNjID0ge307XG4gICAgY29uc3QgcHJvcHNNYXAgPSBuZXcgTWFwPHN0cmluZywgeyBleHByZXNzaW9uOiBzdHJpbmcsIGdldDogRnVuY3Rpb24gfT4oKTtcblxuICAgIGNvbnN0IHJlc3VsdE1hcCA9IHRoaXMuX2pzb25NYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuXG4gICAgcmVzdWx0TWFwLmZvckVhY2goKHJlc3VsdEV4cHJlc3Npb24sIHByb3ApID0+IHByb3BzTWFwLnNldChwcm9wLCB7XG4gICAgICBleHByZXNzaW9uOiByZXN1bHRFeHByZXNzaW9uLFxuICAgICAgZ2V0OiB0aGlzLl9wYXJzZXIuZXZhbChyZXN1bHRFeHByZXNzaW9uKVxuICAgIH0pKTtcblxuICAgIHByb3BzTWFwLmZvckVhY2goKHZhbHVlLCBwcm9wKSA9PiB7XG4gICAgICBpZiAod2l0aENhY2hlKSB7XG4gICAgICAgIGNlc2l1bURlc2NbcHJvcCB8fCAndW5kZWZpbmVkJ10gPSBgY2FjaGUuZ2V0KFxcYCR7dmFsdWUuZXhwcmVzc2lvbn1cXGAsICgpID0+IHByb3BzTWFwLmdldCgnJHtwcm9wfScpLmdldChjb250ZXh0KSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2VzaXVtRGVzY1twcm9wIHx8ICd1bmRlZmluZWQnXSA9IGBwcm9wc01hcC5nZXQoJyR7cHJvcH0nKS5nZXQoY29udGV4dClgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZm5Cb2R5ID0gYHJldHVybiAke0pTT04uc3RyaW5naWZ5KGNlc2l1bURlc2MpLnJlcGxhY2UoL1wiL2csICcnKX07YDtcbiAgICBjb25zdCBnZXRGbiA9IG5ldyBGdW5jdGlvbigncHJvcHNNYXAnLCAnY2FjaGUnLCAnY29udGV4dCcsIGZuQm9keSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZXZhbHVhdGVDZXNpdW1Qcm9wcyhjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KTogT2JqZWN0IHtcbiAgICAgIHJldHVybiBnZXRGbihwcm9wc01hcCwgY2FjaGUsIGNvbnRleHQpO1xuICAgIH07XG4gIH1cblxuICBfYnVpbGQoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBjb25zdCBwcm9wcyA9IEFycmF5LmZyb20odGhpcy5fanNvbk1hcHBlci5tYXAoZXhwcmVzc2lvbikua2V5cygpKTtcbiAgICBjb25zdCBzbWFydEFzc2lnbmVyID0gU21hcnRBc3NpZ25lci5jcmVhdGUocHJvcHMpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFzc2lnbkNlc2l1bVByb3BzKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkge1xuICAgICAgcmV0dXJuIHNtYXJ0QXNzaWduZXIob2xkVmFsLCBuZXdWYWwpO1xuICAgIH07XG4gIH1cblxuICBjcmVhdGVFdmFsdWF0b3IoZXhwcmVzc2lvbjogc3RyaW5nLCB3aXRoQ2FjaGUgPSB0cnVlLCBuZXdFdmFsdWF0b3IgPSBmYWxzZSk6IChjYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY29udGV4dDogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGlmICghbmV3RXZhbHVhdG9yICYmIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5oYXMoZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLl9ldmFsdWF0b3JzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGV2YWx1YXRvckZuID0gdGhpcy5fY29tcGlsZShleHByZXNzaW9uLCB3aXRoQ2FjaGUpO1xuICAgIHRoaXMuX2V2YWx1YXRvcnNDYWNoZS5zZXQoZXhwcmVzc2lvbiwgZXZhbHVhdG9yRm4pO1xuXG4gICAgcmV0dXJuIGV2YWx1YXRvckZuO1xuICB9XG5cbiAgY3JlYXRlQXNzaWduZXIoZXhwcmVzc2lvbjogc3RyaW5nKTogKG9sZFZhbDogT2JqZWN0LCBuZXdWYWw6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBpZiAodGhpcy5fYXNzaWduZXJzQ2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYXNzaWduZXJzQ2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2lnbkZuID0gdGhpcy5fYnVpbGQoZXhwcmVzc2lvbik7XG4gICAgdGhpcy5fYXNzaWduZXJzQ2FjaGUuc2V0KGV4cHJlc3Npb24sIGFzc2lnbkZuKTtcblxuICAgIHJldHVybiBhc3NpZ25GbjtcbiAgfVxufVxuIl19