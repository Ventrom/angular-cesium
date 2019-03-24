/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    CesiumService.prototype.init = /**
     * @param {?} mapContainer
     * @param {?} map
     * @return {?}
     */
    function (mapContainer, map) {
        var _this = this;
        this.map = map;
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var options = _this.viewerConfiguration ? _this.viewerConfiguration.getNextViewerOptions() : undefined;
            _this.cesiumViewer = _this.viewerFactory.createViewer(mapContainer, options);
            /** @type {?} */
            var viewerModifier = _this.viewerConfiguration && _this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(_this.cesiumViewer);
            }
        }));
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    CesiumService.prototype.getViewer = /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @return {?} cesiumViewer
     */
    function () {
        return this.cesiumViewer;
    };
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    CesiumService.prototype.getScene = /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @return {?} cesium scene
     */
    function () {
        return this.cesiumViewer.scene;
    };
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    CesiumService.prototype.getCanvas = /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @return {?} cesium canvas
     */
    function () {
        return (/** @type {?} */ (this.cesiumViewer.canvas));
    };
    /**
     * @return {?}
     */
    CesiumService.prototype.getMap = /**
     * @return {?}
     */
    function () {
        return this.map;
    };
    CesiumService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CesiumService.ctorParameters = function () { return [
        { type: NgZone },
        { type: ViewerFactory },
        { type: ViewerConfiguration, decorators: [{ type: Optional }] }
    ]; };
    return CesiumService;
}());
export { CesiumService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDekUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0RBQXNELENBQUM7Ozs7QUFNM0Y7SUFLRSx1QkFBb0IsTUFBYyxFQUFVLGFBQTRCLEVBQXNCLG1CQUF3QztRQUFsSCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFBc0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtJQUN0SSxDQUFDOzs7Ozs7SUFFRCw0QkFBSTs7Ozs7SUFBSixVQUFLLFlBQXlCLEVBQUUsR0FBbUI7UUFBbkQsaUJBV0M7UUFWQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCOzs7UUFBQzs7Z0JBQ3RCLE9BQU8sR0FBRyxLQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3RHLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztnQkFFckUsY0FBYyxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsSUFBSSxLQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUU7WUFDbkcsSUFBSSxPQUFPLGNBQWMsS0FBSyxVQUFVLEVBQUU7Z0JBQ3hDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O09BR0c7Ozs7O0lBQ0gsaUNBQVM7Ozs7SUFBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHOzs7OztJQUNILGdDQUFROzs7O0lBQVI7UUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7Ozs7O0lBQ0gsaUNBQVM7Ozs7SUFBVDtRQUNFLE9BQU8sbUJBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQXFCLENBQUM7SUFDdkQsQ0FBQzs7OztJQUVELDhCQUFNOzs7SUFBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsQixDQUFDOztnQkEvQ0YsVUFBVTs7OztnQkFSVSxNQUFNO2dCQUNsQixhQUFhO2dCQUNiLG1CQUFtQix1QkFXaUQsUUFBUTs7SUEyQ3JGLG9CQUFDO0NBQUEsQUFoREQsSUFnREM7U0EvQ1ksYUFBYTs7Ozs7O0lBQ3hCLHFDQUEwQjs7Ozs7SUFDMUIsNEJBQTRCOzs7OztJQUVoQiwrQkFBc0I7Ozs7O0lBQUUsc0NBQW9DOzs7OztJQUFFLDRDQUE0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXdlckZhY3RvcnkgfSBmcm9tICcuLi92aWV3ZXItZmFjdG9yeS92aWV3ZXItZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IFZpZXdlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi92aWV3ZXItY29uZmlndXJhdGlvbi92aWV3ZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbi8qKlxuICogIFNlcnZpY2UgdGhhdCBpbml0aWFsaXplIGNlc2l1bSB2aWV3ZXIgYW5kIGV4cG9zZSBjZXNpdW0gdmlld2VyIGFuZCBzY2VuZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bVNlcnZpY2Uge1xuICBwcml2YXRlIGNlc2l1bVZpZXdlcjogYW55O1xuICBwcml2YXRlIG1hcDogQWNNYXBDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSB2aWV3ZXJGYWN0b3J5OiBWaWV3ZXJGYWN0b3J5LCBAT3B0aW9uYWwoKSBwcml2YXRlIHZpZXdlckNvbmZpZ3VyYXRpb246IFZpZXdlckNvbmZpZ3VyYXRpb24pIHtcbiAgfVxuXG4gIGluaXQobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWFwOiBBY01hcENvbXBvbmVudCkge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24gPyB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck9wdGlvbnMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuY2VzaXVtVmlld2VyID0gdGhpcy52aWV3ZXJGYWN0b3J5LmNyZWF0ZVZpZXdlcihtYXBDb250YWluZXIsIG9wdGlvbnMpO1xuXG4gICAgICBjb25zdCB2aWV3ZXJNb2RpZmllciA9IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbiAmJiB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck1vZGlmaWVyKCk7XG4gICAgICBpZiAodHlwZW9mIHZpZXdlck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZpZXdlck1vZGlmaWVyKHRoaXMuY2VzaXVtVmlld2VyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VcbiAgICogQHJldHVybnMgY2VzaXVtVmlld2VyXG4gICAqL1xuICBnZXRWaWV3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9TY2VuZS5odG1sP2NsYXNzRmlsdGVyPXNjZW5lXG4gICAqIEByZXR1cm5zIGNlc2l1bSBzY2VuZVxuICAgKi9cbiAgZ2V0U2NlbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyLnNjZW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2FudmFzX0FQSVxuICAgKiBAcmV0dXJucyBjZXNpdW0gY2FudmFzXG4gICAqL1xuICBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlci5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIH1cblxuICBnZXRNYXAoKTogQWNNYXBDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLm1hcDtcbiAgfVxufVxuIl19