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
export class ViewerConfiguration {
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
}
ViewerConfiguration.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWNvbmZpZ3VyYXRpb24vdmlld2VyLWNvbmZpZ3VyYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDOzs7Ozs7Ozs7OztHQVdHO0FBRUgsTUFBTSxPQUFPLG1CQUFtQjtJQURoQztRQU9VLDJCQUFzQixHQUFHLENBQUMsQ0FBQztRQUMzQiw0QkFBdUIsR0FBRyxDQUFDLENBQUM7SUE2Q3RDLENBQUM7SUEzQ0MsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFJRCxvQkFBb0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxZQUFZLEtBQUssRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLGFBQWEsQ0FBQyxLQUF3QjtRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksSUFBSSxDQUFDLGVBQWUsWUFBWSxLQUFLLEVBQUU7WUFDekMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxjQUFjLENBQUMsS0FBNEI7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQzs7O1lBcERGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogU2VydmljZSBmb3Igc2V0dGluZyBjZXNpdW0gdmlld2VyIG1hcCBvcHRpb25zLlxuICogZGVmYXVsdHkgYW5ndWxhci1jZXNpdW0gZG9lc250IHByb3ZpZGUgdGhpcyBzZXJ2aWNlIGFuZCB2aWV3ZXIgaXMgY3JlYXRlZCB3aXRoIGRlZmF1bHQgb3B0aW9ucy5cbiAqIEluIG9yZGVyIHNldCBzcGVjaWZpYyBvcHRpb25zIHlvdSBtdXN0IHNldCB0aGlzIHNlcnZpY2UgYXMgcHJvdmlkZXIgaW4geW91ciBjb21wb25lbnQgYW5kXG4gKiBzZXQgdGhlIHdhbnRlZCBvcHRpb25zLlxuICogYGBgdHlwZXNjcmlwdFxuICogY29uc3RydWN0b3Iodmlld2VyQ29uZiA6Vmlld2VyQ29uZmlndXJhdGlvbiApIHtcbiAqICAgdmlld2VyQ29uZi52aWV3ZXJPcHRpb25zID0geyB0aW1lbGluZTogZmFsc2UgfTtcbiAqIH1cbiAqIGBgYFxuICogbm90aWNlIHRoaXMgY29uZmlndXJhdGlvbiB3aWxsIGJlIGZvciBhbGwgPGFjLW1hcHM+IGluIHlvdXIgY29tcG9uZW50LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld2VyQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBjZXNpdW0gdmlld2VyIG9wdGlvbnMgQWNjb3JkaW5nIHRvIFtWaWV3ZXJde0BsaW5rIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZX1cbiAgICovXG4gIHByaXZhdGUgX3ZpZXdlck9wdGlvbnM6IG9iamVjdCB8IG9iamVjdFtdO1xuICBwcml2YXRlIF92aWV3ZXJNb2RpZmllcjogRnVuY3Rpb24gfCBGdW5jdGlvbltdO1xuICBwcml2YXRlIG5leHRWaWV3ZXJPcHRpb25zSW5kZXggPSAwO1xuICBwcml2YXRlIG5leHRWaWV3ZXJNb2RpZmllckluZGV4ID0gMDtcblxuICBnZXQgdmlld2VyT3B0aW9ucygpOiBvYmplY3QgfCBvYmplY3RbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdlck9wdGlvbnM7XG4gIH1cblxuICDDjztcblxuICBnZXROZXh0Vmlld2VyT3B0aW9ucygpOiBvYmplY3QgfCBvYmplY3RbXSB7XG4gICAgaWYgKHRoaXMuX3ZpZXdlck9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck9wdGlvbnNbdGhpcy5uZXh0Vmlld2VyT3B0aW9uc0luZGV4KytdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld2VyT3B0aW9ucztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FuIGJlIHVzZWQgdG8gc2V0IGluaXRpYWwgbWFwIHZpZXdlciBvcHRpb25zLlxuICAgKiBJZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIG1hcCB5b3UgY2FuIGdpdmUgdGhlIGZ1bmN0aW9uIGFuIGFycmF5IG9mIG9wdGlvbnMuXG4gICAqIFRoZSBtYXAgaW5pdGlhbGl6ZWQgZmlyc3Qgd2lsbCBiZSBzZXQgd2l0aCB0aGUgZmlyc3Qgb3B0aW9uIG9iamVjdCBpbiB0aGUgb3B0aW9ucyBhcnJheSBhbmQgc28gb24uXG4gICAqL1xuICBzZXQgdmlld2VyT3B0aW9ucyh2YWx1ZTogb2JqZWN0IHwgb2JqZWN0W10pIHtcbiAgICB0aGlzLl92aWV3ZXJPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmlld2VyTW9kaWZpZXIoKTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5fdmlld2VyTW9kaWZpZXI7XG4gIH1cblxuICBnZXROZXh0Vmlld2VyTW9kaWZpZXIoKTogRnVuY3Rpb24gfCBGdW5jdGlvbltdIHtcbiAgICBpZiAodGhpcy5fdmlld2VyTW9kaWZpZXIgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdlck1vZGlmaWVyW3RoaXMubmV4dFZpZXdlck1vZGlmaWVySW5kZXgrK107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3ZXJNb2RpZmllcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FuIGJlIHVzZWQgdG8gc2V0IG1hcCB2aWV3ZXIgb3B0aW9ucyBhZnRlciB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKiBJZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIG1hcCB5b3UgY2FuIGdpdmUgdGhlIGZ1bmN0aW9uIGFuIGFycmF5IG9mIGZ1bmN0aW9ucy5cbiAgICogVGhlIG1hcCBpbml0aWFsaXplZCBmaXJzdCB3aWxsIGJlIHNldCB3aXRoIHRoZSBmaXJzdCBvcHRpb24gb2JqZWN0IGluIHRoZSBvcHRpb25zIGFycmF5IGFuZCBzbyBvbi5cbiAgICovXG4gIHNldCB2aWV3ZXJNb2RpZmllcih2YWx1ZTogRnVuY3Rpb24gfCBGdW5jdGlvbltdKSB7XG4gICAgdGhpcy5fdmlld2VyTW9kaWZpZXIgPSB2YWx1ZTtcbiAgfVxufVxuIl19