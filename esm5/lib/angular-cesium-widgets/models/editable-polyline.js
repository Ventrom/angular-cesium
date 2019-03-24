/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditablePolyline = /** @class */ (function (_super) {
    tslib_1.__extends(EditablePolyline, _super);
    function EditablePolyline(id, pointsLayer, polylinesLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.editOptions = editOptions;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this._pointProps = editOptions.pointProps;
        _this.props = editOptions.polylineProps;
        if (positions && positions.length >= 2) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolyline.prototype, "labels", {
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
    Object.defineProperty(EditablePolyline.prototype, "props", {
        get: /**
         * @return {?}
         */
        function () {
            return this.polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "pointProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pointProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "enableEdit", {
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
    EditablePolyline.prototype.createFromExisting = /**
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
        this.doneCreation = true;
    };
    /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    EditablePolyline.prototype.setManually = /**
     * @param {?} points
     * @param {?=} polylineProps
     * @return {?}
     */
    function (points, polylineProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
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
                newPoint = new EditPoint(this.id, pointOrCartesian, this._pointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polylineProps = polylineProps ? polylineProps : this.polylineProps;
        this.updatePointsLayer.apply(this, tslib_1.__spread([true], this.positions));
        this.addAllVirtualEditPoints();
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolyline.prototype.addAllVirtualEditPoints = /**
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
            if (index !== currentPoints.length - 1) {
                /** @type {?} */
                var currentPoint = pos;
                /** @type {?} */
                var nextIndex = (index + 1) % (currentPoints.length);
                /** @type {?} */
                var nextPoint = currentPoints[nextIndex];
                /** @type {?} */
                var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
                _this.updatePointsLayer(false, midPoint);
            }
        }));
    };
    /**
     * @private
     * @param {?} firstP
     * @param {?} secondP
     * @return {?}
     */
    EditablePolyline.prototype.setMiddleVirtualPoint = /**
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
        var midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
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
    EditablePolyline.prototype.updateMiddleVirtualPoint = /**
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
    EditablePolyline.prototype.changeVirtualPointToRealPoint = /**
     * @param {?} point
     * @return {?}
     */
    function (point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        // actual point becomes a real point
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
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    };
    /**
     * @private
     * @return {?}
     */
    EditablePolyline.prototype.renderPolylines = /**
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
         * @param {?} point
         * @return {?}
         */
        function (point) { return !point.isVirtualEditPoint(); }));
        realPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            if (index !== realPoints.length - 1) {
                /** @type {?} */
                var nextIndex = (index + 1);
                /** @type {?} */
                var nextPoint = realPoints[nextIndex];
                /** @type {?} */
                var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.polylineProps);
                _this.polylines.push(polyline);
                _this.polylinesLayer.update(polyline, polyline.getId());
            }
        }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addPoint = /**
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
            var firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditablePolyline.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            /** @type {?} */
            var pointsCount = this.positions.length;
            /** @type {?} */
            var pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                /** @type {?} */
                var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                /** @type {?} */
                var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
                this.updatePointsLayer(false, nextVirtualPoint);
            }
            if (pointIndex > 0) {
                /** @type {?} */
                var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                /** @type {?} */
                var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
                this.updatePointsLayer(false, prevVirtualPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditablePolyline.prototype.moveTempMovingPoint = /**
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
    EditablePolyline.prototype.moveShape = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
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
        this.updatePointsLayer.apply(this, tslib_1.__spread([true], this.positions));
        this.lastDraggedToPosition = draggedToPosition;
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.endMoveShape = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer.apply(this, tslib_1.__spread([true], this.positions));
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditablePolyline.prototype.removePoint = /**
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
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditablePolyline.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getRealPositions = /**
     * @return {?}
     */
    function () {
        return this.getRealPoints()
            .map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return this.positions
            .filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getPositions = /**
     * @return {?}
     */
    function () {
        return this.positions.map((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return position.getPosition(); }));
    };
    /**
     * @private
     * @param {?} point
     * @return {?}
     */
    EditablePolyline.prototype.removePosition = /**
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
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    EditablePolyline.prototype.updatePointsLayer = /**
     * @private
     * @param {?=} renderPolylines
     * @param {...?} point
     * @return {?}
     */
    function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var point = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            point[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.update = /**
     * @return {?}
     */
    function () {
        this.updatePointsLayer();
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
    EditablePolyline.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditablePolyline.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditablePolyline;
}(AcEntity));
export { EditablePolyline };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWxpbmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1wb2x5bGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUsvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDNUYsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRTlEO0lBQXNDLDRDQUFRO0lBWTVDLDBCQUFvQixFQUFVLEVBQ1YsV0FBNkIsRUFDN0IsY0FBZ0MsRUFDaEMsbUJBQXdDLEVBQ3hDLFdBQWdDLEVBQ3hDLFNBQXdCO1FBTHBDLFlBTUUsaUJBQU8sU0FNUjtRQVptQixRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsaUJBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG9CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGlCQUFXLEdBQVgsV0FBVyxDQUFxQjtRQWY1QyxlQUFTLEdBQWdCLEVBQUUsQ0FBQztRQUU1QixlQUFTLEdBQW1CLEVBQUUsQ0FBQztRQUUvQixrQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVNqQyxLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDMUMsS0FBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBQ3ZDLElBQUksU0FBUyxJQUFJLFNBQVMs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VyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7OztJQUVELHlDQUFjOzs7SUFBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELGdDQUFLOzs7SUFBTDtRQUNFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBOVRELENBQXNDLFFBQVEsR0E4VDdDOzs7Ozs7O0lBN1RDLHFDQUFvQzs7Ozs7SUFFcEMscUNBQXVDOzs7OztJQUN2Qyx1Q0FBK0I7Ozs7O0lBQy9CLHdDQUE2Qjs7Ozs7SUFDN0IsdUNBQTJCOzs7OztJQUMzQix1Q0FBZ0M7Ozs7O0lBQ2hDLHlDQUFxQzs7Ozs7SUFDckMsaURBQW1DOzs7OztJQUNuQyxtQ0FBbUM7Ozs7O0lBRXZCLDhCQUFrQjs7Ozs7SUFDbEIsdUNBQXFDOzs7OztJQUNyQywwQ0FBd0M7Ozs7O0lBQ3hDLCtDQUFnRDs7Ozs7SUFDaEQsdUNBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4vZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBFZGl0UG9seWxpbmUgfSBmcm9tICcuL2VkaXQtcG9seWxpbmUnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzLCBQb2x5bGluZUVkaXRPcHRpb25zLCBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBvbHlsaW5lIGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIHBvc2l0aW9uczogRWRpdFBvaW50W10gPSBbXTtcblxuICBwcml2YXRlIHBvbHlsaW5lczogRWRpdFBvbHlsaW5lW10gPSBbXTtcbiAgcHJpdmF0ZSBtb3ZpbmdQb2ludDogRWRpdFBvaW50O1xuICBwcml2YXRlIGRvbmVDcmVhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfcG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBwb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogYW55O1xuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwb2x5bGluZXNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGVkaXRPcHRpb25zOiBQb2x5bGluZUVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSBlZGl0T3B0aW9ucy5wb2ludFByb3BzO1xuICAgIHRoaXMucHJvcHMgPSBlZGl0T3B0aW9ucy5wb2x5bGluZVByb3BzO1xuICAgIGlmIChwb3NpdGlvbnMgJiYgcG9zaXRpb25zLmxlbmd0aCA+PSAyKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uc1tpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLnBvbHlsaW5lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2ludFByb3BzO1xuICB9XG5cbiAgc2V0IHBvaW50UHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLl9wb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgcG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gIH1cblxuICBzZXRNYW51YWxseShwb2ludHM6IHtcbiAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICBwb2ludFByb3A/OiBQb2ludFByb3BzXG4gIH1bXSB8IENhcnRlc2lhbjNbXSwgcG9seWxpbmVQcm9wcz86IFBvbHlsaW5lUHJvcHMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcG9seWxpbmUgaXMgY3JlYXRlZCcpO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci5yZW1vdmUocC5nZXRJZCgpKSk7XG5cbiAgICBjb25zdCBuZXdQb2ludHM6IEVkaXRQb2ludFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvaW50T3JDYXJ0ZXNpYW46IGFueSA9IHBvaW50c1tpXTtcbiAgICAgIGxldCBuZXdQb2ludCA9IG51bGw7XG4gICAgICBpZiAocG9pbnRPckNhcnRlc2lhbi5wb2ludFByb3BzKSB7XG4gICAgICAgIG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb2ludE9yQ2FydGVzaWFuLnBvc2l0aW9uLCBwb2ludE9yQ2FydGVzaWFuLnBvaW50UHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvaW50T3JDYXJ0ZXNpYW4sIHRoaXMuX3BvaW50UHJvcHMpO1xuICAgICAgfVxuICAgICAgbmV3UG9pbnRzLnB1c2gobmV3UG9pbnQpO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1BvaW50cztcbiAgICB0aGlzLnBvbHlsaW5lUHJvcHMgPSBwb2x5bGluZVByb3BzID8gcG9seWxpbmVQcm9wcyA6IHRoaXMucG9seWxpbmVQcm9wcztcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKSB7XG4gICAgY29uc3QgY3VycmVudFBvaW50cyA9IFsuLi50aGlzLnBvc2l0aW9uc107XG4gICAgY3VycmVudFBvaW50cy5mb3JFYWNoKChwb3MsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggIT09IGN1cnJlbnRQb2ludHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UG9pbnQgPSBwb3M7XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpICUgKGN1cnJlbnRQb2ludHMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbmV4dFBvaW50ID0gY3VycmVudFBvaW50c1tuZXh0SW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IG1pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQoY3VycmVudFBvaW50LCBuZXh0UG9pbnQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIG1pZFBvaW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TWlkZGxlVmlydHVhbFBvaW50KGZpcnN0UDogRWRpdFBvaW50LCBzZWNvbmRQOiBFZGl0UG9pbnQpOiBFZGl0UG9pbnQge1xuICAgIGNvbnN0IGN1cnJlbnRDYXJ0ID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGZpcnN0UC5nZXRQb3NpdGlvbigpKTtcbiAgICBjb25zdCBuZXh0Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihzZWNvbmRQLmdldFBvc2l0aW9uKCkpO1xuICAgIGNvbnN0IG1pZFBvaW50Q2FydGVzaWFuMyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5taWRQb2ludFRvQ2FydGVzaWFuMyhjdXJyZW50Q2FydCwgbmV4dENhcnQpO1xuICAgIGNvbnN0IG1pZFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBtaWRQb2ludENhcnRlc2lhbjMsIHRoaXMuX3BvaW50UHJvcHMpO1xuICAgIG1pZFBvaW50LnNldFZpcnR1YWxFZGl0UG9pbnQodHJ1ZSk7XG5cbiAgICBjb25zdCBmaXJzdEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihmaXJzdFApO1xuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShmaXJzdEluZGV4ICsgMSwgMCwgbWlkUG9pbnQpO1xuICAgIHJldHVybiBtaWRQb2ludDtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KHZpcnR1YWxFZGl0UG9pbnQ6IEVkaXRQb2ludCwgcHJldlBvaW50OiBFZGl0UG9pbnQsIG5leHRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgcHJldlBvaW50Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihwcmV2UG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgY29uc3QgbmV4dFBvaW50Q2FydCA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgdmlydHVhbEVkaXRQb2ludC5zZXRQb3NpdGlvbih0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIubWlkUG9pbnRUb0NhcnRlc2lhbjMocHJldlBvaW50Q2FydCwgbmV4dFBvaW50Q2FydCkpO1xuICB9XG5cbiAgY2hhbmdlVmlydHVhbFBvaW50VG9SZWFsUG9pbnQocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHBvaW50LnNldFZpcnR1YWxFZGl0UG9pbnQoZmFsc2UpOyAvLyBhY3R1YWwgcG9pbnQgYmVjb21lcyBhIHJlYWwgcG9pbnRcbiAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBjb25zdCBwb2ludEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihwb2ludCk7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCk7XG4gICAgY29uc3QgcHJlSW5kZXggPSAoKHBvaW50SW5kZXggLSAxKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50O1xuXG4gICAgY29uc3QgbmV4dFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbbmV4dEluZGV4XTtcbiAgICBjb25zdCBwcmVQb2ludCA9IHRoaXMucG9zaXRpb25zW3ByZUluZGV4XTtcblxuICAgIGNvbnN0IGZpcnN0TWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChwcmVQb2ludCwgcG9pbnQpO1xuICAgIGNvbnN0IHNlY01pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQocG9pbnQsIG5leHRQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgZmlyc3RNaWRQb2ludCwgc2VjTWlkUG9pbnQsIHBvaW50KTtcblxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQb2x5bGluZXMoKSB7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChwb2x5bGluZSA9PiB0aGlzLnBvbHlsaW5lc0xheWVyLnJlbW92ZShwb2x5bGluZS5nZXRJZCgpKSk7XG4gICAgdGhpcy5wb2x5bGluZXMgPSBbXTtcbiAgICBjb25zdCByZWFsUG9pbnRzID0gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvaW50ID0+ICFwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSk7XG4gICAgcmVhbFBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCAhPT0gcmVhbFBvaW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpO1xuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSByZWFsUG9pbnRzW25leHRJbmRleF07XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gbmV3IEVkaXRQb2x5bGluZSh0aGlzLmlkLCBwb2ludC5nZXRQb3NpdGlvbigpLCBuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy5wb2x5bGluZVByb3BzKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZXMucHVzaChwb2x5bGluZSk7XG4gICAgICAgIHRoaXMucG9seWxpbmVzTGF5ZXIudXBkYXRlKHBvbHlsaW5lLCBwb2x5bGluZS5nZXRJZCgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFkZFBvaW50RnJvbUV4aXN0aW5nKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLl9wb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKG5ld1BvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIG5ld1BvaW50KTtcbiAgfVxuXG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5fcG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBmaXJzdFBvaW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbi5jbG9uZSgpLCB0aGlzLl9wb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIGlmIChlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VWaXJ0dWFsUG9pbnRUb1JlYWxQb2ludChlZGl0UG9pbnQpO1xuICAgICAgfVxuICAgICAgY29uc3QgcG9pbnRzQ291bnQgPSB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgICBjb25zdCBwb2ludEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihlZGl0UG9pbnQpO1xuXG4gICAgICBpZiAocG9pbnRJbmRleCA8IHRoaXMucG9zaXRpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY29uc3QgbmV4dFZpcnR1YWxQb2ludCA9IHRoaXMucG9zaXRpb25zWyhwb2ludEluZGV4ICsgMSkgJSAocG9pbnRzQ291bnQpXTtcbiAgICAgICAgY29uc3QgbmV4dFJlYWxQb2ludCA9IHRoaXMucG9zaXRpb25zWyhwb2ludEluZGV4ICsgMikgJSAocG9pbnRzQ291bnQpXTtcbiAgICAgICAgdGhpcy51cGRhdGVNaWRkbGVWaXJ0dWFsUG9pbnQobmV4dFZpcnR1YWxQb2ludCwgZWRpdFBvaW50LCBuZXh0UmVhbFBvaW50KTtcbiAgICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgbmV4dFZpcnR1YWxQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRJbmRleCA+IDApIHtcbiAgICAgICAgY29uc3QgcHJldlZpcnR1YWxQb2ludCA9IHRoaXMucG9zaXRpb25zWygocG9pbnRJbmRleCAtIDEpICsgcG9pbnRzQ291bnQpICUgcG9pbnRzQ291bnRdO1xuICAgICAgICBjb25zdCBwcmV2UmVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKChwb2ludEluZGV4IC0gMikgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudF07XG4gICAgICAgIHRoaXMudXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KHByZXZWaXJ0dWFsUG9pbnQsIGVkaXRQb2ludCwgcHJldlJlYWxQb2ludCk7XG4gICAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIHByZXZWaXJ0dWFsUG9pbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIGVkaXRQb2ludCk7XG4gIH1cblxuICBtb3ZlVGVtcE1vdmluZ1BvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5tb3ZlUG9pbnQodG9Qb3NpdGlvbiwgdGhpcy5tb3ZpbmdQb2ludCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZVNoYXBlKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHN0YXJ0TW92aW5nUG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgZGVsdGEgPSBHZW9VdGlsc1NlcnZpY2UuZ2V0UG9zaXRpb25zRGVsdGEodGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24sIGRyYWdnZWRUb1Bvc2l0aW9uKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHtcbiAgICAgIEdlb1V0aWxzU2VydmljZS5hZGREZWx0YVRvUG9zaXRpb24ocG9pbnQuZ2V0UG9zaXRpb24oKSwgZGVsdGEsIHRydWUpO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ2dlZFRvUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlU2hhcGUoKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCAuLi50aGlzLnBvc2l0aW9ucyk7XG4gIH1cblxuICByZW1vdmVQb2ludChwb2ludFRvUmVtb3ZlOiBFZGl0UG9pbnQpIHtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHBvaW50VG9SZW1vdmUpO1xuICAgIHRoaXMucG9zaXRpb25zXG4gICAgICAuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSlcbiAgICAgIC5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuXG4gICAgdGhpcy5yZW5kZXJQb2x5bGluZXMoKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcblxuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKClcbiAgICAgIC5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWFsUG9pbnRzKCk6IEVkaXRQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNcbiAgICAgIC5maWx0ZXIocG9zaXRpb24gPT4gIXBvc2l0aW9uLmlzVmlydHVhbEVkaXRQb2ludCgpICYmIHBvc2l0aW9uICE9PSB0aGlzLm1vdmluZ1BvaW50KTtcbiAgfVxuXG4gIGdldFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVBvc2l0aW9uKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucG9zaXRpb25zLmZpbmRJbmRleCgocCkgPT4gcCA9PT0gcG9pbnQpO1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIocmVuZGVyUG9seWxpbmVzID0gdHJ1ZSwgLi4ucG9pbnQ6IEVkaXRQb2ludFtdKSB7XG4gICAgaWYgKHJlbmRlclBvbHlsaW5lcykge1xuICAgICAgdGhpcy5yZW5kZXJQb2x5bGluZXMoKTtcbiAgICB9XG4gICAgcG9pbnQuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHAsIHAuZ2V0SWQoKSkpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChlZGl0UG9pbnQgPT4ge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUoZWRpdFBvaW50LmdldElkKCkpO1xuICAgIH0pO1xuICAgIHRoaXMucG9seWxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLnBvbHlsaW5lc0xheWVyLnJlbW92ZShsaW5lLmdldElkKCkpKTtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5tb3ZpbmdQb2ludC5nZXRJZCgpKTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICBnZXRQb2ludHNDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxufVxuIl19