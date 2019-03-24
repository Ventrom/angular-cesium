/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditPolyline = /** @class */ (function (_super) {
    tslib_1.__extends(EditPolyline, _super);
    function EditPolyline(entityId, startPosition, endPosition, polylineProps) {
        var _this = _super.call(this) || this;
        _this.editedEntityId = entityId;
        _this.id = _this.generateId();
        _this.positions = [startPosition, endPosition];
        _this._polylineProps = polylineProps;
        return _this;
    }
    Object.defineProperty(EditPolyline.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditPolyline.prototype.getEditedEntityId = /**
     * @return {?}
     */
    function () {
        return this.editedEntityId;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getPositions = /**
     * @return {?}
     */
    function () {
        return this.positions;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.validatePositions = /**
     * @return {?}
     */
    function () {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getStartPosition = /**
     * @return {?}
     */
    function () {
        return this.positions[0];
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getEndPosition = /**
     * @return {?}
     */
    function () {
        return this.positions[1];
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPolyline.prototype.setStartPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.positions[0] = position;
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditPolyline.prototype.setEndPosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.positions[1] = position;
    };
    /**
     * @return {?}
     */
    EditPolyline.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditPolyline.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-polyline-' + EditPolyline.counter++;
    };
    EditPolyline.counter = 0;
    return EditPolyline;
}(AcEntity));
export { EditPolyline };
if (false) {
    /** @type {?} */
    EditPolyline.counter;
    /**
     * @type {?}
     * @private
     */
    EditPolyline.prototype.editedEntityId;
    /**
     * @type {?}
     * @private
     */
    EditPolyline.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditPolyline.prototype.positions;
    /**
     * @type {?}
     * @private
     */
    EditPolyline.prototype._polylineProps;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2x5bGluZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFJakU7SUFBa0Msd0NBQVE7SUFPeEMsc0JBQVksUUFBZ0IsRUFBRSxhQUF5QixFQUFFLFdBQXVCLEVBQUUsYUFBNkI7UUFBL0csWUFDRSxpQkFBTyxTQUtSO1FBSkMsS0FBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDL0IsS0FBSSxDQUFDLEVBQUUsR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsS0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5QyxLQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQzs7SUFDdEMsQ0FBQztJQUVELHNCQUFJLCtCQUFLOzs7O1FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQzs7Ozs7UUFFRCxVQUFVLEtBQW9CO1lBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzlCLENBQUM7OztPQUpBOzs7O0lBTUQsd0NBQWlCOzs7SUFBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVELG1DQUFZOzs7SUFBWjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsd0NBQWlCOzs7SUFBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO0lBQzVFLENBQUM7Ozs7SUFFRCx1Q0FBZ0I7OztJQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7O0lBRUQscUNBQWM7OztJQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Ozs7O0lBRUQsdUNBQWdCOzs7O0lBQWhCLFVBQWlCLFFBQW9CO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBRUQscUNBQWM7Ozs7SUFBZCxVQUFlLFFBQW9CO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCw0QkFBSzs7O0lBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTyxpQ0FBVTs7OztJQUFsQjtRQUNFLE9BQU8sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ25ELENBQUM7SUF4RE0sb0JBQU8sR0FBRyxDQUFDLENBQUM7SUF5RHJCLG1CQUFDO0NBQUEsQUExREQsQ0FBa0MsUUFBUSxHQTBEekM7U0ExRFksWUFBWTs7O0lBQ3ZCLHFCQUFtQjs7Ozs7SUFDbkIsc0NBQStCOzs7OztJQUMvQiwwQkFBbUI7Ozs7O0lBQ25CLGlDQUFnQzs7Ozs7SUFDaEMsc0NBQXNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdFBvbHlsaW5lIGV4dGVuZHMgQWNFbnRpdHkge1xuICBzdGF0aWMgY291bnRlciA9IDA7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBpZDogc3RyaW5nO1xuICBwcml2YXRlIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdO1xuICBwcml2YXRlIF9wb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcsIHN0YXJ0UG9zaXRpb246IENhcnRlc2lhbjMsIGVuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5lZGl0ZWRFbnRpdHlJZCA9IGVudGl0eUlkO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbl07XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHBvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9seWxpbmVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXRFZGl0ZWRFbnRpdHlJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVkaXRlZEVudGl0eUlkO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnM7XG4gIH1cblxuICB2YWxpZGF0ZVBvc2l0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBvc2l0aW9uc1sxXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0U3RhcnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF07XG4gIH1cblxuICBnZXRFbmRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMV07XG4gIH1cblxuICBzZXRTdGFydFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMF0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIHNldEVuZFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMV0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIGdldElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2VkaXQtcG9seWxpbmUtJyArIEVkaXRQb2x5bGluZS5jb3VudGVyKys7XG4gIH1cbn1cbiJdfQ==