import { Injectable, Optional } from '@angular/core';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
const LatLonVectors = geodesy['LatLonVectors']; // doesnt exists on typings
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
export class CoordinateConverter {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    static cartesian3ToLatLon(cartesian3, ellipsoid) {
        const cart = Cesium.Cartographic.fromCartesian(cartesian3, ellipsoid);
        return {
            lon: Cesium.Math.toDegrees(cart.longitude),
            lat: Cesium.Math.toDegrees(cart.latitude),
            height: cart.height
        };
    }
    screenToCartesian3(screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            const screenPosition = { ...screenPos };
            if (addMapCanvasBoundsToPos) {
                const mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            const camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    }
    screenToCartographic(screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    }
    cartesian3ToCartographic(cartesian, ellipsoid) {
        return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
    }
    degreesToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    }
    radiansToCartographic(longitude, latitude, height) {
        return Cesium.Cartographic.fromRadians(longitude, latitude, height);
    }
    degreesToUTM(longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    }
    UTMToDegrees(zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    }
    geodesyToCesiumObject(geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    }
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    midPointToCartesian3(first, second) {
        const toDeg = (rad) => Cesium.Math.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const middlePoint = firstPoint.midpointTo(secondPoint);
        return Cesium.Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    }
    middlePointByScreen(position0, position1) {
        const scene = this.cesiumService.getScene();
        const screenPosition1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        const screenPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        const middleScreenPoint = new Cesium.Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    }
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    bearingTo(first, second) {
        const toDeg = (rad) => Cesium.Math.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    }
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    bearingToCartesian(firstCartesian3, secondCartesian3) {
        const firstCart = Cesium.Cartographic.fromCartesian(firstCartesian3);
        const secondCart = Cesium.Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CoordinateConverter, deps: [{ token: i1.CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CoordinateConverter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: CoordinateConverter, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRCxPQUFPLEtBQUssT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQXNCLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBR3JFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLDJCQUEyQjtBQUUzRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBRTVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCLFlBQWdDLGFBQTZCO1FBQTdCLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtJQUM3RCxDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQXNCLEVBQUUsU0FBZTtRQUMvRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdEUsT0FBTztZQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFDLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3pDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO0lBQ0os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QUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwRixNQUFNLFdBQVcsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2RixNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsa0JBQWtCLENBQUMsZUFBMkIsRUFBRSxnQkFBNEI7UUFDMUUsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckUsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV2RSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7OEdBL0dVLG1CQUFtQjtrSEFBbkIsbUJBQW1COzsyRkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVOzswQkFFSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2VvZGVzeSBmcm9tICdnZW9kZXN5JztcbmltcG9ydCB7IGhlbWlzcGhlcmUsIExhdExvbiwgTGF0TG9uRWxsaXBzb2lkYWwsIFV0bSB9IGZyb20gJ2dlb2Rlc3knO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL21vZGVscy9jYXJ0ZXNpYW4zJztcblxuY29uc3QgTGF0TG9uVmVjdG9ycyA9IGdlb2Rlc3lbJ0xhdExvblZlY3RvcnMnXTsgLy8gZG9lc250IGV4aXN0cyBvbiB0eXBpbmdzXG5cbndpbmRvd1snZ2VvZGVzeSddID0gZ2VvZGVzeTtcblxuLyoqXG4gKiAgR2l2ZW4gZGlmZmVyZW50IHR5cGVzIG9mIGNvb3JkaW5hdGVzLCB3ZSBwcm92aWRlIHlvdSBhIHNlcnZpY2UgY29udmVydGluZyB0aG9zZSB0eXBlcyB0byB0aGUgbW9zdCBjb21tb24gb3RoZXIgdHlwZXMuXG4gKiAgV2UgYXJlIHVzaW5nIHRoZSBnZW9kZXN5IGltcGxlbWVudGF0aW9uIG9mIFVUTSBjb252ZXJzaW9uLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5LlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICogaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJ2FuZ3VsYXIyLWNlc2l1bSc7XG4gKlxuICogQENvbXBvbmVudCh7XG4gKiBcdFx0c2VsZWN0b3I6J215LWNvbXBvbmVudCcsXG4gKiBcdFx0dGVtcGxhdGU6JzxkaXY+e3tzaG93Q2FydG9ncmFwaGljfX08L2Rpdj4nLFxuICogXHRcdHByb3ZpZGVyczpbQ29vcmRpbmF0ZUNvbnZlcnRlcl1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgTXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICogXHRcdHNob3dDYXJ0b2dyYXBoaWM7XG4gKlxuICogXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjpDb29yZGluYXRlQ29udmVydGVyKXtcbiAqIFx0XHR9XG4gKlxuICogXHRcdG5nT25Jbml0KCl7XG4gKiBcdFx0XHR0aGlzLnNob3dDYXJ0b2dyYXBoaWMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuZGVncmVlc1RvQ2FydG9ncmFwaGljKDUsIDUsIDUpO1xuICogIH1cbiAqIH1cbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlQ29udmVydGVyIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlPzogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgc3RhdGljIGNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpOiB7bG9uOiBudW1iZXIsIGxhdDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcn0ge1xuICAgIGNvbnN0IGNhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuMywgZWxsaXBzb2lkKTtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uOiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMoY2FydC5sb25naXR1ZGUpLFxuICAgICAgbGF0OiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMoY2FydC5sYXRpdHVkZSksXG4gICAgICBoZWlnaHQ6IGNhcnQuaGVpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIHNjcmVlblRvQ2FydGVzaWFuMyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3M/OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmNlc2l1bVNlcnZpY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQU5HVUxBUjItQ0VTSVVNIC0gQ2VzaXVtIHNlcnZpY2Ugc2hvdWxkIGJlIHByb3ZpZGVkIGluIG9yZGVyJyArXG4gICAgICAgICcgdG8gZG8gc2NyZWVuIHBvc2l0aW9uIGNhbGN1bGF0aW9ucycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IHsgLi4uc2NyZWVuUG9zIH07XG4gICAgICBpZiAoYWRkTWFwQ2FudmFzQm91bmRzVG9Qb3MpIHtcbiAgICAgICAgY29uc3QgbWFwQm91bmRzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueCArPSBtYXBCb3VuZHMubGVmdDtcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueSArPSBtYXBCb3VuZHMudG9wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgICAgcmV0dXJuIGNhbWVyYS5waWNrRWxsaXBzb2lkKHNjcmVlblBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzY3JlZW5Ub0NhcnRvZ3JhcGhpYyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgZWxsaXBzb2lkPzogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuY2FydGVzaWFuM1RvQ2FydG9ncmFwaGljKHRoaXMuc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvcyksIGVsbGlwc29pZCk7XG4gIH1cblxuICBjYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWMoY2FydGVzaWFuOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbiwgZWxsaXBzb2lkKTtcbiAgfVxuXG4gIGRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbURlZ3JlZXMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIHJhZGlhbnNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbVJhZGlhbnMobG9uZ2l0dWRlLCBsYXRpdHVkZSwgaGVpZ2h0KTtcbiAgfVxuXG4gIGRlZ3JlZXNUb1VUTShsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgTGF0TG9uRWxsaXBzb2lkYWwobGF0aXR1ZGUsIGxvbmdpdHVkZSkudG9VdG0oKTtcbiAgfVxuXG4gIFVUTVRvRGVncmVlcyh6b25lOiBudW1iZXIsIGhlbWlzcGhlcmVUeXBlOiBoZW1pc3BoZXJlLCBlYXN0aW5nOiBudW1iZXIsIG5vcnRoaW5nOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5nZW9kZXN5VG9DZXNpdW1PYmplY3QobmV3IFV0bSh6b25lLCBoZW1pc3BoZXJlVHlwZSwgZWFzdGluZywgbm9ydGhpbmcpLnRvTGF0TG9uRSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VvZGVzeVRvQ2VzaXVtT2JqZWN0KGdlb2Rlc3lSYWRpYW5zOiBMYXRMb24pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbG9uZ2l0dWRlOiBnZW9kZXN5UmFkaWFucy5sb24sXG4gICAgICBsYXRpdHVkZTogZ2VvZGVzeVJhZGlhbnMubGF0LFxuICAgICAgaGVpZ2h0OiBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gPyBnZW9kZXN5UmFkaWFuc1snaGVpZ2h0J10gOiAwXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtaWRkbGUgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXG4gICAqIEBwYXJhbSBmaXJzdCAgKGxhdGl0dWRlLGxvbmdpdHVkZSkgaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0gc2Vjb25kIChsYXRpdHVkZSxsb25naXR1ZGUpIGluIHJhZGlhbnNcbiAgICovXG4gIG1pZFBvaW50VG9DYXJ0ZXNpYW4zKGZpcnN0OiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0sIHNlY29uZDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9KSB7XG4gICAgY29uc3QgdG9EZWcgPSAocmFkOiBudW1iZXIpID0+IENlc2l1bS5NYXRoLnRvRGVncmVlcyhyYWQpO1xuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhmaXJzdC5sYXRpdHVkZSksIHRvRGVnKGZpcnN0LmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IHNlY29uZFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoc2Vjb25kLmxhdGl0dWRlKSwgdG9EZWcoc2Vjb25kLmxvbmdpdHVkZSkpO1xuICAgIGNvbnN0IG1pZGRsZVBvaW50OiBhbnkgPSBmaXJzdFBvaW50Lm1pZHBvaW50VG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21EZWdyZWVzKG1pZGRsZVBvaW50LmxvbiwgbWlkZGxlUG9pbnQubGF0KTtcbiAgfVxuXG4gIG1pZGRsZVBvaW50QnlTY3JlZW4ocG9zaXRpb24wOiBDYXJ0ZXNpYW4zLCBwb3NpdGlvbjE6IENhcnRlc2lhbjMpOiBDYXJ0ZXNpYW4zIHtcbiAgICBjb25zdCBzY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMSA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjApO1xuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHNjZW5lLCBwb3NpdGlvbjEpO1xuICAgIGNvbnN0IG1pZGRsZVNjcmVlblBvaW50ID1cbiAgICAgIG5ldyBDZXNpdW0uQ2FydGVzaWFuMigoc2NyZWVuUG9zaXRpb24yLnggKyBzY3JlZW5Qb3NpdGlvbjEueCkgLyAyLjAsIChzY3JlZW5Qb3NpdGlvbjIueSArIHNjcmVlblBvc2l0aW9uMS55KSAvIDIuMCk7XG4gICAgcmV0dXJuIHNjZW5lLnBpY2tQb3NpdGlvbihtaWRkbGVTY3JlZW5Qb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiAqIEByZXR1cm4gYmVhcmluZyBpbiBkZWdyZWVzXG4gICAqIEBwYXJhbSBmaXJzdCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHNlY29uZCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcbiAgICovXG4gIGJlYXJpbmdUbyhmaXJzdDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9LCBzZWNvbmQ6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSkge1xuICAgIGNvbnN0IHRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiBDZXNpdW0uTWF0aC50b0RlZ3JlZXMocmFkKTtcbiAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IExhdExvblZlY3RvcnModG9EZWcoZmlyc3QubGF0aXR1ZGUpLCB0b0RlZyhmaXJzdC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBzZWNvbmRQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKHNlY29uZC5sYXRpdHVkZSksIHRvRGVnKHNlY29uZC5sb25naXR1ZGUpKTtcbiAgICBjb25zdCBiZWFyaW5nID0gZmlyc3RQb2ludC5iZWFyaW5nVG8oc2Vjb25kUG9pbnQpO1xuXG4gICAgcmV0dXJuIGJlYXJpbmc7XG4gIH1cblxuICAvKipcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xuICAgKlxuICAgKiBAcmV0dXJuIGJlYXJpbmcgaW4gZGVncmVlc1xuICAgKi9cbiAgYmVhcmluZ1RvQ2FydGVzaWFuKGZpcnN0Q2FydGVzaWFuMzogQ2FydGVzaWFuMywgc2Vjb25kQ2FydGVzaWFuMzogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IGZpcnN0Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihmaXJzdENhcnRlc2lhbjMpO1xuICAgIGNvbnN0IHNlY29uZENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oc2Vjb25kQ2FydGVzaWFuMyk7XG5cbiAgICByZXR1cm4gdGhpcy5iZWFyaW5nVG8oZmlyc3RDYXJ0LCBzZWNvbmRDYXJ0KTtcbiAgfVxufVxuIl19