import { HtmlPrimitive } from './primitives';
import { HtmlCollection } from './collections';
var CesiumExtender = /** @class */ (function () {
    function CesiumExtender() {
    }
    CesiumExtender.extend = function () {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    };
    return CesiumExtender;
}());
export { CesiumExtender };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9jZXNpdW0tZXh0ZW5kZXIvZXh0ZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9DO0lBQUE7SUFLQSxDQUFDO0lBSlEscUJBQU0sR0FBYjtRQUNFLE1BQU0sQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3pDLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFMRCxJQUtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHRtbFByaW1pdGl2ZSB9IGZyb20gJy4vcHJpbWl0aXZlcyc7XG5pbXBvcnQgeyBIdG1sQ29sbGVjdGlvbiB9IGZyb20gJy4vY29sbGVjdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgQ2VzaXVtRXh0ZW5kZXIge1xuICBzdGF0aWMgZXh0ZW5kKCkge1xuICAgIENlc2l1bS5IdG1sUHJpbWl0aXZlID0gSHRtbFByaW1pdGl2ZTtcbiAgICBDZXNpdW0uSHRtbENvbGxlY3Rpb24gPSBIdG1sQ29sbGVjdGlvbjtcbiAgfVxufVxuIl19