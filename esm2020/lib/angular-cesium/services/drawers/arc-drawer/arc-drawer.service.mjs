import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import { GeoUtilsService } from '../../geo-utils/geo-utils.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
export class ArcDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }
    _calculateArcPositions(cesiumProps) {
        const quality = cesiumProps.quality || 18;
        const delta = (cesiumProps.delta) / quality;
        const pointsArray = [];
        for (let i = 0; i < quality + 1; ++i) {
            const point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    }
    _calculateTriangle(cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    }
    _calculateArc(cesiumProps) {
        const arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    }
    add(cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            const material = Cesium.Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    }
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
ArcDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ArcDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ArcDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ArcDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ArcDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDekYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOzs7QUFFcEU7Ozs7R0FJRztBQUdILE1BQU0sT0FBTyxnQkFBaUIsU0FBUSx1QkFBdUI7SUFDM0QsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxXQUFnQjtRQUNyQyxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxNQUFNLEtBQUssR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDNUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sS0FBSyxHQUNULGVBQWUsQ0FBQyxpQ0FBaUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pJLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsa0JBQWtCLENBQUMsV0FBZ0I7UUFDakMsT0FBTztZQUNMLFdBQVcsQ0FBQyxNQUFNO1lBQ2xCLGVBQWUsQ0FBQyxpQ0FBaUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7U0FDbkgsQ0FBQztJQUNKLENBQUM7SUFFRCxhQUFhLENBQUMsV0FBZ0I7UUFDNUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNELE9BQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BHLENBQUM7SUFFRCxHQUFHLENBQUMsV0FBZ0I7UUFDbEIsV0FBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNyQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzVDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsU0FBYyxFQUFFLFdBQWdCO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxJQUFJLFdBQVcsQ0FBQyxLQUFLO1lBQ2pELENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDdkQ7UUFDRCxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3hGLFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEYsU0FBUyxDQUFDLHdCQUF3QixHQUFHLFdBQVcsQ0FBQyx3QkFBd0IsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUN2RixXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztRQUM1RSxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7OEdBckRVLGdCQUFnQjtrSEFBaEIsZ0JBQWdCOzRGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuXG4vKipcbiArICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBhbiBhcmMgb3ZlciB0aGUgQ2VzaXVtIG1hcC5cbiArICBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgc2ltcGxlIFBvbHlsaW5lR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxuICsgIFRoaXMgZG9lc24ndCBhbGxvdyB1cyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gb2YgdGhlIGFyYyBidXQgc2V0U2hvdyBvbmx5LlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBcmNEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lQ29sbGVjdGlvbiwgY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICBfY2FsY3VsYXRlQXJjUG9zaXRpb25zKGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBjb25zdCBxdWFsaXR5ID0gY2VzaXVtUHJvcHMucXVhbGl0eSB8fCAxODtcbiAgICBjb25zdCBkZWx0YSA9IChjZXNpdW1Qcm9wcy5kZWx0YSkgLyBxdWFsaXR5O1xuICAgIGNvbnN0IHBvaW50c0FycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWFsaXR5ICsgMTsgKytpKSB7XG4gICAgICBjb25zdCBwb2ludCA9XG4gICAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2VzaXVtUHJvcHMuY2VudGVyLCBjZXNpdW1Qcm9wcy5yYWRpdXMsIGNlc2l1bVByb3BzLmFuZ2xlICsgZGVsdGEgKiBpLCB0cnVlKTtcbiAgICAgIHBvaW50c0FycmF5LnB1c2gocG9pbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBwb2ludHNBcnJheTtcbiAgfVxuXG4gIF9jYWxjdWxhdGVUcmlhbmdsZShjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIGNlc2l1bVByb3BzLmNlbnRlcixcbiAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2VzaXVtUHJvcHMuY2VudGVyLCBjZXNpdW1Qcm9wcy5yYWRpdXMsIGNlc2l1bVByb3BzLmFuZ2xlLCB0cnVlKVxuICAgIF07XG4gIH1cblxuICBfY2FsY3VsYXRlQXJjKGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICBjb25zdCBhcmNQb2ludHMgPSB0aGlzLl9jYWxjdWxhdGVBcmNQb3NpdGlvbnMoY2VzaXVtUHJvcHMpO1xuICAgIHJldHVybiBjZXNpdW1Qcm9wcy5kcmF3RWRnZXMgPyBhcmNQb2ludHMuY29uY2F0KHRoaXMuX2NhbGN1bGF0ZVRyaWFuZ2xlKGNlc2l1bVByb3BzKSkgOiBhcmNQb2ludHM7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY2VzaXVtUHJvcHMucG9zaXRpb25zID0gdGhpcy5fY2FsY3VsYXRlQXJjKGNlc2l1bVByb3BzKTtcbiAgICBpZiAoY2VzaXVtUHJvcHMuY29sb3IpIHtcbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gQ2VzaXVtLk1hdGVyaWFsLmZyb21UeXBlKCdDb2xvcicpO1xuICAgICAgbWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5jb2xvcjtcbiAgICAgIGNlc2l1bVByb3BzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24uYWRkKGNlc2l1bVByb3BzKTtcbiAgfVxuXG4gIHVwZGF0ZShwcmltaXRpdmU6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIGlmICghY2VzaXVtUHJvcHMuY29uc3RhbnRDb2xvciAmJiBjZXNpdW1Qcm9wcy5jb2xvciAmJlxuICAgICAgIXByaW1pdGl2ZS5tYXRlcmlhbC51bmlmb3Jtcy5jb2xvci5lcXVhbHMoY2VzaXVtUHJvcHMuY29sb3IpKSB7XG4gICAgICBwcmltaXRpdmUubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5jb2xvcjtcbiAgICB9XG4gICAgcHJpbWl0aXZlLndpZHRoID0gY2VzaXVtUHJvcHMud2lkdGggIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLndpZHRoIDogcHJpbWl0aXZlLndpZHRoO1xuICAgIHByaW1pdGl2ZS5zaG93ID0gY2VzaXVtUHJvcHMuc2hvdyAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMuc2hvdyA6IHByaW1pdGl2ZS5zaG93O1xuICAgIHByaW1pdGl2ZS5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBjZXNpdW1Qcm9wcy5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24gIT09IHVuZGVmaW5lZCA/XG4gICAgICBjZXNpdW1Qcm9wcy5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24gOiBwcmltaXRpdmUuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uO1xuICAgIHByaW1pdGl2ZS5wb3NpdGlvbnMgPSB0aGlzLl9jYWxjdWxhdGVBcmMoY2VzaXVtUHJvcHMpO1xuXG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxufVxuIl19