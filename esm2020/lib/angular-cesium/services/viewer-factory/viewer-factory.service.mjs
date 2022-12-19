import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ViewerFactory {
    constructor() {
        this.cesium = Cesium;
    }
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    createViewer(mapContainer, options) {
        let viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
                ...options
            });
        }
        else {
            viewer = new this.cesium.Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
            });
        }
        return viewer;
    }
}
ViewerFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ViewerFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewerFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ViewerFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ViewerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sYUFBYTtJQUl4QjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxZQUFZLENBQUMsWUFBeUIsRUFBRSxPQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDNUMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7Z0JBQ0QsR0FBRyxPQUFPO2FBQ1gsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFDMUM7Z0JBQ0UsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7YUFDRixDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7OzJHQWxDVSxhQUFhOytHQUFiLGFBQWE7NEZBQWIsYUFBYTtrQkFEekIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpZXdlckZhY3Rvcnkge1xuICBjZXNpdW06IGFueTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2VzaXVtID0gQ2VzaXVtO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB2aWV3ZXIgd2l0aCBkZWZhdWx0IG9yIGN1c3RvbSBvcHRpb25zXG4gICAqIEBwYXJhbSBtYXBDb250YWluZXIgLSBjb250YWluZXIgdG8gaW5pdGlhbGl6ZSB0aGUgdmlld2VyIG9uXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjcmVhdGUgdGhlIHZpZXdlciB3aXRoIC0gT3B0aW9uYWxcbiAgICpcbiAgICogQHJldHVybnMgbmV3IHZpZXdlclxuICAgKi9cbiAgY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBsZXQgdmlld2VyID0gbnVsbDtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsIHtcbiAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICB3ZWJnbDoge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdlciA9IG5ldyB0aGlzLmNlc2l1bS5WaWV3ZXIobWFwQ29udGFpbmVyLFxuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3ZXI7XG4gIH1cbn1cbiJdfQ==