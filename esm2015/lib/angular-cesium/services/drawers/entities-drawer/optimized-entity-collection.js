export class OptimizedEntityCollection {
    constructor(entityCollection, collectionSize = -1, updateRate = -1) {
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    setShow(show) {
        this.entityCollection.show = show;
    }
    get isSuspended() {
        return this._isSuspended;
    }
    get updateRate() {
        return this._updateRate;
    }
    set updateRate(value) {
        this._updateRate = value;
    }
    get collectionSize() {
        return this._collectionSize;
    }
    set collectionSize(value) {
        this._collectionSize = value;
    }
    collection() {
        return this.entityCollection;
    }
    isFree() {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    }
    add(entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    }
    remove(entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    }
    removeNoSuspend(entity) {
        this.entityCollection.remove(entity);
    }
    removeAll() {
        this.suspend();
        this.entityCollection.removeAll();
    }
    onEventSuspension(callback, once = false) {
        this._onEventSuspensionCallback = { callback, once };
        return () => {
            this._onEventSuspensionCallback = undefined;
        };
    }
    onEventResume(callback, once = false) {
        this._onEventResumeCallback = { callback, once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return () => {
            this._onEventResumeCallback = undefined;
        };
    }
    triggerEventSuspension() {
        if (this._onEventSuspensionCallback !== undefined) {
            const callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    }
    triggerEventResume() {
        if (this._onEventResumeCallback !== undefined) {
            const callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    }
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
            this._suspensionTimeout = setTimeout(() => {
                this.entityCollection.resumeEvents();
                this.triggerEventResume();
                this._isSuspended = false;
                this._suspensionTimeout = undefined;
            }, this._updateRate);
        }
    }
    hardSuspend() {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    }
    hardResume() {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbnRpdGllcy1kcmF3ZXIvb3B0aW1pemVkLWVudGl0eS1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyx5QkFBeUI7SUFTcEMsWUFBb0IsZ0JBQXFCLEVBQUUsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFBM0QscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBTmpDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBTTdCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBRXhDLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBYTtRQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEtBQWE7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksY0FBYyxDQUFDLEtBQWE7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FB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Q0FBQztnQkFDckMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVNLFVBQVU7UUFDZixJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24ge1xuICBwcml2YXRlIF91cGRhdGVSYXRlOiBudW1iZXI7XG4gIHByaXZhdGUgX2NvbGxlY3Rpb25TaXplOiBudW1iZXI7XG4gIHByaXZhdGUgX2lzU3VzcGVuZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2lzSGFyZFN1c3BlbmQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc3VzcGVuc2lvblRpbWVvdXQ6IGFueTtcbiAgcHJpdmF0ZSBfb25FdmVudFN1c3BlbnNpb25DYWxsYmFjazogeyBvbmNlOiBib29sZWFuLCBjYWxsYmFjazogRnVuY3Rpb24gfTtcbiAgcHJpdmF0ZSBfb25FdmVudFJlc3VtZUNhbGxiYWNrOiB7IG9uY2U6IGJvb2xlYW4sIGNhbGxiYWNrOiBGdW5jdGlvbiB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZW50aXR5Q29sbGVjdGlvbjogYW55LCBjb2xsZWN0aW9uU2l6ZSA9IC0xLCB1cGRhdGVSYXRlID0gLTEpIHtcbiAgICB0aGlzLl91cGRhdGVSYXRlID0gdXBkYXRlUmF0ZTtcbiAgICB0aGlzLl9jb2xsZWN0aW9uU2l6ZSA9IGNvbGxlY3Rpb25TaXplO1xuXG4gIH1cblxuICBzZXRTaG93KHNob3c6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24uc2hvdyA9IHNob3c7XG4gIH1cblxuICBnZXQgaXNTdXNwZW5kZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzU3VzcGVuZGVkO1xuICB9XG5cbiAgZ2V0IHVwZGF0ZVJhdGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlUmF0ZTtcbiAgfVxuXG4gIHNldCB1cGRhdGVSYXRlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl91cGRhdGVSYXRlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY29sbGVjdGlvblNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvblNpemU7XG4gIH1cblxuICBzZXQgY29sbGVjdGlvblNpemUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2NvbGxlY3Rpb25TaXplID0gdmFsdWU7XG4gIH1cblxuICBjb2xsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb247XG4gIH1cblxuICBpc0ZyZWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb25TaXplIDwgMSB8fCB0aGlzLmVudGl0eUNvbGxlY3Rpb24udmFsdWVzLmxlbmd0aCA8IHRoaXMuX2NvbGxlY3Rpb25TaXplO1xuICB9XG5cbiAgYWRkKGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5zdXNwZW5kKCk7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5Q29sbGVjdGlvbi5hZGQoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuc3VzcGVuZCgpO1xuICAgIHJldHVybiB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlKGVudGl0eSk7XG4gIH1cblxuICByZW1vdmVOb1N1c3BlbmQoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlKGVudGl0eSk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5zdXNwZW5kKCk7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlbW92ZUFsbCgpO1xuICB9XG5cbiAgb25FdmVudFN1c3BlbnNpb24oY2FsbGJhY2s6IEZ1bmN0aW9uLCBvbmNlID0gZmFsc2UpOiBGdW5jdGlvbiB7XG4gICAgdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayA9IHtjYWxsYmFjaywgb25jZX07XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHRoaXMuX29uRXZlbnRTdXNwZW5zaW9uQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgfVxuXG4gIG9uRXZlbnRSZXN1bWUoY2FsbGJhY2s6IEZ1bmN0aW9uLCBvbmNlID0gZmFsc2UpOiBGdW5jdGlvbiB7XG4gICAgdGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrID0ge2NhbGxiYWNrLCBvbmNlfTtcbiAgICBpZiAoIXRoaXMuX2lzU3VzcGVuZGVkKSB7XG4gICAgICB0aGlzLnRyaWdnZXJFdmVudFJlc3VtZSgpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIH07XG4gIH1cblxuICB0cmlnZ2VyRXZlbnRTdXNwZW5zaW9uKCkge1xuICAgIGlmICh0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjay5jYWxsYmFjaztcbiAgICAgIGlmICh0aGlzLl9vbkV2ZW50U3VzcGVuc2lvbkNhbGxiYWNrLm9uY2UpIHtcbiAgICAgICAgdGhpcy5fb25FdmVudFN1c3BlbnNpb25DYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlckV2ZW50UmVzdW1lKCkge1xuICAgIGlmICh0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9vbkV2ZW50UmVzdW1lQ2FsbGJhY2suY2FsbGJhY2s7XG4gICAgICBpZiAodGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrLm9uY2UpIHtcbiAgICAgICAgdGhpcy5fb25FdmVudFJlc3VtZUNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3VzcGVuZCgpIHtcbiAgICBpZiAodGhpcy5fdXBkYXRlUmF0ZSA8IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzSGFyZFN1c3BlbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9pc1N1c3BlbmRlZCkge1xuICAgICAgdGhpcy5faXNTdXNwZW5kZWQgPSB0cnVlO1xuICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnN1c3BlbmRFdmVudHMoKTtcbiAgICAgIHRoaXMudHJpZ2dlckV2ZW50U3VzcGVuc2lvbigpO1xuICAgICAgdGhpcy5fc3VzcGVuc2lvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlc3VtZUV2ZW50cygpO1xuICAgICAgICB0aGlzLnRyaWdnZXJFdmVudFJlc3VtZSgpO1xuICAgICAgICB0aGlzLl9pc1N1c3BlbmRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdXNwZW5zaW9uVGltZW91dCA9IHVuZGVmaW5lZDtcbiAgICAgIH0sIHRoaXMuX3VwZGF0ZVJhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYXJkU3VzcGVuZCgpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb24uc3VzcGVuZEV2ZW50cygpO1xuICAgIHRoaXMuX2lzSGFyZFN1c3BlbmQgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIGhhcmRSZXN1bWUoKSB7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9uLnJlc3VtZUV2ZW50cygpO1xuICAgIHRoaXMuX2lzSGFyZFN1c3BlbmQgPSBmYWxzZTtcbiAgfVxuXG59XG4iXX0=