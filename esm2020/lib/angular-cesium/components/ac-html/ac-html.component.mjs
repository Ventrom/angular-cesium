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
}
AcHtmlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlComponent, deps: [{ token: i1.CesiumService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
AcHtmlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcHtmlComponent, selector: "ac-html", inputs: { props: "props" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{position:absolute;z-index:100}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-html', template: `<ng-content></ng-content>`, styles: [":host{position:absolute;z-index:100}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }, { type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { props: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtaHRtbC9hYy1odG1sLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUF1QixLQUFLLEVBQWdDLE1BQU0sZUFBZSxDQUFDOzs7QUFHcEc7Ozs7Ozs7OztHQVNHO0FBVUgsTUFBTSxPQUFPLGVBQWU7SUFPMUIsWUFBb0IsYUFBNEIsRUFBVSxVQUFzQixFQUFVLFFBQW1CO1FBQXpGLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFIckcsV0FBTSxHQUFHLEtBQUssQ0FBQztJQUl2QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsY0FBbUI7UUFDbkMsSUFBSSxjQUFjLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEY7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsR0FBRztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7Z0JBQ2pDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFDbEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUN2RjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDcEQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ1o7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQzs7NkdBM0RVLGVBQWU7aUdBQWYsZUFBZSwyRUFOaEIsMkJBQTJCOzRGQU0xQixlQUFlO2tCQVIzQixTQUFTOytCQUNFLFNBQVMsWUFDVCwyQkFBMkI7cUpBUzVCLEtBQUs7c0JBQWIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRG9DaGVjaywgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGh0bWwgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWh0bWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1odG1sIFtwcm9wc109XCJ7cG9zaXRpb246IHBvc2l0aW9uLCBzaG93OiB0cnVlfVwiPjtcbiAqICAgIDxwPmh0bWwgZWxlbWVudDwvcD5cbiAqICA8L2FjLWh0bWw+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtaHRtbCcsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIHN0eWxlczogW2A6aG9zdCB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgIHotaW5kZXg6IDEwMDtcblx0XHRcdFx0fWBdXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbENvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSwgT25Jbml0IHtcblxuXG4gIEBJbnB1dCgpIHByb3BzOiBhbnk7XG4gIHByaXZhdGUgaXNEcmF3ID0gZmFsc2U7XG4gIHByZVJlbmRlckV2ZW50TGlzdGVuZXI6ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgc2V0U2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb246IGFueSkge1xuICAgIGlmIChzY3JlZW5Qb3NpdGlvbikge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3RvcCcsIGAke3NjcmVlblBvc2l0aW9uLnl9cHhgKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgYCR7c2NyZWVuUG9zaXRpb24ueH1weGApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaGlkZUVsZW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuaXNEcmF3KSB7XG4gICAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJlUmVuZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyKTtcbiAgICAgIHRoaXMuaGlkZUVsZW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBoaWRlRWxlbWVudCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGBub25lYCk7XG4gIH1cblxuICBhZGQoKSB7XG4gICAgaWYgKCF0aGlzLmlzRHJhdykge1xuICAgICAgdGhpcy5pc0RyYXcgPSB0cnVlO1xuICAgICAgdGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLFxuICAgICAgICAgIHRoaXMucHJvcHMucG9zaXRpb24pO1xuICAgICAgICB0aGlzLnNldFNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGBibG9ja2ApO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJlUmVuZGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5hZGQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG59XG4iXX0=