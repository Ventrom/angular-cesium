import { __assign, __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditPoint = /** @class */ (function (_super) {
    __extends(EditPoint, _super);
    function EditPoint(entityId, position, pointProps, virtualPoint) {
        if (virtualPoint === void 0) { virtualPoint = false; }
        var _this = _super.call(this) || this;
        _this._show = true;
        _this.editedEntityId = entityId;
        _this.position = position;
        _this.id = _this.generateId();
        _this.pointProps = __assign({}, pointProps);
        _this._virtualEditPoint = virtualPoint;
        return _this;
    }
    Object.defineProperty(EditPoint.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (value) {
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditPoint.prototype, "props", {
        get: function () {
            return this.pointProps;
        },
        set: function (value) {
            this.pointProps = value;
        },
        enumerable: true,
        configurable: true
    });
    EditPoint.prototype.isVirtualEditPoint = function () {
        return this._virtualEditPoint;
    };
    EditPoint.prototype.setVirtualEditPoint = function (value) {
        this._virtualEditPoint = value;
    };
    EditPoint.prototype.getEditedEntityId = function () {
        return this.editedEntityId;
    };
    EditPoint.prototype.getPosition = function () {
        return this.position.clone();
    };
    EditPoint.prototype.getPositionCallbackProperty = function () {
        return new Cesium.CallbackProperty(this.getPosition.bind(this), false);
    };
    EditPoint.prototype.setPosition = function (position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    };
    EditPoint.prototype.getId = function () {
        return this.id;
    };
    EditPoint.prototype.generateId = function () {
        return 'edit-point-' + EditPoint.counter++;
    };
    EditPoint.counter = 0;
    return EditPoint;
}(AcEntity));
export { EditPoint };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1wb2ludC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvbW9kZWxzL2VkaXQtcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUlqRTtJQUErQiw2QkFBUTtJQVNyQyxtQkFBWSxRQUFnQixFQUFFLFFBQW9CLEVBQUUsVUFBdUIsRUFBRSxZQUFvQjtRQUFwQiw2QkFBQSxFQUFBLG9CQUFvQjtRQUFqRyxZQUNFLGlCQUFPLFNBTVI7UUFUTyxXQUFLLEdBQUcsSUFBSSxDQUFDO1FBSW5CLEtBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLEtBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLEtBQUksQ0FBQyxVQUFVLGdCQUFPLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUM7O0lBQ3hDLENBQUM7SUFFRCxzQkFBSSwyQkFBSTthQUFSO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFTLEtBQUs7WUFDWixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDRCQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsQ0FBQzthQUVELFVBQVUsS0FBaUI7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDMUIsQ0FBQzs7O09BSkE7SUFNRCxzQ0FBa0IsR0FBbEI7UUFDRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRUQsdUNBQW1CLEdBQW5CLFVBQW9CLEtBQWM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQscUNBQWlCLEdBQWpCO1FBQ0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRCwrQkFBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCwrQ0FBMkIsR0FBM0I7UUFDRSxPQUFPLElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFHRCwrQkFBVyxHQUFYLFVBQVksUUFBb0I7UUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELHlCQUFLLEdBQUw7UUFDRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVPLDhCQUFVLEdBQWxCO1FBQ0UsT0FBTyxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFsRU0saUJBQU8sR0FBRyxDQUFDLENBQUM7SUFtRXJCLGdCQUFDO0NBQUEsQUFwRUQsQ0FBK0IsUUFBUSxHQW9FdEM7U0FwRVksU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjRW50aXR5IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLWVudGl0eSc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4zIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjMnO1xuaW1wb3J0IHsgUG9pbnRQcm9wcyB9IGZyb20gJy4vcG9pbnQtZWRpdC1vcHRpb25zJztcblxuZXhwb3J0IGNsYXNzIEVkaXRQb2ludCBleHRlbmRzIEFjRW50aXR5IHtcbiAgc3RhdGljIGNvdW50ZXIgPSAwO1xuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBwb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfdmlydHVhbEVkaXRQb2ludDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBwb2ludFByb3BzOiBQb2ludFByb3BzO1xuICBwcml2YXRlIF9zaG93ID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nLCBwb3NpdGlvbjogQ2FydGVzaWFuMywgcG9pbnRQcm9wcz86IFBvaW50UHJvcHMsIHZpcnR1YWxQb2ludCA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmVkaXRlZEVudGl0eUlkID0gZW50aXR5SWQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIHRoaXMuaWQgPSB0aGlzLmdlbmVyYXRlSWQoKTtcbiAgICB0aGlzLnBvaW50UHJvcHMgPSB7Li4ucG9pbnRQcm9wc307XG4gICAgdGhpcy5fdmlydHVhbEVkaXRQb2ludCA9IHZpcnR1YWxQb2ludDtcbiAgfVxuXG4gIGdldCBzaG93KCkge1xuICAgIHJldHVybiB0aGlzLl9zaG93O1xuICB9XG5cbiAgc2V0IHNob3codmFsdWUpIHtcbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcHJvcHMoKTogUG9pbnRQcm9wcyB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRQcm9wcztcbiAgfVxuXG4gIHNldCBwcm9wcyh2YWx1ZTogUG9pbnRQcm9wcykge1xuICAgIHRoaXMucG9pbnRQcm9wcyA9IHZhbHVlO1xuICB9XG5cbiAgaXNWaXJ0dWFsRWRpdFBvaW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl92aXJ0dWFsRWRpdFBvaW50O1xuICB9XG5cbiAgc2V0VmlydHVhbEVkaXRQb2ludCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3ZpcnR1YWxFZGl0UG9pbnQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldEVkaXRlZEVudGl0eUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdGVkRW50aXR5SWQ7XG4gIH1cblxuICBnZXRQb3NpdGlvbigpOiBDYXJ0ZXNpYW4zIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xuICB9XG5cbiAgZ2V0UG9zaXRpb25DYWxsYmFja1Byb3BlcnR5KCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiBuZXcgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkodGhpcy5nZXRQb3NpdGlvbi5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gIH1cblxuXG4gIHNldFBvc2l0aW9uKHBvc2l0aW9uOiBDYXJ0ZXNpYW4zKSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gcG9zaXRpb24ueDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBwb3NpdGlvbi55O1xuICAgIHRoaXMucG9zaXRpb24ueiA9IHBvc2l0aW9uLno7XG4gIH1cblxuICBnZXRJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdlZGl0LXBvaW50LScgKyBFZGl0UG9pbnQuY291bnRlcisrO1xuICB9XG59XG4iXX0=