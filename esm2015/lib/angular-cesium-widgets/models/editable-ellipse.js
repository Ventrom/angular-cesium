/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
export class EditableEllipse extends AcEntity {
    /**
     * @param {?} id
     * @param {?} ellipsesLayer
     * @param {?} pointsLayer
     * @param {?} coordinateConverter
     * @param {?} options
     */
    constructor(id, ellipsesLayer, pointsLayer, coordinateConverter, options) {
        super();
        this.id = id;
        this.ellipsesLayer = ellipsesLayer;
        this.pointsLayer = pointsLayer;
        this.coordinateConverter = coordinateConverter;
        this.options = options;
        this._rotation = 0;
        this.doneCreation = false;
        this._enableEdit = true;
        this._minorRadiusPoints = [];
        this._labels = [];
        this._ellipseProps = options.ellipseProps;
        this._pointProps = options.pointProps;
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
        if (!labels || !this._center) {
            return;
        }
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                if (index === 0) {
                    label.position = this._center.getPosition();
                }
                else if (index === 1) {
                    label.position = this._majorRadiusPoint
                        ? Cesium.Cartesian3.midpoint(this.getCenter(), this._majorRadiusPoint.getPosition(), new Cesium.Cartesian3())
                        : new Cesium.Cartesian3();
                }
                else if (index === 2) {
                    label.position =
                        this._minorRadiusPoints.length > 0 && this._minorRadius
                            ? Cesium.Cartesian3.midpoint(this.getCenter(), this.getMinorRadiusPointPosition(), new Cesium.Cartesian3())
                            : new Cesium.Cartesian3();
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
    get ellipseProps() {
        return this._ellipseProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set ellipseProps(value) {
        this._ellipseProps = value;
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
    get majorRadiusPoint() {
        return this._majorRadiusPoint;
    }
    /**
     * @return {?}
     */
    getMajorRadiusPointPosition() {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    }
    /**
     * @return {?}
     */
    getMinorRadiusPointPosition() {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
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
        this._majorRadiusPoint.show = value;
        this.updatePointsLayer();
    }
    /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} ellipseProp
     * @return {?}
     */
    setManually(center, majorRadius, rotation = Math.PI / 2, minorRadius, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, ellipseProp = this.ellipseProps) {
        if (majorRadius < minorRadius) {
            throw new Error('Major radius muse be equal or greater than minor radius');
        }
        this._rotation = rotation;
        this._majorRadius = majorRadius;
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        /** @type {?} */
        const majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);
        if (!this._majorRadiusPoint) {
            this._majorRadiusPoint = new EditPoint(this.id, majorRadiusPosition, radiusPointProp);
        }
        else {
            this._majorRadiusPoint.setPosition(majorRadiusPosition);
        }
        if (minorRadius) {
            this._minorRadius = minorRadius;
        }
        this.ellipseProps = ellipseProp;
        this.doneCreation = true;
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
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
            this._majorRadiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            this._majorRadius = 0;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    /**
     * @return {?}
     */
    transformToEllipse() {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
        this._majorRadiusPoint.setPosition(position);
        this._majorRadius = newRadius;
        this.doneCreation = true;
        if (!this.options.circleToEllipseTransformation) {
            this._minorRadius = this._majorRadius;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
        if (this.majorRadiusPoint === editPoint) {
            if (newRadius < this._minorRadius) {
                this._majorRadius = this._minorRadius;
                this._majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), this._minorRadius, this._rotation));
            }
            else {
                this.majorRadiusPoint.setPosition(toPosition);
                this._majorRadius = newRadius;
            }
        }
        else {
            if (newRadius > this._majorRadius) {
                this._minorRadius = this._majorRadius;
            }
            else {
                this._minorRadius = newRadius;
            }
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    moveEllipse(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        const majorRadius = this.getMajorRadius();
        /** @type {?} */
        const rotation = this.getRotation();
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    /**
     * @return {?}
     */
    endMoveEllipse() {
        this.lastDraggedToPosition = undefined;
    }
    /**
     * @private
     * @return {?}
     */
    updateMinorRadiusEditPoints() {
        if (this._minorRadius === undefined) {
            return;
        }
        if (this._minorRadiusPoints.length === 0) {
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
        }
        this._minorRadiusPoints[0].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2));
        this._minorRadiusPoints[1].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2));
    }
    /**
     * @return {?}
     */
    getMajorRadius() {
        return this._majorRadius || 0;
    }
    /**
     * @return {?}
     */
    getMinorRadius() {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    }
    /**
     * @return {?}
     */
    getRotation() {
        return this._rotation || 0;
    }
    /**
     * @return {?}
     */
    updateRotation() {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        /** @type {?} */
        const azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    }
    /**
     * @return {?}
     */
    getRotationCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => Math.PI / 2 - this.getRotation()), false);
    }
    /**
     * @return {?}
     */
    getMinorRadiusCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getMinorRadius()), false);
    }
    /**
     * @return {?}
     */
    getMajorRadiusCallbackProperty() {
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getMajorRadius()), false);
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
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        () => this.getCenter()), false);
    }
    /**
     * @return {?}
     */
    dispose() {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.remove(this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints) {
            this._minorRadiusPoints.forEach((/**
             * @param {?} point
             * @return {?}
             */
            point => this.pointsLayer.remove(point.getId())));
        }
        this.ellipsesLayer.remove(this.id);
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
    updateEllipsesLayer() {
        this.ellipsesLayer.update(this, this.id);
    }
    /**
     * @private
     * @return {?}
     */
    updatePointsLayer() {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.update(this._majorRadiusPoint, this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints.length > 0) {
            this.pointsLayer.update(this._minorRadiusPoints[0], this._minorRadiusPoints[0].getId());
            this.pointsLayer.update(this._minorRadiusPoints[1], this._minorRadiusPoints[1].getId());
        }
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._center;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._majorRadiusPoint;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._majorRadius;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._minorRadius;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._rotation;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.doneCreation;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._minorRadiusPoints;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._ellipseProps;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._pointProps;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._polylineProps;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.ellipsesLayer;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    EditableEllipse.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtZWxsaXBzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWVsbGlwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBR3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUc1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFHOUQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsUUFBUTs7Ozs7Ozs7SUFlM0MsWUFDVSxFQUFVLEVBQ1YsYUFBK0IsRUFDL0IsV0FBNkIsRUFDN0IsbUJBQXdDLEVBQ3hDLE9BQTJCO1FBRW5DLEtBQUssRUFBRSxDQUFDO1FBTkEsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUMvQixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxZQUFPLEdBQVAsT0FBTyxDQUFvQjtRQWY3QixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsdUJBQWtCLEdBQWdCLEVBQUUsQ0FBQztRQUtyQyxZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVVqQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0lBQ3hDLENBQUM7Ozs7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FB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QUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUN6RjtJQUNILENBQUM7Q0FDRjs7Ozs7O0lBaldDLGtDQUEyQjs7Ozs7SUFDM0IsNENBQXFDOzs7OztJQUNyQyx1Q0FBNkI7Ozs7O0lBQzdCLHVDQUE2Qjs7Ozs7SUFDN0Isb0NBQXNCOzs7OztJQUN0Qix1Q0FBNkI7Ozs7O0lBQzdCLHNDQUEyQjs7Ozs7SUFDM0IsNkNBQTZDOzs7OztJQUM3QyxnREFBbUM7Ozs7O0lBQ25DLHdDQUFvQzs7Ozs7SUFDcEMsc0NBQWdDOzs7OztJQUNoQyx5Q0FBc0M7Ozs7O0lBQ3RDLGtDQUFtQzs7Ozs7SUFHakMsNkJBQWtCOzs7OztJQUNsQix3Q0FBdUM7Ozs7O0lBQ3ZDLHNDQUFxQzs7Ozs7SUFDckMsOENBQWdEOzs7OztJQUNoRCxrQ0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucywgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzLCBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlRWxsaXBzZSBleHRlbmRzIEFjRW50aXR5IHtcbiAgcHJpdmF0ZSBfY2VudGVyOiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX21ham9yUmFkaXVzUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBfbWFqb3JSYWRpdXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBfbWlub3JSYWRpdXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcm90YXRpb24gPSAwO1xuICBwcml2YXRlIGRvbmVDcmVhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfbWlub3JSYWRpdXNQb2ludHM6IEVkaXRQb2ludFtdID0gW107XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2VsbGlwc2VQcm9wczogRWxsaXBzZVByb3BzO1xuICBwcml2YXRlIF9wb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9wb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaWQ6IHN0cmluZyxcbiAgICBwcml2YXRlIGVsbGlwc2VzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBwb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBFbGxpcHNlRWRpdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZWxsaXBzZVByb3BzID0gb3B0aW9ucy5lbGxpcHNlUHJvcHM7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IG9wdGlvbnMucG9pbnRQcm9wcztcbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzIHx8ICF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIGxhYmVsLnBvc2l0aW9uID0gdGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHRoaXMuX21ham9yUmFkaXVzUG9pbnRcbiAgICAgICAgICAgID8gQ2VzaXVtLkNhcnRlc2lhbjMubWlkcG9pbnQodGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpLCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSlcbiAgICAgICAgICAgIDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IDIpIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9XG4gICAgICAgICAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50cy5sZW5ndGggPiAwICYmIHRoaXMuX21pbm9yUmFkaXVzXG4gICAgICAgICAgICAgID8gQ2VzaXVtLkNhcnRlc2lhbjMubWlkcG9pbnQodGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5nZXRNaW5vclJhZGl1c1BvaW50UG9zaXRpb24oKSwgbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCkpXG4gICAgICAgICAgICAgIDogbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcG9seWxpbmVQcm9wcygpOiBQb2x5bGluZVByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIHNldCBwb2x5bGluZVByb3BzKHZhbHVlOiBQb2x5bGluZVByb3BzKSB7XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBvaW50UHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvaW50UHJvcHM7XG4gIH1cblxuICBzZXQgcG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbGxpcHNlUHJvcHMoKTogRWxsaXBzZVByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fZWxsaXBzZVByb3BzO1xuICB9XG5cbiAgc2V0IGVsbGlwc2VQcm9wcyh2YWx1ZTogRWxsaXBzZVByb3BzKSB7XG4gICAgdGhpcy5fZWxsaXBzZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY2VudGVyKCk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuX2NlbnRlcjtcbiAgfVxuXG4gIGdldCBtYWpvclJhZGl1c1BvaW50KCk6IEVkaXRQb2ludCB7XG4gICAgcmV0dXJuIHRoaXMuX21ham9yUmFkaXVzUG9pbnQ7XG4gIH1cblxuICBnZXRNYWpvclJhZGl1c1BvaW50UG9zaXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9tYWpvclJhZGl1c1BvaW50LmdldFBvc2l0aW9uKCk7XG4gIH1cblxuICBnZXRNaW5vclJhZGl1c1BvaW50UG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzBdLmdldFBvc2l0aW9uKCk7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMuX2NlbnRlci5zaG93ID0gdmFsdWU7XG4gICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5zaG93ID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICB9XG5cbiAgc2V0TWFudWFsbHkoXG4gICAgY2VudGVyOiBDYXJ0ZXNpYW4zLFxuICAgIG1ham9yUmFkaXVzOiBudW1iZXIsXG4gICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMixcbiAgICBtaW5vclJhZGl1cz86IG51bWJlcixcbiAgICBjZW50ZXJQb2ludFByb3AgPSB0aGlzLnBvaW50UHJvcHMsXG4gICAgcmFkaXVzUG9pbnRQcm9wID0gdGhpcy5wb2ludFByb3BzLFxuICAgIGVsbGlwc2VQcm9wID0gdGhpcy5lbGxpcHNlUHJvcHMsXG4gICkge1xuICAgIGlmIChtYWpvclJhZGl1cyA8IG1pbm9yUmFkaXVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01ham9yIHJhZGl1cyBtdXNlIGJlIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiBtaW5vciByYWRpdXMnKTtcbiAgICB9XG4gICAgdGhpcy5fcm90YXRpb24gPSByb3RhdGlvbjtcbiAgICB0aGlzLl9tYWpvclJhZGl1cyA9IG1ham9yUmFkaXVzO1xuICAgIGlmICghdGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLl9jZW50ZXIgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIGNlbnRlciwgY2VudGVyUG9pbnRQcm9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2VudGVyLnNldFBvc2l0aW9uKGNlbnRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbWFqb3JSYWRpdXNQb3NpdGlvbiA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgodGhpcy5jZW50ZXIuZ2V0UG9zaXRpb24oKSwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uKTtcblxuICAgIGlmICghdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgbWFqb3JSYWRpdXNQb3NpdGlvbiwgcmFkaXVzUG9pbnRQcm9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5zZXRQb3NpdGlvbihtYWpvclJhZGl1c1Bvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAobWlub3JSYWRpdXMpIHtcbiAgICAgIHRoaXMuX21pbm9yUmFkaXVzID0gbWlub3JSYWRpdXM7XG4gICAgfVxuXG4gICAgdGhpcy5lbGxpcHNlUHJvcHMgPSBlbGxpcHNlUHJvcDtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gIH1cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLl9jZW50ZXIgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLnBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5wb2ludFByb3BzKTtcbiAgICAgIHRoaXMuX21ham9yUmFkaXVzID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gIH1cblxuICB0cmFuc2Zvcm1Ub0VsbGlwc2UoKSB7XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbWlub3JSYWRpdXMgPSB0aGlzLmdldE1ham9yUmFkaXVzKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gIH1cblxuICBhZGRMYXN0UG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24gfHwgIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1JhZGl1cyA9IEdlb1V0aWxzU2VydmljZS5kaXN0YW5jZSh0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSwgcG9zaXRpb24pO1xuICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMuX21ham9yUmFkaXVzID0gbmV3UmFkaXVzO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmNpcmNsZVRvRWxsaXBzZVRyYW5zZm9ybWF0aW9uKSB7XG4gICAgICB0aGlzLl9taW5vclJhZGl1cyA9IHRoaXMuX21ham9yUmFkaXVzO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUm90YXRpb24oKTtcbiAgICB0aGlzLnVwZGF0ZU1pbm9yUmFkaXVzRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGlmICghdGhpcy5fY2VudGVyIHx8ICF0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UmFkaXVzID0gR2VvVXRpbHNTZXJ2aWNlLmRpc3RhbmNlKHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpLCB0b1Bvc2l0aW9uKTtcbiAgICBpZiAodGhpcy5tYWpvclJhZGl1c1BvaW50ID09PSBlZGl0UG9pbnQpIHtcbiAgICAgIGlmIChuZXdSYWRpdXMgPCB0aGlzLl9taW5vclJhZGl1cykge1xuICAgICAgICB0aGlzLl9tYWpvclJhZGl1cyA9IHRoaXMuX21pbm9yUmFkaXVzO1xuICAgICAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50LnNldFBvc2l0aW9uKFxuICAgICAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgodGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5fbWlub3JSYWRpdXMsIHRoaXMuX3JvdGF0aW9uKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFqb3JSYWRpdXNQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fbWFqb3JSYWRpdXMgPSBuZXdSYWRpdXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdSYWRpdXMgPiB0aGlzLl9tYWpvclJhZGl1cykge1xuICAgICAgICB0aGlzLl9taW5vclJhZGl1cyA9IHRoaXMuX21ham9yUmFkaXVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbWlub3JSYWRpdXMgPSBuZXdSYWRpdXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVSb3RhdGlvbigpO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZUVsbGlwc2UoZHJhZ1N0YXJ0UG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdFbmRQb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnU3RhcnRQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBtYWpvclJhZGl1cyA9IHRoaXMuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICBjb25zdCByb3RhdGlvbiA9IHRoaXMuZ2V0Um90YXRpb24oKTtcbiAgICBjb25zdCBkZWx0YSA9IEdlb1V0aWxzU2VydmljZS5nZXRQb3NpdGlvbnNEZWx0YSh0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiwgZHJhZ0VuZFBvc2l0aW9uKTtcbiAgICBHZW9VdGlsc1NlcnZpY2UuYWRkRGVsdGFUb1Bvc2l0aW9uKHRoaXMuZ2V0Q2VudGVyKCksIGRlbHRhLCB0cnVlKTtcbiAgICB0aGlzLm1ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24oR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmdldENlbnRlcigpLCBtYWpvclJhZGl1cywgcm90YXRpb24pKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdFbmRQb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVFbGxpcHNlKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKSB7XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHMucHVzaChuZXcgRWRpdFBvaW50KHRoaXMuaWQsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpLCB0aGlzLnBvaW50UHJvcHMsIHRydWUpKTtcbiAgICAgIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLnB1c2gobmV3IEVkaXRQb2ludCh0aGlzLmlkLCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSwgdGhpcy5wb2ludFByb3BzLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMF0uc2V0UG9zaXRpb24oXG4gICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpLCB0aGlzLl9taW5vclJhZGl1cywgdGhpcy5nZXRSb3RhdGlvbigpIC0gTWF0aC5QSSAvIDIpLFxuICAgICk7XG5cbiAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50c1sxXS5zZXRQb3NpdGlvbihcbiAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgodGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCksIHRoaXMuX21pbm9yUmFkaXVzLCB0aGlzLmdldFJvdGF0aW9uKCkgKyBNYXRoLlBJIC8gMiksXG4gICAgKTtcbiAgfVxuXG4gIGdldE1ham9yUmFkaXVzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21ham9yUmFkaXVzIHx8IDA7XG4gIH1cblxuICBnZXRNaW5vclJhZGl1cygpIHtcbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX21pbm9yUmFkaXVzO1xuICAgIH1cbiAgfVxuXG4gIGdldFJvdGF0aW9uKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uIHx8IDA7XG4gIH1cblxuICB1cGRhdGVSb3RhdGlvbigpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgYXppbXV0aEluRGVncmVlcyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5iZWFyaW5nVG9DYXJ0ZXNpYW4odGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpKTtcbiAgICB0aGlzLl9yb3RhdGlvbiA9IENlc2l1bS5NYXRoLnRvUmFkaWFucyhhemltdXRoSW5EZWdyZWVzKTtcbiAgICByZXR1cm4gdGhpcy5fcm90YXRpb247XG4gIH1cblxuICBnZXRSb3RhdGlvbkNhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSgoKSA9PiBNYXRoLlBJIC8gMiAtIHRoaXMuZ2V0Um90YXRpb24oKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0TWlub3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gdGhpcy5nZXRNaW5vclJhZGl1cygpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRNYWpvclJhZGl1c0NhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSgoKSA9PiB0aGlzLmdldE1ham9yUmFkaXVzKCksIGZhbHNlKTtcbiAgfVxuXG4gIGdldENlbnRlcigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyID8gdGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRDZW50ZXJDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gdGhpcy5nZXRDZW50ZXIoKSwgZmFsc2UpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMuX21ham9yUmFkaXVzUG9pbnQuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzKSB7XG4gICAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsbGlwc2VzTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUVsbGlwc2VzTGF5ZXIoKSB7XG4gICAgdGhpcy5lbGxpcHNlc0xheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIoKSB7XG4gICAgaWYgKHRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fY2VudGVyLCB0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZSh0aGlzLl9tYWpvclJhZGl1c1BvaW50LCB0aGlzLl9tYWpvclJhZGl1c1BvaW50LmdldElkKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXNQb2ludHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMF0sIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzBdLmdldElkKCkpO1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMV0sIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzFdLmdldElkKCkpO1xuICAgIH1cbiAgfVxufVxuIl19