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
let ViewerConfiguration = class ViewerConfiguration {
    constructor() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    get viewerOptions() {
        return this._viewerOptions;
    }
    getNextViewerOptions() {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    }
    /**
     * Can be used to set initial map viewer options.
     * If there is more than one map you can give the function an array of options.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerOptions(value) {
        this._viewerOptions = value;
    }
    get viewerModifier() {
        return this._viewerModifier;
    }
    getNextViewerModifier() {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    }
    /**
     * Can be used to set map viewer options after the map has been initialized.
     * If there is more than one map you can give the function an array of functions.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerModifier(value) {
        this._viewerModifier = value;
    }
};
ViewerConfiguration = __decorate([
    Injectable()
], ViewerConfiguration);
export { ViewerConfiguration };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1jb25maWd1cmF0aW9uL3ZpZXdlci1jb25maWd1cmF0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7Ozs7Ozs7Ozs7O0dBV0c7QUFFSCxJQUFhLG1CQUFtQixHQUFoQyxNQUFhLG1CQUFtQjtJQUFoQztRQU1VLDJCQUFzQixHQUFHLENBQUMsQ0FBQztRQUMzQiw0QkFBdUIsR0FBRyxDQUFDLENBQUM7SUE2Q3RDLENBQUM7SUEzQ0MsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFJRCxvQkFBb0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxZQUFZLEtBQUssRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLGFBQWEsQ0FBQyxLQUF3QjtRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksSUFBSSxDQUFDLGVBQWUsWUFBWSxLQUFLLEVBQUU7WUFDekMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxjQUFjLENBQUMsS0FBNEI7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztDQUNGLENBQUE7QUFwRFksbUJBQW1CO0lBRC9CLFVBQVUsRUFBRTtHQUNBLG1CQUFtQixDQW9EL0I7U0FwRFksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFNlcnZpY2UgZm9yIHNldHRpbmcgY2VzaXVtIHZpZXdlciBtYXAgb3B0aW9ucy5cbiAqIGRlZmF1bHR5IGFuZ3VsYXItY2VzaXVtIGRvZXNudCBwcm92aWRlIHRoaXMgc2VydmljZSBhbmQgdmlld2VyIGlzIGNyZWF0ZWQgd2l0aCBkZWZhdWx0IG9wdGlvbnMuXG4gKiBJbiBvcmRlciBzZXQgc3BlY2lmaWMgb3B0aW9ucyB5b3UgbXVzdCBzZXQgdGhpcyBzZXJ2aWNlIGFzIHByb3ZpZGVyIGluIHlvdXIgY29tcG9uZW50IGFuZFxuICogc2V0IHRoZSB3YW50ZWQgb3B0aW9ucy5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGNvbnN0cnVjdG9yKHZpZXdlckNvbmYgOlZpZXdlckNvbmZpZ3VyYXRpb24gKSB7XG4gKiAgIHZpZXdlckNvbmYudmlld2VyT3B0aW9ucyA9IHsgdGltZWxpbmU6IGZhbHNlIH07XG4gKiB9XG4gKiBgYGBcbiAqIG5vdGljZSB0aGlzIGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBmb3IgYWxsIDxhYy1tYXBzPiBpbiB5b3VyIGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpZXdlckNvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogY2VzaXVtIHZpZXdlciBvcHRpb25zIEFjY29yZGluZyB0byBbVmlld2VyXXtAbGluayBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV9XG4gICAqL1xuICBwcml2YXRlIF92aWV3ZXJPcHRpb25zOiBvYmplY3QgfCBvYmplY3RbXTtcbiAgcHJpdmF0ZSBfdmlld2VyTW9kaWZpZXI6IEZ1bmN0aW9uIHwgRnVuY3Rpb25bXTtcbiAgcHJpdmF0ZSBuZXh0Vmlld2VyT3B0aW9uc0luZGV4ID0gMDtcbiAgcHJpdmF0ZSBuZXh0Vmlld2VyTW9kaWZpZXJJbmRleCA9IDA7XG5cbiAgZ2V0IHZpZXdlck9wdGlvbnMoKTogb2JqZWN0IHwgb2JqZWN0W10ge1xuICAgIHJldHVybiB0aGlzLl92aWV3ZXJPcHRpb25zO1xuICB9XG5cbiAgw487XG5cbiAgZ2V0TmV4dFZpZXdlck9wdGlvbnMoKTogb2JqZWN0IHwgb2JqZWN0W10ge1xuICAgIGlmICh0aGlzLl92aWV3ZXJPcHRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3ZXJPcHRpb25zW3RoaXMubmV4dFZpZXdlck9wdGlvbnNJbmRleCsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck9wdGlvbnM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSB1c2VkIHRvIHNldCBpbml0aWFsIG1hcCB2aWV3ZXIgb3B0aW9ucy5cbiAgICogSWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBtYXAgeW91IGNhbiBnaXZlIHRoZSBmdW5jdGlvbiBhbiBhcnJheSBvZiBvcHRpb25zLlxuICAgKiBUaGUgbWFwIGluaXRpYWxpemVkIGZpcnN0IHdpbGwgYmUgc2V0IHdpdGggdGhlIGZpcnN0IG9wdGlvbiBvYmplY3QgaW4gdGhlIG9wdGlvbnMgYXJyYXkgYW5kIHNvIG9uLlxuICAgKi9cbiAgc2V0IHZpZXdlck9wdGlvbnModmFsdWU6IG9iamVjdCB8IG9iamVjdFtdKSB7XG4gICAgdGhpcy5fdmlld2VyT3B0aW9ucyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHZpZXdlck1vZGlmaWVyKCk6IEZ1bmN0aW9uIHwgRnVuY3Rpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdlck1vZGlmaWVyO1xuICB9XG5cbiAgZ2V0TmV4dFZpZXdlck1vZGlmaWVyKCk6IEZ1bmN0aW9uIHwgRnVuY3Rpb25bXSB7XG4gICAgaWYgKHRoaXMuX3ZpZXdlck1vZGlmaWVyIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3ZXJNb2RpZmllclt0aGlzLm5leHRWaWV3ZXJNb2RpZmllckluZGV4KytdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyTW9kaWZpZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSB1c2VkIHRvIHNldCBtYXAgdmlld2VyIG9wdGlvbnMgYWZ0ZXIgdGhlIG1hcCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICogSWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBtYXAgeW91IGNhbiBnaXZlIHRoZSBmdW5jdGlvbiBhbiBhcnJheSBvZiBmdW5jdGlvbnMuXG4gICAqIFRoZSBtYXAgaW5pdGlhbGl6ZWQgZmlyc3Qgd2lsbCBiZSBzZXQgd2l0aCB0aGUgZmlyc3Qgb3B0aW9uIG9iamVjdCBpbiB0aGUgb3B0aW9ucyBhcnJheSBhbmQgc28gb24uXG4gICAqL1xuICBzZXQgdmlld2VyTW9kaWZpZXIodmFsdWU6IEZ1bmN0aW9uIHwgRnVuY3Rpb25bXSkge1xuICAgIHRoaXMuX3ZpZXdlck1vZGlmaWVyID0gdmFsdWU7XG4gIH1cbn1cbiJdfQ==