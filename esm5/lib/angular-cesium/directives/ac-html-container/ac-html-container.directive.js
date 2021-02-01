import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
var AcHtmlContainerDirective = /** @class */ (function () {
    function AcHtmlContainerDirective(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    Object.defineProperty(AcHtmlContainerDirective.prototype, "acHtmlContainer", {
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    AcHtmlContainerDirective.prototype.ngOnInit = function () {
        if (this._id === undefined) {
            throw new Error("AcHtml container ERROR: entity id not defined");
        }
        var entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    };
    AcHtmlContainerDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: AcHtmlManager }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], AcHtmlContainerDirective.prototype, "acHtmlContainer", null);
    AcHtmlContainerDirective = __decorate([
        Directive({
            selector: '[acHtmlContainer]'
        }),
        __metadata("design:paramtypes", [ElementRef,
            AcHtmlManager])
    ], AcHtmlContainerDirective);
    return AcHtmlContainerDirective;
}());
export { AcHtmlContainerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vZGlyZWN0aXZlcy9hYy1odG1sLWNvbnRhaW5lci9hYy1odG1sLWNvbnRhaW5lci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBS3ZGO0lBSUUsa0NBQ1UsUUFBb0IsRUFDcEIsY0FBNkI7UUFEN0IsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUNwQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtJQUV2QyxDQUFDO0lBR0Qsc0JBQUkscURBQWU7YUFBbkIsVUFBb0IsRUFBVTtZQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVELDJDQUFRLEdBQVI7UUFDRSxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUNsRTtRQUVELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztJQUN6RCxDQUFDOztnQkFqQm1CLFVBQVU7Z0JBQ0osYUFBYTs7SUFLdkM7UUFEQyxLQUFLLEVBQUU7OzttRUFHUDtJQWJVLHdCQUF3QjtRQUhwQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsbUJBQW1CO1NBQzlCLENBQUM7eUNBTW9CLFVBQVU7WUFDSixhQUFhO09BTjVCLHdCQUF3QixDQXVCcEM7SUFBRCwrQkFBQztDQUFBLEFBdkJELElBdUJDO1NBdkJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY0h0bWxDb250YWluZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250YWluZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByaXZhdGUgX2lkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGFjSHRtbENvbnRhaW5lcihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBjb250YWluZXIgRVJST1I6IGVudGl0eSBpZCBub3QgZGVmaW5lZGApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuX2FjSHRtbE1hbmFnZXIuZ2V0KHRoaXMuX2lkKTtcbiAgICBlbnRpdHkucHJpbWl0aXZlLmVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiJdfQ==