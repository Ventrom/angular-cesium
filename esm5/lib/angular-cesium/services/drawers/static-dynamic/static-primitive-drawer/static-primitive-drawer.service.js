/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
var /**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
StaticPrimitiveDrawer = /** @class */ (function (_super) {
    tslib_1.__extends(StaticPrimitiveDrawer, _super);
    function StaticPrimitiveDrawer(geometryType, cesiumService) {
        var _this = _super.call(this, Cesium.PrimitiveCollection, cesiumService) || this;
        _this.geometryType = geometryType;
        return _this;
    }
    /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPrimitiveDrawer.prototype.add = /**
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        /** @type {?} */
        var primitive = new Cesium.Primitive(primitiveProps);
        return _super.prototype.add.call(this, primitive);
    };
    /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    StaticPrimitiveDrawer.prototype.update = /**
     * @param {?} primitive
     * @param {?} geometryProps
     * @param {?} instanceProps
     * @param {?} primitiveProps
     * @return {?}
     */
    function (primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return _super.prototype.add.call(this, new Cesium.Primitive(primitiveProps));
    };
    return StaticPrimitiveDrawer;
}(PrimitivesDrawerService));
/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 * @abstract
 */
export { StaticPrimitiveDrawer };
if (false) {
    /**
     * @type {?}
     * @private
     */
    StaticPrimitiveDrawer.prototype.geometryType;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDOzs7Ozs7O0FBUTVGOzs7Ozs7O0lBQW9ELGlEQUF1QjtJQUN6RSwrQkFBb0IsWUFBaUIsRUFBRSxhQUE0QjtRQUFuRSxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLENBQUMsU0FDakQ7UUFGbUIsa0JBQVksR0FBWixZQUFZLENBQUs7O0lBRXJDLENBQUM7Ozs7Ozs7SUFFRCxtQ0FBRzs7Ozs7O0lBQUgsVUFBSSxhQUFrQixFQUFFLGFBQWtCLEVBQUUsY0FBbUI7UUFDN0QsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUQsY0FBYyxDQUFDLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlFLGNBQWMsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDOztZQUM5QixTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztRQUN0RCxPQUFPLGlCQUFNLEdBQUcsWUFBQyxTQUFTLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7Ozs7OztJQUVELHNDQUFNOzs7Ozs7O0lBQU4sVUFBTyxTQUFjLEVBQUUsYUFBa0IsRUFBRSxhQUFrQixFQUFFLGNBQW1CO1FBQ2hGLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8saUJBQU0sR0FBRyxZQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFuQkQsQ0FBb0QsdUJBQXVCLEdBbUIxRTs7Ozs7Ozs7Ozs7OztJQWxCYSw2Q0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICpcbiAqIFRoaXMgZHJhd2VyIGlzIGRlcHJlY2F0ZWQuXG4gKiBHZW5lcmFsIHN0YXRpYyBwcmltaXRpdmVzIGRyYXdlciByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHN0YXRpYyBDZXNpdW0gcHJpbWl0aXZlcyB3aXRoIG1hdGVyaWFsLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhdGljUHJpbWl0aXZlRHJhd2VyIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdlb21ldHJ5VHlwZTogYW55LCBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlByaW1pdGl2ZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KTogYW55IHtcbiAgICBpbnN0YW5jZVByb3BzLmdlb21ldHJ5ID0gbmV3IHRoaXMuZ2VvbWV0cnlUeXBlKGdlb21ldHJ5UHJvcHMpO1xuICAgIHByaW1pdGl2ZVByb3BzLmdlb21ldHJ5SW5zdGFuY2VzID0gbmV3IENlc2l1bS5HZW9tZXRyeUluc3RhbmNlKGluc3RhbmNlUHJvcHMpO1xuICAgIHByaW1pdGl2ZVByb3BzLmFzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgIGNvbnN0IHByaW1pdGl2ZSA9IG5ldyBDZXNpdW0uUHJpbWl0aXZlKHByaW1pdGl2ZVByb3BzKTtcbiAgICByZXR1cm4gc3VwZXIuYWRkKHByaW1pdGl2ZSk7XG4gIH1cblxuICB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KSB7XG4gICAgaW5zdGFuY2VQcm9wcy5nZW9tZXRyeSA9IG5ldyB0aGlzLmdlb21ldHJ5VHlwZShnZW9tZXRyeVByb3BzKTtcbiAgICBwcmltaXRpdmVQcm9wcy5nZW9tZXRyeUluc3RhbmNlcyA9IG5ldyBDZXNpdW0uR2VvbWV0cnlJbnN0YW5jZShpbnN0YW5jZVByb3BzKTtcbiAgICB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLnJlbW92ZShwcmltaXRpdmUpO1xuICAgIHJldHVybiBzdXBlci5hZGQobmV3IENlc2l1bS5QcmltaXRpdmUocHJpbWl0aXZlUHJvcHMpKTtcbiAgfVxufVxuIl19