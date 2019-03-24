/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
var LayerService = /** @class */ (function () {
    function LayerService() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    Object.defineProperty(LayerService.prototype, "cache", {
        get: /**
         * @return {?}
         */
        function () {
            return this._cache;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._cache = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "zIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return this._zIndex;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== this._zIndex) {
                this.layerUpdate.emit();
            }
            this._zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value !== this._show) {
                this.layerUpdate.emit();
            }
            this._show = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "options", {
        get: /**
         * @return {?}
         */
        function () {
            return this._options;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._options = value;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "context", {
        get: /**
         * @return {?}
         */
        function () {
            return this._context;
        },
        set: /**
         * @param {?} context
         * @return {?}
         */
        function (context) {
            this._context = context;
            this.layerUpdate.emit();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} name
     * @return {?}
     */
    LayerService.prototype.setEntityName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        this._entityName = name;
    };
    /**
     * @return {?}
     */
    LayerService.prototype.getEntityName = /**
     * @return {?}
     */
    function () {
        return this._entityName;
    };
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    LayerService.prototype.registerDescription = /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    function (descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    };
    /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    LayerService.prototype.unregisterDescription = /**
     * @param {?} descriptionComponent
     * @return {?}
     */
    function (descriptionComponent) {
        /** @type {?} */
        var index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    };
    /**
     * @return {?}
     */
    LayerService.prototype.getDescriptions = /**
     * @return {?}
     */
    function () {
        return this.descriptions;
    };
    /**
     * @return {?}
     */
    LayerService.prototype.layerUpdates = /**
     * @return {?}
     */
    function () {
        return this.layerUpdate;
    };
    LayerService.decorators = [
        { type: Injectable }
    ];
    return LayerService;
}());
export { LayerService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._context;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._options;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._show;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._zIndex;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._entityName;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype._cache;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype.descriptions;
    /**
     * @type {?}
     * @private
     */
    LayerService.prototype.layerUpdate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXpEO0lBQUE7UUFPVSxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQThFM0MsQ0FBQztJQTVFQyxzQkFBSSwrQkFBSzs7OztRQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7Ozs7O1FBRUQsVUFBVSxLQUFjO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksZ0NBQU07Ozs7UUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDOzs7OztRQUVELFVBQVcsS0FBYTtZQUN0QixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3pCO1lBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQzs7O09BUEE7SUFTRCxzQkFBSSw4QkFBSTs7OztRQUFSO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7Ozs7O1FBRUQsVUFBUyxLQUFjO1lBQ3JCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDekI7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQixDQUFDOzs7T0FQQTtJQVNELHNCQUFJLGlDQUFPOzs7O1FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7Ozs7UUFFRCxVQUFZLEtBQW1CO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsQ0FBQzs7O09BTEE7SUFPRCxzQkFBSSxpQ0FBTzs7OztRQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7Ozs7O1FBRUQsVUFBWSxPQUFPO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsQ0FBQzs7O09BTEE7Ozs7O0lBT0Qsb0NBQWE7Ozs7SUFBYixVQUFjLElBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs7OztJQUVELG9DQUFhOzs7SUFBYjtRQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDOzs7OztJQUVELDBDQUFtQjs7OztJQUFuQixVQUFvQixvQkFBa0M7UUFDcEQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQzs7Ozs7SUFFRCw0Q0FBcUI7Ozs7SUFBckIsVUFBc0Isb0JBQWtDOztZQUNoRCxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUM7UUFDN0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDOzs7O0lBRUQsc0NBQWU7OztJQUFmO1FBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxtQ0FBWTs7O0lBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQzs7Z0JBdEZGLFVBQVU7O0lBdUZYLG1CQUFDO0NBQUEsQUF2RkQsSUF1RkM7U0F0RlksWUFBWTs7Ozs7O0lBQ3ZCLGdDQUFzQjs7Ozs7SUFDdEIsZ0NBQStCOzs7OztJQUMvQiw2QkFBdUI7Ozs7O0lBQ3ZCLCtCQUF3Qjs7Ozs7SUFDeEIsbUNBQTRCOzs7OztJQUM1Qiw4QkFBc0I7Ozs7O0lBQ3RCLG9DQUEwQzs7Ozs7SUFDMUMsbUNBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xuaW1wb3J0IHsgTGF5ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheWVyLW9wdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGF5ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xuICBwcml2YXRlIF9vcHRpb25zOiBMYXllck9wdGlvbnM7XG4gIHByaXZhdGUgX3Nob3c6IGJvb2xlYW47XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuICBwcml2YXRlIF9lbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgX2NhY2hlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBkZXNjcmlwdGlvbnM6IElEZXNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgbGF5ZXJVcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ2V0IGNhY2hlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcbiAgfVxuXG4gIHNldCBjYWNoZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2NhY2hlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleDtcbiAgfVxuXG4gIHNldCB6SW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fekluZGV4KSB7XG4gICAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgICB9XG4gICAgdGhpcy5fekluZGV4ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2hvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxuXG4gIHNldCBzaG93KHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9zaG93KSB7XG4gICAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgICB9XG4gICAgdGhpcy5fc2hvdyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9wdGlvbnMoKTogTGF5ZXJPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuXG4gIHNldCBvcHRpb25zKHZhbHVlOiBMYXllck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdmFsdWU7XG4gICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gIH1cblxuICBnZXQgY29udGV4dCgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xuICB9XG5cbiAgc2V0IGNvbnRleHQoY29udGV4dCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICB9XG5cbiAgc2V0RW50aXR5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9lbnRpdHlOYW1lID0gbmFtZTtcbiAgfVxuXG4gIGdldEVudGl0eU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXR5TmFtZTtcbiAgfVxuXG4gIHJlZ2lzdGVyRGVzY3JpcHRpb24oZGVzY3JpcHRpb25Db21wb25lbnQ6IElEZXNjcmlwdGlvbikge1xuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9ucy5pbmRleE9mKGRlc2NyaXB0aW9uQ29tcG9uZW50KSA8IDApIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25zLnB1c2goZGVzY3JpcHRpb25Db21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJEZXNjcmlwdGlvbihkZXNjcmlwdGlvbkNvbXBvbmVudDogSURlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmRlc2NyaXB0aW9ucy5pbmRleE9mKGRlc2NyaXB0aW9uQ29tcG9uZW50KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBnZXREZXNjcmlwdGlvbnMoKTogSURlc2NyaXB0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9ucztcbiAgfVxuXG4gIGxheWVyVXBkYXRlcygpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJVcGRhdGU7XG4gIH1cbn1cbiJdfQ==