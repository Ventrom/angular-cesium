import { __assign, __extends, __read, __spread } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { defaultLabelProps } from './label-props';
var EditableRectangle = /** @class */ (function (_super) {
    __extends(EditableRectangle, _super);
    function EditableRectangle(id, pointsLayer, rectangleLayer, coordinateConverter, editOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointsLayer = pointsLayer;
        _this.rectangleLayer = rectangleLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.positions = [];
        _this.done = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.defaultPointProps = __assign({}, editOptions.pointProps);
        _this.rectangleProps = __assign({}, editOptions.rectangleProps);
        if (positions && positions.length === 2) {
            _this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
        }
        return _this;
    }
    Object.defineProperty(EditableRectangle.prototype, "labels", {
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
    Object.defineProperty(EditableRectangle.prototype, "rectangleProps", {
        get: function () {
            return this._rectangleProps;
        },
        set: function (value) {
            this._rectangleProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableRectangle.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditableRectangle.prototype, "enableEdit", {
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
    EditableRectangle.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.updateRectangleLayer();
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.done = true;
    };
    EditableRectangle.prototype.setPointsManually = function (points, widthMeters) {
        var _this = this;
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after rectangle is created');
        }
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        this.positions = points;
        this.updatePointsLayer.apply(this, __spread(points));
        this.updateRectangleLayer();
    };
    EditableRectangle.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    };
    EditableRectangle.prototype.addPoint = function (position) {
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
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateRectangleLayer();
            this.done = true;
            this.movingPoint = null;
        }
    };
    EditableRectangle.prototype.movePoint = function (toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.updatePointsLayer.apply(this, __spread(this.positions));
            this.updateRectangleLayer();
        }
    };
    EditableRectangle.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var lastDraggedCartographic = Cesium.Cartographic.fromCartesian(this.lastDraggedToPosition);
        var draggedToPositionCartographic = Cesium.Cartographic.fromCartesian(draggedToPosition);
        this.getRealPoints().forEach(function (point) {
            var cartographic = Cesium.Cartographic.fromCartesian(point.getPosition());
            cartographic.longitude += (draggedToPositionCartographic.longitude - lastDraggedCartographic.longitude);
            cartographic.latitude += (draggedToPositionCartographic.latitude - lastDraggedCartographic.latitude);
            point.setPosition(Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0));
        });
        this.updatePointsLayer.apply(this, __spread(this.positions));
        this.updateRectangleLayer();
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditableRectangle.prototype.endMoveShape = function () {
        var _this = this;
        this.lastDraggedToPosition = undefined;
        this.positions.forEach(function (point) { return _this.updatePointsLayer(point); });
        this.updateRectangleLayer();
    };
    EditableRectangle.prototype.endMovePoint = function () {
        this.updatePointsLayer.apply(this, __spread(this.positions));
    };
    EditableRectangle.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditableRectangle.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions.filter(function (p) { return p.isVirtualEditPoint(); }).forEach(function (p) { return _this.removePosition(p); });
    };
    EditableRectangle.prototype.addLastPoint = function (position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    };
    EditableRectangle.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditableRectangle.prototype.getRealPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRealPositions.bind(this), false);
    };
    EditableRectangle.prototype.getRealPoints = function () {
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint(); });
    };
    EditableRectangle.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditableRectangle.prototype.getRectangle = function () {
        var cartographics = this.getPositions().map(function (cartesian) { return Cesium.Cartographic.fromCartesian(cartesian); });
        var longitudes = cartographics.map(function (position) { return position.longitude; });
        var latitudes = cartographics.map(function (position) { return position.latitude; });
        return new Cesium.Rectangle(Math.min.apply(Math, __spread(longitudes)), Math.min.apply(Math, __spread(latitudes)), Math.max.apply(Math, __spread(longitudes)), Math.max.apply(Math, __spread(latitudes)));
    };
    EditableRectangle.prototype.getRectangleCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getRectangle.bind(this), false);
    };
    EditableRectangle.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditableRectangle.prototype.updatePointsLayer = function () {
        var _this = this;
        var point = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            point[_i] = arguments[_i];
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditableRectangle.prototype.updateRectangleLayer = function () {
        this.rectangleLayer.update(this, this.id);
    };
    EditableRectangle.prototype.dispose = function () {
        var _this = this;
        this.rectangleLayer.remove(this.id);
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditableRectangle.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditableRectangle.prototype.getId = function () {
        return this.id;
    };
    return EditableRectangle;
}(AcEntity));
export { EditableRectangle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcmVjdGFuZ2xlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9tb2RlbHMvZWRpdGFibGUtcmVjdGFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDakUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQVF6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFOUQ7SUFBdUMscUNBQVE7SUFVN0MsMkJBQ1UsRUFBVSxFQUNWLFdBQTZCLEVBQzdCLGNBQWdDLEVBQ2hDLG1CQUF3QyxFQUNoRCxXQUFpQyxFQUNqQyxTQUF3QjtRQU4xQixZQVFFLGlCQUFPLFNBUVI7UUFmUyxRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsaUJBQVcsR0FBWCxXQUFXLENBQWtCO1FBQzdCLG9CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyx5QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBYjFDLGVBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLFVBQUksR0FBRyxLQUFLLENBQUM7UUFDYixpQkFBVyxHQUFHLElBQUksQ0FBQztRQUluQixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQVdqQyxLQUFJLENBQUMsaUJBQWlCLGdCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsY0FBYyxnQkFBTyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxTQUFTLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxT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QUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTyxnREFBb0IsR0FBNUI7UUFDRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxtQ0FBTyxHQUFQO1FBQUEsaUJBV0M7UUFWQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO1lBQzlCLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsMENBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELGlDQUFLLEdBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQW5QRCxDQUF1QyxRQUFRLEdBbVA5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvcmVjdGFuZ2xlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IEdlb1V0aWxzU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2dlby11dGlscy9nZW8tdXRpbHMuc2VydmljZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVFZGl0T3B0aW9ucywgUmVjdGFuZ2xlUHJvcHMgfSBmcm9tICcuL3JlY3RhbmdsZS1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4vcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVJlY3RhbmdsZSBleHRlbmRzIEFjRW50aXR5IHtcbiAgcHJpdmF0ZSBwb3NpdGlvbnM6IEVkaXRQb2ludFtdID0gW107XG4gIHByaXZhdGUgbW92aW5nUG9pbnQ6IEVkaXRQb2ludDtcbiAgcHJpdmF0ZSBkb25lID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9kZWZhdWx0UG9pbnRQcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfcmVjdGFuZ2xlUHJvcHM6IFJlY3RhbmdsZVByb3BzO1xuICBwcml2YXRlIGxhc3REcmFnZ2VkVG9Qb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBwb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICBwcml2YXRlIHJlY3RhbmdsZUxheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICBlZGl0T3B0aW9uczogUmVjdGFuZ2xlRWRpdE9wdGlvbnMsXG4gICAgcG9zaXRpb25zPzogQ2FydGVzaWFuM1tdXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyA9IHsuLi5lZGl0T3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICB0aGlzLnJlY3RhbmdsZVByb3BzID0gey4uLmVkaXRPcHRpb25zLnJlY3RhbmdsZVByb3BzfTtcbiAgICBpZiAocG9zaXRpb25zICYmIHBvc2l0aW9ucy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMuY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVjdGFuZ2xlIGNvbnNpc3Qgb2YgMiBwb2ludHMgYnV0IHByb3ZpZGVkICcgKyBwb3NpdGlvbnMubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbGFiZWxzKCk6IExhYmVsUHJvcHNbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVscztcbiAgfVxuXG4gIHNldCBsYWJlbHMobGFiZWxzOiBMYWJlbFByb3BzW10pIHtcbiAgICBpZiAoIWxhYmVscykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLmdldFJlYWxQb3NpdGlvbnMoKTtcbiAgICB0aGlzLl9sYWJlbHMgPSBsYWJlbHMubWFwKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghbGFiZWwucG9zaXRpb24pIHtcbiAgICAgICAgbGFiZWwucG9zaXRpb24gPSBwb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExhYmVsUHJvcHMsIGxhYmVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCByZWN0YW5nbGVQcm9wcygpOiBSZWN0YW5nbGVQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY3RhbmdsZVByb3BzO1xuICB9XG5cbiAgc2V0IHJlY3RhbmdsZVByb3BzKHZhbHVlOiBSZWN0YW5nbGVQcm9wcykge1xuICAgIHRoaXMuX3JlY3RhbmdsZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGVmYXVsdFBvaW50UHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzO1xuICB9XG5cbiAgc2V0IGRlZmF1bHRQb2ludFByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fZGVmYXVsdFBvaW50UHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBwb2ludC5zaG93ID0gdmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHBvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9uczogQ2FydGVzaWFuM1tdKSB7XG4gICAgcG9zaXRpb25zLmZvckVhY2gocG9zaXRpb24gPT4ge1xuICAgICAgdGhpcy5hZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gIH1cblxuICBzZXRQb2ludHNNYW51YWxseShwb2ludHM6IEVkaXRQb2ludFtdLCB3aWR0aE1ldGVycz86IG51bWJlcikge1xuICAgIGlmICghdGhpcy5kb25lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcmVjdGFuZ2xlIGlzIGNyZWF0ZWQnKTtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHAuZ2V0SWQoKSkpO1xuICAgIHRoaXMucG9zaXRpb25zID0gcG9pbnRzO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4ucG9pbnRzKTtcbiAgICB0aGlzLnVwZGF0ZVJlY3RhbmdsZUxheWVyKCk7XG4gIH1cblxuICBhZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgdGhpcy5wb3NpdGlvbnMucHVzaChuZXdQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihuZXdQb2ludCk7XG4gIH1cblxuICBhZGRQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmaXJzdFBvaW50KTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKC4uLnRoaXMucG9zaXRpb25zKTtcbiAgICAgIHRoaXMudXBkYXRlUmVjdGFuZ2xlTGF5ZXIoKTtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBtb3ZlUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMywgZWRpdFBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBpZiAoIWVkaXRQb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkge1xuICAgICAgZWRpdFBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgICB0aGlzLnVwZGF0ZVJlY3RhbmdsZUxheWVyKCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZVNoYXBlKHN0YXJ0TW92aW5nUG9zaXRpb246IENhcnRlc2lhbjMsIGRyYWdnZWRUb1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKCF0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbikge1xuICAgICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSBzdGFydE1vdmluZ1Bvc2l0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3REcmFnZ2VkQ2FydG9ncmFwaGljID0gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uKTtcbiAgICBjb25zdCBkcmFnZ2VkVG9Qb3NpdGlvbkNhcnRvZ3JhcGhpYyA9IENlc2l1bS5DYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihkcmFnZ2VkVG9Qb3NpdGlvbik7XG4gICAgdGhpcy5nZXRSZWFsUG9pbnRzKCkuZm9yRWFjaChwb2ludCA9PiB7XG4gICAgICBjb25zdCBjYXJ0b2dyYXBoaWMgPSBDZXNpdW0uQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4ocG9pbnQuZ2V0UG9zaXRpb24oKSk7XG4gICAgICBjYXJ0b2dyYXBoaWMubG9uZ2l0dWRlICs9IChkcmFnZ2VkVG9Qb3NpdGlvbkNhcnRvZ3JhcGhpYy5sb25naXR1ZGUgLSBsYXN0RHJhZ2dlZENhcnRvZ3JhcGhpYy5sb25naXR1ZGUpO1xuICAgICAgY2FydG9ncmFwaGljLmxhdGl0dWRlICs9IChkcmFnZ2VkVG9Qb3NpdGlvbkNhcnRvZ3JhcGhpYy5sYXRpdHVkZSAtIGxhc3REcmFnZ2VkQ2FydG9ncmFwaGljLmxhdGl0dWRlKTtcbiAgICAgIHBvaW50LnNldFBvc2l0aW9uKENlc2l1bS5DYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKGNhcnRvZ3JhcGhpYy5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYy5sYXRpdHVkZSwgMCkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllciguLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ2dlZFRvUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlU2hhcGUoKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwb2ludCA9PiB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHBvaW50KSk7XG4gICAgdGhpcy51cGRhdGVSZWN0YW5nbGVMYXllcigpO1xuICB9XG5cbiAgZW5kTW92ZVBvaW50KCkge1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoLi4udGhpcy5wb3NpdGlvbnMpO1xuICB9XG5cbiAgbW92ZVRlbXBNb3ZpbmdQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMubW92ZVBvaW50KHRvUG9zaXRpb24sIHRoaXMubW92aW5nUG9pbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZVBvaW50KHBvaW50VG9SZW1vdmU6IEVkaXRQb2ludCkge1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24ocG9pbnRUb1JlbW92ZSk7XG4gICAgdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkuZm9yRWFjaChwID0+IHRoaXMucmVtb3ZlUG9zaXRpb24ocCkpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKCkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9uc0NhbGxiYWNrUHJvcGVydHkoKSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldFJlYWxQb3NpdGlvbnMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0UmVhbFBvaW50cygpOiBFZGl0UG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiAhcG9zaXRpb24uaXNWaXJ0dWFsRWRpdFBvaW50KCkpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zKCk6IENhcnRlc2lhbjNbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5nZXRQb3NpdGlvbigpKTtcbiAgfVxuXG4gIGdldFJlY3RhbmdsZSgpOiBSZWN0YW5nbGUge1xuICAgIGNvbnN0IGNhcnRvZ3JhcGhpY3MgPSB0aGlzLmdldFBvc2l0aW9ucygpLm1hcChjYXJ0ZXNpYW4gPT4gQ2VzaXVtLkNhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbikpO1xuICAgIGNvbnN0IGxvbmdpdHVkZXMgPSBjYXJ0b2dyYXBoaWNzLm1hcChwb3NpdGlvbiA9PiBwb3NpdGlvbi5sb25naXR1ZGUpO1xuICAgIGNvbnN0IGxhdGl0dWRlcyA9IGNhcnRvZ3JhcGhpY3MubWFwKHBvc2l0aW9uID0+ICBwb3NpdGlvbi5sYXRpdHVkZSk7XG5cbiAgICByZXR1cm4gbmV3IENlc2l1bS5SZWN0YW5nbGUoXG4gICAgICBNYXRoLm1pbiguLi5sb25naXR1ZGVzKSxcbiAgICAgIE1hdGgubWluKC4uLmxhdGl0dWRlcyksXG4gICAgICBNYXRoLm1heCguLi5sb25naXR1ZGVzKSxcbiAgICAgIE1hdGgubWF4KC4uLmxhdGl0dWRlcylcbiAgICApO1xuICB9XG5cbiAgZ2V0UmVjdGFuZ2xlQ2FsbGJhY2tQcm9wZXJ0eSgpOiBSZWN0YW5nbGUge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRSZWN0YW5nbGUuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgocCA9PiBwID09PSBwb2ludCk7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludHNMYXllciguLi5wb2ludDogRWRpdFBvaW50W10pIHtcbiAgICBwb2ludC5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVJlY3RhbmdsZUxheWVyKCkge1xuICAgIHRoaXMucmVjdGFuZ2xlTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnJlY3RhbmdsZUxheWVyLnJlbW92ZSh0aGlzLmlkKTtcblxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2goZWRpdFBvaW50ID0+IHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKGVkaXRQb2ludC5nZXRJZCgpKTtcbiAgICB9KTtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUodGhpcy5tb3ZpbmdQb2ludC5nZXRJZCgpKTtcbiAgICAgIHRoaXMubW92aW5nUG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICBnZXRQb2ludHNDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxufVxuXG4iXX0=