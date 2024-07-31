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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ViewerFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ViewerFactory }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ViewerFactory, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sYUFBYTtJQUl4QjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxZQUFZLENBQUMsWUFBeUIsRUFBRSxPQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUM1QyxjQUFjLEVBQUU7b0JBQ2QsS0FBSyxFQUFFLEVBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFDO2lCQUNyQztnQkFDRCxHQUFHLE9BQU87YUFDWCxDQUFDLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFDMUM7Z0JBQ0UsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7YUFDRixDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs4R0FsQ1UsYUFBYTtrSEFBYixhQUFhOzsyRkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld2VyRmFjdG9yeSB7XG4gIGNlc2l1bTogYW55O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jZXNpdW0gPSBDZXNpdW07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHZpZXdlciB3aXRoIGRlZmF1bHQgb3IgY3VzdG9tIG9wdGlvbnNcbiAgICogQHBhcmFtIG1hcENvbnRhaW5lciAtIGNvbnRhaW5lciB0byBpbml0aWFsaXplIHRoZSB2aWV3ZXIgb25cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIGNyZWF0ZSB0aGUgdmlld2VyIHdpdGggLSBPcHRpb25hbFxuICAgKlxuICAgKiBAcmV0dXJucyBuZXcgdmlld2VyXG4gICAqL1xuICBjcmVhdGVWaWV3ZXIobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IGFueSkge1xuICAgIGxldCB2aWV3ZXIgPSBudWxsO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB2aWV3ZXIgPSBuZXcgdGhpcy5jZXNpdW0uVmlld2VyKG1hcENvbnRhaW5lciwge1xuICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICAuLi5vcHRpb25zXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgICAgd2ViZ2w6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdlcjtcbiAgfVxufVxuIl19