import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
export class DynamicPolylineDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicPolylineDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicPolylineDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DynamicPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9keW5hbWljLXBvbHlsaW5lLWRyYXdlci9keW5hbWljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbURBQW1ELENBQUM7OztBQUU1Rjs7R0FFRztBQUVILE1BQU0sT0FBTyw0QkFBNkIsU0FBUSx1QkFBdUI7SUFDdkUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7OEdBSFUsNEJBQTRCO2tIQUE1Qiw0QkFBNEI7OzJGQUE1Qiw0QkFBNEI7a0JBRHhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgZHluYW1pYyB2ZXJzaW9uIG9mIHRoZSBwb2x5bGluZSBjb21wb25lbnQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==