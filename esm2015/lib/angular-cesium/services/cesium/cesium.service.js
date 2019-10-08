/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
export class CesiumService {
    /**
     * @param {?} ngZone
     * @param {?} viewerFactory
     * @param {?} viewerConfiguration
     */
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    init(mapContainer, map) {
        this.map = map;
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            /** @type {?} */
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        }));
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    getCanvas() {
        return (/** @type {?} */ (this.cesiumViewer.canvas));
    }
    /**
     * @return {?}
     */
    getMap() {
        return this.map;
    }
}
CesiumService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CesiumService.ctorParameters = () => [
    { type: NgZone },
    { type: ViewerFactory },
    { type: ViewerConfiguration, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    CesiumService.prototype.cesiumViewer;
    /**
     * @type {?}
     * @private
     */
    CesiumService.prototype.map;
    /**
     * @type {?}
     * @private
     */
    CesiumService.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    CesiumService.prototype.viewerFactory;
    /**
     * @type {?}
     * @private
     */
    CesiumService.prototype.viewerConfiguration;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0RBQXNELENBQUM7Ozs7QUFPM0YsTUFBTSxPQUFPLGFBQWE7Ozs7OztJQUl4QixZQUFvQixNQUFjLEVBQVUsYUFBNEIsRUFBc0IsbUJBQXdDO1FBQWxILFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFzQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO0lBQ3RJLENBQUM7Ozs7OztJQUVELElBQUksQ0FBQyxZQUF5QixFQUFFLEdBQW1CO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7OztRQUFDLEdBQUcsRUFBRTs7a0JBQzNCLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3RHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztrQkFFckUsY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUU7WUFDbkcsSUFBSSxPQUFPLGNBQWMsS0FBSyxVQUFVLEVBQUU7Z0JBQ3hDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBTUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDOzs7OztJQU1ELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUM7Ozs7O0lBTUQsU0FBUztRQUNQLE9BQU8sbUJBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQXFCLENBQUM7SUFDdkQsQ0FBQzs7OztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQzs7O1lBL0NGLFVBQVU7Ozs7WUFSVSxNQUFNO1lBQ2xCLGFBQWE7WUFDYixtQkFBbUIsdUJBV2lELFFBQVE7Ozs7Ozs7SUFIbkYscUNBQTBCOzs7OztJQUMxQiw0QkFBNEI7Ozs7O0lBRWhCLCtCQUFzQjs7Ozs7SUFBRSxzQ0FBb0M7Ozs7O0lBQUUsNENBQTREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmlld2VyRmFjdG9yeSB9IGZyb20gJy4uL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3ZpZXdlci1jb25maWd1cmF0aW9uL3ZpZXdlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuLyoqXG4gKiAgU2VydmljZSB0aGF0IGluaXRpYWxpemUgY2VzaXVtIHZpZXdlciBhbmQgZXhwb3NlIGNlc2l1bSB2aWV3ZXIgYW5kIHNjZW5lLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2VzaXVtU2VydmljZSB7XG4gIHByaXZhdGUgY2VzaXVtVmlld2VyOiBhbnk7XG4gIHByaXZhdGUgbWFwOiBBY01hcENvbXBvbmVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLCBwcml2YXRlIHZpZXdlckZhY3Rvcnk6IFZpZXdlckZhY3RvcnksIEBPcHRpb25hbCgpIHByaXZhdGUgdmlld2VyQ29uZmlndXJhdGlvbjogVmlld2VyQ29uZmlndXJhdGlvbikge1xuICB9XG5cbiAgaW5pdChtYXBDb250YWluZXI6IEhUTUxFbGVtZW50LCBtYXA6IEFjTWFwQ29tcG9uZW50KSB7XG4gICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbiA/IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbi5nZXROZXh0Vmlld2VyT3B0aW9ucygpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jZXNpdW1WaWV3ZXIgPSB0aGlzLnZpZXdlckZhY3RvcnkuY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lciwgb3B0aW9ucyk7XG5cbiAgICAgIGNvbnN0IHZpZXdlck1vZGlmaWVyID0gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uICYmIHRoaXMudmlld2VyQ29uZmlndXJhdGlvbi5nZXROZXh0Vmlld2VyTW9kaWZpZXIoKTtcbiAgICAgIGlmICh0eXBlb2Ygdmlld2VyTW9kaWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmlld2VyTW9kaWZpZXIodGhpcy5jZXNpdW1WaWV3ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZVxuICAgKiBAcmV0dXJucyBjZXNpdW1WaWV3ZXJcbiAgICovXG4gIGdldFZpZXdlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXI7XG4gIH1cblxuICAvKipcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1NjZW5lLmh0bWw/Y2xhc3NGaWx0ZXI9c2NlbmVcbiAgICogQHJldHVybnMgY2VzaXVtIHNjZW5lXG4gICAqL1xuICBnZXRTY2VuZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXIuc2NlbmU7XG4gIH1cblxuICAvKipcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYW52YXNfQVBJXG4gICAqIEByZXR1cm5zIGNlc2l1bSBjYW52YXNcbiAgICovXG4gIGdldENhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgfVxuXG4gIGdldE1hcCgpOiBBY01hcENvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMubWFwO1xuICB9XG59XG4iXX0=