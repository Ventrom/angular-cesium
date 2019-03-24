/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
export class EditablePolyline extends AcEntity {
    /**
     * @param {?} id
     * @param {?} pointsLayer
     * @param {?} polylinesLayer
     * @param {?} coordinateConverter
     * @param {?} editOptions
     * @param {?=} positions
     */
    constructor(id, pointsLayer, polylinesLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.editOptions = editOptions;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._pointProps = editOptions.pointProps;
        this.props = editOptions.polylineProps;
        if (positions && positions.length >= 2) {
            this.createFromExisting(positions);
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
    get props() {
        return this.polylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set props(value) {
        this.polylineProps = value;
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
            this.updatePointsLayer(false, point);
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
        (position) => {
            this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    }
    /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    setManually(points, polylineProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.remove(p.getId())));
        /** @type {?} */
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            /** @type {?} */
            const pointOrCartesian = points[i];
            /** @type {?} */
            let newPoint = null;
            if (pointOrCartesian.pointProps) {
                newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
            }
            else {
                newPoint = new EditPoint(this.id, pointOrCartesian, this._pointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polylineProps = polylineProps ? polylineProps : this.polylineProps;
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
    }
    /**
     * @private
     * @return {?}
     */
    addAllVirtualEditPoints() {
        /** @type {?} */
        const currentPoints = [...this.positions];
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        (pos, index) => {
            if (index !== currentPoints.length - 1) {
                /** @type {?} */
                const currentPoint = pos;
                /** @type {?} */
                const nextIndex = (index + 1) % (currentPoints.length);
                /** @type {?} */
                const nextPoint = currentPoints[nextIndex];
                /** @type {?} */
                const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
                this.updatePointsLayer(false, midPoint);
            }
        }));
    }
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    setMiddleVirtualPoint(firstP, secondP) {
        /** @type {?} */
        const currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        const nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        const midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        const midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        const firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    }
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    updateMiddleVirtualPoint(virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        const prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        const nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    }
    /**
     * @param {?} point
     * @return {?}
     */
    changeVirtualPointToRealPoint(point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        // actual point becomes a real point
        /** @type {?} */
        const pointsCount = this.positions.length;
        /** @type {?} */
        const pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        const nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        const nextPoint = this.positions[nextIndex];
        /** @type {?} */
        const prePoint = this.positions[preIndex];
        /** @type {?} */
        const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    }
    /**
     * @private
     * @return {?}
     */
    renderPolylines() {
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        polyline => this.polylinesLayer.remove(polyline.getId())));
        this.polylines = [];
        /** @type {?} */
        const realPoints = this.positions.filter((/**
         * @param {?} point
         * @return {?}
         */
        point => !point.isVirtualEditPoint()));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        (point, index) => {
            if (index !== realPoints.length - 1) {
                /** @type {?} */
                const nextIndex = (index + 1);
                /** @type {?} */
                const nextPoint = realPoints[nextIndex];
                /** @type {?} */
                const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.polylineProps);
                this.polylines.push(polyline);
                this.polylinesLayer.update(polyline, polyline.getId());
            }
        }));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            const firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            const pointsCount = this.positions.length;
            /** @type {?} */
            const pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                /** @type {?} */
                const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                /** @type {?} */
                const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
                this.updatePointsLayer(false, nextVirtualPoint);
            }
            if (pointIndex > 0) {
                /** @type {?} */
                const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                /** @type {?} */
                const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
                this.updatePointsLayer(false, prevVirtualPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
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
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer(true, ...this.positions);
        this.lastDraggedToPosition = draggedToPosition;
    }
    /**
     * @return {?}
     */
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer(true, ...this.positions);
    }
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        p => p.isVirtualEditPoint()))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.removePosition(p)));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    }
    /**
     * @return {?}
     */
    getRealPositions() {
        return this.getRealPoints()
            .map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getRealPoints() {
        return this.positions
            .filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint() && position !== this.movingPoint));
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
        (p) => p === point));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    updatePointsLayer(renderPolylines = true, ...point) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @return {?}
     */
    update() {
        this.updatePointsLayer();
    }
    /**
     * @return {?}
     */
    dispose() {
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        line => this.polylinesLayer.remove(line.getId())));
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
    EditablePolyline.prototype.positions;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.polylines;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.movingPoint;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.doneCreation;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype._pointProps;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.polylineProps;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.polylinesLayer;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.coordinateConverter;
    /**
     * @type {?}
     * @private
     */
    EditablePolyline.prototype.editOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWxpbmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1wb2x5bGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUM1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFOUQsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFFBQVE7Ozs7Ozs7OztJQVk1QyxZQUFvQixFQUFVLEVBQ1YsV0FBNkIsRUFDN0IsY0FBZ0MsRUFDaEMsbUJBQXdDLEVBQ3hDLFdBQWdDLEVBQ3hDLFNBQXdCO1FBQ2xDLEtBQUssRUFBRSxDQUFDO1FBTlUsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixtQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFDaEMsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBcUI7UUFmNUMsY0FBUyxHQUFnQixFQUFFLENBQUM7UUFFNUIsY0FBUyxHQUFtQixFQUFFLENBQUM7UUFFL0IsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFJbkIsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFTakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUN2QyxJ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OztJQUNsQix1Q0FBcUM7Ozs7O0lBQ3JDLDBDQUF3Qzs7Ozs7SUFDeEMsK0NBQWdEOzs7OztJQUNoRCx1Q0FBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEVkaXRQb2x5bGluZSB9IGZyb20gJy4vZWRpdC1wb2x5bGluZSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBvaW50UHJvcHMsIFBvbHlsaW5lRWRpdE9wdGlvbnMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlUG9seWxpbmUgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuXG4gIHByaXZhdGUgcG9seWxpbmVzOiBFZGl0UG9seWxpbmVbXSA9IFtdO1xuICBwcml2YXRlIG1vdmluZ1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgZG9uZUNyZWF0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9wb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIHBvbHlsaW5lUHJvcHM6IFBvbHlsaW5lUHJvcHM7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIHBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgZWRpdE9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IGVkaXRPcHRpb25zLnBvaW50UHJvcHM7XG4gICAgdGhpcy5wcm9wcyA9IGVkaXRPcHRpb25zLnBvbHlsaW5lUHJvcHM7XG4gICAgaWYgKHBvc2l0aW9ucyAmJiBwb3NpdGlvbnMubGVuZ3RoID49IDIpIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9seWxpbmVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMucG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyh2YWx1ZTogUG9seWxpbmVQcm9wcykge1xuICAgIHRoaXMucG9seWxpbmVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBvaW50UHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvaW50UHJvcHM7XG4gIH1cblxuICBzZXQgcG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBwb2ludC5zaG93ID0gdmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBwb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSkge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgdGhpcy5hZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KHBvaW50czoge1xuICAgIHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLFxuICAgIHBvaW50UHJvcD86IFBvaW50UHJvcHNcbiAgfVtdIHwgQ2FydGVzaWFuM1tdLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykge1xuICAgIGlmICghdGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXBkYXRlIG1hbnVhbGx5IG9ubHkgaW4gZWRpdCBtb2RlLCBhZnRlciBwb2x5bGluZSBpcyBjcmVhdGVkJyk7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwLmdldElkKCkpKTtcblxuICAgIGNvbnN0IG5ld1BvaW50czogRWRpdFBvaW50W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9pbnRPckNhcnRlc2lhbjogYW55ID0gcG9pbnRzW2ldO1xuICAgICAgbGV0IG5ld1BvaW50ID0gbnVsbDtcbiAgICAgIGlmIChwb2ludE9yQ2FydGVzaWFuLnBvaW50UHJvcHMpIHtcbiAgICAgICAgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvaW50T3JDYXJ0ZXNpYW4ucG9zaXRpb24sIHBvaW50T3JDYXJ0ZXNpYW4ucG9pbnRQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9pbnRPckNhcnRlc2lhbiwgdGhpcy5fcG9pbnRQcm9wcyk7XG4gICAgICB9XG4gICAgICBuZXdQb2ludHMucHVzaChuZXdQb2ludCk7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zID0gbmV3UG9pbnRzO1xuICAgIHRoaXMucG9seWxpbmVQcm9wcyA9IHBvbHlsaW5lUHJvcHMgPyBwb2x5bGluZVByb3BzIDogdGhpcy5wb2x5bGluZVByb3BzO1xuXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCAuLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpIHtcbiAgICBjb25zdCBjdXJyZW50UG9pbnRzID0gWy4uLnRoaXMucG9zaXRpb25zXTtcbiAgICBjdXJyZW50UG9pbnRzLmZvckVhY2goKHBvcywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCAhPT0gY3VycmVudFBvaW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQb2ludCA9IHBvcztcbiAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGluZGV4ICsgMSkgJSAoY3VycmVudFBvaW50cy5sZW5ndGgpO1xuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSBjdXJyZW50UG9pbnRzW25leHRJbmRleF07XG5cbiAgICAgICAgY29uc3QgbWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChjdXJyZW50UG9pbnQsIG5leHRQb2ludCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgbWlkUG9pbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRNaWRkbGVWaXJ0dWFsUG9pbnQoZmlyc3RQOiBFZGl0UG9pbnQsIHNlY29uZFA6IEVkaXRQb2ludCk6IEVkaXRQb2ludCB7XG4gICAgY29uc3QgY3VycmVudENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oZmlyc3RQLmdldFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IG5leHRDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHNlY29uZFAuZ2V0UG9zaXRpb24oKSk7XG4gICAgY29uc3QgbWlkUG9pbnRDYXJ0ZXNpYW4zID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLm1pZFBvaW50VG9DYXJ0ZXNpYW4zKGN1cnJlbnRDYXJ0LCBuZXh0Q2FydCk7XG4gICAgY29uc3QgbWlkUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIG1pZFBvaW50Q2FydGVzaWFuMywgdGhpcy5fcG9pbnRQcm9wcyk7XG4gICAgbWlkUG9pbnQuc2V0VmlydHVhbEVkaXRQb2ludCh0cnVlKTtcblxuICAgIGNvbnN0IGZpcnN0SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKGZpcnN0UCk7XG4gICAgdGhpcy5wb3NpdGlvbnMuc3BsaWNlKGZpcnN0SW5kZXggKyAxLCAwLCBtaWRQb2ludCk7XG4gICAgcmV0dXJuIG1pZFBvaW50O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNaWRkbGVWaXJ0dWFsUG9pbnQodmlydHVhbEVkaXRQb2ludDogRWRpdFBvaW50LCBwcmV2UG9pbnQ6IEVkaXRQb2ludCwgbmV4dFBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBjb25zdCBwcmV2UG9pbnRDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHByZXZQb2ludC5nZXRQb3NpdGlvbigpKTtcbiAgICBjb25zdCBuZXh0UG9pbnRDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKG5leHRQb2ludC5nZXRQb3NpdGlvbigpKTtcbiAgICB2aXJ0dWFsRWRpdFBvaW50LnNldFBvc2l0aW9uKHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5taWRQb2ludFRvQ2FydGVzaWFuMyhwcmV2UG9pbnRDYXJ0LCBuZXh0UG9pbnRDYXJ0KSk7XG4gIH1cblxuICBjaGFuZ2VWaXJ0dWFsUG9pbnRUb1JlYWxQb2ludChwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcG9pbnQuc2V0VmlydHVhbEVkaXRQb2ludChmYWxzZSk7IC8vIGFjdHVhbCBwb2ludCBiZWNvbWVzIGEgcmVhbCBwb2ludFxuICAgIGNvbnN0IHBvaW50c0NvdW50ID0gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICAgIGNvbnN0IHBvaW50SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKHBvaW50KTtcbiAgICBjb25zdCBuZXh0SW5kZXggPSAocG9pbnRJbmRleCArIDEpICUgKHBvaW50c0NvdW50KTtcbiAgICBjb25zdCBwcmVJbmRleCA9ICgocG9pbnRJbmRleCAtIDEpICsgcG9pbnRzQ291bnQpICUgcG9pbnRzQ291bnQ7XG5cbiAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLnBvc2l0aW9uc1tuZXh0SW5kZXhdO1xuICAgIGNvbnN0IHByZVBvaW50ID0gdGhpcy5wb3NpdGlvbnNbcHJlSW5kZXhdO1xuXG4gICAgY29uc3QgZmlyc3RNaWRQb2ludCA9IHRoaXMuc2V0TWlkZGxlVmlydHVhbFBvaW50KHByZVBvaW50LCBwb2ludCk7XG4gICAgY29uc3Qgc2VjTWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChwb2ludCwgbmV4dFBvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBmaXJzdE1pZFBvaW50LCBzZWNNaWRQb2ludCwgcG9pbnQpO1xuXG4gIH1cblxuICBwcml2YXRlIHJlbmRlclBvbHlsaW5lcygpIHtcbiAgICB0aGlzLnBvbHlsaW5lcy5mb3JFYWNoKHBvbHlsaW5lID0+IHRoaXMucG9seWxpbmVzTGF5ZXIucmVtb3ZlKHBvbHlsaW5lLmdldElkKCkpKTtcbiAgICB0aGlzLnBvbHlsaW5lcyA9IFtdO1xuICAgIGNvbnN0IHJlYWxQb2ludHMgPSB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocG9pbnQgPT4gIXBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpKTtcbiAgICByZWFsUG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICE9PSByZWFsUG9pbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGluZGV4ICsgMSk7XG4gICAgICAgIGNvbnN0IG5leHRQb2ludCA9IHJlYWxQb2ludHNbbmV4dEluZGV4XTtcbiAgICAgICAgY29uc3QgcG9seWxpbmUgPSBuZXcgRWRpdFBvbHlsaW5lKHRoaXMuaWQsIHBvaW50LmdldFBvc2l0aW9uKCksIG5leHRQb2ludC5nZXRQb3NpdGlvbigpLCB0aGlzLnBvbHlsaW5lUHJvcHMpO1xuICAgICAgICB0aGlzLnBvbHlsaW5lcy5wdXNoKHBvbHlsaW5lKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZXNMYXllci51cGRhdGUocG9seWxpbmUsIHBvbHlsaW5lLmdldElkKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuX3BvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobmV3UG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgbmV3UG9pbnQpO1xuICB9XG5cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc0ZpcnN0UG9pbnQgPSAhdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICAgIGlmIChpc0ZpcnN0UG9pbnQpIHtcbiAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLl9wb2ludFByb3BzKTtcbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goZmlyc3RQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIGZpcnN0UG9pbnQpO1xuICAgIH1cblxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMuX3BvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2godGhpcy5tb3ZpbmdQb2ludCk7XG5cbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIHRoaXMubW92aW5nUG9pbnQpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgZWRpdFBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgaWYgKGVkaXRQb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkge1xuICAgICAgICB0aGlzLmNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KGVkaXRQb2ludCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICAgIGNvbnN0IHBvaW50SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKGVkaXRQb2ludCk7XG5cbiAgICAgIGlmIChwb2ludEluZGV4IDwgdGhpcy5wb3NpdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBuZXh0VmlydHVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCldO1xuICAgICAgICBjb25zdCBuZXh0UmVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKHBvaW50SW5kZXggKyAyKSAlIChwb2ludHNDb3VudCldO1xuICAgICAgICB0aGlzLnVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludChuZXh0VmlydHVhbFBvaW50LCBlZGl0UG9pbnQsIG5leHRSZWFsUG9pbnQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBuZXh0VmlydHVhbFBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChwb2ludEluZGV4ID4gMCkge1xuICAgICAgICBjb25zdCBwcmV2VmlydHVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKChwb2ludEluZGV4IC0gMSkgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudF07XG4gICAgICAgIGNvbnN0IHByZXZSZWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1soKHBvaW50SW5kZXggLSAyKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50XTtcbiAgICAgICAgdGhpcy51cGRhdGVNaWRkbGVWaXJ0dWFsUG9pbnQocHJldlZpcnR1YWxQb2ludCwgZWRpdFBvaW50LCBwcmV2UmVhbFBvaW50KTtcbiAgICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgcHJldlZpcnR1YWxQb2ludCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgZWRpdFBvaW50KTtcbiAgfVxuXG4gIG1vdmVUZW1wTW92aW5nUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLm1vdmVQb2ludCh0b1Bvc2l0aW9uLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlU2hhcGUoc3RhcnRNb3ZpbmdQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWx0YSA9IEdlb1V0aWxzU2VydmljZS5nZXRQb3NpdGlvbnNEZWx0YSh0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiwgZHJhZ2dlZFRvUG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbihwb2ludC5nZXRQb3NpdGlvbigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCAuLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnZ2VkVG9Qb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVTaGFwZSgpIHtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIC4uLnRoaXMucG9zaXRpb25zKTtcbiAgfVxuXG4gIHJlbW92ZVBvaW50KHBvaW50VG9SZW1vdmU6IEVkaXRQb2ludCkge1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24ocG9pbnRUb1JlbW92ZSk7XG4gICAgdGhpcy5wb3NpdGlvbnNcbiAgICAgIC5maWx0ZXIocCA9PiBwLmlzVmlydHVhbEVkaXRQb2ludCgpKVxuICAgICAgLmZvckVhY2gocCA9PiB0aGlzLnJlbW92ZVBvc2l0aW9uKHApKTtcbiAgICB0aGlzLmFkZEFsbFZpcnR1YWxFZGl0UG9pbnRzKCk7XG5cbiAgICB0aGlzLnJlbmRlclBvbHlsaW5lcygpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24odGhpcy5tb3ZpbmdQb2ludCk7IC8vIHJlbW92ZSBtb3ZpbmdQb2ludFxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuXG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLmdldFJlYWxQb2ludHMoKVxuICAgICAgLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgfVxuXG4gIGdldFJlYWxQb2ludHMoKTogRWRpdFBvaW50W10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uc1xuICAgICAgLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkgJiYgcG9zaXRpb24gIT09IHRoaXMubW92aW5nUG9pbnQpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zKCk6IENhcnRlc2lhbjNbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlUG9zaXRpb24ocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wb3NpdGlvbnMuZmluZEluZGV4KChwKSA9PiBwID09PSBwb2ludCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHNMYXllcihyZW5kZXJQb2x5bGluZXMgPSB0cnVlLCAuLi5wb2ludDogRWRpdFBvaW50W10pIHtcbiAgICBpZiAocmVuZGVyUG9seWxpbmVzKSB7XG4gICAgICB0aGlzLnJlbmRlclBvbHlsaW5lcygpO1xuICAgIH1cbiAgICBwb2ludC5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKGVkaXRQb2ludCA9PiB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XG4gICAgfSk7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMucG9seWxpbmVzTGF5ZXIucmVtb3ZlKGxpbmUuZ2V0SWQoKSkpO1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLm1vdmluZ1BvaW50LmdldElkKCkpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGdldFBvaW50c0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=