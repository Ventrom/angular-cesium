/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditArc = /** @class */ (function (_super) {
    tslib_1.__extends(EditArc, _super);
    function EditArc(entityId, center, radius, delta, angle, _arcProps) {
        var _this = _super.call(this) || this;
        _this._arcProps = _arcProps;
        _this.id = _this.generateId();
        _this.editedEntityId = entityId;
        _this._center = center;
        _this._radius = radius;
        _this._delta = delta;
        _this._angle = angle;
        return _this;
    }
    Object.defineProperty(EditArc.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this._arcProps;
        },
        set: /**
         * @param {?} props
         * @return {?}
         */
        function (props) {
            this._arcProps = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "angle", {
        get: /**
         * @return {?}
         */
        function () {
            return this._angle;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._angle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "delta", {
        get: /**
         * @return {?}
         */
        function () {
            return this._delta;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._delta = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "radius", {
        get: /**
         * @return {?}
         */
        function () {
            return this._radius;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "center", {
        get: /**
         * @return {?}
         */
        function () {
            return this._center;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._center = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} center
     * @return {?}
     */
    EditArc.prototype.updateCenter = /**
     * @param {?} center
     * @return {?}
     */
    function (center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    };
    /**
     * @return {?}
     */
    EditArc.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditArc.prototype.generateId = /**
     * @private
     * @return {?}
     */
    function () {
        return 'edit-arc-' + EditArc.counter++;
    };
    EditArc.counter = 0;
    return EditArc;
}(AcEntity));
export { EditArc };
if (false) {
    /** @type {?} */
    EditArc.counter;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype.editedEntityId;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype._center;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype._radius;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype._delta;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype._angle;
    /**
     * @type {?}
     * @private
     */
    EditArc.prototype._arcProps;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1hcmMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0LWFyYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRTtJQUE2QixtQ0FBUTtJQVNuQyxpQkFBWSxRQUFnQixFQUFFLE1BQWtCLEVBQUUsTUFBYyxFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQVUsU0FBd0I7UUFBaEksWUFDRSxpQkFBTyxTQU9SO1FBUnVHLGVBQVMsR0FBVCxTQUFTLENBQWU7UUFFOUgsS0FBSSxDQUFDLEVBQUUsR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsS0FBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDL0IsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsS0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0lBQ3RCLENBQUM7SUFFRCxzQkFBSSwwQkFBSzs7OztRQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7Ozs7O1FBRUQsVUFBVSxLQUFvQjtZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN6QixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDBCQUFLOzs7O1FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7Ozs7UUFFRCxVQUFVLEtBQWE7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwwQkFBSzs7OztRQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7Ozs7O1FBRUQsVUFBVSxLQUFhO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksMkJBQU07Ozs7UUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7OztRQUVELFVBQVcsS0FBYTtZQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDJCQUFNOzs7O1FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7Ozs7UUFFRCxVQUFXLEtBQWlCO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7OztPQUpBOzs7OztJQU1ELDhCQUFZOzs7O0lBQVosVUFBYSxNQUFrQjtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRUQsdUJBQUs7OztJQUFMO1FBQ0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRU8sNEJBQVU7Ozs7SUFBbEI7UUFDRSxPQUFPLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQXRFTSxlQUFPLEdBQUcsQ0FBQyxDQUFDO0lBdUVyQixjQUFDO0NBQUEsQUF4RUQsQ0FBNkIsUUFBUSxHQXdFcEM7U0F4RVksT0FBTzs7O0lBQ2xCLGdCQUFtQjs7Ozs7SUFDbkIscUJBQW1COzs7OztJQUNuQixpQ0FBK0I7Ozs7O0lBQy9CLDBCQUE0Qjs7Ozs7SUFDNUIsMEJBQXdCOzs7OztJQUN4Qix5QkFBdUI7Ozs7O0lBQ3ZCLHlCQUF1Qjs7Ozs7SUFFeUUsNEJBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdEFyYyBleHRlbmRzIEFjRW50aXR5IHtcbiAgc3RhdGljIGNvdW50ZXIgPSAwO1xuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfY2VudGVyOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9yYWRpdXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBfZGVsdGE6IG51bWJlcjtcbiAgcHJpdmF0ZSBfYW5nbGU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nLCBjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyLCBkZWx0YTogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCBwcml2YXRlIF9hcmNQcm9wczogUG9seWxpbmVQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuICAgIHRoaXMuZWRpdGVkRW50aXR5SWQgPSBlbnRpdHlJZDtcbiAgICB0aGlzLl9jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy5fcmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuX2RlbHRhID0gZGVsdGE7XG4gICAgdGhpcy5fYW5nbGUgPSBhbmdsZTtcbiAgfVxuXG4gIGdldCBwcm9wcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJjUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHMocHJvcHM6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9hcmNQcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgZ2V0IGFuZ2xlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICB9XG5cbiAgc2V0IGFuZ2xlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9hbmdsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlbHRhKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbHRhO1xuICB9XG5cbiAgc2V0IGRlbHRhKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9kZWx0YSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJhZGl1cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yYWRpdXM7XG4gIH1cblxuICBzZXQgcmFkaXVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yYWRpdXMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX2NlbnRlcjtcbiAgfVxuXG4gIHNldCBjZW50ZXIodmFsdWU6IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9jZW50ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZUNlbnRlcihjZW50ZXI6IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9jZW50ZXIueCA9IGNlbnRlci54O1xuICAgIHRoaXMuX2NlbnRlci55ID0gY2VudGVyLnk7XG4gICAgdGhpcy5fY2VudGVyLnogPSBjZW50ZXIuejtcbiAgfVxuXG4gIGdldElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2VkaXQtYXJjLScgKyBFZGl0QXJjLmNvdW50ZXIrKztcbiAgfVxufVxuIl19