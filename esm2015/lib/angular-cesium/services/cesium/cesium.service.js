import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
export class CesiumService {
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    init(mapContainer, map) {
        this.map = map;
        this.ngZone.runOutsideAngular(() => {
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        });
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas() {
        return this.cesiumViewer.canvas;
    }
    getMap() {
        return this.map;
    }
}
CesiumService.decorators = [
    { type: Injectable }
];
CesiumService.ctorParameters = () => [
    { type: NgZone },
    { type: ViewerFactory },
    { type: ViewerConfiguration, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBRzNGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFJeEIsWUFBb0IsTUFBYyxFQUFVLGFBQTRCLEVBQXNCLG1CQUF3QztRQUFsSCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBc0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtJQUN0SSxDQUFDO0lBRUQsSUFBSSxDQUFDLFlBQXlCLEVBQUUsR0FBbUI7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDdkcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFM0UsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3BHLElBQUksT0FBTyxjQUFjLEtBQUssVUFBVSxFQUFFO2dCQUN4QyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBMkIsQ0FBQztJQUN2RCxDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDOzs7WUEvQ0YsVUFBVTs7O1lBUlUsTUFBTTtZQUNsQixhQUFhO1lBQ2IsbUJBQW1CLHVCQVdpRCxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmlld2VyRmFjdG9yeSB9IGZyb20gJy4uL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld2VyQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3ZpZXdlci1jb25maWd1cmF0aW9uL3ZpZXdlci1jb25maWd1cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FjLW1hcC9hYy1tYXAuY29tcG9uZW50JztcblxuLyoqXG4gKiAgU2VydmljZSB0aGF0IGluaXRpYWxpemUgY2VzaXVtIHZpZXdlciBhbmQgZXhwb3NlIGNlc2l1bSB2aWV3ZXIgYW5kIHNjZW5lLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2VzaXVtU2VydmljZSB7XG4gIHByaXZhdGUgY2VzaXVtVmlld2VyOiBhbnk7XG4gIHByaXZhdGUgbWFwOiBBY01hcENvbXBvbmVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLCBwcml2YXRlIHZpZXdlckZhY3Rvcnk6IFZpZXdlckZhY3RvcnksIEBPcHRpb25hbCgpIHByaXZhdGUgdmlld2VyQ29uZmlndXJhdGlvbjogVmlld2VyQ29uZmlndXJhdGlvbikge1xuICB9XG5cbiAgaW5pdChtYXBDb250YWluZXI6IEhUTUxFbGVtZW50LCBtYXA6IEFjTWFwQ29tcG9uZW50KSB7XG4gICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbiA/IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbi5nZXROZXh0Vmlld2VyT3B0aW9ucygpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jZXNpdW1WaWV3ZXIgPSB0aGlzLnZpZXdlckZhY3RvcnkuY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lciwgb3B0aW9ucyk7XG5cbiAgICAgIGNvbnN0IHZpZXdlck1vZGlmaWVyID0gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uICYmIHRoaXMudmlld2VyQ29uZmlndXJhdGlvbi5nZXROZXh0Vmlld2VyTW9kaWZpZXIoKTtcbiAgICAgIGlmICh0eXBlb2Ygdmlld2VyTW9kaWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmlld2VyTW9kaWZpZXIodGhpcy5jZXNpdW1WaWV3ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZVxuICAgKiBAcmV0dXJucyBjZXNpdW1WaWV3ZXJcbiAgICovXG4gIGdldFZpZXdlcigpIHtcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXI7XG4gIH1cblxuICAvKipcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1NjZW5lLmh0bWw/Y2xhc3NGaWx0ZXI9c2NlbmVcbiAgICogQHJldHVybnMgY2VzaXVtIHNjZW5lXG4gICAqL1xuICBnZXRTY2VuZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXIuc2NlbmU7XG4gIH1cblxuICAvKipcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYW52YXNfQVBJXG4gICAqIEByZXR1cm5zIGNlc2l1bSBjYW52YXNcbiAgICovXG4gIGdldENhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgfVxuXG4gIGdldE1hcCgpOiBBY01hcENvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMubWFwO1xuICB9XG59XG4iXX0=