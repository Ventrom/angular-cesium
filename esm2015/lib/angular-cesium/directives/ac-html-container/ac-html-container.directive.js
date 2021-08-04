import { Directive, ElementRef, Input } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
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
AcHtmlContainerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[acHtmlContainer]'
            },] }
];
AcHtmlContainerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: AcHtmlManager }
];
AcHtmlContainerDirective.propDecorators = {
    acHtmlContainer: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1jb250YWluZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwtY29udGFpbmVyL2FjLWh0bWwtY29udGFpbmVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBS3ZGLE1BQU0sT0FBTyx3QkFBd0I7SUFJbkMsWUFDVSxRQUFvQixFQUNwQixjQUE2QjtRQUQ3QixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRXZDLENBQUM7SUFFRCxJQUNJLGVBQWUsQ0FBQyxFQUFVO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDbEU7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7SUFDekQsQ0FBQzs7O1lBekJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCOzs7WUFMbUIsVUFBVTtZQUNyQixhQUFhOzs7OEJBZW5CLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjSHRtbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWNIdG1sQ29udGFpbmVyXSdcbn0pXG5leHBvcnQgY2xhc3MgQWNIdG1sQ29udGFpbmVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcml2YXRlIF9pZDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfYWNIdG1sTWFuYWdlcjogQWNIdG1sTWFuYWdlclxuICApIHtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBhY0h0bWxDb250YWluZXIoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuX2lkID0gaWQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5faWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY0h0bWwgY29udGFpbmVyIEVSUk9SOiBlbnRpdHkgaWQgbm90IGRlZmluZWRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9hY0h0bWxNYW5hZ2VyLmdldCh0aGlzLl9pZCk7XG4gICAgZW50aXR5LnByaW1pdGl2ZS5lbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG59XG4iXX0=