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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlContainerDirective, deps: [{ token: i0.ElementRef }, { token: i1.AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: { acHtmlContainer: "acHtmlContainer" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlContainerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtmlContainer]'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.AcHtmlManager }], propDecorators: { acHtmlContainer: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwtY29udGFpbmVyL2FjLWh0bWwtY29udGFpbmVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQzs7O0FBTXJFLE1BQU0sT0FBTyx3QkFBd0I7SUFJbkMsWUFDVSxRQUFvQixFQUNwQixjQUE2QjtRQUQ3QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRXZDLENBQUM7SUFFRCxJQUNJLGVBQWUsQ0FBQyxFQUFVO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUNuRSxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0lBQ3pELENBQUM7OEdBdEJVLHdCQUF3QjtrR0FBeEIsd0JBQXdCOzsyRkFBeEIsd0JBQXdCO2tCQUhwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7aUJBQzlCOzJHQVlLLGVBQWU7c0JBRGxCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjSHRtbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWNIdG1sQ29udGFpbmVyXSdcbn0pXG5leHBvcnQgY2xhc3MgQWNIdG1sQ29udGFpbmVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcml2YXRlIF9pZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfYWNIdG1sTWFuYWdlcjogQWNIdG1sTWFuYWdlclxuICApIHtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBhY0h0bWxDb250YWluZXIoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5faWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY0h0bWwgY29udGFpbmVyIEVSUk9SOiBlbnRpdHkgaWQgbm90IGRlZmluZWRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9hY0h0bWxNYW5hZ2VyLmdldCh0aGlzLl9pZCk7XG4gICAgZW50aXR5LnByaW1pdGl2ZS5lbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG59XG4iXX0=