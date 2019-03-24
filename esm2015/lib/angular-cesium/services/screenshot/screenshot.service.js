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
export class ScreenshotService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @return {?}
     */
    getMapScreenshotDataUrlBase64() {
        /** @type {?} */
        const canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    }
    /**
     * @param {?=} filename
     * @return {?}
     */
    downloadMapScreenshot(filename = 'map.png') {
        /** @type {?} */
        const dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    }
    /**
     * @private
     * @param {?} uri
     * @param {?} name
     * @return {?}
     */
    downloadURI(uri, name) {
        /** @type {?} */
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
ScreenshotService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ScreenshotService.ctorParameters = () => [
    { type: CesiumService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    ScreenshotService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFpQnpELE1BQU0sT0FBTyxpQkFBaUI7Ozs7SUFDNUIsWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDaEQsQ0FBQzs7OztJQUVELDZCQUE2Qjs7Y0FDckIsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1FBQzdDLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLENBQUM7Ozs7O0lBR0QscUJBQXFCLENBQUMsUUFBUSxHQUFHLFNBQVM7O2NBQ2xDLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUU7UUFDcEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7Ozs7OztJQUVPLFdBQVcsQ0FBQyxHQUFXLEVBQUUsSUFBWTs7Y0FDckMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQXZCRixVQUFVOzs7O1lBaEJGLGFBQWE7Ozs7Ozs7SUFrQlIsMENBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICogVGFrZSBzY3JlZW5zaG90IG9mIHlvdXIgY2VzaXVtIGdsb2JlLlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gZ2V0IGJhc2UgNjQgZGF0YSB1cmxcbiAqIGNvbnN0IGRhdGFVcmwgPSBzY3JlZW5zaG90U2VydmljZS5nZXRNYXBTY3JlZW5zaG90RGF0YVVybCgpO1xuICpcbiAqIC8vIG9yIGRvd25sb2FkIGFzIHBuZ1xuICogc2NyZWVuc2hvdFNlcnZpY2UuZG93bmxvYWRNYXBTY3JlZW5zaG90KCdteS1tYXAucG5nJyk7XG4gKlxuICogYGBgXG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2NyZWVuc2hvdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIGdldE1hcFNjcmVlbnNob3REYXRhVXJsQmFzZTY0KCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRDYW52YXMoKTtcbiAgICByZXR1cm4gY2FudmFzLnRvRGF0YVVSTCgpO1xuICB9XG5cblxuICBkb3dubG9hZE1hcFNjcmVlbnNob3QoZmlsZW5hbWUgPSAnbWFwLnBuZycpIHtcbiAgICBjb25zdCBkYXRhVXJsID0gdGhpcy5nZXRNYXBTY3JlZW5zaG90RGF0YVVybEJhc2U2NCgpO1xuICAgIHRoaXMuZG93bmxvYWRVUkkoZGF0YVVybCwgZmlsZW5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3dubG9hZFVSSSh1cmk6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rLmRvd25sb2FkID0gbmFtZTtcbiAgICBsaW5rLmhyZWYgPSB1cmk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgfVxufVxuIl19