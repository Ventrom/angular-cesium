import { __extends } from "tslib";
import { AcEntity } from '../../angular-cesium/models/ac-entity';
var EditArc = /** @class */ (function (_super) {
    __extends(EditArc, _super);
    function EditArc(entityId, center, radius, delta, angle, _arcProps) {
        var _this = _super.call(this) || this;
        _this._arcProps = _arcProps;
        _this.id = _this.generateId();
        _this.editedEntityId = entityId;
        _this._center = center;
        _this._radius = radius;
        _this._delta = delta;
        _this._angle = angle;
        return _this;
    }
    Object.defineProperty(EditArc.prototype, "props", {
        get: function () {
            return this._arcProps;
        },
        set: function (props) {
            this._arcProps = props;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (value) {
            this._angle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "delta", {
        get: function () {
            return this._delta;
        },
        set: function (value) {
            this._delta = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        set: function (value) {
            this._radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditArc.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (value) {
            this._center = value;
        },
        enumerable: true,
        configurable: true
    });
    EditArc.prototype.updateCenter = function (center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    };
    EditArc.prototype.getId = function () {
        return this.id;
    };
    EditArc.prototype.generateId = function () {
        return 'edit-arc-' + EditArc.counter++;
    };
    EditArc.counter = 0;
    return EditArc;
}(AcEntity));
export { EditArc };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC1hcmMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL21vZGVscy9lZGl0LWFyYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBSWpFO0lBQTZCLDJCQUFRO0lBU25DLGlCQUFZLFFBQWdCLEVBQUUsTUFBa0IsRUFBRSxNQUFjLEVBQUUsS0FBYSxFQUFFLEtBQWEsRUFBVSxTQUF3QjtRQUFoSSxZQUNFLGlCQUFPLFNBT1I7UUFSdUcsZUFBUyxHQUFULFNBQVMsQ0FBZTtRQUU5SCxLQUFJLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixLQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztRQUMvQixLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFDdEIsQ0FBQztJQUVELHNCQUFJLDBCQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQzthQUVELFVBQVUsS0FBb0I7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDekIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwwQkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7YUFFRCxVQUFVLEtBQWE7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwwQkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7YUFFRCxVQUFVLEtBQWE7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwyQkFBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7YUFFRCxVQUFXLEtBQWE7WUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwyQkFBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7YUFFRCxVQUFXLEtBQWlCO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7OztPQUpBO0lBTUQsOEJBQVksR0FBWixVQUFhLE1BQWtCO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCx1QkFBSyxHQUFMO1FBQ0UsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTyw0QkFBVSxHQUFsQjtRQUNFLE9BQU8sV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBdEVNLGVBQU8sR0FBRyxDQUFDLENBQUM7SUF1RXJCLGNBQUM7Q0FBQSxBQXhFRCxDQUE2QixRQUFRLEdBd0VwQztTQXhFWSxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvYWMtZW50aXR5JztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5pbXBvcnQgeyBQb2x5bGluZVByb3BzIH0gZnJvbSAnLi9wb2x5bGluZS1lZGl0LW9wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgRWRpdEFyYyBleHRlbmRzIEFjRW50aXR5IHtcbiAgc3RhdGljIGNvdW50ZXIgPSAwO1xuICBwcml2YXRlIGlkOiBzdHJpbmc7XG4gIHByaXZhdGUgZWRpdGVkRW50aXR5SWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfY2VudGVyOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9yYWRpdXM6IG51bWJlcjtcbiAgcHJpdmF0ZSBfZGVsdGE6IG51bWJlcjtcbiAgcHJpdmF0ZSBfYW5nbGU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihlbnRpdHlJZDogc3RyaW5nLCBjZW50ZXI6IENhcnRlc2lhbjMsIHJhZGl1czogbnVtYmVyLCBkZWx0YTogbnVtYmVyLCBhbmdsZTogbnVtYmVyLCBwcml2YXRlIF9hcmNQcm9wczogUG9seWxpbmVQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pZCA9IHRoaXMuZ2VuZXJhdGVJZCgpO1xuICAgIHRoaXMuZWRpdGVkRW50aXR5SWQgPSBlbnRpdHlJZDtcbiAgICB0aGlzLl9jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy5fcmFkaXVzID0gcmFkaXVzO1xuICAgIHRoaXMuX2RlbHRhID0gZGVsdGE7XG4gICAgdGhpcy5fYW5nbGUgPSBhbmdsZTtcbiAgfVxuXG4gIGdldCBwcm9wcygpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJjUHJvcHM7XG4gIH1cblxuICBzZXQgcHJvcHMocHJvcHM6IFBvbHlsaW5lUHJvcHMpIHtcbiAgICB0aGlzLl9hcmNQcm9wcyA9IHByb3BzO1xuICB9XG5cbiAgZ2V0IGFuZ2xlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2FuZ2xlO1xuICB9XG5cbiAgc2V0IGFuZ2xlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9hbmdsZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGRlbHRhKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbHRhO1xuICB9XG5cbiAgc2V0IGRlbHRhKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9kZWx0YSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJhZGl1cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yYWRpdXM7XG4gIH1cblxuICBzZXQgcmFkaXVzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yYWRpdXMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjZW50ZXIoKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX2NlbnRlcjtcbiAgfVxuXG4gIHNldCBjZW50ZXIodmFsdWU6IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9jZW50ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZUNlbnRlcihjZW50ZXI6IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9jZW50ZXIueCA9IGNlbnRlci54O1xuICAgIHRoaXMuX2NlbnRlci55ID0gY2VudGVyLnk7XG4gICAgdGhpcy5fY2VudGVyLnogPSBjZW50ZXIuejtcbiAgfVxuXG4gIGdldElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ2VkaXQtYXJjLScgKyBFZGl0QXJjLmNvdW50ZXIrKztcbiAgfVxufVxuIl19