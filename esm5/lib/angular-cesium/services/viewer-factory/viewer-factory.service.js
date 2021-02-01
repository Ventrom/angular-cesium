import { __assign, __decorate, __metadata } from "tslib";
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
    ViewerFactory.prototype.createViewer = function (mapContainer, options) {
        var viewer = null;
        if (options) {
            viewer = new this.cesium.Viewer(mapContainer, __assign({ contextOptions: {
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
    };
    ViewerFactory = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], ViewerFactory);
    return ViewerFactory;
}());
export { ViewerFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3ZpZXdlci1mYWN0b3J5L3ZpZXdlci1mYWN0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7SUFJRTtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxvQ0FBWSxHQUFaLFVBQWEsWUFBeUIsRUFBRSxPQUFhO1FBQ25ELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLE9BQU8sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksYUFDMUMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckMsSUFDRSxPQUFPLEVBQ1YsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQzFDO2dCQUNFLGNBQWMsRUFBRTtvQkFDZCxLQUFLLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUM7aUJBQ3JDO2FBQ0YsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBbENVLGFBQWE7UUFEekIsVUFBVSxFQUFFOztPQUNBLGFBQWEsQ0FtQ3pCO0lBQUQsb0JBQUM7Q0FBQSxBQW5DRCxJQW1DQztTQW5DWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmlld2VyRmFjdG9yeSB7XG4gIGNlc2l1bTogYW55O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jZXNpdW0gPSBDZXNpdW07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHZpZXdlciB3aXRoIGRlZmF1bHQgb3IgY3VzdG9tIG9wdGlvbnNcbiAgICogQHBhcmFtIG1hcENvbnRhaW5lciAtIGNvbnRhaW5lciB0byBpbml0aWFsaXplIHRoZSB2aWV3ZXIgb25cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIGNyZWF0ZSB0aGUgdmlld2VyIHdpdGggLSBPcHRpb25hbFxuICAgKlxuICAgKiBAcmV0dXJucyBuZXcgdmlld2VyXG4gICAqL1xuICBjcmVhdGVWaWV3ZXIobWFwQ29udGFpbmVyOiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IGFueSkge1xuICAgIGxldCB2aWV3ZXIgPSBudWxsO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB2aWV3ZXIgPSBuZXcgdGhpcy5jZXNpdW0uVmlld2VyKG1hcENvbnRhaW5lciwge1xuICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgIHdlYmdsOiB7cHJlc2VydmVEcmF3aW5nQnVmZmVyOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICAuLi5vcHRpb25zXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlld2VyID0gbmV3IHRoaXMuY2VzaXVtLlZpZXdlcihtYXBDb250YWluZXIsXG4gICAgICAgIHtcbiAgICAgICAgICBjb250ZXh0T3B0aW9uczoge1xuICAgICAgICAgICAgd2ViZ2w6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdlcjtcbiAgfVxufVxuIl19