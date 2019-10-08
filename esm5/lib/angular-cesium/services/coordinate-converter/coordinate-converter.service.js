/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
/** @type {?} */
var LatLonVectors = geodesy['LatLonVectors'];
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
var CoordinateConverter = /** @class */ (function () {
    function CoordinateConverter(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    CoordinateConverter.prototype.screenToCartesian3 = /**
     * @param {?} screenPos
     * @param {?=} addMapCanvasBoundsToPos
     * @return {?}
     */
    function (screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            /** @type {?} */
            var screenPosition = tslib_1.__assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                /** @type {?} */
                var mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            /** @type {?} */
            var camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    };
    /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    CoordinateConverter.prototype.screenToCartographic = /**
     * @param {?} screenPos
     * @param {?=} ellipsoid
     * @return {?}
     */
    function (screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    };
    /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    CoordinateConverter.prototype.cartesian3ToCartographic = /**
     * @param {?} cartesian
     * @param {?=} ellipsoid
     * @return {?}
     */
    function (cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    CoordinateConverter.prototype.degreesToCartographic = /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    function (longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    CoordinateConverter.prototype.radiansToCartographic = /**
     * @param {?} longitude
     * @param {?} latitude
     * @param {?=} height
     * @return {?}
     */
    function (longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    };
    /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    CoordinateConverter.prototype.degreesToUTM = /**
     * @param {?} longitude
     * @param {?} latitude
     * @return {?}
     */
    function (longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    };
    /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    CoordinateConverter.prototype.UTMToDegrees = /**
     * @param {?} zone
     * @param {?} hemisphereType
     * @param {?} easting
     * @param {?} northing
     * @return {?}
     */
    function (zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    };
    /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    CoordinateConverter.prototype.geodesyToCesiumObject = /**
     * @private
     * @param {?} geodesyRadians
     * @return {?}
     */
    function (geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    };
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    CoordinateConverter.prototype.midPointToCartesian3 = /**
     * middle point between two points
     * @param {?} first  (latitude,longitude) in radians
     * @param {?} second (latitude,longitude) in radians
     * @return {?}
     */
    function (first, second) {
        /** @type {?} */
        var toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        function (rad) { return Cesium.Math.toDegrees(rad); });
        /** @type {?} */
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        var middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    CoordinateConverter.prototype.middlePointByScreen = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        /** @type {?} */
        var scene = this.cesiumService.getScene();
        /** @type {?} */
        var screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        /** @type {?} */
        var screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        /** @type {?} */
        var middleScreenPoint = new Cesium.Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    };
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    CoordinateConverter.prototype.bearingTo = /**
     * initial bearing between two points
     *
     * * \@return bearing in degrees
     * @param {?} first - {latitude,longitude} in radians
     * @param {?} second - {latitude,longitude} in radians
     * @return {?}
     */
    function (first, second) {
        /** @type {?} */
        var toDeg = (/**
         * @param {?} rad
         * @return {?}
         */
        function (rad) { return Cesium.Math.toDegrees(rad); });
        /** @type {?} */
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        /** @type {?} */
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        /** @type {?} */
        var bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    };
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    CoordinateConverter.prototype.bearingToCartesian = /**
     * initial bearing between two points
     *
     * @param {?} firstCartesian3
     * @param {?} secondCartesian3
     * @return {?} bearing in degrees
     */
    function (firstCartesian3, secondCartesian3) {
        /** @type {?} */
        var firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        /** @type {?} */
        var secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    };
    CoordinateConverter.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CoordinateConverter.ctorParameters = function () { return [
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    return CoordinateConverter;
}());
export { CoordinateConverter };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CoordinateConverter.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxLQUFLLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUFzQixpQkFBaUIsRUFBRSxHQUFHLEVBQUUsTUFBTSxTQUFTLENBQUM7O0lBRy9ELGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDOztBQUU5QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCNUI7SUFFRSw2QkFBZ0MsYUFBNkI7UUFBN0Isa0JBQWEsR0FBYixhQUFhLENBQWdCO0lBQzdELENBQUM7Ozs7OztJQUVELGdEQUFrQjs7Ozs7SUFBbEIsVUFBbUIsU0FBbUMsRUFBRSx1QkFBaUM7UUFDdkYsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQ7Z0JBQzVFLHFDQUFxQyxDQUFDLENBQUM7U0FDMUM7YUFBTTs7Z0JBQ0MsY0FBYyx3QkFBUSxTQUFTLENBQUU7WUFDdkMsSUFBSSx1QkFBdUIsRUFBRTs7b0JBQ3JCLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRTtnQkFDL0UsY0FBYyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxj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OztPQUlHOzs7Ozs7OztJQUNILGdEQUFrQjs7Ozs7OztJQUFsQixVQUFtQixlQUEyQixFQUFFLGdCQUE0Qjs7WUFDcEUsU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQzs7WUFDOUQsVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDO1FBRXRFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Z0JBdkdGLFVBQVU7Ozs7Z0JBbENGLGFBQWEsdUJBb0NQLFFBQVE7O0lBc0d2QiwwQkFBQztDQUFBLEFBeEdELElBd0dDO1NBdkdZLG1CQUFtQjs7Ozs7O0lBQ2xCLDRDQUFpRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIGdlb2Rlc3kgZnJvbSAnZ2VvZGVzeSc7XG5pbXBvcnQgeyBoZW1pc3BoZXJlLCBMYXRMb24sIExhdExvbkVsbGlwc29pZGFsLCBVdG0gfSBmcm9tICdnZW9kZXN5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2FydGVzaWFuMyc7XG5cbmNvbnN0IExhdExvblZlY3RvcnMgPSBnZW9kZXN5WydMYXRMb25WZWN0b3JzJ107IC8vIGRvZXNudCBleGlzdHMgb24gdHlwaW5nc1xuXG53aW5kb3dbJ2dlb2Rlc3knXSA9IGdlb2Rlc3k7XG5cbi8qKlxuICogIEdpdmVuIGRpZmZlcmVudCB0eXBlcyBvZiBjb29yZGluYXRlcywgd2UgcHJvdmlkZSB5b3UgYSBzZXJ2aWNlIGNvbnZlcnRpbmcgdGhvc2UgdHlwZXMgdG8gdGhlIG1vc3QgY29tbW9uIG90aGVyIHR5cGVzLlxuICogIFdlIGFyZSB1c2luZyB0aGUgZ2VvZGVzeSBpbXBsZW1lbnRhdGlvbiBvZiBVVE0gY29udmVyc2lvbi4gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vY2hyaXN2ZW5lc3MvZ2VvZGVzeS5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAqIGltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICdhbmd1bGFyMi1jZXNpdW0nO1xuICpcbiAqIEBDb21wb25lbnQoe1xuICogXHRcdHNlbGVjdG9yOidteS1jb21wb25lbnQnLFxuICogXHRcdHRlbXBsYXRlOic8ZGl2Pnt7c2hvd0NhcnRvZ3JhcGhpY319PC9kaXY+JyxcbiAqIFx0XHRwcm92aWRlcnM6W0Nvb3JkaW5hdGVDb252ZXJ0ZXJdXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIE15Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAqIFx0XHRzaG93Q2FydG9ncmFwaGljO1xuICpcbiAqIFx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6Q29vcmRpbmF0ZUNvbnZlcnRlcil7XG4gKiBcdFx0fVxuICpcbiAqIFx0XHRuZ09uSW5pdCgpe1xuICogXHRcdFx0dGhpcy5zaG93Q2FydG9ncmFwaGljID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyg1LCA1LCA1KTtcbiAqICB9XG4gKiB9XG4gKlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29vcmRpbmF0ZUNvbnZlcnRlciB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHByaXZhdGUgY2VzaXVtU2VydmljZT86IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIHNjcmVlblRvQ2FydGVzaWFuMyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3M/OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmNlc2l1bVNlcnZpY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQU5HVUxBUjItQ0VTSVVNIC0gQ2VzaXVtIHNlcnZpY2Ugc2hvdWxkIGJlIHByb3ZpZGVkIGluIG9yZGVyJyArXG4gICAgICAgICcgdG8gZG8gc2NyZWVuIHBvc2l0aW9uIGNhbGN1bGF0aW9ucycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IHsgLi4uc2NyZWVuUG9zIH07XG4gICAgICBpZiAoYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3MpIHtcbiAgICAgICAgY29uc3QgbWFwQm91bmRzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueCArPSBtYXBCb3VuZHMubGVmdDtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueSArPSBtYXBCb3VuZHMudG9wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgICAgcmV0dXJuIGNhbWVyYS5waWNrRWxsaXBzb2lkKHNjcmVlblBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzY3JlZW5Ub0NhcnRvZ3JhcGhpYyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgZWxsaXBzb2lkPzogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FydGVzaWFuM1RvQ2FydG9ncmFwaGljKHRoaXMuc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvcyksIGVsbGlwc29pZCk7XG4gIH1cblxuICBjYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWMoY2FydGVzaWFuOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbiwgZWxsaXBzb2lkKTtcbiAgfVxuXG4gIGRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbURlZ3JlZXMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIHJhZGlhbnNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbVJhZGlhbnMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIGRlZ3JlZXNUb1VUTShsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgTGF0TG9uRWxsaXBzb2lkYWwobGF0aXR1ZGUsIGxvbmdpdHVkZSkudG9VdG0oKTtcbiAgfVxuXG4gIFVUTVRvRGVncmVlcyh6b25lOiBudW1iZXIsIGhlbWlzcGhlcmVUeXBlOiBoZW1pc3BoZXJlLCBlYXN0aW5nOiBudW1iZXIsIG5vcnRoaW5nOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5nZW9kZXN5VG9DZXNpdW1PYmplY3QobmV3IFV0bSh6b25lLCBoZW1pc3BoZXJlVHlwZSwgZWFzdGluZywgbm9ydGhpbmcpLnRvTGF0TG9uRSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VvZGVzeVRvQ2VzaXVtT2JqZWN0KGdlb2Rlc3lSYWRpYW5zOiBMYXRMb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uZ2l0dWRlOiBnZW9kZXN5UmFkaWFucy5sb24sXG4gICAgICBsYXRpdHVkZTogZ2VvZGVzeVJhZGlhbnMubGF0LFxuICAgICAgaGVpZ2h0OiBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gPyBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gOiAwXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtaWRkbGUgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAqIEBwYXJhbSBmaXJzdCAgKGxhdGl0dWRlLGxvbmdpdHVkZSkgaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0gc2Vjb25kIChsYXRpdHVkZSxsb25naXR1ZGUpIGluIHJhZGlhbnNcbiAgICovXG4gIG1pZFBvaW50VG9DYXJ0ZXNpYW4zKGZpcnN0OiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0sIHNlY29uZDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9KSB7XG4gICAgY29uc3QgdG9EZWcgPSAocmFkOiBudW1iZXIpID0+IENlc2l1bS5NYXRoLnRvRGVncmVlcyhyYWQpO1xuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhmaXJzdC5sYXRpdHVkZSksIHRvRGVnKGZpcnN0LmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IHNlY29uZFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoc2Vjb25kLmxhdGl0dWRlKSwgdG9EZWcoc2Vjb25kLmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IG1pZGRsZVBvaW50OiBhbnkgPSBmaXJzdFBvaW50Lm1pZHBvaW50VG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21EZWdyZWVzKG1pZGRsZVBvaW50LmxvbiwgbWlkZGxlUG9pbnQubGF0KTtcbiAgfVxuXG4gIG1pZGRsZVBvaW50QnlTY3JlZW4ocG9zaXRpb24wOiBDYXJ0ZXNpYW4zLCBwb3NpdGlvbjE6IENhcnRlc2lhbjMpOiBDYXJ0ZXNpYW4zIHtcbiAgICBjb25zdCBzY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMSA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjApO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjEpO1xuICAgIGNvbnN0IG1pZGRsZVNjcmVlblBvaW50ID1cbiAgICAgIG5ldyBDZXNpdW0uQ2FydGVzaWFuMigoc2NyZWVuUG9zaXRpb24yLnggKyBzY3JlZW5Qb3NpdGlvbjEueCkgLyAyLjAsIChzY3JlZW5Qb3NpdGlvbjIueSArIHNjcmVlblBvc2l0aW9uMS55KSAvIDIuMCk7XG4gICAgcmV0dXJuIHNjZW5lLnBpY2tQb3NpdGlvbihtaWRkbGVTY3JlZW5Qb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiAqIEByZXR1cm4gYmVhcmluZyBpbiBkZWdyZWVzXG4gICAqIEBwYXJhbSBmaXJzdCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHNlY29uZCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICovXG4gIGJlYXJpbmdUbyhmaXJzdDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9LCBzZWNvbmQ6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSkge1xuICAgIGNvbnN0IHRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMocmFkKTtcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoZmlyc3QubGF0aXR1ZGUpLCB0b0RlZyhmaXJzdC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBzZWNvbmRQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKHNlY29uZC5sYXRpdHVkZSksIHRvRGVnKHNlY29uZC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBiZWFyaW5nID0gZmlyc3RQb2ludC5iZWFyaW5nVG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIGJlYXJpbmc7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiBAcmV0dXJuIGJlYXJpbmcgaW4gZGVncmVlc1xuICAgKi9cbiAgYmVhcmluZ1RvQ2FydGVzaWFuKGZpcnN0Q2FydGVzaWFuMzogQ2FydGVzaWFuMywgc2Vjb25kQ2FydGVzaWFuMzogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IGZpcnN0Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihmaXJzdENhcnRlc2lhbjMpO1xuICAgIGNvbnN0IHNlY29uZENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oc2Vjb25kQ2FydGVzaWFuMyk7XG5cbiAgICByZXR1cm4gdGhpcy5iZWFyaW5nVG8oZmlyc3RDYXJ0LCBzZWNvbmRDYXJ0KTtcbiAgfVxufVxuIl19