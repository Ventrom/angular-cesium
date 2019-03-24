/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class HtmlPrimitive {
    /**
     * @param {?} options
     * @param {?=} collection
     */
    constructor(options, collection = null) {
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
    /**
     * @param {?} scene
     * @return {?}
     */
    set scene(scene) {
        this._scene = scene;
    }
    /**
     * @param {?} show
     * @return {?}
     */
    set show(show) {
        this._show = show;
        if (Cesium.defined(this.element)) {
            if (show) {
                this._element.style.display = 'block';
            }
            else {
                this._element.style.display = 'none';
            }
        }
    }
    /**
     * @return {?}
     */
    get show() {
        return this._show;
    }
    /**
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        this._position = position;
    }
    /**
     * @return {?}
     */
    get position() {
        return this._position;
    }
    /**
     * @param {?} pixelOffset
     * @return {?}
     */
    set pixelOffset(pixelOffset) {
        this._pixelOffset = pixelOffset;
    }
    /**
     * @return {?}
     */
    get pixelOffset() {
        return this._pixelOffset;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    set element(element) {
        this._element = element;
        if (Cesium.defined(element)) {
            this._mapContainer.appendChild(element);
            this._element.style.position = 'absolute';
            this._element.style.zIndex = Number.MAX_VALUE.toString();
        }
    }
    /**
     * @return {?}
     */
    get element() {
        return this._element;
    }
    /**
     * @param {?} collection
     * @return {?}
     */
    set collection(collection) {
        this._collection = collection;
    }
    /**
     * @return {?}
     */
    get collection() {
        return this._collection;
    }
    /**
     * @return {?}
     */
    update() {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
        /** @type {?} */
        let screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._scene, this._position);
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
        this._element.style.top = `${screenPosition.y}px`;
        this._element.style.left = `${screenPosition.x}px`;
        this._lastPosition = screenPosition;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9wcmltaXRpdmVzL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE1BQU0sT0FBTyxhQUFhOzs7OztJQVd4QixZQUFZLE9BQVksRUFBRSxhQUE2QixJQUFJO1FBQ3pELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVELElBQUksS0FBSyxDQUFDLEtBQVU7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFRCxJQUFJLElBQUksQ0FBQyxJQUFhO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDaEMsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzthQUN2Qztp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QUFHLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7Ozs7OztJQXZHQywrQkFBb0I7Ozs7O0lBQ3BCLDhCQUF1Qjs7Ozs7SUFDdkIsa0NBQThCOzs7OztJQUM5QixzQ0FBa0M7Ozs7O0lBQ2xDLHFDQUFpQzs7Ozs7SUFDakMsaUNBQThCOzs7OztJQUM5QixvQ0FBb0M7Ozs7O0lBQ3BDLHNDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0bWxDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4yJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sUHJpbWl0aXZlIHtcblxuICBwcml2YXRlIF9zY2VuZTogYW55O1xuICBwcml2YXRlIF9zaG93OiBib29sZWFuO1xuICBwcml2YXRlIF9wb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfbGFzdFBvc2l0aW9uOiBDYXJ0ZXNpYW4yO1xuICBwcml2YXRlIF9waXhlbE9mZnNldDogQ2FydGVzaWFuMjtcbiAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX2NvbGxlY3Rpb246IEh0bWxDb2xsZWN0aW9uO1xuICBwcml2YXRlIF9tYXBDb250YWluZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogYW55LCBjb2xsZWN0aW9uOiBIdG1sQ29sbGVjdGlvbiA9IG51bGwpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0h0bWxQcmltaXRpdmUgRVJST1I6IGludmFsaWQgaHRtbCBvcHRpb25zIScpO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUgPSBvcHRpb25zLnNjZW5lO1xuICAgIHRoaXMuX21hcENvbnRhaW5lciA9IG9wdGlvbnMubWFwQ29udGFpbmVyO1xuICAgIHRoaXMuc2hvdyA9IG9wdGlvbnMuc2hvdyB8fCB0cnVlO1xuICAgIHRoaXMucG9zaXRpb24gPSBvcHRpb25zLnBvc2l0aW9uO1xuICAgIHRoaXMucGl4ZWxPZmZzZXQgPSBvcHRpb25zLnBpeGVsT2Zmc2V0O1xuICAgIHRoaXMuZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudDtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICB9XG5cbiAgc2V0IHNjZW5lKHNjZW5lOiBhbnkpIHtcbiAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICB9XG5cbiAgc2V0IHNob3coc2hvdzogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3cgPSBzaG93O1xuXG4gICAgaWYgKENlc2l1bS5kZWZpbmVkKHRoaXMuZWxlbWVudCkpIHtcbiAgICAgIGlmIChzaG93KSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNob3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3c7XG4gIH1cblxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBwaXhlbE9mZnNldChwaXhlbE9mZnNldDogQ2FydGVzaWFuMikge1xuICAgIHRoaXMuX3BpeGVsT2Zmc2V0ID0gcGl4ZWxPZmZzZXQ7XG4gIH1cblxuICBnZXQgcGl4ZWxPZmZzZXQoKTogQ2FydGVzaWFuMiB7XG4gICAgcmV0dXJuIHRoaXMuX3BpeGVsT2Zmc2V0O1xuICB9XG5cbiAgc2V0IGVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIGlmIChDZXNpdW0uZGVmaW5lZChlbGVtZW50KSkge1xuICAgICAgdGhpcy5fbWFwQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnpJbmRleCA9IE51bWJlci5NQVhfVkFMVUUudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBzZXQgY29sbGVjdGlvbihjb2xsZWN0aW9uOiBIdG1sQ29sbGVjdGlvbikge1xuICAgIHRoaXMuX2NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb247XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKCFDZXNpdW0uZGVmaW5lZCh0aGlzLl9zaG93KSB8fCAhQ2VzaXVtLmRlZmluZWQodGhpcy5fZWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2NyZWVuUG9zaXRpb24gPSBDZXNpdW0uU2NlbmVUcmFuc2Zvcm1zLndnczg0VG9XaW5kb3dDb29yZGluYXRlcyh0aGlzLl9zY2VuZSwgdGhpcy5fcG9zaXRpb24pO1xuXG4gICAgaWYgKCFDZXNpdW0uZGVmaW5lZChzY3JlZW5Qb3NpdGlvbikpIHtcbiAgICAgIHNjcmVlblBvc2l0aW9uID0gbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKCgtMTAwMCksICgtMTAwMCkpO1xuICAgIH0gZWxzZSBpZiAoQ2VzaXVtLmRlZmluZWQodGhpcy5fcGl4ZWxPZmZzZXQpICYmIENlc2l1bS5kZWZpbmVkKHRoaXMuX3BpeGVsT2Zmc2V0LngpICYmIENlc2l1bS5kZWZpbmVkKHRoaXMuX3BpeGVsT2Zmc2V0LnkpKSB7XG4gICAgICBzY3JlZW5Qb3NpdGlvbi55ICs9IHRoaXMuX3BpeGVsT2Zmc2V0Lnk7XG4gICAgICBzY3JlZW5Qb3NpdGlvbi54ICs9IHRoaXMuX3BpeGVsT2Zmc2V0Lng7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xhc3RQb3NpdGlvbiAmJiB0aGlzLl9sYXN0UG9zaXRpb24uZXF1YWxzKHNjcmVlblBvc2l0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudG9wID0gYCR7c2NyZWVuUG9zaXRpb24ueX1weGA7XG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7c2NyZWVuUG9zaXRpb24ueH1weGA7XG4gICAgdGhpcy5fbGFzdFBvc2l0aW9uID0gc2NyZWVuUG9zaXRpb247XG4gIH1cbn1cbiJdfQ==