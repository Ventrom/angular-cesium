/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var HtmlPrimitive = /** @class */ (function () {
    function HtmlPrimitive(options, collection) {
        if (collection === void 0) { collection = null; }
        if (typeof options !== 'object') {
            throw new Error('HtmlPrimitive ERROR: invalid html options!');
        }
        this.scene = options.scene;
        this._mapContainer = options.mapContainer;
        this.show = options.show || true;
        this.position = options.position;
        this.pixelOffset = options.pixelOffset;
        this.element = options.element;
        this.collection = collection;
    }
    Object.defineProperty(HtmlPrimitive.prototype, "scene", {
        set: /**
         * @param {?} scene
         * @return {?}
         */
        function (scene) {
            this._scene = scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "show", {
        get: /**
         * @return {?}
         */
        function () {
            return this._show;
        },
        set: /**
         * @param {?} show
         * @return {?}
         */
        function (show) {
            this._show = show;
            if (Cesium.defined(this.element)) {
                if (show) {
                    this._element.style.display = 'block';
                }
                else {
                    this._element.style.display = 'none';
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "position", {
        get: /**
         * @return {?}
         */
        function () {
            return this._position;
        },
        set: /**
         * @param {?} position
         * @return {?}
         */
        function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "pixelOffset", {
        get: /**
         * @return {?}
         */
        function () {
            return this._pixelOffset;
        },
        set: /**
         * @param {?} pixelOffset
         * @return {?}
         */
        function (pixelOffset) {
            this._pixelOffset = pixelOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "element", {
        get: /**
         * @return {?}
         */
        function () {
            return this._element;
        },
        set: /**
         * @param {?} element
         * @return {?}
         */
        function (element) {
            this._element = element;
            if (Cesium.defined(element)) {
                this._mapContainer.appendChild(element);
                this._element.style.position = 'absolute';
                this._element.style.zIndex = Number.MAX_VALUE.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "collection", {
        get: /**
         * @return {?}
         */
        function () {
            return this._collection;
        },
        set: /**
         * @param {?} collection
         * @return {?}
         */
        function (collection) {
            this._collection = collection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    HtmlPrimitive.prototype.update = /**
     * @return {?}
     */
    function () {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
        /** @type {?} */
        var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._scene, this._position);
        if (!Cesium.defined(screenPosition)) {
            screenPosition = new Cesium.Cartesian2((-1000), (-1000));
        }
        else if (Cesium.defined(this._pixelOffset) && Cesium.defined(this._pixelOffset.x) && Cesium.defined(this._pixelOffset.y)) {
            screenPosition.y += this._pixelOffset.y;
            screenPosition.x += this._pixelOffset.x;
        }
        if (this._lastPosition && this._lastPosition.equals(screenPosition)) {
            return;
        }
        this._element.style.top = screenPosition.y + "px";
        this._element.style.left = screenPosition.x + "px";
        this._lastPosition = screenPosition;
    };
    return HtmlPrimitive;
}());
export { HtmlPrimitive };
if (false) {
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._scene;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._show;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._position;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._lastPosition;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._pixelOffset;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._element;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._collection;
    /**
     * @type {?}
     * @private
     */
    HtmlPrimitive.prototype._mapContainer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9wcmltaXRpdmVzL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBO0lBV0UsdUJBQVksT0FBWSxFQUFFLFVBQWlDO1FBQWpDLDJCQUFBLEVBQUEsaUJBQWlDO1FBQ3pELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQsc0JBQUksZ0NBQUs7Ozs7O1FBQVQsVUFBVSxLQUFVO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksK0JBQUk7Ozs7UUFZUjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7OztRQWRELFVBQVMsSUFBYTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUVsQixJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLElB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bEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFNLGNBQWMsQ0FBQyxDQUFDLE9BQUksQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBekdELElBeUdDOzs7Ozs7O0lBdkdDLCtCQUFvQjs7Ozs7SUFDcEIsOEJBQXVCOzs7OztJQUN2QixrQ0FBOEI7Ozs7O0lBQzlCLHNDQUFrQzs7Ozs7SUFDbEMscUNBQWlDOzs7OztJQUNqQyxpQ0FBOEI7Ozs7O0lBQzlCLG9DQUFvQzs7Ozs7SUFDcEMsc0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHRtbENvbGxlY3Rpb24gfSBmcm9tICcuLi9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBDYXJ0ZXNpYW4yIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2NhcnRlc2lhbjInO1xuaW1wb3J0IHsgQ2FydGVzaWFuMyB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4zJztcblxuZXhwb3J0IGNsYXNzIEh0bWxQcmltaXRpdmUge1xuXG4gIHByaXZhdGUgX3NjZW5lOiBhbnk7XG4gIHByaXZhdGUgX3Nob3c6IGJvb2xlYW47XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBDYXJ0ZXNpYW4zO1xuICBwcml2YXRlIF9sYXN0UG9zaXRpb246IENhcnRlc2lhbjI7XG4gIHByaXZhdGUgX3BpeGVsT2Zmc2V0OiBDYXJ0ZXNpYW4yO1xuICBwcml2YXRlIF9lbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBfY29sbGVjdGlvbjogSHRtbENvbGxlY3Rpb247XG4gIHByaXZhdGUgX21hcENvbnRhaW5lcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBhbnksIGNvbGxlY3Rpb246IEh0bWxDb2xsZWN0aW9uID0gbnVsbCkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSHRtbFByaW1pdGl2ZSBFUlJPUjogaW52YWxpZCBodG1sIG9wdGlvbnMhJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZSA9IG9wdGlvbnMuc2NlbmU7XG4gICAgdGhpcy5fbWFwQ29udGFpbmVyID0gb3B0aW9ucy5tYXBDb250YWluZXI7XG4gICAgdGhpcy5zaG93ID0gb3B0aW9ucy5zaG93IHx8IHRydWU7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG9wdGlvbnMucG9zaXRpb247XG4gICAgdGhpcy5waXhlbE9mZnNldCA9IG9wdGlvbnMucGl4ZWxPZmZzZXQ7XG4gICAgdGhpcy5lbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50O1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gIH1cblxuICBzZXQgc2NlbmUoc2NlbmU6IGFueSkge1xuICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XG4gIH1cblxuICBzZXQgc2hvdyhzaG93OiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvdyA9IHNob3c7XG5cbiAgICBpZiAoQ2VzaXVtLmRlZmluZWQodGhpcy5lbGVtZW50KSkge1xuICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgc2hvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxuXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogQ2FydGVzaWFuMykge1xuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gIH1cblxuICBnZXQgcG9zaXRpb24oKTogQ2FydGVzaWFuMyB7XG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xuICB9XG5cbiAgc2V0IHBpeGVsT2Zmc2V0KHBpeGVsT2Zmc2V0OiBDYXJ0ZXNpYW4yKSB7XG4gICAgdGhpcy5fcGl4ZWxPZmZzZXQgPSBwaXhlbE9mZnNldDtcbiAgfVxuXG4gIGdldCBwaXhlbE9mZnNldCgpOiBDYXJ0ZXNpYW4yIHtcbiAgICByZXR1cm4gdGhpcy5fcGl4ZWxPZmZzZXQ7XG4gIH1cblxuICBzZXQgZWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50O1xuXG4gICAgaWYgKENlc2l1bS5kZWZpbmVkKGVsZW1lbnQpKSB7XG4gICAgICB0aGlzLl9tYXBDb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuekluZGV4ID0gTnVtYmVyLk1BWF9WQUxVRS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBlbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIHNldCBjb2xsZWN0aW9uKGNvbGxlY3Rpb246IEh0bWxDb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gIH1cblxuICBnZXQgY29sbGVjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbjtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBpZiAoIUNlc2l1bS5kZWZpbmVkKHRoaXMuX3Nob3cpIHx8ICFDZXNpdW0uZGVmaW5lZCh0aGlzLl9lbGVtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzY3JlZW5Qb3NpdGlvbiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHRoaXMuX3NjZW5lLCB0aGlzLl9wb3NpdGlvbik7XG5cbiAgICBpZiAoIUNlc2l1bS5kZWZpbmVkKHNjcmVlblBvc2l0aW9uKSkge1xuICAgICAgc2NyZWVuUG9zaXRpb24gPSBuZXcgQ2VzaXVtLkNhcnRlc2lhbjIoKC0xMDAwKSwgKC0xMDAwKSk7XG4gICAgfSBlbHNlIGlmIChDZXNpdW0uZGVmaW5lZCh0aGlzLl9waXhlbE9mZnNldCkgJiYgQ2VzaXVtLmRlZmluZWQodGhpcy5fcGl4ZWxPZmZzZXQueCkgJiYgQ2VzaXVtLmRlZmluZWQodGhpcy5fcGl4ZWxPZmZzZXQueSkpIHtcbiAgICAgIHNjcmVlblBvc2l0aW9uLnkgKz0gdGhpcy5fcGl4ZWxPZmZzZXQueTtcbiAgICAgIHNjcmVlblBvc2l0aW9uLnggKz0gdGhpcy5fcGl4ZWxPZmZzZXQueDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbGFzdFBvc2l0aW9uICYmIHRoaXMuX2xhc3RQb3NpdGlvbi5lcXVhbHMoc2NyZWVuUG9zaXRpb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZS50b3AgPSBgJHtzY3JlZW5Qb3NpdGlvbi55fXB4YDtcbiAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtzY3JlZW5Qb3NpdGlvbi54fXB4YDtcbiAgICB0aGlzLl9sYXN0UG9zaXRpb24gPSBzY3JlZW5Qb3NpdGlvbjtcbiAgfVxufVxuIl19