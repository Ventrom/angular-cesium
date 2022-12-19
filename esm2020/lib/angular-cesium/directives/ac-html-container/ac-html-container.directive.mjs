import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/ac-html-manager/ac-html-manager.service";
export class AcHtmlContainerDirective {
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
}
AcHtmlContainerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlContainerDirective, deps: [{ token: i0.ElementRef }, { token: i1.AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive });
AcHtmlContainerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: { acHtmlContainer: "acHtmlContainer" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlContainerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtmlContainer]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.AcHtmlManager }]; }, propDecorators: { acHtmlContainer: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwtY29udGFpbmVyL2FjLWh0bWwtY29udGFpbmVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQzs7O0FBTXJFLE1BQU0sT0FBTyx3QkFBd0I7SUFJbkMsWUFDVSxRQUFvQixFQUNwQixjQUE2QjtRQUQ3QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRXZDLENBQUM7SUFFRCxJQUNJLGVBQWUsQ0FBQyxFQUFVO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDbEU7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7SUFDekQsQ0FBQzs7c0hBdEJVLHdCQUF3QjswR0FBeEIsd0JBQXdCOzRGQUF4Qix3QkFBd0I7a0JBSHBDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7NkhBWUssZUFBZTtzQkFEbEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY0h0bWxDb250YWluZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250YWluZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByaXZhdGUgX2lkOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGFjSHRtbENvbnRhaW5lcihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSBpZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBjb250YWluZXIgRVJST1I6IGVudGl0eSBpZCBub3QgZGVmaW5lZGApO1xuICAgIH1cblxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuX2FjSHRtbE1hbmFnZXIuZ2V0KHRoaXMuX2lkKTtcbiAgICBlbnRpdHkucHJpbWl0aXZlLmVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiJdfQ==