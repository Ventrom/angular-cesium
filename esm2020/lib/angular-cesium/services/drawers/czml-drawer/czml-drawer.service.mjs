import { Injectable } from '@angular/core';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
export class CzmlDrawerService extends BasicDrawerService {
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    init(options) {
        const dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
}
CzmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CzmlDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CzmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CzmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CzmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7OztBQUcxRTs7R0FFRztBQUVILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxrQkFBa0I7SUFJdkQsWUFDVSxhQUE0QjtRQUVwQyxLQUFLLEVBQUUsQ0FBQztRQUZBLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBR3RDLENBQUM7SUFHRCxJQUFJLENBQUMsT0FBK0I7UUFDbEMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELDZDQUE2QztJQUM3QyxHQUFHLENBQUMsV0FBZ0I7UUFFbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVyxFQUFFLFdBQWdCO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVc7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQWtCO1FBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7SUFDNUMsQ0FBQzs7K0dBN0NVLGlCQUFpQjttSEFBakIsaUJBQWlCOzRGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbnRpdGllcy1kcmF3ZXItb3B0aW9ucyc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGN6bWwgZGF0YVNvdXJjZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDem1sRHJhd2VyU2VydmljZSBleHRlbmRzIEJhc2ljRHJhd2VyU2VydmljZSB7XG5cbiAgY3ptbFN0cmVhbTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG5cbiAgaW5pdChvcHRpb25zPzogRW50aXRpZXNEcmF3ZXJPcHRpb25zKSB7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSBbXTtcblxuICAgIHRoaXMuY3ptbFN0cmVhbSA9IG5ldyBDZXNpdW0uQ3ptbERhdGFTb3VyY2UoJ2N6bWwnKTtcblxuICAgIGRhdGFTb3VyY2VzLnB1c2godGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQodGhpcy5jem1sU3RyZWFtKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlcztcbiAgfVxuXG4gIC8vIHJldHVybnMgdGhlIHBhY2tldCwgcHJvdmlkZWQgYnkgdGhlIHN0cmVhbVxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG5cbiAgICB0aGlzLmN6bWxTdHJlYW0ucHJvY2VzcyhjZXNpdW1Qcm9wcy5jem1sUGFja2V0KTtcblxuICAgIHJldHVybiBjZXNpdW1Qcm9wcztcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5wcm9jZXNzKGNlc2l1bVByb3BzLmN6bWxQYWNrZXQpO1xuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnJlbW92ZUJ5SWQoZW50aXR5LmFjRW50aXR5LmlkKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBzZXRTaG93KHNob3dWYWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5zaG93ID0gc2hvd1ZhbHVlO1xuICB9XG5cbn1cblxuXG4iXX0=