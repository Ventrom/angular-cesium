/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
export class EditPolyline extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} startPosition
     * @param {?} endPosition
     * @param {?=} polylineProps
     */
    constructor(entityId, startPosition, endPosition, polylineProps) {
        super();
        this.editedEntityId = entityId;
        this.id = this.generateId();
        this.positions = [startPosition, endPosition];
        this._polylineProps = polylineProps;
    }
    /**
     * @return {?}
     */
    get props() {
        return this._polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this._polylineProps = value;
    }
    /**
     * @return {?}
     */
    getEditedEntityId() {
        return this.editedEntityId;
    }
    /**
     * @return {?}
     */
    getPositions() {
        return this.positions;
    }
    /**
     * @return {?}
     */
    validatePositions() {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    }
    /**
     * @return {?}
     */
    getStartPosition() {
        return this.positions[0];
    }
    /**
     * @return {?}
     */
    getEndPosition() {
        return this.positions[1];
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setStartPosition(position) {
        this.positions[0] = position;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setEndPosition(position) {
        this.positions[1] = position;
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
        return 'edit-polyline-' + EditPolyline.counter++;
    }
}
EditPolyline.counter = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2x5bGluZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRSxNQUFNLE9BQU8sWUFBYSxTQUFRLFFBQVE7Ozs7Ozs7SUFPeEMsWUFBWSxRQUFnQixFQUFFLGFBQXlCLEVBQUUsV0FBdUIsRUFBRSxhQUE2QjtRQUM3RyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDOzs7OztJQUVELElBQUksS0FBSyxDQUFDLEtBQW9CO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQzs7OztJQUVELGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDNUUsQ0FBQzs7OztJQUVELGdCQUFnQjtRQUNkLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7O0lBRUQsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDOzs7OztJQUVELGdCQUFnQixDQUFDLFFBQW9CO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBRUQsY0FBYyxDQUFDLFFBQW9CO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Ozs7O0lBRU8sVUFBVTtRQUNoQixPQUFPLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuRCxDQUFDOztBQXhETSxvQkFBTyxHQUFHLENBQUMsQ0FBQzs7O0lBQW5CLHFCQUFtQjs7Ozs7SUFDbkIsc0NBQStCOzs7OztJQUMvQiwwQkFBbUI7Ozs7O0lBQ25CLGlDQUFnQzs7Ozs7SUFDaEMsc0NBQXNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdFBvbHlsaW5lIGV4dGVuZHMgQWNFbnRpdHkge1xuICBzdGF0aWMgY291bnRlciA9IDA7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBpZDogc3RyaW5nO1xuICBwcml2YXRlIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdO1xuICBwcml2YXRlIF9wb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcsIHN0YXJ0UG9zaXRpb246IENhcnRlc2lhbjMsIGVuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5lZGl0ZWRFbnRpdHlJZCA9IGVudGl0eUlkO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbl07XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHBvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9seWxpbmVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXRFZGl0ZWRFbnRpdHlJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVkaXRlZEVudGl0eUlkO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnM7XG4gIH1cblxuICB2YWxpZGF0ZVBvc2l0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBvc2l0aW9uc1sxXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0U3RhcnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF07XG4gIH1cblxuICBnZXRFbmRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMV07XG4gIH1cblxuICBzZXRTdGFydFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMF0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIHNldEVuZFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMV0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIGdldElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2VkaXQtcG9seWxpbmUtJyArIEVkaXRQb2x5bGluZS5jb3VudGVyKys7XG4gIH1cbn1cbiJdfQ==