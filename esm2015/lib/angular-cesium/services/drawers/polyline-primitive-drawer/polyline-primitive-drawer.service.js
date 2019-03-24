/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
export class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    }
    /**
     * @param {?} cesiumObject
     * @param {?} cesiumProps
     * @return {?}
     */
    update(cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Cesium.Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        super.update(cesiumObject, cesiumProps);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    withColorMaterial(cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            /** @type {?} */
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    }
}
PolylinePrimitiveDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
PolylinePrimitiveDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7Ozs7O0FBT3pGLE1BQU0sT0FBTyw4QkFBK0IsU0FBUSx1QkFBdUI7Ozs7SUFDekUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7Ozs7O0lBRUQsR0FBRyxDQUFDLFdBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDOzs7Ozs7SUFFRCxNQUFNLENBQUMsWUFBaUIsRUFBRSxXQUFnQjtRQUN4QyxJQUFJLFdBQVcsQ0FBQyxRQUFRLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNoRCxJQUFJLFlBQVksQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRO2dCQUN6RCxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDOUQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3JDO2lCQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDN0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDN0Q7U0FDRjtRQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Ozs7O0lBRUQsaUJBQWlCLENBQUMsV0FBZ0I7UUFDaEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUU7O2tCQUMxQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQ2xELFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDL0MsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDakM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7WUE5QkYsVUFBVTs7OztZQVBGLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgcG9seWxpbmVzIGFzIHByaW1pdGl2ZXMuXG4gKiAgVGhpcyBkcmF3ZXIgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBQb2x5bGluZURyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgcG9seWxpbmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLmFkZCh0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKSk7XG4gIH1cblxuICB1cGRhdGUoY2VzaXVtT2JqZWN0OiBhbnksIGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBpZiAoY2VzaXVtUHJvcHMubWF0ZXJpYWwgaW5zdGFuY2VvZiBDZXNpdW0uQ29sb3IpIHtcbiAgICAgIGlmIChjZXNpdW1PYmplY3QubWF0ZXJpYWwgJiYgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zICYmXG4gICAgICAgIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvciBpbnN0YW5jZW9mIENlc2l1bS5Db2xvcikge1xuICAgICAgICB0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKTtcbiAgICAgIH0gZWxzZSBpZiAoIWNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvci5lcXVhbHMoY2VzaXVtUHJvcHMubWF0ZXJpYWwpKSB7XG4gICAgICAgIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvciA9IGNlc2l1bVByb3BzLm1hdGVyaWFsO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci51cGRhdGUoY2VzaXVtT2JqZWN0LCBjZXNpdW1Qcm9wcyk7XG4gIH1cblxuICB3aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgaWYgKGNlc2l1bVByb3BzLm1hdGVyaWFsIGluc3RhbmNlb2YgQ2VzaXVtLkNvbG9yKSB7XG4gICAgICBjb25zdCBtYXRlcmlhbCA9IENlc2l1bS5NYXRlcmlhbC5mcm9tVHlwZSgnQ29sb3InKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMubWF0ZXJpYWw7XG4gICAgICBjZXNpdW1Qcm9wcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgIH1cblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxufVxuIl19