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
}
PolylinePrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolylinePrimitiveDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolylinePrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolylinePrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PolylinePrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUV6Rjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sOEJBQStCLFNBQVEsdUJBQXVCO0lBQ3pFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsR0FBRyxDQUFDLFdBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQWlCLEVBQUUsV0FBZ0I7UUFDeEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEQsSUFBSSxZQUFZLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUTtnQkFDekQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzlELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzdFLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO2FBQzdEO1NBQ0Y7UUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsV0FBZ0I7UUFDaEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztZQUMvQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQztRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7OzRIQTdCVSw4QkFBOEI7Z0lBQTlCLDhCQUE4Qjs0RkFBOUIsOEJBQThCO2tCQUQxQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBvZiBkcmF3aW5nIHBvbHlsaW5lcyBhcyBwcmltaXRpdmVzLlxuICogIFRoaXMgZHJhd2VyIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIHdoZW4gZHJhd2luZyBkeW5hbWljIHBvbHlsaW5lcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5hZGQodGhpcy53aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wcykpO1xuICB9XG5cbiAgdXBkYXRlKGNlc2l1bU9iamVjdDogYW55LCBjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgaWYgKGNlc2l1bVByb3BzLm1hdGVyaWFsIGluc3RhbmNlb2YgQ2VzaXVtLkNvbG9yKSB7XG4gICAgICBpZiAoY2VzaXVtT2JqZWN0Lm1hdGVyaWFsICYmIGNlc2l1bU9iamVjdC5tYXRlcmlhbC51bmlmb3JtcyAmJlxuICAgICAgICBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgaW5zdGFuY2VvZiBDZXNpdW0uQ29sb3IpIHtcbiAgICAgICAgdGhpcy53aXRoQ29sb3JNYXRlcmlhbChjZXNpdW1Qcm9wcyk7XG4gICAgICB9IGVsc2UgaWYgKCFjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IuZXF1YWxzKGNlc2l1bVByb3BzLm1hdGVyaWFsKSkge1xuICAgICAgICBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5tYXRlcmlhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xuICB9XG5cbiAgd2l0aENvbG9yTWF0ZXJpYWwoY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIGlmIChjZXNpdW1Qcm9wcy5tYXRlcmlhbCBpbnN0YW5jZW9mIENlc2l1bS5Db2xvcikge1xuICAgICAgY29uc3QgbWF0ZXJpYWwgPSBDZXNpdW0uTWF0ZXJpYWwuZnJvbVR5cGUoJ0NvbG9yJyk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy5jb2xvciA9IGNlc2l1bVByb3BzLm1hdGVyaWFsO1xuICAgICAgY2VzaXVtUHJvcHMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VzaXVtUHJvcHM7XG4gIH1cbn1cbiJdfQ==