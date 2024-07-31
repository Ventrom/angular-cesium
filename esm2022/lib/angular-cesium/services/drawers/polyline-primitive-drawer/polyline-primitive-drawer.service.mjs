import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
export class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    add(cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    }
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
    withColorMaterial(cesiumProps) {
        if (cesiumProps.material instanceof Cesium.Color) {
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinePrimitiveDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinePrimitiveDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: PolylinePrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUV6Rjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sOEJBQStCLFNBQVEsdUJBQXVCO0lBQ3pFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsR0FBRyxDQUFDLFdBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQWlCLEVBQUUsV0FBZ0I7UUFDeEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqRCxJQUFJLFlBQVksQ0FBQyxRQUFRLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRO2dCQUN6RCxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMvRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsQ0FBQztpQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztnQkFDOUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDOUQsQ0FBQztRQUNILENBQUM7UUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsV0FBZ0I7UUFDaEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQy9DLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzhHQTdCVSw4QkFBOEI7a0hBQTlCLDhCQUE4Qjs7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgb2YgZHJhd2luZyBwb2x5bGluZXMgYXMgcHJpbWl0aXZlcy5cbiAqICBUaGlzIGRyYXdlciBpcyBtb3JlIGVmZmljaWVudCB0aGFuIFBvbHlsaW5lRHJhd2VyU2VydmljZSB3aGVuIGRyYXdpbmcgZHluYW1pYyBwb2x5bGluZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUG9seWxpbmVDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxuXG4gIGFkZChjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24uYWRkKHRoaXMud2l0aENvbG9yTWF0ZXJpYWwoY2VzaXVtUHJvcHMpKTtcbiAgfVxuXG4gIHVwZGF0ZShjZXNpdW1PYmplY3Q6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIGlmIChjZXNpdW1Qcm9wcy5tYXRlcmlhbCBpbnN0YW5jZW9mIENlc2l1bS5Db2xvcikge1xuICAgICAgaWYgKGNlc2l1bU9iamVjdC5tYXRlcmlhbCAmJiBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMgJiZcbiAgICAgICAgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yIGluc3RhbmNlb2YgQ2VzaXVtLkNvbG9yKSB7XG4gICAgICAgIHRoaXMud2l0aENvbG9yTWF0ZXJpYWwoY2VzaXVtUHJvcHMpO1xuICAgICAgfSBlbHNlIGlmICghY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yLmVxdWFscyhjZXNpdW1Qcm9wcy5tYXRlcmlhbCkpIHtcbiAgICAgICAgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMubWF0ZXJpYWw7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyLnVwZGF0ZShjZXNpdW1PYmplY3QsIGNlc2l1bVByb3BzKTtcbiAgfVxuXG4gIHdpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBpZiAoY2VzaXVtUHJvcHMubWF0ZXJpYWwgaW5zdGFuY2VvZiBDZXNpdW0uQ29sb3IpIHtcbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gQ2VzaXVtLk1hdGVyaWFsLmZyb21UeXBlKCdDb2xvcicpO1xuICAgICAgbWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5tYXRlcmlhbDtcbiAgICAgIGNlc2l1bVByb3BzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xuICB9XG59XG4iXX0=