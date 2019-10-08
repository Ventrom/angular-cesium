/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditPoint = /** @class */ (function (_super) {
    tslib_1.__extends(EditPoint, _super);
    function EditPoint(entityId, position, pointProps, virtualPoint) {
        if (virtualPoint === void 0) { virtualPoint = false; }
        var _this = _super.call(this) || this;
        _this._show = true;
        _this.editedEntityId = entityId;
        _this.position = position;
        _this.id = _this.generateId();
        _this.pointProps = pointProps;
        _this._virtualEditPoint = virtualPoint;
        return _this;
    }
    Object.defineProperty(EditPoint.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPoint.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this.pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditPoint.prototype.isVirtualEditPoint = /**
     * @return {?}
     */
    function () {
        return this._virtualEditPoint;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    EditPoint.prototype.setVirtualEditPoint = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._virtualEditPoint = value;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getEditedEntityId = /**
     * @return {?}
     */
    function () {
        return this.editedEntityId;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getPosition = /**
     * @return {?}
     */
    function () {
        return this.position;
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPoint.prototype.setPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    };
    /**
     * @return {?}
     */
    EditPoint.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditPoint.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-point-' + EditPoint.counter++;
    };
    EditPoint.counter = 0;
    return EditPoint;
}(AcEntity));
export { EditPoint };
if (false) {
    /** @type {?} */
    EditPoint.counter;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype.editedEntityId;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype.position;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype._virtualEditPoint;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype.pointProps;
    /**
     * @type {?}
     * @private
     */
    EditPoint.prototype._show;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2ludC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFJakU7SUFBK0IscUNBQVE7SUFTckMsbUJBQVksUUFBZ0IsRUFBRSxRQUFvQixFQUFFLFVBQXVCLEVBQUUsWUFBb0I7UUFBcEIsNkJBQUEsRUFBQSxvQkFBb0I7UUFBakcsWUFDRSxpQkFBTyxTQU1SO1FBVE8sV0FBSyxHQUFHLElBQUksQ0FBQztRQUluQixLQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztRQUMvQixLQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixLQUFJLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixLQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxDQUFDOztJQUN4QyxDQUFDO0lBRUQsc0JBQUksMkJBQUk7Ozs7UUFBUjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7OztRQUVELFVBQVMsS0FBSztZQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksNEJBQUs7Ozs7UUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDOzs7OztRQUVELFVBQVUsS0FBaUI7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUIsQ0FBQzs7O09BSkE7Ozs7SUFNRCxzQ0FBa0I7OztJQUFsQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBRUQsdUNBQW1COzs7O0lBQW5CLFVBQW9CLEtBQWM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDOzs7O0lBRUQscUNBQWlCOzs7SUFBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVELCtCQUFXOzs7SUFBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDOzs7OztJQUVELCtCQUFXOzs7O0lBQVgsVUFBWSxRQUFvQjtRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7O0lBRUQseUJBQUs7OztJQUFMO1FBQ0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRU8sOEJBQVU7Ozs7SUFBbEI7UUFDRSxPQUFPLGFBQWEsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQTdETSxpQkFBTyxHQUFHLENBQUMsQ0FBQztJQThEckIsZ0JBQUM7Q0FBQSxBQS9ERCxDQUErQixRQUFRLEdBK0R0QztTQS9EWSxTQUFTOzs7SUFDcEIsa0JBQW1COzs7OztJQUNuQix1QkFBbUI7Ozs7O0lBQ25CLG1DQUErQjs7Ozs7SUFDL0IsNkJBQTZCOzs7OztJQUM3QixzQ0FBbUM7Ozs7O0lBQ25DLCtCQUErQjs7Ozs7SUFDL0IsMEJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdFBvaW50IGV4dGVuZHMgQWNFbnRpdHkge1xuICBzdGF0aWMgY291bnRlciA9IDA7XG4gIHByaXZhdGUgaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBlZGl0ZWRFbnRpdHlJZDogc3RyaW5nO1xuICBwcml2YXRlIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF92aXJ0dWFsRWRpdFBvaW50OiBib29sZWFuO1xuICBwcml2YXRlIHBvaW50UHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX3Nob3cgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcsIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2ludFByb3BzPzogUG9pbnRQcm9wcywgdmlydHVhbFBvaW50ID0gZmFsc2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWRpdGVkRW50aXR5SWQgPSBlbnRpdHlJZDtcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgdGhpcy5pZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuICAgIHRoaXMucG9pbnRQcm9wcyA9IHBvaW50UHJvcHM7XG4gICAgdGhpcy5fdmlydHVhbEVkaXRQb2ludCA9IHZpcnR1YWxQb2ludDtcbiAgfVxuXG4gIGdldCBzaG93KCkge1xuICAgIHJldHVybiB0aGlzLl9zaG93O1xuICB9XG5cbiAgc2V0IHNob3codmFsdWUpIHtcbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMucG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgaXNWaXJ0dWFsRWRpdFBvaW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl92aXJ0dWFsRWRpdFBvaW50O1xuICB9XG5cbiAgc2V0VmlydHVhbEVkaXRQb2ludCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZpcnR1YWxFZGl0UG9pbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldEVkaXRlZEVudGl0eUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdGVkRW50aXR5SWQ7XG4gIH1cblxuICBnZXRQb3NpdGlvbigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbiAgfVxuXG4gIHNldFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBwb3NpdGlvbi55O1xuICAgIHRoaXMucG9zaXRpb24ueiA9IHBvc2l0aW9uLno7XG4gIH1cblxuICBnZXRJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdlZGl0LXBvaW50LScgKyBFZGl0UG9pbnQuY291bnRlcisrO1xuICB9XG59XG4iXX0=