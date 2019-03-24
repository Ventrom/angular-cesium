import { JsonMapper } from '../json-mapper/json-mapper.service';
import { Parse } from 'angular2parse';
import { ComputationCache } from '../computation-cache/computation-cache.service';
export declare class CesiumProperties {
    private _parser;
    private _jsonMapper;
    private _assignersCache;
    private _evaluatorsCache;
    constructor(_parser: Parse, _jsonMapper: JsonMapper);
    _compile(expression: string, withCache?: boolean): (cache: ComputationCache, context: Object) => Object;
    _build(expression: string): (oldVal: Object, newVal: Object) => Object;
    createEvaluator(expression: string, withCache?: boolean, newEvaluator?: boolean): (cache: ComputationCache, context: Object) => Object;
    createAssigner(expression: string): (oldVal: Object, newVal: Object) => Object;
}
