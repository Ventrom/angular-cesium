import { Injectable, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../viewer-factory/viewer-factory.service";
import * as i2 from "../viewer-configuration/viewer-configuration.service";
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
export class CesiumService {
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    init(mapContainer, map) {
        this.map = map;
        this.ngZone.runOutsideAngular(() => {
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        });
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas() {
        return this.cesiumViewer.canvas;
    }
    getMap() {
        return this.map;
    }
}
CesiumService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumService, deps: [{ token: i0.NgZone }, { token: i1.ViewerFactory }, { token: i2.ViewerConfiguration, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CesiumService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i1.ViewerFactory }, { type: i2.ViewerConfiguration, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUs3RDs7R0FFRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBSXhCLFlBQW9CLE1BQWMsRUFBVSxhQUE0QixFQUFzQixtQkFBd0M7UUFBbEgsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQXNCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFDdEksQ0FBQztJQUVELElBQUksQ0FBQyxZQUF5QixFQUFFLEdBQW1CO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTNFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNwRyxJQUFJLE9BQU8sY0FBYyxLQUFLLFVBQVUsRUFBRTtnQkFDeEMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQTJCLENBQUM7SUFDdkQsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQzs7MkdBOUNVLGFBQWE7K0dBQWIsYUFBYTs0RkFBYixhQUFhO2tCQUR6QixVQUFVOzswQkFLa0UsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE5nWm9uZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZpZXdlckZhY3RvcnkgfSBmcm9tICcuLi92aWV3ZXItZmFjdG9yeS92aWV3ZXItZmFjdG9yeS5zZXJ2aWNlJztcbmltcG9ydCB7IFZpZXdlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi92aWV3ZXItY29uZmlndXJhdGlvbi92aWV3ZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XG5cbi8qKlxuICogIFNlcnZpY2UgdGhhdCBpbml0aWFsaXplIGNlc2l1bSB2aWV3ZXIgYW5kIGV4cG9zZSBjZXNpdW0gdmlld2VyIGFuZCBzY2VuZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENlc2l1bVNlcnZpY2Uge1xuICBwcml2YXRlIGNlc2l1bVZpZXdlcjogYW55O1xuICBwcml2YXRlIG1hcDogQWNNYXBDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSB2aWV3ZXJGYWN0b3J5OiBWaWV3ZXJGYWN0b3J5LCBAT3B0aW9uYWwoKSBwcml2YXRlIHZpZXdlckNvbmZpZ3VyYXRpb246IFZpZXdlckNvbmZpZ3VyYXRpb24pIHtcbiAgfVxuXG4gIGluaXQobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgbWFwOiBBY01hcENvbXBvbmVudCkge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24gPyB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck9wdGlvbnMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuY2VzaXVtVmlld2VyID0gdGhpcy52aWV3ZXJGYWN0b3J5LmNyZWF0ZVZpZXdlcihtYXBDb250YWluZXIsIG9wdGlvbnMpO1xuXG4gICAgICBjb25zdCB2aWV3ZXJNb2RpZmllciA9IHRoaXMudmlld2VyQ29uZmlndXJhdGlvbiAmJiB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24uZ2V0TmV4dFZpZXdlck1vZGlmaWVyKCk7XG4gICAgICBpZiAodHlwZW9mIHZpZXdlck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZpZXdlck1vZGlmaWVyKHRoaXMuY2VzaXVtVmlld2VyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vVmlld2VyLmh0bWw/Y2xhc3NGaWx0ZXI9dmlld2VcbiAgICogQHJldHVybnMgY2VzaXVtVmlld2VyXG4gICAqL1xuICBnZXRWaWV3ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9TY2VuZS5odG1sP2NsYXNzRmlsdGVyPXNjZW5lXG4gICAqIEByZXR1cm5zIGNlc2l1bSBzY2VuZVxuICAgKi9cbiAgZ2V0U2NlbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2VzaXVtVmlld2VyLnNjZW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ2FudmFzX0FQSVxuICAgKiBAcmV0dXJucyBjZXNpdW0gY2FudmFzXG4gICAqL1xuICBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlci5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIH1cblxuICBnZXRNYXAoKTogQWNNYXBDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLm1hcDtcbiAgfVxufVxuIl19