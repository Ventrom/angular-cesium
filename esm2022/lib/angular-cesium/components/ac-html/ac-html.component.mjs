import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-map element.
 *  __Usage:__
 *  ```
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
export class AcHtmlComponent {
    constructor(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    setScreenPosition(screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${screenPosition.y}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${screenPosition.x}px`);
        }
    }
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    }
    remove() {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    }
    hideElement() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `none`);
    }
    add() {
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = () => {
                const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(), this.props.position);
                this.setScreenPosition(screenPosition);
            };
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    }
    ngDoCheck() {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    }
    ngOnDestroy() {
        this.remove();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlComponent, deps: [{ token: i1.CesiumService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcHtmlComponent, selector: "ac-html", inputs: { props: "props" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{position:absolute;z-index:100}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-html', template: `<ng-content></ng-content>`, styles: [":host{position:absolute;z-index:100}\n"] }]
        }], ctorParameters: () => [{ type: i1.CesiumService }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { props: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtaHRtbC9hYy1odG1sLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUF1QixLQUFLLEVBQWdDLE1BQU0sZUFBZSxDQUFDOzs7QUFHcEc7Ozs7Ozs7OztHQVNHO0FBVUgsTUFBTSxPQUFPLGVBQWU7SUFPMUIsWUFBb0IsYUFBNEIsRUFBVSxVQUFzQixFQUFVLFFBQW1CO1FBQXpGLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFIckcsV0FBTSxHQUFHLEtBQUssQ0FBQztJQUl2QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsY0FBbUI7UUFDbkMsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RixDQUFDO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELEdBQUc7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7Z0JBQ2pDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN4RixDQUFDO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNiLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDOzhHQTNEVSxlQUFlO2tHQUFmLGVBQWUsMkVBTmhCLDJCQUEyQjs7MkZBTTFCLGVBQWU7a0JBUjNCLFNBQVM7K0JBQ0UsU0FBUyxZQUNULDJCQUEyQjttSUFTNUIsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEb0NoZWNrLCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gaHRtbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtaHRtbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLWh0bWwgW3Byb3BzXT1cIntwb3NpdGlvbjogcG9zaXRpb24sIHNob3c6IHRydWV9XCI+O1xuICogICAgPHA+aHRtbCBlbGVtZW50PC9wPlxuICogIDwvYWMtaHRtbD5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1odG1sJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgc3R5bGVzOiBbYDpob3N0IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgei1pbmRleDogMTAwO1xuXHRcdFx0XHR9YF1cbn0pXG5leHBvcnQgY2xhc3MgQWNIdG1sQ29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjaywgT25EZXN0cm95LCBPbkluaXQge1xuXG5cbiAgQElucHV0KCkgcHJvcHM6IGFueTtcbiAgcHJpdmF0ZSBpc0RyYXcgPSBmYWxzZTtcbiAgcHJlUmVuZGVyRXZlbnRMaXN0ZW5lcjogKCkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICBzZXRTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbjogYW55KSB7XG4gICAgaWYgKHNjcmVlblBvc2l0aW9uKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndG9wJywgYCR7c2NyZWVuUG9zaXRpb24ueX1weGApO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2xlZnQnLCBgJHtzY3JlZW5Qb3NpdGlvbi54fXB4YCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldE1hcENvbnRhaW5lcigpLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93ID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5oaWRlRWxlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBpZiAodGhpcy5pc0RyYXcpIHtcbiAgICAgIHRoaXMuaXNEcmF3ID0gZmFsc2U7XG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5wcmVSZW5kZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnByZVJlbmRlckV2ZW50TGlzdGVuZXIpO1xuICAgICAgdGhpcy5oaWRlRWxlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGVFbGVtZW50KCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgYG5vbmVgKTtcbiAgfVxuXG4gIGFkZCgpIHtcbiAgICBpZiAoIXRoaXMuaXNEcmF3KSB7XG4gICAgICB0aGlzLmlzRHJhdyA9IHRydWU7XG4gICAgICB0aGlzLnByZVJlbmRlckV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uID0gQ2VzaXVtLlNjZW5lVHJhbnNmb3Jtcy53Z3M4NFRvV2luZG93Q29vcmRpbmF0ZXModGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCksXG4gICAgICAgICAgdGhpcy5wcm9wcy5wb3NpdGlvbik7XG4gICAgICAgIHRoaXMuc2V0U2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgYGJsb2NrYCk7XG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5wcmVSZW5kZXIuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnByZVJlbmRlckV2ZW50TGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zaG93ID09PSB1bmRlZmluZWQgfHwgdGhpcy5wcm9wcy5zaG93KSB7XG4gICAgICB0aGlzLmFkZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==