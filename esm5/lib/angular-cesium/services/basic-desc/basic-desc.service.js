import { __decorate, __metadata } from "tslib";
import { EventEmitter, Input, Output, Directive } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
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
    BasicDesc.prototype._propsEvaluator = function (context) {
        return this._propsEvaluateFn(this._computationCache, context);
    };
    BasicDesc.prototype._getPropsAssigner = function () {
        var _this = this;
        return function (cesiumObject, desc) { return _this._propsAssignerFn(cesiumObject, desc); };
    };
    BasicDesc.prototype.getLayerService = function () {
        return this._layerService;
    };
    BasicDesc.prototype.setLayerService = function (layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    BasicDesc.prototype.ngOnInit = function () {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    };
    BasicDesc.prototype.getCesiumObjectsMap = function () {
        return this._cesiumObjectsMap;
    };
    BasicDesc.prototype.draw = function (context, id, entity) {
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
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
    BasicDesc.prototype.remove = function (id) {
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
    BasicDesc.prototype.removeAll = function () {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    BasicDesc.prototype.ngOnDestroy = function () {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    };
    BasicDesc.ctorParameters = function () { return [
        { type: BasicDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicDesc.prototype, "props", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BasicDesc.prototype, "onDraw", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], BasicDesc.prototype, "onRemove", void 0);
    BasicDesc = __decorate([
        Directive(),
        __metadata("design:paramtypes", [BasicDrawerService,
            LayerService,
            ComputationCache,
            CesiumProperties])
    ], BasicDesc);
    return BasicDesc;
}());
export { BasicDesc };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUVsRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQVNsRjs7O0dBR0c7QUFFSDtJQWNFLG1CQUFzQixPQUEyQixFQUMzQixhQUEyQixFQUMzQixpQkFBbUMsRUFDbkMsaUJBQW1DO1FBSG5DLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQzNCLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQzNCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQVp6RCxXQUFNLEdBQStCLElBQUksWUFBWSxFQUFnQixDQUFDO1FBR3RFLGFBQVEsR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFFOUQsc0JBQWlCLEdBQXFCLElBQUksR0FBRyxFQUFlLENBQUM7SUFRdkUsQ0FBQztJQUVTLG1DQUFlLEdBQXpCLFVBQTBCLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFUyxxQ0FBaUIsR0FBM0I7UUFBQSxpQkFFQztRQURDLE9BQU8sVUFBQyxZ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bnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBPbkRyYXdQYXJhbXMge1xuICBhY0VudGl0eTogQWNFbnRpdHk7XG4gIGVudGl0eUlkOiBzdHJpbmc7XG4gIGNlc2l1bUVudGl0eTogYW55O1xufVxuXG4vKipcbiAqICB0aGUgYW5jZXN0b3IgY2xhc3MgZm9yIGNyZWF0aW5nIGNvbXBvbmVudHMuXG4gKiAgZXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRlc2MgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgSURlc2NyaXB0aW9uIHtcbiAgQElucHV0KClcbiAgcHJvcHM6IGFueTtcblxuICBAT3V0cHV0KClcbiAgb25EcmF3OiBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPiA9IG5ldyBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPigpO1xuXG4gIEBPdXRwdXQoKVxuICBvblJlbW92ZTogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcblxuICBwcm90ZWN0ZWQgX2Nlc2l1bU9iamVjdHNNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICBwcml2YXRlIF9wcm9wc0V2YWx1YXRlRm46IEZ1bmN0aW9uO1xuICBwcml2YXRlIF9wcm9wc0Fzc2lnbmVyRm46IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZHJhd2VyOiBCYXNpY0RyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3BzRXZhbHVhdGVGbih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0UHJvcHNBc3NpZ25lcigpOiAoY2VzaXVtT2JqZWN0OiBPYmplY3QsIGRlc2M6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICByZXR1cm4gKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IHRoaXMuX3Byb3BzQXNzaWduZXJGbihjZXNpdW1PYmplY3QsIGRlc2MpO1xuICB9XG5cbiAgZ2V0TGF5ZXJTZXJ2aWNlKCk6IExheWVyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyU2VydmljZTtcbiAgfVxuXG4gIHNldExheWVyU2VydmljZShsYXllclNlcnZpY2U6IExheWVyU2VydmljZSkge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlID0gbGF5ZXJTZXJ2aWNlO1xuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3Byb3BzRXZhbHVhdGVGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMucHJvcHMsIHRoaXMuX2xheWVyU2VydmljZS5jYWNoZSwgdHJ1ZSk7XG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lckZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVBc3NpZ25lcih0aGlzLnByb3BzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wcm9wcykge1xuICAgICAgY29uc29sZS5lcnJvcignYWMtZGVzYyBjb21wb25lbnRzIGVycm9yOiBbcHJvcHNdIGlucHV0IGlzIG1hbmRhdG9yeScpO1xuICAgIH1cblxuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3Byb3BzRXZhbHVhdGVGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMucHJvcHMsIHRoaXMuX2xheWVyU2VydmljZS5jYWNoZSk7XG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lckZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVBc3NpZ25lcih0aGlzLnByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZXNpdW1PYmplY3RzTWFwKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1PYmplY3RzTWFwO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBhbnksIGlkOiBzdHJpbmcsIGVudGl0eTogQWNFbnRpdHkpOiB2b2lkIHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuXG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IGNlc2l1bU9iamVjdCA9IHRoaXMuX2RyYXdlci5hZGQoY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBlbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBjZXNpdW1PYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLm9uRHJhdy5lbWl0KHtcbiAgICAgICAgYWNFbnRpdHk6IGVudGl0eSxcbiAgICAgICAgY2VzaXVtRW50aXR5OiBjZXNpdW1PYmplY3QsXG4gICAgICAgIGVudGl0eUlkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgY2VzaXVtT2JqZWN0LmFjRW50aXR5ID0gZW50aXR5OyAvLyBzZXQgdGhlIGVudGl0eSBvbiB0aGUgY2VzaXVtT2JqZWN0IGZvciBsYXRlciB1c2FnZVxuICAgICAgdGhpcy5fZHJhd2VyLnNldFByb3BzQXNzaWduZXIodGhpcy5fZ2V0UHJvcHNBc3NpZ25lcigpKTtcbiAgICAgIHRoaXMuX2RyYXdlci51cGRhdGUoY2VzaXVtT2JqZWN0LCBjZXNpdW1Qcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgaWYgKGNlc2l1bU9iamVjdCkge1xuICAgICAgdGhpcy5vblJlbW92ZS5lbWl0KHtcbiAgICAgICAgYWNFbnRpdHk6IGNlc2l1bU9iamVjdC5hY0VudGl0eSxcbiAgICAgICAgY2VzaXVtRW50aXR5OiBjZXNpdW1PYmplY3QsXG4gICAgICAgIGVudGl0eUlkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZHJhd2VyLnJlbW92ZShjZXNpdW1PYmplY3QpO1xuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5kZWxldGUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICB9XG59XG4iXX0=