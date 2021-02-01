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
        set: function (scene) {
            this._scene = scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "show", {
        get: function () {
            return this._show;
        },
        set: function (show) {
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
        get: function () {
            return this._position;
        },
        set: function (position) {
            this._position = position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "pixelOffset", {
        get: function () {
            return this._pixelOffset;
        },
        set: function (pixelOffset) {
            this._pixelOffset = pixelOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlPrimitive.prototype, "element", {
        get: function () {
            return this._element;
        },
        set: function (element) {
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
        get: function () {
            return this._collection;
        },
        set: function (collection) {
            this._collection = collection;
        },
        enumerable: true,
        configurable: true
    });
    HtmlPrimitive.prototype.update = function () {
        if (!Cesium.defined(this._show) || !Cesium.defined(this._element)) {
            return;
        }
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
    HtmlPrimitive.prototype.remove = function () {
        if (this._element) {
            this._element.remove();
        }
    };
    return HtmlPrimitive;
}());
export { HtmlPrimitive };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9wcmltaXRpdmVzL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7SUFXRSx1QkFBWSxPQUFZLEVBQUUsVUFBaUM7UUFBakMsMkJBQUEsRUFBQSxpQkFBaUM7UUFDekQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFRCxzQkFBSSxnQ0FBSzthQUFULFVBQVUsS0FBVTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLCtCQUFJO2FBWVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQWRELFVBQVMsSUFBYTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUVsQixJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLElBQUksRUFBRTtvQkFDUixJ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QUFNLGNBQWMsQ0FBQyxDQUFDLE9BQUksQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsOEJBQU0sR0FBTjtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQS9HRCxJQStHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0bWxDb2xsZWN0aW9uIH0gZnJvbSAnLi4vY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgQ2FydGVzaWFuMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL21vZGVscy9jYXJ0ZXNpYW4yJztcbmltcG9ydCB7IENhcnRlc2lhbjMgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9tb2RlbHMvY2FydGVzaWFuMyc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sUHJpbWl0aXZlIHtcblxuICBwcml2YXRlIF9zY2VuZTogYW55O1xuICBwcml2YXRlIF9zaG93OiBib29sZWFuO1xuICBwcml2YXRlIF9wb3NpdGlvbjogQ2FydGVzaWFuMztcbiAgcHJpdmF0ZSBfbGFzdFBvc2l0aW9uOiBDYXJ0ZXNpYW4yO1xuICBwcml2YXRlIF9waXhlbE9mZnNldDogQ2FydGVzaWFuMjtcbiAgcHJpdmF0ZSBfZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgX2NvbGxlY3Rpb246IEh0bWxDb2xsZWN0aW9uO1xuICBwcml2YXRlIF9tYXBDb250YWluZXI7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogYW55LCBjb2xsZWN0aW9uOiBIdG1sQ29sbGVjdGlvbiA9IG51bGwpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0h0bWxQcmltaXRpdmUgRVJST1I6IGludmFsaWQgaHRtbCBvcHRpb25zIScpO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUgPSBvcHRpb25zLnNjZW5lO1xuICAgIHRoaXMuX21hcENvbnRhaW5lciA9IG9wdGlvbnMubWFwQ29udGFpbmVyO1xuICAgIHRoaXMuc2hvdyA9IG9wdGlvbnMuc2hvdyB8fCB0cnVlO1xuICAgIHRoaXMucG9zaXRpb24gPSBvcHRpb25zLnBvc2l0aW9uO1xuICAgIHRoaXMucGl4ZWxPZmZzZXQgPSBvcHRpb25zLnBpeGVsT2Zmc2V0O1xuICAgIHRoaXMuZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudDtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICB9XG5cbiAgc2V0IHNjZW5lKHNjZW5lOiBhbnkpIHtcbiAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICB9XG5cbiAgc2V0IHNob3coc2hvdzogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3cgPSBzaG93O1xuXG4gICAgaWYgKENlc2l1bS5kZWZpbmVkKHRoaXMuZWxlbWVudCkpIHtcbiAgICAgIGlmIChzaG93KSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNob3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3c7XG4gIH1cblxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IENhcnRlc2lhbjMpIHtcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG5cbiAgZ2V0IHBvc2l0aW9uKCk6IENhcnRlc2lhbjMge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBwaXhlbE9mZnNldChwaXhlbE9mZnNldDogQ2FydGVzaWFuMikge1xuICAgIHRoaXMuX3BpeGVsT2Zmc2V0ID0gcGl4ZWxPZmZzZXQ7XG4gIH1cblxuICBnZXQgcGl4ZWxPZmZzZXQoKTogQ2FydGVzaWFuMiB7XG4gICAgcmV0dXJuIHRoaXMuX3BpeGVsT2Zmc2V0O1xuICB9XG5cbiAgc2V0IGVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIGlmIChDZXNpdW0uZGVmaW5lZChlbGVtZW50KSkge1xuICAgICAgdGhpcy5fbWFwQ29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlLnpJbmRleCA9IE51bWJlci5NQVhfVkFMVUUudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBzZXQgY29sbGVjdGlvbihjb2xsZWN0aW9uOiBIdG1sQ29sbGVjdGlvbikge1xuICAgIHRoaXMuX2NvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb247XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKCFDZXNpdW0uZGVmaW5lZCh0aGlzLl9zaG93KSB8fCAhQ2VzaXVtLmRlZmluZWQodGhpcy5fZWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2NyZWVuUG9zaXRpb24gPSBDZXNpdW0uU2NlbmVUcmFuc2Zvcm1zLndnczg0VG9XaW5kb3dDb29yZGluYXRlcyh0aGlzLl9zY2VuZSwgdGhpcy5fcG9zaXRpb24pO1xuXG4gICAgaWYgKCFDZXNpdW0uZGVmaW5lZChzY3JlZW5Qb3NpdGlvbikpIHtcbiAgICAgIHNjcmVlblBvc2l0aW9uID0gbmV3IENlc2l1bS5DYXJ0ZXNpYW4yKCgtMTAwMCksICgtMTAwMCkpO1xuICAgIH0gZWxzZSBpZiAoQ2VzaXVtLmRlZmluZWQodGhpcy5fcGl4ZWxPZmZzZXQpICYmIENlc2l1bS5kZWZpbmVkKHRoaXMuX3BpeGVsT2Zmc2V0LngpICYmIENlc2l1bS5kZWZpbmVkKHRoaXMuX3BpeGVsT2Zmc2V0LnkpKSB7XG4gICAgICBzY3JlZW5Qb3NpdGlvbi55ICs9IHRoaXMuX3BpeGVsT2Zmc2V0Lnk7XG4gICAgICBzY3JlZW5Qb3NpdGlvbi54ICs9IHRoaXMuX3BpeGVsT2Zmc2V0Lng7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xhc3RQb3NpdGlvbiAmJiB0aGlzLl9sYXN0UG9zaXRpb24uZXF1YWxzKHNjcmVlblBvc2l0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnQuc3R5bGUudG9wID0gYCR7c2NyZWVuUG9zaXRpb24ueX1weGA7XG4gICAgdGhpcy5fZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7c2NyZWVuUG9zaXRpb24ueH1weGA7XG4gICAgdGhpcy5fbGFzdFBvc2l0aW9uID0gc2NyZWVuUG9zaXRpb247XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=