/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CesiumService } from '../cesium/cesium.service';
import { Injectable } from '@angular/core';
export class MapLayersService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    /**
     * @param {?} dataSources
     * @param {?} zIndex
     * @return {?}
     */
    registerLayerDataSources(dataSources, zIndex) {
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        ds => {
            ds.zIndex = zIndex;
            this.layersDataSources.push(ds);
        }));
    }
    /**
     * @return {?}
     */
    drawAllLayers() {
        this.layersDataSources.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a.zIndex - b.zIndex));
        this.layersDataSources.forEach((/**
         * @param {?} dataSource
         * @return {?}
         */
        (dataSource) => {
            this.cesiumService.getViewer().dataSources.add(dataSource);
        }));
    }
    /**
     * @param {?} dataSources
     * @param {?} newZIndex
     * @return {?}
     */
    updateAndRefresh(dataSources, newZIndex) {
        if (dataSources && dataSources.length) {
            dataSources.forEach((/**
             * @param {?} ds
             * @return {?}
             */
            (ds) => {
                /** @type {?} */
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources[index].zIndex = newZIndex;
                }
            }));
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    }
    /**
     * @param {?} dataSources
     * @return {?}
     */
    removeDataSources(dataSources) {
        dataSources.forEach((/**
         * @param {?} ds
         * @return {?}
         */
        ds => {
            /** @type {?} */
            const index = this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                this.layersDataSources.splice(index, 1);
                this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        }));
    }
}
MapLayersService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
MapLayersService.ctorParameters = () => [
    { type: CesiumService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapLayersService.prototype.layersDataSources;
    /**
     * @type {?}
     * @private
     */
    MapLayersService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE1BQU0sT0FBTyxnQkFBZ0I7Ozs7SUFJM0IsWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFGeEMsc0JBQWlCLEdBQVUsRUFBRSxDQUFDO0lBSXRDLENBQUM7Ozs7OztJQUVELHdCQUF3QixDQUFDLFdBQWtCLEVBQUUsTUFBYztRQUN6RCxXQUFXLENBQUMsT0FBTzs7OztRQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJOzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVELGdCQUFnQixDQUFDLFdBQWtCLEVBQUUsU0FBaUI7UUFDcEQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxXQUFXLENBQUMsT0FBTzs7OztZQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7O3NCQUNuQixLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztpQkFDbEQ7WUFDSCxDQUFDLEVBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7Ozs7O0lBRUQsaUJBQWlCLENBQUMsV0FBa0I7UUFDbEMsV0FBVyxDQUFDLE9BQU87Ozs7UUFBQyxFQUFFLENBQUMsRUFBRTs7a0JBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNoRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDN0Q7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7OztZQTlDRixVQUFVOzs7O1lBSEYsYUFBYTs7Ozs7OztJQU1wQiw2Q0FBc0M7Ozs7O0lBRTFCLHlDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFwTGF5ZXJzU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBsYXllcnNEYXRhU291cmNlczogYW55W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcblxuICB9XG5cbiAgcmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzOiBhbnlbXSwgekluZGV4OiBudW1iZXIpIHtcbiAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcbiAgICAgIGRzLnpJbmRleCA9IHpJbmRleDtcbiAgICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMucHVzaChkcyk7XG4gICAgfSk7XG4gIH1cblxuICBkcmF3QWxsTGF5ZXJzKCkge1xuICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuc29ydCgoYSwgYikgPT4gYS56SW5kZXggLSBiLnpJbmRleCk7XG5cbiAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmZvckVhY2goKGRhdGFTb3VyY2UpID0+IHtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQoZGF0YVNvdXJjZSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVBbmRSZWZyZXNoKGRhdGFTb3VyY2VzOiBhbnlbXSwgbmV3WkluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoZGF0YVNvdXJjZXMgJiYgZGF0YVNvdXJjZXMubGVuZ3RoKSB7XG4gICAgICBkYXRhU291cmNlcy5mb3JFYWNoKChkcykgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuaW5kZXhPZihkcyk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzW2luZGV4XS56SW5kZXggPSBuZXdaSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMucmVtb3ZlQWxsKCk7XG4gICAgICB0aGlzLmRyYXdBbGxMYXllcnMoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVEYXRhU291cmNlcyhkYXRhU291cmNlczogYW55W10pIHtcbiAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5sYXllcnNEYXRhU291cmNlcy5pbmRleE9mKGRzKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMucmVtb3ZlKGRzLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19