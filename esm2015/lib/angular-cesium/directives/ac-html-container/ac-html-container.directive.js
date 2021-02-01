import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
let AcHtmlContainerDirective = class AcHtmlContainerDirective {
    constructor(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    set acHtmlContainer(id) {
        this._id = id;
    }
    ngOnInit() {
        if (this._id === undefined) {
            throw new Error(`AcHtml container ERROR: entity id not defined`);
        }
        const entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    }
};
AcHtmlContainerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: AcHtmlManager }
];
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
export { AcHtmlContainerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vZGlyZWN0aXZlcy9hYy1odG1sLWNvbnRhaW5lci9hYy1odG1sLWNvbnRhaW5lci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBS3ZGLElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBSW5DLFlBQ1UsUUFBb0IsRUFDcEIsY0FBNkI7UUFEN0IsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUNwQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtJQUV2QyxDQUFDO0lBR0QsSUFBSSxlQUFlLENBQUMsRUFBVTtRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0lBQ3pELENBQUM7Q0FDRixDQUFBOztZQWxCcUIsVUFBVTtZQUNKLGFBQWE7O0FBS3ZDO0lBREMsS0FBSyxFQUFFOzs7K0RBR1A7QUFiVSx3QkFBd0I7SUFIcEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG1CQUFtQjtLQUM5QixDQUFDO3FDQU1vQixVQUFVO1FBQ0osYUFBYTtHQU41Qix3QkFBd0IsQ0F1QnBDO1NBdkJZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY0h0bWxDb250YWluZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250YWluZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByaXZhdGUgX2lkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGFjSHRtbENvbnRhaW5lcihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBjb250YWluZXIgRVJST1I6IGVudGl0eSBpZCBub3QgZGVmaW5lZGApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuX2FjSHRtbE1hbmFnZXIuZ2V0KHRoaXMuX2lkKTtcbiAgICBlbnRpdHkucHJpbWl0aXZlLmVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiJdfQ==