/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditablePolygon = /** @class */ (function (_super) {
    tslib_1.__extends(EditablePolygon, _super);
    function EditablePolygon(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.polygonsLayer = polygonsLayer;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.polygonProps = polygonOptions.polygonProps;
        _this.defaultPointProps = polygonOptions.pointProps;
        _this.defaultPolylineProps = polygonOptions.polylineProps;
        if (positions && positions.length >= 3) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolygon.prototype, "labels", {
        get: /**
         * @return {?}
         */
        function () {
            return this._labels;
        },
        set: /**
         * @param {?} labels
         * @return {?}
         */
        function (labels) {
            if (!labels) {
                return;
            }
            /** @type {?} */
            var positions = this.getRealPositions();
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPolylineProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._defaultPolylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._defaultPolylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._defaultPointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "polygonProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polygonProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polygonProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "enableEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableEdit;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    EditablePolygon.prototype.createFromExisting = /**
     * @private
     * @param {?} positions
     * @return {?}
     */
    function (positions) {
        var _this = this;
        positions.forEach((/**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            _this.addPointFromExisting(position);
        }));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    };
    /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    EditablePolygon.prototype.setPointsManually = /**
     * @param {?} points
     * @param {?=} polygonProps
     * @return {?}
     */
    function (points, polygonProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
        }
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.remove(p.getId()); }));
        /** @type {?} */
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            /** @type {?} */
            var pointOrCartesian = points[i];
            /** @type {?} */
            var newPoint = null;
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
        this.updatePointsLayer.apply(this, tslib_1.__spread([true], this.positions));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.addAllVirtualEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var currentPoints = tslib_1.__spread(this.positions);
        currentPoints.forEach((/**
         * @param {?} pos
         * @param {?} index
         * @return {?}
         */
        function (pos, index) {
            /** @type {?} */
            var currentPoint = pos;
            /** @type {?} */
            var nextIndex = (index + 1) % (currentPoints.length);
            /** @type {?} */
            var nextPoint = currentPoints[nextIndex];
            /** @type {?} */
            var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
            _this.updatePointsLayer(false, midPoint);
        }));
    };
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    EditablePolygon.prototype.setMiddleVirtualPoint = /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    function (firstP, secondP) {
        /** @type {?} */
        var currentCart = Cesium.Cartographic.fromCartesian(firstP.getPosition());
        /** @type {?} */
        var nextCart = Cesium.Cartographic.fromCartesian(secondP.getPosition());
        /** @type {?} */
        var midPointCartesian3 = this.coordinateConverter.midPointToCartesian3(currentCart, nextCart);
        /** @type {?} */
        var midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        /** @type {?} */
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    EditablePolygon.prototype.updateMiddleVirtualPoint = /**
     * @private
     * @param {?} virtualEditPoint
     * @param {?} prevPoint
     * @param {?} nextPoint
     * @return {?}
     */
    function (virtualEditPoint, prevPoint, nextPoint) {
        /** @type {?} */
        var prevPointCart = Cesium.Cartographic.fromCartesian(prevPoint.getPosition());
        /** @type {?} */
        var nextPointCart = Cesium.Cartographic.fromCartesian(nextPoint.getPosition());
        virtualEditPoint.setPosition(this.coordinateConverter.midPointToCartesian3(prevPointCart, nextPointCart));
    };
    /**
     * @param {?} point
     * @return {?}
     */
    EditablePolygon.prototype.changeVirtualPointToRealPoint = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        // virtual point becomes a real point
        /** @type {?} */
        var pointsCount = this.positions.length;
        /** @type {?} */
        var pointIndex = this.positions.indexOf(point);
        /** @type {?} */
        var nextIndex = (pointIndex + 1) % (pointsCount);
        /** @type {?} */
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        /** @type {?} */
        var nextPoint = this.positions[nextIndex];
        /** @type {?} */
        var prePoint = this.positions[preIndex];
        /** @type {?} */
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        /** @type {?} */
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.renderPolylines = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.polylines.forEach((/**
         * @param {?} polyline
         * @return {?}
         */
        function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); }));
        this.polylines = [];
        /** @type {?} */
        var realPoints = this.positions.filter((/**
         * @param {?} pos
         * @return {?}
         */
        function (pos) { return !pos.isVirtualEditPoint(); }));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            /** @type {?} */
            var nextIndex = (index + 1) % (realPoints.length);
            /** @type {?} */
            var nextPoint = realPoints[nextIndex];
            /** @type {?} */
            var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.defaultPolylineProps);
            _this.polylines.push(polyline);
            _this.polylinesLayer.update(polyline, polyline.getId());
        }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation) {
            return;
        }
        /** @type {?} */
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditablePolygon.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        this.updatePolygonsLayer();
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            var pointsCount = this.positions.length;
            /** @type {?} */
            var pointIndex = this.positions.indexOf(editPoint);
            /** @type {?} */
            var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            /** @type {?} */
            var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            /** @type {?} */
            var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            /** @type {?} */
            var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            this.updatePointsLayer(false, nextVirtualPoint);
            this.updatePointsLayer(false, prevVirtualPoint);
        }
        this.updatePointsLayer(true, editPoint);
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditablePolygon.prototype.moveTempMovingPoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    EditablePolygon.prototype.movePolygon = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
        var _this = this;
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) { return _this.updatePointsLayer(true, point); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.endMovePolygon = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditablePolygon.prototype.removePoint = /**
     * @param {?} pointToRemove
     * @return {?}
     */
    function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); }))
            .forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolygon.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getRealPositions = /**
     * @return {?}
     */
    function () {
        return this.getRealPoints().map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPositionsHierarchy = /**
     * @return {?}
     */
    function () {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint(); })).map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPositionsHierarchyCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    };
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    EditablePolygon.prototype.removePosition = /**
     * @private
     * @param {?} point
     * @return {?}
     */
    function (point) {
        /** @type {?} */
        var index = this.positions.findIndex((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p === point; }));
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolygon.prototype.updatePolygonsLayer = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    EditablePolygon.prototype.updatePointsLayer = /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} points
     * @return {?}
     */
    function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var points = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            points[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.polygonsLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        }));
        this.polylines.forEach((/**
         * @param {?} line
         * @return {?}
         */
        function (line) { return _this.polylinesLayer.remove(line.getId()); }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditablePolygon.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditablePolygon;
}(AcEntity));
export { EditablePolygon };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFJL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBRzVGLE9BQU8sRUFBRSxpQkFBaUIsRUFBYyxNQUFNLGVBQWUsQ0FBQztBQUU5RDtJQUFxQywyQ0FBUTtJQVkzQyx5QkFBb0IsRUFBVSxFQUNWLGFBQStCLEVBQy9CLFdBQTZCLEVBQzdCLGNBQWdDLEVBQ2hDLG1CQUF3QyxFQUNoRCxjQUFrQyxFQUNsQyxTQUF3QjtRQU5wQyxZQU9FLGlCQUFPLFNBT1I7UUFkbUIsUUFBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLG1CQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUMvQixpQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0Isb0JBQWMsR0FBZCxjQUFjLENBQWtCO1FBQ2hDLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFmcEQsZUFBUyxHQUFnQixFQUFFLENBQUM7UUFDNUIsZUFBUyxHQUFtQixFQUFFLENBQUM7UUFFL0Isa0JBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFLbkIsYUFBTyxHQUFpQixFQUFFLENBQUM7UUFVakMsS0FBSSxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDO1FBQ2hELEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO1FBQ25ELEtBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ3pELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ3RDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwQzs7SUFDSCxDQUFDO0lBRUQsc0JBQUksbUNBQU07Ozs7UUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7OztRQUVELFVBQVcsTUFBb0I7WUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxPQUFPO2FBQ1I7O2dCQUNLLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRzs7Ozs7WUFBQyxVQUFDLEtBQUssRUFBRSxLQUFLO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtvQkFDbkIsS0FBSyxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ25DO2dCQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckQsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDOzs7T0FkQTtJQWdCRCxzQkFBSSxpREFBb0I7Ozs7UUFBeEI7WUFDRSxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUNwQyxDQUFDOzs7OztRQUVELFVBQXlCLEtBQW9CO1lBQzNDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDckMsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSw4Q0FBaUI7Ozs7UUFBckI7WUFDRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNqQyxDQUFDOzs7OztRQVVELFVBQXNCLEtBQWlCO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsQ0FBQzs7O09BWkE7SUFFRCxzQkFBSSx5Q0FBWTs7OztRQUFoQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM1QixDQUFDOzs7OztRQUVELFVBQWlCLEtBQW1CO1lBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7OztPQUpBO0lBVUQsc0JBQUksdUNBQVU7Ozs7UUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQixDQUFDOzs7OztRQUVELFVBQWUsS0FBYztZQUE3QixpQkFNQztZQUxDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsS0FBSztnQkFDMUIsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ25CLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxFQUFDLENBQUM7UUFDTCxDQUFDOzs7T0FSQTs7Ozs7O0lBVU8sNENBQWtCOzs7OztJQUExQixVQUEyQixTQUF1QjtRQUFsRCxpQkFPQztRQU5DLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxRQUFRO1lBQ3pCLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7Ozs7OztJQUVELDJDQUFpQjs7Ozs7SUFBakIsVUFBa0IsTUFBeUUsRUFBRSxZQUEyQjtRQUF4SCxpQkFzQkM7UUFyQkMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBbEMsQ0FBa0MsRUFBQyxDQUFDOztZQUMxRCxTQUFTLEdBQWdCLEVBQUU7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2dCQUNoQyxnQkFBZ0IsR0FBUSxNQUFNLENBQUMsQ0FBQyxDQUFDOztnQkFDbkMsUUFBUSxHQUFHLElBQUk7WUFDbkIsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7Z0JBQy9CLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMzRjtpQkFBTTtnQkFDTCxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUM3RTtZQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3BFLElBQUksQ0FBQyxpQkFBaUIsT0FBdEIsSUFBSSxvQkFBbUIsSUFBSSxHQUFLLElBQUksQ0FBQyxTQUFTLEdBQUU7UUFDaEQsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7SUFFTyxpREFBdUI7Ozs7SUFBL0I7UUFBQSxpQkFTQzs7WUFSTyxhQUFhLG9CQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDekMsYUFBYSxDQUFDLE9BQU87Ozs7O1FBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSzs7Z0JBQ3pCLFlBQVksR0FBRyxHQUFHOztnQkFDbEIsU0FBUyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQzs7Z0JBQ2hELFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDOztnQkFDcEMsUUFBUSxHQUFHLEtBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDO1lBQ3BFLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7O0lBRU8sK0NBQXFCOzs7Ozs7SUFBN0IsVUFBOEIsTUFBaUIsRUFBRSxPQUFrQjs7WUFDM0QsV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7WUFDckUsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7WUFDbkUsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7O1lBQ3pGLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNuRixRQUFRLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBRTdCLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7Ozs7Ozs7SUFFTyxrREFBd0I7Ozs7Ozs7SUFBaEMsVUFBaUMsZ0JBQTJCLEVBQUUsU0FBb0IsRUFBRSxTQUFvQjs7WUFDaEcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7WUFDMUUsYUFBYSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoRixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzVHLENBQUM7Ozs7O0lBRUQsdURBQTZCOzs7O0lBQTdCLFVBQThCLEtBQWdCO1FBQzVDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHFDQUFxQzs7O1lBQ2pFLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07O1lBQ25DLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O1lBQzFDLFNBQVMsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQzs7WUFDNUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVzs7WUFFekQsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDOztZQUNyQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7O1lBRW5DLGFBQWEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQzs7WUFDM0QsV0FBVyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUU3QixDQUFDOzs7OztJQUVPLHlDQUFlOzs7O0lBQXZCO1FBQUEsaUJBV0M7UUFWQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUE1QyxDQUE0QyxFQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O1lBQ2QsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTs7OztRQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBekIsQ0FBeUIsRUFBQztRQUMxRSxVQUFVLENBQUMsT0FBTzs7Ozs7UUFBQyxVQUFDLEtBQUssRUFBRSxLQUFLOztnQkFDeEIsU0FBUyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQzs7Z0JBQzdDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDOztnQkFDakMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFJLENBQUMsb0JBQW9CLENBQUM7WUFDbkgsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCw4Q0FBb0I7Ozs7SUFBcEIsVUFBcUIsUUFBb0I7O1lBQ2pDLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7OztJQUdELGtDQUFROzs7O0lBQVIsVUFBUyxRQUFvQjtRQUMzQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsT0FBTztTQUNSOztZQUNLLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUMzQyxJQUFJLFlBQVksRUFBRTs7Z0JBQ1YsVUFBVSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUMzRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7O0lBRUQsbUNBQVM7Ozs7O0lBQVQsVUFBVSxVQUFzQixFQUFFLFNBQW9CO1FBQ3BELFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksU0FBUyxDQUFDLGtCQUFrQixFQUFFLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvQzs7Z0JBQ0ssV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTs7Z0JBQ25DLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7O2dCQUM5QyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O2dCQUNuRSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztnQkFDaEUsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQzs7Z0JBQ2pGLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQ3BGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDOzs7OztJQUVELDZDQUFtQjs7OztJQUFuQixVQUFvQixVQUFzQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQscUNBQVc7Ozs7O0lBQVgsVUFBWSxtQkFBK0IsRUFBRSxpQkFBNkI7UUFBMUUsaUJBZUM7UUFkQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxtQkFBbUIsQ0FBQztTQUNsRDs7WUFFSyxLQUFLLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxpQkFBaUIsQ0FBQztRQUM5RixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLEtBQUs7WUFDMUIsZUFBZSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMscUJBQXFCLEdBQUcsaUJBQWlCLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFuQyxDQUFtQyxFQUFDLENBQUM7SUFDdkUsQ0FBQzs7OztJQUVELHdDQUFjOzs7SUFBZDtRQUNFLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7SUFDekMsQ0FBQzs7Ozs7SUFFRCxxQ0FBVzs7OztJQUFYLFVBQVksYUFBd0I7UUFBcEMsaUJBV0M7UUFWQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTO2FBQ1gsTUFBTTs7OztRQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQXRCLENBQXNCLEVBQUM7YUFDbkMsT0FBTzs7OztRQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsRUFBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7Ozs7O0lBRUQsc0NBQVk7Ozs7SUFBWixVQUFhLFFBQW9CO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQzVELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Ozs7SUFFRCwwQ0FBZ0I7OztJQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEdBQUc7Ozs7UUFBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBdEIsQ0FBc0IsRUFBQyxDQUFDO0lBQ3RFLENBQUM7Ozs7SUFFRCx1Q0FBYTs7O0lBQWI7UUFBQSxpQkFFQztRQURDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLFFBQVEsS0FBSyxLQUFJLENBQUMsV0FBVyxFQUEvRCxDQUErRCxFQUFDLENBQUM7SUFDNUcsQ0FBQzs7OztJQUVELCtDQUFxQjs7O0lBQXJCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEVBQTlCLENBQThCLEVBQUMsQ0FBQyxHQUFHOzs7O1FBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLEVBQUMsQ0FBQztJQUNuSCxDQUFDOzs7O0lBRUQsK0RBQXFDOzs7SUFBckM7UUFDRSxPQUFPLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkYsQ0FBQzs7Ozs7O0lBRU8sd0NBQWM7Ozs7O0lBQXRCLFVBQXVCLEtBQWdCOztZQUMvQixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUssS0FBSyxFQUFYLENBQVcsRUFBQztRQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQzs7Ozs7SUFFTyw2Q0FBbUI7Ozs7SUFBM0I7UUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7Ozs7Ozs7SUFFTywyQ0FBaUI7Ozs7OztJQUF6QixVQUEwQixlQUFzQjtRQUFoRCxpQkFLQztRQUx5QixnQ0FBQSxFQUFBLHNCQUFzQjtRQUFFLGdCQUFzQjthQUF0QixVQUFzQixFQUF0QixxQkFBc0IsRUFBdEIsSUFBc0I7WUFBdEIsK0JBQXNCOztRQUN0RSxJQUFJLGVBQWUsRUFBRTtZQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFDRCxNQUFNLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFyQyxDQUFxQyxFQUFDLENBQUM7SUFDN0QsQ0FBQzs7OztJQUVELGlDQUFPOzs7SUFBUDtRQUFBLGlCQVlDO1FBWEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsU0FBUztZQUM5QixLQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQXhDLENBQXdDLEVBQUMsQ0FBQztRQUN6RSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCx3Q0FBYzs7O0lBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFRCwrQkFBSzs7O0lBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXhVRCxDQUFxQyxRQUFRLEdBd1U1Qzs7Ozs7OztJQXZVQyxvQ0FBb0M7Ozs7O0lBQ3BDLG9DQUF1Qzs7Ozs7SUFDdkMsc0NBQStCOzs7OztJQUMvQix1Q0FBNkI7Ozs7O0lBQzdCLHNDQUEyQjs7Ozs7SUFDM0Isd0NBQW9DOzs7OztJQUNwQyw2Q0FBdUM7Ozs7O0lBQ3ZDLGdEQUE2Qzs7Ozs7SUFDN0MsZ0RBQTBDOzs7OztJQUMxQyxrQ0FBbUM7Ozs7O0lBRXZCLDZCQUFrQjs7Ozs7SUFDbEIsd0NBQXVDOzs7OztJQUN2QyxzQ0FBcUM7Ozs7O0lBQ3JDLHlDQUF3Qzs7Ozs7SUFDeEMsOENBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4vZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBFZGl0UG9seWxpbmUgfSBmcm9tICcuL2VkaXQtcG9seWxpbmUnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9seWdvbkVkaXRPcHRpb25zLCBQb2x5Z29uUHJvcHMgfSBmcm9tICcuL3BvbHlnb24tZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvaW50UHJvcHMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0TGFiZWxQcm9wcywgTGFiZWxQcm9wcyB9IGZyb20gJy4vbGFiZWwtcHJvcHMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdGFibGVQb2x5Z29uIGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIHBvc2l0aW9uczogRWRpdFBvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBwb2x5bGluZXM6IEVkaXRQb2x5bGluZVtdID0gW107XG4gIHByaXZhdGUgbW92aW5nUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBkb25lQ3JlYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgX3BvbHlnb25Qcm9wczogUG9seWdvblByb3BzO1xuICBwcml2YXRlIF9kZWZhdWx0UG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfZGVmYXVsdFBvbHlsaW5lUHJvcHM6IFBvbHlsaW5lUHJvcHM7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwb2x5Z29uc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgIHBvbHlnb25PcHRpb25zOiBQb2x5Z29uRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wb2x5Z29uUHJvcHMgPSBwb2x5Z29uT3B0aW9ucy5wb2x5Z29uUHJvcHM7XG4gICAgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyA9IHBvbHlnb25PcHRpb25zLnBvaW50UHJvcHM7XG4gICAgdGhpcy5kZWZhdWx0UG9seWxpbmVQcm9wcyA9IHBvbHlnb25PcHRpb25zLnBvbHlsaW5lUHJvcHM7XG4gICAgaWYgKHBvc2l0aW9ucyAmJiBwb3NpdGlvbnMubGVuZ3RoID49IDMpIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgZGVmYXVsdFBvbHlsaW5lUHJvcHMoKTogUG9seWxpbmVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRQb2x5bGluZVByb3BzO1xuICB9XG5cbiAgc2V0IGRlZmF1bHRQb2x5bGluZVByb3BzKHZhbHVlOiBQb2x5bGluZVByb3BzKSB7XG4gICAgdGhpcy5fZGVmYXVsdFBvbHlsaW5lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkZWZhdWx0UG9pbnRQcm9wcygpOiBQb2ludFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFBvaW50UHJvcHM7XG4gIH1cblxuICBnZXQgcG9seWdvblByb3BzKCk6IFBvbHlnb25Qcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlnb25Qcm9wcztcbiAgfVxuXG4gIHNldCBwb2x5Z29uUHJvcHModmFsdWU6IFBvbHlnb25Qcm9wcykge1xuICAgIHRoaXMuX3BvbHlnb25Qcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IGRlZmF1bHRQb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fZGVmYXVsdFBvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBwb2ludC5zaG93ID0gdmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBwb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSkge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgdGhpcy5hZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgfVxuXG4gIHNldFBvaW50c01hbnVhbGx5KHBvaW50czogeyBwb3NpdGlvbjogQ2FydGVzaWFuMywgcG9pbnRQcm9wczogUG9pbnRQcm9wcyB9W10gfCBDYXJ0ZXNpYW4zW10sIHBvbHlnb25Qcm9wcz86IFBvbHlnb25Qcm9wcykge1xuICAgIGlmICghdGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXBkYXRlIG1hbnVhbGx5IG9ubHkgaW4gZWRpdCBtb2RlLCBhZnRlciBwb2x5Z29uIGlzIGNyZWF0ZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci5yZW1vdmUocC5nZXRJZCgpKSk7XG4gICAgY29uc3QgbmV3UG9pbnRzOiBFZGl0UG9pbnRbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwb2ludE9yQ2FydGVzaWFuOiBhbnkgPSBwb2ludHNbaV07XG4gICAgICBsZXQgbmV3UG9pbnQgPSBudWxsO1xuICAgICAgaWYgKHBvaW50T3JDYXJ0ZXNpYW4ucG9pbnRQcm9wcykge1xuICAgICAgICBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9pbnRPckNhcnRlc2lhbi5wb3NpdGlvbiwgcG9pbnRPckNhcnRlc2lhbi5wb2ludFByb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb2ludE9yQ2FydGVzaWFuLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICAgIH1cbiAgICAgIG5ld1BvaW50cy5wdXNoKG5ld1BvaW50KTtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMgPSBuZXdQb2ludHM7XG4gICAgdGhpcy5wb2x5Z29uUHJvcHMgPSBwb2x5Z29uUHJvcHMgPyBwb2x5Z29uUHJvcHMgOiB0aGlzLnBvbHlnb25Qcm9wcztcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICB0aGlzLmFkZEFsbFZpcnR1YWxFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2x5Z29uc0xheWVyKCk7XG4gIH1cblxuICBwcml2YXRlIGFkZEFsbFZpcnR1YWxFZGl0UG9pbnRzKCkge1xuICAgIGNvbnN0IGN1cnJlbnRQb2ludHMgPSBbLi4udGhpcy5wb3NpdGlvbnNdO1xuICAgIGN1cnJlbnRQb2ludHMuZm9yRWFjaCgocG9zLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBvaW50ID0gcG9zO1xuICAgICAgY29uc3QgbmV4dEluZGV4ID0gKGluZGV4ICsgMSkgJSAoY3VycmVudFBvaW50cy5sZW5ndGgpO1xuICAgICAgY29uc3QgbmV4dFBvaW50ID0gY3VycmVudFBvaW50c1tuZXh0SW5kZXhdO1xuICAgICAgY29uc3QgbWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChjdXJyZW50UG9pbnQsIG5leHRQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBtaWRQb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldE1pZGRsZVZpcnR1YWxQb2ludChmaXJzdFA6IEVkaXRQb2ludCwgc2Vjb25kUDogRWRpdFBvaW50KTogRWRpdFBvaW50IHtcbiAgICBjb25zdCBjdXJyZW50Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihmaXJzdFAuZ2V0UG9zaXRpb24oKSk7XG4gICAgY29uc3QgbmV4dENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oc2Vjb25kUC5nZXRQb3NpdGlvbigpKTtcbiAgICBjb25zdCBtaWRQb2ludENhcnRlc2lhbjMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIubWlkUG9pbnRUb0NhcnRlc2lhbjMoY3VycmVudENhcnQsIG5leHRDYXJ0KTtcbiAgICBjb25zdCBtaWRQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgbWlkUG9pbnRDYXJ0ZXNpYW4zLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICBtaWRQb2ludC5zZXRWaXJ0dWFsRWRpdFBvaW50KHRydWUpO1xuXG4gICAgY29uc3QgZmlyc3RJbmRleCA9IHRoaXMucG9zaXRpb25zLmluZGV4T2YoZmlyc3RQKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoZmlyc3RJbmRleCArIDEsIDAsIG1pZFBvaW50KTtcbiAgICByZXR1cm4gbWlkUG9pbnQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludCh2aXJ0dWFsRWRpdFBvaW50OiBFZGl0UG9pbnQsIHByZXZQb2ludDogRWRpdFBvaW50LCBuZXh0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGNvbnN0IHByZXZQb2ludENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4ocHJldlBvaW50LmdldFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IG5leHRQb2ludENhcnQgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4obmV4dFBvaW50LmdldFBvc2l0aW9uKCkpO1xuICAgIHZpcnR1YWxFZGl0UG9pbnQuc2V0UG9zaXRpb24odGhpcy5jb29yZGluYXRlQ29udmVydGVyLm1pZFBvaW50VG9DYXJ0ZXNpYW4zKHByZXZQb2ludENhcnQsIG5leHRQb2ludENhcnQpKTtcbiAgfVxuXG4gIGNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBwb2ludC5zZXRWaXJ0dWFsRWRpdFBvaW50KGZhbHNlKTsgLy8gdmlydHVhbCBwb2ludCBiZWNvbWVzIGEgcmVhbCBwb2ludFxuICAgIGNvbnN0IHBvaW50c0NvdW50ID0gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICAgIGNvbnN0IHBvaW50SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKHBvaW50KTtcbiAgICBjb25zdCBuZXh0SW5kZXggPSAocG9pbnRJbmRleCArIDEpICUgKHBvaW50c0NvdW50KTtcbiAgICBjb25zdCBwcmVJbmRleCA9ICgocG9pbnRJbmRleCAtIDEpICsgcG9pbnRzQ291bnQpICUgcG9pbnRzQ291bnQ7XG5cbiAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLnBvc2l0aW9uc1tuZXh0SW5kZXhdO1xuICAgIGNvbnN0IHByZVBvaW50ID0gdGhpcy5wb3NpdGlvbnNbcHJlSW5kZXhdO1xuXG4gICAgY29uc3QgZmlyc3RNaWRQb2ludCA9IHRoaXMuc2V0TWlkZGxlVmlydHVhbFBvaW50KHByZVBvaW50LCBwb2ludCk7XG4gICAgY29uc3Qgc2VjTWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChwb2ludCwgbmV4dFBvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIGZpcnN0TWlkUG9pbnQsIHNlY01pZFBvaW50LCBwb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2x5Z29uc0xheWVyKCk7XG5cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUG9seWxpbmVzKCkge1xuICAgIHRoaXMucG9seWxpbmVzLmZvckVhY2gocG9seWxpbmUgPT4gdGhpcy5wb2x5bGluZXNMYXllci5yZW1vdmUocG9seWxpbmUuZ2V0SWQoKSkpO1xuICAgIHRoaXMucG9seWxpbmVzID0gW107XG4gICAgY29uc3QgcmVhbFBvaW50cyA9IHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3MgPT4gIXBvcy5pc1ZpcnR1YWxFZGl0UG9pbnQoKSk7XG4gICAgcmVhbFBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpICUgKHJlYWxQb2ludHMubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG5leHRQb2ludCA9IHJlYWxQb2ludHNbbmV4dEluZGV4XTtcbiAgICAgIGNvbnN0IHBvbHlsaW5lID0gbmV3IEVkaXRQb2x5bGluZSh0aGlzLmlkLCBwb2ludC5nZXRQb3NpdGlvbigpLCBuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy5kZWZhdWx0UG9seWxpbmVQcm9wcyk7XG4gICAgICB0aGlzLnBvbHlsaW5lcy5wdXNoKHBvbHlsaW5lKTtcbiAgICAgIHRoaXMucG9seWxpbmVzTGF5ZXIudXBkYXRlKHBvbHlsaW5lLCBwb2x5bGluZS5nZXRJZCgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZFBvaW50RnJvbUV4aXN0aW5nKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKG5ld1BvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIG5ld1BvaW50KTtcbiAgfVxuXG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBmaXJzdFBvaW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbi5jbG9uZSgpLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIGlmIChlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VWaXJ0dWFsUG9pbnRUb1JlYWxQb2ludChlZGl0UG9pbnQpO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9pbnRzQ291bnQgPSB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgICBjb25zdCBwb2ludEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihlZGl0UG9pbnQpO1xuICAgICAgY29uc3QgbmV4dFZpcnR1YWxQb2ludCA9IHRoaXMucG9zaXRpb25zWyhwb2ludEluZGV4ICsgMSkgJSAocG9pbnRzQ291bnQpXTtcbiAgICAgIGNvbnN0IG5leHRSZWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1socG9pbnRJbmRleCArIDIpICUgKHBvaW50c0NvdW50KV07XG4gICAgICBjb25zdCBwcmV2VmlydHVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKChwb2ludEluZGV4IC0gMSkgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudF07XG4gICAgICBjb25zdCBwcmV2UmVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKChwb2ludEluZGV4IC0gMikgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudF07XG4gICAgICB0aGlzLnVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludChuZXh0VmlydHVhbFBvaW50LCBlZGl0UG9pbnQsIG5leHRSZWFsUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVNaWRkbGVWaXJ0dWFsUG9pbnQocHJldlZpcnR1YWxQb2ludCwgZWRpdFBvaW50LCBwcmV2UmVhbFBvaW50KTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIG5leHRWaXJ0dWFsUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgcHJldlZpcnR1YWxQb2ludCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgZWRpdFBvaW50KTtcbiAgfVxuXG4gIG1vdmVUZW1wTW92aW5nUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLm1vdmVQb2ludCh0b1Bvc2l0aW9uLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlUG9seWdvbihzdGFydE1vdmluZ1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBkcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBzdGFydE1vdmluZ1Bvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhID0gR2VvVXRpbHNTZXJ2aWNlLmdldFBvc2l0aW9uc0RlbHRhKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uLCBkcmFnZ2VkVG9Qb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBHZW9VdGlsc1NlcnZpY2UuYWRkRGVsdGFUb1Bvc2l0aW9uKHBvaW50LmdldFBvc2l0aW9uKCksIGRlbHRhLCB0cnVlKTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnZ2VkVG9Qb3NpdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgcG9pbnQpKTtcbiAgfVxuXG4gIGVuZE1vdmVQb2x5Z29uKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmVtb3ZlUG9pbnQocG9pbnRUb1JlbW92ZTogRWRpdFBvaW50KSB7XG4gICAgdGhpcy5yZW1vdmVQb3NpdGlvbihwb2ludFRvUmVtb3ZlKTtcbiAgICB0aGlzLnBvc2l0aW9uc1xuICAgICAgLmZpbHRlcihwID0+IHAuaXNWaXJ0dWFsRWRpdFBvaW50KCkpXG4gICAgICAuZm9yRWFjaChwID0+IHRoaXMucmVtb3ZlUG9zaXRpb24ocCkpO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcblxuICAgIHRoaXMucmVuZGVyUG9seWxpbmVzKCk7XG4gICAgaWYgKHRoaXMuZ2V0UG9pbnRzQ291bnQoKSA+PSAzKSB7XG4gICAgICB0aGlzLnBvbHlnb25zTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICAgIH1cbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcblxuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UmVhbFBvaW50cygpOiBFZGl0UG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkgJiYgcG9zaXRpb24gIT09IHRoaXMubW92aW5nUG9pbnQpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zSGllcmFyY2h5KCk6IENhcnRlc2lhbjNbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkpLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgfVxuXG4gIGdldFBvc2l0aW9uc0hpZXJhcmNoeUNhbGxiYWNrUHJvcGVydHkoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UG9zaXRpb25zSGllcmFyY2h5LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlUG9zaXRpb24ocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wb3NpdGlvbnMuZmluZEluZGV4KChwKSA9PiBwID09PSBwb2ludCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2x5Z29uc0xheWVyKCkge1xuICAgIGlmICh0aGlzLmdldFBvaW50c0NvdW50KCkgPj0gMykge1xuICAgICAgdGhpcy5wb2x5Z29uc0xheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKHJlbmRlclBvbHlsaW5lcyA9IHRydWUsIC4uLnBvaW50czogRWRpdFBvaW50W10pIHtcbiAgICBpZiAocmVuZGVyUG9seWxpbmVzKSB7XG4gICAgICB0aGlzLnJlbmRlclBvbHlsaW5lcygpO1xuICAgIH1cbiAgICBwb2ludHMuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHAsIHAuZ2V0SWQoKSkpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnBvbHlnb25zTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuXG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChlZGl0UG9pbnQgPT4ge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUoZWRpdFBvaW50LmdldElkKCkpO1xuICAgIH0pO1xuICAgIHRoaXMucG9seWxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLnBvbHlsaW5lc0xheWVyLnJlbW92ZShsaW5lLmdldElkKCkpKTtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5tb3ZpbmdQb2ludC5nZXRJZCgpKTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICBnZXRQb2ludHNDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxufVxuIl19