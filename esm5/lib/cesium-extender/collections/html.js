import { HtmlPrimitive } from '../primitives';
var HtmlCollection = /** @class */ (function () {
    function HtmlCollection() {
        this._collection = [];
    }
    Object.defineProperty(HtmlCollection.prototype, "length", {
        get: function () {
            return this._collection.length;
        },
        enumerable: true,
        configurable: true
    });
    HtmlCollection.prototype.get = function (index) {
        return this._collection[index];
    };
    HtmlCollection.prototype.add = function (options) {
        var html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    };
    HtmlCollection.prototype.remove = function (html) {
        var index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection[index].remove();
        this._collection.splice(index, 1);
        return true;
    };
    HtmlCollection.prototype.update = function () {
        for (var i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    };
    HtmlCollection.prototype.removeAll = function () {
        while (this._collection.length > 0) {
            var html = this._collection.pop();
            html.remove();
        }
    };
    HtmlCollection.prototype.contains = function (html) {
        return Cesium.defined(html) && html.collection === this;
    };
    HtmlCollection.prototype.destroy = function () {
        this.removeAll();
    };
    return HtmlCollection;
}());
export { HtmlCollection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9jb2xsZWN0aW9ucy9odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFOUM7SUFBQTtRQUNVLGdCQUFXLEdBQW9CLEVBQUUsQ0FBQztJQWdENUMsQ0FBQztJQTlDQyxzQkFBSSxrQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxDQUFDOzs7T0FBQTtJQUVELDRCQUFHLEdBQUgsVUFBSSxLQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCw0QkFBRyxHQUFILFVBQUksT0FBWTtRQUNkLElBQU0sSUFBSSxHQUFHLElBQUksYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCwrQkFBTSxHQUFOLFVBQU8sSUFBbUI7UUFDeEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCwrQkFBTSxHQUFOO1FBQ0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxrQ0FBUyxHQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRCxpQ0FBUSxHQUFSLFVBQVMsSUFBbUI7UUFDMUIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDO0lBQzFELENBQUM7SUFFRCxnQ0FBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFqREQsSUFpREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdG1sUHJpbWl0aXZlIH0gZnJvbSAnLi4vcHJpbWl0aXZlcyc7XG5cbmV4cG9ydCBjbGFzcyBIdG1sQ29sbGVjdGlvbiB7XG4gIHByaXZhdGUgX2NvbGxlY3Rpb246IEh0bWxQcmltaXRpdmVbXSA9IFtdO1xuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb24ubGVuZ3RoO1xuICB9XG5cbiAgZ2V0KGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbltpbmRleF07XG4gIH1cblxuICBhZGQob3B0aW9uczogYW55KTogSHRtbFByaW1pdGl2ZSB7XG4gICAgY29uc3QgaHRtbCA9IG5ldyBIdG1sUHJpbWl0aXZlKG9wdGlvbnMsIHRoaXMpO1xuICAgIHRoaXMuX2NvbGxlY3Rpb24ucHVzaChodG1sKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgcmVtb3ZlKGh0bWw6IEh0bWxQcmltaXRpdmUpOiBib29sZWFuIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2NvbGxlY3Rpb24uaW5kZXhPZihodG1sKTtcbiAgICBpZiAoaW5kZXggPT09ICgtMSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb2xsZWN0aW9uW2luZGV4XS5yZW1vdmUoKTtcbiAgICB0aGlzLl9jb2xsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuX2NvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMuX2NvbGxlY3Rpb25baV0udXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHdoaWxlICh0aGlzLl9jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLl9jb2xsZWN0aW9uLnBvcCgpO1xuICAgICAgaHRtbC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBjb250YWlucyhodG1sOiBIdG1sUHJpbWl0aXZlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIENlc2l1bS5kZWZpbmVkKGh0bWwpICYmIGh0bWwuY29sbGVjdGlvbiA9PT0gdGhpcztcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcbiAgfVxufVxuIl19