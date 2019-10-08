/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CesiumEvent } from '../consts/cesium-event.enum';
var CesiumDragDropHelper = /** @class */ (function () {
    function CesiumDragDropHelper() {
    }
    /**
     * @param {?} dragEvent
     * @return {?}
     */
    CesiumDragDropHelper.getDragEventTypes = /**
     * @param {?} dragEvent
     * @return {?}
     */
    function (dragEvent) {
        /** @type {?} */
        var mouseDownEvent;
        /** @type {?} */
        var mouseUpEvent;
        if (dragEvent === CesiumEvent.LEFT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.LEFT_DOWN;
            mouseUpEvent = CesiumEvent.LEFT_UP;
        }
        else if (dragEvent === CesiumEvent.RIGHT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.RIGHT_DOWN;
            mouseUpEvent = CesiumEvent.RIGHT_UP;
        }
        else if (dragEvent === CesiumEvent.MIDDLE_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.MIDDLE_DOWN;
            mouseUpEvent = CesiumEvent.MIDDLE_UP;
        }
        return { mouseDownEvent: mouseDownEvent, mouseUpEvent: mouseUpEvent };
    };
    CesiumDragDropHelper.dragEvents = new Set([
        CesiumEvent.LEFT_CLICK_DRAG,
        CesiumEvent.RIGHT_CLICK_DRAG,
        CesiumEvent.MIDDLE_CLICK_DRAG
    ]);
    return CesiumDragDropHelper;
}());
export { CesiumDragDropHelper };
if (false) {
    /** @type {?} */
    CesiumDragDropHelper.dragEvents;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLWRyYWctZHJvcC1oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tZHJhZy1kcm9wLWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTFEO0lBQUE7SUF5QkEsQ0FBQzs7Ozs7SUFoQmUsc0NBQWlCOzs7O0lBQS9CLFVBQWdDLFNBQXNCOztZQUNoRCxjQUFjOztZQUNkLFlBQVk7UUFDaEIsSUFBSSxTQUFTLEtBQUssV0FBVyxDQUFDLGVBQWUsRUFBRTtZQUM3QyxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztZQUN2QyxZQUFZLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQztTQUNwQzthQUFNLElBQUksU0FBUyxLQUFLLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNyRCxjQUFjLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztZQUN4QyxZQUFZLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQztTQUNyQzthQUFNLElBQUksU0FBUyxLQUFLLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRTtZQUN0RCxjQUFjLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQztZQUN6QyxZQUFZLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztTQUN0QztRQUVELE9BQU8sRUFBQyxjQUFjLGdCQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUMsQ0FBQztJQUN4QyxDQUFDO0lBdEJhLCtCQUFVLEdBQXFCLElBQUksR0FBRyxDQUFDO1FBQ25ELFdBQVcsQ0FBQyxlQUFlO1FBQzNCLFdBQVcsQ0FBQyxnQkFBZ0I7UUFDNUIsV0FBVyxDQUFDLGlCQUFpQjtLQUM5QixDQUFDLENBQUM7SUFtQkwsMkJBQUM7Q0FBQSxBQXpCRCxJQXlCQztTQXpCWSxvQkFBb0I7OztJQUUvQixnQ0FJRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENlc2l1bUV2ZW50IH0gZnJvbSAnLi4vY29uc3RzL2Nlc2l1bS1ldmVudC5lbnVtJztcblxuZXhwb3J0IGNsYXNzIENlc2l1bURyYWdEcm9wSGVscGVyIHtcblxuICBwdWJsaWMgc3RhdGljIGRyYWdFdmVudHM6IFNldDxDZXNpdW1FdmVudD4gPSBuZXcgU2V0KFtcbiAgICBDZXNpdW1FdmVudC5MRUZUX0NMSUNLX0RSQUcsXG4gICAgQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0tfRFJBRyxcbiAgICBDZXNpdW1FdmVudC5NSURETEVfQ0xJQ0tfRFJBR1xuICBdKTtcblxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RHJhZ0V2ZW50VHlwZXMoZHJhZ0V2ZW50OiBDZXNpdW1FdmVudCkge1xuICAgIGxldCBtb3VzZURvd25FdmVudDtcbiAgICBsZXQgbW91c2VVcEV2ZW50O1xuICAgIGlmIChkcmFnRXZlbnQgPT09IENlc2l1bUV2ZW50LkxFRlRfQ0xJQ0tfRFJBRykge1xuICAgICAgbW91c2VEb3duRXZlbnQgPSBDZXNpdW1FdmVudC5MRUZUX0RPV047XG4gICAgICBtb3VzZVVwRXZlbnQgPSBDZXNpdW1FdmVudC5MRUZUX1VQO1xuICAgIH0gZWxzZSBpZiAoZHJhZ0V2ZW50ID09PSBDZXNpdW1FdmVudC5SSUdIVF9DTElDS19EUkFHKSB7XG4gICAgICBtb3VzZURvd25FdmVudCA9IENlc2l1bUV2ZW50LlJJR0hUX0RPV047XG4gICAgICBtb3VzZVVwRXZlbnQgPSBDZXNpdW1FdmVudC5SSUdIVF9VUDtcbiAgICB9IGVsc2UgaWYgKGRyYWdFdmVudCA9PT0gQ2VzaXVtRXZlbnQuTUlERExFX0NMSUNLX0RSQUcpIHtcbiAgICAgIG1vdXNlRG93bkV2ZW50ID0gQ2VzaXVtRXZlbnQuTUlERExFX0RPV047XG4gICAgICBtb3VzZVVwRXZlbnQgPSBDZXNpdW1FdmVudC5NSURETEVfVVA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHttb3VzZURvd25FdmVudCwgbW91c2VVcEV2ZW50fTtcbiAgfVxufVxuIl19