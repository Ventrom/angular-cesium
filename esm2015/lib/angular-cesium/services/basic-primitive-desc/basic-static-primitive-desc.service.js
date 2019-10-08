/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Input } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
export class BasicStaticPrimitiveDesc extends BasicDesc {
    /**
     * @param {?} _staticPrimitiveDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
        this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} entity
     * @return {?}
     */
    draw(context, id, entity) {
        /** @type {?} */
        const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        /** @type {?} */
        const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        /** @type {?} */
        const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            /** @type {?} */
            const primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    }
}
BasicStaticPrimitiveDesc.propDecorators = {
    geometryProps: [{ type: Input }],
    instanceProps: [{ type: Input }],
    primitiveProps: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    BasicStaticPrimitiveDesc.prototype.geometryProps;
    /** @type {?} */
    BasicStaticPrimitiveDesc.prototype.instanceProps;
    /** @type {?} */
    BasicStaticPrimitiveDesc.prototype.primitiveProps;
    /**
     * @type {?}
     * @private
     */
    BasicStaticPrimitiveDesc.prototype._geometryPropsEvaluator;
    /**
     * @type {?}
     * @private
     */
    BasicStaticPrimitiveDesc.prototype._instancePropsEvaluator;
    /**
     * @type {?}
     * @private
     */
    BasicStaticPrimitiveDesc.prototype._primitivePropsEvaluator;
    /**
     * @type {?}
     * @protected
     */
    BasicStaticPrimitiveDesc.prototype._staticPrimitiveDrawer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9iYXNpYy1wcmltaXRpdmUtZGVzYy9iYXNpYy1zdGF0aWMtcHJpbWl0aXZlLWRlc2Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFPN0QsTUFBTSxPQUFPLHdCQUF5QixTQUFRLFNBQVM7Ozs7Ozs7SUFZckQsWUFBc0Isc0JBQTZDLEVBQUUsWUFBMEIsRUFDbkYsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUY1RCwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXVCO0lBR25FLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUYsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5RixDQUFDOzs7Ozs7O0lBRUQsSUFBSSxDQUFDLE9BQVksRUFBRSxFQUFVLEVBQUUsTUFBZ0I7O2NBQ3ZDLGFBQWEsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQzs7Y0FDN0UsYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDOztjQUM3RSxjQUFjLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUM7UUFFckYsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7O2tCQUM3QixTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQztZQUMvRixTQUFTLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLGtEQUFrRDtZQUMvRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMzQzthQUFNOztrQkFDQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUM3RjtJQUNILENBQUM7Ozs0QkFyQ0EsS0FBSzs0QkFFTCxLQUFLOzZCQUVMLEtBQUs7Ozs7SUFKTixpREFDbUI7O0lBQ25CLGlEQUNtQjs7SUFDbkIsa0RBQ29COzs7OztJQUVwQiwyREFBMEM7Ozs7O0lBQzFDLDJEQUEwQzs7Ozs7SUFDMUMsNERBQTJDOzs7OztJQUUvQiwwREFBdUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcblxuZXhwb3J0IGNsYXNzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyBleHRlbmRzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpXG4gIGdlb21ldHJ5UHJvcHM6IGFueTtcbiAgQElucHV0KClcbiAgaW5zdGFuY2VQcm9wczogYW55O1xuICBASW5wdXQoKVxuICBwcmltaXRpdmVQcm9wczogYW55O1xuXG4gIHByaXZhdGUgX2dlb21ldHJ5UHJvcHNFdmFsdWF0b3I6IEZ1bmN0aW9uO1xuICBwcml2YXRlIF9pbnN0YW5jZVByb3BzRXZhbHVhdG9yOiBGdW5jdGlvbjtcbiAgcHJpdmF0ZSBfcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3I6IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfc3RhdGljUHJpbWl0aXZlRHJhd2VyOiBTdGF0aWNQcmltaXRpdmVEcmF3ZXIsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoX3N0YXRpY1ByaW1pdGl2ZURyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2xheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuXG4gICAgdGhpcy5fZ2VvbWV0cnlQcm9wc0V2YWx1YXRvciA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMuZ2VvbWV0cnlQcm9wcyk7XG4gICAgdGhpcy5faW5zdGFuY2VQcm9wc0V2YWx1YXRvciA9IHRoaXMuX2Nlc2l1bVByb3BlcnRpZXMuY3JlYXRlRXZhbHVhdG9yKHRoaXMuaW5zdGFuY2VQcm9wcyk7XG4gICAgdGhpcy5fcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByaW1pdGl2ZVByb3BzKTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogYW55IHtcbiAgICBjb25zdCBnZW9tZXRyeVByb3BzID0gdGhpcy5fZ2VvbWV0cnlQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgICBjb25zdCBpbnN0YW5jZVByb3BzID0gdGhpcy5faW5zdGFuY2VQcm9wc0V2YWx1YXRvcih0aGlzLl9jb21wdXRhdGlvbkNhY2hlLCBjb250ZXh0KTtcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IHRoaXMuX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xuXG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX3N0YXRpY1ByaW1pdGl2ZURyYXdlci5hZGQoZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xuICAgICAgcHJpbWl0aXZlLmFjRW50aXR5ID0gZW50aXR5OyAvLyBzZXQgdGhlIGVudGl0eSBvbiB0aGUgcHJpbWl0aXZlIGZvciBsYXRlciB1c2FnZVxuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5zZXQoaWQsIHByaW1pdGl2ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICAgIHRoaXMuX3N0YXRpY1ByaW1pdGl2ZURyYXdlci51cGRhdGUocHJpbWl0aXZlLCBnZW9tZXRyeVByb3BzLCBpbnN0YW5jZVByb3BzLCBwcmltaXRpdmVQcm9wcyk7XG4gICAgfVxuICB9XG59XG4iXX0=