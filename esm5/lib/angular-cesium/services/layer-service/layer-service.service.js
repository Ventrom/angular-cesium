import { __decorate } from "tslib";
import { EventEmitter, Injectable } from '@angular/core';
var LayerService = /** @class */ (function () {
    function LayerService() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    Object.defineProperty(LayerService.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        set: function (value) {
            this._cache = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "zIndex", {
        get: function () {
            return this._zIndex;
        },
        set: function (value) {
            if (value !== this._zIndex) {
                this.layerUpdate.emit();
            }
            this._zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (value) {
            if (value !== this._show) {
                this.layerUpdate.emit();
            }
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (context) {
            this._context = context;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    LayerService.prototype.setEntityName = function (name) {
        this._entityName = name;
    };
    LayerService.prototype.getEntityName = function () {
        return this._entityName;
    };
    LayerService.prototype.registerDescription = function (descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    };
    LayerService.prototype.unregisterDescription = function (descriptionComponent) {
        var index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    };
    LayerService.prototype.getDescriptions = function () {
        return this.descriptions;
    };
    LayerService.prototype.layerUpdates = function () {
        return this.layerUpdate;
    };
    LayerService = __decorate([
        Injectable()
    ], LayerService);
    return LayerService;
}());
export { LayerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS3pEO0lBQUE7UUFNVSxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQThFM0MsQ0FBQztJQTVFQyxzQkFBSSwrQkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7YUFFRCxVQUFVLEtBQWM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSxnQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7YUFFRCxVQUFXLEtBQWE7WUFDdEIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN6QjtZQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7OztPQVBBO0lBU0Qsc0JBQUksOEJBQUk7YUFBUjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO2FBRUQsVUFBUyxLQUFjO1lBQ3JCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDekI7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixDQUFDOzs7T0FQQTtJQVNELHNCQUFJLGlDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUVELFVBQVksS0FBbUI7WUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQixDQUFDOzs7T0FMQTtJQU9ELHNCQUFJLGlDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUVELFVBQVksT0FBTztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFCLENBQUM7OztPQUxBO0lBT0Qsb0NBQWEsR0FBYixVQUFjLElBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELG9DQUFhLEdBQWI7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELDBDQUFtQixHQUFuQixVQUFvQixvQkFBa0M7UUFDcEQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELDRDQUFxQixHQUFyQixVQUFzQixvQkFBa0M7UUFDdEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM5RCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRCxzQ0FBZSxHQUFmO1FBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQ0FBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFyRlUsWUFBWTtRQUR4QixVQUFVLEVBQUU7T0FDQSxZQUFZLENBc0Z4QjtJQUFELG1CQUFDO0NBQUEsQUF0RkQsSUFzRkM7U0F0RlksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcbmltcG9ydCB7IExheWVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9sYXllci1vcHRpb25zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExheWVyU2VydmljZSB7XG4gIHByaXZhdGUgX2NvbnRleHQ6IGFueTtcbiAgcHJpdmF0ZSBfb3B0aW9uczogTGF5ZXJPcHRpb25zO1xuICBwcml2YXRlIF9zaG93OiBib29sZWFuO1xuICBwcml2YXRlIF96SW5kZXg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfZW50aXR5TmFtZTogc3RyaW5nO1xuICBwcml2YXRlIF9jYWNoZSA9IHRydWU7XG4gIHByaXZhdGUgZGVzY3JpcHRpb25zOiBJRGVzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIGxheWVyVXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGdldCBjYWNoZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2FjaGU7XG4gIH1cblxuICBzZXQgY2FjaGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jYWNoZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHpJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl96SW5kZXg7XG4gIH1cblxuICBzZXQgekluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3pJbmRleCkge1xuICAgICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gICAgfVxuICAgIHRoaXMuX3pJbmRleCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHNob3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3c7XG4gIH1cblxuICBzZXQgc2hvdyh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fc2hvdykge1xuICAgICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gICAgfVxuICAgIHRoaXMuX3Nob3cgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IExheWVyT3B0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gIH1cblxuICBzZXQgb3B0aW9ucyh2YWx1ZTogTGF5ZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHZhbHVlO1xuICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICB9XG5cbiAgZ2V0IGNvbnRleHQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dDtcbiAgfVxuXG4gIHNldCBjb250ZXh0KGNvbnRleHQpIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgfVxuXG4gIHNldEVudGl0eU5hbWUobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fZW50aXR5TmFtZSA9IG5hbWU7XG4gIH1cblxuICBnZXRFbnRpdHlOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU5hbWU7XG4gIH1cblxuICByZWdpc3RlckRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uQ29tcG9uZW50OiBJRGVzY3JpcHRpb24pIHtcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbnMuaW5kZXhPZihkZXNjcmlwdGlvbkNvbXBvbmVudCkgPCAwKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9ucy5wdXNoKGRlc2NyaXB0aW9uQ29tcG9uZW50KTtcbiAgICB9XG4gIH1cblxuICB1bnJlZ2lzdGVyRGVzY3JpcHRpb24oZGVzY3JpcHRpb25Db21wb25lbnQ6IElEZXNjcmlwdGlvbikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kZXNjcmlwdGlvbnMuaW5kZXhPZihkZXNjcmlwdGlvbkNvbXBvbmVudCk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGVzY3JpcHRpb25zKCk6IElEZXNjcmlwdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbnM7XG4gIH1cblxuICBsYXllclVwZGF0ZXMoKTogRXZlbnRFbWl0dGVyPGFueT4ge1xuICAgIHJldHVybiB0aGlzLmxheWVyVXBkYXRlO1xuICB9XG59XG4iXX0=