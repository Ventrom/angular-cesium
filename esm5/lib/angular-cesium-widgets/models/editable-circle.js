import { __assign, __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { EditArc } from './edit-arc';
import { defaultLabelProps } from './label-props';
var EditableCircle = /** @class */ (function (_super) {
    __extends(EditableCircle, _super);
    function EditableCircle(id, circlesLayer, pointsLayer, arcsLayer, options) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.circlesLayer = circlesLayer;
        _this.pointsLayer = pointsLayer;
        _this.arcsLayer = arcsLayer;
        _this.options = options;
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this._circleProps = __assign({}, options.circleProps);
        _this._pointProps = __assign({}, options.pointProps);
        _this._polylineProps = __assign({}, options.polylineProps);
        return _this;
    }
    Object.defineProperty(EditableCircle.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            var _this = this;
            if (!labels || !this._center || !this._radiusPoint) {
                return;
            }
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    if (index !== labels.length - 1) {
                        label.position = _this._center.getPosition();
                    }
                    else {
                        label.position = _this._radiusPoint.getPosition();
                    }
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "polylineProps", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "circleProps", {
        get: function () {
            return this._circleProps;
        },
        set: function (value) {
            this._circleProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "center", {
        get: function () {
            return this._center;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "radiusPoint", {
        get: function () {
            return this._radiusPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableCircle.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            this._center.show = value;
            this._radiusPoint.show = value;
            this.updatePointsLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditableCircle.prototype.setManually = function (center, radiusPoint, centerPointProp, radiusPointProp, circleProp) {
        if (centerPointProp === void 0) { centerPointProp = this.pointProps; }
        if (radiusPointProp === void 0) { radiusPointProp = this.pointProps; }
        if (circleProp === void 0) { circleProp = this.circleProps; }
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
    };
    EditableCircle.prototype.addPoint = function (position) {
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
    };
    EditableCircle.prototype.addLastPoint = function (position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.movePoint = function (toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    };
    EditableCircle.prototype.moveCircle = function (dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        var radius = this.getRadius();
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        var newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this._outlineArc.center = this._center.getPosition();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    };
    EditableCircle.prototype.endMovePolygon = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditableCircle.prototype.getRadius = function () {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    };
    EditableCircle.prototype.getRadiusCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRadius.bind(this), false);
    };
    EditableCircle.prototype.getCenter = function () {
        return this._center ? this._center.getPosition() : undefined;
    };
    EditableCircle.prototype.getCenterCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getCenter.bind(this), false);
    };
    EditableCircle.prototype.getRadiusPoint = function () {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    };
    EditableCircle.prototype.dispose = function () {
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
    };
    EditableCircle.prototype.getId = function () {
        return this.id;
    };
    EditableCircle.prototype.updateCirclesLayer = function () {
        this.circlesLayer.update(this, this.id);
    };
    EditableCircle.prototype.updatePointsLayer = function () {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    };
    EditableCircle.prototype.updateArcsLayer = function () {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    };
    EditableCircle.prototype.createOutlineArc = function () {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    };
    return EditableCircle;
}(AcEntity));
export { EditableCircle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtY2lyY2xlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9tb2RlbHMvZWRpdGFibGUtY2lyY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDNUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUlyQyxPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFHOUQ7SUFBb0Msa0NBQVE7SUFZMUMsd0JBQ1UsRUFBVSxFQUNWLFlBQThCLEVBQzlCLFdBQTZCLEVBQzdCLFNBQTJCLEVBQzNCLE9BQTBCO1FBTHBDLFlBT0UsaUJBQU8sU0FJUjtRQVZTLFFBQUUsR0FBRixFQUFFLENBQVE7UUFDVixrQkFBWSxHQUFaLFlBQVksQ0FBa0I7UUFDOUIsaUJBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLGVBQVMsR0FBVCxTQUFTLENBQWtCO1FBQzNCLGFBQU8sR0FBUCxPQUFPLENBQW1CO1FBYjVCLGtCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGlCQUFXLEdBQUcsSUFBSSxDQUFDO1FBS25CLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBVWpDLEtBQUksQ0FBQyxZQUFZLGdCQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3QyxLQUFJLENBQUMsV0FBVyxnQkFBTyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0MsS0FBSSxDQUFDLGNBQWMsZ0JBQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztJQUNuRCxDQUFDO0lBRUQsc0JBQUksa0NBQU07YUFBVjtZQUNFLE9BQU8sSUFB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QUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBbFFELENBQW9DLFFBQVEsR0FrUTNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IEVkaXRQb2ludCB9IGZyb20gJy4vZWRpdC1wb2ludCc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0QXJjIH0gZnJvbSAnLi9lZGl0LWFyYyc7XG5pbXBvcnQgeyBDaXJjbGVFZGl0T3B0aW9ucyB9IGZyb20gJy4vY2lyY2xlLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5pbXBvcnQgeyBFbGxpcHNlUHJvcHMgfSBmcm9tICcuL2VsbGlwc2UtZWRpdC1vcHRpb25zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlQ2lyY2xlIGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIF9jZW50ZXI6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBfcmFkaXVzUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBfb3V0bGluZUFyYzogRWRpdEFyYztcbiAgcHJpdmF0ZSBkb25lQ3JlYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2NpcmNsZVByb3BzOiBFbGxpcHNlUHJvcHM7XG4gIHByaXZhdGUgX3BvaW50UHJvcHM6IFBvaW50UHJvcHM7XG4gIHByaXZhdGUgX3BvbHlsaW5lUHJvcHM6IFBvbHlsaW5lUHJvcHM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgIHByaXZhdGUgY2lyY2xlc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBhcmNzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBDaXJjbGVFZGl0T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9jaXJjbGVQcm9wcyA9IHsuLi5vcHRpb25zLmNpcmNsZVByb3BzfTtcbiAgICB0aGlzLl9wb2ludFByb3BzID0gey4uLm9wdGlvbnMucG9pbnRQcm9wc307XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHsuLi5vcHRpb25zLnBvbHlsaW5lUHJvcHN9O1xuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMgfHwgIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gbGFiZWxzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHRoaXMuX2NlbnRlci5nZXRQb3NpdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhYmVsLnBvc2l0aW9uID0gdGhpcy5fcmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExhYmVsUHJvcHMsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBwb2x5bGluZVByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2x5bGluZVByb3BzO1xuICB9XG5cbiAgc2V0IHBvbHlsaW5lUHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcG9pbnRQcm9wcygpOiBQb2ludFByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBwb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNpcmNsZVByb3BzKCk6IEVsbGlwc2VQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2NpcmNsZVByb3BzO1xuICB9XG5cbiAgc2V0IGNpcmNsZVByb3BzKHZhbHVlOiBFbGxpcHNlUHJvcHMpIHtcbiAgICB0aGlzLl9jaXJjbGVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNlbnRlcigpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XG4gIH1cblxuICBnZXQgcmFkaXVzUG9pbnQoKTogRWRpdFBvaW50IHtcbiAgICByZXR1cm4gdGhpcy5fcmFkaXVzUG9pbnQ7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMuX2NlbnRlci5zaG93ID0gdmFsdWU7XG4gICAgdGhpcy5fcmFkaXVzUG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KFxuICAgIGNlbnRlcjogQ2FydGVzaWFuMyxcbiAgICByYWRpdXNQb2ludDogQ2FydGVzaWFuMyxcbiAgICBjZW50ZXJQb2ludFByb3AgPSB0aGlzLnBvaW50UHJvcHMsXG4gICAgcmFkaXVzUG9pbnRQcm9wID0gdGhpcy5wb2ludFByb3BzLFxuICAgIGNpcmNsZVByb3AgPSB0aGlzLmNpcmNsZVByb3BzLFxuICApIHtcbiAgICBpZiAoIXRoaXMuX2NlbnRlcikge1xuICAgICAgdGhpcy5fY2VudGVyID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBjZW50ZXIsIGNlbnRlclBvaW50UHJvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NlbnRlci5zZXRQb3NpdGlvbihjZW50ZXIpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMuX3JhZGl1c1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCByYWRpdXNQb2ludCwgcmFkaXVzUG9pbnRQcm9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmFkaXVzUG9pbnQuc2V0UG9zaXRpb24ocmFkaXVzUG9pbnQpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgdGhpcy5jcmVhdGVPdXRsaW5lQXJjKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX291dGxpbmVBcmMucmFkaXVzID0gdGhpcy5nZXRSYWRpdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNpcmNsZVByb3BzID0gY2lyY2xlUHJvcDtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgfVxuXG4gIGFkZFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMuX2NlbnRlciA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMucG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLl9yYWRpdXNQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5wb2ludFByb3BzKTtcbiAgICAgIGlmICghdGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgICB0aGlzLmNyZWF0ZU91dGxpbmVBcmMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUFyY3NMYXllcigpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uIHx8ICF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmFkaXVzUG9pbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuX2NlbnRlciB8fCAhdGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9yYWRpdXNQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICB0aGlzLl9vdXRsaW5lQXJjLnJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG5cbiAgICB0aGlzLnVwZGF0ZUFyY3NMYXllcigpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZUNpcmNsZXNMYXllcigpO1xuICB9XG5cbiAgbW92ZUNpcmNsZShkcmFnU3RhcnRQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ0VuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdTdGFydFBvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMuZ2V0UmFkaXVzKCk7XG4gICAgY29uc3QgZGVsdGEgPSBHZW9VdGlsc1NlcnZpY2UuZ2V0UG9zaXRpb25zRGVsdGEodGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24sIGRyYWdFbmRQb3NpdGlvbik7XG4gICAgY29uc3QgbmV3Q2VudGVyUG9zaXRpb24gPSBHZW9VdGlsc1NlcnZpY2UuYWRkRGVsdGFUb1Bvc2l0aW9uKHRoaXMuZ2V0Q2VudGVyKCksIGRlbHRhLCB0cnVlKTtcbiAgICB0aGlzLl9jZW50ZXIuc2V0UG9zaXRpb24obmV3Q2VudGVyUG9zaXRpb24pO1xuICAgIHRoaXMucmFkaXVzUG9pbnQuc2V0UG9zaXRpb24oR2VvVXRpbHNTZXJ2aWNlLnBvaW50QnlMb2NhdGlvbkRpc3RhbmNlQW5kQXppbXV0aCh0aGlzLmdldENlbnRlcigpLCByYWRpdXMsIE1hdGguUEkgLyAyLCB0cnVlKSk7XG4gICAgdGhpcy5fb3V0bGluZUFyYy5yYWRpdXMgPSB0aGlzLmdldFJhZGl1cygpO1xuICAgIHRoaXMuX291dGxpbmVBcmMuY2VudGVyID0gdGhpcy5fY2VudGVyLmdldFBvc2l0aW9uKCk7XG4gICAgdGhpcy51cGRhdGVBcmNzTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gICAgdGhpcy51cGRhdGVDaXJjbGVzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdFbmRQb3NpdGlvbjtcbiAgfVxuXG4gIGVuZE1vdmVQb2x5Z29uKCkge1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0UmFkaXVzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIEdlb1V0aWxzU2VydmljZS5kaXN0YW5jZSh0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSwgdGhpcy5fcmFkaXVzUG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCkge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRSYWRpdXMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0Q2VudGVyKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9jZW50ZXIgPyB0aGlzLl9jZW50ZXIuZ2V0UG9zaXRpb24oKSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldENlbnRlckNhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldENlbnRlci5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICBnZXRSYWRpdXNQb2ludCgpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5fcmFkaXVzUG9pbnQgPyB0aGlzLl9yYWRpdXNQb2ludC5nZXRQb3NpdGlvbigpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5fY2VudGVyKSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9jZW50ZXIuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLl9yYWRpdXNQb2ludC5nZXRJZCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3V0bGluZUFyYykge1xuICAgICAgdGhpcy5hcmNzTGF5ZXIucmVtb3ZlKHRoaXMuX291dGxpbmVBcmMuZ2V0SWQoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaXJjbGVzTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNpcmNsZXNMYXllcigpIHtcbiAgICB0aGlzLmNpcmNsZXNMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKCkge1xuICAgIGlmICh0aGlzLl9jZW50ZXIpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX2NlbnRlciwgdGhpcy5fY2VudGVyLmdldElkKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcmFkaXVzUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIudXBkYXRlKHRoaXMuX3JhZGl1c1BvaW50LCB0aGlzLl9yYWRpdXNQb2ludC5nZXRJZCgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyY3NMYXllcigpIHtcbiAgICBpZiAoIXRoaXMuX291dGxpbmVBcmMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hcmNzTGF5ZXIudXBkYXRlKHRoaXMuX291dGxpbmVBcmMsIHRoaXMuX291dGxpbmVBcmMuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU91dGxpbmVBcmMoKSB7XG4gICAgaWYgKCF0aGlzLl9jZW50ZXIgfHwgIXRoaXMuX3JhZGl1c1BvaW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX291dGxpbmVBcmMgPSBuZXcgRWRpdEFyYyh0aGlzLmlkLCB0aGlzLmdldENlbnRlcigpLCB0aGlzLmdldFJhZGl1cygpLCBNYXRoLlBJICogMiwgMCwgdGhpcy5wb2x5bGluZVByb3BzKTtcbiAgfVxufVxuIl19