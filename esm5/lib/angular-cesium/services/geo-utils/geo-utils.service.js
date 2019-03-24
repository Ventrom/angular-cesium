/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
var GeoUtilsService = /** @class */ (function () {
    function GeoUtilsService(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    GeoUtilsService.pointByLocationDistanceAndAzimuth = /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    function (currentLocation, meterDistance, radianAzimuth, deprecated) {
        /** @type {?} */
        var distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
        /** @type {?} */
        var cartographicLocation = currentLocation instanceof Cesium.Cartesian3 ? Cesium.Cartographic.fromCartesian(currentLocation) : currentLocation;
        /** @type {?} */
        var cartesianLocation = currentLocation instanceof Cesium.Cartesian3
            ? currentLocation
            : Cesium.Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        /** @type {?} */
        var resultPosition;
        /** @type {?} */
        var resultDistance;
        /** @type {?} */
        var counter = 0;
        /** @type {?} */
        var distanceFactorRangeMax = 0.1;
        /** @type {?} */
        var distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            /** @type {?} */
            var factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            resultPosition = GeoUtilsService._pointByLocationDistanceAndAzimuth(cartographicLocation, distance * (1 + factor), radianAzimuth);
            resultDistance = this.distance(cartesianLocation, resultPosition);
            if (resultDistance > meterDistance) {
                distanceFactorRangeMax = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            else {
                distanceFactorRangeMin = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            counter++;
        }
        return resultPosition;
    };
    /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    GeoUtilsService._pointByLocationDistanceAndAzimuth = /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    function (cartographicLocation, distance, radianAzimuth) {
        /** @type {?} */
        var curLat = cartographicLocation.latitude;
        /** @type {?} */
        var curLon = cartographicLocation.longitude;
        /** @type {?} */
        var destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        /** @type {?} */
        var destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
    };
    /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    GeoUtilsService.distance = /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    function (pos0, pos1) {
        return Cesium.Cartesian3.distance(pos0, pos1);
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    GeoUtilsService.getPositionsDelta = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    };
    /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    GeoUtilsService.addDeltaToPosition = /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    function (position, delta, updateReference) {
        if (updateReference === void 0) { updateReference = false; }
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            /** @type {?} */
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = 0;
            /** @type {?} */
            var cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            /** @type {?} */
            var cartesian = new Cesium.Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            /** @type {?} */
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    };
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    GeoUtilsService.middleCartesian3Point = /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    function (position0, position1) {
        return new Cesium.Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    };
    /**
     * @param {?} screenPos
     * @return {?}
     */
    GeoUtilsService.prototype.screenPositionToCartesian3 = /**
     * @param {?} screenPos
     * @return {?}
     */
    function (screenPos) {
        /** @type {?} */
        var camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    };
    GeoUtilsService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GeoUtilsService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    return GeoUtilsService;
}());
export { GeoUtilsService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    GeoUtilsService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvLXV0aWxzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBSXpEO0lBMEZFLHlCQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNoRCxDQUFDOzs7Ozs7OztJQXpGTSxpREFBaUM7Ozs7Ozs7SUFBeEMsVUFBeUMsZUFBb0IsRUFBRSxhQUFxQixFQUFFLGFBQXFCLEVBQUUsVUFBVzs7WUFDaEgsUUFBUSxHQUFHLGFBQWEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFhOztZQUMvRCxvQkFBb0IsR0FDeEIsZUFBZSxZQUFZLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlOztZQUMvRyxpQkFBaUIsR0FDckIsZUFBZSxZQUFZLE1BQU0sQ0FBQyxVQUFVO1lBQzFDLENBQUMsQ0FBQyxlQUFlO1lBQ2pCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQzs7WUFFNUcsY0FBYzs7WUFDZCxjQUFjOztZQUNkLE9BQU8sR0FBRyxDQUFDOztZQUNYLHNCQUFzQixHQUFHLEdBQUc7O1lBQzVCLHNCQUFzQixHQUFHLENBQUMsR0FBRztRQUNqQyxPQUNFLE9BQU8sS0FBSyxDQUFDO1lBQ2IsQ0FBQyxPQUFPLEdBQUcsRUFB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QUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFHO0lBQ0gsQ0FBQzs7Ozs7O0lBRU0scUNBQXFCOzs7OztJQUE1QixVQUE2QixTQUFxQixFQUFFLFNBQXFCO1FBQ3ZFLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUgsQ0FBQzs7Ozs7SUFLRCxvREFBMEI7Ozs7SUFBMUIsVUFBMkIsU0FBbUM7O1lBQ3RELE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU07UUFDcEQsT0FBTyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7O2dCQWhHRixVQUFVOzs7O2dCQUpGLGFBQWE7O0lBcUd0QixzQkFBQztDQUFBLEFBakdELElBaUdDO1NBaEdZLGVBQWU7Ozs7OztJQXlGZCx3Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3ZlYzMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR2VvVXRpbHNTZXJ2aWNlIHtcbiAgc3RhdGljIHBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aChjdXJyZW50TG9jYXRpb246IGFueSwgbWV0ZXJEaXN0YW5jZTogbnVtYmVyLCByYWRpYW5BemltdXRoOiBudW1iZXIsIGRlcHJlY2F0ZWQ/KSB7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBtZXRlckRpc3RhbmNlIC8gQ2VzaXVtLkVsbGlwc29pZC5XR1M4NC5tYXhpbXVtUmFkaXVzO1xuICAgIGNvbnN0IGNhcnRvZ3JhcGhpY0xvY2F0aW9uID1cbiAgICAgIGN1cnJlbnRMb2NhdGlvbiBpbnN0YW5jZW9mIENlc2l1bS5DYXJ0ZXNpYW4zID8gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGN1cnJlbnRMb2NhdGlvbikgOiBjdXJyZW50TG9jYXRpb247XG4gICAgY29uc3QgY2FydGVzaWFuTG9jYXRpb24gPVxuICAgICAgY3VycmVudExvY2F0aW9uIGluc3RhbmNlb2YgQ2VzaXVtLkNhcnRlc2lhbjNcbiAgICAgICAgPyBjdXJyZW50TG9jYXRpb25cbiAgICAgICAgOiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhjdXJyZW50TG9jYXRpb24ubG9uZ2l0dWRlLCBjdXJyZW50TG9jYXRpb24ubGF0aXR1ZGUsIGN1cnJlbnRMb2NhdGlvbi5oZWlnaHQpO1xuXG4gICAgbGV0IHJlc3VsdFBvc2l0aW9uO1xuICAgIGxldCByZXN1bHREaXN0YW5jZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgbGV0IGRpc3RhbmNlRmFjdG9yUmFuZ2VNYXggPSAwLjE7XG4gICAgbGV0IGRpc3RhbmNlRmFjdG9yUmFuZ2VNaW4gPSAtMC4xO1xuICAgIHdoaWxlIChcbiAgICAgIGNvdW50ZXIgPT09IDAgfHxcbiAgICAgIChjb3VudGVyIDwgMTYgJiYgTWF0aC5tYXgocmVzdWx0RGlzdGFuY2UsIG1ldGVyRGlzdGFuY2UpIC8gTWF0aC5taW4ocmVzdWx0RGlzdGFuY2UsIG1ldGVyRGlzdGFuY2UpID4gMS4wMDAwMDEpXG4gICAgICApIHtcbiAgICAgIGNvbnN0IGZhY3RvciA9IGRpc3RhbmNlRmFjdG9yUmFuZ2VNaW4gKyAoZGlzdGFuY2VGYWN0b3JSYW5nZU1heCAtIGRpc3RhbmNlRmFjdG9yUmFuZ2VNaW4pIC8gMjtcbiAgICAgIHJlc3VsdFBvc2l0aW9uID0gR2VvVXRpbHNTZXJ2aWNlLl9wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2FydG9ncmFwaGljTG9jYXRpb24sIGRpc3RhbmNlICogKDEgKyBmYWN0b3IpLCByYWRpYW5BemltdXRoKTtcbiAgICAgIHJlc3VsdERpc3RhbmNlID0gdGhpcy5kaXN0YW5jZShjYXJ0ZXNpYW5Mb2NhdGlvbiwgcmVzdWx0UG9zaXRpb24pO1xuXG4gICAgICBpZiAocmVzdWx0RGlzdGFuY2UgPiBtZXRlckRpc3RhbmNlKSB7XG4gICAgICAgIGRpc3RhbmNlRmFjdG9yUmFuZ2VNYXggPSBkaXN0YW5jZUZhY3RvclJhbmdlTWluICsgKGRpc3RhbmNlRmFjdG9yUmFuZ2VNYXggLSBkaXN0YW5jZUZhY3RvclJhbmdlTWluKSAvIDI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXN0YW5jZUZhY3RvclJhbmdlTWluID0gZGlzdGFuY2VGYWN0b3JSYW5nZU1pbiArIChkaXN0YW5jZUZhY3RvclJhbmdlTWF4IC0gZGlzdGFuY2VGYWN0b3JSYW5nZU1pbikgLyAyO1xuICAgICAgfVxuICAgICAgY291bnRlcisrO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRQb3NpdGlvbjtcbiAgfVxuXG4gIHN0YXRpYyBfcG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNhcnRvZ3JhcGhpY0xvY2F0aW9uOiBhbnksIGRpc3RhbmNlOiBudW1iZXIsIHJhZGlhbkF6aW11dGg6IG51bWJlcikge1xuICAgIGNvbnN0IGN1ckxhdCA9IGNhcnRvZ3JhcGhpY0xvY2F0aW9uLmxhdGl0dWRlO1xuICAgIGNvbnN0IGN1ckxvbiA9IGNhcnRvZ3JhcGhpY0xvY2F0aW9uLmxvbmdpdHVkZTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbkxhdCA9IE1hdGguYXNpbihcbiAgICAgIE1hdGguc2luKGN1ckxhdCkgKiBNYXRoLmNvcyhkaXN0YW5jZSkgKyBNYXRoLmNvcyhjdXJMYXQpICogTWF0aC5zaW4oZGlzdGFuY2UpICogTWF0aC5jb3MocmFkaWFuQXppbXV0aCksXG4gICAgKTtcblxuICAgIGxldCBkZXN0aW5hdGlvbkxvbiA9XG4gICAgICBjdXJMb24gK1xuICAgICAgTWF0aC5hdGFuMihcbiAgICAgICAgTWF0aC5zaW4ocmFkaWFuQXppbXV0aCkgKiBNYXRoLnNpbihkaXN0YW5jZSkgKiBNYXRoLmNvcyhjdXJMYXQpLFxuICAgICAgICBNYXRoLmNvcyhkaXN0YW5jZSkgLSBNYXRoLnNpbihjdXJMYXQpICogTWF0aC5zaW4oZGVzdGluYXRpb25MYXQpLFxuICAgICAgKTtcblxuICAgIGRlc3RpbmF0aW9uTG9uID0gKChkZXN0aW5hdGlvbkxvbiArIDMgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSkpIC0gTWF0aC5QSTtcblxuICAgIHJldHVybiBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhkZXN0aW5hdGlvbkxvbiwgZGVzdGluYXRpb25MYXQpO1xuICB9XG5cbiAgc3RhdGljIGRpc3RhbmNlKHBvczA6IENhcnRlc2lhbjMsIHBvczE6IENhcnRlc2lhbjMpOiBudW1iZXIge1xuICAgIHJldHVybiBDZXNpdW0uQ2FydGVzaWFuMy5kaXN0YW5jZShwb3MwLCBwb3MxKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRQb3NpdGlvbnNEZWx0YShwb3NpdGlvbjA6IENhcnRlc2lhbjMsIHBvc2l0aW9uMTogQ2FydGVzaWFuMyk6IFZlYzMge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBwb3NpdGlvbjEueCAtIHBvc2l0aW9uMC54LFxuICAgICAgeTogcG9zaXRpb24xLnkgLSBwb3NpdGlvbjAueSxcbiAgICAgIHo6IHBvc2l0aW9uMS56IC0gcG9zaXRpb24wLnosXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBhZGREZWx0YVRvUG9zaXRpb24ocG9zaXRpb246IENhcnRlc2lhbjMsIGRlbHRhOiBWZWMzLCB1cGRhdGVSZWZlcmVuY2UgPSBmYWxzZSk6IENhcnRlc2lhbjMge1xuICAgIGlmICh1cGRhdGVSZWZlcmVuY2UpIHtcbiAgICAgIHBvc2l0aW9uLnggKz0gZGVsdGEueDtcbiAgICAgIHBvc2l0aW9uLnkgKz0gZGVsdGEueTtcbiAgICAgIHBvc2l0aW9uLnogKz0gZGVsdGEuejtcbiAgICAgIGNvbnN0IGNhcnRvZ3JhcGhpYyA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihwb3NpdGlvbik7XG4gICAgICBjYXJ0b2dyYXBoaWMuaGVpZ2h0ID0gMDtcbiAgICAgIGNvbnN0IGNhcnRlc2lhbiA9IENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKGNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYy5sYXRpdHVkZSwgY2FydG9ncmFwaGljLmhlaWdodCk7XG4gICAgICBwb3NpdGlvbi54ID0gY2FydGVzaWFuLng7XG4gICAgICBwb3NpdGlvbi55ID0gY2FydGVzaWFuLnk7XG4gICAgICBwb3NpdGlvbi56ID0gY2FydGVzaWFuLno7XG4gICAgICByZXR1cm4gcG9zaXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNhcnRlc2lhbiA9IG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhwb3NpdGlvbi54ICsgZGVsdGEueCwgcG9zaXRpb24ueSArIGRlbHRhLnksIHBvc2l0aW9uLnogKyBkZWx0YS56KTtcbiAgICAgIGNvbnN0IGNhcnRvZ3JhcGhpYyA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjYXJ0ZXNpYW4pO1xuICAgICAgY2FydG9ncmFwaGljLmhlaWdodCA9IDA7XG4gICAgICByZXR1cm4gQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoY2FydG9ncmFwaGljLmxvbmdpdHVkZSwgY2FydG9ncmFwaGljLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMuaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbWlkZGxlQ2FydGVzaWFuM1BvaW50KHBvc2l0aW9uMDogQ2FydGVzaWFuMywgcG9zaXRpb24xOiBDYXJ0ZXNpYW4zKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FydGVzaWFuMyhwb3NpdGlvbjEueCAtIHBvc2l0aW9uMC54IC8gMiwgcG9zaXRpb24xLnkgLSBwb3NpdGlvbjAueSAvIDIsIHBvc2l0aW9uMS56IC0gcG9zaXRpb24wLnogLyAyKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgc2NyZWVuUG9zaXRpb25Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pIHtcbiAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuY2FtZXJhO1xuICAgIHJldHVybiBjYW1lcmEucGlja0VsbGlwc29pZChzY3JlZW5Qb3MpO1xuICB9XG59XG4iXX0=