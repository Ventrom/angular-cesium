import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
export class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(Cesium.EllipseGeometry, cesiumService);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticEllipseDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticEllipseDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUduRzs7OztLQUlLO0FBRUwsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHFCQUFxQjtJQUNuRSxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OEdBSFUsMEJBQTBCO2tIQUExQiwwQkFBMEI7OzJGQUExQiwwQkFBMEI7a0JBRHRDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG5cbi8qKlxuICsgKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYW4gZWxsaXBzZSBvdmVyIHRoZSBDZXNpdW0gbWFwLlxuICsgKiAgVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHNpbXBsZSBFbGxpcHNlR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxuICsgKiAgVGhpcyBkb2Vzbid0IGFsbG93IHVzIHRvIGNoYW5nZSB0aGUgcG9zaXRpb24sIGNvbG9yLCBldGMuLiBvZiB0aGUgZWxsaXBzZXMuIEZvciB0aGF0IHlvdSBtYXkgdXNlIHRoZSBkeW5hbWljIGVsbGlwc2UgY29tcG9uZW50LlxuICsgKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uRWxsaXBzZUdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19