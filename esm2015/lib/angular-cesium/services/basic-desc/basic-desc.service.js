/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Input, Output } from '@angular/core';
/**
 * @record
 */
export function OnDrawParams() { }
if (false) {
    /** @type {?} */
    OnDrawParams.prototype.acEntity;
    /** @type {?} */
    OnDrawParams.prototype.entityId;
    /** @type {?} */
    OnDrawParams.prototype.cesiumEntity;
}
/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc {
    /**
     * @param {?} _drawer
     * @param {?} _layerService
     * @param {?} _computationCache
     * @param {?} _cesiumProperties
     */
    constructor(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    _propsEvaluator(context) {
        return this._propsEvaluateFn(this._computationCache, context);
    }
    /**
     * @protected
     * @return {?}
     */
    _getPropsAssigner() {
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        (cesiumObject, desc) => this._propsAssignerFn(cesiumObject, desc));
    }
    /**
     * @return {?}
     */
    getLayerService() {
        return this._layerService;
    }
    /**
     * @param {?} layerService
     * @return {?}
     */
    setLayerService(layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    /**
     * @return {?}
     */
    getCesiumObjectsMap() {
        return this._cesiumObjectsMap;
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    draw(context, id, entity) {
        /** @type {?} */
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const cesiumObject = this._drawer.add(cesiumProps);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._cesiumObjectsMap.set(id, cesiumObject);
        }
        else {
            /** @type {?} */
            const cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    }
}
BasicDesc.propDecorators = {
    props: [{ type: Input }],
    onDraw: [{ type: Output }],
    onRemove: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    BasicDesc.prototype.props;
    /** @type {?} */
    BasicDesc.prototype.onDraw;
    /** @type {?} */
    BasicDesc.prototype.onRemove;
    /**
     * @type {?}
     * @protected
     */
    BasicDesc.prototype._cesiumObjectsMap;
    /**
     * @type {?}
     * @private
     */
    BasicDesc.prototype._propsEvaluateFn;
    /**
     * @type {?}
     * @private
     */
    BasicDesc.prototype._propsAssignerFn;
    /**
     * @type {?}
     * @protected
     */
    BasicDesc.prototype._drawer;
    /**
     * @type {?}
     * @protected
     */
    BasicDesc.prototype._layerService;
    /**
     * @type {?}
     * @protected
     */
    BasicDesc.prototype._computationCache;
    /**
     * @type {?}
     * @protected
     */
    BasicDesc.prototype._cesiumProperties;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFRL0Usa0NBSUM7OztJQUhDLGdDQUFtQjs7SUFDbkIsZ0NBQWlCOztJQUNqQixvQ0FBa0I7Ozs7OztBQU9wQixNQUFNLE9BQU8sU0FBUzs7Ozs7OztJQWNwQixZQUFzQixPQUEyQixFQUMzQixhQUEyQixFQUMzQixpQkFBbUMsRUFDbkMsaUJBQW1DO1FBSG5DLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQzNCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzNCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVp6RCxXQUFNLEdBQStCLElBQUksWUFBWSxFQUFnQixDQUFDO1FBR3RFLGFBQVEsR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFFOUQsc0JBQWlCLEdBQXFCLElBQUksR0FBRyxFQUFlLENBQUM7SUFRdkUsQ0FBQzs7Ozs7O0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Ozs7O0lBRVMsaUJBQWlCO1FBQ3pCOzs7OztRQUFPLENBQUMsWUFBb0IsRUFBRSxJQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUM7SUFDM0YsQ0FBQzs7OztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxhQUFh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WUFBWSxDQUFDLFFBQVE7Z0JBQy9CLFlBQVksRUFBRSxZQUFZO2dCQUMxQixRQUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDOzs7O0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7O29CQW5HQSxLQUFLO3FCQUdMLE1BQU07dUJBR04sTUFBTTs7OztJQU5QLDBCQUNXOztJQUVYLDJCQUNzRTs7SUFFdEUsNkJBQ3dFOzs7OztJQUV4RSxzQ0FBdUU7Ozs7O0lBQ3ZFLHFDQUFtQzs7Ozs7SUFDbkMscUNBQW1DOzs7OztJQUV2Qiw0QkFBcUM7Ozs7O0lBQ3JDLGtDQUFxQzs7Ozs7SUFDckMsc0NBQTZDOzs7OztJQUM3QyxzQ0FBNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBPbkRyYXdQYXJhbXMge1xuICBhY0VudGl0eTogQWNFbnRpdHk7XG4gIGVudGl0eUlkOiBzdHJpbmc7XG4gIGNlc2l1bUVudGl0eTogYW55O1xufVxuXG4vKipcbiAqICB0aGUgYW5jZXN0b3IgY2xhc3MgZm9yIGNyZWF0aW5nIGNvbXBvbmVudHMuXG4gKiAgZXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRlc2MgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIElEZXNjcmlwdGlvbiB7XG4gIEBJbnB1dCgpXG4gIHByb3BzOiBhbnk7XG5cbiAgQE91dHB1dCgpXG4gIG9uRHJhdzogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcblxuICBAT3V0cHV0KClcbiAgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+ID0gbmV3IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+KCk7XG5cbiAgcHJvdGVjdGVkIF9jZXNpdW1PYmplY3RzTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgcHJpdmF0ZSBfcHJvcHNFdmFsdWF0ZUZuOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfcHJvcHNBc3NpZ25lckZuOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2RyYXdlcjogQmFzaWNEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2xheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wc0V2YWx1YXRlRm4odGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFByb3BzQXNzaWduZXIoKTogKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4oY2VzaXVtT2JqZWN0LCBkZXNjKTtcbiAgfVxuXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9sYXllclNlcnZpY2U7XG4gIH1cblxuICBzZXRMYXllclNlcnZpY2UobGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UpIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UudW5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX2xheWVyU2VydmljZSA9IGxheWVyU2VydmljZTtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUsIHRydWUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucHJvcHMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2FjLWRlc2MgY29tcG9uZW50cyBlcnJvcjogW3Byb3BzXSBpbnB1dCBpcyBtYW5kYXRvcnknKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VzaXVtT2JqZWN0c01hcCgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtT2JqZWN0c01hcDtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogdm9pZCB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSB0aGlzLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcblxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMub25EcmF3LmVtaXQoe1xuICAgICAgICBhY0VudGl0eTogZW50aXR5LFxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcbiAgICAgICAgZW50aXR5SWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICBjZXNpdW1PYmplY3QuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBjZXNpdW1PYmplY3QgZm9yIGxhdGVyIHVzYWdlXG4gICAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLnNldChpZCwgY2VzaXVtT2JqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBlbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2RyYXdlci5zZXRQcm9wc0Fzc2lnbmVyKHRoaXMuX2dldFByb3BzQXNzaWduZXIoKSk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIGlmIChjZXNpdW1PYmplY3QpIHtcbiAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBjZXNpdW1PYmplY3QuYWNFbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RyYXdlci5yZW1vdmUoY2VzaXVtT2JqZWN0KTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZGVsZXRlKGlkKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5jbGVhcigpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgfVxufVxuIl19