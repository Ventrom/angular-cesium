/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
export class GeoUtilsService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?} currentLocation
     * @param {?} meterDistance
     * @param {?} radianAzimuth
     * @param {?=} deprecated
     * @return {?}
     */
    static pointByLocationDistanceAndAzimuth(currentLocation, meterDistance, radianAzimuth, deprecated) {
        /** @type {?} */
        const distance = meterDistance / Cesium.Ellipsoid.WGS84.maximumRadius;
        /** @type {?} */
        const cartographicLocation = currentLocation instanceof Cesium.Cartesian3 ? Cesium.Cartographic.fromCartesian(currentLocation) : currentLocation;
        /** @type {?} */
        const cartesianLocation = currentLocation instanceof Cesium.Cartesian3
            ? currentLocation
            : Cesium.Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        /** @type {?} */
        let resultPosition;
        /** @type {?} */
        let resultDistance;
        /** @type {?} */
        let counter = 0;
        /** @type {?} */
        let distanceFactorRangeMax = 0.1;
        /** @type {?} */
        let distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            /** @type {?} */
            const factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
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
    }
    /**
     * @param {?} cartographicLocation
     * @param {?} distance
     * @param {?} radianAzimuth
     * @return {?}
     */
    static _pointByLocationDistanceAndAzimuth(cartographicLocation, distance, radianAzimuth) {
        /** @type {?} */
        const curLat = cartographicLocation.latitude;
        /** @type {?} */
        const curLon = cartographicLocation.longitude;
        /** @type {?} */
        const destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        /** @type {?} */
        let destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cesium.Cartesian3.fromRadians(destinationLon, destinationLat);
    }
    /**
     * @param {?} pos0
     * @param {?} pos1
     * @return {?}
     */
    static distance(pos0, pos1) {
        return Cesium.Cartesian3.distance(pos0, pos1);
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    static getPositionsDelta(position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    }
    /**
     * @param {?} position
     * @param {?} delta
     * @param {?=} updateReference
     * @return {?}
     */
    static addDeltaToPosition(position, delta, updateReference = false) {
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            /** @type {?} */
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            cartographic.height = 0;
            /** @type {?} */
            const cartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            /** @type {?} */
            const cartesian = new Cesium.Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            /** @type {?} */
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    }
    /**
     * @param {?} position0
     * @param {?} position1
     * @return {?}
     */
    static middleCartesian3Point(position0, position1) {
        return new Cesium.Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    }
    /**
     * @param {?} screenPos
     * @return {?}
     */
    screenPositionToCartesian3(screenPos) {
        /** @type {?} */
        const camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    }
}
GeoUtilsService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GeoUtilsService.ctorParameters = () => [
    { type: CesiumService }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    GeoUtilsService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvLXV0aWxzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBS3pELE1BQU0sT0FBTyxlQUFlOzs7O0lBeUYxQixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtJQUNoRCxDQUFDOzs7Ozs7OztJQXpGRCxNQUFNLENBQUMsaUNBQWlDLENBQUMsZUFBb0IsRUFBRSxhQUFxQixFQUFFLGFBQXFCLEVBQUUsVUFBVzs7Y0FDaEgsUUFBUSxHQUFHLGFBQWEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxhQUFhOztjQUMvRCxvQkFBb0IsR0FDeEIsZUFBZSxZQUFZLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlOztjQUMvRyxpQkFBaUIsR0FDckIsZUFBZSxZQUFZLE1BQU0sQ0FBQyxVQUFVO1lBQzFDLENBQUMsQ0FBQyxlQUFlO1lBQ2pCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLE1BQU0sQ0FBQzs7WUFFNUcsY0FBYzs7WUFDZCxjQUFjOztZQUNkLE9BQU8sR0FBRyxDQUFDOztZQUNYLHNCQUFzQixHQUFHLEdBQUc7O1lBQzVCLHNCQUFzQixHQUFHLENBQUMsR0FBRztRQUNqQyxPQUNFLE9BQU8sS0FBSyxDQUFDO1lBQ2IsQ0FB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UyxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFHO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFNBQXFCLEVBQUUsU0FBcUI7UUFDdkUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1SCxDQUFDOzs7OztJQUtELDBCQUEwQixDQUFDLFNBQW1DOztjQUN0RCxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNO1FBQ3BELE9BQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7WUFoR0YsVUFBVTs7OztZQUpGLGFBQWE7Ozs7Ozs7SUE4RlIsd0NBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uL21vZGVscy92ZWMzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdlb1V0aWxzU2VydmljZSB7XG4gIHN0YXRpYyBwb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY3VycmVudExvY2F0aW9uOiBhbnksIG1ldGVyRGlzdGFuY2U6IG51bWJlciwgcmFkaWFuQXppbXV0aDogbnVtYmVyLCBkZXByZWNhdGVkPykge1xuICAgIGNvbnN0IGRpc3RhbmNlID0gbWV0ZXJEaXN0YW5jZSAvIENlc2l1bS5FbGxpcHNvaWQuV0dTODQubWF4aW11bVJhZGl1cztcbiAgICBjb25zdCBjYXJ0b2dyYXBoaWNMb2NhdGlvbiA9XG4gICAgICBjdXJyZW50TG9jYXRpb24gaW5zdGFuY2VvZiBDZXNpdW0uQ2FydGVzaWFuMyA/IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihjdXJyZW50TG9jYXRpb24pIDogY3VycmVudExvY2F0aW9uO1xuICAgIGNvbnN0IGNhcnRlc2lhbkxvY2F0aW9uID1cbiAgICAgIGN1cnJlbnRMb2NhdGlvbiBpbnN0YW5jZW9mIENlc2l1bS5DYXJ0ZXNpYW4zXG4gICAgICAgID8gY3VycmVudExvY2F0aW9uXG4gICAgICAgIDogQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoY3VycmVudExvY2F0aW9uLmxvbmdpdHVkZSwgY3VycmVudExvY2F0aW9uLmxhdGl0dWRlLCBjdXJyZW50TG9jYXRpb24uaGVpZ2h0KTtcblxuICAgIGxldCByZXN1bHRQb3NpdGlvbjtcbiAgICBsZXQgcmVzdWx0RGlzdGFuY2U7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGxldCBkaXN0YW5jZUZhY3RvclJhbmdlTWF4ID0gMC4xO1xuICAgIGxldCBkaXN0YW5jZUZhY3RvclJhbmdlTWluID0gLTAuMTtcbiAgICB3aGlsZSAoXG4gICAgICBjb3VudGVyID09PSAwIHx8XG4gICAgICAoY291bnRlciA8IDE2ICYmIE1hdGgubWF4KHJlc3VsdERpc3RhbmNlLCBtZXRlckRpc3RhbmNlKSAvIE1hdGgubWluKHJlc3VsdERpc3RhbmNlLCBtZXRlckRpc3RhbmNlKSA+IDEuMDAwMDAxKVxuICAgICAgKSB7XG4gICAgICBjb25zdCBmYWN0b3IgPSBkaXN0YW5jZUZhY3RvclJhbmdlTWluICsgKGRpc3RhbmNlRmFjdG9yUmFuZ2VNYXggLSBkaXN0YW5jZUZhY3RvclJhbmdlTWluKSAvIDI7XG4gICAgICByZXN1bHRQb3NpdGlvbiA9IEdlb1V0aWxzU2VydmljZS5fcG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNhcnRvZ3JhcGhpY0xvY2F0aW9uLCBkaXN0YW5jZSAqICgxICsgZmFjdG9yKSwgcmFkaWFuQXppbXV0aCk7XG4gICAgICByZXN1bHREaXN0YW5jZSA9IHRoaXMuZGlzdGFuY2UoY2FydGVzaWFuTG9jYXRpb24sIHJlc3VsdFBvc2l0aW9uKTtcblxuICAgICAgaWYgKHJlc3VsdERpc3RhbmNlID4gbWV0ZXJEaXN0YW5jZSkge1xuICAgICAgICBkaXN0YW5jZUZhY3RvclJhbmdlTWF4ID0gZGlzdGFuY2VGYWN0b3JSYW5nZU1pbiArIChkaXN0YW5jZUZhY3RvclJhbmdlTWF4IC0gZGlzdGFuY2VGYWN0b3JSYW5nZU1pbikgLyAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzdGFuY2VGYWN0b3JSYW5nZU1pbiA9IGRpc3RhbmNlRmFjdG9yUmFuZ2VNaW4gKyAoZGlzdGFuY2VGYWN0b3JSYW5nZU1heCAtIGRpc3RhbmNlRmFjdG9yUmFuZ2VNaW4pIC8gMjtcbiAgICAgIH1cbiAgICAgIGNvdW50ZXIrKztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0UG9zaXRpb247XG4gIH1cblxuICBzdGF0aWMgX3BvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aChjYXJ0b2dyYXBoaWNMb2NhdGlvbjogYW55LCBkaXN0YW5jZTogbnVtYmVyLCByYWRpYW5BemltdXRoOiBudW1iZXIpIHtcbiAgICBjb25zdCBjdXJMYXQgPSBjYXJ0b2dyYXBoaWNMb2NhdGlvbi5sYXRpdHVkZTtcbiAgICBjb25zdCBjdXJMb24gPSBjYXJ0b2dyYXBoaWNMb2NhdGlvbi5sb25naXR1ZGU7XG4gICAgY29uc3QgZGVzdGluYXRpb25MYXQgPSBNYXRoLmFzaW4oXG4gICAgICBNYXRoLnNpbihjdXJMYXQpICogTWF0aC5jb3MoZGlzdGFuY2UpICsgTWF0aC5jb3MoY3VyTGF0KSAqIE1hdGguc2luKGRpc3RhbmNlKSAqIE1hdGguY29zKHJhZGlhbkF6aW11dGgpLFxuICAgICk7XG5cbiAgICBsZXQgZGVzdGluYXRpb25Mb24gPVxuICAgICAgY3VyTG9uICtcbiAgICAgIE1hdGguYXRhbjIoXG4gICAgICAgIE1hdGguc2luKHJhZGlhbkF6aW11dGgpICogTWF0aC5zaW4oZGlzdGFuY2UpICogTWF0aC5jb3MoY3VyTGF0KSxcbiAgICAgICAgTWF0aC5jb3MoZGlzdGFuY2UpIC0gTWF0aC5zaW4oY3VyTGF0KSAqIE1hdGguc2luKGRlc3RpbmF0aW9uTGF0KSxcbiAgICAgICk7XG5cbiAgICBkZXN0aW5hdGlvbkxvbiA9ICgoZGVzdGluYXRpb25Mb24gKyAzICogTWF0aC5QSSkgJSAoMiAqIE1hdGguUEkpKSAtIE1hdGguUEk7XG5cbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRlc2lhbjMuZnJvbVJhZGlhbnMoZGVzdGluYXRpb25Mb24sIGRlc3RpbmF0aW9uTGF0KTtcbiAgfVxuXG4gIHN0YXRpYyBkaXN0YW5jZShwb3MwOiBDYXJ0ZXNpYW4zLCBwb3MxOiBDYXJ0ZXNpYW4zKTogbnVtYmVyIHtcbiAgICByZXR1cm4gQ2VzaXVtLkNhcnRlc2lhbjMuZGlzdGFuY2UocG9zMCwgcG9zMSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0UG9zaXRpb25zRGVsdGEocG9zaXRpb24wOiBDYXJ0ZXNpYW4zLCBwb3NpdGlvbjE6IENhcnRlc2lhbjMpOiBWZWMzIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcG9zaXRpb24xLnggLSBwb3NpdGlvbjAueCxcbiAgICAgIHk6IHBvc2l0aW9uMS55IC0gcG9zaXRpb24wLnksXG4gICAgICB6OiBwb3NpdGlvbjEueiAtIHBvc2l0aW9uMC56LFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgYWRkRGVsdGFUb1Bvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBkZWx0YTogVmVjMywgdXBkYXRlUmVmZXJlbmNlID0gZmFsc2UpOiBDYXJ0ZXNpYW4zIHtcbiAgICBpZiAodXBkYXRlUmVmZXJlbmNlKSB7XG4gICAgICBwb3NpdGlvbi54ICs9IGRlbHRhLng7XG4gICAgICBwb3NpdGlvbi55ICs9IGRlbHRhLnk7XG4gICAgICBwb3NpdGlvbi56ICs9IGRlbHRhLno7XG4gICAgICBjb25zdCBjYXJ0b2dyYXBoaWMgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4ocG9zaXRpb24pO1xuICAgICAgY2FydG9ncmFwaGljLmhlaWdodCA9IDA7XG4gICAgICBjb25zdCBjYXJ0ZXNpYW4gPSBDZXNpdW0uQ2FydGVzaWFuMy5mcm9tUmFkaWFucyhjYXJ0b2dyYXBoaWMubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMubGF0aXR1ZGUsIGNhcnRvZ3JhcGhpYy5oZWlnaHQpO1xuICAgICAgcG9zaXRpb24ueCA9IGNhcnRlc2lhbi54O1xuICAgICAgcG9zaXRpb24ueSA9IGNhcnRlc2lhbi55O1xuICAgICAgcG9zaXRpb24ueiA9IGNhcnRlc2lhbi56O1xuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjYXJ0ZXNpYW4gPSBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMocG9zaXRpb24ueCArIGRlbHRhLngsIHBvc2l0aW9uLnkgKyBkZWx0YS55LCBwb3NpdGlvbi56ICsgZGVsdGEueik7XG4gICAgICBjb25zdCBjYXJ0b2dyYXBoaWMgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oY2FydGVzaWFuKTtcbiAgICAgIGNhcnRvZ3JhcGhpYy5oZWlnaHQgPSAwO1xuICAgICAgcmV0dXJuIENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKGNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYy5sYXRpdHVkZSwgY2FydG9ncmFwaGljLmhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG1pZGRsZUNhcnRlc2lhbjNQb2ludChwb3NpdGlvbjA6IENhcnRlc2lhbjMsIHBvc2l0aW9uMTogQ2FydGVzaWFuMykge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMocG9zaXRpb24xLnggLSBwb3NpdGlvbjAueCAvIDIsIHBvc2l0aW9uMS55IC0gcG9zaXRpb24wLnkgLyAyLCBwb3NpdGlvbjEueiAtIHBvc2l0aW9uMC56IC8gMik7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIHNjcmVlblBvc2l0aW9uVG9DYXJ0ZXNpYW4zKHNjcmVlblBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KSB7XG4gICAgY29uc3QgY2FtZXJhID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNhbWVyYTtcbiAgICByZXR1cm4gY2FtZXJhLnBpY2tFbGxpcHNvaWQoc2NyZWVuUG9zKTtcbiAgfVxufVxuIl19