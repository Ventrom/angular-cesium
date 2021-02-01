import { __decorate, __extends, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
var StaticPolylineDrawerService = /** @class */ (function (_super) {
    __extends(StaticPolylineDrawerService, _super);
    function StaticPolylineDrawerService(cesiumService) {
        return _super.call(this, Cesium.PolylineGeometry, cesiumService) || this;
    }
    /**
     * Update function can only change the primitive color.
     */
    StaticPolylineDrawerService.prototype.update = function (primitive, geometryProps, instanceProps, primitiveProps) {
        var color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            Cesium.when(primitive.readyPromise).then(function (readyPrimitive) {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    };
    StaticPolylineDrawerService.ctorParameters = function () { return [
        { type: CesiumService }
    ]; };
    StaticPolylineDrawerService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [CesiumService])
    ], StaticPolylineDrawerService);
    return StaticPolylineDrawerService;
}(StaticPrimitiveDrawer));
export { StaticPolylineDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFFbkc7OztHQUdHO0FBRUg7SUFBaUQsK0NBQXFCO0lBQ3BFLHFDQUFZLGFBQTRCO2VBQ3RDLGtCQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNENBQU0sR0FBTixVQUFPLFNBQWMsRUFBRSxhQUFrQixFQUFFLGFBQWtCLEVBQUUsY0FBbUI7UUFDaEYsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRW5ELElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUNuQixTQUFTLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxjQUFtQjtnQkFDM0QsY0FBYyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDckUsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7O2dCQW5CMEIsYUFBYTs7SUFEN0IsMkJBQTJCO1FBRHZDLFVBQVUsRUFBRTt5Q0FFZ0IsYUFBYTtPQUQ3QiwyQkFBMkIsQ0FxQnZDO0lBQUQsa0NBQUM7Q0FBQSxBQXJCRCxDQUFpRCxxQkFBcUIsR0FxQnJFO1NBckJZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgc3RhdGljIHZlcnNpb24gb2YgdGhlIHBvbHlsaW5lIGNvbXBvbmVudC5cbiAqICBUaGlzIGFsc28gYWxsb3dzIHVzIHRvIGNoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBvbHlsaW5lcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XG4gIGNvbnN0cnVjdG9yKGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcihDZXNpdW0uUG9seWxpbmVHZW9tZXRyeSwgY2VzaXVtU2VydmljZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGZ1bmN0aW9uIGNhbiBvbmx5IGNoYW5nZSB0aGUgcHJpbWl0aXZlIGNvbG9yLlxuICAgKi9cbiAgdXBkYXRlKHByaW1pdGl2ZTogYW55LCBnZW9tZXRyeVByb3BzOiBhbnksIGluc3RhbmNlUHJvcHM6IGFueSwgcHJpbWl0aXZlUHJvcHM6IGFueSkge1xuICAgIGNvbnN0IGNvbG9yID0gaW5zdGFuY2VQcm9wcy5hdHRyaWJ1dGVzLmNvbG9yLnZhbHVlO1xuXG4gICAgaWYgKHByaW1pdGl2ZS5yZWFkeSkge1xuICAgICAgcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKCkuY29sb3IgPSBjb2xvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgQ2VzaXVtLndoZW4ocHJpbWl0aXZlLnJlYWR5UHJvbWlzZSkudGhlbigocmVhZHlQcmltaXRpdmU6IGFueSkgPT4ge1xuICAgICAgICByZWFkeVByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcygpLmNvbG9yLnZhbHVlID0gY29sb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG59XG4iXX0=