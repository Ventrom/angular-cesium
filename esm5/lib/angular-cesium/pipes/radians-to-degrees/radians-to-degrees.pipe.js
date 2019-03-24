/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
var RadiansToDegreesPipe = /** @class */ (function () {
    function RadiansToDegreesPipe() {
    }
    /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    RadiansToDegreesPipe.prototype.transform = /**
     * @param {?} value
     * @param {?=} args
     * @return {?}
     */
    function (value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    };
    RadiansToDegreesPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'radiansToDegrees'
                },] }
    ];
    return RadiansToDegreesPipe;
}());
export { RadiansToDegreesPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWFucy10by1kZWdyZWVzLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9yYWRpYW5zLXRvLWRlZ3JlZXMvcmFkaWFucy10by1kZWdyZWVzLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBEO0lBQUE7SUFTQSxDQUFDOzs7Ozs7SUFKQyx3Q0FBUzs7Ozs7SUFBVCxVQUFVLEtBQVUsRUFBRSxJQUFVO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN6RCxDQUFDOztnQkFQRixJQUFJLFNBQUM7b0JBQ0osSUFBSSxFQUFFLGtCQUFrQjtpQkFDekI7O0lBT0QsMkJBQUM7Q0FBQSxBQVRELElBU0M7U0FOWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3JhZGlhbnNUb0RlZ3JlZXMnXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlhbnNUb0RlZ3JlZXNQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiAoMzYwIC0gTWF0aC5yb3VuZCgxODAgKiB2YWx1ZSAvIE1hdGguUEkpKSAlIDM2MDtcbiAgfVxuXG59XG4iXX0=