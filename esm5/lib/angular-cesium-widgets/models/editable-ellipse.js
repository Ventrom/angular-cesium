import { __assign, __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditableEllipse = /** @class */ (function (_super) {
    __extends(EditableEllipse, _super);
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
        _this._ellipseProps = __assign({}, options.ellipseProps);
        _this._pointProps = __assign({}, options.pointProps);
        return _this;
    }
    Object.defineProperty(EditableEllipse.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            var _this = this;
            if (!labels || !this._center) {
                return;
            }
            this._labels = labels.map(function (label, index) {
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
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "polylineProps", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "ellipseProps", {
        get: function () {
            return this._ellipseProps;
        },
        set: function (value) {
            this._ellipseProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "center", {
        get: function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableEllipse.prototype, "majorRadiusPoint", {
        get: function () {
            return this._majorRadiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    EditableEllipse.prototype.getMajorRadiusPointPosition = function () {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    };
    EditableEllipse.prototype.getMinorRadiusPointPosition = function () {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    };
    Object.defineProperty(EditableEllipse.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._majorRadiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditableEllipse.prototype.setManually = function (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) {
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
    EditableEllipse.prototype.addPoint = function (position) {
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
    EditableEllipse.prototype.transformToEllipse = function () {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    };
    EditableEllipse.prototype.addLastPoint = function (position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
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
    EditableEllipse.prototype.movePoint = function (toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
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
    EditableEllipse.prototype.moveEllipse = function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        var majorRadius = this.getMajorRadius();
        var rotation = this.getRotation();
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        var newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    EditableEllipse.prototype.endMoveEllipse = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditableEllipse.prototype.updateMinorRadiusEditPoints = function () {
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
    EditableEllipse.prototype.getMajorRadius = function () {
        return this._majorRadius || 0;
    };
    EditableEllipse.prototype.getMinorRadius = function () {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    };
    EditableEllipse.prototype.getRotation = function () {
        return this._rotation || 0;
    };
    EditableEllipse.prototype.updateRotation = function () {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        var azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Cesium.Math.toRadians(azimuthInDegrees);
        return this._rotation;
    };
    EditableEllipse.prototype.getRotationCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return Math.PI / 2 - _this.getRotation(); }, false);
    };
    EditableEllipse.prototype.getMinorRadiusCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getMinorRadius(); }, false);
    };
    EditableEllipse.prototype.getMajorRadiusCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getMajorRadius(); }, false);
    };
    EditableEllipse.prototype.getCenter = function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    EditableEllipse.prototype.getCenterCallbackProperty = function () {
        var _this = this;
        return new Cesium.CallbackProperty(function () { return _this.getCenter(); }, false);
    };
    EditableEllipse.prototype.dispose = function () {
        var _this = this;
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.remove(this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints) {
            this._minorRadiusPoints.forEach(function (point) { return _this.pointsLayer.remove(point.getId()); });
        }
        this.ellipsesLayer.remove(this.id);
    };
    EditableEllipse.prototype.getId = function () {
        return this.id;
    };
    EditableEllipse.prototype.updateEllipsesLayer = function () {
        this.ellipsesLayer.update(this, this.id);
    };
    EditableEllipse.prototype.updatePointsLayer = function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtZWxsaXBzZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWVsbGlwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBR3pDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUk1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFHOUQ7SUFBcUMsbUNBQVE7SUFlM0MseUJBQ1UsRUFBVSxFQUNWLGFBQStCLEVBQy9CLFdBQTZCLEVBQzdCLG1CQUF3QyxFQUN4QyxPQUEyQjtRQUxyQyxZQU9FLGlCQUFPLFNBR1I7UUFUUyxRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsbUJBQWEsR0FBYixhQUFhLENBQWtCO1FBQy9CLGlCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3Qix5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGFBQU8sR0FBUCxPQUFPLENBQW9CO1FBZjdCLGVBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxrQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixpQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQix3QkFBa0IsR0FBZ0IsRUFBRSxDQUFDO1FBS3JDLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBVWpDLEtBQUksQ0FBQyxhQUFhLGdCQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQyxLQUFJLENBQUMsV0FBVyxnQkFBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBQzdDLENBQUM7SUFFRCxzQkFBSSxtQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7YUFF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RUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVPLDJDQUFpQixHQUF6QjtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM3RDtRQUNELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNqRjtRQUNELElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUN6RjtJQUNILENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFuV0QsQ0FBcUMsUUFBUSxHQW1XNUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9hYy1lbnRpdHknO1xuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi9lZGl0LXBvaW50JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IEVsbGlwc2VFZGl0T3B0aW9ucywgRWxsaXBzZVByb3BzIH0gZnJvbSAnLi9lbGxpcHNlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZUVsbGlwc2UgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgX2NlbnRlcjogRWRpdFBvaW50O1xuICBwcml2YXRlIF9tYWpvclJhZGl1c1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX21ham9yUmFkaXVzOiBudW1iZXI7XG4gIHByaXZhdGUgX21pbm9yUmFkaXVzOiBudW1iZXI7XG4gIHByaXZhdGUgX3JvdGF0aW9uID0gMDtcbiAgcHJpdmF0ZSBkb25lQ3JlYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgX21pbm9yUmFkaXVzUG9pbnRzOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogYW55O1xuICBwcml2YXRlIF9lbGxpcHNlUHJvcHM6IEVsbGlwc2VQcm9wcztcbiAgcHJpdmF0ZSBfcG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfcG9seWxpbmVQcm9wczogUG9seWxpbmVQcm9wcztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBlbGxpcHNlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIHByaXZhdGUgb3B0aW9uczogRWxsaXBzZUVkaXRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2VsbGlwc2VQcm9wcyA9IHsuLi5vcHRpb25zLmVsbGlwc2VQcm9wc307XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IHsuLi5vcHRpb25zLnBvaW50UHJvcHN9O1xuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMgfHwgIXRoaXMuX2NlbnRlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9sYWJlbHMgPSBsYWJlbHMubWFwKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghbGFiZWwucG9zaXRpb24pIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgbGFiZWwucG9zaXRpb24gPSB0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gMSkge1xuICAgICAgICAgIGxhYmVsLnBvc2l0aW9uID0gdGhpcy5fbWFqb3JSYWRpdXNQb2ludFxuICAgICAgICAgICAgPyBDZXNpdW0uQ2FydGVzaWFuMy5taWRwb2ludCh0aGlzLmdldENlbnRlcigpLCB0aGlzLl9tYWpvclJhZGl1c1BvaW50LmdldFBvc2l0aW9uKCksIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKVxuICAgICAgICAgICAgOiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gMikge1xuICAgICAgICAgIGxhYmVsLnBvc2l0aW9uID1cbiAgICAgICAgICAgIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLmxlbmd0aCA+IDAgJiYgdGhpcy5fbWlub3JSYWRpdXNcbiAgICAgICAgICAgICAgPyBDZXNpdW0uQ2FydGVzaWFuMy5taWRwb2ludCh0aGlzLmdldENlbnRlcigpLCB0aGlzLmdldE1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbigpLCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSlcbiAgICAgICAgICAgICAgOiBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExhYmVsUHJvcHMsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBwb2x5bGluZVByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2x5bGluZVByb3BzO1xuICB9XG5cbiAgc2V0IHBvbHlsaW5lUHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcG9pbnRQcm9wcygpOiBQb2ludFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBwb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGVsbGlwc2VQcm9wcygpOiBFbGxpcHNlUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9lbGxpcHNlUHJvcHM7XG4gIH1cblxuICBzZXQgZWxsaXBzZVByb3BzKHZhbHVlOiBFbGxpcHNlUHJvcHMpIHtcbiAgICB0aGlzLl9lbGxpcHNlUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyO1xuICB9XG5cbiAgZ2V0IG1ham9yUmFkaXVzUG9pbnQoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5fbWFqb3JSYWRpdXNQb2ludDtcbiAgfVxuXG4gIGdldE1ham9yUmFkaXVzUG9pbnRQb3NpdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIGdldE1pbm9yUmFkaXVzUG9pbnRQb3NpdGlvbigpOiBDYXJ0ZXNpYW4zIHtcbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXNQb2ludHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMF0uZ2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgdGhpcy5fY2VudGVyLnNob3cgPSB2YWx1ZTtcbiAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50LnNob3cgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gIH1cblxuICBzZXRNYW51YWxseShcbiAgICBjZW50ZXI6IENhcnRlc2lhbjMsXG4gICAgbWFqb3JSYWRpdXM6IG51bWJlcixcbiAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyLFxuICAgIG1pbm9yUmFkaXVzPzogbnVtYmVyLFxuICAgIGNlbnRlclBvaW50UHJvcCA9IHRoaXMucG9pbnRQcm9wcyxcbiAgICByYWRpdXNQb2ludFByb3AgPSB0aGlzLnBvaW50UHJvcHMsXG4gICAgZWxsaXBzZVByb3AgPSB0aGlzLmVsbGlwc2VQcm9wcyxcbiAgKSB7XG4gICAgaWYgKG1ham9yUmFkaXVzIDwgbWlub3JSYWRpdXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWFqb3IgcmFkaXVzIG11c2UgYmUgZXF1YWwgb3IgZ3JlYXRlciB0aGFuIG1pbm9yIHJhZGl1cycpO1xuICAgIH1cbiAgICB0aGlzLl9yb3RhdGlvbiA9IHJvdGF0aW9uO1xuICAgIHRoaXMuX21ham9yUmFkaXVzID0gbWFqb3JSYWRpdXM7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgY2VudGVyLCBjZW50ZXJQb2ludFByb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jZW50ZXIuc2V0UG9zaXRpb24oY2VudGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYWpvclJhZGl1c1Bvc2l0aW9uID0gR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmNlbnRlci5nZXRQb3NpdGlvbigpLCBtYWpvclJhZGl1cywgcm90YXRpb24pO1xuXG4gICAgaWYgKCF0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBtYWpvclJhZGl1c1Bvc2l0aW9uLCByYWRpdXNQb2ludFByb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50LnNldFBvc2l0aW9uKG1ham9yUmFkaXVzUG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChtaW5vclJhZGl1cykge1xuICAgICAgdGhpcy5fbWlub3JSYWRpdXMgPSBtaW5vclJhZGl1cztcbiAgICB9XG5cbiAgICB0aGlzLmVsbGlwc2VQcm9wcyA9IGVsbGlwc2VQcm9wO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZU1pbm9yUmFkaXVzRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgfVxuXG4gIGFkZFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMucG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLl9tYWpvclJhZGl1c1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbi5jbG9uZSgpLCB0aGlzLnBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5fbWFqb3JSYWRpdXMgPSAwO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUm90YXRpb24oKTtcbiAgICB0aGlzLnVwZGF0ZU1pbm9yUmFkaXVzRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgfVxuXG4gIHRyYW5zZm9ybVRvRWxsaXBzZSgpIHtcbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9taW5vclJhZGl1cyA9IHRoaXMuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICB0aGlzLnVwZGF0ZU1pbm9yUmFkaXVzRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbiB8fCAhdGhpcy5fY2VudGVyIHx8ICF0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV3UmFkaXVzID0gR2VvVXRpbHNTZXJ2aWNlLmRpc3RhbmNlKHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpLCBwb3NpdGlvbik7XG4gICAgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy5fbWFqb3JSYWRpdXMgPSBuZXdSYWRpdXM7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuY2lyY2xlVG9FbGxpcHNlVHJhbnNmb3JtYXRpb24pIHtcbiAgICAgIHRoaXMuX21pbm9yUmFkaXVzID0gdGhpcy5fbWFqb3JSYWRpdXM7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVSb3RhdGlvbigpO1xuICAgIHRoaXMudXBkYXRlTWlub3JSYWRpdXNFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcigpO1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdSYWRpdXMgPSBHZW9VdGlsc1NlcnZpY2UuZGlzdGFuY2UodGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCksIHRvUG9zaXRpb24pO1xuICAgIGlmICh0aGlzLm1ham9yUmFkaXVzUG9pbnQgPT09IGVkaXRQb2ludCkge1xuICAgICAgaWYgKG5ld1JhZGl1cyA8IHRoaXMuX21pbm9yUmFkaXVzKSB7XG4gICAgICAgIHRoaXMuX21ham9yUmFkaXVzID0gdGhpcy5fbWlub3JSYWRpdXM7XG4gICAgICAgIHRoaXMuX21ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24oXG4gICAgICAgICAgR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmdldENlbnRlcigpLCB0aGlzLl9taW5vclJhZGl1cywgdGhpcy5fcm90YXRpb24pLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYWpvclJhZGl1c1BvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgICAgICB0aGlzLl9tYWpvclJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld1JhZGl1cyA+IHRoaXMuX21ham9yUmFkaXVzKSB7XG4gICAgICAgIHRoaXMuX21pbm9yUmFkaXVzID0gdGhpcy5fbWFqb3JSYWRpdXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9taW5vclJhZGl1cyA9IG5ld1JhZGl1cztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVFbGxpcHNlc0xheWVyKCk7XG4gIH1cblxuICBtb3ZlRWxsaXBzZShkcmFnU3RhcnRQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ0VuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdTdGFydFBvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IG1ham9yUmFkaXVzID0gdGhpcy5nZXRNYWpvclJhZGl1cygpO1xuICAgIGNvbnN0IHJvdGF0aW9uID0gdGhpcy5nZXRSb3RhdGlvbigpO1xuICAgIGNvbnN0IGRlbHRhID0gR2VvVXRpbHNTZXJ2aWNlLmdldFBvc2l0aW9uc0RlbHRhKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uLCBkcmFnRW5kUG9zaXRpb24pO1xuICAgIGNvbnN0IG5ld0NlbnRlclBvc2l0aW9uID0gR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbih0aGlzLmdldENlbnRlcigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgdGhpcy5fY2VudGVyLnNldFBvc2l0aW9uKG5ld0NlbnRlclBvc2l0aW9uKTtcbiAgICB0aGlzLm1ham9yUmFkaXVzUG9pbnQuc2V0UG9zaXRpb24oR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmdldENlbnRlcigpLCBtYWpvclJhZGl1cywgcm90YXRpb24pKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdFbmRQb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVFbGxpcHNlKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNaW5vclJhZGl1c0VkaXRQb2ludHMoKSB7XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHMucHVzaChuZXcgRWRpdFBvaW50KHRoaXMuaWQsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpLCB0aGlzLnBvaW50UHJvcHMsIHRydWUpKTtcbiAgICAgIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzLnB1c2gobmV3IEVkaXRQb2ludCh0aGlzLmlkLCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSwgdGhpcy5wb2ludFByb3BzLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMF0uc2V0UG9zaXRpb24oXG4gICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpLCB0aGlzLl9taW5vclJhZGl1cywgdGhpcy5nZXRSb3RhdGlvbigpIC0gTWF0aC5QSSAvIDIpLFxuICAgICk7XG5cbiAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50c1sxXS5zZXRQb3NpdGlvbihcbiAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgodGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCksIHRoaXMuX21pbm9yUmFkaXVzLCB0aGlzLmdldFJvdGF0aW9uKCkgKyBNYXRoLlBJIC8gMiksXG4gICAgKTtcbiAgfVxuXG4gIGdldE1ham9yUmFkaXVzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21ham9yUmFkaXVzIHx8IDA7XG4gIH1cblxuICBnZXRNaW5vclJhZGl1cygpIHtcbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TWFqb3JSYWRpdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX21pbm9yUmFkaXVzO1xuICAgIH1cbiAgfVxuXG4gIGdldFJvdGF0aW9uKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uIHx8IDA7XG4gIH1cblxuICB1cGRhdGVSb3RhdGlvbigpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5fbWFqb3JSYWRpdXNQb2ludCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgYXppbXV0aEluRGVncmVlcyA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5iZWFyaW5nVG9DYXJ0ZXNpYW4odGhpcy5nZXRDZW50ZXIoKSwgdGhpcy5fbWFqb3JSYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpKTtcbiAgICB0aGlzLl9yb3RhdGlvbiA9IENlc2l1bS5NYXRoLnRvUmFkaWFucyhhemltdXRoSW5EZWdyZWVzKTtcbiAgICByZXR1cm4gdGhpcy5fcm90YXRpb247XG4gIH1cblxuICBnZXRSb3RhdGlvbkNhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSgoKSA9PiBNYXRoLlBJIC8gMiAtIHRoaXMuZ2V0Um90YXRpb24oKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0TWlub3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gdGhpcy5nZXRNaW5vclJhZGl1cygpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRNYWpvclJhZGl1c0NhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSgoKSA9PiB0aGlzLmdldE1ham9yUmFkaXVzKCksIGZhbHNlKTtcbiAgfVxuXG4gIGdldENlbnRlcigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fY2VudGVyID8gdGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRDZW50ZXJDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkoKCkgPT4gdGhpcy5nZXRDZW50ZXIoKSwgZmFsc2UpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21ham9yUmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMuX21ham9yUmFkaXVzUG9pbnQuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzKSB7XG4gICAgICB0aGlzLl9taW5vclJhZGl1c1BvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsbGlwc2VzTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUVsbGlwc2VzTGF5ZXIoKSB7XG4gICAgdGhpcy5lbGxpcHNlc0xheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIoKSB7XG4gICAgaWYgKHRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fY2VudGVyLCB0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9tYWpvclJhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZSh0aGlzLl9tYWpvclJhZGl1c1BvaW50LCB0aGlzLl9tYWpvclJhZGl1c1BvaW50LmdldElkKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbWlub3JSYWRpdXNQb2ludHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMF0sIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzBdLmdldElkKCkpO1xuICAgICAgdGhpcy5wb2ludHNMYXllci51cGRhdGUodGhpcy5fbWlub3JSYWRpdXNQb2ludHNbMV0sIHRoaXMuX21pbm9yUmFkaXVzUG9pbnRzWzFdLmdldElkKCkpO1xuICAgIH1cbiAgfVxufVxuIl19