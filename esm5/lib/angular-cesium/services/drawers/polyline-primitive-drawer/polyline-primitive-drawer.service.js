import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
var PolylinePrimitiveDrawerService = /** @class */ (function (_super) {
    __extends(PolylinePrimitiveDrawerService, _super);
    function PolylinePrimitiveDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineCollection, cesiumService) || this;
    }
    PolylinePrimitiveDrawerService.prototype.add = function (cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    };
    PolylinePrimitiveDrawerService.prototype.update = function (cesiumObject, cesiumProps) {
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
    PolylinePrimitiveDrawerService.prototype.withColorMaterial = function (cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            var material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    };
    PolylinePrimitiveDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    PolylinePrimitiveDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], PolylinePrimitiveDrawerService);
    return PolylinePrimitiveDrawerService;
}(PrimitivesDrawerService));
export { PolylinePrimitiveDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFFekY7OztHQUdHO0FBRUg7SUFBb0Qsa0RBQXVCO0lBQ3pFLHdDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUM7SUFDakQsQ0FBQztJQUVELDRDQUFHLEdBQUgsVUFBSSxXQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELCtDQUFNLEdBQU4sVUFBTyxZQUFpQixFQUFFLFdBQWdCO1FBQ3hDLElBQUksV0FBVyxDQUFDLFFBQVEsWUFBWSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVE7Z0JBQ3pELFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssWUFBWSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUM5RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDckM7aUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUM3RSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQzthQUM3RDtTQUNGO1FBQ0QsaUJBQU0sTUFBTSxZQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsMERBQWlCLEdBQWpCLFVBQWtCLFdBQWdCO1FBQ2hDLElBQUksV0FBVyxDQUFDLFFBQVEsWUFBWSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hELElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDL0MsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDakM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztnQkE1QjBCLGFBQWE7O0lBRDdCLDhCQUE4QjtRQUQxQyxVQUFVLEVBQUU7eUNBRWdCLGFBQWE7T0FEN0IsOEJBQThCLENBOEIxQztJQUFELHFDQUFDO0NBQUEsQUE5QkQsQ0FBb0QsdUJBQXVCLEdBOEIxRTtTQTlCWSw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgcG9seWxpbmVzIGFzIHByaW1pdGl2ZXMuXG4gKiAgVGhpcyBkcmF3ZXIgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBQb2x5bGluZURyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgcG9seWxpbmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLmFkZCh0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKSk7XG4gIH1cblxuICB1cGRhdGUoY2VzaXVtT2JqZWN0OiBhbnksIGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBpZiAoY2VzaXVtUHJvcHMubWF0ZXJpYWwgaW5zdGFuY2VvZiBDZXNpdW0uQ29sb3IpIHtcbiAgICAgIGlmIChjZXNpdW1PYmplY3QubWF0ZXJpYWwgJiYgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zICYmXG4gICAgICAgIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvciBpbnN0YW5jZW9mIENlc2l1bS5Db2xvcikge1xuICAgICAgICB0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKTtcbiAgICAgIH0gZWxzZSBpZiAoIWNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvci5lcXVhbHMoY2VzaXVtUHJvcHMubWF0ZXJpYWwpKSB7XG4gICAgICAgIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvciA9IGNlc2l1bVByb3BzLm1hdGVyaWFsO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci51cGRhdGUoY2VzaXVtT2JqZWN0LCBjZXNpdW1Qcm9wcyk7XG4gIH1cblxuICB3aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgaWYgKGNlc2l1bVByb3BzLm1hdGVyaWFsIGluc3RhbmNlb2YgQ2VzaXVtLkNvbG9yKSB7XG4gICAgICBjb25zdCBtYXRlcmlhbCA9IENlc2l1bS5NYXRlcmlhbC5mcm9tVHlwZSgnQ29sb3InKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMubWF0ZXJpYWw7XG4gICAgICBjZXNpdW1Qcm9wcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgIH1cblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxufVxuIl19