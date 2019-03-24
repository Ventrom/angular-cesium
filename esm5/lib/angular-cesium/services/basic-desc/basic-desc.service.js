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
var BasicDesc = /** @class */ (function () {
    function BasicDesc(_drawer, _layerService, _computationCache, _cesiumProperties) {
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
    BasicDesc.prototype._propsEvaluator = /**
     * @protected
     * @param {?} context
     * @return {?}
     */
    function (context) {
        return this._propsEvaluateFn(this._computationCache, context);
    };
    /**
     * @protected
     * @return {?}
     */
    BasicDesc.prototype._getPropsAssigner = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        return (/**
         * @param {?} cesiumObject
         * @param {?} desc
         * @return {?}
         */
        function (cesiumObject, desc) { return _this._propsAssignerFn(cesiumObject, desc); });
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.getLayerService = /**
     * @return {?}
     */
    function () {
        return this._layerService;
    };
    /**
     * @param {?} layerService
     * @return {?}
     */
    BasicDesc.prototype.setLayerService = /**
     * @param {?} layerService
     * @return {?}
     */
    function (layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.getCesiumObjectsMap = /**
     * @return {?}
     */
    function () {
        return this._cesiumObjectsMap;
    };
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    BasicDesc.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    function (context, id, entity) {
        /** @type {?} */
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            var cesiumObject = this._drawer.add(cesiumProps);
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
            var cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    BasicDesc.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    /**
     * @return {?}
     */
    BasicDesc.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    };
    BasicDesc.propDecorators = {
        props: [{ type: Input }],
        onDraw: [{ type: Output }],
        onRemove: [{ type: Output }]
    };
    return BasicDesc;
}());
export { BasicDesc };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFRL0Usa0NBSUM7OztJQUhDLGdDQUFtQjs7SUFDbkIsZ0NBQWlCOztJQUNqQixvQ0FBa0I7Ozs7OztBQU9wQjtJQWNFLG1CQUFzQixPQUEyQixFQUMzQixhQUEyQixFQUMzQixpQkFBbUMsRUFDbkMsaUJBQW1DO1FBSG5DLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQzNCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzNCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVp6RCxXQUFNLEdBQStCLElBQUksWUFBWSxFQUFnQixDQUFDO1FBR3RFLGFBQVEsR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFFOUQsc0JBQWlCLEdBQXFCLElBQUksR0FBRyxFQUFlLENBQUM7SUFRdkUsQ0FBQzs7Ozs7O0lBRVMsbUNBQWU7Ozs7O0lBQXpCLFVBQTBCLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Ozs7O0lBRVMscUNBQWlCOzs7O0lBQTNCO1FBQUEsaUJBRUM7UUFEQzs7Ozs7UUFBTyxVQUFDLFlBQW9CLEVBQUUsSUFBWSxJQUFLLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBekMsQ0FBeUMsRUFBQztJQUMzRixDQUFDOzs7O0lBRUQsbUNBQWU7OztJQUFm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RCxJQUFJLFlBQVksRUFBRTtZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDakIsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRO2dCQUMvQixZQUFZLEVBQUUsWUFBWTtnQkFDMUIsUUFBUSxFQUFFLEVBQUU7YUFDYixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQzs7OztJQUVELDZCQUFTOzs7SUFBVDtRQUNFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCwrQkFBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzt3QkFuR0EsS0FBSzt5QkFHTCxNQUFNOzJCQUdOLE1BQU07O0lBOEZULGdCQUFDO0NBQUEsQUFyR0QsSUFxR0M7U0FyR1ksU0FBUzs7O0lBQ3BCLDBCQUNXOztJQUVYLDJCQUNzRTs7SUFFdEUsNkJBQ3dFOzs7OztJQUV4RSxzQ0FBdUU7Ozs7O0lBQ3ZFLHFDQUFtQzs7Ozs7SUFDbkMscUNBQW1DOzs7OztJQUV2Qiw0QkFBcUM7Ozs7O0lBQ3JDLGtDQUFxQzs7Ozs7SUFDckMsc0NBQTZDOzs7OztJQUM3QyxzQ0FBNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBPbkRyYXdQYXJhbXMge1xuICBhY0VudGl0eTogQWNFbnRpdHk7XG4gIGVudGl0eUlkOiBzdHJpbmc7XG4gIGNlc2l1bUVudGl0eTogYW55O1xufVxuXG4vKipcbiAqICB0aGUgYW5jZXN0b3IgY2xhc3MgZm9yIGNyZWF0aW5nIGNvbXBvbmVudHMuXG4gKiAgZXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRlc2MgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIElEZXNjcmlwdGlvbiB7XG4gIEBJbnB1dCgpXG4gIHByb3BzOiBhbnk7XG5cbiAgQE91dHB1dCgpXG4gIG9uRHJhdzogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcblxuICBAT3V0cHV0KClcbiAgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+ID0gbmV3IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+KCk7XG5cbiAgcHJvdGVjdGVkIF9jZXNpdW1PYmplY3RzTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgcHJpdmF0ZSBfcHJvcHNFdmFsdWF0ZUZuOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfcHJvcHNBc3NpZ25lckZuOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2RyYXdlcjogQmFzaWNEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2xheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wc0V2YWx1YXRlRm4odGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFByb3BzQXNzaWduZXIoKTogKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4oY2VzaXVtT2JqZWN0LCBkZXNjKTtcbiAgfVxuXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9sYXllclNlcnZpY2U7XG4gIH1cblxuICBzZXRMYXllclNlcnZpY2UobGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UpIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UudW5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX2xheWVyU2VydmljZSA9IGxheWVyU2VydmljZTtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUsIHRydWUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucHJvcHMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2FjLWRlc2MgY29tcG9uZW50cyBlcnJvcjogW3Byb3BzXSBpbnB1dCBpcyBtYW5kYXRvcnknKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VzaXVtT2JqZWN0c01hcCgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtT2JqZWN0c01hcDtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogdm9pZCB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSB0aGlzLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcblxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMub25EcmF3LmVtaXQoe1xuICAgICAgICBhY0VudGl0eTogZW50aXR5LFxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcbiAgICAgICAgZW50aXR5SWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICBjZXNpdW1PYmplY3QuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBjZXNpdW1PYmplY3QgZm9yIGxhdGVyIHVzYWdlXG4gICAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLnNldChpZCwgY2VzaXVtT2JqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBlbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2RyYXdlci5zZXRQcm9wc0Fzc2lnbmVyKHRoaXMuX2dldFByb3BzQXNzaWduZXIoKSk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIGlmIChjZXNpdW1PYmplY3QpIHtcbiAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBjZXNpdW1PYmplY3QuYWNFbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RyYXdlci5yZW1vdmUoY2VzaXVtT2JqZWN0KTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZGVsZXRlKGlkKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5jbGVhcigpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgfVxufVxuIl19