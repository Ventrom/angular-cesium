/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import { GeoUtilsService } from '../../geo-utils/geo-utils.service';
/**
 * +  This drawer is responsible for drawing an arc over the Cesium map.
 * +  This implementation uses simple PolylineGeometry and Primitive parameters.
 * +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
export class ArcDrawerService extends PrimitivesDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateArcPositions(cesiumProps) {
        /** @type {?} */
        const quality = cesiumProps.quality || 18;
        /** @type {?} */
        const delta = (cesiumProps.delta) / quality;
        /** @type {?} */
        const pointsArray = [];
        for (let i = 0; i < quality + 1; ++i) {
            /** @type {?} */
            const point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateTriangle(cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    _calculateArc(cesiumProps) {
        /** @type {?} */
        const arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            /** @type {?} */
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    }
    /**
     * @param {?} primitive
     * @param {?} cesiumProps
     * @return {?}
     */
    update(primitive, cesiumProps) {
        if (!cesiumProps.constantColor && cesiumProps.color &&
            !primitive.material.uniforms.color.equals(cesiumProps.color)) {
            primitive.material.uniforms.color = cesiumProps.color;
        }
        primitive.width = cesiumProps.width !== undefined ? cesiumProps.width : primitive.width;
        primitive.show = cesiumProps.show !== undefined ? cesiumProps.show : primitive.show;
        primitive.distanceDisplayCondition = cesiumProps.distanceDisplayCondition !== undefined ?
            cesiumProps.distanceDisplayCondition : primitive.distanceDisplayCondition;
        primitive.positions = this._calculateArc(cesiumProps);
        return primitive;
    }
}
ArcDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ArcDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDekYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOzs7Ozs7QUFTcEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHVCQUF1Qjs7OztJQUMzRCxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7Ozs7SUFFRCxzQkFBc0IsQ0FBQyxXQUFnQjs7Y0FDL0IsT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLElBQUksRUFBRTs7Y0FDbkMsS0FBSyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU87O2NBQ3JDLFdBQVcsR0FBRyxFQUFFO1FBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFOztrQkFDOUIsS0FBSyxHQUNULGVBQWUsQ0FBQyxpQ0FBaUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQztZQUNoSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxXQUFnQjtRQUNqQyxPQUFPO1lBQ0wsV0FBVyxDQUFDLE1BQU07WUFDbEIsZUFBZSxDQUFDLGlDQUFpQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztTQUNuSCxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFRCxhQUFhLENBQUMsV0FBZ0I7O2NBQ3RCLFNBQVMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDO1FBQzFELE9BQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BHLENBQUM7Ozs7O0lBRUQsR0FBRyxDQUFDLFdBQWdCO1FBQ2xCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4RCxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7O2tCQUNmLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUM1QyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUNqQztRQUVELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7Ozs7SUFFRCxNQUFNLENBQUMsU0FBYyxFQUFFLFdBQWdCO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxJQUFJLFdBQVcsQ0FBQyxLQUFLO1lBQ2pELENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDdkQ7UUFDRCxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3hGLFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEYsU0FBUyxDQUFDLHdCQUF3QixHQUFHLFdBQVcsQ0FBQyx3QkFBd0IsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUN2RixXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztRQUM1RSxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7O1lBdERGLFVBQVU7Ozs7WUFWRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcblxuLyoqXG4gKyAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYW4gYXJjIG92ZXIgdGhlIENlc2l1bSBtYXAuXG4gKyAgVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHNpbXBsZSBQb2x5bGluZUdlb21ldHJ5IGFuZCBQcmltaXRpdmUgcGFyYW1ldGVycy5cbiArICBUaGlzIGRvZXNuJ3QgYWxsb3cgdXMgdG8gY2hhbmdlIHRoZSBwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIG9mIHRoZSBhcmMgYnV0IHNldFNob3cgb25seS5cbiAqL1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXJjRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKENlc2l1bS5Qb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgX2NhbGN1bGF0ZUFyY1Bvc2l0aW9ucyhjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgY29uc3QgcXVhbGl0eSA9IGNlc2l1bVByb3BzLnF1YWxpdHkgfHwgMTg7XG4gICAgY29uc3QgZGVsdGEgPSAoY2VzaXVtUHJvcHMuZGVsdGEpIC8gcXVhbGl0eTtcbiAgICBjb25zdCBwb2ludHNBcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVhbGl0eSArIDE7ICsraSkge1xuICAgICAgY29uc3QgcG9pbnQgPVxuICAgICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlc2l1bVByb3BzLmNlbnRlciwgY2VzaXVtUHJvcHMucmFkaXVzLCBjZXNpdW1Qcm9wcy5hbmdsZSArIGRlbHRhICogaSwgdHJ1ZSk7XG4gICAgICBwb2ludHNBcnJheS5wdXNoKHBvaW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRzQXJyYXk7XG4gIH1cblxuICBfY2FsY3VsYXRlVHJpYW5nbGUoY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHJldHVybiBbXG4gICAgICBjZXNpdW1Qcm9wcy5jZW50ZXIsXG4gICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlc2l1bVByb3BzLmNlbnRlciwgY2VzaXVtUHJvcHMucmFkaXVzLCBjZXNpdW1Qcm9wcy5hbmdsZSwgdHJ1ZSlcbiAgICBdO1xuICB9XG5cbiAgX2NhbGN1bGF0ZUFyYyhjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgY29uc3QgYXJjUG9pbnRzID0gdGhpcy5fY2FsY3VsYXRlQXJjUG9zaXRpb25zKGNlc2l1bVByb3BzKTtcbiAgICByZXR1cm4gY2VzaXVtUHJvcHMuZHJhd0VkZ2VzID8gYXJjUG9pbnRzLmNvbmNhdCh0aGlzLl9jYWxjdWxhdGVUcmlhbmdsZShjZXNpdW1Qcm9wcykpIDogYXJjUG9pbnRzO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xuICAgIGNlc2l1bVByb3BzLnBvc2l0aW9ucyA9IHRoaXMuX2NhbGN1bGF0ZUFyYyhjZXNpdW1Qcm9wcyk7XG4gICAgaWYgKGNlc2l1bVByb3BzLmNvbG9yKSB7XG4gICAgICBjb25zdCBtYXRlcmlhbCA9IENlc2l1bS5NYXRlcmlhbC5mcm9tVHlwZSgnQ29sb3InKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMuY29sb3I7XG4gICAgICBjZXNpdW1Qcm9wcy5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLmFkZChjZXNpdW1Qcm9wcyk7XG4gIH1cblxuICB1cGRhdGUocHJpbWl0aXZlOiBhbnksIGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBpZiAoIWNlc2l1bVByb3BzLmNvbnN0YW50Q29sb3IgJiYgY2VzaXVtUHJvcHMuY29sb3IgJiZcbiAgICAgICFwcmltaXRpdmUubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IuZXF1YWxzKGNlc2l1bVByb3BzLmNvbG9yKSkge1xuICAgICAgcHJpbWl0aXZlLm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMuY29sb3I7XG4gICAgfVxuICAgIHByaW1pdGl2ZS53aWR0aCA9IGNlc2l1bVByb3BzLndpZHRoICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy53aWR0aCA6IHByaW1pdGl2ZS53aWR0aDtcbiAgICBwcmltaXRpdmUuc2hvdyA9IGNlc2l1bVByb3BzLnNob3cgIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLnNob3cgOiBwcmltaXRpdmUuc2hvdztcbiAgICBwcmltaXRpdmUuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gY2VzaXVtUHJvcHMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uICE9PSB1bmRlZmluZWQgP1xuICAgICAgY2VzaXVtUHJvcHMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uIDogcHJpbWl0aXZlLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjtcbiAgICBwcmltaXRpdmUucG9zaXRpb25zID0gdGhpcy5fY2FsY3VsYXRlQXJjKGNlc2l1bVByb3BzKTtcblxuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cbn1cbiJdfQ==