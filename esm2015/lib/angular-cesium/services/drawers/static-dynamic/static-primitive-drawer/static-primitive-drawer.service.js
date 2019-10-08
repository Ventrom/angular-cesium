/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
export class StaticPrimitiveDrawer extends PrimitivesDrawerService {
    /**
     * @param {?} geometryType
     * @param {?} cesiumService
     */
    constructor(geometryType, cesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
        this.geometryType = geometryType;
    }
    /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    add(geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        /** @type {?} */
        const primitive = new Cesium.Primitive(primitiveProps);
        return super.add(primitive);
    }
    /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return super.add(new Cesium.Primitive(primitiveProps));
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    StaticPrimitiveDrawer.prototype.geometryType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbURBQW1ELENBQUM7Ozs7Ozs7QUFRNUYsTUFBTSxPQUFnQixxQkFBc0IsU0FBUSx1QkFBdUI7Ozs7O0lBQ3pFLFlBQW9CLFlBQWlCLEVBQUUsYUFBNEI7UUFDakUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUQvQixpQkFBWSxHQUFaLFlBQVksQ0FBSztJQUVyQyxDQUFDOzs7Ozs7O0lBRUQsR0FBRyxDQUFDLGFBQWtCLEVBQUUsYUFBa0IsRUFBRSxjQUFtQjtRQUM3RCxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RCxjQUFjLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUUsY0FBYyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7O2NBQzlCLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO1FBQ3RELE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7Ozs7OztJQUVELE1BQU0sQ0FBQyxTQUFjLEVBQUUsYUFBa0IsRUFBRSxhQUFrQixFQUFFLGNBQW1CO1FBQ2hGLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0Y7Ozs7OztJQWxCYSw2Q0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICpcbiAqIFRoaXMgZHJhd2VyIGlzIGRlcHJlY2F0ZWQuXG4gKiBHZW5lcmFsIHN0YXRpYyBwcmltaXRpdmVzIGRyYXdlciByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHN0YXRpYyBDZXNpdW0gcHJpbWl0aXZlcyB3aXRoIG1hdGVyaWFsLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhdGljUHJpbWl0aXZlRHJhd2VyIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdlb21ldHJ5VHlwZTogYW55LCBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlByaW1pdGl2ZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KTogYW55IHtcbiAgICBpbnN0YW5jZVByb3BzLmdlb21ldHJ5ID0gbmV3IHRoaXMuZ2VvbWV0cnlUeXBlKGdlb21ldHJ5UHJvcHMpO1xuICAgIHByaW1pdGl2ZVByb3BzLmdlb21ldHJ5SW5zdGFuY2VzID0gbmV3IENlc2l1bS5HZW9tZXRyeUluc3RhbmNlKGluc3RhbmNlUHJvcHMpO1xuICAgIHByaW1pdGl2ZVByb3BzLmFzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgIGNvbnN0IHByaW1pdGl2ZSA9IG5ldyBDZXNpdW0uUHJpbWl0aXZlKHByaW1pdGl2ZVByb3BzKTtcbiAgICByZXR1cm4gc3VwZXIuYWRkKHByaW1pdGl2ZSk7XG4gIH1cblxuICB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KSB7XG4gICAgaW5zdGFuY2VQcm9wcy5nZW9tZXRyeSA9IG5ldyB0aGlzLmdlb21ldHJ5VHlwZShnZW9tZXRyeVByb3BzKTtcbiAgICBwcmltaXRpdmVQcm9wcy5nZW9tZXRyeUluc3RhbmNlcyA9IG5ldyBDZXNpdW0uR2VvbWV0cnlJbnN0YW5jZShpbnN0YW5jZVByb3BzKTtcbiAgICB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLnJlbW92ZShwcmltaXRpdmUpO1xuICAgIHJldHVybiBzdXBlci5hZGQobmV3IENlc2l1bS5QcmltaXRpdmUocHJpbWl0aXZlUHJvcHMpKTtcbiAgfVxufVxuIl19