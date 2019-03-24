/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
/**
 * Take screenshot of your cesium globe.
 *
 * usage:
 * ```typescript
 * // get base 64 data url
 * const dataUrl = screenshotService.getMapScreenshotDataUrl();
 *
 * // or download as png
 * screenshotService.downloadMapScreenshot('my-map.png');
 *
 * ```
 *
 */
var ScreenshotService = /** @class */ (function () {
    function ScreenshotService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @return {?}
     */
    ScreenshotService.prototype.getMapScreenshotDataUrlBase64 = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    };
    /**
     * @param {?=} filename
     * @return {?}
     */
    ScreenshotService.prototype.downloadMapScreenshot = /**
     * @param {?=} filename
     * @return {?}
     */
    function (filename) {
        if (filename === void 0) { filename = 'map.png'; }
        /** @type {?} */
        var dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    };
    /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    ScreenshotService.prototype.downloadURI = /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    function (uri, name) {
        /** @type {?} */
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    ScreenshotService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ScreenshotService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return ScreenshotService;
}());
export { ScreenshotService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ScreenshotService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFnQnpEO0lBRUUsMkJBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQ2hELENBQUM7Ozs7SUFFRCx5REFBNkI7OztJQUE3Qjs7WUFDUSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7UUFDN0MsT0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDNUIsQ0FBQzs7Ozs7SUFHRCxpREFBcUI7Ozs7SUFBckIsVUFBc0IsUUFBb0I7UUFBcEIseUJBQUEsRUFBQSxvQkFBb0I7O1lBQ2xDLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUU7UUFDcEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7Ozs7OztJQUVPLHVDQUFXOzs7Ozs7SUFBbkIsVUFBb0IsR0FBVyxFQUFFLElBQVk7O1lBQ3JDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOztnQkF2QkYsVUFBVTs7OztnQkFoQkYsYUFBYTs7SUF3Q3RCLHdCQUFDO0NBQUEsQUF4QkQsSUF3QkM7U0F2QlksaUJBQWlCOzs7Ozs7SUFDaEIsMENBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICogVGFrZSBzY3JlZW5zaG90IG9mIHlvdXIgY2VzaXVtIGdsb2JlLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gZ2V0IGJhc2UgNjQgZGF0YSB1cmxcbiAqIGNvbnN0IGRhdGFVcmwgPSBzY3JlZW5zaG90U2VydmljZS5nZXRNYXBTY3JlZW5zaG90RGF0YVVybCgpO1xuICpcbiAqIC8vIG9yIGRvd25sb2FkIGFzIHBuZ1xuICogc2NyZWVuc2hvdFNlcnZpY2UuZG93bmxvYWRNYXBTY3JlZW5zaG90KCdteS1tYXAucG5nJyk7XG4gKlxuICogYGBgXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2NyZWVuc2hvdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIGdldE1hcFNjcmVlbnNob3REYXRhVXJsQmFzZTY0KCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRDYW52YXMoKTtcbiAgICByZXR1cm4gY2FudmFzLnRvRGF0YVVSTCgpO1xuICB9XG5cblxuICBkb3dubG9hZE1hcFNjcmVlbnNob3QoZmlsZW5hbWUgPSAnbWFwLnBuZycpIHtcbiAgICBjb25zdCBkYXRhVXJsID0gdGhpcy5nZXRNYXBTY3JlZW5zaG90RGF0YVVybEJhc2U2NCgpO1xuICAgIHRoaXMuZG93bmxvYWRVUkkoZGF0YVVybCwgZmlsZW5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3dubG9hZFVSSSh1cmk6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rLmRvd25sb2FkID0gbmFtZTtcbiAgICBsaW5rLmhyZWYgPSB1cmk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgfVxufVxuIl19