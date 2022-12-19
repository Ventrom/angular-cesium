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
}
BasicStaticPrimitiveDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: BasicStaticPrimitiveDesc, deps: [{ token: i1.StaticPrimitiveDrawer }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicStaticPrimitiveDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: BasicStaticPrimitiveDesc, inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: BasicStaticPrimitiveDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.StaticPrimitiveDrawer }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQVUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7Ozs7O0FBUTdELE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxTQUFTO0lBWXJELFlBQXNCLHNCQUE2QyxFQUFFLFlBQTBCLEVBQ25GLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGNUQsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF1QjtJQUduRSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFZLEVBQUUsRUFBVSxFQUFFLE1BQWdCO1FBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNoRyxTQUFTLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLGtEQUFrRDtZQUMvRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0wsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzdGO0lBQ0gsQ0FBQzs7c0hBdENVLHdCQUF3QjswR0FBeEIsd0JBQXdCOzRGQUF4Qix3QkFBd0I7a0JBRHBDLFNBQVM7cU1BR1IsYUFBYTtzQkFEWixLQUFLO2dCQUdOLGFBQWE7c0JBRFosS0FBSztnQkFHTixjQUFjO3NCQURiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25Jbml0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICBnZW9tZXRyeVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIGluc3RhbmNlUHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgcHJpbWl0aXZlUHJvcHM6IGFueTtcblxuICBwcml2YXRlIF9nZW9tZXRyeVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfaW5zdGFuY2VQcm9wc0V2YWx1YXRvcjogRnVuY3Rpb247XG4gIHByaXZhdGUgX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3N0YXRpY1ByaW1pdGl2ZURyYXdlcjogU3RhdGljUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKF9zdGF0aWNQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcblxuICAgIHRoaXMuX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLmdlb21ldHJ5UHJvcHMpO1xuICAgIHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLmluc3RhbmNlUHJvcHMpO1xuICAgIHRoaXMuX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5wcmltaXRpdmVQcm9wcyk7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgZW50aXR5OiBBY0VudGl0eSk6IGFueSB7XG4gICAgY29uc3QgZ2VvbWV0cnlQcm9wcyA9IHRoaXMuX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3IodGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IodGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gICAgY29uc3QgcHJpbWl0aXZlUHJvcHMgPSB0aGlzLl9wcmltaXRpdmVQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcblxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9zdGF0aWNQcmltaXRpdmVEcmF3ZXIuYWRkKGdlb21ldHJ5UHJvcHMsIGluc3RhbmNlUHJvcHMsIHByaW1pdGl2ZVByb3BzKTtcbiAgICAgIHByaW1pdGl2ZS5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIHByaW1pdGl2ZSBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLl9zdGF0aWNQcmltaXRpdmVEcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xuICAgIH1cbiAgfVxufVxuIl19