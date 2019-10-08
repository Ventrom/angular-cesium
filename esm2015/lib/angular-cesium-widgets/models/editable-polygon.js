/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
export class EditablePolygon extends AcEntity {
    /**
     * @param {?} id
     * @param {?} polygonsLayer
     * @param {?} pointsLayer
     * @param {?} polylinesLayer
     * @param {?} coordinateConverter
     * @param {?} polygonOptions
     * @param {?=} positions
     */
    constructor(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        super();
        this.id = id;
        this.polygonsLayer = polygonsLayer;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this.polygonProps = polygonOptions.polygonProps;
        this.defaultPointProps = polygonOptions.pointProps;
        this.defaultPolylineProps = polygonOptions.polylineProps;
        if (positions && positions.length >= 3) {
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
    get defaultPolylineProps() {
        return this._defaultPolylineProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set defaultPolylineProps(value) {
        this._defaultPolylineProps = value;
    }
    /**
     * @return {?}
     */
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    /**
     * @return {?}
     */
    get polygonProps() {
        return this._polygonProps;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set polygonProps(value) {
        this._polygonProps = value;
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
        this.updatePolygonsLayer();
        this.doneCreation = true;
    }
    /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    setPointsManually(points, polygonProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
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
                newPoint = new EditPoint(this.id, pointOrCartesian, this.defaultPointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polygonProps = polygonProps ? polygonProps : this.polygonProps;
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
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
            /** @type {?} */
            const currentPoint = pos;
            /** @type {?} */
            const nextIndex = (index + 1) % (currentPoints.length);
            /** @type {?} */
            const nextPoint = currentPoints[nextIndex];
            /** @type {?} */
            const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
            this.updatePointsLayer(false, midPoint);
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
        const midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
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
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        // virtual point becomes a real point
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
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
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
         * @param {?} pos
         * @return {?}
         */
        pos => !pos.isVirtualEditPoint()));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        (point, index) => {
            /** @type {?} */
            const nextIndex = (index + 1) % (realPoints.length);
            /** @type {?} */
            const nextPoint = realPoints[nextIndex];
            /** @type {?} */
            const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.defaultPolylineProps);
            this.polylines.push(polyline);
            this.polylinesLayer.update(polyline, polyline.getId());
        }));
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addPointFromExisting(position) {
        /** @type {?} */
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
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
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    }
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        this.updatePolygonsLayer();
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            const pointsCount = this.positions.length;
            /** @type {?} */
            const pointIndex = this.positions.indexOf(editPoint);
            /** @type {?} */
            const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            /** @type {?} */
            const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            /** @type {?} */
            const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            /** @type {?} */
            const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            this.updatePointsLayer(false, nextVirtualPoint);
            this.updatePointsLayer(false, prevVirtualPoint);
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
    movePolygon(startMovingPosition, draggedToPosition) {
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
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        point => this.updatePointsLayer(true, point)));
    }
    /**
     * @return {?}
     */
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
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
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    /**
     * @param {?} position
     * @return {?}
     */
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
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
    getRealPoints() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint() && position !== this.movingPoint));
    }
    /**
     * @return {?}
     */
    getPositionsHierarchy() {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        position => !position.isVirtualEditPoint())).map((/**
         * @param {?} position
         * @return {?}
         */
        position => position.getPosition()));
    }
    /**
     * @return {?}
     */
    getPositionsHierarchyCallbackProperty() {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
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
     * @return {?}
     */
    updatePolygonsLayer() {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    updatePointsLayer(renderPolylines = true, ...points) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => this.pointsLayer.update(p, p.getId())));
    }
    /**
     * @return {?}
     */
    dispose() {
        this.polygonsLayer.remove(this.id);
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
    EditablePolygon.prototype.positions;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.polylines;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.movingPoint;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.doneCreation;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype._enableEdit;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype._polygonProps;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype._defaultPointProps;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype._defaultPolylineProps;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.lastDraggedToPosition;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype._labels;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.id;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.polygonsLayer;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.pointsLayer;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.polylinesLayer;
    /**
     * @type {?}
     * @private
     */
    EditablePolygon.prototype.coordinateConverter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUkvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFHNUYsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRTlELE1BQU0sT0FBTyxlQUFnQixTQUFRLFFBQVE7Ozs7Ozs7Ozs7SUFZM0MsWUFBb0IsRUFBVSxFQUNWLGFBQStCLEVBQy9CLFdBQTZCLEVBQzdCLGNBQWdDLEVBQ2hDLG1CQUF3QyxFQUNoRCxjQUFrQyxFQUNsQyxTQUF3QjtRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQVBVLE9BQUUsR0FBRixFQUFFLENBQVE7UUFDVixrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFDL0IsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBZnBELGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBQzVCLGNBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBS25CLFlBQU8sR0FBaUIsRUFBRSxDQUFDO1FBVWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQztRQUNoRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLFVBQVUs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QyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQ3pFLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7OztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7Q0FDRjs7Ozs7O0lBdlVDLG9DQUFvQzs7Ozs7SUFDcEMsb0NBQXVDOzs7OztJQUN2QyxzQ0FBK0I7Ozs7O0lBQy9CLHVDQUE2Qjs7Ozs7SUFDN0Isc0NBQTJCOzs7OztJQUMzQix3Q0FBb0M7Ozs7O0lBQ3BDLDZDQUF1Qzs7Ozs7SUFDdkMsZ0RBQTZDOzs7OztJQUM3QyxnREFBMEM7Ozs7O0lBQzFDLGtDQUFtQzs7Ozs7SUFFdkIsNkJBQWtCOzs7OztJQUNsQix3Q0FBdUM7Ozs7O0lBQ3ZDLHNDQUFxQzs7Ozs7SUFDckMseUNBQXdDOzs7OztJQUN4Qyw4Q0FBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEVkaXRQb2x5bGluZSB9IGZyb20gJy4vZWRpdC1wb2x5bGluZSc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBQb2x5Z29uRWRpdE9wdGlvbnMsIFBvbHlnb25Qcm9wcyB9IGZyb20gJy4vcG9seWdvbi1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcywgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBvbHlnb24gZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIHBvbHlsaW5lczogRWRpdFBvbHlsaW5lW10gPSBbXTtcbiAgcHJpdmF0ZSBtb3ZpbmdQb2ludDogRWRpdFBvaW50O1xuICBwcml2YXRlIGRvbmVDcmVhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfcG9seWdvblByb3BzOiBQb2x5Z29uUHJvcHM7XG4gIHByaXZhdGUgX2RlZmF1bHRQb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9kZWZhdWx0UG9seWxpbmVQcm9wczogUG9seWxpbmVQcm9wcztcbiAgcHJpdmF0ZSBsYXN0RHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIHBvbHlnb25zTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9seWxpbmVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICAgICAgcG9seWdvbk9wdGlvbnM6IFBvbHlnb25FZGl0T3B0aW9ucyxcbiAgICAgICAgICAgICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBvbHlnb25Qcm9wcyA9IHBvbHlnb25PcHRpb25zLnBvbHlnb25Qcm9wcztcbiAgICB0aGlzLmRlZmF1bHRQb2ludFByb3BzID0gcG9seWdvbk9wdGlvbnMucG9pbnRQcm9wcztcbiAgICB0aGlzLmRlZmF1bHRQb2x5bGluZVByb3BzID0gcG9seWdvbk9wdGlvbnMucG9seWxpbmVQcm9wcztcbiAgICBpZiAocG9zaXRpb25zICYmIHBvc2l0aW9ucy5sZW5ndGggPj0gMykge1xuICAgICAgdGhpcy5jcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbGFiZWxzKCk6IExhYmVsUHJvcHNbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVscztcbiAgfVxuXG4gIHNldCBsYWJlbHMobGFiZWxzOiBMYWJlbFByb3BzW10pIHtcbiAgICBpZiAoIWxhYmVscykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB0aGlzLl9sYWJlbHMgPSBsYWJlbHMubWFwKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghbGFiZWwucG9zaXRpb24pIHtcbiAgICAgICAgbGFiZWwucG9zaXRpb24gPSBwb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExhYmVsUHJvcHMsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0UG9seWxpbmVQcm9wcygpOiBQb2x5bGluZVByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFBvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgZGVmYXVsdFBvbHlsaW5lUHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9kZWZhdWx0UG9seWxpbmVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcztcbiAgfVxuXG4gIGdldCBwb2x5Z29uUHJvcHMoKTogUG9seWdvblByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWdvblByb3BzO1xuICB9XG5cbiAgc2V0IHBvbHlnb25Qcm9wcyh2YWx1ZTogUG9seWdvblByb3BzKSB7XG4gICAgdGhpcy5fcG9seWdvblByb3BzID0gdmFsdWU7XG4gIH1cblxuICBzZXQgZGVmYXVsdFBvaW50UHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGVuYWJsZUVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZUVkaXQ7XG4gIH1cblxuICBzZXQgZW5hYmxlRWRpdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZUVkaXQgPSB2YWx1ZTtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIHBvaW50LnNob3cgPSB2YWx1ZTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIHBvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9uczogQ2FydGVzaWFuM1tdKSB7XG4gICAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICB0aGlzLmFkZFBvaW50RnJvbUV4aXN0aW5nKHBvc2l0aW9uKTtcbiAgICB9KTtcbiAgICB0aGlzLmFkZEFsbFZpcnR1YWxFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2x5Z29uc0xheWVyKCk7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICB9XG5cbiAgc2V0UG9pbnRzTWFudWFsbHkocG9pbnRzOiB7IHBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2ludFByb3BzOiBQb2ludFByb3BzIH1bXSB8IENhcnRlc2lhbjNbXSwgcG9seWdvblByb3BzPzogUG9seWdvblByb3BzKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcGRhdGUgbWFudWFsbHkgb25seSBpbiBlZGl0IG1vZGUsIGFmdGVyIHBvbHlnb24gaXMgY3JlYXRlZCcpO1xuICAgIH1cblxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwLmdldElkKCkpKTtcbiAgICBjb25zdCBuZXdQb2ludHM6IEVkaXRQb2ludFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvaW50T3JDYXJ0ZXNpYW46IGFueSA9IHBvaW50c1tpXTtcbiAgICAgIGxldCBuZXdQb2ludCA9IG51bGw7XG4gICAgICBpZiAocG9pbnRPckNhcnRlc2lhbi5wb2ludFByb3BzKSB7XG4gICAgICAgIG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb2ludE9yQ2FydGVzaWFuLnBvc2l0aW9uLCBwb2ludE9yQ2FydGVzaWFuLnBvaW50UHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvaW50T3JDYXJ0ZXNpYW4sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgfVxuICAgICAgbmV3UG9pbnRzLnB1c2gobmV3UG9pbnQpO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1BvaW50cztcbiAgICB0aGlzLnBvbHlnb25Qcm9wcyA9IHBvbHlnb25Qcm9wcyA/IHBvbHlnb25Qcm9wcyA6IHRoaXMucG9seWdvblByb3BzO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKSB7XG4gICAgY29uc3QgY3VycmVudFBvaW50cyA9IFsuLi50aGlzLnBvc2l0aW9uc107XG4gICAgY3VycmVudFBvaW50cy5mb3JFYWNoKChwb3MsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50UG9pbnQgPSBwb3M7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSAoaW5kZXggKyAxKSAlIChjdXJyZW50UG9pbnRzLmxlbmd0aCk7XG4gICAgICBjb25zdCBuZXh0UG9pbnQgPSBjdXJyZW50UG9pbnRzW25leHRJbmRleF07XG4gICAgICBjb25zdCBtaWRQb2ludCA9IHRoaXMuc2V0TWlkZGxlVmlydHVhbFBvaW50KGN1cnJlbnRQb2ludCwgbmV4dFBvaW50KTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIG1pZFBvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TWlkZGxlVmlydHVhbFBvaW50KGZpcnN0UDogRWRpdFBvaW50LCBzZWNvbmRQOiBFZGl0UG9pbnQpOiBFZGl0UG9pbnQge1xuICAgIGNvbnN0IGN1cnJlbnRDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGZpcnN0UC5nZXRQb3NpdGlvbigpKTtcbiAgICBjb25zdCBuZXh0Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihzZWNvbmRQLmdldFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IG1pZFBvaW50Q2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5taWRQb2ludFRvQ2FydGVzaWFuMyhjdXJyZW50Q2FydCwgbmV4dENhcnQpO1xuICAgIGNvbnN0IG1pZFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBtaWRQb2ludENhcnRlc2lhbjMsIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgIG1pZFBvaW50LnNldFZpcnR1YWxFZGl0UG9pbnQodHJ1ZSk7XG5cbiAgICBjb25zdCBmaXJzdEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihmaXJzdFApO1xuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShmaXJzdEluZGV4ICsgMSwgMCwgbWlkUG9pbnQpO1xuICAgIHJldHVybiBtaWRQb2ludDtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KHZpcnR1YWxFZGl0UG9pbnQ6IEVkaXRQb2ludCwgcHJldlBvaW50OiBFZGl0UG9pbnQsIG5leHRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgcHJldlBvaW50Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihwcmV2UG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgY29uc3QgbmV4dFBvaW50Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgdmlydHVhbEVkaXRQb2ludC5zZXRQb3NpdGlvbih0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIubWlkUG9pbnRUb0NhcnRlc2lhbjMocHJldlBvaW50Q2FydCwgbmV4dFBvaW50Q2FydCkpO1xuICB9XG5cbiAgY2hhbmdlVmlydHVhbFBvaW50VG9SZWFsUG9pbnQocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHBvaW50LnNldFZpcnR1YWxFZGl0UG9pbnQoZmFsc2UpOyAvLyB2aXJ0dWFsIHBvaW50IGJlY29tZXMgYSByZWFsIHBvaW50XG4gICAgY29uc3QgcG9pbnRzQ291bnQgPSB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgY29uc3QgcG9pbnRJbmRleCA9IHRoaXMucG9zaXRpb25zLmluZGV4T2YocG9pbnQpO1xuICAgIGNvbnN0IG5leHRJbmRleCA9IChwb2ludEluZGV4ICsgMSkgJSAocG9pbnRzQ291bnQpO1xuICAgIGNvbnN0IHByZUluZGV4ID0gKChwb2ludEluZGV4IC0gMSkgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudDtcblxuICAgIGNvbnN0IG5leHRQb2ludCA9IHRoaXMucG9zaXRpb25zW25leHRJbmRleF07XG4gICAgY29uc3QgcHJlUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1twcmVJbmRleF07XG5cbiAgICBjb25zdCBmaXJzdE1pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQocHJlUG9pbnQsIHBvaW50KTtcbiAgICBjb25zdCBzZWNNaWRQb2ludCA9IHRoaXMuc2V0TWlkZGxlVmlydHVhbFBvaW50KHBvaW50LCBuZXh0UG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgZmlyc3RNaWRQb2ludCwgc2VjTWlkUG9pbnQsIHBvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcblxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQb2x5bGluZXMoKSB7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChwb2x5bGluZSA9PiB0aGlzLnBvbHlsaW5lc0xheWVyLnJlbW92ZShwb2x5bGluZS5nZXRJZCgpKSk7XG4gICAgdGhpcy5wb2x5bGluZXMgPSBbXTtcbiAgICBjb25zdCByZWFsUG9pbnRzID0gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvcyA9PiAhcG9zLmlzVmlydHVhbEVkaXRQb2ludCgpKTtcbiAgICByZWFsUG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGluZGV4ICsgMSkgJSAocmVhbFBvaW50cy5sZW5ndGgpO1xuICAgICAgY29uc3QgbmV4dFBvaW50ID0gcmVhbFBvaW50c1tuZXh0SW5kZXhdO1xuICAgICAgY29uc3QgcG9seWxpbmUgPSBuZXcgRWRpdFBvbHlsaW5lKHRoaXMuaWQsIHBvaW50LmdldFBvc2l0aW9uKCksIG5leHRQb2ludC5nZXRQb3NpdGlvbigpLCB0aGlzLmRlZmF1bHRQb2x5bGluZVByb3BzKTtcbiAgICAgIHRoaXMucG9seWxpbmVzLnB1c2gocG9seWxpbmUpO1xuICAgICAgdGhpcy5wb2x5bGluZXNMYXllci51cGRhdGUocG9seWxpbmUsIHBvbHlsaW5lLmdldElkKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobmV3UG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgbmV3UG9pbnQpO1xuICB9XG5cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpc0ZpcnN0UG9pbnQgPSAhdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICAgIGlmIChpc0ZpcnN0UG9pbnQpIHtcbiAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goZmlyc3RQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIGZpcnN0UG9pbnQpO1xuICAgIH1cblxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2godGhpcy5tb3ZpbmdQb2ludCk7XG5cbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIHRoaXMubW92aW5nUG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgZWRpdFBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgaWYgKGVkaXRQb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkge1xuICAgICAgICB0aGlzLmNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KGVkaXRQb2ludCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICAgIGNvbnN0IHBvaW50SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKGVkaXRQb2ludCk7XG4gICAgICBjb25zdCBuZXh0VmlydHVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCldO1xuICAgICAgY29uc3QgbmV4dFJlYWxQb2ludCA9IHRoaXMucG9zaXRpb25zWyhwb2ludEluZGV4ICsgMikgJSAocG9pbnRzQ291bnQpXTtcbiAgICAgIGNvbnN0IHByZXZWaXJ0dWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1soKHBvaW50SW5kZXggLSAxKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50XTtcbiAgICAgIGNvbnN0IHByZXZSZWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1soKHBvaW50SW5kZXggLSAyKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50XTtcbiAgICAgIHRoaXMudXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KG5leHRWaXJ0dWFsUG9pbnQsIGVkaXRQb2ludCwgbmV4dFJlYWxQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludChwcmV2VmlydHVhbFBvaW50LCBlZGl0UG9pbnQsIHByZXZSZWFsUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgbmV4dFZpcnR1YWxQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBwcmV2VmlydHVhbFBvaW50KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBlZGl0UG9pbnQpO1xuICB9XG5cbiAgbW92ZVRlbXBNb3ZpbmdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMubW92ZVBvaW50KHRvUG9zaXRpb24sIHRoaXMubW92aW5nUG9pbnQpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVQb2x5Z29uKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHN0YXJ0TW92aW5nUG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgZGVsdGEgPSBHZW9VdGlsc1NlcnZpY2UuZ2V0UG9zaXRpb25zRGVsdGEodGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24sIGRyYWdnZWRUb1Bvc2l0aW9uKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIEdlb1V0aWxzU2VydmljZS5hZGREZWx0YVRvUG9zaXRpb24ocG9pbnQuZ2V0UG9zaXRpb24oKSwgZGVsdGEsIHRydWUpO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdnZWRUb1Bvc2l0aW9uO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4gdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBwb2ludCkpO1xuICB9XG5cbiAgZW5kTW92ZVBvbHlnb24oKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZW1vdmVQb2ludChwb2ludFRvUmVtb3ZlOiBFZGl0UG9pbnQpIHtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHBvaW50VG9SZW1vdmUpO1xuICAgIHRoaXMucG9zaXRpb25zXG4gICAgICAuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSlcbiAgICAgIC5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuXG4gICAgdGhpcy5yZW5kZXJQb2x5bGluZXMoKTtcbiAgICBpZiAodGhpcy5nZXRQb2ludHNDb3VudCgpID49IDMpIHtcbiAgICAgIHRoaXMucG9seWdvbnNMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XG4gICAgfVxuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24odGhpcy5tb3ZpbmdQb2ludCk7IC8vIHJlbW92ZSBtb3ZpbmdQb2ludFxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuXG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLmdldFJlYWxQb2ludHMoKS5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWFsUG9pbnRzKCk6IEVkaXRQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvc2l0aW9uID0+ICFwb3NpdGlvbi5pc1ZpcnR1YWxFZGl0UG9pbnQoKSAmJiBwb3NpdGlvbiAhPT0gdGhpcy5tb3ZpbmdQb2ludCk7XG4gIH1cblxuICBnZXRQb3NpdGlvbnNIaWVyYXJjaHkoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvc2l0aW9uID0+ICFwb3NpdGlvbi5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zSGllcmFyY2h5Q2FsbGJhY2tQcm9wZXJ0eSgpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRQb3NpdGlvbnNIaWVyYXJjaHkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgoKHApID0+IHAgPT09IHBvaW50KTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUocG9pbnQuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvbHlnb25zTGF5ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ2V0UG9pbnRzQ291bnQoKSA+PSAzKSB7XG4gICAgICB0aGlzLnBvbHlnb25zTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIocmVuZGVyUG9seWxpbmVzID0gdHJ1ZSwgLi4ucG9pbnRzOiBFZGl0UG9pbnRbXSkge1xuICAgIGlmIChyZW5kZXJQb2x5bGluZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyUG9seWxpbmVzKCk7XG4gICAgfVxuICAgIHBvaW50cy5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucG9seWdvbnNMYXllci5yZW1vdmUodGhpcy5pZCk7XG5cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKGVkaXRQb2ludCA9PiB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XG4gICAgfSk7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMucG9seWxpbmVzTGF5ZXIucmVtb3ZlKGxpbmUuZ2V0SWQoKSkpO1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLm1vdmluZ1BvaW50LmdldElkKCkpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGdldFBvaW50c0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=