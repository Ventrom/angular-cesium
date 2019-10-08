/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
var PixelOffsetPipe = /** @class */ (function () {
    function PixelOffsetPipe() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    PixelOffsetPipe.prototype.transform = /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    function (value, args) {
        return new Cesium.Cartesian2(value[0], value[1]);
    };
    PixelOffsetPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'pixelOffset'
                },] }
    ];
    return PixelOffsetPipe;
}());
export { PixelOffsetPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwtb2Zmc2V0LnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9waXhlbC1vZmZzZXQvcGl4ZWwtb2Zmc2V0LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7OztBQVlwRDtJQUFBO0lBU0EsQ0FBQzs7Ozs7O0lBSkMsbUNBQVM7Ozs7O0lBQVQsVUFBVSxLQUFVLEVBQUUsSUFBVTtRQUM5QixPQUFPLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7Z0JBUEYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxhQUFhO2lCQUNwQjs7SUFPRCxzQkFBQztDQUFBLEFBVEQsSUFTQztTQU5ZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGV4YW1wbGVcbiAqIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xuICogICAgICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXG4gKiAgICAgICAgICAgIHBpeGVsT2Zmc2V0IDogWy0xNSwyMF0gfCBwaXhlbE9mZnNldCxcbiAqICAgICAgICAgICAgdGV4dDogdHJhY2submFtZSxcbiAqICAgICAgICAgICAgZm9udDogJzE1cHggc2Fucy1zZXJpZidcbiAqICAgIH1cIj5cbiAqIDwvYWMtbGFiZWwtZGVzYz5cbiAqL1xuQFBpcGUoe1xuICBuYW1lOiAncGl4ZWxPZmZzZXQnXG59KVxuZXhwb3J0IGNsYXNzIFBpeGVsT2Zmc2V0UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogYW55IHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKHZhbHVlWzBdLCB2YWx1ZVsxXSk7XG4gIH1cblxufVxuIl19