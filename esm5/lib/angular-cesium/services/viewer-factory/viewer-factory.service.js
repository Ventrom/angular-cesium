/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
var ViewerFactory = /** @class */ (function () {
    function ViewerFactory() {
        this.cesium = Cesium;
    }
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    ViewerFactory.prototype.createViewer = /**
     * Creates a viewer with default or custom options
     * @param {?} mapContainer - container to initialize the viewer on
     * @param {?=} options - Options to create the viewer with - Optional
     *
     * @return {?} new viewer
     */
    function (mapContainer, options) {
        /** @type {?} */
        var viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, tslib_1.__assign({ contextOptions: {
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
    };
    ViewerFactory.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ViewerFactory.ctorParameters = function () { return []; };
    return ViewerFactory;
}());
export { ViewerFactory };
if (false) {
    /** @type {?} */
    ViewerFactory.prototype.cesium;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDO0lBS0U7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7Ozs7OztPQU1HOzs7Ozs7OztJQUNILG9DQUFZOzs7Ozs7O0lBQVosVUFBYSxZQUF5QixFQUFFLE9BQWE7O1lBQy9DLE1BQU0sR0FBRyxJQUFJO1FBQ2pCLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxxQkFDMUMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckMsSUFDRSxPQUFPLEVBQ1YsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQzFDOztnQkFFRSxlQUFlLEVBQUUsTUFBTSxDQUFDLG1DQUFtQyxDQUFDO29CQUMxRCxHQUFHLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDN0QsQ0FBQztnQkFDRixlQUFlLEVBQUUsS0FBSztnQkFDdEIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7YUFDRixDQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dCQXpDRixVQUFVOzs7O0lBMENYLG9CQUFDO0NBQUEsQUExQ0QsSUEwQ0M7U0F6Q1ksYUFBYTs7O0lBQ3hCLCtCQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld2VyRmFjdG9yeSB7XG4gIGNlc2l1bTogYW55O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jZXNpdW0gPSBDZXNpdW07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHZpZXdlciB3aXRoIGRlZmF1bHQgb3IgY3VzdG9tIG9wdGlvbnNcbiAgICogQHBhcmFtIG1hcENvbnRhaW5lciAtIGNvbnRhaW5lciB0byBpbml0aWFsaXplIHRoZSB2aWV3ZXIgb25cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIGNyZWF0ZSB0aGUgdmlld2VyIHdpdGggLSBPcHRpb25hbFxuICAgKlxuICAgKiBAcmV0dXJucyBuZXcgdmlld2VyXG4gICAqL1xuICBjcmVhdGVWaWV3ZXIobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IGFueSkge1xuICAgIGxldCB2aWV3ZXIgPSBudWxsO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB2aWV3ZXIgPSBuZXcgdGhpcy5jZXNpdW0uVmlld2VyKG1hcENvbnRhaW5lciwge1xuICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICAuLi5vcHRpb25zXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsXG4gICAgICAgIHtcbiAgICAgICAgICAvLyBQb29yIGludGVybmV0IGNvbm5lY3Rpb24gLSB1c2UgZGVmYXVsdCBnbG9iZSBpbWFnZSwgVE9ETzogc2hvdWxkIGJlIHJlbW92ZWRcbiAgICAgICAgICBpbWFnZXJ5UHJvdmlkZXI6IENlc2l1bS5jcmVhdGVUaWxlTWFwU2VydmljZUltYWdlcnlQcm92aWRlcih7XG4gICAgICAgICAgICB1cmw6IENlc2l1bS5idWlsZE1vZHVsZVVybCgnQXNzZXRzL1RleHR1cmVzL05hdHVyYWxFYXJ0aElJJylcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBiYXNlTGF5ZXJQaWNrZXI6IGZhbHNlLFxuICAgICAgICAgIGdlb2NvZGVyOiBmYWxzZSxcbiAgICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgICAgd2ViZ2w6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdlcjtcbiAgfVxufVxuIl19