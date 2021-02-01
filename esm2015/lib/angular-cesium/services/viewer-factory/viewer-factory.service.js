import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
let ViewerFactory = class ViewerFactory {
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
};
ViewerFactory = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], ViewerFactory);
export { ViewerFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUl4QjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxZQUFZLENBQUMsWUFBeUIsRUFBRSxPQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksa0JBQzFDLGNBQWMsRUFBRTtvQkFDZCxLQUFLLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUM7aUJBQ3JDLElBQ0UsT0FBTyxFQUNWLENBQUM7U0FDSjthQUFNO1lBQ0wsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUMxQztnQkFDRSxjQUFjLEVBQUU7b0JBQ2QsS0FBSyxFQUFFLEVBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFDO2lCQUNyQzthQUNGLENBQUMsQ0FBQztTQUNOO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGLENBQUE7QUFuQ1ksYUFBYTtJQUR6QixVQUFVLEVBQUU7O0dBQ0EsYUFBYSxDQW1DekI7U0FuQ1ksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpZXdlckZhY3Rvcnkge1xuICBjZXNpdW06IGFueTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2VzaXVtID0gQ2VzaXVtO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB2aWV3ZXIgd2l0aCBkZWZhdWx0IG9yIGN1c3RvbSBvcHRpb25zXG4gICAqIEBwYXJhbSBtYXBDb250YWluZXIgLSBjb250YWluZXIgdG8gaW5pdGlhbGl6ZSB0aGUgdmlld2VyIG9uXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjcmVhdGUgdGhlIHZpZXdlciB3aXRoIC0gT3B0aW9uYWxcbiAgICpcbiAgICogQHJldHVybnMgbmV3IHZpZXdlclxuICAgKi9cbiAgY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBsZXQgdmlld2VyID0gbnVsbDtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsIHtcbiAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICB3ZWJnbDoge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdlciA9IG5ldyB0aGlzLmNlc2l1bS5WaWV3ZXIobWFwQ29udGFpbmVyLFxuICAgICAgICB7XG4gICAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3ZXI7XG4gIH1cbn1cbiJdfQ==