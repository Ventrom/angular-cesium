/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
export class ViewerFactory {
    constructor() {
        this.cesium = Cesium;
    }
    /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    createViewer(mapContainer, options) {
        /** @type {?} */
        let viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, Object.assign({ contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                } }, options));
        }
        else {
            viewer = new this.cesium.Viewer(mapContainer, {
                // Poor internet connection - use default globe image, TODO: should be removed
                imageryProvider: Cesium.createTileMapServiceImageryProvider({
                    url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                }),
                baseLayerPicker: false,
                geocoder: false,
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
/** @nocollapse */
ViewerFactory.ctorParameters = () => [];
if (false) {
    /** @type {?} */
    ViewerFactory.prototype.cesium;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsTUFBTSxPQUFPLGFBQWE7SUFJeEI7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDOzs7Ozs7OztJQVNELFlBQVksQ0FBQyxZQUF5QixFQUFFLE9BQWE7O1lBQy9DLE1BQU0sR0FBRyxJQUFJO1FBQ2pCLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxrQkFDMUMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckMsSUFDRSxPQUFPLEVBQ1YsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQzFDOztnQkFFRSxlQUFlLEVBQUUsTUFBTSxDQUFDLG1DQUFtQyxDQUFDO29CQUMxRCxHQUFHLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDN0QsQ0FBQztnQkFDRixlQUFlLEVBQUUsS0FBSztnQkFDdEIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7YUFDRixDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7OztZQXpDRixVQUFVOzs7Ozs7SUFFVCwrQkFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZpZXdlckZhY3Rvcnkge1xuICBjZXNpdW06IGFueTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2VzaXVtID0gQ2VzaXVtO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB2aWV3ZXIgd2l0aCBkZWZhdWx0IG9yIGN1c3RvbSBvcHRpb25zXG4gICAqIEBwYXJhbSBtYXBDb250YWluZXIgLSBjb250YWluZXIgdG8gaW5pdGlhbGl6ZSB0aGUgdmlld2VyIG9uXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB0byBjcmVhdGUgdGhlIHZpZXdlciB3aXRoIC0gT3B0aW9uYWxcbiAgICpcbiAgICogQHJldHVybnMgbmV3IHZpZXdlclxuICAgKi9cbiAgY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBsZXQgdmlld2VyID0gbnVsbDtcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsIHtcbiAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICB3ZWJnbDoge3ByZXNlcnZlRHJhd2luZ0J1ZmZlcjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgLi4ub3B0aW9uc1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdlciA9IG5ldyB0aGlzLmNlc2l1bS5WaWV3ZXIobWFwQ29udGFpbmVyLFxuICAgICAgICB7XG4gICAgICAgICAgLy8gUG9vciBpbnRlcm5ldCBjb25uZWN0aW9uIC0gdXNlIGRlZmF1bHQgZ2xvYmUgaW1hZ2UsIFRPRE86IHNob3VsZCBiZSByZW1vdmVkXG4gICAgICAgICAgaW1hZ2VyeVByb3ZpZGVyOiBDZXNpdW0uY3JlYXRlVGlsZU1hcFNlcnZpY2VJbWFnZXJ5UHJvdmlkZXIoe1xuICAgICAgICAgICAgdXJsOiBDZXNpdW0uYnVpbGRNb2R1bGVVcmwoJ0Fzc2V0cy9UZXh0dXJlcy9OYXR1cmFsRWFydGhJSScpXG4gICAgICAgICAgfSksXG4gICAgICAgICAgYmFzZUxheWVyUGlja2VyOiBmYWxzZSxcbiAgICAgICAgICBnZW9jb2RlcjogZmFsc2UsXG4gICAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcbiAgICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3ZXI7XG4gIH1cbn1cbiJdfQ==