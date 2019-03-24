/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { EditArc } from './edit-arc';
import { defaultLabelProps } from './label-props';
export class EditableCircle extends AcEntity {
    /**
     * @param {?} id
     * @param {?} circlesLayer
     * @param {?} pointsLayer
     * @param {?} arcsLayer
     * @param {?} options
     */
    constructor(id, circlesLayer, pointsLayer, arcsLayer, options) {
        super();
        this.id = id;
        this.circlesLayer = circlesLayer;
        this.pointsLayer = pointsLayer;
        this.arcsLayer = arcsLayer;
        this.options = options;
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._circleProps = options.circleProps;
        this._pointProps = options.pointProps;
        this._polylineProps = options.polylineProps;
    }
    /**
     * @return {?}
     */
    get labels() {
        return this._labels;
    }
    /**
     * @param {?} labels
     * @return {?}
     */
    set labels(labels) {
        if (!labels || !this._center || !this._radiusPoint) {
            return;
        }
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                if (index !== labels.length - 1) {
                    label.position = this._center.getPosition();
                }
                else {
                    label.position = this._radiusPoint.getPosition();
                }
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get polylineProps() {
        return this._polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set polylineProps(value) {
        this._polylineProps = value;
    }
    /**
     * @return {?}
     */
    get pointProps() {
        return this._pointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set pointProps(value) {
        this._pointProps = value;
    }
    /**
     * @return {?}
     */
    get circleProps() {
        return this._circleProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set circleProps(value) {
        this._circleProps = value;
    }
    /**
     * @return {?}
     */
    get center() {
        return this._center;
    }
    /**
     * @return {?}
     */
    get radiusPoint() {
        return this._radiusPoint;
    }
    /**
     * @return {?}
     */
    get enableEdit() {
        return this._enableEdit;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set enableEdit(value) {
        this._enableEdit = value;
        this._center.show = value;
        this._radiusPoint.show = value;
        this.updatePointsLayer();
    }
    /**
     * @param {?} center
     * @param {?} radiusPoint
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} circleProp
     * @return {?}
     */
    setManually(center, radiusPoint, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, circleProp = this.circleProps) {
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        if (!this._radiusPoint) {
            this._radiusPoint = new EditPoint(this.id, radiusPoint, radiusPointProp);
        }
        else {
            this._radiusPoint.setPosition(radiusPoint);
        }
        if (!this._outlineArc) {
            this.createOutlineArc();
        }
        else {
            this._outlineArc.radius = this.getRadius();
        }
        this.circleProps = circleProp;
        this.doneCreation = true;
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        if (!this._center) {
            this._center = new EditPoint(this.id, position, this.pointProps);
            this._radiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            if (!this._outlineArc) {
                this.createOutlineArc();
            }
        }
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    movePoint(toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    moveCircle(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        const radius = this.getRadius();
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    /**
     * @return {?}
     */
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
    }
    /**
     * @return {?}
     */
    getRadius() {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    }
    /**
     * @return {?}
     */
    getRadiusCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRadius.bind(this), false);
    }
    /**
     * @return {?}
     */
    getCenter() {
        return this._center ? this._center.getPosition() : undefined;
    }
    /**
     * @return {?}
     */
    getCenterCallbackProperty() {
        return new Cesium.CallbackProperty(this.getCenter.bind(this), false);
    }
    /**
     * @return {?}
     */
    getRadiusPoint() {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    }
    /**
     * @return {?}
     */
    dispose() {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.remove(this._radiusPoint.getId());
        }
        if (this._outlineArc) {
            this.arcsLayer.remove(this._outlineArc.getId());
        }
        this.circlesLayer.remove(this.id);
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
    updateCirclesLayer() {
        this.circlesLayer.update(this, this.id);
    }
    /**
     * @private
     * @return {?}
     */
    updatePointsLayer() {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    }
    /**
     * @private
     * @return {?}
     */
    updateArcsLayer() {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    }
    /**
     * @private
     * @return {?}
     */
    createOutlineArc() {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._center;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._radiusPoint;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._outlineArc;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.doneCreation;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._circleProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._pointProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._polylineProps;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.circlesLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.arcsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableCircle.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtY2lyY2xlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9tb2RlbHMvZWRpdGFibGUtY2lyY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDNUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUdyQyxPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFHOUQsTUFBTSxPQUFPLGNBQWUsU0FBUSxRQUFROzs7Ozs7OztJQVkxQyxZQUNVLEVBQVUsRUFDVixZQUE4QixFQUM5QixXQUE2QixFQUM3QixTQUEyQixFQUMzQixPQUEwQjtRQUVsQyxLQUFLLEVBQUUsQ0FBQztRQU5BLE9BQUUsR0FBRixFQUFFLENBQVE7UUFDVixpQkFBWSxHQUFaLFlBQVksQ0FBa0I7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLFlBQU8sR0FBUCxPQUFPLENBQW1CO1FBYjVCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBS25CLFlBQU8sR0FBaUIsRUFBRSxDQUFDO1FBVWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQzlDLENBQUM7Ozs7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUks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Ozs7OztJQUNyQyxtQ0FBbUM7Ozs7O0lBQ25DLGlDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWRpdEFyYyB9IGZyb20gJy4vZWRpdC1hcmMnO1xuaW1wb3J0IHsgQ2lyY2xlRWRpdE9wdGlvbnMgfSBmcm9tICcuL2NpcmNsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcywgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFbGxpcHNlUHJvcHMgfSBmcm9tICcuL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlQ2lyY2xlIGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIF9jZW50ZXI6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBfcmFkaXVzUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBfb3V0bGluZUFyYzogRWRpdEFyYztcbiAgcHJpdmF0ZSBkb25lQ3JlYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2NpcmNsZVByb3BzOiBFbGxpcHNlUHJvcHM7XG4gIHByaXZhdGUgX3BvaW50UHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX3BvbHlsaW5lUHJvcHM6IFBvbHlsaW5lUHJvcHM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgIHByaXZhdGUgY2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBhcmNzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jaXJjbGVQcm9wcyA9IG9wdGlvbnMuY2lyY2xlUHJvcHM7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IG9wdGlvbnMucG9pbnRQcm9wcztcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gb3B0aW9ucy5wb2x5bGluZVByb3BzO1xuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMgfHwgIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gbGFiZWxzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhYmVsLnBvc2l0aW9uID0gdGhpcy5fcmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExhYmVsUHJvcHMsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBwb2x5bGluZVByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2x5bGluZVByb3BzO1xuICB9XG5cbiAgc2V0IHBvbHlsaW5lUHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcG9pbnRQcm9wcygpOiBQb2ludFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBwb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNpcmNsZVByb3BzKCk6IEVsbGlwc2VQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2NpcmNsZVByb3BzO1xuICB9XG5cbiAgc2V0IGNpcmNsZVByb3BzKHZhbHVlOiBFbGxpcHNlUHJvcHMpIHtcbiAgICB0aGlzLl9jaXJjbGVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gIH1cblxuICBnZXQgcmFkaXVzUG9pbnQoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5fcmFkaXVzUG9pbnQ7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMuX2NlbnRlci5zaG93ID0gdmFsdWU7XG4gICAgdGhpcy5fcmFkaXVzUG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KFxuICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICByYWRpdXNQb2ludDogQ2FydGVzaWFuMyxcbiAgICBjZW50ZXJQb2ludFByb3AgPSB0aGlzLnBvaW50UHJvcHMsXG4gICAgcmFkaXVzUG9pbnRQcm9wID0gdGhpcy5wb2ludFByb3BzLFxuICAgIGNpcmNsZVByb3AgPSB0aGlzLmNpcmNsZVByb3BzLFxuICApIHtcbiAgICBpZiAoIXRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5fY2VudGVyID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBjZW50ZXIsIGNlbnRlclBvaW50UHJvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NlbnRlci5zZXRQb3NpdGlvbihjZW50ZXIpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMuX3JhZGl1c1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCByYWRpdXNQb2ludCwgcmFkaXVzUG9pbnRQcm9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmFkaXVzUG9pbnQuc2V0UG9zaXRpb24ocmFkaXVzUG9pbnQpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgdGhpcy5jcmVhdGVPdXRsaW5lQXJjKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX291dGxpbmVBcmMucmFkaXVzID0gdGhpcy5nZXRSYWRpdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNpcmNsZVByb3BzID0gY2lyY2xlUHJvcDtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgfVxuXG4gIGFkZFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMucG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLl9yYWRpdXNQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5wb2ludFByb3BzKTtcbiAgICAgIGlmICghdGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmVBcmMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUFyY3NMYXllcigpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uIHx8ICF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmFkaXVzUG9pbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9yYWRpdXNQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICB0aGlzLl9vdXRsaW5lQXJjLnJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG5cbiAgICB0aGlzLnVwZGF0ZUFyY3NMYXllcigpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZUNpcmNsZShkcmFnU3RhcnRQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ0VuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdTdGFydFBvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG4gICAgY29uc3QgZGVsdGEgPSBHZW9VdGlsc1NlcnZpY2UuZ2V0UG9zaXRpb25zRGVsdGEodGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24sIGRyYWdFbmRQb3NpdGlvbik7XG4gICAgR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbih0aGlzLmdldENlbnRlcigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgdGhpcy5yYWRpdXNQb2ludC5zZXRQb3NpdGlvbihHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuZ2V0Q2VudGVyKCksIHJhZGl1cywgTWF0aC5QSSAvIDIsIHRydWUpKTtcbiAgICB0aGlzLl9vdXRsaW5lQXJjLnJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdFbmRQb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVQb2x5Z29uKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0UmFkaXVzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIEdlb1V0aWxzU2VydmljZS5kaXN0YW5jZSh0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSwgdGhpcy5fcmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRSYWRpdXMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0Q2VudGVyKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXIgPyB0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldENlbnRlckNhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldENlbnRlci5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRSYWRpdXNQb2ludCgpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fcmFkaXVzUG9pbnQgPyB0aGlzLl9yYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9yYWRpdXNQb2ludC5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgdGhpcy5hcmNzTGF5ZXIucmVtb3ZlKHRoaXMuX291dGxpbmVBcmMuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaXJjbGVzTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNpcmNsZXNMYXllcigpIHtcbiAgICB0aGlzLmNpcmNsZXNMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKCkge1xuICAgIGlmICh0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX2NlbnRlciwgdGhpcy5fY2VudGVyLmdldElkKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX3JhZGl1c1BvaW50LCB0aGlzLl9yYWRpdXNQb2ludC5nZXRJZCgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyY3NMYXllcigpIHtcbiAgICBpZiAoIXRoaXMuX291dGxpbmVBcmMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hcmNzTGF5ZXIudXBkYXRlKHRoaXMuX291dGxpbmVBcmMsIHRoaXMuX291dGxpbmVBcmMuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU91dGxpbmVBcmMoKSB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX291dGxpbmVBcmMgPSBuZXcgRWRpdEFyYyh0aGlzLmlkLCB0aGlzLmdldENlbnRlcigpLCB0aGlzLmdldFJhZGl1cygpLCBNYXRoLlBJICogMiwgMCwgdGhpcy5wb2x5bGluZVByb3BzKTtcbiAgfVxufVxuIl19