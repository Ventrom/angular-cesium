import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
var RadiansToDegreesPipe = /** @class */ (function () {
    function RadiansToDegreesPipe() {
    }
    RadiansToDegreesPipe.prototype.transform = function (value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    };
    RadiansToDegreesPipe = __decorate([
        Pipe({
            name: 'radiansToDegrees'
        })
    ], RadiansToDegreesPipe);
    return RadiansToDegreesPipe;
}());
export { RadiansToDegreesPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaWFucy10by1kZWdyZWVzLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9waXBlcy9yYWRpYW5zLXRvLWRlZ3JlZXMvcmFkaWFucy10by1kZWdyZWVzLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBS3BEO0lBQUE7SUFNQSxDQUFDO0lBSkMsd0NBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUFVO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN6RCxDQUFDO0lBSlUsb0JBQW9CO1FBSGhDLElBQUksQ0FBQztZQUNKLElBQUksRUFBRSxrQkFBa0I7U0FDekIsQ0FBQztPQUNXLG9CQUFvQixDQU1oQztJQUFELDJCQUFDO0NBQUEsQUFORCxJQU1DO1NBTlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdyYWRpYW5zVG9EZWdyZWVzJ1xufSlcbmV4cG9ydCBjbGFzcyBSYWRpYW5zVG9EZWdyZWVzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzPzogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKDM2MCAtIE1hdGgucm91bmQoMTgwICogdmFsdWUgLyBNYXRoLlBJKSkgJSAzNjA7XG4gIH1cblxufVxuIl19