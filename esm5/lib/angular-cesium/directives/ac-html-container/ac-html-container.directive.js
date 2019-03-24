/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
var AcHtmlContainerDirective = /** @class */ (function () {
    function AcHtmlContainerDirective(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    Object.defineProperty(AcHtmlContainerDirective.prototype, "acHtmlContainer", {
        set: /**
         * @param {?} id
         * @return {?}
         */
        function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AcHtmlContainerDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this._id === undefined) {
            throw new Error("AcHtml container ERROR: entity id not defined");
        }
        /** @type {?} */
        var entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    };
    AcHtmlContainerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[acHtmlContainer]'
                },] }
    ];
    /** @nocollapse */
    AcHtmlContainerDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: AcHtmlManager }
    ]; };
    AcHtmlContainerDirective.propDecorators = {
        acHtmlContainer: [{ type: Input }]
    };
    return AcHtmlContainerDirective;
}());
export { AcHtmlContainerDirective };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AcHtmlContainerDirective.prototype._id;
    /**
     * @type {?}
     * @private
     */
    AcHtmlContainerDirective.prototype._element;
    /**
     * @type {?}
     * @private
     */
    AcHtmlContainerDirective.prototype._acHtmlManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vZGlyZWN0aXZlcy9hYy1odG1sLWNvbnRhaW5lci9hYy1odG1sLWNvbnRhaW5lci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkY7SUFPRSxrQ0FDVSxRQUFvQixFQUNwQixjQUE2QjtRQUQ3QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRXZDLENBQUM7SUFFRCxzQkFDSSxxREFBZTs7Ozs7UUFEbkIsVUFDb0IsRUFBVTtZQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDOzs7T0FBQTs7OztJQUVELDJDQUFROzs7SUFBUjtRQUNFLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ2xFOztZQUVLLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0lBQ3pELENBQUM7O2dCQXpCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7Ozs7Z0JBTG1CLFVBQVU7Z0JBQ3JCLGFBQWE7OztrQ0FlbkIsS0FBSzs7SUFhUiwrQkFBQztDQUFBLEFBMUJELElBMEJDO1NBdkJZLHdCQUF3Qjs7Ozs7O0lBRW5DLHVDQUFpQjs7Ozs7SUFHZiw0Q0FBNEI7Ozs7O0lBQzVCLGtEQUFxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY0h0bWxDb250YWluZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250YWluZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByaXZhdGUgX2lkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGFjSHRtbENvbnRhaW5lcihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBjb250YWluZXIgRVJST1I6IGVudGl0eSBpZCBub3QgZGVmaW5lZGApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuX2FjSHRtbE1hbmFnZXIuZ2V0KHRoaXMuX2lkKTtcbiAgICBlbnRpdHkucHJpbWl0aXZlLmVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiJdfQ==