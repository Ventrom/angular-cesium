export declare class ComputationCache {
    private _cache;
    get(expression: string, insertFn: (() => any)): any;
    clear(): void;
}
