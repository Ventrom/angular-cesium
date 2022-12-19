import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
export class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(Cesium.PolygonGeometry, cesiumService);
    }
}
StaticPolygonDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolygonDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolygonDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolygonDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticPolygonDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDOzs7QUFHbkc7Ozs7R0FJRztBQUVILE1BQU0sT0FBTywwQkFBMkIsU0FBUSxxQkFBcUI7SUFDbkUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvQyxDQUFDOzt3SEFIVSwwQkFBMEI7NEhBQTFCLDBCQUEwQjs0RkFBMUIsMEJBQTBCO2tCQUR0QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKyBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBhIHBvbHlnb24gb3ZlciB0aGUgQ2VzaXVtIG1hcC5cbiArIFRoaXMgaW1wbGVtZW50YXRpb24gdXNlcyBzaW1wbGUgUG9seWdvbkdlb21ldHJ5IGFuZCBQcmltaXRpdmUgcGFyYW1ldGVycy5cbiArIFRoaXMgZG9lc24ndCBhbGxvdyB1cyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gb2YgdGhlIHBvbHlnb25zLiBGb3IgdGhhdCB5b3UgbWF5IHVzZSB0aGUgZHluYW1pYyBwb2x5Z29uIGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5Z29uR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xuICB9XG59XG4iXX0=