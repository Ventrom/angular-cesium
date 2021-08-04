import { Injectable } from '@angular/core';
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
            viewer = new this.cesium.Viewer(mapContainer, Object.assign({ contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                } }, options));
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
ViewerFactory.decorators = [
    { type: Injectable }
];
ViewerFactory.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE1BQU0sT0FBTyxhQUFhO0lBSXhCO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFlBQVksQ0FBQyxZQUF5QixFQUFFLE9BQWE7UUFDbkQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxrQkFDMUMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckMsSUFDRSxPQUFPLEVBQ1YsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQzFDO2dCQUNFLGNBQWMsRUFBRTtvQkFDZCxLQUFLLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUM7aUJBQ3JDO2FBQ0YsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzs7WUFuQ0YsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpZXdlckZhY3Rvcnkge1xuICBjZXNpdW06IGFueTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2VzaXVtID0gQ2VzaXVtO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB2aWV3ZXIgd2l0aCBkZWZhdWx0IG9yIGN1c3RvbSBvcHRpb25zXG4gICAqIEBwYXJhbSBtYXBDb250YWluZXIgLSBjb250YWluZXIgdG8gaW5pdGlhbGl6ZSB0aGUgdmlld2VyIG9uXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjcmVhdGUgdGhlIHZpZXdlciB3aXRoIC0gT3B0aW9uYWxcbiAgICpcbiAgICogQHJldHVybnMgbmV3IHZpZXdlclxuICAgKi9cbiAgY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBsZXQgdmlld2VyID0gbnVsbDtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsIHtcbiAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICB3ZWJnbDoge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdlciA9IG5ldyB0aGlzLmNlc2l1bS5WaWV3ZXIobWFwQ29udGFpbmVyLFxuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3ZXI7XG4gIH1cbn1cbiJdfQ==