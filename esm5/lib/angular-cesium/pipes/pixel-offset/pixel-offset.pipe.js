import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
/**
 * @example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
var PixelOffsetPipe = /** @class */ (function () {
    function PixelOffsetPipe() {
    }
    PixelOffsetPipe.prototype.transform = function (value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    };
    PixelOffsetPipe = __decorate([
        Pipe({
            name: 'pixelOffset'
        })
    ], PixelOffsetPipe);
    return PixelOffsetPipe;
}());
export { PixelOffsetPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9waXhlbC1vZmZzZXQvcGl4ZWwtb2Zmc2V0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBEOzs7Ozs7Ozs7R0FTRztBQUlIO0lBQUE7SUFNQSxDQUFDO0lBSkMsbUNBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFVO1FBQzlCLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBSlUsZUFBZTtRQUgzQixJQUFJLENBQUM7WUFDSixJQUFJLEVBQUUsYUFBYTtTQUNwQixDQUFDO09BQ1csZUFBZSxDQU0zQjtJQUFELHNCQUFDO0NBQUEsQUFORCxJQU1DO1NBTlksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZXhhbXBsZVxuICogPGFjLWxhYmVsLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICAgICAgICB0ZXh0OiB0cmFjay5uYW1lLFxuICogICAgICAgICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgfVwiPlxuICogPC9hYy1sYWJlbC1kZXNjPlxuICovXG5AUGlwZSh7XG4gIG5hbWU6ICdwaXhlbE9mZnNldCdcbn0pXG5leHBvcnQgY2xhc3MgUGl4ZWxPZmZzZXRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjIodmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgfVxuXG59XG4iXX0=