/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Optional } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
/** @type {?} */
const LatLonVectors = geodesy['LatLonVectors'];
// doesnt exists on typings
window['geodesy'] = geodesy;
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * \@example
 * import { Component, OnInit } from '\@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * \@Component({
 * 		selector:'my-component',
 * 		template:'<div>{{showCartographic}}</div>',
 * 		providers:[CoordinateConverter]
 * })
 * export class MyComponent implements OnInit {
 * 		showCartographic;
 *
 * 		constructor(private coordinateConverter:CoordinateConverter){
 * 		}
 *
 * 		ngOnInit(){
 * 			this.showCartographic = this.coordinateConverter.degreesToCartographic(5, 5, 5);
 *  }
 * }
 *
 */
export class CoordinateConverter {
    /**
     * @param {?=} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    screenToCartesian3(screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            /** @type {?} */
            const screenPosition = Object.assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                /** @type {?} */
                const mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            /** @type {?} */
            const camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    }
    /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    screenToCartographic(screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    }
    /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    cartesian3ToCartographic(cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    degreesToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    radiansToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    }
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    degreesToUTM(longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    }
    /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    UTMToDegrees(zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    }
    /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    geodesyToCesiumObject(geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    }
    /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    midPointToCartesian3(first, second) {
        /** @type {?} */
        const toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        (rad) => Cesium.Math.toDegrees(rad));
        /** @type {?} */
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        const middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    middlePointByScreen(position0, position1) {
        /** @type {?} */
        const scene = this.cesiumService.getScene();
        /** @type {?} */
        const screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        /** @type {?} */
        const screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        /** @type {?} */
        const middleScreenPoint = new Cesium.Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    }
    /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    bearingTo(first, second) {
        /** @type {?} */
        const toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        (rad) => Cesium.Math.toDegrees(rad));
        /** @type {?} */
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        const bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    }
    /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    bearingToCartesian(firstCartesian3, secondCartesian3) {
        /** @type {?} */
        const firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        /** @type {?} */
        const secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    }
}
CoordinateConverter.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CoordinateConverter.ctorParameters = () => [
    { type: CesiumService, decorators: [{ type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    CoordinateConverter.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQXNCLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7TUFHL0QsYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7O0FBRTlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEI1QixNQUFNLE9BQU8sbUJBQW1COzs7O0lBQzlCLFlBQWdDLGFBQTZCO1FBQTdCLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtJQUM3RCxDQUFDOzs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxTQUFtQyxFQUFFLHVCQUFpQztRQUN2RixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RDtnQkFDNUUscUNBQXFDLENBQUMsQ0FBQztTQUMxQzthQUFNOztrQkFDQyxjQUFjLHFCQUFRLFNBQVMsQ0FBRTtZQUN2QyxJQUFJLHVCQUF1QixFQUFFOztzQkFDckIsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFO2dCQUMvRSxjQUFjLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUM7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QUM7UUFFdEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7WUF2R0YsVUFBVTs7OztZQWxDRixhQUFhLHVCQW9DUCxRQUFROzs7Ozs7O0lBQVQsNENBQWlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2VvZGVzeSBmcm9tICdnZW9kZXN5JztcbmltcG9ydCB7IGhlbWlzcGhlcmUsIExhdExvbiwgTGF0TG9uRWxsaXBzb2lkYWwsIFV0bSB9IGZyb20gJ2dlb2Rlc3knO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcblxuY29uc3QgTGF0TG9uVmVjdG9ycyA9IGdlb2Rlc3lbJ0xhdExvblZlY3RvcnMnXTsgLy8gZG9lc250IGV4aXN0cyBvbiB0eXBpbmdzXG5cbndpbmRvd1snZ2VvZGVzeSddID0gZ2VvZGVzeTtcblxuLyoqXG4gKiAgR2l2ZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNvb3JkaW5hdGVzLCB3ZSBwcm92aWRlIHlvdSBhIHNlcnZpY2UgY29udmVydGluZyB0aG9zZSB0eXBlcyB0byB0aGUgbW9zdCBjb21tb24gb3RoZXIgdHlwZXMuXG4gKiAgV2UgYXJlIHVzaW5nIHRoZSBnZW9kZXN5IGltcGxlbWVudGF0aW9uIG9mIFVUTSBjb252ZXJzaW9uLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICogaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJ2FuZ3VsYXIyLWNlc2l1bSc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiBcdFx0c2VsZWN0b3I6J215LWNvbXBvbmVudCcsXG4gKiBcdFx0dGVtcGxhdGU6JzxkaXY+e3tzaG93Q2FydG9ncmFwaGljfX08L2Rpdj4nLFxuICogXHRcdHByb3ZpZGVyczpbQ29vcmRpbmF0ZUNvbnZlcnRlcl1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICogXHRcdHNob3dDYXJ0b2dyYXBoaWM7XG4gKlxuICogXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjpDb29yZGluYXRlQ29udmVydGVyKXtcbiAqIFx0XHR9XG4gKlxuICogXHRcdG5nT25Jbml0KCl7XG4gKiBcdFx0XHR0aGlzLnNob3dDYXJ0b2dyYXBoaWMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuZGVncmVlc1RvQ2FydG9ncmFwaGljKDUsIDUsIDUpO1xuICogIH1cbiAqIH1cbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlQ29udmVydGVyIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlPzogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCBhZGRNYXBDYW52YXNCb3VuZHNUb1Bvcz86IGJvb2xlYW4pIHtcbiAgICBpZiAoIXRoaXMuY2VzaXVtU2VydmljZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBTkdVTEFSMi1DRVNJVU0gLSBDZXNpdW0gc2VydmljZSBzaG91bGQgYmUgcHJvdmlkZWQgaW4gb3JkZXInICtcbiAgICAgICAgJyB0byBkbyBzY3JlZW4gcG9zaXRpb24gY2FsY3VsYXRpb25zJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uID0geyAuLi5zY3JlZW5Qb3MgfTtcbiAgICAgIGlmIChhZGRNYXBDYW52YXNCb3VuZHNUb1Bvcykge1xuICAgICAgICBjb25zdCBtYXBCb3VuZHMgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBzY3JlZW5Qb3NpdGlvbi54ICs9IG1hcEJvdW5kcy5sZWZ0O1xuICAgICAgICBzY3JlZW5Qb3NpdGlvbi55ICs9IG1hcEJvdW5kcy50b3A7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XG4gICAgICByZXR1cm4gY2FtZXJhLnBpY2tFbGxpcHNvaWQoc2NyZWVuUG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHNjcmVlblRvQ2FydG9ncmFwaGljKHNjcmVlblBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCBlbGxpcHNvaWQ/OiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5jYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWModGhpcy5zY3JlZW5Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zKSwgZWxsaXBzb2lkKTtcbiAgfVxuXG4gIGNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhjYXJ0ZXNpYW46IENhcnRlc2lhbjMsIGVsbGlwc29pZD86IGFueSkge1xuICAgIHJldHVybiBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuLCBlbGxpcHNvaWQpO1xuICB9XG5cbiAgZGVncmVlc1RvQ2FydG9ncmFwaGljKGxvbmdpdHVkZTogbnVtYmVyLCBsYXRpdHVkZTogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tRGVncmVlcyhsb25naXR1ZGUsIGxhdGl0dWRlLCBoZWlnaHQpO1xuICB9XG5cbiAgcmFkaWFuc1RvQ2FydG9ncmFwaGljKGxvbmdpdHVkZTogbnVtYmVyLCBsYXRpdHVkZTogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tUmFkaWFucyhsb25naXR1ZGUsIGxhdGl0dWRlLCBoZWlnaHQpO1xuICB9XG5cbiAgZGVncmVlc1RvVVRNKGxvbmdpdHVkZTogbnVtYmVyLCBsYXRpdHVkZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBMYXRMb25FbGxpcHNvaWRhbChsYXRpdHVkZSwgbG9uZ2l0dWRlKS50b1V0bSgpO1xuICB9XG5cbiAgVVRNVG9EZWdyZWVzKHpvbmU6IG51bWJlciwgaGVtaXNwaGVyZVR5cGU6IGhlbWlzcGhlcmUsIGVhc3Rpbmc6IG51bWJlciwgbm9ydGhpbmc6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmdlb2Rlc3lUb0Nlc2l1bU9iamVjdChuZXcgVXRtKHpvbmUsIGhlbWlzcGhlcmVUeXBlLCBlYXN0aW5nLCBub3J0aGluZykudG9MYXRMb25FKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW9kZXN5VG9DZXNpdW1PYmplY3QoZ2VvZGVzeVJhZGlhbnM6IExhdExvbikge1xuICAgIHJldHVybiB7XG4gICAgICBsb25naXR1ZGU6IGdlb2Rlc3lSYWRpYW5zLmxvbixcbiAgICAgIGxhdGl0dWRlOiBnZW9kZXN5UmFkaWFucy5sYXQsXG4gICAgICBoZWlnaHQ6IGdlb2Rlc3lSYWRpYW5zWydoZWlnaHQnXSA/IGdlb2Rlc3lSYWRpYW5zWydoZWlnaHQnXSA6IDBcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIG1pZGRsZSBwb2ludCBiZXR3ZWVuIHR3byBwb2ludHNcbiAgICogQHBhcmFtIGZpcnN0ICAobGF0aXR1ZGUsbG9uZ2l0dWRlKSBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSBzZWNvbmQgKGxhdGl0dWRlLGxvbmdpdHVkZSkgaW4gcmFkaWFuc1xuICAgKi9cbiAgbWlkUG9pbnRUb0NhcnRlc2lhbjMoZmlyc3Q6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSwgc2Vjb25kOiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0pIHtcbiAgICBjb25zdCB0b0RlZyA9IChyYWQ6IG51bWJlcikgPT4gQ2VzaXVtLk1hdGgudG9EZWdyZWVzKHJhZCk7XG4gICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKGZpcnN0LmxhdGl0dWRlKSwgdG9EZWcoZmlyc3QubG9uZ2l0dWRlKSk7XG4gICAgY29uc3Qgc2Vjb25kUG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhzZWNvbmQubGF0aXR1ZGUpLCB0b0RlZyhzZWNvbmQubG9uZ2l0dWRlKSk7XG4gICAgY29uc3QgbWlkZGxlUG9pbnQ6IGFueSA9IGZpcnN0UG9pbnQubWlkcG9pbnRUbyhzZWNvbmRQb2ludCk7XG5cbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbURlZ3JlZXMobWlkZGxlUG9pbnQubG9uLCBtaWRkbGVQb2ludC5sYXQpO1xuICB9XG5cbiAgbWlkZGxlUG9pbnRCeVNjcmVlbihwb3NpdGlvbjA6IENhcnRlc2lhbjMsIHBvc2l0aW9uMTogQ2FydGVzaWFuMyk6IENhcnRlc2lhbjMge1xuICAgIGNvbnN0IHNjZW5lID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgY29uc3Qgc2NyZWVuUG9zaXRpb24xID0gQ2VzaXVtLlNjZW5lVHJhbnNmb3Jtcy53Z3M4NFRvV2luZG93Q29vcmRpbmF0ZXMoc2NlbmUsIHBvc2l0aW9uMCk7XG4gICAgY29uc3Qgc2NyZWVuUG9zaXRpb24yID0gQ2VzaXVtLlNjZW5lVHJhbnNmb3Jtcy53Z3M4NFRvV2luZG93Q29vcmRpbmF0ZXMoc2NlbmUsIHBvc2l0aW9uMSk7XG4gICAgY29uc3QgbWlkZGxlU2NyZWVuUG9pbnQgPVxuICAgICAgbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKChzY3JlZW5Qb3NpdGlvbjIueCArIHNjcmVlblBvc2l0aW9uMS54KSAvIDIuMCwgKHNjcmVlblBvc2l0aW9uMi55ICsgc2NyZWVuUG9zaXRpb24xLnkpIC8gMi4wKTtcbiAgICByZXR1cm4gc2NlbmUucGlja1Bvc2l0aW9uKG1pZGRsZVNjcmVlblBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0aWFsIGJlYXJpbmcgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAqXG4gICAqICogQHJldHVybiBiZWFyaW5nIGluIGRlZ3JlZXNcbiAgICogQHBhcmFtIGZpcnN0IC0ge2xhdGl0dWRlLGxvbmdpdHVkZX0gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0gc2Vjb25kIC0ge2xhdGl0dWRlLGxvbmdpdHVkZX0gaW4gcmFkaWFuc1xuICAgKi9cbiAgYmVhcmluZ1RvKGZpcnN0OiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0sIHNlY29uZDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9KSB7XG4gICAgY29uc3QgdG9EZWcgPSAocmFkOiBudW1iZXIpID0+IENlc2l1bS5NYXRoLnRvRGVncmVlcyhyYWQpO1xuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhmaXJzdC5sYXRpdHVkZSksIHRvRGVnKGZpcnN0LmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IHNlY29uZFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoc2Vjb25kLmxhdGl0dWRlKSwgdG9EZWcoc2Vjb25kLmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IGJlYXJpbmcgPSBmaXJzdFBvaW50LmJlYXJpbmdUbyhzZWNvbmRQb2ludCk7XG5cbiAgICByZXR1cm4gYmVhcmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0aWFsIGJlYXJpbmcgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAqXG4gICAqIEByZXR1cm4gYmVhcmluZyBpbiBkZWdyZWVzXG4gICAqL1xuICBiZWFyaW5nVG9DYXJ0ZXNpYW4oZmlyc3RDYXJ0ZXNpYW4zOiBDYXJ0ZXNpYW4zLCBzZWNvbmRDYXJ0ZXNpYW4zOiBDYXJ0ZXNpYW4zKSB7XG4gICAgY29uc3QgZmlyc3RDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGZpcnN0Q2FydGVzaWFuMyk7XG4gICAgY29uc3Qgc2Vjb25kQ2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihzZWNvbmRDYXJ0ZXNpYW4zKTtcblxuICAgIHJldHVybiB0aGlzLmJlYXJpbmdUbyhmaXJzdENhcnQsIHNlY29uZENhcnQpO1xuICB9XG59XG4iXX0=