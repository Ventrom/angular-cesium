import { __decorate } from "tslib";
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
        get: function () {
            return this._viewerOptions;
        },
        /**
         * Can be used to set initial map viewer options.
         * If there is more than one map you can give the function an array of options.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: function (value) {
            this._viewerOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    ViewerConfiguration.prototype.getNextViewerOptions = function () {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    };
    Object.defineProperty(ViewerConfiguration.prototype, "viewerModifier", {
        get: function () {
            return this._viewerModifier;
        },
        /**
         * Can be used to set map viewer options after the map has been initialized.
         * If there is more than one map you can give the function an array of functions.
         * The map initialized first will be set with the first option object in the options array and so on.
         */
        set: function (value) {
            this._viewerModifier = value;
        },
        enumerable: true,
        configurable: true
    });
    ViewerConfiguration.prototype.getNextViewerModifier = function () {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    };
    ViewerConfiguration = __decorate([
        Injectable()
    ], ViewerConfiguration);
    return ViewerConfiguration;
}());
export { ViewerConfiguration };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1jb25maWd1cmF0aW9uL3ZpZXdlci1jb25maWd1cmF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7Ozs7Ozs7Ozs7O0dBV0c7QUFFSDtJQUFBO1FBTVUsMkJBQXNCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLDRCQUF1QixHQUFHLENBQUMsQ0FBQztJQTZDdEMsQ0FBQztJQTNDQyxzQkFBSSw4Q0FBYTthQUFqQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDO1FBWUQ7Ozs7V0FJRzthQUNILFVBQWtCLEtBQXdCO1lBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzlCLENBQUM7OztPQW5CQTtJQUlELGtEQUFvQixHQUFwQjtRQUNFLElBQUksSUFBSSxDQUFDLGNBQWMsWUFBWSxLQUFLLEVBQUU7WUFDeEMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFXRCxzQkFBSSwrQ0FBYzthQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM5QixDQUFDO1FBVUQ7Ozs7V0FJRzthQUNILFVBQW1CLEtBQTRCO1lBQzdDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7OztPQWpCQTtJQUVELG1EQUFxQixHQUFyQjtRQUNFLElBQUksSUFBSSxDQUFDLGVBQWUsWUFBWSxLQUFLLEVBQUU7WUFDekMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUExQ1UsbUJBQW1CO1FBRC9CLFVBQVUsRUFBRTtPQUNBLG1CQUFtQixDQW9EL0I7SUFBRCwwQkFBQztDQUFBLEFBcERELElBb0RDO1NBcERZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBTZXJ2aWNlIGZvciBzZXR0aW5nIGNlc2l1bSB2aWV3ZXIgbWFwIG9wdGlvbnMuXG4gKiBkZWZhdWx0eSBhbmd1bGFyLWNlc2l1bSBkb2VzbnQgcHJvdmlkZSB0aGlzIHNlcnZpY2UgYW5kIHZpZXdlciBpcyBjcmVhdGVkIHdpdGggZGVmYXVsdCBvcHRpb25zLlxuICogSW4gb3JkZXIgc2V0IHNwZWNpZmljIG9wdGlvbnMgeW91IG11c3Qgc2V0IHRoaXMgc2VydmljZSBhcyBwcm92aWRlciBpbiB5b3VyIGNvbXBvbmVudCBhbmRcbiAqIHNldCB0aGUgd2FudGVkIG9wdGlvbnMuXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBjb25zdHJ1Y3Rvcih2aWV3ZXJDb25mIDpWaWV3ZXJDb25maWd1cmF0aW9uICkge1xuICogICB2aWV3ZXJDb25mLnZpZXdlck9wdGlvbnMgPSB7IHRpbWVsaW5lOiBmYWxzZSB9O1xuICogfVxuICogYGBgXG4gKiBub3RpY2UgdGhpcyBjb25maWd1cmF0aW9uIHdpbGwgYmUgZm9yIGFsbCA8YWMtbWFwcz4gaW4geW91ciBjb21wb25lbnQuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBWaWV3ZXJDb25maWd1cmF0aW9uIHtcbiAgLyoqXG4gICAqIGNlc2l1bSB2aWV3ZXIgb3B0aW9ucyBBY2NvcmRpbmcgdG8gW1ZpZXdlcl17QGxpbmsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmllfVxuICAgKi9cbiAgcHJpdmF0ZSBfdmlld2VyT3B0aW9uczogb2JqZWN0IHwgb2JqZWN0W107XG4gIHByaXZhdGUgX3ZpZXdlck1vZGlmaWVyOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW107XG4gIHByaXZhdGUgbmV4dFZpZXdlck9wdGlvbnNJbmRleCA9IDA7XG4gIHByaXZhdGUgbmV4dFZpZXdlck1vZGlmaWVySW5kZXggPSAwO1xuXG4gIGdldCB2aWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcbiAgICByZXR1cm4gdGhpcy5fdmlld2VyT3B0aW9ucztcbiAgfVxuXG4gIMOPO1xuXG4gIGdldE5leHRWaWV3ZXJPcHRpb25zKCk6IG9iamVjdCB8IG9iamVjdFtdIHtcbiAgICBpZiAodGhpcy5fdmlld2VyT3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyT3B0aW9uc1t0aGlzLm5leHRWaWV3ZXJPcHRpb25zSW5kZXgrK107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3ZXJPcHRpb25zO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgaW5pdGlhbCBtYXAgdmlld2VyIG9wdGlvbnMuXG4gICAqIElmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgbWFwIHlvdSBjYW4gZ2l2ZSB0aGUgZnVuY3Rpb24gYW4gYXJyYXkgb2Ygb3B0aW9ucy5cbiAgICogVGhlIG1hcCBpbml0aWFsaXplZCBmaXJzdCB3aWxsIGJlIHNldCB3aXRoIHRoZSBmaXJzdCBvcHRpb24gb2JqZWN0IGluIHRoZSBvcHRpb25zIGFycmF5IGFuZCBzbyBvbi5cbiAgICovXG4gIHNldCB2aWV3ZXJPcHRpb25zKHZhbHVlOiBvYmplY3QgfCBvYmplY3RbXSkge1xuICAgIHRoaXMuX3ZpZXdlck9wdGlvbnMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB2aWV3ZXJNb2RpZmllcigpOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl92aWV3ZXJNb2RpZmllcjtcbiAgfVxuXG4gIGdldE5leHRWaWV3ZXJNb2RpZmllcigpOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10ge1xuICAgIGlmICh0aGlzLl92aWV3ZXJNb2RpZmllciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyTW9kaWZpZXJbdGhpcy5uZXh0Vmlld2VyTW9kaWZpZXJJbmRleCsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck1vZGlmaWVyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgdXNlZCB0byBzZXQgbWFwIHZpZXdlciBvcHRpb25zIGFmdGVyIHRoZSBtYXAgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqIElmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgbWFwIHlvdSBjYW4gZ2l2ZSB0aGUgZnVuY3Rpb24gYW4gYXJyYXkgb2YgZnVuY3Rpb25zLlxuICAgKiBUaGUgbWFwIGluaXRpYWxpemVkIGZpcnN0IHdpbGwgYmUgc2V0IHdpdGggdGhlIGZpcnN0IG9wdGlvbiBvYmplY3QgaW4gdGhlIG9wdGlvbnMgYXJyYXkgYW5kIHNvIG9uLlxuICAgKi9cbiAgc2V0IHZpZXdlck1vZGlmaWVyKHZhbHVlOiBGdW5jdGlvbiB8IEZ1bmN0aW9uW10pIHtcbiAgICB0aGlzLl92aWV3ZXJNb2RpZmllciA9IHZhbHVlO1xuICB9XG59XG4iXX0=