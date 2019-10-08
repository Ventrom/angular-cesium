/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { HtmlPrimitive } from '../primitives';
var HtmlCollection = /** @class */ (function () {
    function HtmlCollection() {
        this._collection = [];
    }
    Object.defineProperty(HtmlCollection.prototype, "length", {
        get: /**
         * @return {?}
         */
        function () {
            return this._collection.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} index
     * @return {?}
     */
    HtmlCollection.prototype.get = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this._collection[index];
    };
    /**
     * @param {?} options
     * @return {?}
     */
    HtmlCollection.prototype.add = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    };
    /**
     * @param {?} html
     * @return {?}
     */
    HtmlCollection.prototype.remove = /**
     * @param {?} html
     * @return {?}
     */
    function (html) {
        /** @type {?} */
        var index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection.splice(index, 1);
        return true;
    };
    /**
     * @return {?}
     */
    HtmlCollection.prototype.update = /**
     * @return {?}
     */
    function () {
        for (var i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    };
    /**
     * @return {?}
     */
    HtmlCollection.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        while (this._collection.length > 0) {
            this._collection.pop();
        }
    };
    /**
     * @param {?} html
     * @return {?}
     */
    HtmlCollection.prototype.contains = /**
     * @param {?} html
     * @return {?}
     */
    function (html) {
        return Cesium.defined(html) && html.collection === this;
    };
    return HtmlCollection;
}());
export { HtmlCollection };
if (false) {
    /**
     * @type {?}
     * @private
     */
    HtmlCollection.prototype._collection;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9jb2xsZWN0aW9ucy9odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlDO0lBQUE7UUFDVSxnQkFBVyxHQUFvQixFQUFFLENBQUM7SUEyQzVDLENBQUM7SUF6Q0Msc0JBQUksa0NBQU07Ozs7UUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7Ozs7O0lBRUQsNEJBQUc7Ozs7SUFBSCxVQUFJLEtBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Ozs7SUFFRCw0QkFBRzs7OztJQUFILFVBQUksT0FBWTs7WUFDUixJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztRQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Ozs7O0lBRUQsK0JBQU07Ozs7SUFBTixVQUFPLElBQW1COztZQUNsQixLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBRTVDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7OztJQUVELCtCQUFNOzs7SUFBTjtRQUNFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDOzs7O0lBRUQsa0NBQVM7OztJQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Ozs7O0lBRUQsaUNBQVE7Ozs7SUFBUixVQUFTLElBQW1CO1FBQzFCLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBNUNELElBNENDOzs7Ozs7O0lBM0NDLHFDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0bWxQcmltaXRpdmUgfSBmcm9tICcuLi9wcmltaXRpdmVzJztcblxuZXhwb3J0IGNsYXNzIEh0bWxDb2xsZWN0aW9uIHtcbiAgcHJpdmF0ZSBfY29sbGVjdGlvbjogSHRtbFByaW1pdGl2ZVtdID0gW107XG5cbiAgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbi5sZW5ndGg7XG4gIH1cblxuICBnZXQoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uW2luZGV4XTtcbiAgfVxuXG4gIGFkZChvcHRpb25zOiBhbnkpOiBIdG1sUHJpbWl0aXZlIHtcbiAgICBjb25zdCBodG1sID0gbmV3IEh0bWxQcmltaXRpdmUob3B0aW9ucywgdGhpcyk7XG4gICAgdGhpcy5fY29sbGVjdGlvbi5wdXNoKGh0bWwpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICByZW1vdmUoaHRtbDogSHRtbFByaW1pdGl2ZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY29sbGVjdGlvbi5pbmRleE9mKGh0bWwpO1xuXG4gICAgaWYgKGluZGV4ID09PSAoLTEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fY29sbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLl9jb2xsZWN0aW9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aGlzLl9jb2xsZWN0aW9uW2ldLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB3aGlsZSAodGhpcy5fY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9jb2xsZWN0aW9uLnBvcCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRhaW5zKGh0bWw6IEh0bWxQcmltaXRpdmUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQ2VzaXVtLmRlZmluZWQoaHRtbCkgJiYgaHRtbC5jb2xsZWN0aW9uID09PSB0aGlzO1xuICB9XG59XG4iXX0=