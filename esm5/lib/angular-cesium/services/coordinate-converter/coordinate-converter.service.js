import { __assign, __decorate, __metadata, __param } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
var LatLonVectors = geodesy['LatLonVectors']; // doesnt exists on typings
window['geodesy'] = geodesy;
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * @example
 * import { Component, OnInit } from '@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * @Component({
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
    CoordinateConverter.cartesian3ToLatLon = function (cartesian3, ellipsoid) {
        var cart = Cesium.Cartographic.fromCartesian(cartesian3, ellipsoid);
        return {
            lon: Cesium.Math.toDegrees(cart.longitude),
            lat: Cesium.Math.toDegrees(cart.latitude),
            height: cart.height
        };
    };
    CoordinateConverter.prototype.screenToCartesian3 = function (screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            var screenPosition = __assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                var mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            var camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    };
    CoordinateConverter.prototype.screenToCartographic = function (screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    };
    CoordinateConverter.prototype.cartesian3ToCartographic = function (cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    };
    CoordinateConverter.prototype.degreesToCartographic = function (longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    };
    CoordinateConverter.prototype.radiansToCartographic = function (longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    };
    CoordinateConverter.prototype.degreesToUTM = function (longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    };
    CoordinateConverter.prototype.UTMToDegrees = function (zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    };
    CoordinateConverter.prototype.geodesyToCesiumObject = function (geodesyRadians) {
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
    CoordinateConverter.prototype.midPointToCartesian3 = function (first, second) {
        var toDeg = function (rad) { return Cesium.Math.toDegrees(rad); };
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        var middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    };
    CoordinateConverter.prototype.middlePointByScreen = function (position0, position1) {
        var scene = this.cesiumService.getScene();
        var screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        var screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
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
    CoordinateConverter.prototype.bearingTo = function (first, second) {
        var toDeg = function (rad) { return Cesium.Math.toDegrees(rad); };
        var firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        var secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        var bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    };
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    CoordinateConverter.prototype.bearingToCartesian = function (firstCartesian3, secondCartesian3) {
        var firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        var secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    };
    CoordinateConverter.ctorParameters = function () { return [
        { type: CesiumService, decorators: [{ type: Optional }] }
    ]; };
    CoordinateConverter = __decorate([
        Injectable(),
        __param(0, Optional()),
        __metadata("design:paramtypes", [CesiumService])
    ], CoordinateConverter);
    return CoordinateConverter;
}());
export { CoordinateConverter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQXNCLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUdyRSxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQywyQkFBMkI7QUFFM0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUU1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUg7SUFDRSw2QkFBZ0MsYUFBNkI7UUFBN0Isa0JBQWEsR0FBYixhQUFhLENBQWdCO0lBQzdELENBQUM7SUFFTSxzQ0FBa0IsR0FBekIsVUFBMEIsVUFBc0IsRUFBRSxTQUFlO1FBQy9ELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN0RSxPQUFPO1lBQ0wsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDMUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDekMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUM7SUFDSixDQUFDO0lB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QUMsRUFBMUIsQ0FBMEIsQ0FBQztRQUMxRCxJQUFNLFVBQVUsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwRixJQUFNLFdBQVcsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2RixJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsZ0RBQWtCLEdBQWxCLFVBQW1CLGVBQTJCLEVBQUUsZ0JBQTRCO1FBQzFFLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLElBQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFdkUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMvQyxDQUFDOztnQkE5RytDLGFBQWEsdUJBQWhELFFBQVE7O0lBRFYsbUJBQW1CO1FBRC9CLFVBQVUsRUFBRTtRQUVFLFdBQUEsUUFBUSxFQUFFLENBQUE7eUNBQXlCLGFBQWE7T0FEbEQsbUJBQW1CLENBZ0gvQjtJQUFELDBCQUFDO0NBQUEsQUFoSEQsSUFnSEM7U0FoSFksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2VvZGVzeSBmcm9tICdnZW9kZXN5JztcbmltcG9ydCB7IGhlbWlzcGhlcmUsIExhdExvbiwgTGF0TG9uRWxsaXBzb2lkYWwsIFV0bSB9IGZyb20gJ2dlb2Rlc3knO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcblxuY29uc3QgTGF0TG9uVmVjdG9ycyA9IGdlb2Rlc3lbJ0xhdExvblZlY3RvcnMnXTsgLy8gZG9lc250IGV4aXN0cyBvbiB0eXBpbmdzXG5cbndpbmRvd1snZ2VvZGVzeSddID0gZ2VvZGVzeTtcblxuLyoqXG4gKiAgR2l2ZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNvb3JkaW5hdGVzLCB3ZSBwcm92aWRlIHlvdSBhIHNlcnZpY2UgY29udmVydGluZyB0aG9zZSB0eXBlcyB0byB0aGUgbW9zdCBjb21tb24gb3RoZXIgdHlwZXMuXG4gKiAgV2UgYXJlIHVzaW5nIHRoZSBnZW9kZXN5IGltcGxlbWVudGF0aW9uIG9mIFVUTSBjb252ZXJzaW9uLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICogaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJ2FuZ3VsYXIyLWNlc2l1bSc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiBcdFx0c2VsZWN0b3I6J215LWNvbXBvbmVudCcsXG4gKiBcdFx0dGVtcGxhdGU6JzxkaXY+e3tzaG93Q2FydG9ncmFwaGljfX08L2Rpdj4nLFxuICogXHRcdHByb3ZpZGVyczpbQ29vcmRpbmF0ZUNvbnZlcnRlcl1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICogXHRcdHNob3dDYXJ0b2dyYXBoaWM7XG4gKlxuICogXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjpDb29yZGluYXRlQ29udmVydGVyKXtcbiAqIFx0XHR9XG4gKlxuICogXHRcdG5nT25Jbml0KCl7XG4gKiBcdFx0XHR0aGlzLnNob3dDYXJ0b2dyYXBoaWMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuZGVncmVlc1RvQ2FydG9ncmFwaGljKDUsIDUsIDUpO1xuICogIH1cbiAqIH1cbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlQ29udmVydGVyIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlPzogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgc3RhdGljIGNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpOiB7bG9uOiBudW1iZXIsIGxhdDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcn0ge1xuICAgIGNvbnN0IGNhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuMywgZWxsaXBzb2lkKTtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uOiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMoY2FydC5sb25naXR1ZGUpLFxuICAgICAgbGF0OiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMoY2FydC5sYXRpdHVkZSksXG4gICAgICBoZWlnaHQ6IGNhcnQuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHNjcmVlblRvQ2FydGVzaWFuMyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3M/OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmNlc2l1bVNlcnZpY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQU5HVUxBUjItQ0VTSVVNIC0gQ2VzaXVtIHNlcnZpY2Ugc2hvdWxkIGJlIHByb3ZpZGVkIGluIG9yZGVyJyArXG4gICAgICAgICcgdG8gZG8gc2NyZWVuIHBvc2l0aW9uIGNhbGN1bGF0aW9ucycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IHsgLi4uc2NyZWVuUG9zIH07XG4gICAgICBpZiAoYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3MpIHtcbiAgICAgICAgY29uc3QgbWFwQm91bmRzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueCArPSBtYXBCb3VuZHMubGVmdDtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueSArPSBtYXBCb3VuZHMudG9wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgICAgcmV0dXJuIGNhbWVyYS5waWNrRWxsaXBzb2lkKHNjcmVlblBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzY3JlZW5Ub0NhcnRvZ3JhcGhpYyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgZWxsaXBzb2lkPzogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FydGVzaWFuM1RvQ2FydG9ncmFwaGljKHRoaXMuc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvcyksIGVsbGlwc29pZCk7XG4gIH1cblxuICBjYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWMoY2FydGVzaWFuOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbiwgZWxsaXBzb2lkKTtcbiAgfVxuXG4gIGRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbURlZ3JlZXMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIHJhZGlhbnNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbVJhZGlhbnMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIGRlZ3JlZXNUb1VUTShsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgTGF0TG9uRWxsaXBzb2lkYWwobGF0aXR1ZGUsIGxvbmdpdHVkZSkudG9VdG0oKTtcbiAgfVxuXG4gIFVUTVRvRGVncmVlcyh6b25lOiBudW1iZXIsIGhlbWlzcGhlcmVUeXBlOiBoZW1pc3BoZXJlLCBlYXN0aW5nOiBudW1iZXIsIG5vcnRoaW5nOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5nZW9kZXN5VG9DZXNpdW1PYmplY3QobmV3IFV0bSh6b25lLCBoZW1pc3BoZXJlVHlwZSwgZWFzdGluZywgbm9ydGhpbmcpLnRvTGF0TG9uRSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VvZGVzeVRvQ2VzaXVtT2JqZWN0KGdlb2Rlc3lSYWRpYW5zOiBMYXRMb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uZ2l0dWRlOiBnZW9kZXN5UmFkaWFucy5sb24sXG4gICAgICBsYXRpdHVkZTogZ2VvZGVzeVJhZGlhbnMubGF0LFxuICAgICAgaGVpZ2h0OiBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gPyBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gOiAwXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtaWRkbGUgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAqIEBwYXJhbSBmaXJzdCAgKGxhdGl0dWRlLGxvbmdpdHVkZSkgaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0gc2Vjb25kIChsYXRpdHVkZSxsb25naXR1ZGUpIGluIHJhZGlhbnNcbiAgICovXG4gIG1pZFBvaW50VG9DYXJ0ZXNpYW4zKGZpcnN0OiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0sIHNlY29uZDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9KSB7XG4gICAgY29uc3QgdG9EZWcgPSAocmFkOiBudW1iZXIpID0+IENlc2l1bS5NYXRoLnRvRGVncmVlcyhyYWQpO1xuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhmaXJzdC5sYXRpdHVkZSksIHRvRGVnKGZpcnN0LmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IHNlY29uZFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoc2Vjb25kLmxhdGl0dWRlKSwgdG9EZWcoc2Vjb25kLmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IG1pZGRsZVBvaW50OiBhbnkgPSBmaXJzdFBvaW50Lm1pZHBvaW50VG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21EZWdyZWVzKG1pZGRsZVBvaW50LmxvbiwgbWlkZGxlUG9pbnQubGF0KTtcbiAgfVxuXG4gIG1pZGRsZVBvaW50QnlTY3JlZW4ocG9zaXRpb24wOiBDYXJ0ZXNpYW4zLCBwb3NpdGlvbjE6IENhcnRlc2lhbjMpOiBDYXJ0ZXNpYW4zIHtcbiAgICBjb25zdCBzY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMSA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjApO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjEpO1xuICAgIGNvbnN0IG1pZGRsZVNjcmVlblBvaW50ID1cbiAgICAgIG5ldyBDZXNpdW0uQ2FydGVzaWFuMigoc2NyZWVuUG9zaXRpb24yLnggKyBzY3JlZW5Qb3NpdGlvbjEueCkgLyAyLjAsIChzY3JlZW5Qb3NpdGlvbjIueSArIHNjcmVlblBvc2l0aW9uMS55KSAvIDIuMCk7XG4gICAgcmV0dXJuIHNjZW5lLnBpY2tQb3NpdGlvbihtaWRkbGVTY3JlZW5Qb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiAqIEByZXR1cm4gYmVhcmluZyBpbiBkZWdyZWVzXG4gICAqIEBwYXJhbSBmaXJzdCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHNlY29uZCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICovXG4gIGJlYXJpbmdUbyhmaXJzdDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9LCBzZWNvbmQ6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSkge1xuICAgIGNvbnN0IHRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMocmFkKTtcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoZmlyc3QubGF0aXR1ZGUpLCB0b0RlZyhmaXJzdC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBzZWNvbmRQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKHNlY29uZC5sYXRpdHVkZSksIHRvRGVnKHNlY29uZC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBiZWFyaW5nID0gZmlyc3RQb2ludC5iZWFyaW5nVG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIGJlYXJpbmc7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiBAcmV0dXJuIGJlYXJpbmcgaW4gZGVncmVlc1xuICAgKi9cbiAgYmVhcmluZ1RvQ2FydGVzaWFuKGZpcnN0Q2FydGVzaWFuMzogQ2FydGVzaWFuMywgc2Vjb25kQ2FydGVzaWFuMzogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IGZpcnN0Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihmaXJzdENhcnRlc2lhbjMpO1xuICAgIGNvbnN0IHNlY29uZENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oc2Vjb25kQ2FydGVzaWFuMyk7XG5cbiAgICByZXR1cm4gdGhpcy5iZWFyaW5nVG8oZmlyc3RDYXJ0LCBzZWNvbmRDYXJ0KTtcbiAgfVxufVxuIl19