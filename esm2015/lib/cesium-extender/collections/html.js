/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { HtmlPrimitive } from '../primitives';
export class HtmlCollection {
    constructor() {
        this._collection = [];
    }
    /**
     * @return {?}
     */
    get length() {
        return this._collection.length;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    get(index) {
        return this._collection[index];
    }
    /**
     * @param {?} options
     * @return {?}
     */
    add(options) {
        /** @type {?} */
        const html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    }
    /**
     * @param {?} html
     * @return {?}
     */
    remove(html) {
        /** @type {?} */
        const index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection.splice(index, 1);
        return true;
    }
    /**
     * @return {?}
     */
    update() {
        for (let i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    }
    /**
     * @return {?}
     */
    removeAll() {
        while (this._collection.length > 0) {
            this._collection.pop();
        }
    }
    /**
     * @param {?} html
     * @return {?}
     */
    contains(html) {
        return Cesium.defined(html) && html.collection === this;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    HtmlCollection.prototype._collection;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2Nlc2l1bS1leHRlbmRlci9jb2xsZWN0aW9ucy9odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlDLE1BQU0sT0FBTyxjQUFjO0lBQTNCO1FBQ1UsZ0JBQVcsR0FBb0IsRUFBRSxDQUFDO0lBMkM1QyxDQUFDOzs7O0lBekNDLElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakMsQ0FBQzs7Ozs7SUFFRCxHQUFHLENBQUMsS0FBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7OztJQUVELEdBQUcsQ0FBQyxPQUFZOztjQUNSLElBQUksR0FBRyxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO1FBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsSUFBbUI7O2NBQ2xCLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFFNUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzs7O0lBRUQsTUFBTTtRQUNKLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDOzs7O0lBRUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7OztJQUVELFFBQVEsQ0FBQyxJQUFtQjtRQUMxQixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUM7SUFDMUQsQ0FBQztDQUNGOzs7Ozs7SUEzQ0MscUNBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHRtbFByaW1pdGl2ZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMnO1xuXG5leHBvcnQgY2xhc3MgSHRtbENvbGxlY3Rpb24ge1xuICBwcml2YXRlIF9jb2xsZWN0aW9uOiBIdG1sUHJpbWl0aXZlW10gPSBbXTtcblxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2xsZWN0aW9uLmxlbmd0aDtcbiAgfVxuXG4gIGdldChpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxlY3Rpb25baW5kZXhdO1xuICB9XG5cbiAgYWRkKG9wdGlvbnM6IGFueSk6IEh0bWxQcmltaXRpdmUge1xuICAgIGNvbnN0IGh0bWwgPSBuZXcgSHRtbFByaW1pdGl2ZShvcHRpb25zLCB0aGlzKTtcbiAgICB0aGlzLl9jb2xsZWN0aW9uLnB1c2goaHRtbCk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIHJlbW92ZShodG1sOiBIdG1sUHJpbWl0aXZlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9jb2xsZWN0aW9uLmluZGV4T2YoaHRtbCk7XG5cbiAgICBpZiAoaW5kZXggPT09ICgtMSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9jb2xsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuX2NvbGxlY3Rpb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMuX2NvbGxlY3Rpb25baV0udXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHdoaWxlICh0aGlzLl9jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2NvbGxlY3Rpb24ucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgY29udGFpbnMoaHRtbDogSHRtbFByaW1pdGl2ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBDZXNpdW0uZGVmaW5lZChodG1sKSAmJiBodG1sLmNvbGxlY3Rpb24gPT09IHRoaXM7XG4gIH1cbn1cbiJdfQ==