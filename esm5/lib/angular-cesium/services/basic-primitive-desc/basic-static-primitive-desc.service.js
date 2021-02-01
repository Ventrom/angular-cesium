import { __decorate, __extends, __metadata } from "tslib";
import { Input, Directive } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { StaticPrimitiveDrawer } from '../drawers/static-dynamic/static-primitive-drawer/static-primitive-drawer.service';
var BasicStaticPrimitiveDesc = /** @class */ (function (_super) {
    __extends(BasicStaticPrimitiveDesc, _super);
    function BasicStaticPrimitiveDesc(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        var _this = _super.call(this, _staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) || this;
        _this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
        return _this;
    }
    BasicStaticPrimitiveDesc.prototype.ngOnInit = function () {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    };
    BasicStaticPrimitiveDesc.prototype.draw = function (context, id, entity) {
        var geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        var instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        var primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            var primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            var primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    };
    BasicStaticPrimitiveDesc.ctorParameters = function () { return [
        { type: StaticPrimitiveDrawer },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "geometryProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "instanceProps", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], BasicStaticPrimitiveDesc.prototype, "primitiveProps", void 0);
    BasicStaticPrimitiveDesc = __decorate([
        Directive(),
        __metadata("design:paramtypes", [StaticPrimitiveDrawer, LayerService,
            ComputationCache, CesiumProperties])
    ], BasicStaticPrimitiveDesc);
    return BasicStaticPrimitiveDesc;
}(BasicDesc));
export { BasicStaticPrimitiveDesc };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzdELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNsRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtRkFBbUYsQ0FBQztBQUkxSDtJQUE4Qyw0Q0FBUztJQVlyRCxrQ0FBc0Isc0JBQTZDLEVBQUUsWUFBMEIsRUFDbkYsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBRGxGLFlBRUUsa0JBQU0sc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLFNBQ2hGO1FBSHFCLDRCQUFzQixHQUF0QixzQkFBc0IsQ0FBdUI7O0lBR25FLENBQUM7SUFFRCwyQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUYsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQsdUNBQUksR0FBSixVQUFLLE9BQVksRUFBRSxFQUFVLEVBQUUsTUFBZ0I7UUFDN0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRixJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BGLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFdEYsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbkMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2hHLFNBQVMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsa0RBQWtEO1lBQy9FLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDN0Y7SUFDSCxDQUFDOztnQkExQjZDLHFCQUFxQjtnQkFBZ0IsWUFBWTtnQkFDakUsZ0JBQWdCO2dCQUFvQixnQkFBZ0I7O0lBWGxGO1FBREMsS0FBSyxFQUFFOzttRUFDVztJQUVuQjtRQURDLEtBQUssRUFBRTs7bUVBQ1c7SUFFbkI7UUFEQyxLQUFLLEVBQUU7O29FQUNZO0lBTlQsd0JBQXdCO1FBRHBDLFNBQVMsRUFBRTt5Q0Fhb0MscUJBQXFCLEVBQWdCLFlBQVk7WUFDakUsZ0JBQWdCLEVBQW9CLGdCQUFnQjtPQWJ2RSx3QkFBd0IsQ0F1Q3BDO0lBQUQsK0JBQUM7Q0FBQSxBQXZDRCxDQUE4QyxTQUFTLEdBdUN0RDtTQXZDWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25Jbml0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKVxuICBnZW9tZXRyeVByb3BzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIGluc3RhbmNlUHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgcHJpbWl0aXZlUHJvcHM6IGFueTtcblxuICBwcml2YXRlIF9nZW9tZXRyeVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfaW5zdGFuY2VQcm9wc0V2YWx1YXRvcjogRnVuY3Rpb247XG4gIHByaXZhdGUgX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3N0YXRpY1ByaW1pdGl2ZURyYXdlcjogU3RhdGljUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKF9zdGF0aWNQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcblxuICAgIHRoaXMuX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLmdlb21ldHJ5UHJvcHMpO1xuICAgIHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLmluc3RhbmNlUHJvcHMpO1xuICAgIHRoaXMuX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5wcmltaXRpdmVQcm9wcyk7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgZW50aXR5OiBBY0VudGl0eSk6IGFueSB7XG4gICAgY29uc3QgZ2VvbWV0cnlQcm9wcyA9IHRoaXMuX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3IodGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IodGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XG4gICAgY29uc3QgcHJpbWl0aXZlUHJvcHMgPSB0aGlzLl9wcmltaXRpdmVQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcblxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9zdGF0aWNQcmltaXRpdmVEcmF3ZXIuYWRkKGdlb21ldHJ5UHJvcHMsIGluc3RhbmNlUHJvcHMsIHByaW1pdGl2ZVByb3BzKTtcbiAgICAgIHByaW1pdGl2ZS5hY0VudGl0eSA9IGVudGl0eTsgLy8gc2V0IHRoZSBlbnRpdHkgb24gdGhlIHByaW1pdGl2ZSBmb3IgbGF0ZXIgdXNhZ2VcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLl9zdGF0aWNQcmltaXRpdmVEcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xuICAgIH1cbiAgfVxufVxuIl19