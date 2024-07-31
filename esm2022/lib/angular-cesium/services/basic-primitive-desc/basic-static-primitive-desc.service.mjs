import { Input, Directive } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/static-dynamic/static-primitive-drawer/static-primitive-drawer.service";
import * as i2 from "../layer-service/layer-service.service";
import * as i3 from "../computation-cache/computation-cache.service";
import * as i4 from "../cesium-properties/cesium-properties.service";
export class BasicStaticPrimitiveDesc extends BasicDesc {
    constructor(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
        this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
    }
    ngOnInit() {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    }
    draw(context, id, entity) {
        const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: BasicStaticPrimitiveDesc, deps: [{ token: i1.StaticPrimitiveDrawer }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: BasicStaticPrimitiveDesc, inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: BasicStaticPrimitiveDesc, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.StaticPrimitiveDrawer }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }], propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQVUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7Ozs7O0FBUTdELE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxTQUFTO0lBWXJELFlBQXNCLHNCQUE2QyxFQUFFLFlBQTBCLEVBQ25GLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGNUQsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF1QjtJQUduRSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFZLEVBQUUsRUFBVSxFQUFFLE1BQWdCO1FBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2hHLFNBQVMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsa0RBQWtEO1lBQy9FLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7SUFDSCxDQUFDOzhHQXRDVSx3QkFBd0I7a0dBQXhCLHdCQUF3Qjs7MkZBQXhCLHdCQUF3QjtrQkFEcEMsU0FBUzttTEFHUixhQUFhO3NCQURaLEtBQUs7Z0JBR04sYUFBYTtzQkFEWixLQUFLO2dCQUdOLGNBQWM7c0JBRGIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBPbkluaXQsIERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLWVudGl0eSc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyBleHRlbmRzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIGdlb21ldHJ5UHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgaW5zdGFuY2VQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBwcmltaXRpdmVQcm9wczogYW55O1xuXG4gIHByaXZhdGUgX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3I6IEZ1bmN0aW9uO1xuICBwcml2YXRlIF9pbnN0YW5jZVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3I6IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfc3RhdGljUHJpbWl0aXZlRHJhd2VyOiBTdGF0aWNQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoX3N0YXRpY1ByaW1pdGl2ZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuXG4gICAgdGhpcy5fZ2VvbWV0cnlQcm9wc0V2YWx1YXRvciA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMuZ2VvbWV0cnlQcm9wcyk7XG4gICAgdGhpcy5faW5zdGFuY2VQcm9wc0V2YWx1YXRvciA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMuaW5zdGFuY2VQcm9wcyk7XG4gICAgdGhpcy5fcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByaW1pdGl2ZVByb3BzKTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogYW55IHtcbiAgICBjb25zdCBnZW9tZXRyeVByb3BzID0gdGhpcy5fZ2VvbWV0cnlQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgICBjb25zdCBpbnN0YW5jZVByb3BzID0gdGhpcy5faW5zdGFuY2VQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IHRoaXMuX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xuXG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX3N0YXRpY1ByaW1pdGl2ZURyYXdlci5hZGQoZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xuICAgICAgcHJpbWl0aXZlLmFjRW50aXR5ID0gZW50aXR5OyAvLyBzZXQgdGhlIGVudGl0eSBvbiB0aGUgcHJpbWl0aXZlIGZvciBsYXRlciB1c2FnZVxuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5zZXQoaWQsIHByaW1pdGl2ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICAgIHRoaXMuX3N0YXRpY1ByaW1pdGl2ZURyYXdlci51cGRhdGUocHJpbWl0aXZlLCBnZW9tZXRyeVByb3BzLCBpbnN0YW5jZVByb3BzLCBwcmltaXRpdmVQcm9wcyk7XG4gICAgfVxuICB9XG59XG4iXX0=