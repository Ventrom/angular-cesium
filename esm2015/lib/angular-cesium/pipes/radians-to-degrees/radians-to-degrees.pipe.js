/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
export class RadiansToDegreesPipe {
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    transform(value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    }
}
RadiansToDegreesPipe.decorators = [
    { type: Pipe, args: [{
                name: 'radiansToDegrees'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWFucy10by1kZWdyZWVzLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9yYWRpYW5zLXRvLWRlZ3JlZXMvcmFkaWFucy10by1kZWdyZWVzLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBS3BELE1BQU0sT0FBTyxvQkFBb0I7Ozs7OztJQUUvQixTQUFTLENBQUMsS0FBVSxFQUFFLElBQVU7UUFDOUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3pELENBQUM7OztZQVBGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsa0JBQWtCO2FBQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdyYWRpYW5zVG9EZWdyZWVzJ1xufSlcbmV4cG9ydCBjbGFzcyBSYWRpYW5zVG9EZWdyZWVzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKDM2MCAtIE1hdGgucm91bmQoMTgwICogdmFsdWUgLyBNYXRoLlBJKSkgJSAzNjA7XG4gIH1cblxufVxuIl19