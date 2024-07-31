import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
export class MapLayersService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    registerLayerDataSources(dataSources, zIndex) {
        dataSources.forEach(ds => {
            ds.zIndex = zIndex;
            this.layersDataSources.push(ds);
        });
    }
    drawAllLayers() {
        this.layersDataSources.sort((a, b) => a.zIndex - b.zIndex);
        this.layersDataSources.forEach((dataSource) => {
            this.cesiumService.getViewer().dataSources.add(dataSource);
        });
    }
    updateAndRefresh(dataSources, newZIndex) {
        if (dataSources && dataSources.length) {
            dataSources.forEach((ds) => {
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources[index].zIndex = newZIndex;
                }
            });
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    }
    removeDataSources(dataSources) {
        if (Array.isArray(dataSources)) {
            dataSources.forEach(ds => {
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources.splice(index, 1);
                    this.cesiumService.getViewer().dataSources.remove(ds, true);
                }
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapLayersService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapLayersService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: MapLayersService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHM0MsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUZ4QyxzQkFBaUIsR0FBVSxFQUFFLENBQUM7SUFJdEMsQ0FBQztJQUVELHdCQUF3QixDQUFDLFdBQWtCLEVBQUUsTUFBYztRQUN6RCxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQWtCLEVBQUUsU0FBaUI7UUFDcEQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3RDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtnQkFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakQsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ25ELENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLFdBQWtCO1FBQ2xDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQy9CLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQzs4R0EvQ1UsZ0JBQWdCO2tIQUFoQixnQkFBZ0I7OzJGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcExheWVyc1NlcnZpY2Uge1xuXG4gIHByaXZhdGUgbGF5ZXJzRGF0YVNvdXJjZXM6IGFueVtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG5cbiAgfVxuXG4gIHJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkYXRhU291cmNlczogYW55W10sIHpJbmRleDogbnVtYmVyKSB7XG4gICAgZGF0YVNvdXJjZXMuZm9yRWFjaChkcyA9PiB7XG4gICAgICBkcy56SW5kZXggPSB6SW5kZXg7XG4gICAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnB1c2goZHMpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJhd0FsbExheWVycygpIHtcbiAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpO1xuXG4gICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5mb3JFYWNoKChkYXRhU291cmNlKSA9PiB7XG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMuYWRkKGRhdGFTb3VyY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQW5kUmVmcmVzaChkYXRhU291cmNlczogYW55W10sIG5ld1pJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKGRhdGFTb3VyY2VzICYmIGRhdGFTb3VyY2VzLmxlbmd0aCkge1xuICAgICAgZGF0YVNvdXJjZXMuZm9yRWFjaCgoZHMpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmluZGV4T2YoZHMpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlc1tpbmRleF0uekluZGV4ID0gbmV3WkluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLnJlbW92ZUFsbCgpO1xuICAgICAgdGhpcy5kcmF3QWxsTGF5ZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRGF0YVNvdXJjZXMoZGF0YVNvdXJjZXM6IGFueVtdKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVNvdXJjZXMpKSB7XG4gICAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmluZGV4T2YoZHMpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5yZW1vdmUoZHMsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==