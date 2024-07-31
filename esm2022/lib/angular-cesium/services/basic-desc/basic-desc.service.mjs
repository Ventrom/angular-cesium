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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: BasicDesc, deps: [{ token: i1.BasicDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: BasicDesc, inputs: { props: "props" }, outputs: { onDraw: "onDraw", onRemove: "onRemove" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: BasicDesc, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.BasicDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }], propDecorators: { props: [{
                type: Input
            }], onDraw: [{
                type: Output
            }], onRemove: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtZGVzYy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7O0FBYzFGOzs7R0FHRztBQUVILE1BQU0sT0FBTyxTQUFTO0lBY3BCLFlBQXNCLE9BQTJCLEVBQzNCLGFBQTJCLEVBQzNCLGlCQUFtQyxFQUNuQyxpQkFBbUM7UUFIbkMsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDM0Isa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBWnpELFdBQU0sR0FBK0IsSUFBSSxZQUFZLEVBQWdCLENBQUM7UUFHdEUsYUFBUSxHQUErQixJQUFJLFlBQVksRUFBZ0IsQ0FBQztRQUU5RCxzQkFBaUIsR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQztJQVF2RSxDQUFDO0lBRVMsZUFBZSxDQUFDLE9BQWU7UUFDdkMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFUyxpQkFBaUI7UUFDekIsT0FBTyxDQUFDLFlBQW9CLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlLENBQUMs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O2dCQUNqQixRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVE7Z0JBQy9CLFlBQVksRUFBRSxZQUFZO2dCQUMxQixRQUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzhHQXBHVSxTQUFTO2tHQUFULFNBQVM7OzJGQUFULFNBQVM7a0JBRHJCLFNBQVM7Z0xBR1IsS0FBSztzQkFESixLQUFLO2dCQUlOLE1BQU07c0JBREwsTUFBTTtnQkFJUCxRQUFRO3NCQURQLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9uRHJhd1BhcmFtcyB7XG4gIGFjRW50aXR5OiBBY0VudGl0eTtcbiAgZW50aXR5SWQ6IHN0cmluZztcbiAgY2VzaXVtRW50aXR5OiBhbnk7XG59XG5cbi8qKlxuICogIHRoZSBhbmNlc3RvciBjbGFzcyBmb3IgY3JlYXRpbmcgY29tcG9uZW50cy5cbiAqICBleHRlbmQgdGhpcyBjbGFzcyB0byBjcmVhdGUgZGVzYyBjb21wb25lbnQuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBJRGVzY3JpcHRpb24ge1xuICBASW5wdXQoKVxuICBwcm9wczogYW55O1xuXG4gIEBPdXRwdXQoKVxuICBvbkRyYXc6IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+ID0gbmV3IEV2ZW50RW1pdHRlcjxPbkRyYXdQYXJhbXM+KCk7XG5cbiAgQE91dHB1dCgpXG4gIG9uUmVtb3ZlOiBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPiA9IG5ldyBFdmVudEVtaXR0ZXI8T25EcmF3UGFyYW1zPigpO1xuXG4gIHByb3RlY3RlZCBfY2VzaXVtT2JqZWN0c01hcDogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gIHByaXZhdGUgX3Byb3BzRXZhbHVhdGVGbjogRnVuY3Rpb247XG4gIHByaXZhdGUgX3Byb3BzQXNzaWduZXJGbjogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9kcmF3ZXI6IEJhc2ljRHJhd2VyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIF9jb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2Nlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcHJvcHNFdmFsdWF0b3IoY29udGV4dDogT2JqZWN0KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcHJvcHNFdmFsdWF0ZUZuKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRQcm9wc0Fzc2lnbmVyKCk6IChjZXNpdW1PYmplY3Q6IE9iamVjdCwgZGVzYzogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIHJldHVybiAoY2VzaXVtT2JqZWN0OiBPYmplY3QsIGRlc2M6IE9iamVjdCkgPT4gdGhpcy5fcHJvcHNBc3NpZ25lckZuKGNlc2l1bU9iamVjdCwgZGVzYyk7XG4gIH1cblxuICBnZXRMYXllclNlcnZpY2UoKTogTGF5ZXJTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJTZXJ2aWNlO1xuICB9XG5cbiAgc2V0TGF5ZXJTZXJ2aWNlKGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UgPSBsYXllclNlcnZpY2U7XG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5fcHJvcHNFdmFsdWF0ZUZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5wcm9wcywgdGhpcy5fbGF5ZXJTZXJ2aWNlLmNhY2hlLCB0cnVlKTtcbiAgICB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUFzc2lnbmVyKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnByb3BzKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdhYy1kZXNjIGNvbXBvbmVudHMgZXJyb3I6IFtwcm9wc10gaW5wdXQgaXMgbWFuZGF0b3J5Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5fcHJvcHNFdmFsdWF0ZUZuID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5wcm9wcywgdGhpcy5fbGF5ZXJTZXJ2aWNlLmNhY2hlKTtcbiAgICB0aGlzLl9wcm9wc0Fzc2lnbmVyRm4gPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUFzc2lnbmVyKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgcHVibGljIGdldENlc2l1bU9iamVjdHNNYXAoKTogTWFwPHN0cmluZywgYW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXA7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgZW50aXR5OiBBY0VudGl0eSk6IHZvaWQge1xuICAgIGNvbnN0IGNlc2l1bVByb3BzID0gdGhpcy5fcHJvcHNFdmFsdWF0b3IoY29udGV4dCk7XG5cbiAgICBpZiAoIXRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuaGFzKGlkKSkge1xuICAgICAgY29uc3QgY2VzaXVtT2JqZWN0ID0gdGhpcy5fZHJhd2VyLmFkZChjZXNpdW1Qcm9wcyk7XG4gICAgICB0aGlzLm9uRHJhdy5lbWl0KHtcbiAgICAgICAgYWNFbnRpdHk6IGVudGl0eSxcbiAgICAgICAgY2VzaXVtRW50aXR5OiBjZXNpdW1PYmplY3QsXG4gICAgICAgIGVudGl0eUlkOiBpZCxcbiAgICAgIH0pO1xuICAgICAgY2VzaXVtT2JqZWN0LmFjRW50aXR5ID0gZW50aXR5OyAvLyBzZXQgdGhlIGVudGl0eSBvbiB0aGUgY2VzaXVtT2JqZWN0IGZvciBsYXRlciB1c2FnZVxuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5zZXQoaWQsIGNlc2l1bU9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNlc2l1bU9iamVjdCA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICAgIHRoaXMub25EcmF3LmVtaXQoe1xuICAgICAgICBhY0VudGl0eTogZW50aXR5LFxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcbiAgICAgICAgZW50aXR5SWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICBjZXNpdW1PYmplY3QuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBjZXNpdW1PYmplY3QgZm9yIGxhdGVyIHVzYWdlXG4gICAgICB0aGlzLl9kcmF3ZXIuc2V0UHJvcHNBc3NpZ25lcih0aGlzLl9nZXRQcm9wc0Fzc2lnbmVyKCkpO1xuICAgICAgdGhpcy5fZHJhd2VyLnVwZGF0ZShjZXNpdW1PYmplY3QsIGNlc2l1bVByb3BzKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNlc2l1bU9iamVjdCA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICBpZiAoY2VzaXVtT2JqZWN0KSB7XG4gICAgICB0aGlzLm9uUmVtb3ZlLmVtaXQoe1xuICAgICAgICBhY0VudGl0eTogY2VzaXVtT2JqZWN0LmFjRW50aXR5LFxuICAgICAgICBjZXNpdW1FbnRpdHk6IGNlc2l1bU9iamVjdCxcbiAgICAgICAgZW50aXR5SWQ6IGlkLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlKGNlc2l1bU9iamVjdCk7XG4gICAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmRlbGV0ZShpZCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UudW5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlQWxsKCk7XG4gIH1cbn1cbiJdfQ==