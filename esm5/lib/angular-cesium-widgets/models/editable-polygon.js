import { __assign, __extends, __read, __spread } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { EditPolyline } from './edit-polyline';
import { GeoUtilsService } from '../../angular-cesium/services/geo-utils/geo-utils.service';
import { defaultLabelProps } from './label-props';
var EditablePolygon = /** @class */ (function (_super) {
    __extends(EditablePolygon, _super);
    function EditablePolygon(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.polygonsLayer = polygonsLayer;
        _this.pointsLayer = pointsLayer;
        _this.polylinesLayer = polylinesLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.polygonOptions = polygonOptions;
        _this.positions = [];
        _this.polylines = [];
        _this.doneCreation = false;
        _this._enableEdit = true;
        _this._labels = [];
        _this.polygonProps = __assign({}, polygonOptions.polygonProps);
        _this.defaultPointProps = __assign({}, polygonOptions.pointProps);
        _this.defaultPolylineProps = __assign({}, polygonOptions.polylineProps);
        if (positions && positions.length >= 3) {
            _this.createFromExisting(positions);
        }
        return _this;
    }
    Object.defineProperty(EditablePolygon.prototype, "labels", {
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
    Object.defineProperty(EditablePolygon.prototype, "defaultPolylineProps", {
        get: function () {
            return this._defaultPolylineProps;
        },
        set: function (value) {
            this._defaultPolylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "defaultPointProps", {
        get: function () {
            return this._defaultPointProps;
        },
        set: function (value) {
            this._defaultPointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "polygonProps", {
        get: function () {
            return this._polygonProps;
        },
        set: function (value) {
            this._polygonProps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePolygon.prototype, "enableEdit", {
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
    EditablePolygon.prototype.createFromExisting = function (positions) {
        var _this = this;
        positions.forEach(function (position) {
            _this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    };
    EditablePolygon.prototype.setPointsManually = function (points, polygonProps) {
        var _this = this;
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
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
                newPoint = new EditPoint(this.id, pointOrCartesian, this.defaultPointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polygonProps = polygonProps ? polygonProps : this.polygonProps;
        this.updatePointsLayer.apply(this, __spread([true], this.positions));
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.addAllVirtualEditPoints = function () {
        var _this = this;
        var currentPoints = __spread(this.positions);
        currentPoints.forEach(function (pos, index) {
            var currentPoint = pos;
            var nextIndex = (index + 1) % (currentPoints.length);
            var nextPoint = currentPoints[nextIndex];
            var midPoint = _this.setMiddleVirtualPoint(currentPoint, nextPoint);
            _this.updatePointsLayer(false, midPoint);
        });
    };
    EditablePolygon.prototype.setMiddleVirtualPoint = function (firstP, secondP) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cesium.Cartesian3());
        var midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        var firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    };
    EditablePolygon.prototype.updateMiddleVirtualPoint = function (virtualEditPoint, prevPoint, nextPoint) {
        var midPointCartesian3 = Cesium.Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cesium.Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    };
    EditablePolygon.prototype.changeVirtualPointToRealPoint = function (point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        var pointsCount = this.positions.length;
        var pointIndex = this.positions.indexOf(point);
        var nextIndex = (pointIndex + 1) % (pointsCount);
        var preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        var nextPoint = this.positions[nextIndex];
        var prePoint = this.positions[preIndex];
        var firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        var secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.renderPolylines = function () {
        var _this = this;
        this.polylines.forEach(function (polyline) { return _this.polylinesLayer.remove(polyline.getId()); });
        this.polylines = [];
        var realPoints = this.positions.filter(function (pos) { return !pos.isVirtualEditPoint(); });
        realPoints.forEach(function (point, index) {
            var nextIndex = (index + 1) % (realPoints.length);
            var nextPoint = realPoints[nextIndex];
            var polyline = new EditPolyline(_this.id, point.getPosition(), nextPoint.getPosition(), _this.defaultPolylineProps);
            _this.polylines.push(polyline);
            _this.polylinesLayer.update(polyline, polyline.getId());
        });
    };
    EditablePolygon.prototype.addPointFromExisting = function (position) {
        var newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    };
    EditablePolygon.prototype.addPoint = function (position) {
        if (this.doneCreation) {
            return;
        }
        var isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            var firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    };
    EditablePolygon.prototype.movePointFinish = function (editPoint) {
        if (this.polygonOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    };
    EditablePolygon.prototype.movePoint = function (toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.polygonOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            var pointsCount = this.positions.length;
            var pointIndex = this.positions.indexOf(editPoint);
            var nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            var nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            var prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            var prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
        }
        this.updatePolygonsLayer();
        this.updatePointsLayer(true, editPoint);
    };
    EditablePolygon.prototype.moveTempMovingPoint = function (toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    };
    EditablePolygon.prototype.movePolygon = function (startMovingPosition, draggedToPosition) {
        var _this = this;
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
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach(function (point) { return _this.updatePointsLayer(true, point); });
    };
    EditablePolygon.prototype.endMovePolygon = function () {
        this.lastDraggedToPosition = undefined;
    };
    EditablePolygon.prototype.removePoint = function (pointToRemove) {
        var _this = this;
        this.removePosition(pointToRemove);
        this.positions
            .filter(function (p) { return p.isVirtualEditPoint(); })
            .forEach(function (p) { return _this.removePosition(p); });
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    EditablePolygon.prototype.addLastPoint = function (position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    };
    EditablePolygon.prototype.getRealPositions = function () {
        return this.getRealPoints().map(function (position) { return position.getPosition(); });
    };
    EditablePolygon.prototype.getRealPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return !position.isVirtualEditPoint() && position !== _this.movingPoint; });
    };
    EditablePolygon.prototype.getPoints = function () {
        var _this = this;
        return this.positions.filter(function (position) { return position !== _this.movingPoint; });
    };
    EditablePolygon.prototype.getPositionsHierarchy = function () {
        var positions = this.positions.filter(function (position) { return !position.isVirtualEditPoint(); }).map(function (position) { return position.getPosition().clone(); });
        return new Cesium.PolygonHierarchy(positions);
    };
    EditablePolygon.prototype.getPositionsHierarchyCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    };
    EditablePolygon.prototype.removePosition = function (point) {
        var index = this.positions.findIndex(function (p) { return p === point; });
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    };
    EditablePolygon.prototype.updatePolygonsLayer = function () {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    };
    EditablePolygon.prototype.updatePointsLayer = function (renderPolylines) {
        var _this = this;
        if (renderPolylines === void 0) { renderPolylines = true; }
        var points = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            points[_i - 1] = arguments[_i];
        }
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach(function (p) { return _this.pointsLayer.update(p, p.getId()); });
    };
    EditablePolygon.prototype.dispose = function () {
        var _this = this;
        this.polygonsLayer.remove(this.id);
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
    EditablePolygon.prototype.getPointsCount = function () {
        return this.positions.length;
    };
    EditablePolygon.prototype.getId = function () {
        return this.id;
    };
    return EditablePolygon;
}(AcEntity));
export { EditablePolygon };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXRhYmxlLXBvbHlnb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUkvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFJNUYsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBRTlEO0lBQXFDLG1DQUFRO0lBWTNDLHlCQUFvQixFQUFVLEVBQ1YsYUFBK0IsRUFDL0IsV0FBNkIsRUFDN0IsY0FBZ0MsRUFDaEMsbUJBQXdDLEVBQ3hDLGNBQWtDLEVBQzFDLFNBQXdCO1FBTnBDLFlBT0UsaUJBQU8sU0FPUjtRQWRtQixRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsbUJBQWEsR0FBYixhQUFhLENBQWtCO1FBQy9CLGlCQUFXLEdBQVgsV0FBVyxDQUFrQjtRQUM3QixvQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFDaEMseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxvQkFBYyxHQUFkLGNBQWMsQ0FBb0I7UUFoQjlDLGVBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBQzVCLGVBQVMsR0FBbUIsRUFBRSxDQUFDO1FBRS9CLGtCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGlCQUFXLEdBQUcsSUFBSSxDQUFDO1FBS25CLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBVWpDLEtBQUksQ0FBQyxZQUFZLGdCQUFPLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyRCxLQUFJLENBQUMsaUJBQWlCLGdCQUFPLGNB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QUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7WUFDOUIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7UUFDekUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsd0NBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELCtCQUFLLEdBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXRWRCxDQUFxQyxRQUFRLEdBc1Y1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgRWRpdFBvbHlsaW5lIH0gZnJvbSAnLi9lZGl0LXBvbHlsaW5lJztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcbmltcG9ydCB7IFBvbHlnb25FZGl0T3B0aW9ucywgUG9seWdvblByb3BzIH0gZnJvbSAnLi9wb2x5Z29uLWVkaXQtb3B0aW9ucyc7XG5pbXBvcnQgeyBQb2ludFByb3BzIH0gZnJvbSAnLi9wb2ludC1lZGl0LW9wdGlvbnMnO1xuaW1wb3J0IHsgUG9seWxpbmVQcm9wcyB9IGZyb20gJy4vcG9seWxpbmUtZWRpdC1vcHRpb25zJztcbmltcG9ydCB7IGRlZmF1bHRMYWJlbFByb3BzLCBMYWJlbFByb3BzIH0gZnJvbSAnLi9sYWJlbC1wcm9wcyc7XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBvbHlnb24gZXh0ZW5kcyBBY0VudGl0eSB7XG4gIHByaXZhdGUgcG9zaXRpb25zOiBFZGl0UG9pbnRbXSA9IFtdO1xuICBwcml2YXRlIHBvbHlsaW5lczogRWRpdFBvbHlsaW5lW10gPSBbXTtcbiAgcHJpdmF0ZSBtb3ZpbmdQb2ludDogRWRpdFBvaW50O1xuICBwcml2YXRlIGRvbmVDcmVhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIF9lbmFibGVFZGl0ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfcG9seWdvblByb3BzOiBQb2x5Z29uUHJvcHM7XG4gIHByaXZhdGUgX2RlZmF1bHRQb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9kZWZhdWx0UG9seWxpbmVQcm9wczogUG9seWxpbmVQcm9wcztcbiAgcHJpdmF0ZSBsYXN0RHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHByaXZhdGUgX2xhYmVsczogTGFiZWxQcm9wc1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZDogc3RyaW5nLFxuICAgICAgICAgICAgICBwcml2YXRlIHBvbHlnb25zTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9pbnRzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9seWxpbmVzTGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29vcmRpbmF0ZUNvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwb2x5Z29uT3B0aW9uczogUG9seWdvbkVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICBwb3NpdGlvbnM/OiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucG9seWdvblByb3BzID0gey4uLnBvbHlnb25PcHRpb25zLnBvbHlnb25Qcm9wc307XG4gICAgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyA9IHsuLi5wb2x5Z29uT3B0aW9ucy5wb2ludFByb3BzfTtcbiAgICB0aGlzLmRlZmF1bHRQb2x5bGluZVByb3BzID0gey4uLnBvbHlnb25PcHRpb25zLnBvbHlsaW5lUHJvcHN9O1xuICAgIGlmIChwb3NpdGlvbnMgJiYgcG9zaXRpb25zLmxlbmd0aCA+PSAzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21FeGlzdGluZyhwb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IHRoaXMuZ2V0UmVhbFBvc2l0aW9ucygpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uc1tpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TGFiZWxQcm9wcywgbGFiZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGRlZmF1bHRQb2x5bGluZVByb3BzKCk6IFBvbHlsaW5lUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0UG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIHNldCBkZWZhdWx0UG9seWxpbmVQcm9wcyh2YWx1ZTogUG9seWxpbmVQcm9wcykge1xuICAgIHRoaXMuX2RlZmF1bHRQb2x5bGluZVByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGVmYXVsdFBvaW50UHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzO1xuICB9XG5cbiAgZ2V0IHBvbHlnb25Qcm9wcygpOiBQb2x5Z29uUHJvcHMge1xuICAgIHJldHVybiB0aGlzLl9wb2x5Z29uUHJvcHM7XG4gIH1cblxuICBzZXQgcG9seWdvblByb3BzKHZhbHVlOiBQb2x5Z29uUHJvcHMpIHtcbiAgICB0aGlzLl9wb2x5Z29uUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIHNldCBkZWZhdWx0UG9pbnRQcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMuX2RlZmF1bHRQb2ludFByb3BzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZW5hYmxlRWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlRWRpdDtcbiAgfVxuXG4gIHNldCBlbmFibGVFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlRWRpdCA9IHZhbHVlO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgcG9pbnQuc2hvdyA9IHZhbHVlO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgcG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb25zOiBDYXJ0ZXNpYW4zW10pIHtcbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9pbnRGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH0pO1xuICAgIHRoaXMuYWRkQWxsVmlydHVhbEVkaXRQb2ludHMoKTtcbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcbiAgICB0aGlzLmRvbmVDcmVhdGlvbiA9IHRydWU7XG4gIH1cblxuICBzZXRQb2ludHNNYW51YWxseShwb2ludHM6IHsgcG9zaXRpb246IENhcnRlc2lhbjMsIHBvaW50UHJvcHM6IFBvaW50UHJvcHMgfVtdIHwgQ2FydGVzaWFuM1tdLCBwb2x5Z29uUHJvcHM/OiBQb2x5Z29uUHJvcHMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwZGF0ZSBtYW51YWxseSBvbmx5IGluIGVkaXQgbW9kZSwgYWZ0ZXIgcG9seWdvbiBpcyBjcmVhdGVkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wb3NpdGlvbnMuZm9yRWFjaChwID0+IHRoaXMucG9pbnRzTGF5ZXIucmVtb3ZlKHAuZ2V0SWQoKSkpO1xuICAgIGNvbnN0IG5ld1BvaW50czogRWRpdFBvaW50W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9pbnRPckNhcnRlc2lhbjogYW55ID0gcG9pbnRzW2ldO1xuICAgICAgbGV0IG5ld1BvaW50ID0gbnVsbDtcbiAgICAgIGlmIChwb2ludE9yQ2FydGVzaWFuLnBvaW50UHJvcHMpIHtcbiAgICAgICAgbmV3UG9pbnQgPSBuZXcgRWRpdFBvaW50KHRoaXMuaWQsIHBvaW50T3JDYXJ0ZXNpYW4ucG9zaXRpb24sIHBvaW50T3JDYXJ0ZXNpYW4ucG9pbnRQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9pbnRPckNhcnRlc2lhbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgICB9XG4gICAgICBuZXdQb2ludHMucHVzaChuZXdQb2ludCk7XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zID0gbmV3UG9pbnRzO1xuICAgIHRoaXMucG9seWdvblByb3BzID0gcG9seWdvblByb3BzID8gcG9seWdvblByb3BzIDogdGhpcy5wb2x5Z29uUHJvcHM7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCAuLi50aGlzLnBvc2l0aW9ucyk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpIHtcbiAgICBjb25zdCBjdXJyZW50UG9pbnRzID0gWy4uLnRoaXMucG9zaXRpb25zXTtcbiAgICBjdXJyZW50UG9pbnRzLmZvckVhY2goKHBvcywgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRQb2ludCA9IHBvcztcbiAgICAgIGNvbnN0IG5leHRJbmRleCA9IChpbmRleCArIDEpICUgKGN1cnJlbnRQb2ludHMubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG5leHRQb2ludCA9IGN1cnJlbnRQb2ludHNbbmV4dEluZGV4XTtcbiAgICAgIGNvbnN0IG1pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQoY3VycmVudFBvaW50LCBuZXh0UG9pbnQpO1xuICAgICAgdGhpcy51cGRhdGVQb2ludHNMYXllcihmYWxzZSwgbWlkUG9pbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRNaWRkbGVWaXJ0dWFsUG9pbnQoZmlyc3RQOiBFZGl0UG9pbnQsIHNlY29uZFA6IEVkaXRQb2ludCk6IEVkaXRQb2ludCB7XG4gICAgY29uc3QgbWlkUG9pbnRDYXJ0ZXNpYW4zID0gQ2VzaXVtLkNhcnRlc2lhbjMubGVycChmaXJzdFAuZ2V0UG9zaXRpb24oKSwgc2Vjb25kUC5nZXRQb3NpdGlvbigpLCAwLjUsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKTtcbiAgICBjb25zdCBtaWRQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgbWlkUG9pbnRDYXJ0ZXNpYW4zLCB0aGlzLmRlZmF1bHRQb2ludFByb3BzKTtcbiAgICBtaWRQb2ludC5zZXRWaXJ0dWFsRWRpdFBvaW50KHRydWUpO1xuXG4gICAgY29uc3QgZmlyc3RJbmRleCA9IHRoaXMucG9zaXRpb25zLmluZGV4T2YoZmlyc3RQKTtcbiAgICB0aGlzLnBvc2l0aW9ucy5zcGxpY2UoZmlyc3RJbmRleCArIDEsIDAsIG1pZFBvaW50KTtcbiAgICByZXR1cm4gbWlkUG9pbnQ7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludCh2aXJ0dWFsRWRpdFBvaW50OiBFZGl0UG9pbnQsIHByZXZQb2ludDogRWRpdFBvaW50LCBuZXh0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGNvbnN0IG1pZFBvaW50Q2FydGVzaWFuMyA9IENlc2l1bS5DYXJ0ZXNpYW4zLmxlcnAocHJldlBvaW50LmdldFBvc2l0aW9uKCksIG5leHRQb2ludC5nZXRQb3NpdGlvbigpLCAwLjUsIG5ldyBDZXNpdW0uQ2FydGVzaWFuMygpKTtcbiAgICB2aXJ0dWFsRWRpdFBvaW50LnNldFBvc2l0aW9uKG1pZFBvaW50Q2FydGVzaWFuMyk7XG4gIH1cblxuICBjaGFuZ2VWaXJ0dWFsUG9pbnRUb1JlYWxQb2ludChwb2ludDogRWRpdFBvaW50KSB7XG4gICAgcG9pbnQuc2V0VmlydHVhbEVkaXRQb2ludChmYWxzZSk7IC8vIHZpcnR1YWwgcG9pbnQgYmVjb21lcyBhIHJlYWwgcG9pbnRcbiAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICBjb25zdCBwb2ludEluZGV4ID0gdGhpcy5wb3NpdGlvbnMuaW5kZXhPZihwb2ludCk7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCk7XG4gICAgY29uc3QgcHJlSW5kZXggPSAoKHBvaW50SW5kZXggLSAxKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50O1xuXG4gICAgY29uc3QgbmV4dFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbbmV4dEluZGV4XTtcbiAgICBjb25zdCBwcmVQb2ludCA9IHRoaXMucG9zaXRpb25zW3ByZUluZGV4XTtcblxuICAgIGNvbnN0IGZpcnN0TWlkUG9pbnQgPSB0aGlzLnNldE1pZGRsZVZpcnR1YWxQb2ludChwcmVQb2ludCwgcG9pbnQpO1xuICAgIGNvbnN0IHNlY01pZFBvaW50ID0gdGhpcy5zZXRNaWRkbGVWaXJ0dWFsUG9pbnQocG9pbnQsIG5leHRQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBmaXJzdE1pZFBvaW50LCBzZWNNaWRQb2ludCwgcG9pbnQpO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuXG4gIH1cblxuICBwcml2YXRlIHJlbmRlclBvbHlsaW5lcygpIHtcbiAgICB0aGlzLnBvbHlsaW5lcy5mb3JFYWNoKHBvbHlsaW5lID0+IHRoaXMucG9seWxpbmVzTGF5ZXIucmVtb3ZlKHBvbHlsaW5lLmdldElkKCkpKTtcbiAgICB0aGlzLnBvbHlsaW5lcyA9IFtdO1xuICAgIGNvbnN0IHJlYWxQb2ludHMgPSB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocG9zID0+ICFwb3MuaXNWaXJ0dWFsRWRpdFBvaW50KCkpO1xuICAgIHJlYWxQb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBuZXh0SW5kZXggPSAoaW5kZXggKyAxKSAlIChyZWFsUG9pbnRzLmxlbmd0aCk7XG4gICAgICBjb25zdCBuZXh0UG9pbnQgPSByZWFsUG9pbnRzW25leHRJbmRleF07XG4gICAgICBjb25zdCBwb2x5bGluZSA9IG5ldyBFZGl0UG9seWxpbmUodGhpcy5pZCwgcG9pbnQuZ2V0UG9zaXRpb24oKSwgbmV4dFBvaW50LmdldFBvc2l0aW9uKCksIHRoaXMuZGVmYXVsdFBvbHlsaW5lUHJvcHMpO1xuICAgICAgdGhpcy5wb2x5bGluZXMucHVzaChwb2x5bGluZSk7XG4gICAgICB0aGlzLnBvbHlsaW5lc0xheWVyLnVwZGF0ZShwb2x5bGluZSwgcG9seWxpbmUuZ2V0SWQoKSk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRQb2ludEZyb21FeGlzdGluZyhwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGNvbnN0IG5ld1BvaW50ID0gbmV3IEVkaXRQb2ludCh0aGlzLmlkLCBwb3NpdGlvbiwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgdGhpcy5wb3NpdGlvbnMucHVzaChuZXdQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBuZXdQb2ludCk7XG4gIH1cblxuXG4gIGFkZFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgaWYgKHRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzRmlyc3RQb2ludCA9ICF0aGlzLnBvc2l0aW9ucy5sZW5ndGg7XG4gICAgaWYgKGlzRmlyc3RQb2ludCkge1xuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuZGVmYXVsdFBvaW50UHJvcHMpO1xuICAgICAgdGhpcy5wb3NpdGlvbnMucHVzaChmaXJzdFBvaW50KTtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgZmlyc3RQb2ludCk7XG4gICAgfVxuXG4gICAgdGhpcy5tb3ZpbmdQb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24uY2xvbmUoKSwgdGhpcy5kZWZhdWx0UG9pbnRQcm9wcyk7XG4gICAgdGhpcy5wb3NpdGlvbnMucHVzaCh0aGlzLm1vdmluZ1BvaW50KTtcblxuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIodHJ1ZSwgdGhpcy5tb3ZpbmdQb2ludCk7XG4gICAgdGhpcy51cGRhdGVQb2x5Z29uc0xheWVyKCk7XG4gIH1cblxuICBtb3ZlUG9pbnRGaW5pc2goZWRpdFBvaW50OiBFZGl0UG9pbnQpIHtcbiAgICBpZiAodGhpcy5wb2x5Z29uT3B0aW9ucy5jbGFtcEhlaWdodFRvM0QpIHtcbiAgICAgIGVkaXRQb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKGZhbHNlLCBlZGl0UG9pbnQpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVQb2ludCh0b1Bvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBlZGl0UG9pbnQ6IEVkaXRQb2ludCkge1xuICAgIGVkaXRQb2ludC5zZXRQb3NpdGlvbih0b1Bvc2l0aW9uKTtcbiAgICBpZiAodGhpcy5kb25lQ3JlYXRpb24pIHtcbiAgICAgIGlmIChlZGl0UG9pbnQucHJvcHMuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlICYmIHRoaXMucG9seWdvbk9wdGlvbnMuY2xhbXBIZWlnaHRUbzNEKSB7XG4gICAgICAgIC8vIFRvIGF2b2lkIGJ1ZyB3aXRoIHBpY2tQb3NpdGlvbigpIG9uIHBvaW50IHdpdGggZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlXG4gICAgICAgIGVkaXRQb2ludC5wcm9wcy5kaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybjsgLy8gaWdub3JlIGZpcnN0IG1vdmUgYmVjYXVzZSB0aGUgcGlja1Bvc2l0aW9uKCkgY291bGQgYmUgd3JvbmdcbiAgICAgIH1cblxuICAgICAgaWYgKGVkaXRQb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkge1xuICAgICAgICB0aGlzLmNoYW5nZVZpcnR1YWxQb2ludFRvUmVhbFBvaW50KGVkaXRQb2ludCk7XG4gICAgICB9XG4gICAgICBjb25zdCBwb2ludHNDb3VudCA9IHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgICAgIGNvbnN0IHBvaW50SW5kZXggPSB0aGlzLnBvc2l0aW9ucy5pbmRleE9mKGVkaXRQb2ludCk7XG4gICAgICBjb25zdCBuZXh0VmlydHVhbFBvaW50ID0gdGhpcy5wb3NpdGlvbnNbKHBvaW50SW5kZXggKyAxKSAlIChwb2ludHNDb3VudCldO1xuICAgICAgY29uc3QgbmV4dFJlYWxQb2ludCA9IHRoaXMucG9zaXRpb25zWyhwb2ludEluZGV4ICsgMikgJSAocG9pbnRzQ291bnQpXTtcbiAgICAgIGNvbnN0IHByZXZWaXJ0dWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1soKHBvaW50SW5kZXggLSAxKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50XTtcbiAgICAgIGNvbnN0IHByZXZSZWFsUG9pbnQgPSB0aGlzLnBvc2l0aW9uc1soKHBvaW50SW5kZXggLSAyKSArIHBvaW50c0NvdW50KSAlIHBvaW50c0NvdW50XTtcbiAgICAgIHRoaXMudXBkYXRlTWlkZGxlVmlydHVhbFBvaW50KG5leHRWaXJ0dWFsUG9pbnQsIGVkaXRQb2ludCwgbmV4dFJlYWxQb2ludCk7XG4gICAgICB0aGlzLnVwZGF0ZU1pZGRsZVZpcnR1YWxQb2ludChwcmV2VmlydHVhbFBvaW50LCBlZGl0UG9pbnQsIHByZXZSZWFsUG9pbnQpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvbHlnb25zTGF5ZXIoKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50c0xheWVyKHRydWUsIGVkaXRQb2ludCk7XG4gIH1cblxuICBtb3ZlVGVtcE1vdmluZ1BvaW50KHRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmdQb2ludCkge1xuICAgICAgdGhpcy5tb3ZlUG9pbnQodG9Qb3NpdGlvbiwgdGhpcy5tb3ZpbmdQb2ludCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZVBvbHlnb24oc3RhcnRNb3ZpbmdQb3NpdGlvbjogQ2FydGVzaWFuMywgZHJhZ2dlZFRvUG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZUNyZWF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFzdERyYWdnZWRUb1Bvc2l0aW9uID0gc3RhcnRNb3ZpbmdQb3NpdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWx0YSA9IEdlb1V0aWxzU2VydmljZS5nZXRQb3NpdGlvbnNEZWx0YSh0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiwgZHJhZ2dlZFRvUG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4ge1xuICAgICAgY29uc3QgbmV3UG9zID0gR2VvVXRpbHNTZXJ2aWNlLmFkZERlbHRhVG9Qb3NpdGlvbihwb2ludC5nZXRQb3NpdGlvbigpLCBkZWx0YSwgdHJ1ZSk7XG4gICAgICBwb2ludC5zZXRQb3NpdGlvbihuZXdQb3MpO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUG9pbnRzTGF5ZXIoKTtcbiAgICB0aGlzLmxhc3REcmFnZ2VkVG9Qb3NpdGlvbiA9IGRyYWdnZWRUb1Bvc2l0aW9uO1xuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2gocG9pbnQgPT4gdGhpcy51cGRhdGVQb2ludHNMYXllcih0cnVlLCBwb2ludCkpO1xuICB9XG5cbiAgZW5kTW92ZVBvbHlnb24oKSB7XG4gICAgdGhpcy5sYXN0RHJhZ2dlZFRvUG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICByZW1vdmVQb2ludChwb2ludFRvUmVtb3ZlOiBFZGl0UG9pbnQpIHtcbiAgICB0aGlzLnJlbW92ZVBvc2l0aW9uKHBvaW50VG9SZW1vdmUpO1xuICAgIHRoaXMucG9zaXRpb25zXG4gICAgICAuZmlsdGVyKHAgPT4gcC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSlcbiAgICAgIC5mb3JFYWNoKHAgPT4gdGhpcy5yZW1vdmVQb3NpdGlvbihwKSk7XG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuXG4gICAgdGhpcy5yZW5kZXJQb2x5bGluZXMoKTtcbiAgICBpZiAodGhpcy5nZXRQb2ludHNDb3VudCgpID49IDMpIHtcbiAgICAgIHRoaXMucG9seWdvbnNMYXllci51cGRhdGUodGhpcywgdGhpcy5pZCk7XG4gICAgfVxuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5kb25lQ3JlYXRpb24gPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlUG9zaXRpb24odGhpcy5tb3ZpbmdQb2ludCk7IC8vIHJlbW92ZSBtb3ZpbmdQb2ludFxuICAgIHRoaXMubW92aW5nUG9pbnQgPSBudWxsO1xuICAgIHRoaXMudXBkYXRlUG9seWdvbnNMYXllcigpO1xuXG4gICAgdGhpcy5hZGRBbGxWaXJ0dWFsRWRpdFBvaW50cygpO1xuICB9XG5cbiAgZ2V0UmVhbFBvc2l0aW9ucygpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiB0aGlzLmdldFJlYWxQb2ludHMoKS5tYXAocG9zaXRpb24gPT4gcG9zaXRpb24uZ2V0UG9zaXRpb24oKSk7XG4gIH1cblxuICBnZXRSZWFsUG9pbnRzKCk6IEVkaXRQb2ludFtdIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvc2l0aW9uID0+ICFwb3NpdGlvbi5pc1ZpcnR1YWxFZGl0UG9pbnQoKSAmJiBwb3NpdGlvbiAhPT0gdGhpcy5tb3ZpbmdQb2ludCk7XG4gIH1cblxuICBnZXRQb2ludHMoKTogRWRpdFBvaW50W10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5maWx0ZXIocG9zaXRpb24gPT4gcG9zaXRpb24gIT09IHRoaXMubW92aW5nUG9pbnQpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zSGllcmFyY2h5KCk6IENhcnRlc2lhbjNbXSB7XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5wb3NpdGlvbnMuZmlsdGVyKHBvc2l0aW9uID0+ICFwb3NpdGlvbi5pc1ZpcnR1YWxFZGl0UG9pbnQoKSkubWFwKHBvc2l0aW9uID0+IHBvc2l0aW9uLmdldFBvc2l0aW9uKCkuY2xvbmUoKSk7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uUG9seWdvbkhpZXJhcmNoeShwb3NpdGlvbnMpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25zSGllcmFyY2h5Q2FsbGJhY2tQcm9wZXJ0eSgpOiBDYXJ0ZXNpYW4zW10ge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRQb3NpdGlvbnNIaWVyYXJjaHkuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVQb3NpdGlvbihwb2ludDogRWRpdFBvaW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnBvc2l0aW9ucy5maW5kSW5kZXgoKHApID0+IHAgPT09IHBvaW50KTtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zaXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy5wb2ludHNMYXllci5yZW1vdmUocG9pbnQuZ2V0SWQoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVBvbHlnb25zTGF5ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ2V0UG9pbnRzQ291bnQoKSA+PSAzKSB7XG4gICAgICB0aGlzLnBvbHlnb25zTGF5ZXIudXBkYXRlKHRoaXMsIHRoaXMuaWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9pbnRzTGF5ZXIocmVuZGVyUG9seWxpbmVzID0gdHJ1ZSwgLi4ucG9pbnRzOiBFZGl0UG9pbnRbXSkge1xuICAgIGlmIChyZW5kZXJQb2x5bGluZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyUG9seWxpbmVzKCk7XG4gICAgfVxuICAgIHBvaW50cy5mb3JFYWNoKHAgPT4gdGhpcy5wb2ludHNMYXllci51cGRhdGUocCwgcC5nZXRJZCgpKSk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucG9seWdvbnNMYXllci5yZW1vdmUodGhpcy5pZCk7XG5cbiAgICB0aGlzLnBvc2l0aW9ucy5mb3JFYWNoKGVkaXRQb2ludCA9PiB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZShlZGl0UG9pbnQuZ2V0SWQoKSk7XG4gICAgfSk7XG4gICAgdGhpcy5wb2x5bGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMucG9seWxpbmVzTGF5ZXIucmVtb3ZlKGxpbmUuZ2V0SWQoKSkpO1xuICAgIGlmICh0aGlzLm1vdmluZ1BvaW50KSB7XG4gICAgICB0aGlzLnBvaW50c0xheWVyLnJlbW92ZSh0aGlzLm1vdmluZ1BvaW50LmdldElkKCkpO1xuICAgICAgdGhpcy5tb3ZpbmdQb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGdldFBvaW50c0NvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb25zLmxlbmd0aDtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG59XG4iXX0=