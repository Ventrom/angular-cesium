/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class OptimizedEntityCollection {
    /**
     * @param {?} entityCollection
     * @param {?=} collectionSize
     * @param {?=} updateRate
     */
    constructor(entityCollection, collectionSize = -1, updateRate = -1) {
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
    setShow(show) {
        this.entityCollection.show = show;
    }
    /**
     * @return {?}
     */
    get isSuspended() {
        return this._isSuspended;
    }
    /**
     * @return {?}
     */
    get updateRate() {
        return this._updateRate;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set updateRate(value) {
        this._updateRate = value;
    }
    /**
     * @return {?}
     */
    get collectionSize() {
        return this._collectionSize;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set collectionSize(value) {
        this._collectionSize = value;
    }
    /**
     * @return {?}
     */
    collection() {
        return this.entityCollection;
    }
    /**
     * @return {?}
     */
    isFree() {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    add(entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    removeNoSuspend(entity) {
        this.entityCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.suspend();
        this.entityCollection.removeAll();
    }
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    onEventSuspension(callback, once = false) {
        this._onEventSuspensionCallback = { callback, once };
        return (/**
         * @return {?}
         */
        () => {
            this._onEventSuspensionCallback = undefined;
        });
    }
    /**
     * @param {?} callback
     * @param {?=} once
     * @return {?}
     */
    onEventResume(callback, once = false) {
        this._onEventResumeCallback = { callback, once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return (/**
         * @return {?}
         */
        () => {
            this._onEventResumeCallback = undefined;
        });
    }
    /**
     * @return {?}
     */
    triggerEventSuspension() {
        if (this._onEventSuspensionCallback !== undefined) {
            /** @type {?} */
            const callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    }
    /**
     * @return {?}
     */
    triggerEventResume() {
        if (this._onEventResumeCallback !== undefined) {
            /** @type {?} */
            const callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    }
    /**
     * @return {?}
     */
    suspend() {
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
            () => {
                this.entityCollection.resumeEvents();
                this.triggerEventResume();
                this._isSuspended = false;
                this._suspensionTimeout = undefined;
            }), this._updateRate);
        }
    }
    /**
     * @return {?}
     */
    hardSuspend() {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    }
    /**
     * @return {?}
     */
    hardResume() {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbnRpdGllcy1kcmF3ZXIvb3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNLE9BQU8seUJBQXlCOzs7Ozs7SUFTcEMsWUFBb0IsZ0JBQXFCLEVBQUUsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFBM0QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBTmpDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBTTdCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBRXhDLENBQUM7Ozs7O0lBRUQsT0FBTyxDQUFDLElBQWE7UUFDbkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDcEMsQ0FBQzs7OztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDOzs7O0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBYTtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDOzs7O0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDOzs7OztJQUVELElBQUksY0FBYyxDQUFDLEtBQWE7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQzs7OztJQUVELFVB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QUFVOzs7WUFBQyxHQUFHLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLENBQUMsR0FBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDOzs7O0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQzs7OztJQUVNLFVBQVU7UUFDZixJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztDQUVGOzs7Ozs7SUFwSUMsZ0RBQTRCOzs7OztJQUM1QixvREFBZ0M7Ozs7O0lBQ2hDLGlEQUE2Qjs7Ozs7SUFDN0IsbURBQStCOzs7OztJQUMvQix1REFBZ0M7Ozs7O0lBQ2hDLCtEQUEwRTs7Ozs7SUFDMUUsMkRBQXNFOzs7OztJQUUxRCxxREFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiB7XG4gIHByaXZhdGUgX3VwZGF0ZVJhdGU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfY29sbGVjdGlvblNpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfaXNTdXNwZW5kZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaXNIYXJkU3VzcGVuZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdXNwZW5zaW9uVGltZW91dDogYW55O1xuICBwcml2YXRlIF9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrOiB7IG9uY2U6IGJvb2xlYW4sIGNhbGxiYWNrOiBGdW5jdGlvbiB9O1xuICBwcml2YXRlIF9vbkV2ZW50UmVzdW1lQ2FsbGJhY2s6IHsgb25jZTogYm9vbGVhbiwgY2FsbGJhY2s6IEZ1bmN0aW9uIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9uOiBhbnksIGNvbGxlY3Rpb25TaXplID0gLTEsIHVwZGF0ZVJhdGUgPSAtMSkge1xuICAgIHRoaXMuX3VwZGF0ZVJhdGUgPSB1cGRhdGVSYXRlO1xuICAgIHRoaXMuX2NvbGxlY3Rpb25TaXplID0gY29sbGVjdGlvblNpemU7XG5cbiAgfVxuXG4gIHNldFNob3coc2hvdzogYm9vbGVhbikge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zaG93ID0gc2hvdztcbiAgfVxuXG4gIGdldCBpc1N1c3BlbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNTdXNwZW5kZWQ7XG4gIH1cblxuICBnZXQgdXBkYXRlUmF0ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl91cGRhdGVSYXRlO1xuICB9XG5cbiAgc2V0IHVwZGF0ZVJhdGUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3VwZGF0ZVJhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjb2xsZWN0aW9uU2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uU2l6ZTtcbiAgfVxuXG4gIHNldCBjb2xsZWN0aW9uU2l6ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvblNpemUgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbjtcbiAgfVxuXG4gIGlzRnJlZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvblNpemUgPCAxIHx8IHRoaXMuZW50aXR5Q29sbGVjdGlvbi52YWx1ZXMubGVuZ3RoIDwgdGhpcy5fY29sbGVjdGlvblNpemU7XG4gIH1cblxuICBhZGQoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLnN1c3BlbmQoKTtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlDb2xsZWN0aW9uLmFkZChlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5zdXNwZW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZU5vU3VzcGVuZChlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLnN1c3BlbmQoKTtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlQWxsKCk7XG4gIH1cblxuICBvbkV2ZW50U3VzcGVuc2lvbihjYWxsYmFjazogRnVuY3Rpb24sIG9uY2UgPSBmYWxzZSk6IEZ1bmN0aW9uIHtcbiAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0ge2NhbGxiYWNrLCBvbmNlfTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICB9XG5cbiAgb25FdmVudFJlc3VtZShjYWxsYmFjazogRnVuY3Rpb24sIG9uY2UgPSBmYWxzZSk6IEZ1bmN0aW9uIHtcbiAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB7Y2FsbGJhY2ssIG9uY2V9O1xuICAgIGlmICghdGhpcy5faXNTdXNwZW5kZWQpIHtcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50UmVzdW1lKCk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgfVxuXG4gIHRyaWdnZXJFdmVudFN1c3BlbnNpb24oKSB7XG4gICAgaWYgKHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrLmNhbGxiYWNrO1xuICAgICAgaWYgKHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sub25jZSkge1xuICAgICAgICB0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyRXZlbnRSZXN1bWUoKSB7XG4gICAgaWYgKHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuX29uRXZlbnRSZXN1bWVDYWxsYmFjay5jYWxsYmFjaztcbiAgICAgIGlmICh0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sub25jZSkge1xuICAgICAgICB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdXNwZW5kKCkge1xuICAgIGlmICh0aGlzLl91cGRhdGVSYXRlIDwgMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5faXNIYXJkU3VzcGVuZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2lzU3VzcGVuZGVkKSB7XG4gICAgICB0aGlzLl9pc1N1c3BlbmRlZCA9IHRydWU7XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24uc3VzcGVuZEV2ZW50cygpO1xuICAgICAgdGhpcy50cmlnZ2VyRXZlbnRTdXNwZW5zaW9uKCk7XG4gICAgICB0aGlzLl9zdXNwZW5zaW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVzdW1lRXZlbnRzKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlckV2ZW50UmVzdW1lKCk7XG4gICAgICAgIHRoaXMuX2lzU3VzcGVuZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1c3BlbnNpb25UaW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgfSwgdGhpcy5fdXBkYXRlUmF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhhcmRTdXNwZW5kKCkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5zdXNwZW5kRXZlbnRzKCk7XG4gICAgdGhpcy5faXNIYXJkU3VzcGVuZCA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaGFyZFJlc3VtZSgpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVzdW1lRXZlbnRzKCk7XG4gICAgdGhpcy5faXNIYXJkU3VzcGVuZCA9IGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==