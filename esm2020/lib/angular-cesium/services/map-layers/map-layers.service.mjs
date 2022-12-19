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
        dataSources.forEach(ds => {
            const index = this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                this.layersDataSources.splice(index, 1);
                this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        });
    }
}
MapLayersService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapLayersService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
MapLayersService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapLayersService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: MapLayersService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHM0MsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUZ4QyxzQkFBaUIsR0FBVSxFQUFFLENBQUM7SUFJdEMsQ0FBQztJQUVELHdCQUF3QixDQUFDLFdBQWtCLEVBQUUsTUFBYztRQUN6RCxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQWtCLEVBQUUsU0FBaUI7UUFDcEQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztpQkFDbEQ7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxXQUFrQjtRQUNsQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs4R0E3Q1UsZ0JBQWdCO2tIQUFoQixnQkFBZ0I7NEZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwTGF5ZXJzU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBsYXllcnNEYXRhU291cmNlczogYW55W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcblxuICB9XG5cbiAgcmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzOiBhbnlbXSwgekluZGV4OiBudW1iZXIpIHtcbiAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcbiAgICAgIGRzLnpJbmRleCA9IHpJbmRleDtcbiAgICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMucHVzaChkcyk7XG4gICAgfSk7XG4gIH1cblxuICBkcmF3QWxsTGF5ZXJzKCkge1xuICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleCk7XG5cbiAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmZvckVhY2goKGRhdGFTb3VyY2UpID0+IHtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQoZGF0YVNvdXJjZSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVBbmRSZWZyZXNoKGRhdGFTb3VyY2VzOiBhbnlbXSwgbmV3WkluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoZGF0YVNvdXJjZXMgJiYgZGF0YVNvdXJjZXMubGVuZ3RoKSB7XG4gICAgICBkYXRhU291cmNlcy5mb3JFYWNoKChkcykgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuaW5kZXhPZihkcyk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzW2luZGV4XS56SW5kZXggPSBuZXdaSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMucmVtb3ZlQWxsKCk7XG4gICAgICB0aGlzLmRyYXdBbGxMYXllcnMoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVEYXRhU291cmNlcyhkYXRhU291cmNlczogYW55W10pIHtcbiAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5sYXllcnNEYXRhU291cmNlcy5pbmRleE9mKGRzKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMucmVtb3ZlKGRzLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19