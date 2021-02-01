import { __assign, __extends, __read, __spread } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditableHippodrome = /** @class */ (function (_super) {
    __extends(EditableHippodrome, _super);
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
        _this.defaultPointProps = __assign({}, editOptions.pointProps);
        _this.hippodromeProps = __assign({}, editOptions.hippodromeProps);
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableHippodrome.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var positions = this.getRealPositions();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = positions[index];
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "hippodromeProps", {
        get: function () {
            return this._hippodromeProps;
        },
        set: function (value) {
            this._hippodromeProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableHippodrome.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditableHippodrome.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.done = true;
    };
    EditableHippodrome.prototype.setPointsManually = function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(points));
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    EditableHippodrome.prototype.addPoint = function (position) {
        if (this.done) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    };
    EditableHippodrome.prototype.createHeightEditPoints = function () {
        var _this = this;
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
        var firstP = this.getRealPoints()[0];
        var secP = this.getRealPoints()[1];
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        var bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        var upAzimuth = Cesium.Math.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        var downAzimuth = Cesium.Math.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    };
    EditableHippodrome.prototype.createMiddleEditablePoint = function (midPointCartesian3, azimuth) {
        var upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        var midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    };
    EditableHippodrome.prototype.movePoint = function (toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    };
    EditableHippodrome.prototype.changeWidthByNewPoint = function (toPosition) {
        var firstP = this.getRealPoints()[0];
        var secP = this.getRealPoints()[1];
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cesium.Cartesian3());
        var bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        var normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        var bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        var fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        var distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        var radiusWidth = Math.sin(Cesium.Math.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach(function (point) {
            var newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditableHippodrome.prototype.endMoveShape = function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach(function (point) { return _this.updatePointsLayer(point); });
        this.updateHippdromeLayer();
    };
    EditableHippodrome.prototype.endMovePoint = function () {
        this.createHeightEditPoints();
        this.updatePointsLayer.apply(this, __spread(this.positions));
    };
    EditableHippodrome.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditableHippodrome.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
    };
    EditableHippodrome.prototype.addLastPoint = function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    EditableHippodrome.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditableHippodrome.prototype.getRealPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    EditableHippodrome.prototype.getRealPoints = function () {
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint(); });
    };
    EditableHippodrome.prototype.getWidth = function () {
        return this.hippodromeProps.width;
    };
    EditableHippodrome.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditableHippodrome.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditableHippodrome.prototype.updatePointsLayer = function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditableHippodrome.prototype.updateHippdromeLayer = function () {
        this.hippodromeLayer.update(this, this.id);
    };
    EditableHippodrome.prototype.dispose = function () {
        var _this = this;
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditableHippodrome.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditableHippodrome.prototype.getId = function () {
        return this.id;
    };
    return EditableHippodrome;
}(AcEntity));
export { EditableHippodrome };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtaGlwcG9kcm9tZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLWhpcHBvZHJvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBTXpDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUM1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFOUQ7SUFBd0Msc0NBQVE7SUFVOUMsNEJBQ1UsRUFBVSxFQUNWLFdBQTZCLEVBQzdCLGVBQWlDLEVBQ2pDLG1CQUF3QyxFQUNoRCxXQUFrQyxFQUNsQyxTQUF3QjtRQU4xQixZQVFFLGlCQUFPLFNBUVI7UUFmUyxRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsaUJBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLHFCQUFlLEdBQWYsZUFBZSxDQUFrQjtRQUNqQyx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBYjFDLGVBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLFVBQUksR0FBRyxLQUFLLENBQUM7UUFDYixpQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVdqQyxLQUFJLENBQUMsaUJBQWlCLGdCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsZUFBZSxnQkFBTyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDeEQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxTQUFT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LENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsMkNBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELGtDQUFLLEdBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXpTRCxDQUF3QyxRQUFRLEdBeVMvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgSGlwcG9kcm9tZUVkaXRPcHRpb25zLCBIaXBwb2Ryb21lUHJvcHMgfSBmcm9tICcuL2hpcHBvZHJvbWUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBkZWZhdWx0TGFiZWxQcm9wcywgTGFiZWxQcm9wcyB9IGZyb20gJy4vbGFiZWwtcHJvcHMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdGFibGVIaXBwb2Ryb21lIGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIHBvc2l0aW9uczogRWRpdFBvaW50W10gPSBbXTtcbiAgcHJpdmF0ZSBtb3ZpbmdQb2ludDogRWRpdFBvaW50O1xuICBwcml2YXRlIGRvbmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW5hYmxlRWRpdCA9IHRydWU7XG4gIHByaXZhdGUgX2RlZmF1bHRQb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9oaXBwb2Ryb21lUHJvcHM6IEhpcHBvZHJvbWVQcm9wcztcbiAgcHJpdmF0ZSBsYXN0RHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBoaXBwb2Ryb21lTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgIGVkaXRPcHRpb25zOiBIaXBwb2Ryb21lRWRpdE9wdGlvbnMsXG4gICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMgPSB7Li4uZWRpdE9wdGlvbnMucG9pbnRQcm9wc307XG4gICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMgPSB7Li4uZWRpdE9wdGlvbnMuaGlwcG9kcm9tZVByb3BzfTtcbiAgICBpZiAocG9zaXRpb25zICYmIHBvc2l0aW9ucy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSGlwcG9kcm9tZSBjb25zaXN0IG9mIDIgcG9pbnRzIGJ1dCBwcm92aWRlZCAnICsgcG9zaXRpb25zLmxlbmd0aCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGxhYmVscygpOiBMYWJlbFByb3BzW10ge1xuICAgIHJldHVybiB0aGlzLl9sYWJlbHM7XG4gIH1cblxuICBzZXQgbGFiZWxzKGxhYmVsczogTGFiZWxQcm9wc1tdKSB7XG4gICAgaWYgKCFsYWJlbHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRSZWFsUG9zaXRpb25zKCk7XG4gICAgdGhpcy5fbGFiZWxzID0gbGFiZWxzLm1hcCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWxhYmVsLnBvc2l0aW9uKSB7XG4gICAgICAgIGxhYmVsLnBvc2l0aW9uID0gcG9zaXRpb25zW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaGlwcG9kcm9tZVByb3BzKCk6IEhpcHBvZHJvbWVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2hpcHBvZHJvbWVQcm9wcztcbiAgfVxuXG4gIHNldCBoaXBwb2Ryb21lUHJvcHModmFsdWU6IEhpcHBvZHJvbWVQcm9wcykge1xuICAgIHRoaXMuX2hpcHBvZHJvbWVQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBkZWZhdWx0UG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihwb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnM6IENhcnRlc2lhbjNbXSkge1xuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvc2l0aW9uID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlSGlwcGRyb21lTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICB9XG5cbiAgc2V0UG9pbnRzTWFudWFsbHkocG9pbnRzOiBFZGl0UG9pbnRbXSwgd2lkdGhNZXRlcnM/OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcGRhdGUgbWFudWFsbHkgb25seSBpbiBlZGl0IG1vZGUsIGFmdGVyIHBvbHlsaW5lIGlzIGNyZWF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGggPSB3aWR0aE1ldGVycyA/IHdpZHRoTWV0ZXJzIDogdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGg7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHAuZ2V0SWQoKSkpO1xuICAgIHRoaXMucG9zaXRpb25zID0gcG9pbnRzO1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4ucG9pbnRzKTtcbiAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gIH1cblxuICBhZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgdGhpcy5wb3NpdGlvbnMucHVzaChuZXdQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihuZXdQb2ludCk7XG4gIH1cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmaXJzdFBvaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG5cbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpIHtcbiAgICB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocCA9PiBwLmlzVmlydHVhbEVkaXRQb2ludCgpKS5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG5cbiAgICBjb25zdCBmaXJzdFAgPSB0aGlzLmdldFJlYWxQb2ludHMoKVswXTtcbiAgICBjb25zdCBzZWNQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMV07XG5cbiAgICBjb25zdCBtaWRQb2ludENhcnRlc2lhbjMgPSBDZXNpdW0uQ2FydGVzaWFuMy5sZXJwKGZpcnN0UC5nZXRQb3NpdGlvbigpLCBzZWNQLmdldFBvc2l0aW9uKCksIDAuNSwgbmV3IENlc2l1bS5DYXJ0ZXNpYW4zKCkpO1xuICAgIGNvbnN0IGJlYXJpbmdEZWcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKGZpcnN0UC5nZXRQb3NpdGlvbigpLCBzZWNQLmdldFBvc2l0aW9uKCkpO1xuXG4gICAgY29uc3QgdXBBemltdXRoID0gQ2VzaXVtLk1hdGgudG9SYWRpYW5zKGJlYXJpbmdEZWcpIC0gTWF0aC5QSSAvIDI7XG4gICAgdGhpcy5jcmVhdGVNaWRkbGVFZGl0YWJsZVBvaW50KG1pZFBvaW50Q2FydGVzaWFuMywgdXBBemltdXRoKTtcbiAgICBjb25zdCBkb3duQXppbXV0aCA9IENlc2l1bS5NYXRoLnRvUmFkaWFucyhiZWFyaW5nRGVnKSArIE1hdGguUEkgLyAyO1xuICAgIHRoaXMuY3JlYXRlTWlkZGxlRWRpdGFibGVQb2ludChtaWRQb2ludENhcnRlc2lhbjMsIGRvd25BemltdXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTWlkZGxlRWRpdGFibGVQb2ludChtaWRQb2ludENhcnRlc2lhbjM6IGFueSwgYXppbXV0aDogbnVtYmVyKSB7XG4gICAgY29uc3QgdXBFZGl0Q2FydGVzaWFuMyA9IEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoXG4gICAgICBtaWRQb2ludENhcnRlc2lhbjMsXG4gICAgICB0aGlzLmhpcHBvZHJvbWVQcm9wcy53aWR0aCAvIDIsXG4gICAgICBhemltdXRoLFxuICAgICAgdHJ1ZSxcbiAgICApO1xuICAgIGNvbnN0IG1pZFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCB1cEVkaXRDYXJ0ZXNpYW4zLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICBtaWRQb2ludC5zZXRWaXJ0dWFsRWRpdFBvaW50KHRydWUpO1xuICAgIHRoaXMucG9zaXRpb25zLnB1c2gobWlkUG9pbnQpO1xuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgaWYgKCFlZGl0UG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkpIHtcbiAgICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgICB0aGlzLnVwZGF0ZUhpcHBkcm9tZUxheWVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hhbmdlV2lkdGhCeU5ld1BvaW50KHRvUG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hhbmdlV2lkdGhCeU5ld1BvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBjb25zdCBmaXJzdFAgPSB0aGlzLmdldFJlYWxQb2ludHMoKVswXTtcbiAgICBjb25zdCBzZWNQID0gdGhpcy5nZXRSZWFsUG9pbnRzKClbMV07XG4gICAgY29uc3QgbWlkUG9pbnRDYXJ0ZXNpYW4zID0gQ2VzaXVtLkNhcnRlc2lhbjMubGVycChmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpLCAwLjUsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKTtcblxuICAgIGNvbnN0IGJlYXJpbmdEZWcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKG1pZFBvaW50Q2FydGVzaWFuMywgdG9Qb3NpdGlvbik7XG4gICAgbGV0IG5vcm1hbGl6ZWRCZWFyaW5nRGViID0gYmVhcmluZ0RlZztcbiAgICBpZiAoYmVhcmluZ0RlZyA+IDI3MCkge1xuICAgICAgbm9ybWFsaXplZEJlYXJpbmdEZWIgPSBiZWFyaW5nRGVnIC0gMjcwO1xuICAgIH0gZWxzZSBpZiAoYmVhcmluZ0RlZyA+IDE4MCkge1xuICAgICAgbm9ybWFsaXplZEJlYXJpbmdEZWIgPSBiZWFyaW5nRGVnIC0gMTgwO1xuICAgIH1cbiAgICBsZXQgYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmJlYXJpbmdUb0NhcnRlc2lhbihmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2VjUC5nZXRQb3NpdGlvbigpKTtcbiAgICBpZiAoYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzID4gMTgwKSB7XG4gICAgICBiZWFyaW5nRGVnSGlwcG9kcm9tZURvdHMgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHNlY1AuZ2V0UG9zaXRpb24oKSwgZmlyc3RQLmdldFBvc2l0aW9uKCkpO1xuICAgIH1cbiAgICBsZXQgZml4ZWRCZWFyaW5nRGVnID1cbiAgICAgIGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cyA+IG5vcm1hbGl6ZWRCZWFyaW5nRGViXG4gICAgICAgID8gYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzIC0gbm9ybWFsaXplZEJlYXJpbmdEZWJcbiAgICAgICAgOiBub3JtYWxpemVkQmVhcmluZ0RlYiAtIGJlYXJpbmdEZWdIaXBwb2Ryb21lRG90cztcblxuICAgIGlmIChiZWFyaW5nRGVnID4gMjcwKSB7XG4gICAgICBmaXhlZEJlYXJpbmdEZWcgPSBiZWFyaW5nRGVnIC0gYmVhcmluZ0RlZ0hpcHBvZHJvbWVEb3RzO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlTWV0ZXJzID0gTWF0aC5hYnMoR2VvVXRpbHNTZXJ2aWNlLmRpc3RhbmNlKG1pZFBvaW50Q2FydGVzaWFuMywgdG9Qb3NpdGlvbikpO1xuICAgIGNvbnN0IHJhZGl1c1dpZHRoID0gTWF0aC5zaW4oQ2VzaXVtLk1hdGgudG9SYWRpYW5zKGZpeGVkQmVhcmluZ0RlZykpICogZGlzdGFuY2VNZXRlcnM7XG5cbiAgICB0aGlzLmhpcHBvZHJvbWVQcm9wcy53aWR0aCA9IE1hdGguYWJzKHJhZGl1c1dpZHRoKSAqIDI7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICB9XG5cbiAgbW92ZVNoYXBlKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBzdGFydE1vdmluZ1Bvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGRlbHRhID0gR2VvVXRpbHNTZXJ2aWNlLmdldFBvc2l0aW9uc0RlbHRhKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uLCBkcmFnZ2VkVG9Qb3NpdGlvbik7XG4gICAgdGhpcy5nZXRSZWFsUG9pbnRzKCkuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb25zdCBuZXdQb3MgPSBHZW9VdGlsc1NlcnZpY2UuYWRkRGVsdGFUb1Bvc2l0aW9uKHBvaW50LmdldFBvc2l0aW9uKCksIGRlbHRhLCB0cnVlKTtcbiAgICAgIHBvaW50LnNldFBvc2l0aW9uKG5ld1Bvcyk7XG4gICAgfSk7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ2dlZFRvUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlU2hhcGUoKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jcmVhdGVIZWlnaHRFZGl0UG9pbnRzKCk7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHBvaW50KSk7XG4gICAgdGhpcy51cGRhdGVIaXBwZHJvbWVMYXllcigpO1xuICB9XG5cbiAgZW5kTW92ZVBvaW50KCkge1xuICAgIHRoaXMuY3JlYXRlSGVpZ2h0RWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICB9XG5cbiAgbW92ZVRlbXBNb3ZpbmdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMubW92ZVBvaW50KHRvUG9zaXRpb24sIHRoaXMubW92aW5nUG9pbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVBvaW50KHBvaW50VG9SZW1vdmU6IEVkaXRQb2ludCkge1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24ocG9pbnRUb1JlbW92ZSk7XG4gICAgdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkuZm9yRWFjaChwID0+IHRoaXMucmVtb3ZlUG9zaXRpb24ocCkpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9uc0NhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldFJlYWxQb3NpdGlvbnMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0UmVhbFBvaW50cygpOiBFZGl0UG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkpO1xuICB9XG5cbiAgZ2V0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5oaXBwb2Ryb21lUHJvcHMud2lkdGg7XG4gIH1cblxuICBnZXRQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgocCA9PiBwID09PSBwb2ludCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHNMYXllciguLi5wb2ludDogRWRpdFBvaW50W10pIHtcbiAgICBwb2ludC5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUhpcHBkcm9tZUxheWVyKCkge1xuICAgIHRoaXMuaGlwcG9kcm9tZUxheWVyLnVwZGF0ZSh0aGlzLCB0aGlzLmlkKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5oaXBwb2Ryb21lTGF5ZXIucmVtb3ZlKHRoaXMuaWQpO1xuXG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChlZGl0UG9pbnQgPT4ge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUoZWRpdFBvaW50LmdldElkKCkpO1xuICAgIH0pO1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLm1vdmluZ1BvaW50LmdldElkKCkpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGdldFBvaW50c0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=