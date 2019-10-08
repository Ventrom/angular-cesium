/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { EditableCircle } from '../../../models/editable-circle';
var CirclesManagerService = /** @class */ (function () {
    function CirclesManagerService() {
        this.circles = new Map();
    }
    /**
     * @param {?} id
     * @param {?} editCirclesLayer
     * @param {?} editPointsLayer
     * @param {?} editArcsLayer
     * @param {?} circleOptions
     * @return {?}
     */
    CirclesManagerService.prototype.createEditableCircle = /**
     * @param {?} id
     * @param {?} editCirclesLayer
     * @param {?} editPointsLayer
     * @param {?} editArcsLayer
     * @param {?} circleOptions
     * @return {?}
     */
    function (id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        /** @type {?} */
        var editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    CirclesManagerService.prototype.dispose = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        this.circles.get(id).dispose();
        this.circles.delete(id);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    CirclesManagerService.prototype.get = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        return this.circles.get(id);
    };
    /**
     * @return {?}
     */
    CirclesManagerService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this.circles.forEach((/**
         * @param {?} circle
         * @return {?}
         */
        function (circle) { return circle.dispose(); }));
        this.circles.clear();
    };
    CirclesManagerService.decorators = [
        { type: Injectable }
    ];
    return CirclesManagerService;
}());
export { CirclesManagerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CirclesManagerService.prototype.circles;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2NpcmNsZXMtZWRpdG9yL2NpcmNsZXMtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUlqRTtJQUFBO1FBRVUsWUFBTyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO0lBeUJ0RCxDQUFDOzs7Ozs7Ozs7SUF2QkMsb0RBQW9COzs7Ozs7OztJQUFwQixVQUFxQixFQUFVLEVBQ1YsZ0JBQWtDLEVBQ2xDLGVBQWlDLEVBQ2pDLGFBQStCLEVBQy9CLGFBQWdDOztZQUM3QyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDO1FBQzlHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNyQyxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDOzs7OztJQUVELHVDQUFPOzs7O0lBQVAsVUFBUSxFQUFVO1FBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsbUNBQUc7Ozs7SUFBSCxVQUFJLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7SUFFRCxxQ0FBSzs7O0lBQUw7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBaEIsQ0FBZ0IsRUFBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkIsQ0FBQzs7Z0JBMUJGLFVBQVU7O0lBMkJYLDRCQUFDO0NBQUEsQUEzQkQsSUEyQkM7U0ExQlkscUJBQXFCOzs7Ozs7SUFDaEMsd0NBQW9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRWRpdGFibGVDaXJjbGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZWRpdGFibGUtY2lyY2xlJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9jaXJjbGUtZWRpdC1vcHRpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENpcmNsZXNNYW5hZ2VyU2VydmljZSB7XG4gIHByaXZhdGUgY2lyY2xlcyA9IG5ldyBNYXA8c3RyaW5nLCBFZGl0YWJsZUNpcmNsZT4oKTtcblxuICBjcmVhdGVFZGl0YWJsZUNpcmNsZShpZDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0Q2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgICAgICAgICBlZGl0UG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGVkaXRBcmNzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZU9wdGlvbnM6IENpcmNsZUVkaXRPcHRpb25zKTogRWRpdGFibGVDaXJjbGUge1xuICAgIGNvbnN0IGVkaXRhYmxlQ2lyY2xlID0gbmV3IEVkaXRhYmxlQ2lyY2xlKGlkLCBlZGl0Q2lyY2xlc0xheWVyLCBlZGl0UG9pbnRzTGF5ZXIsIGVkaXRBcmNzTGF5ZXIsIGNpcmNsZU9wdGlvbnMpO1xuICAgIHRoaXMuY2lyY2xlcy5zZXQoaWQsIGVkaXRhYmxlQ2lyY2xlKTtcbiAgICByZXR1cm4gZWRpdGFibGVDaXJjbGU7XG4gIH1cblxuICBkaXNwb3NlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNpcmNsZXMuZ2V0KGlkKS5kaXNwb3NlKCk7XG4gICAgdGhpcy5jaXJjbGVzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IEVkaXRhYmxlQ2lyY2xlIHtcbiAgICByZXR1cm4gdGhpcy5jaXJjbGVzLmdldChpZCk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmNpcmNsZXMuZm9yRWFjaChjaXJjbGUgPT4gY2lyY2xlLmRpc3Bvc2UoKSk7XG4gICAgdGhpcy5jaXJjbGVzLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==