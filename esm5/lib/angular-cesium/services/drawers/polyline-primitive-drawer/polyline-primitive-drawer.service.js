/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
var PolylinePrimitiveDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(PolylinePrimitiveDrawerService, _super);
    function PolylinePrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    };
    /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.update = /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Cesium.Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        _super.prototype.update.call(this, cesiumObject, cesiumProps);
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    PolylinePrimitiveDrawerService.prototype.withColorMaterial = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            /** @type {?} */
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    };
    PolylinePrimitiveDrawerService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    PolylinePrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return PolylinePrimitiveDrawerService;
}(PrimitivesDrawerService));
export { PolylinePrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdEQUFnRCxDQUFDOzs7OztBQU16RjtJQUNvRCwwREFBdUI7SUFDekUsd0NBQVksYUFBNEI7ZUFDdEMsa0JBQU0sTUFBTSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQztJQUNqRCxDQUFDOzs7OztJQUVELDRDQUFHOzs7O0lBQUgsVUFBSSxXQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQzs7Ozs7O0lBRUQsK0NBQU07Ozs7O0lBQU4sVUFBTyxZQUFpQixFQUFFLFdBQWdCO1FBQ3hDLElBQUksV0FBVyxDQUFDLFFBQVEsWUFBWSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVE7Z0JBQ3pELFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssWUFBWSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUM5RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckM7aUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUM3RSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQzthQUM3RDtTQUNGO1FBQ0QsaUJBQU0sTUFBTSxZQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs7OztJQUVELDBEQUFpQjs7OztJQUFqQixVQUFrQixXQUFnQjtRQUNoQyxJQUFJLFdBQVcsQ0FBQyxRQUFRLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRTs7Z0JBQzFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUMvQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQztRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7O2dCQTlCRixVQUFVOzs7O2dCQVBGLGFBQWE7O0lBc0N0QixxQ0FBQztDQUFBLEFBL0JELENBQ29ELHVCQUF1QixHQThCMUU7U0E5QlksOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHBvbHlsaW5lcyBhcyBwcmltaXRpdmVzLlxuICogIFRoaXMgZHJhd2VyIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIHdoZW4gZHJhd2luZyBkeW5hbWljIHBvbHlsaW5lcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5hZGQodGhpcy53aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wcykpO1xuICB9XG5cbiAgdXBkYXRlKGNlc2l1bU9iamVjdDogYW55LCBjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgaWYgKGNlc2l1bVByb3BzLm1hdGVyaWFsIGluc3RhbmNlb2YgQ2VzaXVtLkNvbG9yKSB7XG4gICAgICBpZiAoY2VzaXVtT2JqZWN0Lm1hdGVyaWFsICYmIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3JtcyAmJlxuICAgICAgICBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgaW5zdGFuY2VvZiBDZXNpdW0uQ29sb3IpIHtcbiAgICAgICAgdGhpcy53aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wcyk7XG4gICAgICB9IGVsc2UgaWYgKCFjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IuZXF1YWxzKGNlc2l1bVByb3BzLm1hdGVyaWFsKSkge1xuICAgICAgICBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5tYXRlcmlhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xuICB9XG5cbiAgd2l0aENvbG9yTWF0ZXJpYWwoY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIGlmIChjZXNpdW1Qcm9wcy5tYXRlcmlhbCBpbnN0YW5jZW9mIENlc2l1bS5Db2xvcikge1xuICAgICAgY29uc3QgbWF0ZXJpYWwgPSBDZXNpdW0uTWF0ZXJpYWwuZnJvbVR5cGUoJ0NvbG9yJyk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy5jb2xvciA9IGNlc2l1bVByb3BzLm1hdGVyaWFsO1xuICAgICAgY2VzaXVtUHJvcHMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VzaXVtUHJvcHM7XG4gIH1cbn1cbiJdfQ==