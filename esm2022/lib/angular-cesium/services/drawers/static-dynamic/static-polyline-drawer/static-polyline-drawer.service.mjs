import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
export class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(Cesium.PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then((readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticPolylineDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticPolylineDrawerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: StaticPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CesiumService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUVuRzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEscUJBQXFCO0lBQ3BFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsU0FBYyxFQUFFLGFBQWtCLEVBQUUsYUFBa0IsRUFBRSxjQUFtQjtRQUNoRixNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFbkQsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEIsU0FBUyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMxRCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQW1CLEVBQUUsRUFBRTtnQkFDL0QsY0FBYyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDckUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs4R0FwQlUsMkJBQTJCO2tIQUEzQiwyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBRHZDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoZSBwb2x5bGluZSBjb21wb25lbnQuXG4gKiAgVGhpcyBhbHNvIGFsbG93cyB1cyB0byBjaGFuZ2UgdGhlIGNvbG9yIG9mIHRoZSBwb2x5bGluZXMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UgZXh0ZW5kcyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIge1xuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gICAgc3VwZXIoQ2VzaXVtLlBvbHlsaW5lR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBmdW5jdGlvbiBjYW4gb25seSBjaGFuZ2UgdGhlIHByaW1pdGl2ZSBjb2xvci5cbiAgICovXG4gIHVwZGF0ZShwcmltaXRpdmU6IGFueSwgZ2VvbWV0cnlQcm9wczogYW55LCBpbnN0YW5jZVByb3BzOiBhbnksIHByaW1pdGl2ZVByb3BzOiBhbnkpIHtcbiAgICBjb25zdCBjb2xvciA9IGluc3RhbmNlUHJvcHMuYXR0cmlidXRlcy5jb2xvci52YWx1ZTtcblxuICAgIGlmIChwcmltaXRpdmUucmVhZHkpIHtcbiAgICAgIHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcygpLmNvbG9yID0gY29sb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIENlc2l1bS53aGVuKHByaW1pdGl2ZS5yZWFkeVByb21pc2UpLnRoZW4oKHJlYWR5UHJpbWl0aXZlOiBhbnkpID0+IHtcbiAgICAgICAgcmVhZHlQcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvci52YWx1ZSA9IGNvbG9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxufVxuIl19