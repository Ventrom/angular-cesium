import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
export class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(Cesium.PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    }
}
StaticPolylineDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolylineDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolylineDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolylineDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUVuRzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEscUJBQXFCO0lBQ3BFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsU0FBYyxFQUFFLGFBQWtCLEVBQUUsYUFBa0IsRUFBRSxjQUFtQjtRQUNoRixNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFbkQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQ25CLFNBQVMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDekQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQW1CLEVBQUUsRUFBRTtnQkFDL0QsY0FBYyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDckUsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7O3lIQXBCVSwyQkFBMkI7NkhBQTNCLDJCQUEyQjs0RkFBM0IsMkJBQTJCO2tCQUR2QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGUgcG9seWxpbmUgY29tcG9uZW50LlxuICogIFRoaXMgYWxzbyBhbGxvd3MgdXMgdG8gY2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgcG9seWxpbmVzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgZnVuY3Rpb24gY2FuIG9ubHkgY2hhbmdlIHRoZSBwcmltaXRpdmUgY29sb3IuXG4gICAqL1xuICB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGdlb21ldHJ5UHJvcHM6IGFueSwgaW5zdGFuY2VQcm9wczogYW55LCBwcmltaXRpdmVQcm9wczogYW55KSB7XG4gICAgY29uc3QgY29sb3IgPSBpbnN0YW5jZVByb3BzLmF0dHJpYnV0ZXMuY29sb3IudmFsdWU7XG5cbiAgICBpZiAocHJpbWl0aXZlLnJlYWR5KSB7XG4gICAgICBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvciA9IGNvbG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBDZXNpdW0ud2hlbihwcmltaXRpdmUucmVhZHlQcm9taXNlKS50aGVuKChyZWFkeVByaW1pdGl2ZTogYW55KSA9PiB7XG4gICAgICAgIHJlYWR5UHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKCkuY29sb3IudmFsdWUgPSBjb2xvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cbn1cbiJdfQ==