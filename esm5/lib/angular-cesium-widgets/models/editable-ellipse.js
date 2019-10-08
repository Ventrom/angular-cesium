/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditableEllipse = /** @class */ (function (_super) {
    tslib_1.__extends(EditableEllipse, _super);
    function EditableEllipse(id, ellipsesLayer, pointsLayer, coordinateConverter, options) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.ellipsesLayer = ellipsesLayer;
        _this.pointsLayer = pointsLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.options = options;
        _this._rotation = 0;
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._minorRadiusPoints = [];
        _this._labels = [];
        _this._ellipseProps = options.ellipseProps;
        _this._pointProps = options.pointProps;
        return _this;
    }
    Object.defineProperty(EditableEllipse.prototype, "labels", {
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
            var _this = this;
            if (!labels || !this._center) {
                return;
            }
            this._labels = labels.map((/**
             * @param {?} label
             * @param {?} index
             * @return {?}
             */
            function (label, index) {
                if (!label.position) {
                    if (index === 0) {
                        label.position = _this._center.getPosition();
                    }
                    else if (index === 1) {
                        label.position = _this._majorRadiusPoint
                            ? Cesium.Cartesian3.midpoint(_this.getCenter(), _this._majorRadiusPoint.getPosition(), new Cesium.Cartesian3())
                            : new Cesium.Cartesian3();
                    }
                    else if (index === 2) {
                        label.position =
                            _this._minorRadiusPoints.length > 0 && _this._minorRadius
                                ? Cesium.Cartesian3.midpoint(_this.getCenter(), _this.getMinorRadiusPointPosition(), new Cesium.Cartesian3())
                                : new Cesium.Cartesian3();
                    }
                }
                return Object.assign({}, defaultLabelProps, label);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "polylineProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._polylineProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "pointProps", {
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
    Object.defineProperty(EditableEllipse.prototype, "ellipseProps", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ellipseProps;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._ellipseProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "center", {
        get: /**
         * @return {?}
         */
        function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "majorRadiusPoint", {
        get: /**
         * @return {?}
         */
        function () {
            return this._majorRadiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadiusPointPosition = /**
     * @return {?}
     */
    function () {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadiusPointPosition = /**
     * @return {?}
     */
    function () {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    };
    Object.defineProperty(EditableEllipse.prototype, "enableEdit", {
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
            this._enableEdit = value;
            this._center.show = value;
            this._majorRadiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
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
    EditableEllipse.prototype.setManually = /**
     * @param {?} center
     * @param {?} majorRadius
     * @param {?=} rotation
     * @param {?=} minorRadius
     * @param {?=} centerPointProp
     * @param {?=} radiusPointProp
     * @param {?=} ellipseProp
     * @return {?}
     */
    function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
        if (rotation === void 0) { rotation = Math.PI / 2; }
        if (centerPointProp === void 0) { centerPointProp = this.pointProps; }
        if (radiusPointProp === void 0) { radiusPointProp = this.pointProps; }
        if (ellipseProp === void 0) { ellipseProp = this.ellipseProps; }
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
        var majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);
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
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableEllipse.prototype.addPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
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
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.transformToEllipse = /**
     * @return {?}
     */
    function () {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    /**
     * @param {?} position
     * @return {?}
     */
    EditableEllipse.prototype.addLastPoint = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        var newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
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
    };
    /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    EditableEllipse.prototype.movePoint = /**
     * @param {?} toPosition
     * @param {?} editPoint
     * @return {?}
     */
    function (toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        /** @type {?} */
        var newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
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
    };
    /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    EditableEllipse.prototype.moveEllipse = /**
     * @param {?} dragStartPosition
     * @param {?} dragEndPosition
     * @return {?}
     */
    function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        /** @type {?} */
        var majorRadius = this.getMajorRadius();
        /** @type {?} */
        var rotation = this.getRotation();
        /** @type {?} */
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.endMoveEllipse = /**
     * @return {?}
     */
    function () {
        this.lastDraggedToPosition = undefined;
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updateMinorRadiusEditPoints = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._minorRadius === undefined) {
            return;
        }
        if (this._minorRadiusPoints.length === 0) {
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cesium.Cartesian3(), this.pointProps, true));
        }
        this._minorRadiusPoints[0].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2));
        this._minorRadiusPoints[1].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2));
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadius = /**
     * @return {?}
     */
    function () {
        return this._majorRadius || 0;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadius = /**
     * @return {?}
     */
    function () {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getRotation = /**
     * @return {?}
     */
    function () {
        return this._rotation || 0;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.updateRotation = /**
     * @return {?}
     */
    function () {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        /** @type {?} */
        var azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getRotationCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return Math.PI / 2 - _this.getRotation(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMinorRadiusCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getMinorRadius(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getMajorRadiusCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getMajorRadius(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getCenter = /**
     * @return {?}
     */
    function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getCenterCallbackProperty = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Cesium.CallbackProperty((/**
         * @return {?}
         */
        function () { return _this.getCenter(); }), false);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.dispose = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
            function (point) { return _this.pointsLayer.remove(point.getId()); }));
        }
        this.ellipsesLayer.remove(this.id);
    };
    /**
     * @return {?}
     */
    EditableEllipse.prototype.getId = /**
     * @return {?}
     */
    function () {
        return this.id;
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updateEllipsesLayer = /**
     * @private
     * @return {?}
     */
    function () {
        this.ellipsesLayer.update(this, this.id);
    };
    /**
     * @private
     * @return {?}
     */
    EditableEllipse.prototype.updatePointsLayer = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    return EditableEllipse;
}(AcEntity));
export { EditableEllipse };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtZWxsaXBzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWVsbGlwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFHNUYsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRzlEO0lBQXFDLDJDQUFRO0lBZTNDLHlCQUNVLEVBQVUsRUFDVixhQUErQixFQUMvQixXQUE2QixFQUM3QixtQkFBd0MsRUFDeEMsT0FBMkI7UUFMckMsWUFPRSxpQkFBTyxTQUdSO1FBVFMsUUFBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLG1CQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUMvQixpQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0IseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxhQUFPLEdBQVAsT0FBTyxDQUFvQjtRQWY3QixlQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2Qsa0JBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsaUJBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsd0JBQWtCLEdBQWdCLEVBQUUsQ0FBQztRQUtyQyxhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVVqQyxLQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDMUMsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDOztJQUN4QyxDQUFDO0lBRUQsc0JBQUksbUNBQU07Ozs7UUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7OztRQUVE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QW1DOzs7OztJQUNuQyx3Q0FBb0M7Ozs7O0lBQ3BDLHNDQUFnQzs7Ozs7SUFDaEMseUNBQXNDOzs7OztJQUN0QyxrQ0FBbUM7Ozs7O0lBR2pDLDZCQUFrQjs7Ozs7SUFDbEIsd0NBQXVDOzs7OztJQUN2QyxzQ0FBcUM7Ozs7O0lBQ3JDLDhDQUFnRDs7Ozs7SUFDaEQsa0NBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4vZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBFbGxpcHNlRWRpdE9wdGlvbnMsIEVsbGlwc2VQcm9wcyB9IGZyb20gJy4vZWxsaXBzZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcywgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZUVsbGlwc2UgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgX2NlbnRlcjogRWRpdFBvaW50O1xuICBwcml2YXRlIF9tYWpvclJhZGl1c1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX21ham9yUmFkaXVzOiBudW1iZXI7XG4gIHByaXZhdGUgX21pbm9yUmFkaXVzOiBudW1iZXI7XG4gIHByaXZhdGUgX3JvdGF0aW9uID0gMDtcbiAgcHJpdmF0ZSBkb25lQ3JlYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgX21pbm9yUmFkaXVzUG9pbnRzOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogYW55O1xuICBwcml2YXRlIF9lbGxpcHNlUHJvcHM6IEVsbGlwc2VQcm9wcztcbiAgcHJpdmF0ZSBfcG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfcG9seWxpbmVQcm9wczogUG9seWxpbmVQcm9wcztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBlbGxpcHNlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgb3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2VsbGlwc2VQcm9wcyA9IG9wdGlvbnMuZWxsaXBzZVByb3BzO1xuICAgIHRoaXMuX3BvaW50UHJvcHMgPSBvcHRpb25zLnBvaW50UHJvcHM7XG4gIH1cblxuICBnZXQgbGFiZWxzKCk6IExhYmVsUHJvcHNbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVscztcbiAgfVxuXG4gIHNldCBsYWJlbHMobGFiZWxzOiBMYWJlbFByb3BzW10pIHtcbiAgICBpZiAoIWxhYmVscyB8fCAhdGhpcy5fY2VudGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgICAgbGFiZWwucG9zaXRpb24gPSB0aGlzLl9tYWpvclJhZGl1c1BvaW50XG4gICAgICAgICAgICA/IENlc2l1bS5DYXJ0ZXNpYW4zLm1pZHBvaW50KHRoaXMuZ2V0Q2VudGVyKCksIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKSwgbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCkpXG4gICAgICAgICAgICA6IG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpO1xuICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAyKSB7XG4gICAgICAgICAgbGFiZWwucG9zaXRpb24gPVxuICAgICAgICAgICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHMubGVuZ3RoID4gMCAmJiB0aGlzLl9taW5vclJhZGl1c1xuICAgICAgICAgICAgICA/IENlc2l1bS5DYXJ0ZXNpYW4zLm1pZHBvaW50KHRoaXMuZ2V0Q2VudGVyKCksIHRoaXMuZ2V0TWlub3JSYWRpdXNQb2ludFBvc2l0aW9uKCksIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKVxuICAgICAgICAgICAgICA6IG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHBvbHlsaW5lUHJvcHMoKTogUG9seWxpbmVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3BvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgcG9seWxpbmVQcm9wcyh2YWx1ZTogUG9seWxpbmVQcm9wcykge1xuICAgIHRoaXMuX3BvbHlsaW5lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2ludFByb3BzO1xuICB9XG5cbiAgc2V0IHBvaW50UHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLl9wb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZWxsaXBzZVByb3BzKCk6IEVsbGlwc2VQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2VsbGlwc2VQcm9wcztcbiAgfVxuXG4gIHNldCBlbGxpcHNlUHJvcHModmFsdWU6IEVsbGlwc2VQcm9wcykge1xuICAgIHRoaXMuX2VsbGlwc2VQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gIH1cblxuICBnZXQgbWFqb3JSYWRpdXNQb2ludCgpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLl9tYWpvclJhZGl1c1BvaW50O1xuICB9XG5cbiAgZ2V0TWFqb3JSYWRpdXNQb2ludFBvc2l0aW9uKCkge1xuICAgIGlmICghdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgZ2V0TWlub3JSYWRpdXNQb2ludFBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xuICAgIGlmICh0aGlzLl9taW5vclJhZGl1c1BvaW50cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9taW5vclJhZGl1c1BvaW50c1swXS5nZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZUVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZUVkaXQ7XG4gIH1cblxuICBzZXQgZW5hYmxlRWRpdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VuYWJsZUVkaXQgPSB2YWx1ZTtcbiAgICB0aGlzLl9jZW50ZXIuc2hvdyA9IHZhbHVlO1xuICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KFxuICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICBtYWpvclJhZGl1czogbnVtYmVyLFxuICAgIHJvdGF0aW9uID0gTWF0aC5QSSAvIDIsXG4gICAgbWlub3JSYWRpdXM/OiBudW1iZXIsXG4gICAgY2VudGVyUG9pbnRQcm9wID0gdGhpcy5wb2ludFByb3BzLFxuICAgIHJhZGl1c1BvaW50UHJvcCA9IHRoaXMucG9pbnRQcm9wcyxcbiAgICBlbGxpcHNlUHJvcCA9IHRoaXMuZWxsaXBzZVByb3BzLFxuICApIHtcbiAgICBpZiAobWFqb3JSYWRpdXMgPCBtaW5vclJhZGl1cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWpvciByYWRpdXMgbXVzZSBiZSBlcXVhbCBvciBncmVhdGVyIHRoYW4gbWlub3IgcmFkaXVzJyk7XG4gICAgfVxuICAgIHRoaXMuX3JvdGF0aW9uID0gcm90YXRpb247XG4gICAgdGhpcy5fbWFqb3JSYWRpdXMgPSBtYWpvclJhZGl1cztcbiAgICBpZiAoIXRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5fY2VudGVyID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBjZW50ZXIsIGNlbnRlclBvaW50UHJvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NlbnRlci5zZXRQb3NpdGlvbihjZW50ZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IG1ham9yUmFkaXVzUG9zaXRpb24gPSBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuY2VudGVyLmdldFBvc2l0aW9uKCksIG1ham9yUmFkaXVzLCByb3RhdGlvbik7XG5cbiAgICBpZiAoIXRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIG1ham9yUmFkaXVzUG9zaXRpb24sIHJhZGl1c1BvaW50UHJvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24obWFqb3JSYWRpdXNQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKG1pbm9yUmFkaXVzKSB7XG4gICAgICB0aGlzLl9taW5vclJhZGl1cyA9IG1pbm9yUmFkaXVzO1xuICAgIH1cblxuICAgIHRoaXMuZWxsaXBzZVByb3BzID0gZWxsaXBzZVByb3A7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZXNMYXllcigpO1xuICB9XG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5fY2VudGVyID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5wb2ludFByb3BzKTtcbiAgICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLmNsb25lKCksIHRoaXMucG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLl9tYWpvclJhZGl1cyA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVSb3RhdGlvbigpO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZXNMYXllcigpO1xuICB9XG5cbiAgdHJhbnNmb3JtVG9FbGxpcHNlKCkge1xuICAgIGlmICh0aGlzLl9taW5vclJhZGl1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21pbm9yUmFkaXVzID0gdGhpcy5nZXRNYWpvclJhZGl1cygpO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZXNMYXllcigpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uIHx8ICF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdSYWRpdXMgPSBHZW9VdGlsc1NlcnZpY2UuZGlzdGFuY2UodGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCksIHBvc2l0aW9uKTtcbiAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB0aGlzLl9tYWpvclJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5jaXJjbGVUb0VsbGlwc2VUcmFuc2Zvcm1hdGlvbikge1xuICAgICAgdGhpcy5fbWlub3JSYWRpdXMgPSB0aGlzLl9tYWpvclJhZGl1cztcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gIH1cblxuICBtb3ZlUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMywgZWRpdFBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBpZiAoIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1JhZGl1cyA9IEdlb1V0aWxzU2VydmljZS5kaXN0YW5jZSh0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSwgdG9Qb3NpdGlvbik7XG4gICAgaWYgKHRoaXMubWFqb3JSYWRpdXNQb2ludCA9PT0gZWRpdFBvaW50KSB7XG4gICAgICBpZiAobmV3UmFkaXVzIDwgdGhpcy5fbWlub3JSYWRpdXMpIHtcbiAgICAgICAgdGhpcy5fbWFqb3JSYWRpdXMgPSB0aGlzLl9taW5vclJhZGl1cztcbiAgICAgICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5zZXRQb3NpdGlvbihcbiAgICAgICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuZ2V0Q2VudGVyKCksIHRoaXMuX21pbm9yUmFkaXVzLCB0aGlzLl9yb3RhdGlvbiksXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24odG9Qb3NpdGlvbik7XG4gICAgICAgIHRoaXMuX21ham9yUmFkaXVzID0gbmV3UmFkaXVzO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobmV3UmFkaXVzID4gdGhpcy5fbWFqb3JSYWRpdXMpIHtcbiAgICAgICAgdGhpcy5fbWlub3JSYWRpdXMgPSB0aGlzLl9tYWpvclJhZGl1cztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21pbm9yUmFkaXVzID0gbmV3UmFkaXVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUm90YXRpb24oKTtcbiAgICB0aGlzLnVwZGF0ZU1pbm9yUmFkaXVzRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgfVxuXG4gIG1vdmVFbGxpcHNlKGRyYWdTdGFydFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBkcmFnRW5kUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ1N0YXJ0UG9zaXRpb247XG4gICAgfVxuXG4gICAgY29uc3QgbWFqb3JSYWRpdXMgPSB0aGlzLmdldE1ham9yUmFkaXVzKCk7XG4gICAgY29uc3Qgcm90YXRpb24gPSB0aGlzLmdldFJvdGF0aW9uKCk7XG4gICAgY29uc3QgZGVsdGEgPSBHZW9VdGlsc1NlcnZpY2UuZ2V0UG9zaXRpb25zRGVsdGEodGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24sIGRyYWdFbmRQb3NpdGlvbik7XG4gICAgR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbih0aGlzLmdldENlbnRlcigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgdGhpcy5tYWpvclJhZGl1c1BvaW50LnNldFBvc2l0aW9uKEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgodGhpcy5nZXRDZW50ZXIoKSwgbWFqb3JSYWRpdXMsIHJvdGF0aW9uKSk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBkcmFnRW5kUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlRWxsaXBzZSgpIHtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCkge1xuICAgIGlmICh0aGlzLl9taW5vclJhZGl1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9taW5vclJhZGl1c1BvaW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLnB1c2gobmV3IEVkaXRQb2ludCh0aGlzLmlkLCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSwgdGhpcy5wb2ludFByb3BzLCB0cnVlKSk7XG4gICAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50cy5wdXNoKG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCksIHRoaXMucG9pbnRQcm9wcywgdHJ1ZSkpO1xuICAgIH1cblxuICAgIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzBdLnNldFBvc2l0aW9uKFxuICAgICAgR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSwgdGhpcy5fbWlub3JSYWRpdXMsIHRoaXMuZ2V0Um90YXRpb24oKSAtIE1hdGguUEkgLyAyKSxcbiAgICApO1xuXG4gICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMV0uc2V0UG9zaXRpb24oXG4gICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpLCB0aGlzLl9taW5vclJhZGl1cywgdGhpcy5nZXRSb3RhdGlvbigpICsgTWF0aC5QSSAvIDIpLFxuICAgICk7XG4gIH1cblxuICBnZXRNYWpvclJhZGl1cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYWpvclJhZGl1cyB8fCAwO1xuICB9XG5cbiAgZ2V0TWlub3JSYWRpdXMoKSB7XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldE1ham9yUmFkaXVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9taW5vclJhZGl1cztcbiAgICB9XG4gIH1cblxuICBnZXRSb3RhdGlvbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbiB8fCAwO1xuICB9XG5cbiAgdXBkYXRlUm90YXRpb24oKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGF6aW11dGhJbkRlZ3JlZXMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHRoaXMuZ2V0Q2VudGVyKCksIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgdGhpcy5fcm90YXRpb24gPSBDZXNpdW0uTWF0aC50b1JhZGlhbnMoYXppbXV0aEluRGVncmVlcyk7XG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xuICB9XG5cbiAgZ2V0Um90YXRpb25DYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gTWF0aC5QSSAvIDIgLSB0aGlzLmdldFJvdGF0aW9uKCksIGZhbHNlKTtcbiAgfVxuXG4gIGdldE1pbm9yUmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KCgpID0+IHRoaXMuZ2V0TWlub3JSYWRpdXMoKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0TWFqb3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gdGhpcy5nZXRNYWpvclJhZGl1cygpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRDZW50ZXIoKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX2NlbnRlciA/IHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0Q2VudGVyQ2FsbGJhY2tQcm9wZXJ0eSgpIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KCgpID0+IHRoaXMuZ2V0Q2VudGVyKCksIGZhbHNlKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5fY2VudGVyLmdldElkKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9tYWpvclJhZGl1c1BvaW50LmdldElkKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9taW5vclJhZGl1c1BvaW50cykge1xuICAgICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShwb2ludC5nZXRJZCgpKSk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGxpcHNlc0xheWVyLnJlbW92ZSh0aGlzLmlkKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVFbGxpcHNlc0xheWVyKCkge1xuICAgIHRoaXMuZWxsaXBzZXNMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKCkge1xuICAgIGlmICh0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX2NlbnRlciwgdGhpcy5fY2VudGVyLmdldElkKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fbWFqb3JSYWRpdXNQb2ludCwgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5nZXRJZCgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzBdLCB0aGlzLl9taW5vclJhZGl1c1BvaW50c1swXS5nZXRJZCgpKTtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzFdLCB0aGlzLl9taW5vclJhZGl1c1BvaW50c1sxXS5nZXRJZCgpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==