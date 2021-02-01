import { __assign, __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
import { EditPoint } from './edit-point';
import { defaultLabelProps } from './label-props';
var EditablePoint = /** @class */ (function (_super) {
    __extends(EditablePoint, _super);
    function EditablePoint(id, pointLayer, coordinateConverter, editOptions, position) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.pointLayer = pointLayer;
        _this.coordinateConverter = coordinateConverter;
        _this.editOptions = editOptions;
        _this._enableEdit = true;
        _this._labels = [];
        _this._props = __assign({}, editOptions.pointProps);
        if (position) {
            _this.createFromExisting(position);
        }
        return _this;
    }
    Object.defineProperty(EditablePoint.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (labels) {
            if (!labels) {
                return;
            }
            var position = this.point.getPosition();
            this._labels = labels.map(function (label, index) {
                if (!label.position) {
                    label.position = position;
                }
                return Object.assign({}, defaultLabelProps, label);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePoint.prototype, "props", {
        get: function () {
            return this._props;
        },
        set: function (value) {
            this._props = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditablePoint.prototype, "enableEdit", {
        get: function () {
            return this._enableEdit;
        },
        set: function (value) {
            this._enableEdit = value;
            if (value) {
                this.point.props.color = Cesium.Color.WHITE;
            }
            else {
                this.point.props.color = Cesium.Color.DIMGREY;
                this.point.props.pixelSize = 10;
            }
            this.updatePointLayer();
        },
        enumerable: true,
        configurable: true
    });
    EditablePoint.prototype.createFromExisting = function (position) {
        this.point = new EditPoint(this.id, position, this._props);
        this.updatePointLayer();
    };
    EditablePoint.prototype.hasPosition = function (point) {
        if (point.position) {
            return true;
        }
        return false;
    };
    EditablePoint.prototype.setManually = function (point, props) {
        if (!this.enableEdit) {
            throw new Error('Update manually only in edit mode, after point is created');
        }
        var newProps = props;
        if (this.hasPosition(point)) {
            newProps = point.pointProp ? point.pointProp : props;
            this.point.setPosition(point.position);
        }
        else {
            this.point.setPosition(point);
        }
        this.point.props = newProps;
        this.updatePointLayer();
    };
    EditablePoint.prototype.addLastPoint = function (position) {
        this.point.setPosition(position);
        this.updatePointLayer();
    };
    EditablePoint.prototype.movePoint = function (toPosition) {
        if (!this.point) {
            this.point = new EditPoint(this.id, toPosition, this._props);
        }
        else {
            this.point.setPosition(toPosition);
        }
        this.updatePointLayer();
    };
    EditablePoint.prototype.getCurrentPoint = function () {
        return this.point;
    };
    EditablePoint.prototype.getPosition = function () {
        return this.point.getPosition();
    };
    EditablePoint.prototype.getPositionCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPosition.bind(this), false);
    };
    EditablePoint.prototype.updatePointLayer = function () {
        this.pointLayer.update(this.point, this.point.getId());
    };
    EditablePoint.prototype.update = function () {
        this.updatePointLayer();
    };
    EditablePoint.prototype.dispose = function () {
        this.pointLayer.remove(this.point.getId());
    };
    EditablePoint.prototype.getId = function () {
        return this.id;
    };
    return EditablePoint;
}(AcEntity));
export { EditablePoint };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGUtcG9pbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0YWJsZS1wb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBR2pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLGlCQUFpQixFQUFjLE1BQU0sZUFBZSxDQUFDO0FBUTlEO0lBQW1DLGlDQUFRO0lBTXpDLHVCQUFvQixFQUFVLEVBQ1YsVUFBNEIsRUFDNUIsbUJBQXdDLEVBQ3hDLFdBQTZCLEVBQ3JDLFFBQXFCO1FBSmpDLFlBS0UsaUJBQU8sU0FLUjtRQVZtQixRQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsZ0JBQVUsR0FBVixVQUFVLENBQWtCO1FBQzVCLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsaUJBQVcsR0FBWCxXQUFXLENBQWtCO1FBUHpDLGlCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRW5CLGFBQU8sR0FBaUIsRUFBRSxDQUFDO1FBUWpDLEtBQUksQ0FBQyxNQUFNLGdCQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxQyxJQUFJLFFBQVEsRUFBRTtZQUNaLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuQzs7SUFDSCxDQUFDO0lBRUQsc0JBQUksaUNBQU07YUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO2FBRUQsVUFBVyxNQUFvQjtZQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU87YUFDUjtZQUNELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxN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RUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlEO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCx1Q0FBZSxHQUFmO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxtQ0FBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxtREFBMkIsR0FBM0I7UUFDRSxPQUFPLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTyx3Q0FBZ0IsR0FBeEI7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCwrQkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCw2QkFBSyxHQUFMO1FBQ0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUE5SEQsQ0FBbUMsUUFBUSxHQThIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFZGl0UG9pbnQgfSBmcm9tICcuL2VkaXQtcG9pbnQnO1xuaW1wb3J0IHsgZGVmYXVsdExhYmVsUHJvcHMsIExhYmVsUHJvcHMgfSBmcm9tICcuL2xhYmVsLXByb3BzJztcbmltcG9ydCB7IFBvaW50RWRpdE9wdGlvbnMsIFBvaW50UHJvcHMgfSBmcm9tICcuL3BvaW50LWVkaXQtb3B0aW9ucyc7XG5cbmludGVyZmFjZSBQb3NpdGlvbldpdGhQb2ludFByb3BzIHtcbiAgcG9zaXRpb246IENhcnRlc2lhbjM7XG4gIHBvaW50UHJvcD86IFBvaW50UHJvcHM7XG59XG5cbmV4cG9ydCBjbGFzcyBFZGl0YWJsZVBvaW50IGV4dGVuZHMgQWNFbnRpdHkge1xuICBwcml2YXRlIHBvaW50OiBFZGl0UG9pbnQ7XG4gIHByaXZhdGUgX2VuYWJsZUVkaXQgPSB0cnVlO1xuICBwcml2YXRlIF9wcm9wczogUG9pbnRQcm9wcztcbiAgcHJpdmF0ZSBfbGFiZWxzOiBMYWJlbFByb3BzW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlkOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHByaXZhdGUgcG9pbnRMYXllcjogQWNMYXllckNvbXBvbmVudCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGVkaXRPcHRpb25zOiBQb2ludEVkaXRPcHRpb25zLFxuICAgICAgICAgICAgICBwb3NpdGlvbj86IENhcnRlc2lhbjMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3Byb3BzID0gey4uLmVkaXRPcHRpb25zLnBvaW50UHJvcHN9O1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgdGhpcy5jcmVhdGVGcm9tRXhpc3RpbmcocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBsYWJlbHMoKTogTGFiZWxQcm9wc1tdIHtcbiAgICByZXR1cm4gdGhpcy5fbGFiZWxzO1xuICB9XG5cbiAgc2V0IGxhYmVscyhsYWJlbHM6IExhYmVsUHJvcHNbXSkge1xuICAgIGlmICghbGFiZWxzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb2ludC5nZXRQb3NpdGlvbigpO1xuICAgIHRoaXMuX2xhYmVscyA9IGxhYmVscy5tYXAoKGxhYmVsLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFsYWJlbC5wb3NpdGlvbikge1xuICAgICAgICBsYWJlbC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRMYWJlbFByb3BzLCBsYWJlbCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3BzO1xuICB9XG5cbiAgc2V0IHByb3BzKHZhbHVlOiBQb2ludFByb3BzKSB7XG4gICAgdGhpcy5fcHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBlbmFibGVFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVFZGl0O1xuICB9XG5cbiAgc2V0IGVuYWJsZUVkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbmFibGVFZGl0ID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLmNvbG9yID0gQ2VzaXVtLkNvbG9yLldISVRFO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLmNvbG9yID0gQ2VzaXVtLkNvbG9yLkRJTUdSRVk7XG4gICAgICB0aGlzLnBvaW50LnByb3BzLnBpeGVsU2l6ZSA9IDEwO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRnJvbUV4aXN0aW5nKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgcG9zaXRpb24sIHRoaXMuX3Byb3BzKTtcbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFzUG9zaXRpb24ocG9pbnQ6IFBvc2l0aW9uV2l0aFBvaW50UHJvcHMgfCBDYXJ0ZXNpYW4zKTogcG9pbnQgaXMgUG9zaXRpb25XaXRoUG9pbnRQcm9wcyB7XG4gICAgaWYgKChwb2ludCBhcyBQb3NpdGlvbldpdGhQb2ludFByb3BzKS5wb3NpdGlvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldE1hbnVhbGx5KHBvaW50OiBQb3NpdGlvbldpdGhQb2ludFByb3BzIHwgQ2FydGVzaWFuMywgcHJvcHM/OiBQb2ludFByb3BzKSB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZUVkaXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVXBkYXRlIG1hbnVhbGx5IG9ubHkgaW4gZWRpdCBtb2RlLCBhZnRlciBwb2ludCBpcyBjcmVhdGVkJyk7XG4gICAgfVxuICAgIGxldCBuZXdQcm9wcyA9IHByb3BzO1xuICAgIGlmICh0aGlzLmhhc1Bvc2l0aW9uKHBvaW50KSkge1xuICAgICAgbmV3UHJvcHMgPSBwb2ludC5wb2ludFByb3AgPyBwb2ludC5wb2ludFByb3AgOiBwcm9wcztcbiAgICAgIHRoaXMucG9pbnQuc2V0UG9zaXRpb24ocG9pbnQucG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnNldFBvc2l0aW9uKHBvaW50KTtcbiAgICB9XG4gICAgdGhpcy5wb2ludC5wcm9wcyA9IG5ld1Byb3BzO1xuICAgIHRoaXMudXBkYXRlUG9pbnRMYXllcigpO1xuICB9XG5cbiAgYWRkTGFzdFBvaW50KHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb2ludC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy51cGRhdGVQb2ludExheWVyKCk7XG4gIH1cblxuICBtb3ZlUG9pbnQodG9Qb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIGlmICghdGhpcy5wb2ludCkge1xuICAgICAgdGhpcy5wb2ludCA9IG5ldyBFZGl0UG9pbnQodGhpcy5pZCwgdG9Qb3NpdGlvbiwgdGhpcy5fcHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBvaW50LnNldFBvc2l0aW9uKHRvUG9zaXRpb24pO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRQb2ludCgpOiBFZGl0UG9pbnQge1xuICAgIHJldHVybiB0aGlzLnBvaW50O1xuICB9XG5cbiAgZ2V0UG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnQuZ2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIGdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gbmV3IENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KHRoaXMuZ2V0UG9zaXRpb24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb2ludExheWVyKCkge1xuICAgIHRoaXMucG9pbnRMYXllci51cGRhdGUodGhpcy5wb2ludCwgdGhpcy5wb2ludC5nZXRJZCgpKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVBvaW50TGF5ZXIoKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wb2ludExheWVyLnJlbW92ZSh0aGlzLnBvaW50LmdldElkKCkpO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cbn1cbiJdfQ==