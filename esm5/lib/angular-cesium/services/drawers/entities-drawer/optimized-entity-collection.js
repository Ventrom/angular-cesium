/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
    /**
     * @param {?} show
     * @return {?}
     */
    OptimizedEntityCollection.prototype.setShow = /**
     * @param {?} show
     * @return {?}
     */
    function (show) {
        this.entityCollection.show = show;
    };
    Object.defineProperty(OptimizedEntityCollection.prototype, "isSuspended", {
        get: /**
         * @return {?}
         */
        function () {
            return this._isSuspended;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "updateRate", {
        get: /**
         * @return {?}
         */
        function () {
            return this._updateRate;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._updateRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OptimizedEntityCollection.prototype, "collectionSize", {
        get: /**
         * @return {?}
         */
        function () {
            return this._collectionSize;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._collectionSize = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.collection = /**
     * @return {?}
     */
    function () {
        return this.entityCollection;
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.isFree = /**
     * @return {?}
     */
    function () {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.add = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    OptimizedEntityCollection.prototype.removeNoSuspend = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.entityCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.suspend();
        this.entityCollection.removeAll();
    };
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    OptimizedEntityCollection.prototype.onEventSuspension = /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventSuspensionCallback = { callback: callback, once: once };
        return (/**
         * @return {?}
         */
        function () {
            _this._onEventSuspensionCallback = undefined;
        });
    };
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    OptimizedEntityCollection.prototype.onEventResume = /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    function (callback, once) {
        var _this = this;
        if (once === void 0) { once = false; }
        this._onEventResumeCallback = { callback: callback, once: once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return (/**
         * @return {?}
         */
        function () {
            _this._onEventResumeCallback = undefined;
        });
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.triggerEventSuspension = /**
     * @return {?}
     */
    function () {
        if (this._onEventSuspensionCallback !== undefined) {
            /** @type {?} */
            var callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.triggerEventResume = /**
     * @return {?}
     */
    function () {
        if (this._onEventResumeCallback !== undefined) {
            /** @type {?} */
            var callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.suspend = /**
     * @return {?}
     */
    function () {
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
            this._suspensionTimeout = setTimeout((/**
             * @return {?}
             */
            function () {
                _this.entityCollection.resumeEvents();
                _this.triggerEventResume();
                _this._isSuspended = false;
                _this._suspensionTimeout = undefined;
            }), this._updateRate);
        }
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.hardSuspend = /**
     * @return {?}
     */
    function () {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    };
    /**
     * @return {?}
     */
    OptimizedEntityCollection.prototype.hardResume = /**
     * @return {?}
     */
    function () {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    };
    return OptimizedEntityCollection;
}());
export { OptimizedEntityCollection };
if (false) {
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._updateRate;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._collectionSize;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._isSuspended;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._isHardSuspend;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._suspensionTimeout;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._onEventSuspensionCallback;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype._onEventResumeCallback;
    /**
     * @type {?}
     * @private
     */
    OptimizedEntityCollection.prototype.entityCollection;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbnRpdGllcy1kcmF3ZXIvb3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtJQVNFLG1DQUFvQixnQkFBcUIsRUFBRSxjQUFtQixFQUFFLFVBQWU7UUFBcEMsK0JBQUEsRUFBQSxrQkFBa0IsQ0FBQztRQUFFLDJCQUFBLEVBQUEsY0FBYyxDQUFDO1FBQTNELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBSztRQU5qQyxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQU03QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUV4QyxDQUFDOzs7OztJQUVELDJDQUFPOzs7O0lBQVAsVUFBUSxJQUFhO1FBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxzQkFBSSxrREFBVzs7OztRQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksaURBQVU7Ozs7UUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQixDQUFDOzs7OztRQUVELFVBQWUsS0FBYTtZQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHFEQUFjOzs7O1FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzlCLENBQUM7Ozs7O1FBRUQsVUFBbUIsS0FBYTtZQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLEtB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WUFDdkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVOzs7WUFBQztnQkFDbkMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNyQyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7WUFDdEMsQ0FBQyxHQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7Ozs7SUFFTSwrQ0FBVzs7O0lBQWxCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFTSw4Q0FBVTs7O0lBQWpCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFSCxnQ0FBQztBQUFELENBQUMsQUFySUQsSUFxSUM7Ozs7Ozs7SUFwSUMsZ0RBQTRCOzs7OztJQUM1QixvREFBZ0M7Ozs7O0lBQ2hDLGlEQUE2Qjs7Ozs7SUFDN0IsbURBQStCOzs7OztJQUMvQix1REFBZ0M7Ozs7O0lBQ2hDLCtEQUEwRTs7Ozs7SUFDMUUsMkRBQXNFOzs7OztJQUUxRCxxREFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiB7XG4gIHByaXZhdGUgX3VwZGF0ZVJhdGU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfY29sbGVjdGlvblNpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaXNTdXNwZW5kZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaXNIYXJkU3VzcGVuZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdXNwZW5zaW9uVGltZW91dDogYW55O1xuICBwcml2YXRlIF9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrOiB7IG9uY2U6IGJvb2xlYW4sIGNhbGxiYWNrOiBGdW5jdGlvbiB9O1xuICBwcml2YXRlIF9vbkV2ZW50UmVzdW1lQ2FsbGJhY2s6IHsgb25jZTogYm9vbGVhbiwgY2FsbGJhY2s6IEZ1bmN0aW9uIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uOiBhbnksIGNvbGxlY3Rpb25TaXplID0gLTEsIHVwZGF0ZVJhdGUgPSAtMSkge1xuICAgIHRoaXMuX3VwZGF0ZVJhdGUgPSB1cGRhdGVSYXRlO1xuICAgIHRoaXMuX2NvbGxlY3Rpb25TaXplID0gY29sbGVjdGlvblNpemU7XG5cbiAgfVxuXG4gIHNldFNob3coc2hvdzogYm9vbGVhbikge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zaG93ID0gc2hvdztcbiAgfVxuXG4gIGdldCBpc1N1c3BlbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNTdXNwZW5kZWQ7XG4gIH1cblxuICBnZXQgdXBkYXRlUmF0ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl91cGRhdGVSYXRlO1xuICB9XG5cbiAgc2V0IHVwZGF0ZVJhdGUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3VwZGF0ZVJhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjb2xsZWN0aW9uU2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uU2l6ZTtcbiAgfVxuXG4gIHNldCBjb2xsZWN0aW9uU2l6ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvblNpemUgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbjtcbiAgfVxuXG4gIGlzRnJlZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvblNpemUgPCAxIHx8IHRoaXMuZW50aXR5Q29sbGVjdGlvbi52YWx1ZXMubGVuZ3RoIDwgdGhpcy5fY29sbGVjdGlvblNpemU7XG4gIH1cblxuICBhZGQoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLnN1c3BlbmQoKTtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uLmFkZChlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5zdXNwZW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZU5vU3VzcGVuZChlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLnN1c3BlbmQoKTtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBvbkV2ZW50U3VzcGVuc2lvbihjYWxsYmFjazogRnVuY3Rpb24sIG9uY2UgPSBmYWxzZSk6IEZ1bmN0aW9uIHtcbiAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0ge2NhbGxiYWNrLCBvbmNlfTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICB9XG5cbiAgb25FdmVudFJlc3VtZShjYWxsYmFjazogRnVuY3Rpb24sIG9uY2UgPSBmYWxzZSk6IEZ1bmN0aW9uIHtcbiAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB7Y2FsbGJhY2ssIG9uY2V9O1xuICAgIGlmICghdGhpcy5faXNTdXNwZW5kZWQpIHtcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50UmVzdW1lKCk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgfVxuXG4gIHRyaWdnZXJFdmVudFN1c3BlbnNpb24oKSB7XG4gICAgaWYgKHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrLmNhbGxiYWNrO1xuICAgICAgaWYgKHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sub25jZSkge1xuICAgICAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyRXZlbnRSZXN1bWUoKSB7XG4gICAgaWYgKHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjay5jYWxsYmFjaztcbiAgICAgIGlmICh0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sub25jZSkge1xuICAgICAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdXNwZW5kKCkge1xuICAgIGlmICh0aGlzLl91cGRhdGVSYXRlIDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNIYXJkU3VzcGVuZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2lzU3VzcGVuZGVkKSB7XG4gICAgICB0aGlzLl9pc1N1c3BlbmRlZCA9IHRydWU7XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24uc3VzcGVuZEV2ZW50cygpO1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnRTdXNwZW5zaW9uKCk7XG4gICAgICB0aGlzLl9zdXNwZW5zaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVzdW1lRXZlbnRzKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50UmVzdW1lKCk7XG4gICAgICAgIHRoaXMuX2lzU3VzcGVuZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1c3BlbnNpb25UaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgfSwgdGhpcy5fdXBkYXRlUmF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhhcmRTdXNwZW5kKCkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zdXNwZW5kRXZlbnRzKCk7XG4gICAgdGhpcy5faXNIYXJkU3VzcGVuZCA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaGFyZFJlc3VtZSgpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVzdW1lRXZlbnRzKCk7XG4gICAgdGhpcy5faXNIYXJkU3VzcGVuZCA9IGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==