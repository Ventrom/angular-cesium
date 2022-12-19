import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
export class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(Cesium.LabelCollection, cesiumService);
    }
}
LabelPrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LabelPrimitiveDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
LabelPrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LabelPrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LabelPrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLXByaW1pdGl2ZS1kcmF3ZXIvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUV6Rjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsdUJBQXVCO0lBQ3RFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7eUhBSFUsMkJBQTJCOzZIQUEzQiwyQkFBMkI7NEZBQTNCLDJCQUEyQjtrQkFEdkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgbGFiZWxzIGFzIHByaW1pdGl2ZXMuXG4gKiAgVGhpcyBkcmF3ZXIgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBMYWJlbERyYXdlclNlcnZpY2Ugd2hlbiBkcmF3aW5nIGR5bmFtaWMgbGFiZWxzLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkxhYmVsQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==