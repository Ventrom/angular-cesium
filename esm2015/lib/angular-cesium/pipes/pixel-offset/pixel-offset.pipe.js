/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
/**
 * \@example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
export class PixelOffsetPipe {
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    transform(value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.decorators = [
    { type: Pipe, args: [{
                name: 'pixelOffset'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9waXhlbC1vZmZzZXQvcGl4ZWwtb2Zmc2V0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7OztBQWVwRCxNQUFNLE9BQU8sZUFBZTs7Ozs7O0lBRTFCLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBVTtRQUM5QixPQUFPLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7O1lBUEYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxhQUFhO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiA8YWMtbGFiZWwtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICAgICAgcG9zaXRpb246IHRyYWNrLnBvc2l0aW9uLFxuICogICAgICAgICAgICBwaXhlbE9mZnNldCA6IFstMTUsMjBdIHwgcGl4ZWxPZmZzZXQsXG4gKiAgICAgICAgICAgIHRleHQ6IHRyYWNrLm5hbWUsXG4gKiAgICAgICAgICAgIGZvbnQ6ICcxNXB4IHNhbnMtc2VyaWYnXG4gKiAgICB9XCI+XG4gKiA8L2FjLWxhYmVsLWRlc2M+XG4gKi9cbkBQaXBlKHtcbiAgbmFtZTogJ3BpeGVsT2Zmc2V0J1xufSlcbmV4cG9ydCBjbGFzcyBQaXhlbE9mZnNldFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJncz86IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FydGVzaWFuMih2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICB9XG5cbn1cbiJdfQ==