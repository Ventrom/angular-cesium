import { __assign, __extends, __read, __spread } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditablePolyline = /** @class */ (function (_super) {
    __extends(EditablePolyline, _super);
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
        _this._pointProps = __assign({}, editOptions.pointProps);
        _this.props = __assign({}, editOptions.polylineProps);
        if (positions && positions.length >= 2) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolyline.prototype, "labels", {
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
    Object.defineProperty(EditablePolyline.prototype, "props", {
        get: function () {
            return this.polylineProps;
        },
        set: function (value) {
            this.polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "pointProps", {
        get: function () {
            return this._pointProps;
        },
        set: function (value) {
            this._pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolyline.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            var _this = this;
            this._enableEdit = value;
            this.positions.forEach(function (point) {
                point.show = value;
                _this.updatePointsLayer(false, point);
            });
        },
        enumerable: true,
        configurable: true
    });
    EditablePolyline.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    };
    EditablePolyline.prototype.setManually = function (points, polylineProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach(function (p) { return _this.pointsLayer.remove(p.getId()); });
        var newPoints = [];
        for (var i = 0; i < points.length; i++) {
            var pointOrCartesian = points[i];
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
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.addAllVirtualEditPoints();
    };
    EditablePolyline.prototype.addAllVirtualEditPoints = function () {
        var _this = this;
        var currentPoints = __spread(this.positions);
        currentPoints.forEach(function (pos, index) {
            if (index !== currentPoints.length - 1) {
                var currentPoint = pos;
                var nextIndex = (index + 1) % (currentPoints.length);
                var nextPoint = currentPoints[nextIndex];
                var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
                _this.updatePointsLayer(false, midPoint);
            }
        });
    };
    EditablePolyline.prototype.setMiddleVirtualPoint = function (firstP, secondP) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cesium.Cartesian3());
        var midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    EditablePolyline.prototype.updateMiddleVirtualPoint = function (virtualEditPoint, prevPoint, nextPoint) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cesium.Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    };
    EditablePolyline.prototype.changeVirtualPointToRealPoint = function (point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        var pointsCount = this.positions.length;
        var pointIndex = this.positions.indexOf(point);
        var nextIndex = (pointIndex + 1) % (pointsCount);
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        var nextPoint = this.positions[nextIndex];
        var prePoint = this.positions[preIndex];
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    };
    EditablePolyline.prototype.renderPolylines = function () {
        var _this = this;
        this.polylines.forEach(function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); });
        this.polylines = [];
        var realPoints = this.positions.filter(function (point) { return !point.isVirtualEditPoint(); });
        realPoints.forEach(function (point, index) {
            if (index !== realPoints.length - 1) {
                var nextIndex = (index + 1);
                var nextPoint = realPoints[nextIndex];
                var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.polylineProps);
                _this.polylines.push(polyline);
                _this.polylinesLayer.update(polyline, polyline.getId());
            }
        });
    };
    EditablePolyline.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    EditablePolyline.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    };
    EditablePolyline.prototype.movePointFinish = function (editPoint) {
        if (this.editOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    };
    EditablePolyline.prototype.movePoint = function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.editOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            var pointsCount = this.positions.length;
            var pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            }
            if (pointIndex > 0) {
                var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    };
    EditablePolyline.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditablePolyline.prototype.moveShape = function (startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        var delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach(function (point) {
            var newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.lastDraggedToPosition = draggedToPosition;
    };
    EditablePolyline.prototype.endMoveShape = function () {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
    };
    EditablePolyline.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter(function (p) { return p.isVirtualEditPoint(); })
            .forEach(function (p) { return _this.removePosition(p); });
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    };
    EditablePolyline.prototype.addLastPoint = function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    };
    EditablePolyline.prototype.getRealPositions = function () {
        return this.getRealPoints()
            .map(function (position) { return position.getPosition(); });
    };
    EditablePolyline.prototype.getRealPoints = function () {
        var _this = this;
        return this.positions
            .filter(function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; });
    };
    EditablePolyline.prototype.getPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return position !== _this.movingPoint; });
    };
    EditablePolyline.prototype.getPositions = function () {
        return this.positions.map(function (position) { return position.getPosition(); });
    };
    EditablePolyline.prototype.getPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositions.bind(this), false);
    };
    EditablePolyline.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditablePolyline.prototype.updatePointsLayer = function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var point = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            point[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditablePolyline.prototype.update = function () {
        this.updatePointsLayer();
    };
    EditablePolyline.prototype.dispose = function () {
        var _this = this;
        this.positions.forEach(function (editPoint) {
            _this.pointsLayer.remove(editPoint.getId());
        });
        this.polylines.forEach(function (line) { return _this.polylinesLayer.remove(line.getId()); });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    };
    EditablePolyline.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditablePolyline.prototype.getId = function () {
        return this.id;
    };
    return EditablePolyline;
}(AcEntity));
export { EditablePolyline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWxpbmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1wb2x5bGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBTS9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUM1RixPQUFPLEVBQUUsaUJBQWlCLEVBQWMsTUFBTSxlQUFlLENBQUM7QUFFOUQ7SUFBc0Msb0NBQVE7SUFZNUMsMEJBQW9CLEVBQVUsRUFDVixXQUE2QixFQUM3QixjQUFnQyxFQUNoQyxtQkFBd0MsRUFDeEMsV0FBZ0MsRUFDeEMsU0FBd0I7UUFMcEMsWUFNRSxpQkFBTyxTQU1SO1FBWm1CLFFBQUUsR0FBRixFQUFFLENBQVE7UUFDVixpQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFDN0Isb0JBQWMsR0FBZCxjQUFjLENBQWtCO1FBQ2hDLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsaUJBQVcsR0FBWCxXQUFXLENBQXFCO1FBZjVDLGVBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBRTVCLGVBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLGtCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGlCQUFXLEdBQUcsSUFBSSxDQUFDO1FBSW5CLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBU2pDLEtBQUksQ0FBQyxXQUFXLGdCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxLQUFJLENBQUMsS0FBSyxnQkFBTyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUMsSUFBSSxTQUFTLElB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dWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi9lZGl0LXBvbHlsaW5lJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4vcG9pbnQtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IFBvbHlsaW5lRWRpdE9wdGlvbnMsIFBvbHlsaW5lUHJvcHMgfSBmcm9tICcuL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBHZW9VdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcblxuZXhwb3J0IGNsYXNzIEVkaXRhYmxlUG9seWxpbmUgZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuXG4gIHByaXZhdGUgcG9seWxpbmVzOiBFZGl0UG9seWxpbmVbXSA9IFtdO1xuICBwcml2YXRlIG1vdmluZ1BvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgZG9uZUNyZWF0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9wb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIHBvbHlsaW5lUHJvcHM6IFBvbHlsaW5lUHJvcHM7XG4gIHByaXZhdGUgbGFzdERyYWdnZWRUb1Bvc2l0aW9uOiBhbnk7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIHBvaW50c0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHBvbHlsaW5lc0xheWVyOiBBY0xheWVyQ29tcG9uZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgZWRpdE9wdGlvbnM6IFBvbHlsaW5lRWRpdE9wdGlvbnMsXG4gICAgICAgICAgICAgIHBvc2l0aW9ucz86IENhcnRlc2lhbjNbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcG9pbnRQcm9wcyA9IHsuLi5lZGl0T3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICB0aGlzLnByb3BzID0gey4uLmVkaXRPcHRpb25zLnBvbHlsaW5lUHJvcHN9O1xuICAgIGlmIChwb3NpdGlvbnMgJiYgcG9zaXRpb25zLmxlbmd0aCA+PSAyKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uc1tpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLnBvbHlsaW5lUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHModmFsdWU6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLnBvbHlsaW5lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwb2ludFByb3BzKCk6IFBvaW50UHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2ludFByb3BzO1xuICB9XG5cbiAgc2V0IHBvaW50UHJvcHModmFsdWU6IFBvaW50UHJvcHMpIHtcbiAgICB0aGlzLl9wb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgcG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gIH1cblxuICBzZXRNYW51YWxseShwb2ludHM6IHtcbiAgICBwb3NpdGlvbjogQ2FydGVzaWFuMyxcbiAgICBwb2ludFByb3A/OiBQb2ludFByb3BzXG4gIH1bXSB8IENhcnRlc2lhbjNbXSwgcG9seWxpbmVQcm9wcz86IFBvbHlsaW5lUHJvcHMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcG9seWxpbmUgaXMgY3JlYXRlZCcpO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci5yZW1vdmUocC5nZXRJZCgpKSk7XG5cbiAgICBjb25zdCBuZXdQb2ludHM6IEVkaXRQb2ludFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvaW50T3JDYXJ0ZXNpYW46IGFueSA9IHBvaW50c1tpXTtcbiAgICAgIGxldCBuZXdQb2ludCA9IG51bGw7XG4gICAgICBpZiAocG9pbnRPckNhcnRlc2lhbi5wb2ludFByb3BzKSB7XG4gICAgICAgIG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb2ludE9yQ2FydGVzaWFuLnBvc2l0aW9uLCBwb2ludE9yQ2FydGVzaWFuLnBvaW50UHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvaW50T3JDYXJ0ZXNpYW4sIHRoaXMuX3BvaW50UHJvcHMpO1xuICAgICAgfVxuICAgICAgbmV3UG9pbnRzLnB1c2gobmV3UG9pbnQpO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucyA9IG5ld1BvaW50cztcbiAgICB0aGlzLnBvbHlsaW5lUHJvcHMgPSBwb2x5bGluZVByb3BzID8gcG9seWxpbmVQcm9wcyA6IHRoaXMucG9seWxpbmVQcm9wcztcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKSB7XG4gICAgY29uc3QgY3VycmVudFBvaW50cyA9IFsuLi50aGlzLnBvc2l0aW9uc107XG4gICAgY3VycmVudFBvaW50cy5mb3JFYWNoKChwb3MsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggIT09IGN1cnJlbnRQb2ludHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UG9pbnQgPSBwb3M7XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpICUgKGN1cnJlbnRQb2ludHMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbmV4dFBvaW50ID0gY3VycmVudFBvaW50c1tuZXh0SW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IG1pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQoY3VycmVudFBvaW50LCBuZXh0UG9pbnQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIG1pZFBvaW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TWlkZGxlVmlydHVhbFBvaW50KGZpcnN0UDogRWRpdFBvaW50LCBzZWNvbmRQOiBFZGl0UG9pbnQpOiBFZGl0UG9pbnQge1xuICAgIGNvbnN0IG1pZFBvaW50Q2FydGVzaWFuMyA9IENlc2l1bS5DYXJ0ZXNpYW4zLmxlcnAoZmlyc3RQLmdldFBvc2l0aW9uKCksIHNlY29uZFAuZ2V0UG9zaXRpb24oKSwgMC41LCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSk7XG4gICAgY29uc3QgbWlkUG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIG1pZFBvaW50Q2FydGVzaWFuMywgdGhpcy5fcG9pbnRQcm9wcyk7XG4gICAgbWlkUG9pbnQuc2V0VmlydHVhbEVkaXRQb2ludCh0cnVlKTtcblxuICAgIGNvbnN0IGZpcnN0SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKGZpcnN0UCk7XG4gICAgdGhpcy5wb3NpdGlvbnMuc3BsaWNlKGZpcnN0SW5kZXggKyAxLCAwLCBtaWRQb2ludCk7XG4gICAgcmV0dXJuIG1pZFBvaW50O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVNaWRkbGVWaXJ0dWFsUG9pbnQodmlydHVhbEVkaXRQb2ludDogRWRpdFBvaW50LCBwcmV2UG9pbnQ6IEVkaXRQb2ludCwgbmV4dFBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBjb25zdCBtaWRQb2ludENhcnRlc2lhbjMgPSBDZXNpdW0uQ2FydGVzaWFuMy5sZXJwKHByZXZQb2ludC5nZXRQb3NpdGlvbigpLCBuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSwgMC41LCBuZXcgQ2VzaXVtLkNhcnRlc2lhbjMoKSk7XG4gICAgdmlydHVhbEVkaXRQb2ludC5zZXRQb3NpdGlvbihtaWRQb2ludENhcnRlc2lhbjMpO1xuICB9XG5cbiAgY2hhbmdlVmlydHVhbFBvaW50VG9SZWFsUG9pbnQocG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIHBvaW50LnNldFZpcnR1YWxFZGl0UG9pbnQoZmFsc2UpOyAvLyBhY3R1YWwgcG9pbnQgYmVjb21lcyBhIHJlYWwgcG9pbnRcbiAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBjb25zdCBwb2ludEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihwb2ludCk7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCk7XG4gICAgY29uc3QgcHJlSW5kZXggPSAoKHBvaW50SW5kZXggLSAxKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50O1xuXG4gICAgY29uc3QgbmV4dFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbbmV4dEluZGV4XTtcbiAgICBjb25zdCBwcmVQb2ludCA9IHRoaXMucG9zaXRpb25zW3ByZUluZGV4XTtcblxuICAgIGNvbnN0IGZpcnN0TWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChwcmVQb2ludCwgcG9pbnQpO1xuICAgIGNvbnN0IHNlY01pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQocG9pbnQsIG5leHRQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgZmlyc3RNaWRQb2ludCwgc2VjTWlkUG9pbnQsIHBvaW50KTtcblxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJQb2x5bGluZXMoKSB7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChwb2x5bGluZSA9PiB0aGlzLnBvbHlsaW5lc0xheWVyLnJlbW92ZShwb2x5bGluZS5nZXRJZCgpKSk7XG4gICAgdGhpcy5wb2x5bGluZXMgPSBbXTtcbiAgICBjb25zdCByZWFsUG9pbnRzID0gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvaW50ID0+ICFwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSk7XG4gICAgcmVhbFBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCAhPT0gcmVhbFBvaW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpO1xuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSByZWFsUG9pbnRzW25leHRJbmRleF07XG4gICAgICAgIGNvbnN0IHBvbHlsaW5lID0gbmV3IEVkaXRQb2x5bGluZSh0aGlzLmlkLCBwb2ludC5nZXRQb3NpdGlvbigpLCBuZXh0UG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy5wb2x5bGluZVByb3BzKTtcbiAgICAgICAgdGhpcy5wb2x5bGluZXMucHVzaChwb2x5bGluZSk7XG4gICAgICAgIHRoaXMucG9seWxpbmVzTGF5ZXIudXBkYXRlKHBvbHlsaW5lLCBwb2x5bGluZS5nZXRJZCgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFkZFBvaW50RnJvbUV4aXN0aW5nKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgY29uc3QgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvc2l0aW9uLCB0aGlzLl9wb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKG5ld1BvaW50KTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIG5ld1BvaW50KTtcbiAgfVxuXG5cbiAgYWRkUG9pbnQocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNGaXJzdFBvaW50ID0gIXRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBpZiAoaXNGaXJzdFBvaW50KSB7XG4gICAgICBjb25zdCBmaXJzdFBvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5fcG9pbnRQcm9wcyk7XG4gICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKGZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBmaXJzdFBvaW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbi5jbG9uZSgpLCB0aGlzLl9wb2ludFByb3BzKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHRoaXMubW92aW5nUG9pbnQpO1xuXG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgfVxuXG4gIG1vdmVQb2ludEZpbmlzaChlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGlmICh0aGlzLmVkaXRPcHRpb25zLmNsYW1wSGVpZ2h0VG8zRCkge1xuICAgICAgZWRpdFBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoZmFsc2UsIGVkaXRQb2ludCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZVBvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMsIGVkaXRQb2ludDogRWRpdFBvaW50KSB7XG4gICAgZWRpdFBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgIGlmICh0aGlzLmRvbmVDcmVhdGlvbikge1xuICAgICAgaWYgKGVkaXRQb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UgJiYgdGhpcy5lZGl0T3B0aW9ucy5jbGFtcEhlaWdodFRvM0QpIHtcbiAgICAgICAgLy8gVG8gYXZvaWQgYnVnIHdpdGggcGlja1Bvc2l0aW9uKCkgb24gcG9pbnQgd2l0aCBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2VcbiAgICAgICAgZWRpdFBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuOyAvLyBpZ25vcmUgZmlyc3QgbW92ZSBiZWNhdXNlIHRoZSBwaWNrUG9zaXRpb24oKSBjb3VsZCBiZSB3cm9uZ1xuICAgICAgfVxuXG4gICAgICBpZiAoZWRpdFBvaW50LmlzVmlydHVhbEVkaXRQb2ludCgpKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVmlydHVhbFBvaW50VG9SZWFsUG9pbnQoZWRpdFBvaW50KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvaW50c0NvdW50ID0gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICAgICAgY29uc3QgcG9pbnRJbmRleCA9IHRoaXMucG9zaXRpb25zLmluZGV4T2YoZWRpdFBvaW50KTtcblxuICAgICAgaWYgKHBvaW50SW5kZXggPCB0aGlzLnBvc2l0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnN0IG5leHRWaXJ0dWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1socG9pbnRJbmRleCArIDEpICUgKHBvaW50c0NvdW50KV07XG4gICAgICAgIGNvbnN0IG5leHRSZWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1socG9pbnRJbmRleCArIDIpICUgKHBvaW50c0NvdW50KV07XG4gICAgICAgIHRoaXMudXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KG5leHRWaXJ0dWFsUG9pbnQsIGVkaXRQb2ludCwgbmV4dFJlYWxQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRJbmRleCA+IDApIHtcbiAgICAgICAgY29uc3QgcHJldlZpcnR1YWxQb2ludCA9IHRoaXMucG9zaXRpb25zWygocG9pbnRJbmRleCAtIDEpICsgcG9pbnRzQ291bnQpICUgcG9pbnRzQ291bnRdO1xuICAgICAgICBjb25zdCBwcmV2UmVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKChwb2ludEluZGV4IC0gMikgKyBwb2ludHNDb3VudCkgJSBwb2ludHNDb3VudF07XG4gICAgICAgIHRoaXMudXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KHByZXZWaXJ0dWFsUG9pbnQsIGVkaXRQb2ludCwgcHJldlJlYWxQb2ludCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgZWRpdFBvaW50KTtcbiAgfVxuXG4gIG1vdmVUZW1wTW92aW5nUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLm1vdmVQb2ludCh0b1Bvc2l0aW9uLCB0aGlzLm1vdmluZ1BvaW50KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlU2hhcGUoc3RhcnRNb3ZpbmdQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWx0YSA9IEdlb1V0aWxzU2VydmljZS5nZXRQb3NpdGlvbnNEZWx0YSh0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiwgZHJhZ2dlZFRvUG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29uc3QgbmV3UG9zID0gR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbihwb2ludC5nZXRQb3NpdGlvbigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgICBwb2ludC5zZXRQb3NpdGlvbihuZXdQb3MpO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgLi4udGhpcy5wb3NpdGlvbnMpO1xuICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gZHJhZ2dlZFRvUG9zaXRpb247XG4gIH1cblxuICBlbmRNb3ZlU2hhcGUoKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCAuLi50aGlzLnBvc2l0aW9ucyk7XG4gIH1cblxuICByZW1vdmVQb2ludChwb2ludFRvUmVtb3ZlOiBFZGl0UG9pbnQpIHtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHBvaW50VG9SZW1vdmUpO1xuICAgIHRoaXMucG9zaXRpb25zXG4gICAgICAuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSlcbiAgICAgIC5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuXG4gICAgdGhpcy5yZW5kZXJQb2x5bGluZXMoKTtcbiAgfVxuXG4gIGFkZExhc3RQb2ludChwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuZG9uZUNyZWF0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHRoaXMubW92aW5nUG9pbnQpOyAvLyByZW1vdmUgbW92aW5nUG9pbnRcbiAgICB0aGlzLm1vdmluZ1BvaW50ID0gbnVsbDtcblxuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgfVxuXG4gIGdldFJlYWxQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZWFsUG9pbnRzKClcbiAgICAgIC5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWFsUG9pbnRzKCk6IEVkaXRQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNcbiAgICAgIC5maWx0ZXIocG9zaXRpb24gPT4gIXBvc2l0aW9uLmlzVmlydHVhbEVkaXRQb2ludCgpICYmIHBvc2l0aW9uICE9PSB0aGlzLm1vdmluZ1BvaW50KTtcbiAgfVxuXG4gIGdldFBvaW50cygpOiBFZGl0UG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmZpbHRlcihwb3NpdGlvbiA9PiBwb3NpdGlvbiAhPT0gdGhpcy5tb3ZpbmdQb2ludCk7XG4gIH1cblxuICBnZXRQb3NpdGlvbnMoKTogQ2FydGVzaWFuM1tdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zQ2FsbGJhY2tQcm9wZXJ0eSgpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRQb3NpdGlvbnMuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgoKHApID0+IHAgPT09IHBvaW50KTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUocG9pbnQuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvaW50c0xheWVyKHJlbmRlclBvbHlsaW5lcyA9IHRydWUsIC4uLnBvaW50OiBFZGl0UG9pbnRbXSkge1xuICAgIGlmIChyZW5kZXJQb2x5bGluZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyUG9seWxpbmVzKCk7XG4gICAgfVxuICAgIHBvaW50LmZvckVhY2gocCA9PiB0aGlzLnBvaW50c0xheWVyLnVwZGF0ZShwLCBwLmdldElkKCkpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2goZWRpdFBvaW50ID0+IHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKGVkaXRQb2ludC5nZXRJZCgpKTtcbiAgICB9KTtcbiAgICB0aGlzLnBvbHlsaW5lcy5mb3JFYWNoKGxpbmUgPT4gdGhpcy5wb2x5bGluZXNMYXllci5yZW1vdmUobGluZS5nZXRJZCgpKSk7XG4gICAgaWYgKHRoaXMubW92aW5nUG9pbnQpIHtcbiAgICAgIHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHRoaXMubW92aW5nUG9pbnQuZ2V0SWQoKSk7XG4gICAgICB0aGlzLm1vdmluZ1BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnBvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgZ2V0UG9pbnRzQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cbn1cbiJdfQ==