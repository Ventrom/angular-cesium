import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
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
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    getMapScreenshotDataUrlBase64() {
        const canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    }
    downloadMapScreenshot(filename = 'map.png') {
        const dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    }
    downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ScreenshotService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ScreenshotService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ScreenshotService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9zY3JlZW5zaG90L3NjcmVlbnNob3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHM0M7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUVILE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBb0IsYUFBNEI7UUFBNUIsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDaEQsQ0FBQztJQUVELDZCQUE2QjtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFHRCxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsU0FBUztRQUN4QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU8sV0FBVyxDQUFDLEdBQVcsRUFBRSxJQUFZO1FBQzNDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs4R0F0QlUsaUJBQWlCO2tIQUFqQixpQkFBaUI7OzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKiBUYWtlIHNjcmVlbnNob3Qgb2YgeW91ciBjZXNpdW0gZ2xvYmUuXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBnZXQgYmFzZSA2NCBkYXRhIHVybFxuICogY29uc3QgZGF0YVVybCA9IHNjcmVlbnNob3RTZXJ2aWNlLmdldE1hcFNjcmVlbnNob3REYXRhVXJsKCk7XG4gKlxuICogLy8gb3IgZG93bmxvYWQgYXMgcG5nXG4gKiBzY3JlZW5zaG90U2VydmljZS5kb3dubG9hZE1hcFNjcmVlbnNob3QoJ215LW1hcC5wbmcnKTtcbiAqXG4gKiBgYGBcbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JlZW5zaG90U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgZ2V0TWFwU2NyZWVuc2hvdERhdGFVcmxCYXNlNjQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldENhbnZhcygpO1xuICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG4gIH1cblxuXG4gIGRvd25sb2FkTWFwU2NyZWVuc2hvdChmaWxlbmFtZSA9ICdtYXAucG5nJykge1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0aGlzLmdldE1hcFNjcmVlbnNob3REYXRhVXJsQmFzZTY0KCk7XG4gICAgdGhpcy5kb3dubG9hZFVSSShkYXRhVXJsLCBmaWxlbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGRvd25sb2FkVVJJKHVyaTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSBuYW1lO1xuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICB9XG59XG4iXX0=