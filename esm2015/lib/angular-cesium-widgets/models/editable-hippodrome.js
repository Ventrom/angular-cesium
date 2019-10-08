/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
export class EditableHippodrome extends AcEntity {
    /**
     * @param {?} id
     * @param {?} pointsLayer
     * @param {?} hippodromeLayer
     * @param {?} coordinateConverter
     * @param {?} editOptions
     * @param {?=} positions
     */
    constructor(id, pointsLayer, hippodromeLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.hippodromeLayer = hippodromeLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = editOptions.pointProps;
        this.hippodromeProps = editOptions.hippodromeProps;
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
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
        if (!labels) {
            return;
        }
        /** @type {?} */
        const positions = this.getRealPositions();
        this._labels = labels.map((/**
         * @param {?} label
         * @param {?} index
         * @return {?}
         */
        (label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        }));
    }
    /**
     * @return {?}
     */
    get hippodromeProps() {
        return this._hippodromeProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hippodromeProps(value) {
        this._hippodromeProps = value;
    }
    /**
     * @return {?}
     */
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set defaultPointProps(value) {
        this._defaultPointProps = value;
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
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            point.show = value;
            this.updatePointsLayer(point);
        }));
    }
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    createFromExisting(positions) {
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        position => {
            this.addPointFromExisting(position);
        }));
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.remove(p.getId())));
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer(...points);
        this.updateHippdromeLayer();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.done) {
            return;
        }
        /** @type {?} */
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    /**
     * @private
     * @return {?}
     */
    createHeightEditPoints() {
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint())).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
        /** @type {?} */
        const firstP = this.getRealPoints()[0];
        /** @type {?} */
        const secP = this.getRealPoints()[1];
        /** @type {?} */
        const midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        const bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        /** @type {?} */
        const upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        /** @type {?} */
        const downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    }
    /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    createMiddleEditablePoint(midPointCartesian3, azimuth) {
        /** @type {?} */
        const upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        /** @type {?} */
        const midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    }
    /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    changeWidthByNewPoint(toPosition) {
        /** @type {?} */
        const firstP = this.getRealPoints()[0];
        /** @type {?} */
        const secP = this.getRealPoints()[1];
        /** @type {?} */
        const midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        const bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        /** @type {?} */
        let normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        /** @type {?} */
        let bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        /** @type {?} */
        let fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        /** @type {?} */
        const distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        /** @type {?} */
        const radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
    }
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    }
    /**
     * @return {?}
     */
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => this.updatePointsLayer(point)));
        this.updateHippdromeLayer();
    }
    /**
     * @return {?}
     */
    endMovePoint() {
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
    }
    /**
     * @param {?} toPosition
     * @return {?}
     */
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint())).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    /**
     * @return {?}
     */
    getRealPositions() {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getRealPositionsCallbackProperty() {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    }
    /**
     * @return {?}
     */
    getRealPoints() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint()));
    }
    /**
     * @return {?}
     */
    getWidth() {
        return this.hippodromeProps.width;
    }
    /**
     * @return {?}
     */
    getPositions() {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    removePosition(point) {
        /** @type {?} */
        const index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        p => p === point));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    /**
     * @private
     * @param {...?} point
     * @return {?}
     */
    updatePointsLayer(...point) {
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @private
     * @return {?}
     */
    updateHippdromeLayer() {
        this.hippodromeLayer.update(this, this.id);
    }
    /**
     * @return {?}
     */
    dispose() {
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    /**
     * @return {?}
     */
    getPointsCount() {
        return this.positions.length;
    }
    /**
     * @return {?}
     */
    getId() {
        return this.id;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.positions;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.movingPoint;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.done;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype._defaultPointProps;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype._hippodromeProps;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.hippodromeLayer;
    /**
     * @type {?}
     * @private
     */
    EditableHippodrome.prototype.coordinateConverter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtaGlwcG9kcm9tZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWhpcHBvZHJvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBTXpDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUM1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFOUQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFFBQVE7Ozs7Ozs7OztJQVU5QyxZQUNVLEVBQVUsRUFDVixXQUE2QixFQUM3QixlQUFpQyxFQUNqQyxtQkFBd0MsRUFDaEQsV0FBa0MsRUFDbEMsU0FBd0I7UUFFeEIsS0FBSyxFQUFFLENBQUM7UUFQQSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG9CQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNqQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBYjFDLGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLFNBQUksR0FBRyxLQUFLLENBQUM7UUFDYixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVdqQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUM7UUFDbkQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FB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ICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4vZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsIEhpcHBvZHJvbWVQcm9wcyB9IGZyb20gJy4vaGlwcG9kcm9tZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZUhpcHBvZHJvbWUgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIG1vdmluZ1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgZG9uZSA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfZGVmYXVsdFBvaW50UHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX2hpcHBvZHJvbWVQcm9wczogSGlwcG9kcm9tZVByb3BzO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBwb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIGhpcHBvZHJvbWVMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgZWRpdE9wdGlvbnM6IEhpcHBvZHJvbWVFZGl0T3B0aW9ucyxcbiAgICBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10sXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyA9IGVkaXRPcHRpb25zLnBvaW50UHJvcHM7XG4gICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMgPSBlZGl0T3B0aW9ucy5oaXBwb2Ryb21lUHJvcHM7XG4gICAgaWYgKHBvc2l0aW9ucyAmJiBwb3NpdGlvbnMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb25zKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hpcHBvZHJvbWUgY29uc2lzdCBvZiAyIHBvaW50cyBidXQgcHJvdmlkZWQgJyArIHBvc2l0aW9ucy5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uc1tpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGhpcHBvZHJvbWVQcm9wcygpOiBIaXBwb2Ryb21lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9oaXBwb2Ryb21lUHJvcHM7XG4gIH1cblxuICBzZXQgaGlwcG9kcm9tZVByb3BzKHZhbHVlOiBIaXBwb2Ryb21lUHJvcHMpIHtcbiAgICB0aGlzLl9oaXBwb2Ryb21lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0UG9pbnRQcm9wcygpOiBQb2ludFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFBvaW50UHJvcHM7XG4gIH1cblxuICBzZXQgZGVmYXVsdFBvaW50UHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGVuYWJsZUVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZUVkaXQ7XG4gIH1cblxuICBzZXQgZW5hYmxlRWRpdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZUVkaXQgPSB2YWx1ZTtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIHBvaW50LnNob3cgPSB2YWx1ZTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIocG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaChwb3NpdGlvbiA9PiB7XG4gICAgICB0aGlzLmFkZFBvaW50RnJvbUV4aXN0aW5nKHBvc2l0aW9uKTtcbiAgICB9KTtcbiAgICB0aGlzLmNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgfVxuXG4gIHNldFBvaW50c01hbnVhbGx5KHBvaW50czogRWRpdFBvaW50W10sIHdpZHRoTWV0ZXJzPzogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLmRvbmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXBkYXRlIG1hbnVhbGx5IG9ubHkgaW4gZWRpdCBtb2RlLCBhZnRlciBwb2x5bGluZSBpcyBjcmVhdGVkJyk7XG4gICAgfVxuICAgIHRoaXMuaGlwcG9kcm9tZVByb3BzLndpZHRoID0gd2lkdGhNZXRlcnMgPyB3aWR0aE1ldGVycyA6IHRoaXMuaGlwcG9kcm9tZVByb3BzLndpZHRoO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwLmdldElkKCkpKTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IHBvaW50cztcbiAgICB0aGlzLmNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnBvaW50cyk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICB9XG5cbiAgYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobmV3UG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIobmV3UG9pbnQpO1xuICB9XG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9ICF0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgaWYgKGlzRmlyc3RQb2ludCkge1xuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChmaXJzdFBvaW50KTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaCh0aGlzLm1vdmluZ1BvaW50KTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmlyc3RQb2ludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICAgIHRoaXMudXBkYXRlSGlwcGRyb21lTGF5ZXIoKTtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKSB7XG4gICAgdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkuZm9yRWFjaChwID0+IHRoaXMucmVtb3ZlUG9zaXRpb24ocCkpO1xuXG4gICAgY29uc3QgZmlyc3RQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMF07XG4gICAgY29uc3Qgc2VjUCA9IHRoaXMuZ2V0UmVhbFBvaW50cygpWzFdO1xuXG4gICAgY29uc3QgbWlkUG9pbnRDYXJ0ZXNpYW4zID0gQ2VzaXVtLkNhcnRlc2lhbjMubGVycChmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpLCAwLjUsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKTtcbiAgICBjb25zdCBiZWFyaW5nRGVnID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpKTtcblxuICAgIGNvbnN0IHVwQXppbXV0aCA9IENlc2l1bS5NYXRoLnRvUmFkaWFucyhiZWFyaW5nRGVnKSAtIE1hdGguUEkgLyAyO1xuICAgIHRoaXMuY3JlYXRlTWlkZGxlRWRpdGFibGVQb2ludChtaWRQb2ludENhcnRlc2lhbjMsIHVwQXppbXV0aCk7XG4gICAgY29uc3QgZG93bkF6aW11dGggPSBDZXNpdW0uTWF0aC50b1JhZGlhbnMoYmVhcmluZ0RlZykgKyBNYXRoLlBJIC8gMjtcbiAgICB0aGlzLmNyZWF0ZU1pZGRsZUVkaXRhYmxlUG9pbnQobWlkUG9pbnRDYXJ0ZXNpYW4zLCBkb3duQXppbXV0aCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU1pZGRsZUVkaXRhYmxlUG9pbnQobWlkUG9pbnRDYXJ0ZXNpYW4zOiBhbnksIGF6aW11dGg6IG51bWJlcikge1xuICAgIGNvbnN0IHVwRWRpdENhcnRlc2lhbjMgPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKFxuICAgICAgbWlkUG9pbnRDYXJ0ZXNpYW4zLFxuICAgICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGggLyAyLFxuICAgICAgYXppbXV0aCxcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgICBjb25zdCBtaWRQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgdXBFZGl0Q2FydGVzaWFuMywgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgbWlkUG9pbnQuc2V0VmlydHVhbEVkaXRQb2ludCh0cnVlKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKG1pZFBvaW50KTtcbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGlmICghZWRpdFBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpKSB7XG4gICAgICBlZGl0UG9pbnQuc2V0UG9zaXRpb24odG9Qb3NpdGlvbik7XG4gICAgICB0aGlzLmNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoYW5nZVdpZHRoQnlOZXdQb2ludCh0b1Bvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoYW5nZVdpZHRoQnlOZXdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgY29uc3QgZmlyc3RQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMF07XG4gICAgY29uc3Qgc2VjUCA9IHRoaXMuZ2V0UmVhbFBvaW50cygpWzFdO1xuICAgIGNvbnN0IG1pZFBvaW50Q2FydGVzaWFuMyA9IENlc2l1bS5DYXJ0ZXNpYW4zLmxlcnAoZmlyc3RQLmdldFBvc2l0aW9uKCksIHNlY1AuZ2V0UG9zaXRpb24oKSwgMC41LCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSk7XG5cbiAgICBjb25zdCBiZWFyaW5nRGVnID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihtaWRQb2ludENhcnRlc2lhbjMsIHRvUG9zaXRpb24pO1xuICAgIGxldCBub3JtYWxpemVkQmVhcmluZ0RlYiA9IGJlYXJpbmdEZWc7XG4gICAgaWYgKGJlYXJpbmdEZWcgPiAyNzApIHtcbiAgICAgIG5vcm1hbGl6ZWRCZWFyaW5nRGViID0gYmVhcmluZ0RlZyAtIDI3MDtcbiAgICB9IGVsc2UgaWYgKGJlYXJpbmdEZWcgPiAxODApIHtcbiAgICAgIG5vcm1hbGl6ZWRCZWFyaW5nRGViID0gYmVhcmluZ0RlZyAtIDE4MDtcbiAgICB9XG4gICAgbGV0IGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5iZWFyaW5nVG9DYXJ0ZXNpYW4oZmlyc3RQLmdldFBvc2l0aW9uKCksIHNlY1AuZ2V0UG9zaXRpb24oKSk7XG4gICAgaWYgKGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cyA+IDE4MCkge1xuICAgICAgYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihzZWNQLmdldFBvc2l0aW9uKCksIGZpcnN0UC5nZXRQb3NpdGlvbigpKTtcbiAgICB9XG4gICAgbGV0IGZpeGVkQmVhcmluZ0RlZyA9XG4gICAgICBiZWFyaW5nRGVnSGlwcG9kcm9tZURvdHMgPiBub3JtYWxpemVkQmVhcmluZ0RlYlxuICAgICAgICA/IGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cyAtIG5vcm1hbGl6ZWRCZWFyaW5nRGViXG4gICAgICAgIDogbm9ybWFsaXplZEJlYXJpbmdEZWIgLSBiZWFyaW5nRGVnSGlwcG9kcm9tZURvdHM7XG5cbiAgICBpZiAoYmVhcmluZ0RlZyA+IDI3MCkge1xuICAgICAgZml4ZWRCZWFyaW5nRGVnID0gYmVhcmluZ0RlZyAtIGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cztcbiAgICB9XG5cbiAgICBjb25zdCBkaXN0YW5jZU1ldGVycyA9IE1hdGguYWJzKEdlb1V0aWxzU2VydmljZS5kaXN0YW5jZShtaWRQb2ludENhcnRlc2lhbjMsIHRvUG9zaXRpb24pKTtcbiAgICBjb25zdCByYWRpdXNXaWR0aCA9IE1hdGguc2luKENlc2l1bS5NYXRoLnRvUmFkaWFucyhmaXhlZEJlYXJpbmdEZWcpKSAqIGRpc3RhbmNlTWV0ZXJzO1xuXG4gICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGggPSBNYXRoLmFicyhyYWRpdXNXaWR0aCkgKiAyO1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMudXBkYXRlSGlwcGRyb21lTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVTaGFwZShzdGFydE1vdmluZ1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBkcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWx0YSA9IEdlb1V0aWxzU2VydmljZS5nZXRQb3NpdGlvbnNEZWx0YSh0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiwgZHJhZ2dlZFRvUG9zaXRpb24pO1xuICAgIHRoaXMuZ2V0UmVhbFBvaW50cygpLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbihwb2ludC5nZXRQb3NpdGlvbigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ2dlZFRvUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlU2hhcGUoKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHBvaW50KSk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICB9XG5cbiAgZW5kTW92ZVBvaW50KCkge1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICB9XG5cbiAgbW92ZVRlbXBNb3ZpbmdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMubW92ZVBvaW50KHRvUG9zaXRpb24sIHRoaXMubW92aW5nUG9pbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVBvaW50KHBvaW50VG9SZW1vdmU6IEVkaXRQb2ludCkge1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24ocG9pbnRUb1JlbW92ZSk7XG4gICAgdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkuZm9yRWFjaChwID0+IHRoaXMucmVtb3ZlUG9zaXRpb24ocCkpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9uc0NhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldFJlYWxQb3NpdGlvbnMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0UmVhbFBvaW50cygpOiBFZGl0UG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkpO1xuICB9XG5cbiAgZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGg7XG4gIH1cblxuICBnZXRQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgocCA9PiBwID09PSBwb2ludCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHNMYXllciguLi5wb2ludDogRWRpdFBvaW50W10pIHtcbiAgICBwb2ludC5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUhpcHBkcm9tZUxheWVyKCkge1xuICAgIHRoaXMuaGlwcG9kcm9tZUxheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuXG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChlZGl0UG9pbnQgPT4ge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUoZWRpdFBvaW50LmdldElkKCkpO1xuICAgIH0pO1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLm1vdmluZ1BvaW50LmdldElkKCkpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGdldFBvaW50c0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=