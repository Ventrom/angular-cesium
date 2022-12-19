import { EventEmitter, Input, Output, Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/basic-drawer/basic-drawer.service";
import * as i2 from "../layer-service/layer-service.service";
import * as i3 from "../computation-cache/computation-cache.service";
import * as i4 from "../cesium-properties/cesium-properties.service";
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
BasicDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: BasicDesc, deps: [{ token: i1.BasicDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: BasicDesc, inputs: { props: "props" }, outputs: { onDraw: "onDraw", onRemove: "onRemove" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: BasicDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.BasicDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { props: [{
                type: Input
            }], onDraw: [{
                type: Output
            }], onRemove: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBYzFGOzs7R0FHRztBQUVILE1BQU0sT0FBTyxTQUFTO0lBY3BCLFlBQXNCLE9BQTJCLEVBQzNCLGFBQTJCLEVBQzNCLGlCQUFtQyxFQUNuQyxpQkFBbUM7UUFIbkMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDM0Isa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBWnpELFdBQU0sR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFHdEUsYUFBUSxHQUErQixJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQUU5RCxzQkFBaUIsR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQVF2RSxDQUFDO0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFUyxpQkFBaUI7UUFDekIsT0FBTyxDQUFDLFlBQW9CLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlLENBQUMs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Qy9CLFlBQVksRUFBRSxZQUFZO2dCQUMxQixRQUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7dUdBcEdVLFNBQVM7MkZBQVQsU0FBUzs0RkFBVCxTQUFTO2tCQURyQixTQUFTO2tNQUdSLEtBQUs7c0JBREosS0FBSztnQkFJTixNQUFNO3NCQURMLE1BQU07Z0JBSVAsUUFBUTtzQkFEUCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBPbkRyYXdQYXJhbXMge1xuICBhY0VudGl0eTogQWNFbnRpdHk7XG4gIGVudGl0eUlkOiBzdHJpbmc7XG4gIGNlc2l1bUVudGl0eTogYW55O1xufVxuXG4vKipcbiAqICB0aGUgYW5jZXN0b3IgY2xhc3MgZm9yIGNyZWF0aW5nIGNvbXBvbmVudHMuXG4gKiAgZXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRlc2MgY29tcG9uZW50LlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgSURlc2NyaXB0aW9uIHtcbiAgQElucHV0KClcbiAgcHJvcHM6IGFueTtcblxuICBAT3V0cHV0KClcbiAgb25EcmF3OiBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPiA9IG5ldyBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPigpO1xuXG4gIEBPdXRwdXQoKVxuICBvblJlbW92ZTogRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4gPSBuZXcgRXZlbnRFbWl0dGVyPE9uRHJhd1BhcmFtcz4oKTtcblxuICBwcm90ZWN0ZWQgX2Nlc2l1bU9iamVjdHNNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuICBwcml2YXRlIF9wcm9wc0V2YWx1YXRlRm46IEZ1bmN0aW9uO1xuICBwcml2YXRlIF9wcm9wc0Fzc2lnbmVyRm46IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZHJhd2VyOiBCYXNpY0RyYXdlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBfY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQ6IE9iamVjdCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3BzRXZhbHVhdGVGbih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0UHJvcHNBc3NpZ25lcigpOiAoY2VzaXVtT2JqZWN0OiBPYmplY3QsIGRlc2M6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICByZXR1cm4gKGNlc2l1bU9iamVjdDogT2JqZWN0LCBkZXNjOiBPYmplY3QpID0+IHRoaXMuX3Byb3BzQXNzaWduZXJGbihjZXNpdW1PYmplY3QsIGRlc2MpO1xuICB9XG5cbiAgZ2V0TGF5ZXJTZXJ2aWNlKCk6IExheWVyU2VydmljZSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyU2VydmljZTtcbiAgfVxuXG4gIHNldExheWVyU2VydmljZShsYXllclNlcnZpY2U6IExheWVyU2VydmljZSkge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlID0gbGF5ZXJTZXJ2aWNlO1xuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3Byb3BzRXZhbHVhdGVGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMucHJvcHMsIHRoaXMuX2xheWVyU2VydmljZS5jYWNoZSwgdHJ1ZSk7XG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lckZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVBc3NpZ25lcih0aGlzLnByb3BzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wcm9wcykge1xuICAgICAgY29uc29sZS5lcnJvcignYWMtZGVzYyBjb21wb25lbnRzIGVycm9yOiBbcHJvcHNdIGlucHV0IGlzIG1hbmRhdG9yeScpO1xuICAgIH1cblxuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuX3Byb3BzRXZhbHVhdGVGbiA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMucHJvcHMsIHRoaXMuX2xheWVyU2VydmljZS5jYWNoZSk7XG4gICAgdGhpcy5fcHJvcHNBc3NpZ25lckZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVBc3NpZ25lcih0aGlzLnByb3BzKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZXNpdW1PYmplY3RzTWFwKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1PYmplY3RzTWFwO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBhbnksIGlkOiBzdHJpbmcsIGVudGl0eTogQWNFbnRpdHkpOiB2b2lkIHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuXG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IGNlc2l1bU9iamVjdCA9IHRoaXMuX2RyYXdlci5hZGQoY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5vbkRyYXcuZW1pdCh7XG4gICAgICAgIGFjRW50aXR5OiBlbnRpdHksXG4gICAgICAgIGNlc2l1bUVudGl0eTogY2VzaXVtT2JqZWN0LFxuICAgICAgICBlbnRpdHlJZDogaWQsXG4gICAgICB9KTtcbiAgICAgIGNlc2l1bU9iamVjdC5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIGNlc2l1bU9iamVjdCBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBjZXNpdW1PYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLm9uRHJhdy5lbWl0KHtcbiAgICAgICAgYWNFbnRpdHk6IGVudGl0eSxcbiAgICAgICAgY2VzaXVtRW50aXR5OiBjZXNpdW1PYmplY3QsXG4gICAgICAgIGVudGl0eUlkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgY2VzaXVtT2JqZWN0LmFjRW50aXR5ID0gZW50aXR5OyAvLyBzZXQgdGhlIGVudGl0eSBvbiB0aGUgY2VzaXVtT2JqZWN0IGZvciBsYXRlciB1c2FnZVxuICAgICAgdGhpcy5fZHJhd2VyLnNldFByb3BzQXNzaWduZXIodGhpcy5fZ2V0UHJvcHNBc3NpZ25lcigpKTtcbiAgICAgIHRoaXMuX2RyYXdlci51cGRhdGUoY2VzaXVtT2JqZWN0LCBjZXNpdW1Qcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjZXNpdW1PYmplY3QgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgaWYgKGNlc2l1bU9iamVjdCkge1xuICAgICAgdGhpcy5vblJlbW92ZS5lbWl0KHtcbiAgICAgICAgYWNFbnRpdHk6IGNlc2l1bU9iamVjdC5hY0VudGl0eSxcbiAgICAgICAgY2VzaXVtRW50aXR5OiBjZXNpdW1PYmplY3QsXG4gICAgICAgIGVudGl0eUlkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fZHJhd2VyLnJlbW92ZShjZXNpdW1PYmplY3QpO1xuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5kZWxldGUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLnJlbW92ZUFsbCgpO1xuICB9XG59XG4iXX0=