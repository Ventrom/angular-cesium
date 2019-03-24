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
export declare class ScreenshotService {
    private cesiumService;
    constructor(cesiumService: CesiumService);
    getMapScreenshotDataUrlBase64(): string;
    downloadMapScreenshot(filename?: string): void;
    private downloadURI;
}
