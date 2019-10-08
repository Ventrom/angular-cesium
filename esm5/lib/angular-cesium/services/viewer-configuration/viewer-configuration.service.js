/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
var ViewerConfiguration = /** @class */ (function () {
    function ViewerConfiguration() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    Object.defineProperty(ViewerConfiguration.prototype, "viewerOptions", {
        get: /**
         * @return {?}
         */
        function () {
            return this._viewerOptions;
        },
        /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._viewerOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ViewerConfiguration.prototype.getNextViewerOptions = /**
     * @return {?}
     */
    function () {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    };
    Object.defineProperty(ViewerConfiguration.prototype, "viewerModifier", {
        get: /**
         * @return {?}
         */
        function () {
            return this._viewerModifier;
        },
        /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._viewerModifier = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ViewerConfiguration.prototype.getNextViewerModifier = /**
     * @return {?}
     */
    function () {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    };
    ViewerConfiguration.decorators = [
        { type: Injectable }
    ];
    return ViewerConfiguration;
}());
export { ViewerConfiguration };
if (false) {
    /**
     * cesium viewer options According to [Viewer]{\@link https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=vie}
     * @type {?}
     * @private
     */
    ViewerConfiguration.prototype._viewerOptions;
    /**
     * @type {?}
     * @private
     */
    ViewerConfiguration.prototype._viewerModifier;
    /**
     * @type {?}
     * @private
     */
    ViewerConfiguration.prototype.nextViewerOptionsIndex;
    /**
     * @type {?}
     * @private
     */
    ViewerConfiguration.prototype.nextViewerModifierIndex;
    /** @type {?} */
    ViewerConfiguration.prototype.Ï;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1jb25maWd1cmF0aW9uL3ZpZXdlci1jb25maWd1cmF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFjM0M7SUFBQTtRQU9VLDJCQUFzQixHQUFHLENBQUMsQ0FBQztRQUMzQiw0QkFBdUIsR0FBRyxDQUFDLENBQUM7SUE2Q3RDLENBQUM7SUEzQ0Msc0JBQUksOENBQWE7Ozs7UUFBakI7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQztRQVlEOzs7O1dBSUc7Ozs7Ozs7O1FBQ0gsVUFBa0IsS0FBd0I7WUFDeEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDOUIsQ0FBQzs7O09BbkJBOzs7O0lBSUQsa0RBQW9COzs7SUFBcEI7UUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLFlBQVksS0FBSyxFQUFFO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBV0Qsc0JBQUksK0NBQWM7Ozs7UUFBbEI7WUFDRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDOUIsQ0FBQztRQVVEOzs7O1dBSUc7Ozs7Ozs7O1FBQ0gsVUFBbUIsS0FBNEI7WUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDL0IsQ0FBQzs7O09BakJBOzs7O0lBRUQsbURBQXFCOzs7SUFBckI7UUFDRSxJQUFJLElBQUksQ0FBQyxlQUFlLFlBQVksS0FBSyxFQUFFO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1NBQzdEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDN0I7SUFDSCxDQUFDOztnQkEzQ0YsVUFBVTs7SUFxRFgsMEJBQUM7Q0FBQSxBQXJERCxJQXFEQztTQXBEWSxtQkFBbUI7Ozs7Ozs7SUFJOUIsNkNBQTBDOzs7OztJQUMxQyw4Q0FBK0M7Ozs7O0lBQy9DLHFEQUFtQzs7Ozs7SUFDbkMsc0RBQW9DOztJQU1wQyxnQ0FBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBzZXR0aW5nIGNlc2l1bSB2aWV3ZXIgbWFwIG9wdGlvbnMuXG4gKiBkZWZhdWx0eSBhbmd1bGFyLWNlc2l1bSBkb2VzbnQgcHJvdmlkZSB0aGlzIHNlcnZpY2UgYW5kIHZpZXdlciBpcyBjcmVhdGVkIHdpdGggZGVmYXVsdCBvcHRpb25zLlxuICogSW4gb3JkZXIgc2V0IHNwZWNpZmljIG9wdGlvbnMgeW91IG11c3Qgc2V0IHRoaXMgc2VydmljZSBhcyBwcm92aWRlciBpbiB5b3VyIGNvbXBvbmVudCBhbmRcbiAqIHNldCB0aGUgd2FudGVkIG9wdGlvbnMuXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjb25zdHJ1Y3Rvcih2aWV3ZXJDb25mIDpWaWV3ZXJDb25maWd1cmF0aW9uICkge1xuICogICB2aWV3ZXJDb25mLnZpZXdlck9wdGlvbnMgPSB7IHRpbWVsaW5lOiBmYWxzZSB9O1xuICogfVxuICogYGBgXG4gKiBub3RpY2UgdGhpcyBjb25maWd1cmF0aW9uIHdpbGwgYmUgZm9yIGFsbCA8YWMtbWFwcz4gaW4geW91ciBjb21wb25lbnQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBWaWV3ZXJDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIGNlc2l1bSB2aWV3ZXIgb3B0aW9ucyBBY2NvcmRpbmcgdG8gW1ZpZXdlcl17QGxpbmsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmllfVxuICAgKi9cbiAgcHJpdmF0ZSBfdmlld2VyT3B0aW9uczogb2JqZWN0IHwgb2JqZWN0W107XG4gIHByaXZhdGUgX3ZpZXdlck1vZGlmaWVyOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW107XG4gIHByaXZhdGUgbmV4dFZpZXdlck9wdGlvbnNJbmRleCA9IDA7XG4gIHByaXZhdGUgbmV4dFZpZXdlck1vZGlmaWVySW5kZXggPSAwO1xuXG4gIGdldCB2aWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcbiAgICByZXR1cm4gdGhpcy5fdmlld2VyT3B0aW9ucztcbiAgfVxuXG4gIMOPO1xuXG4gIGdldE5leHRWaWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcbiAgICBpZiAodGhpcy5fdmlld2VyT3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyT3B0aW9uc1t0aGlzLm5leHRWaWV3ZXJPcHRpb25zSW5kZXgrK107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3ZXJPcHRpb25zO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgaW5pdGlhbCBtYXAgdmlld2VyIG9wdGlvbnMuXG4gICAqIElmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgbWFwIHlvdSBjYW4gZ2l2ZSB0aGUgZnVuY3Rpb24gYW4gYXJyYXkgb2Ygb3B0aW9ucy5cbiAgICogVGhlIG1hcCBpbml0aWFsaXplZCBmaXJzdCB3aWxsIGJlIHNldCB3aXRoIHRoZSBmaXJzdCBvcHRpb24gb2JqZWN0IGluIHRoZSBvcHRpb25zIGFycmF5IGFuZCBzbyBvbi5cbiAgICovXG4gIHNldCB2aWV3ZXJPcHRpb25zKHZhbHVlOiBvYmplY3QgfCBvYmplY3RbXSkge1xuICAgIHRoaXMuX3ZpZXdlck9wdGlvbnMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB2aWV3ZXJNb2RpZmllcigpOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl92aWV3ZXJNb2RpZmllcjtcbiAgfVxuXG4gIGdldE5leHRWaWV3ZXJNb2RpZmllcigpOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10ge1xuICAgIGlmICh0aGlzLl92aWV3ZXJNb2RpZmllciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyTW9kaWZpZXJbdGhpcy5uZXh0Vmlld2VyTW9kaWZpZXJJbmRleCsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck1vZGlmaWVyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgbWFwIHZpZXdlciBvcHRpb25zIGFmdGVyIHRoZSBtYXAgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqIElmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgbWFwIHlvdSBjYW4gZ2l2ZSB0aGUgZnVuY3Rpb24gYW4gYXJyYXkgb2YgZnVuY3Rpb25zLlxuICAgKiBUaGUgbWFwIGluaXRpYWxpemVkIGZpcnN0IHdpbGwgYmUgc2V0IHdpdGggdGhlIGZpcnN0IG9wdGlvbiBvYmplY3QgaW4gdGhlIG9wdGlvbnMgYXJyYXkgYW5kIHNvIG9uLlxuICAgKi9cbiAgc2V0IHZpZXdlck1vZGlmaWVyKHZhbHVlOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10pIHtcbiAgICB0aGlzLl92aWV3ZXJNb2RpZmllciA9IHZhbHVlO1xuICB9XG59XG4iXX0=