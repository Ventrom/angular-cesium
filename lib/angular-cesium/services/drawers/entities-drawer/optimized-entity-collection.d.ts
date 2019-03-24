export declare class OptimizedEntityCollection {
    private entityCollection;
    private _updateRate;
    private _collectionSize;
    private _isSuspended;
    private _isHardSuspend;
    private _suspensionTimeout;
    private _onEventSuspensionCallback;
    private _onEventResumeCallback;
    constructor(entityCollection: any, collectionSize?: number, updateRate?: number);
    setShow(show: boolean): void;
    readonly isSuspended: boolean;
    updateRate: number;
    collectionSize: number;
    collection(): any;
    isFree(): boolean;
    add(entity: any): any;
    remove(entity: any): any;
    removeNoSuspend(entity: any): void;
    removeAll(): void;
    onEventSuspension(callback: Function, once?: boolean): Function;
    onEventResume(callback: Function, once?: boolean): Function;
    triggerEventSuspension(): void;
    triggerEventResume(): void;
    suspend(): void;
    hardSuspend(): void;
    hardResume(): void;
}
