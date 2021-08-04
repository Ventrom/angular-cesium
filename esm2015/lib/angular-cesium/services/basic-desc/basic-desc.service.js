import { EventEmitter, Input, Output, Directive } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc {
    constructor(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    _propsEvaluator(context) {
        return this._propsEvaluateFn(this._computationCache, context);
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => this._propsAssignerFn(cesiumObject, desc);
    }
    getLayerService() {
        return this._layerService;
    }
    setLayerService(layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    ngOnInit() {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    getCesiumObjectsMap() {
        return this._cesiumObjectsMap;
    }
    draw(context, id, entity) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
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
    remove(id) {
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
    removeAll() {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
    ngOnDestroy() {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    }
}
BasicDesc.decorators = [
    { type: Directive }
];
BasicDesc.ctorParameters = () => [
    { type: BasicDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
BasicDesc.propDecorators = {
    props: [{ type: Input }],
    onDraw: [{ type: Output }],
    onRemove: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFbEYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFTbEY7OztHQUdHO0FBRUgsTUFBTSxPQUFPLFNBQVM7SUFjcEIsWUFBc0IsT0FBMkIsRUFDM0IsYUFBMkIsRUFDM0IsaUJBQW1DLEVBQ25DLGlCQUFtQztRQUhuQyxZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQUMzQixrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFaekQsV0FBTSxHQUErQixJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQUd0RSxhQUFRLEdBQStCLElBQUksWUFBWSxFQUFnQixDQUFDO1FBRTlELHNCQUFpQixHQUFxQixJQUFJLEdBQUcsRUFBZSxDQUFDO0lBUXZFLENBQUM7SUFFUyxlQUFlLENBQUMsT0FBZTtRQUN2QyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVTLGlCQUFp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QUFNLENBQUMsRUFBVTtRQUNmLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLFFBQVEsRUFBRSxZQUFZLENBQUMsUUFBUTtnQkFDL0IsWUFBWSxFQUFFLFlBQVk7Z0JBQzFCLFFBQVEsRUFBRSxFQUFFO2FBQ2IsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7WUFyR0YsU0FBUzs7O1lBYkQsa0JBQWtCO1lBSmxCLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsZ0JBQWdCOzs7b0JBaUJ0QixLQUFLO3FCQUdMLE1BQU07dUJBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IElEZXNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9kZXNjcmlwdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT25EcmF3UGFyYW1zIHtcbiAgYWNFbnRpdHk6IEFjRW50aXR5O1xuICBlbnRpdHlJZDogc3RyaW5nO1xuICBjZXNpdW1FbnRpdHk6IGFueTtcbn1cblxuLyoqXG4gKiAgdGhlIGFuY2VzdG9yIGNsYXNzIGZvciBjcmVhdGluZyBjb21wb25lbnRzLlxuICogIGV4dGVuZCB0aGlzIGNsYXNzIHRvIGNyZWF0ZSBkZXNjIGNvbXBvbmVudC5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIElEZXNjcmlwdGlvbiB7XG4gIEBJbnB1dCgpXG4gIHByb3BzOiBhbnk7XG5cbiAgQE91dHB1dCgpXG4gIG9uRHJhdzogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcblxuICBAT3V0cHV0KClcbiAgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+ID0gbmV3IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+KCk7XG5cbiAgcHJvdGVjdGVkIF9jZXNpdW1PYmplY3RzTWFwOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgcHJpdmF0ZSBfcHJvcHNFdmFsdWF0ZUZuOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfcHJvcHNBc3NpZ25lckZuOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2RyYXdlcjogQmFzaWNEcmF3ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2xheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wc0V2YWx1YXRlRm4odGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldFByb3BzQXNzaWduZXIoKTogKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgcmV0dXJuIChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4oY2VzaXVtT2JqZWN0LCBkZXNjKTtcbiAgfVxuXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLl9sYXllclNlcnZpY2U7XG4gIH1cblxuICBzZXRMYXllclNlcnZpY2UobGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UpIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UudW5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX2xheWVyU2VydmljZSA9IGxheWVyU2VydmljZTtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUsIHRydWUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucHJvcHMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2FjLWRlc2MgY29tcG9uZW50cyBlcnJvcjogW3Byb3BzXSBpbnB1dCBpcyBtYW5kYXRvcnknKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9wcm9wc0V2YWx1YXRlRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByb3BzLCB0aGlzLl9sYXllclNlcnZpY2UuY2FjaGUpO1xuICAgIHRoaXMuX3Byb3BzQXNzaWduZXJGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlQXNzaWduZXIodGhpcy5wcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VzaXVtT2JqZWN0c01hcCgpOiBNYXA8c3RyaW5nLCBhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtT2JqZWN0c01hcDtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogdm9pZCB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSB0aGlzLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcblxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMub25EcmF3LmVtaXQoe1xuICAgICAgICBhY0VudGl0eTogZW50aXR5LFxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcbiAgICAgICAgZW50aXR5SWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICBjZXNpdW1PYmplY3QuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBjZXNpdW1PYmplY3QgZm9yIGxhdGVyIHVzYWdlXG4gICAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLnNldChpZCwgY2VzaXVtT2JqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBlbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2RyYXdlci5zZXRQcm9wc0Fzc2lnbmVyKHRoaXMuX2dldFByb3BzQXNzaWduZXIoKSk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIGlmIChjZXNpdW1PYmplY3QpIHtcbiAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBjZXNpdW1PYmplY3QuYWNFbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2RyYXdlci5yZW1vdmUoY2VzaXVtT2JqZWN0KTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZGVsZXRlKGlkKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5jbGVhcigpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgfVxufVxuIl19