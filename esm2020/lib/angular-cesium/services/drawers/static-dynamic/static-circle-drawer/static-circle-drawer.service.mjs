import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
export class StaticCircleDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(Cesium.CircleGeometry, cesiumService);
    }
}
StaticCircleDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticCircleDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticCircleDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticCircleDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: StaticCircleDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUVuRzs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxxQkFBcUI7SUFDbEUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM5QyxDQUFDOzt1SEFIVSx5QkFBeUI7MkhBQXpCLHlCQUF5Qjs0RkFBekIseUJBQXlCO2tCQURyQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci9zdGF0aWMtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGUgY2lyY2xlIGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkNpcmNsZUdlb21ldHJ5LCBjZXNpdW1TZXJ2aWNlKTtcbiAgfVxufVxuIl19