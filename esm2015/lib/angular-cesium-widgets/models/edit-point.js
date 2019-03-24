/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
export class EditPoint extends AcEntity {
    /**
     * @param {?} entityId
     * @param {?} position
     * @param {?=} pointProps
     * @param {?=} virtualPoint
     */
    constructor(entityId, position, pointProps, virtualPoint = false) {
        super();
        this._show = true;
        this.editedEntityId = entityId;
        this.position = position;
        this.id = this.generateId();
        this.pointProps = pointProps;
        this._virtualEditPoint = virtualPoint;
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set show(value) {
        this._show = value;
    }
    /**
     * @return {?}
     */
    get props() {
        return this.pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this.pointProps = value;
    }
    /**
     * @return {?}
     */
    isVirtualEditPoint() {
        return this._virtualEditPoint;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setVirtualEditPoint(value) {
        this._virtualEditPoint = value;
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
    getPosition() {
        return this.position;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
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
        return 'edit-point-' + EditPoint.counter++;
    }
}
EditPoint.counter = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2ludC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRSxNQUFNLE9BQU8sU0FBVSxTQUFRLFFBQVE7Ozs7Ozs7SUFTckMsWUFBWSxRQUFnQixFQUFFLFFBQW9CLEVBQUUsVUFBdUIsRUFBRSxZQUFZLEdBQUcsS0FBSztRQUMvRixLQUFLLEVBQUUsQ0FBQztRQUhGLFVBQUssR0FBRyxJQUFJLENBQUM7UUFJbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQztJQUN4QyxDQUFDOzs7O0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBSztRQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQzs7Ozs7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFpQjtRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDOzs7O0lBRUQsa0JBQWtCO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBRUQsbUJBQW1CLENBQUMsS0FBYztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsUUFBb0I7UUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTyxVQUFVO1FBQ2hCLE9BQU8sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QyxDQUFDOztBQTdETSxpQkFBTyxHQUFHLENBQUMsQ0FBQzs7O0lBQW5CLGtCQUFtQjs7Ozs7SUFDbkIsdUJBQW1COzs7OztJQUNuQixtQ0FBK0I7Ozs7O0lBQy9CLDZCQUE2Qjs7Ozs7SUFDN0Isc0NBQW1DOzs7OztJQUNuQywrQkFBK0I7Ozs7O0lBQy9CLDBCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRQb2ludCBleHRlbmRzIEFjRW50aXR5IHtcbiAgc3RhdGljIGNvdW50ZXIgPSAwO1xuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBwb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfdmlydHVhbEVkaXRQb2ludDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBwb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9zaG93ID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nLCBwb3NpdGlvbjogQ2FydGVzaWFuMywgcG9pbnRQcm9wcz86IFBvaW50UHJvcHMsIHZpcnR1YWxQb2ludCA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVkaXRlZEVudGl0eUlkID0gZW50aXR5SWQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLnBvaW50UHJvcHMgPSBwb2ludFByb3BzO1xuICAgIHRoaXMuX3ZpcnR1YWxFZGl0UG9pbnQgPSB2aXJ0dWFsUG9pbnQ7XG4gIH1cblxuICBnZXQgc2hvdygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxuXG4gIHNldCBzaG93KHZhbHVlKSB7XG4gICAgdGhpcy5fc2hvdyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLnBvaW50UHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLnBvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGlzVmlydHVhbEVkaXRQb2ludCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdmlydHVhbEVkaXRQb2ludDtcbiAgfVxuXG4gIHNldFZpcnR1YWxFZGl0UG9pbnQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl92aXJ0dWFsRWRpdFBvaW50ID0gdmFsdWU7XG4gIH1cblxuICBnZXRFZGl0ZWRFbnRpdHlJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVkaXRlZEVudGl0eUlkO1xuICB9XG5cbiAgZ2V0UG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb247XG4gIH1cblxuICBzZXRQb3NpdGlvbihwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IHBvc2l0aW9uLng7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gcG9zaXRpb24ueTtcbiAgICB0aGlzLnBvc2l0aW9uLnogPSBwb3NpdGlvbi56O1xuICB9XG5cbiAgZ2V0SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZWRpdC1wb2ludC0nICsgRWRpdFBvaW50LmNvdW50ZXIrKztcbiAgfVxufVxuIl19