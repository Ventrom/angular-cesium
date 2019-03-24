/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
export class EditArc extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} center
     * @param {?} radius
     * @param {?} delta
     * @param {?} angle
     * @param {?} _arcProps
     */
    constructor(entityId, center, radius, delta, angle, _arcProps) {
        super();
        this._arcProps = _arcProps;
        this.id = this.generateId();
        this.editedEntityId = entityId;
        this._center = center;
        this._radius = radius;
        this._delta = delta;
        this._angle = angle;
    }
    /**
     * @return {?}
     */
    get props() {
        return this._arcProps;
    }
    /**
     * @param {?} props
     * @return {?}
     */
    set props(props) {
        this._arcProps = props;
    }
    /**
     * @return {?}
     */
    get angle() {
        return this._angle;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set angle(value) {
        this._angle = value;
    }
    /**
     * @return {?}
     */
    get delta() {
        return this._delta;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set delta(value) {
        this._delta = value;
    }
    /**
     * @return {?}
     */
    get radius() {
        return this._radius;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set radius(value) {
        this._radius = value;
    }
    /**
     * @return {?}
     */
    get center() {
        return this._center;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set center(value) {
        this._center = value;
    }
    /**
     * @param {?} center
     * @return {?}
     */
    updateCenter(center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
    /**
     * @private
     * @return {?}
     */
    generateId() {
        return 'edit-arc-' + EditArc.counter++;
    }
}
EditArc.counter = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1hcmMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0LWFyYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBSWpFLE1BQU0sT0FBTyxPQUFRLFNBQVEsUUFBUTs7Ozs7Ozs7O0lBU25DLFlBQVksUUFBZ0IsRUFBRSxNQUFrQixFQUFFLE1BQWMsRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFVLFNBQXdCO1FBQzlILEtBQUssRUFBRSxDQUFDO1FBRDhGLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFFOUgsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQzs7OztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7OztJQUVELElBQUksS0FBSyxDQUFDLEtBQW9CO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7Ozs7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7Ozs7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7Ozs7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFhO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFpQjtRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDOzs7OztJQUVELFlBQVksQ0FBQyxNQUFrQjtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDOzs7OztJQUVPLFVBQVU7UUFDaEIsT0FBTyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3pDLENBQUM7O0FBdEVNLGVBQU8sR0FBRyxDQUFDLENBQUM7OztJQUFuQixnQkFBbUI7Ozs7O0lBQ25CLHFCQUFtQjs7Ozs7SUFDbkIsaUNBQStCOzs7OztJQUMvQiwwQkFBNEI7Ozs7O0lBQzVCLDBCQUF3Qjs7Ozs7SUFDeEIseUJBQXVCOzs7OztJQUN2Qix5QkFBdUI7Ozs7O0lBRXlFLDRCQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRBcmMgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHN0YXRpYyBjb3VudGVyID0gMDtcbiAgcHJpdmF0ZSBpZDogc3RyaW5nO1xuICBwcml2YXRlIGVkaXRlZEVudGl0eUlkOiBzdHJpbmc7XG4gIHByaXZhdGUgX2NlbnRlcjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfcmFkaXVzOiBudW1iZXI7XG4gIHByaXZhdGUgX2RlbHRhOiBudW1iZXI7XG4gIHByaXZhdGUgX2FuZ2xlOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZW50aXR5SWQ6IHN0cmluZywgY2VudGVyOiBDYXJ0ZXNpYW4zLCByYWRpdXM6IG51bWJlciwgZGVsdGE6IG51bWJlciwgYW5nbGU6IG51bWJlciwgcHJpdmF0ZSBfYXJjUHJvcHM6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLmVkaXRlZEVudGl0eUlkID0gZW50aXR5SWQ7XG4gICAgdGhpcy5fY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMuX3JhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLl9kZWx0YSA9IGRlbHRhO1xuICAgIHRoaXMuX2FuZ2xlID0gYW5nbGU7XG4gIH1cblxuICBnZXQgcHJvcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FyY1Byb3BzO1xuICB9XG5cbiAgc2V0IHByb3BzKHByb3BzOiBQb2x5bGluZVByb3BzKSB7XG4gICAgdGhpcy5fYXJjUHJvcHMgPSBwcm9wcztcbiAgfVxuXG4gIGdldCBhbmdsZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9hbmdsZTtcbiAgfVxuXG4gIHNldCBhbmdsZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYW5nbGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkZWx0YSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kZWx0YTtcbiAgfVxuXG4gIHNldCBkZWx0YSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fZGVsdGEgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCByYWRpdXMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcmFkaXVzO1xuICB9XG5cbiAgc2V0IHJhZGl1cyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcmFkaXVzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY2VudGVyKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gIH1cblxuICBzZXQgY2VudGVyKHZhbHVlOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5fY2VudGVyID0gdmFsdWU7XG4gIH1cblxuICB1cGRhdGVDZW50ZXIoY2VudGVyOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5fY2VudGVyLnggPSBjZW50ZXIueDtcbiAgICB0aGlzLl9jZW50ZXIueSA9IGNlbnRlci55O1xuICAgIHRoaXMuX2NlbnRlci56ID0gY2VudGVyLno7XG4gIH1cblxuICBnZXRJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdlZGl0LWFyYy0nICsgRWRpdEFyYy5jb3VudGVyKys7XG4gIH1cbn1cbiJdfQ==