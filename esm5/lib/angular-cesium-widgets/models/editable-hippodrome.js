/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditableHippodrome = /** @class */ (function (_super) {
    tslib_1.__extends(EditableHippodrome, _super);
    function EditableHippodrome(id, pointsLayer, hippodromeLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.hippodromeLayer = hippodromeLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.done = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.defaultPointProps = editOptions.pointProps;
        _this.hippodromeProps = editOptions.hippodromeProps;
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableHippodrome.prototype, "labels", {
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
    Object.defineProperty(EditableHippodrome.prototype, "hippodromeProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hippodromeProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._hippodromeProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "defaultPointProps", {
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
    Object.defineProperty(EditableHippodrome.prototype, "enableEdit", {
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
                _this.updatePointsLayer(point);
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
    EditableHippodrome.prototype.createFromExisting = /**
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
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
        this.done = true;
    };
    /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    EditableHippodrome.prototype.setPointsManually = /**
     * @param {?} points
     * @param {?=} widthMeters
     * @return {?}
     */
    function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.remove(p.getId()); }));
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, tslib_1.__spread(points));
        this.updateHippdromeLayer();
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addPointFromExisting = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        /** @type {?} */
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.done) {
            return;
        }
        /** @type {?} */
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            /** @type {?} */
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    };
    /**
     * @private
     * @return {?}
     */
    EditableHippodrome.prototype.createHeightEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); })).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
        /** @type {?} */
        var firstP = this.getRealPoints()[0];
        /** @type {?} */
        var secP = this.getRealPoints()[1];
        /** @type {?} */
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        var bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        /** @type {?} */
        var upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        /** @type {?} */
        var downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    };
    /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    EditableHippodrome.prototype.createMiddleEditablePoint = /**
     * @private
     * @param {?} midPointCartesian3
     * @param {?} azimuth
     * @return {?}
     */
    function (midPointCartesian3, azimuth) {
        /** @type {?} */
        var upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        /** @type {?} */
        var midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditableHippodrome.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    };
    /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    EditableHippodrome.prototype.changeWidthByNewPoint = /**
     * @private
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        /** @type {?} */
        var firstP = this.getRealPoints()[0];
        /** @type {?} */
        var secP = this.getRealPoints()[1];
        /** @type {?} */
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        /** @type {?} */
        var bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        /** @type {?} */
        var normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        /** @type {?} */
        var bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        /** @type {?} */
        var fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        /** @type {?} */
        var distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        /** @type {?} */
        var radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
        this.updateHippdromeLayer();
    };
    /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    EditableHippodrome.prototype.moveShape = /**
     * @param {?} startMovingPosition
     * @param {?} draggedToPosition
     * @return {?}
     */
    function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
        }));
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.endMoveShape = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach((/**
         * @param {?} point
         * @return {?}
         */
        function (point) { return _this.updatePointsLayer(point); }));
        this.updateHippdromeLayer();
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.endMovePoint = /**
     * @return {?}
     */
    function () {
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, tslib_1.__spread(this.positions));
    };
    /**
     * @param {?} toPosition
     * @return {?}
     */
    EditableHippodrome.prototype.moveTempMovingPoint = /**
     * @param {?} toPosition
     * @return {?}
     */
    function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    /**
     * @param {?} pointToRemove
     * @return {?}
     */
    EditableHippodrome.prototype.removePoint = /**
     * @param {?} pointToRemove
     * @return {?}
     */
    function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return p.isVirtualEditPoint(); })).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.removePosition(p); }));
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableHippodrome.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getRealPositions = /**
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
    EditableHippodrome.prototype.getRealPositionsCallbackProperty = /**
     * @return {?}
     */
    function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getRealPoints = /**
     * @return {?}
     */
    function () {
        return this.positions.filter((/**
         * @param {?} position
         * @return {?}
         */
        function (position) { return !position.isVirtualEditPoint(); }));
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getWidth = /**
     * @return {?}
     */
    function () {
        return this.hippodromeProps.width;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getPositions = /**
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
    EditableHippodrome.prototype.removePosition = /**
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
     * @param {...?} point
     * @return {?}
     */
    EditableHippodrome.prototype.updatePointsLayer = /**
     * @private
     * @param {...?} point
     * @return {?}
     */
    function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) { return _this.pointsLayer.update(p, p.getId()); }));
    };
    /**
     * @private
     * @return {?}
     */
    EditableHippodrome.prototype.updateHippdromeLayer = /**
     * @private
     * @return {?}
     */
    function () {
        this.hippodromeLayer.update(this, this.id);
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach((/**
         * @param {?} editPoint
         * @return {?}
         */
        function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        }));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getPointsCount = /**
     * @return {?}
     */
    function () {
        return this.positions.length;
    };
    /**
     * @return {?}
     */
    EditableHippodrome.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    return EditableHippodrome;
}(AcEntity));
export { EditableHippodrome };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtaGlwcG9kcm9tZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWhpcHBvZHJvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQU16QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDNUYsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRTlEO0lBQXdDLDhDQUFRO0lBVTlDLDRCQUNVLEVBQVUsRUFDVixXQUE2QixFQUM3QixlQUFpQyxFQUNqQyxtQkFBd0MsRUFDaEQsV0FBa0MsRUFDbEMsU0FBd0I7UUFOMUIsWUFRRSxpQkFBTyxTQVFSO1FBZlMsUUFBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGlCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixxQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFDakMseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQWIxQyxlQUFTLEdBQWdCLEVBQUUsQ0FBQztRQUU1QixVQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFJbkIsYUFBTyxHQUFpQixFQUFFLENBQUM7UUFXakMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDaEQsS0FBSSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDO1FBQ25ELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNwQzthQUFNLElBQUksU0FBUyxFQUFFO1lB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QUM7WUFDbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDOUI7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7OztJQUVELDJDQUFjOzs7SUFBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELGtDQUFLOzs7SUFBTDtRQUNFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBeFNELENBQXdDLFFBQVEsR0F3Uy9DOzs7Ozs7O0lBdlNDLHVDQUFvQzs7Ozs7SUFDcEMseUNBQStCOzs7OztJQUMvQixrQ0FBcUI7Ozs7O0lBQ3JCLHlDQUEyQjs7Ozs7SUFDM0IsZ0RBQXVDOzs7OztJQUN2Qyw4Q0FBMEM7Ozs7O0lBQzFDLG1EQUEwQzs7Ozs7SUFDMUMscUNBQW1DOzs7OztJQUdqQyxnQ0FBa0I7Ozs7O0lBQ2xCLHlDQUFxQzs7Ozs7SUFDckMsNkNBQXlDOzs7OztJQUN6QyxpREFBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEhpcHBvZHJvbWVFZGl0T3B0aW9ucywgSGlwcG9kcm9tZVByb3BzIH0gZnJvbSAnLi9oaXBwb2Ryb21lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlSGlwcG9kcm9tZSBleHRlbmRzIEFjRW50aXR5IHtcbiAgcHJpdmF0ZSBwb3NpdGlvbnM6IEVkaXRQb2ludFtdID0gW107XG4gIHByaXZhdGUgbW92aW5nUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBkb25lID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9kZWZhdWx0UG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfaGlwcG9kcm9tZVByb3BzOiBIaXBwb2Ryb21lUHJvcHM7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9sYWJlbHM6IExhYmVsUHJvcHNbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaWQ6IHN0cmluZyxcbiAgICBwcml2YXRlIHBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgaGlwcG9kcm9tZUxheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBlZGl0T3B0aW9uczogSGlwcG9kcm9tZUVkaXRPcHRpb25zLFxuICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRlZmF1bHRQb2ludFByb3BzID0gZWRpdE9wdGlvbnMucG9pbnRQcm9wcztcbiAgICB0aGlzLmhpcHBvZHJvbWVQcm9wcyA9IGVkaXRPcHRpb25zLmhpcHBvZHJvbWVQcm9wcztcbiAgICBpZiAocG9zaXRpb25zICYmIHBvc2l0aW9ucy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGlwcG9kcm9tZSBjb25zaXN0IG9mIDIgcG9pbnRzIGJ1dCBwcm92aWRlZCAnICsgcG9zaXRpb25zLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaGlwcG9kcm9tZVByb3BzKCk6IEhpcHBvZHJvbWVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2hpcHBvZHJvbWVQcm9wcztcbiAgfVxuXG4gIHNldCBoaXBwb2Ryb21lUHJvcHModmFsdWU6IEhpcHBvZHJvbWVQcm9wcykge1xuICAgIHRoaXMuX2hpcHBvZHJvbWVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBkZWZhdWx0UG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihwb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSkge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlSGlwcGRyb21lTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICB9XG5cbiAgc2V0UG9pbnRzTWFudWFsbHkocG9pbnRzOiBFZGl0UG9pbnRbXSwgd2lkdGhNZXRlcnM/OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcGRhdGUgbWFudWFsbHkgb25seSBpbiBlZGl0IG1vZGUsIGFmdGVyIHBvbHlsaW5lIGlzIGNyZWF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGggPSB3aWR0aE1ldGVycyA/IHdpZHRoTWV0ZXJzIDogdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGg7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHAuZ2V0SWQoKSkpO1xuICAgIHRoaXMucG9zaXRpb25zID0gcG9pbnRzO1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4ucG9pbnRzKTtcbiAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gIH1cblxuICBhZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgdGhpcy5wb3NpdGlvbnMucHVzaChuZXdQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihuZXdQb2ludCk7XG4gIH1cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmaXJzdFBvaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG5cbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpIHtcbiAgICB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocCA9PiBwLmlzVmlydHVhbEVkaXRQb2ludCgpKS5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG5cbiAgICBjb25zdCBmaXJzdFAgPSB0aGlzLmdldFJlYWxQb2ludHMoKVswXTtcbiAgICBjb25zdCBzZWNQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMV07XG5cbiAgICBjb25zdCBtaWRQb2ludENhcnRlc2lhbjMgPSBDZXNpdW0uQ2FydGVzaWFuMy5sZXJwKGZpcnN0UC5nZXRQb3NpdGlvbigpLCBzZWNQLmdldFBvc2l0aW9uKCksIDAuNSwgbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCkpO1xuICAgIGNvbnN0IGJlYXJpbmdEZWcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKGZpcnN0UC5nZXRQb3NpdGlvbigpLCBzZWNQLmdldFBvc2l0aW9uKCkpO1xuXG4gICAgY29uc3QgdXBBemltdXRoID0gQ2VzaXVtLk1hdGgudG9SYWRpYW5zKGJlYXJpbmdEZWcpIC0gTWF0aC5QSSAvIDI7XG4gICAgdGhpcy5jcmVhdGVNaWRkbGVFZGl0YWJsZVBvaW50KG1pZFBvaW50Q2FydGVzaWFuMywgdXBBemltdXRoKTtcbiAgICBjb25zdCBkb3duQXppbXV0aCA9IENlc2l1bS5NYXRoLnRvUmFkaWFucyhiZWFyaW5nRGVnKSArIE1hdGguUEkgLyAyO1xuICAgIHRoaXMuY3JlYXRlTWlkZGxlRWRpdGFibGVQb2ludChtaWRQb2ludENhcnRlc2lhbjMsIGRvd25BemltdXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTWlkZGxlRWRpdGFibGVQb2ludChtaWRQb2ludENhcnRlc2lhbjM6IGFueSwgYXppbXV0aDogbnVtYmVyKSB7XG4gICAgY29uc3QgdXBFZGl0Q2FydGVzaWFuMyA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoXG4gICAgICBtaWRQb2ludENhcnRlc2lhbjMsXG4gICAgICB0aGlzLmhpcHBvZHJvbWVQcm9wcy53aWR0aCAvIDIsXG4gICAgICBhemltdXRoLFxuICAgICAgdHJ1ZSxcbiAgICApO1xuICAgIGNvbnN0IG1pZFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCB1cEVkaXRDYXJ0ZXNpYW4zLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICBtaWRQb2ludC5zZXRWaXJ0dWFsRWRpdFBvaW50KHRydWUpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobWlkUG9pbnQpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgaWYgKCFlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hhbmdlV2lkdGhCeU5ld1BvaW50KHRvUG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hhbmdlV2lkdGhCeU5ld1BvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBmaXJzdFAgPSB0aGlzLmdldFJlYWxQb2ludHMoKVswXTtcbiAgICBjb25zdCBzZWNQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMV07XG4gICAgY29uc3QgbWlkUG9pbnRDYXJ0ZXNpYW4zID0gQ2VzaXVtLkNhcnRlc2lhbjMubGVycChmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpLCAwLjUsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKTtcblxuICAgIGNvbnN0IGJlYXJpbmdEZWcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKG1pZFBvaW50Q2FydGVzaWFuMywgdG9Qb3NpdGlvbik7XG4gICAgbGV0IG5vcm1hbGl6ZWRCZWFyaW5nRGViID0gYmVhcmluZ0RlZztcbiAgICBpZiAoYmVhcmluZ0RlZyA+IDI3MCkge1xuICAgICAgbm9ybWFsaXplZEJlYXJpbmdEZWIgPSBiZWFyaW5nRGVnIC0gMjcwO1xuICAgIH0gZWxzZSBpZiAoYmVhcmluZ0RlZyA+IDE4MCkge1xuICAgICAgbm9ybWFsaXplZEJlYXJpbmdEZWIgPSBiZWFyaW5nRGVnIC0gMTgwO1xuICAgIH1cbiAgICBsZXQgYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpKTtcbiAgICBpZiAoYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzID4gMTgwKSB7XG4gICAgICBiZWFyaW5nRGVnSGlwcG9kcm9tZURvdHMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHNlY1AuZ2V0UG9zaXRpb24oKSwgZmlyc3RQLmdldFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgICBsZXQgZml4ZWRCZWFyaW5nRGVnID1cbiAgICAgIGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cyA+IG5vcm1hbGl6ZWRCZWFyaW5nRGViXG4gICAgICAgID8gYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzIC0gbm9ybWFsaXplZEJlYXJpbmdEZWJcbiAgICAgICAgOiBub3JtYWxpemVkQmVhcmluZ0RlYiAtIGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cztcblxuICAgIGlmIChiZWFyaW5nRGVnID4gMjcwKSB7XG4gICAgICBmaXhlZEJlYXJpbmdEZWcgPSBiZWFyaW5nRGVnIC0gYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlTWV0ZXJzID0gTWF0aC5hYnMoR2VvVXRpbHNTZXJ2aWNlLmRpc3RhbmNlKG1pZFBvaW50Q2FydGVzaWFuMywgdG9Qb3NpdGlvbikpO1xuICAgIGNvbnN0IHJhZGl1c1dpZHRoID0gTWF0aC5zaW4oQ2VzaXVtLk1hdGgudG9SYWRpYW5zKGZpeGVkQmVhcmluZ0RlZykpICogZGlzdGFuY2VNZXRlcnM7XG5cbiAgICB0aGlzLmhpcHBvZHJvbWVQcm9wcy53aWR0aCA9IE1hdGguYWJzKHJhZGl1c1dpZHRoKSAqIDI7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICB9XG5cbiAgbW92ZVNoYXBlKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBzdGFydE1vdmluZ1Bvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhID0gR2VvVXRpbHNTZXJ2aWNlLmdldFBvc2l0aW9uc0RlbHRhKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uLCBkcmFnZ2VkVG9Qb3NpdGlvbik7XG4gICAgdGhpcy5nZXRSZWFsUG9pbnRzKCkuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBHZW9VdGlsc1NlcnZpY2UuYWRkRGVsdGFUb1Bvc2l0aW9uKHBvaW50LmdldFBvc2l0aW9uKCksIGRlbHRhLCB0cnVlKTtcbiAgICB9KTtcbiAgICB0aGlzLmNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnZ2VkVG9Qb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVTaGFwZSgpIHtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNyZWF0ZUhlaWdodEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHBvaW50ID0+IHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIocG9pbnQpKTtcbiAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gIH1cblxuICBlbmRNb3ZlUG9pbnQoKSB7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gIH1cblxuICBtb3ZlVGVtcE1vdmluZ1BvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5tb3ZlUG9pbnQodG9Qb3NpdGlvbiwgdGhpcy5tb3ZpbmdQb2ludCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlUG9pbnQocG9pbnRUb1JlbW92ZTogRWRpdFBvaW50KSB7XG4gICAgdGhpcy5yZW1vdmVQb3NpdGlvbihwb2ludFRvUmVtb3ZlKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocCA9PiBwLmlzVmlydHVhbEVkaXRQb2ludCgpKS5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG4gIH1cblxuICBhZGRMYXN0UG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24odGhpcy5tb3ZpbmdQb2ludCk7IC8vIHJlbW92ZSBtb3ZpbmdQb2ludFxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLmdldFJlYWxQb2ludHMoKS5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWFsUG9zaXRpb25zQ2FsbGJhY2tQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UmVhbFBvc2l0aW9ucy5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRSZWFsUG9pbnRzKCk6IEVkaXRQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvc2l0aW9uID0+ICFwb3NpdGlvbi5pc1ZpcnR1YWxFZGl0UG9pbnQoKSk7XG4gIH1cblxuICBnZXRXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmhpcHBvZHJvbWVQcm9wcy53aWR0aDtcbiAgfVxuXG4gIGdldFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVBvc2l0aW9uKHBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucG9zaXRpb25zLmZpbmRJbmRleChwID0+IHAgPT09IHBvaW50KTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUocG9pbnQuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKC4uLnBvaW50OiBFZGl0UG9pbnRbXSkge1xuICAgIHBvaW50LmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZShwLCBwLmdldElkKCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlSGlwcGRyb21lTGF5ZXIoKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmhpcHBvZHJvbWVMYXllci5yZW1vdmUodGhpcy5pZCk7XG5cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKGVkaXRQb2ludCA9PiB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XG4gICAgfSk7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMubW92aW5nUG9pbnQuZ2V0SWQoKSk7XG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgZ2V0UG9pbnRzQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cbn1cbiJdfQ==