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
let PixelOffsetPipe = class PixelOffsetPipe {
    transform(value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    }
};
PixelOffsetPipe = __decorate([
    Pipe({
        name: 'pixelOffset'
    })
], PixelOffsetPipe);
export { PixelOffsetPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9waXhlbC1vZmZzZXQvcGl4ZWwtb2Zmc2V0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBEOzs7Ozs7Ozs7R0FTRztBQUlILElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFFMUIsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFVO1FBQzlCLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBRUYsQ0FBQTtBQU5ZLGVBQWU7SUFIM0IsSUFBSSxDQUFDO1FBQ0osSUFBSSxFQUFFLGFBQWE7S0FDcEIsQ0FBQztHQUNXLGVBQWUsQ0FNM0I7U0FOWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiA8YWMtbGFiZWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgICAgICBwaXhlbE9mZnNldCA6IFstMTUsMjBdIHwgcGl4ZWxPZmZzZXQsXG4gKiAgICAgICAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXG4gKiAgICAgICAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICB9XCI+XG4gKiA8L2FjLWxhYmVsLWRlc2M+XG4gKi9cbkBQaXBlKHtcbiAgbmFtZTogJ3BpeGVsT2Zmc2V0J1xufSlcbmV4cG9ydCBjbGFzcyBQaXhlbE9mZnNldFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJncz86IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FydGVzaWFuMih2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICB9XG5cbn1cbiJdfQ==