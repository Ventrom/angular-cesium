var OptimizedEntityCollection = /** @class */ (function () {
    function OptimizedEntityCollection(entityCollection, collectionSize, updateRate) {
        if (collectionSize === void 0) { collectionSize = -1; }
        if (updateRate === void 0) { updateRate = -1; }
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    OptimizedEntityCollection.prototype.setShow = function (show) {
        this.entityCollection.show = show;
    };
    Object.defineProperty(OptimizedEntityCollection.prototype, "isSuspended", {
        get: function () {
            return this._isSuspended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "updateRate", {
        get: function () {
            return this._updateRate;
        },
        set: function (value) {
            this._updateRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "collectionSize", {
        get: function () {
            return this._collectionSize;
        },
        set: function (value) {
            this._collectionSize = value;
        },
        enumerable: true,
        configurable: true
    });
    OptimizedEntityCollection.prototype.collection = function () {
        return this.entityCollection;
    };
    OptimizedEntityCollection.prototype.isFree = function () {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    };
    OptimizedEntityCollection.prototype.add = function (entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    };
    OptimizedEntityCollection.prototype.remove = function (entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    };
    OptimizedEntityCollection.prototype.removeNoSuspend = function (entity) {
        this.entityCollection.remove(entity);
    };
    OptimizedEntityCollection.prototype.removeAll = function () {
        this.suspend();
        this.entityCollection.removeAll();
    };
    OptimizedEntityCollection.prototype.onEventSuspension = function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventSuspensionCallback = { callback: callback, once: once };
        return function () {
            _this._onEventSuspensionCallback = undefined;
        };
    };
    OptimizedEntityCollection.prototype.onEventResume = function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventResumeCallback = { callback: callback, once: once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return function () {
            _this._onEventResumeCallback = undefined;
        };
    };
    OptimizedEntityCollection.prototype.triggerEventSuspension = function () {
        if (this._onEventSuspensionCallback !== undefined) {
            var callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    };
    OptimizedEntityCollection.prototype.triggerEventResume = function () {
        if (this._onEventResumeCallback !== undefined) {
            var callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    };
    OptimizedEntityCollection.prototype.suspend = function () {
        var _this = this;
        if (this._updateRate < 0) {
            return;
        }
        if (this._isHardSuspend) {
            return;
        }
        if (!this._isSuspended) {
            this._isSuspended = true;
            this.entityCollection.suspendEvents();
            this.triggerEventSuspension();
            this._suspensionTimeout = setTimeout(function () {
                _this.entityCollection.resumeEvents();
                _this.triggerEventResume();
                _this._isSuspended = false;
                _this._suspensionTimeout = undefined;
            }, this._updateRate);
        }
    };
    OptimizedEntityCollection.prototype.hardSuspend = function () {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    };
    OptimizedEntityCollection.prototype.hardResume = function () {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    };
    return OptimizedEntityCollection;
}());
export { OptimizedEntityCollection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbnRpdGllcy1kcmF3ZXIvb3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBU0UsbUNBQW9CLGdCQUFxQixFQUFFLGNBQW1CLEVBQUUsVUFBZTtRQUFwQywrQkFBQSxFQUFBLGtCQUFrQixDQUFDO1FBQUUsMkJBQUEsRUFBQSxjQUFjLENBQUM7UUFBM0QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBTmpDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBTTdCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBRXhDLENBQUM7SUFFRCwyQ0FBTyxHQUFQLFVBQVEsSUFBYTtRQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQsc0JBQUksa0RBQVc7YUFBZjtZQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLGlEQUFVO2FBQWQ7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDMUIsQ0FBQzthQUVELFVBQWUsS0FBYTtZQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHFEQUFjO2FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzlCLENBQUM7YUFFRCxVQUFtQixLQUFhO1lBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7OztPQUpBO0lB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QztZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztnQkFDbkMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNyQyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7WUFDdEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFTSwrQ0FBVyxHQUFsQjtRQUNFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRU0sOENBQVUsR0FBakI7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVILGdDQUFDO0FBQUQsQ0FBQyxBQXJJRCxJQXFJQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBPcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uIHtcbiAgcHJpdmF0ZSBfdXBkYXRlUmF0ZTogbnVtYmVyO1xuICBwcml2YXRlIF9jb2xsZWN0aW9uU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIF9pc1N1c3BlbmRlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9pc0hhcmRTdXNwZW5kID0gZmFsc2U7XG4gIHByaXZhdGUgX3N1c3BlbnNpb25UaW1lb3V0OiBhbnk7XG4gIHByaXZhdGUgX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2s6IHsgb25jZTogYm9vbGVhbiwgY2FsbGJhY2s6IEZ1bmN0aW9uIH07XG4gIHByaXZhdGUgX29uRXZlbnRSZXN1bWVDYWxsYmFjazogeyBvbmNlOiBib29sZWFuLCBjYWxsYmFjazogRnVuY3Rpb24gfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVudGl0eUNvbGxlY3Rpb246IGFueSwgY29sbGVjdGlvblNpemUgPSAtMSwgdXBkYXRlUmF0ZSA9IC0xKSB7XG4gICAgdGhpcy5fdXBkYXRlUmF0ZSA9IHVwZGF0ZVJhdGU7XG4gICAgdGhpcy5fY29sbGVjdGlvblNpemUgPSBjb2xsZWN0aW9uU2l6ZTtcblxuICB9XG5cbiAgc2V0U2hvdyhzaG93OiBib29sZWFuKSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnNob3cgPSBzaG93O1xuICB9XG5cbiAgZ2V0IGlzU3VzcGVuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc1N1c3BlbmRlZDtcbiAgfVxuXG4gIGdldCB1cGRhdGVSYXRlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZVJhdGU7XG4gIH1cblxuICBzZXQgdXBkYXRlUmF0ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fdXBkYXRlUmF0ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb25TaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb25TaXplO1xuICB9XG5cbiAgc2V0IGNvbGxlY3Rpb25TaXplKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb2xsZWN0aW9uU2l6ZSA9IHZhbHVlO1xuICB9XG5cbiAgY29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uO1xuICB9XG5cbiAgaXNGcmVlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uU2l6ZSA8IDEgfHwgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnZhbHVlcy5sZW5ndGggPCB0aGlzLl9jb2xsZWN0aW9uU2l6ZTtcbiAgfVxuXG4gIGFkZChlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuc3VzcGVuZCgpO1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb24uYWRkKGVudGl0eSk7XG4gIH1cblxuICByZW1vdmUoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLnN1c3BlbmQoKTtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlbW92ZShlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlTm9TdXNwZW5kKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlbW92ZShlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMuc3VzcGVuZCgpO1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIG9uRXZlbnRTdXNwZW5zaW9uKGNhbGxiYWNrOiBGdW5jdGlvbiwgb25jZSA9IGZhbHNlKTogRnVuY3Rpb24ge1xuICAgIHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgPSB7Y2FsbGJhY2ssIG9uY2V9O1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIH07XG4gIH1cblxuICBvbkV2ZW50UmVzdW1lKGNhbGxiYWNrOiBGdW5jdGlvbiwgb25jZSA9IGZhbHNlKTogRnVuY3Rpb24ge1xuICAgIHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayA9IHtjYWxsYmFjaywgb25jZX07XG4gICAgaWYgKCF0aGlzLl9pc1N1c3BlbmRlZCkge1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnRSZXN1bWUoKTtcbiAgICB9XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICB9XG5cbiAgdHJpZ2dlckV2ZW50U3VzcGVuc2lvbigpIHtcbiAgICBpZiAodGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2suY2FsbGJhY2s7XG4gICAgICBpZiAodGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjay5vbmNlKSB7XG4gICAgICAgIHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIHRyaWdnZXJFdmVudFJlc3VtZSgpIHtcbiAgICBpZiAodGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrLmNhbGxiYWNrO1xuICAgICAgaWYgKHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjay5vbmNlKSB7XG4gICAgICAgIHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN1c3BlbmQoKSB7XG4gICAgaWYgKHRoaXMuX3VwZGF0ZVJhdGUgPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0hhcmRTdXNwZW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5faXNTdXNwZW5kZWQpIHtcbiAgICAgIHRoaXMuX2lzU3VzcGVuZGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zdXNwZW5kRXZlbnRzKCk7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudFN1c3BlbnNpb24oKTtcbiAgICAgIHRoaXMuX3N1c3BlbnNpb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZXN1bWVFdmVudHMoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyRXZlbnRSZXN1bWUoKTtcbiAgICAgICAgdGhpcy5faXNTdXNwZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3VzcGVuc2lvblRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgICB9LCB0aGlzLl91cGRhdGVSYXRlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFyZFN1c3BlbmQoKSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnN1c3BlbmRFdmVudHMoKTtcbiAgICB0aGlzLl9pc0hhcmRTdXNwZW5kID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBoYXJkUmVzdW1lKCkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZXN1bWVFdmVudHMoKTtcbiAgICB0aGlzLl9pc0hhcmRTdXNwZW5kID0gZmFsc2U7XG4gIH1cblxufVxuIl19