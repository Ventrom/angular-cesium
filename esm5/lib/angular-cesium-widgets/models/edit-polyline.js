import { __assign, __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditPolyline = /** @class */ (function (_super) {
    __extends(EditPolyline, _super);
    function EditPolyline(entityId, startPosition, endPosition, polylineProps) {
        var _this = _super.call(this) || this;
        _this.editedEntityId = entityId;
        _this.id = _this.generateId();
        _this.positions = [startPosition, endPosition];
        _this._polylineProps = __assign({}, polylineProps);
        return _this;
    }
    Object.defineProperty(EditPolyline.prototype, "props", {
        get: function () {
            return this._polylineProps;
        },
        set: function (value) {
            this._polylineProps = value;
        },
        enumerable: true,
        configurable: true
    });
    EditPolyline.prototype.getEditedEntityId = function () {
        return this.editedEntityId;
    };
    EditPolyline.prototype.getPositions = function () {
        return this.positions.map(function (p) { return p.clone(); });
    };
    EditPolyline.prototype.getPositionsCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPositions.bind(this), false);
    };
    EditPolyline.prototype.validatePositions = function () {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    };
    EditPolyline.prototype.getStartPosition = function () {
        return this.positions[0];
    };
    EditPolyline.prototype.getEndPosition = function () {
        return this.positions[1];
    };
    EditPolyline.prototype.setStartPosition = function (position) {
        this.positions[0] = position;
    };
    EditPolyline.prototype.setEndPosition = function (position) {
        this.positions[1] = position;
    };
    EditPolyline.prototype.getId = function () {
        return this.id;
    };
    EditPolyline.prototype.generateId = function () {
        return 'edit-polyline-' + EditPolyline.counter++;
    };
    EditPolyline.counter = 0;
    return EditPolyline;
}(AcEntity));
export { EditPolyline };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2x5bGluZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9seWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRTtJQUFrQyxnQ0FBUTtJQU94QyxzQkFBWSxRQUFnQixFQUFFLGFBQXlCLEVBQUUsV0FBdUIsRUFBRSxhQUE2QjtRQUEvRyxZQUNFLGlCQUFPLFNBS1I7UUFKQyxLQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztRQUMvQixLQUFJLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlDLEtBQUksQ0FBQyxjQUFjLGdCQUFPLGFBQWEsQ0FBQyxDQUFDOztJQUMzQyxDQUFDO0lBRUQsc0JBQUksK0JBQUs7YUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBVSxLQUFvQjtZQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDOzs7T0FKQTtJQU1ELHdDQUFpQixHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBRUQsbUNBQVksR0FBWjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQVQsQ0FBUyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUdELG1EQUE0QixHQUE1QjtRQUNFLE9BQU8sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELHdDQUFpQixHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDNUUsQ0FBQztJQUVELHVDQUFnQixHQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQscUNBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsdUNBQWdCLEdBQWhCLFVBQWlCLFFBQW9CO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsUUFBb0I7UUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVELDRCQUFLLEdBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVPLGlDQUFVLEdBQWxCO1FBQ0UsT0FBTyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQTdETSxvQkFBTyxHQUFHLENBQUMsQ0FBQztJQThEckIsbUJBQUM7Q0FBQSxBQS9ERCxDQUFrQyxRQUFRLEdBK0R6QztTQS9EWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdFBvbHlsaW5lIGV4dGVuZHMgQWNFbnRpdHkge1xuICBzdGF0aWMgY291bnRlciA9IDA7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBpZDogc3RyaW5nO1xuICBwcml2YXRlIHBvc2l0aW9uczogQ2FydGVzaWFuM1tdO1xuICBwcml2YXRlIF9wb2x5bGluZVByb3BzOiBQb2x5bGluZVByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKGVudGl0eUlkOiBzdHJpbmcsIHN0YXJ0UG9zaXRpb246IENhcnRlc2lhbjMsIGVuZFBvc2l0aW9uOiBDYXJ0ZXNpYW4zLCBwb2x5bGluZVByb3BzPzogUG9seWxpbmVQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5lZGl0ZWRFbnRpdHlJZCA9IGVudGl0eUlkO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLnBvc2l0aW9ucyA9IFtzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbl07XG4gICAgdGhpcy5fcG9seWxpbmVQcm9wcyA9IHsuLi5wb2x5bGluZVByb3BzfTtcbiAgfVxuXG4gIGdldCBwcm9wcygpOiBQb2x5bGluZVByb3BzIHtcbiAgICByZXR1cm4gdGhpcy5fcG9seWxpbmVQcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyh2YWx1ZTogUG9seWxpbmVQcm9wcykge1xuICAgIHRoaXMuX3BvbHlsaW5lUHJvcHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldEVkaXRlZEVudGl0eUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdGVkRW50aXR5SWQ7XG4gIH1cblxuICBnZXRQb3NpdGlvbnMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9ucy5tYXAocCA9PiBwLmNsb25lKCkpO1xuICB9XG5cblxuICBnZXRQb3NpdGlvbnNDYWxsYmFja1Byb3BlcnR5KCk6IENhcnRlc2lhbjNbXSB7XG4gICAgcmV0dXJuIG5ldyBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSh0aGlzLmdldFBvc2l0aW9ucy5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuICB2YWxpZGF0ZVBvc2l0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnBvc2l0aW9uc1sxXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0U3RhcnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMF07XG4gIH1cblxuICBnZXRFbmRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbMV07XG4gIH1cblxuICBzZXRTdGFydFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMF0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIHNldEVuZFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbnNbMV0gPSBwb3NpdGlvbjtcbiAgfVxuXG4gIGdldElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2VkaXQtcG9seWxpbmUtJyArIEVkaXRQb2x5bGluZS5jb3VudGVyKys7XG4gIH1cbn1cbiJdfQ==