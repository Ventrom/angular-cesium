import { __decorate, __metadata } from "tslib";
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
    ScreenshotService.prototype.getMapScreenshotDataUrlBase64 = function () {
        var canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    };
    ScreenshotService.prototype.downloadMapScreenshot = function (filename) {
        if (filename === void 0) { filename = 'map.png'; }
        var dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    };
    ScreenshotService.prototype.downloadURI = function (uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    ScreenshotService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    ScreenshotService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], ScreenshotService);
    return ScreenshotService;
}());
export { ScreenshotService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc2NyZWVuc2hvdC9zY3JlZW5zaG90LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXpEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFFSDtJQUNFLDJCQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNoRCxDQUFDO0lBRUQseURBQTZCLEdBQTdCO1FBQ0UsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBR0QsaURBQXFCLEdBQXJCLFVBQXNCLFFBQW9CO1FBQXBCLHlCQUFBLEVBQUEsb0JBQW9CO1FBQ3hDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyx1Q0FBVyxHQUFuQixVQUFvQixHQUFXLEVBQUUsSUFBWTtRQUMzQyxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7O2dCQXJCa0MsYUFBYTs7SUFEckMsaUJBQWlCO1FBRDdCLFVBQVUsRUFBRTt5Q0FFd0IsYUFBYTtPQURyQyxpQkFBaUIsQ0F1QjdCO0lBQUQsd0JBQUM7Q0FBQSxBQXZCRCxJQXVCQztTQXZCWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKiBUYWtlIHNjcmVlbnNob3Qgb2YgeW91ciBjZXNpdW0gZ2xvYmUuXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBnZXQgYmFzZSA2NCBkYXRhIHVybFxuICogY29uc3QgZGF0YVVybCA9IHNjcmVlbnNob3RTZXJ2aWNlLmdldE1hcFNjcmVlbnNob3REYXRhVXJsKCk7XG4gKlxuICogLy8gb3IgZG93bmxvYWQgYXMgcG5nXG4gKiBzY3JlZW5zaG90U2VydmljZS5kb3dubG9hZE1hcFNjcmVlbnNob3QoJ215LW1hcC5wbmcnKTtcbiAqXG4gKiBgYGBcbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JlZW5zaG90U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgZ2V0TWFwU2NyZWVuc2hvdERhdGFVcmxCYXNlNjQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldENhbnZhcygpO1xuICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG4gIH1cblxuXG4gIGRvd25sb2FkTWFwU2NyZWVuc2hvdChmaWxlbmFtZSA9ICdtYXAucG5nJykge1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0aGlzLmdldE1hcFNjcmVlbnNob3REYXRhVXJsQmFzZTY0KCk7XG4gICAgdGhpcy5kb3dubG9hZFVSSShkYXRhVXJsLCBmaWxlbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGRvd25sb2FkVVJJKHVyaTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSBuYW1lO1xuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICB9XG59XG4iXX0=