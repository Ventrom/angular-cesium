import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
export class HtmlDrawerService extends PrimitivesDrawerService {
    constructor(_cesiumService) {
        super(Cesium.HtmlCollection, _cesiumService);
        this._cesiumService = _cesiumService;
    }
    add(cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        return super.add(cesiumProps);
    }
}
HtmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: HtmlDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
HtmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: HtmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: HtmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUd6RixNQUFNLE9BQU8saUJBQWtCLFNBQVEsdUJBQXVCO0lBQzVELFlBQW9CLGNBQTZCO1FBQy9DLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRDNCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRWpELENBQUM7SUFFRCxHQUFHLENBQUMsV0FBZ0I7UUFDbEIsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELFdBQVcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMxRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7K0dBVFUsaUJBQWlCO21IQUFqQixpQkFBaUI7NEZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLkh0bWxDb2xsZWN0aW9uLCBfY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY2VzaXVtUHJvcHMuc2NlbmUgPSB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY2VzaXVtUHJvcHMubWFwQ29udGFpbmVyID0gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKTtcbiAgICByZXR1cm4gc3VwZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgfVxufVxuIl19