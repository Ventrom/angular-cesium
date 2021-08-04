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
}
ScreenshotService.decorators = [
    { type: Injectable }
];
ScreenshotService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyZWVuc2hvdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9zY3JlZW5zaG90L3NjcmVlbnNob3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUV6RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNoRCxDQUFDO0lBRUQsNkJBQTZCO1FBQzNCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUdELHFCQUFxQixDQUFDLFFBQVEsR0FBRyxTQUFTO1FBQ3hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyxXQUFXLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDM0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUF2QkYsVUFBVTs7O1lBaEJGLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKiBUYWtlIHNjcmVlbnNob3Qgb2YgeW91ciBjZXNpdW0gZ2xvYmUuXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBnZXQgYmFzZSA2NCBkYXRhIHVybFxuICogY29uc3QgZGF0YVVybCA9IHNjcmVlbnNob3RTZXJ2aWNlLmdldE1hcFNjcmVlbnNob3REYXRhVXJsKCk7XG4gKlxuICogLy8gb3IgZG93bmxvYWQgYXMgcG5nXG4gKiBzY3JlZW5zaG90U2VydmljZS5kb3dubG9hZE1hcFNjcmVlbnNob3QoJ215LW1hcC5wbmcnKTtcbiAqXG4gKiBgYGBcbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTY3JlZW5zaG90U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgZ2V0TWFwU2NyZWVuc2hvdERhdGFVcmxCYXNlNjQoKSB7XG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldENhbnZhcygpO1xuICAgIHJldHVybiBjYW52YXMudG9EYXRhVVJMKCk7XG4gIH1cblxuXG4gIGRvd25sb2FkTWFwU2NyZWVuc2hvdChmaWxlbmFtZSA9ICdtYXAucG5nJykge1xuICAgIGNvbnN0IGRhdGFVcmwgPSB0aGlzLmdldE1hcFNjcmVlbnNob3REYXRhVXJsQmFzZTY0KCk7XG4gICAgdGhpcy5kb3dubG9hZFVSSShkYXRhVXJsLCBmaWxlbmFtZSk7XG4gIH1cblxuICBwcml2YXRlIGRvd25sb2FkVVJJKHVyaTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSBuYW1lO1xuICAgIGxpbmsuaHJlZiA9IHVyaTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICB9XG59XG4iXX0=