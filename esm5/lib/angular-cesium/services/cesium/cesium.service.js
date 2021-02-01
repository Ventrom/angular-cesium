import { __decorate, __metadata, __param } from "tslib";
import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
var CesiumService = /** @class */ (function () {
    function CesiumService(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    CesiumService.prototype.init = function (mapContainer, map) {
        var _this = this;
        this.map = map;
        this.ngZone.runOutsideAngular(function () {
            var options = _this.viewerConfiguration ? _this.viewerConfiguration.getNextViewerOptions() : undefined;
            _this.cesiumViewer = _this.viewerFactory.createViewer(mapContainer, options);
            var viewerModifier = _this.viewerConfiguration && _this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(_this.cesiumViewer);
            }
        });
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    CesiumService.prototype.getViewer = function () {
        return this.cesiumViewer;
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    CesiumService.prototype.getScene = function () {
        return this.cesiumViewer.scene;
    };
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    CesiumService.prototype.getCanvas = function () {
        return this.cesiumViewer.canvas;
    };
    CesiumService.prototype.getMap = function () {
        return this.map;
    };
    CesiumService.ctorParameters = function () { return [
        { type: NgZone },
        { type: ViewerFactory },
        { type: ViewerConfiguration, decorators: [{ type: Optional }] }
    ]; };
    CesiumService = __decorate([
        Injectable(),
        __param(2, Optional()),
        __metadata("design:paramtypes", [NgZone, ViewerFactory, ViewerConfiguration])
    ], CesiumService);
    return CesiumService;
}());
export { CesiumService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFHM0Y7O0dBRUc7QUFFSDtJQUlFLHVCQUFvQixNQUFjLEVBQVUsYUFBNEIsRUFBc0IsbUJBQXdDO1FBQWxILFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFzQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO0lBQ3RJLENBQUM7SUFFRCw0QkFBSSxHQUFKLFVBQUssWUFBeUIsRUFBRSxHQUFtQjtRQUFuRCxpQkFXQztRQVZDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztZQUM1QixJQUFNLE9BQU8sR0FBRyxLQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDdkcsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFM0UsSUFBTSxjQUFjLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixJQUFJLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3BHLElBQUksT0FBTyxjQUFjLEtBQUssVUFBVSxFQUFFO2dCQUN4QyxjQUFjLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUNBQVMsR0FBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0NBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlDQUFTLEdBQVQ7UUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBMkIsQ0FBQztJQUN2RCxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDOztnQkExQzJCLE1BQU07Z0JBQXlCLGFBQWE7Z0JBQTJDLG1CQUFtQix1QkFBM0QsUUFBUTs7SUFKeEUsYUFBYTtRQUR6QixVQUFVLEVBQUU7UUFLZ0UsV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FBekQsTUFBTSxFQUF5QixhQUFhLEVBQTJDLG1CQUFtQjtPQUozSCxhQUFhLENBK0N6QjtJQUFELG9CQUFDO0NBQUEsQUEvQ0QsSUErQ0M7U0EvQ1ksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXdlckZhY3RvcnkgfSBmcm9tICcuLi92aWV3ZXItZmFjdG9yeS92aWV3ZXItZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IFZpZXdlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi92aWV3ZXItY29uZmlndXJhdGlvbi92aWV3ZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbi8qKlxuICogIFNlcnZpY2UgdGhhdCBpbml0aWFsaXplIGNlc2l1bSB2aWV3ZXIgYW5kIGV4cG9zZSBjZXNpdW0gdmlld2VyIGFuZCBzY2VuZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bVNlcnZpY2Uge1xuICBwcml2YXRlIGNlc2l1bVZpZXdlcjogYW55O1xuICBwcml2YXRlIG1hcDogQWNNYXBDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSB2aWV3ZXJGYWN0b3J5OiBWaWV3ZXJGYWN0b3J5LCBAT3B0aW9uYWwoKSBwcml2YXRlIHZpZXdlckNvbmZpZ3VyYXRpb246IFZpZXdlckNvbmZpZ3VyYXRpb24pIHtcbiAgfVxuXG4gIGluaXQobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWFwOiBBY01hcENvbXBvbmVudCkge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24gPyB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck9wdGlvbnMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuY2VzaXVtVmlld2VyID0gdGhpcy52aWV3ZXJGYWN0b3J5LmNyZWF0ZVZpZXdlcihtYXBDb250YWluZXIsIG9wdGlvbnMpO1xuXG4gICAgICBjb25zdCB2aWV3ZXJNb2RpZmllciA9IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbiAmJiB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck1vZGlmaWVyKCk7XG4gICAgICBpZiAodHlwZW9mIHZpZXdlck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZpZXdlck1vZGlmaWVyKHRoaXMuY2VzaXVtVmlld2VyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VcbiAgICogQHJldHVybnMgY2VzaXVtVmlld2VyXG4gICAqL1xuICBnZXRWaWV3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9TY2VuZS5odG1sP2NsYXNzRmlsdGVyPXNjZW5lXG4gICAqIEByZXR1cm5zIGNlc2l1bSBzY2VuZVxuICAgKi9cbiAgZ2V0U2NlbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyLnNjZW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2FudmFzX0FQSVxuICAgKiBAcmV0dXJucyBjZXNpdW0gY2FudmFzXG4gICAqL1xuICBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlci5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIH1cblxuICBnZXRNYXAoKTogQWNNYXBDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLm1hcDtcbiAgfVxufVxuIl19