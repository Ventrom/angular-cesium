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
export class PixelOffsetPipe {
    transform(value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.decorators = [
    { type: Pipe, args: [{
                name: 'pixelOffset'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3BpcGVzL3BpeGVsLW9mZnNldC9waXhlbC1vZmZzZXQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUVwRDs7Ozs7Ozs7O0dBU0c7QUFJSCxNQUFNLE9BQU8sZUFBZTtJQUUxQixTQUFTLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDOUIsT0FBTyxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7OztZQVBGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsYUFBYTthQUNwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZXhhbXBsZVxuICogPGFjLWxhYmVsLWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcbiAqICAgICAgICAgICAgcGl4ZWxPZmZzZXQgOiBbLTE1LDIwXSB8IHBpeGVsT2Zmc2V0LFxuICogICAgICAgICAgICB0ZXh0OiB0cmFjay5uYW1lLFxuICogICAgICAgICAgICBmb250OiAnMTVweCBzYW5zLXNlcmlmJ1xuICogICAgfVwiPlxuICogPC9hYy1sYWJlbC1kZXNjPlxuICovXG5AUGlwZSh7XG4gIG5hbWU6ICdwaXhlbE9mZnNldCdcbn0pXG5leHBvcnQgY2xhc3MgUGl4ZWxPZmZzZXRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjIodmFsdWVbMF0sIHZhbHVlWzFdKTtcbiAgfVxuXG59XG4iXX0=