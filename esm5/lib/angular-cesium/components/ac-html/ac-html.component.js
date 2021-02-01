import { __decorate, __metadata } from "tslib";
import { Component, DoCheck, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
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
var AcHtmlComponent = /** @class */ (function () {
    function AcHtmlComponent(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    AcHtmlComponent.prototype.setScreenPosition = function (screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', screenPosition.y + "px");
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', screenPosition.x + "px");
        }
    };
    AcHtmlComponent.prototype.ngOnInit = function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    };
    AcHtmlComponent.prototype.remove = function () {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    };
    AcHtmlComponent.prototype.hideElement = function () {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', "none");
    };
    AcHtmlComponent.prototype.add = function () {
        var _this = this;
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = function () {
                var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.cesiumService.getScene(), _this.props.position);
                _this.setScreenPosition(screenPosition);
            };
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', "block");
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    };
    AcHtmlComponent.prototype.ngDoCheck = function () {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    };
    AcHtmlComponent.prototype.ngOnDestroy = function () {
        this.remove();
    };
    AcHtmlComponent.ctorParameters = function () { return [
        { type: CesiumService },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcHtmlComponent.prototype, "props", void 0);
    AcHtmlComponent = __decorate([
        Component({
            selector: 'ac-html',
            template: "<ng-content></ng-content>",
            styles: [":host {\n                position: absolute;\n                z-index: 100;\n\t\t\t\t}"]
        }),
        __metadata("design:paramtypes", [CesiumService, ElementRef, Renderer2])
    ], AcHtmlComponent);
    return AcHtmlComponent;
}());
export { AcHtmlComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWh0bWwvYWMtaHRtbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXJFOzs7Ozs7Ozs7R0FTRztBQVVIO0lBT0UseUJBQW9CLGFBQTRCLEVBQVUsVUFBc0IsRUFBVSxRQUFtQjtRQUF6RixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBSHJHLFdBQU0sR0FBRyxLQUFLLENBQUM7SUFJdkIsQ0FBQztJQUVELDJDQUFpQixHQUFqQixVQUFrQixjQUFtQjtRQUNuQyxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUssY0FBYyxDQUFDLENBQUMsT0FBSSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFLLGNBQWMsQ0FBQyxDQUFDLE9BQUksQ0FBQyxDQUFDO1NBQ3hGO0lBQ0gsQ0FBQztJQUVELGtDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFRCxnQ0FBTSxHQUFOO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELHFDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELDZCQUFHLEdBQUg7UUFBQSxpQkFXQztRQVZDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxzQkFBc0IsR0FBRztnQkFDNUIsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUNsRyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QixLQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0gsQ0FBQztJQUVELG1DQUFTLEdBQVQ7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNwRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDWjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQscUNBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDOztnQkFwRGtDLGFBQWE7Z0JBQXNCLFVBQVU7Z0JBQW9CLFNBQVM7O0lBSnBHO1FBQVIsS0FBSyxFQUFFOztrREFBWTtJQUhULGVBQWU7UUFSM0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFNBQVM7WUFDbkIsUUFBUSxFQUFFLDJCQUEyQjtxQkFDNUIsd0ZBR0w7U0FDTCxDQUFDO3lDQVFtQyxhQUFhLEVBQXNCLFVBQVUsRUFBb0IsU0FBUztPQVBsRyxlQUFlLENBNEQzQjtJQUFELHNCQUFDO0NBQUEsQUE1REQsSUE0REM7U0E1RFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRG9DaGVjaywgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGh0bWwgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWh0bWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbWFwIGVsZW1lbnQuXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1odG1sIFtwcm9wc109XCJ7cG9zaXRpb246IHBvc2l0aW9uLCBzaG93OiB0cnVlfVwiPjtcbiAqICAgIDxwPmh0bWwgZWxlbWVudDwvcD5cbiAqICA8L2FjLWh0bWw+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtaHRtbCcsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIHN0eWxlczogW2A6aG9zdCB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgIHotaW5kZXg6IDEwMDtcblx0XHRcdFx0fWBdXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbENvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uRGVzdHJveSwgT25Jbml0IHtcblxuXG4gIEBJbnB1dCgpIHByb3BzOiBhbnk7XG4gIHByaXZhdGUgaXNEcmF3ID0gZmFsc2U7XG4gIHByZVJlbmRlckV2ZW50TGlzdGVuZXI6ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgc2V0U2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb246IGFueSkge1xuICAgIGlmIChzY3JlZW5Qb3NpdGlvbikge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3RvcCcsIGAke3NjcmVlblBvc2l0aW9uLnl9cHhgKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgYCR7c2NyZWVuUG9zaXRpb24ueH1weGApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdyA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaGlkZUVsZW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuaXNEcmF3KSB7XG4gICAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJlUmVuZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyKTtcbiAgICAgIHRoaXMuaGlkZUVsZW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBoaWRlRWxlbWVudCgpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGBub25lYCk7XG4gIH1cblxuICBhZGQoKSB7XG4gICAgaWYgKCF0aGlzLmlzRHJhdykge1xuICAgICAgdGhpcy5pc0RyYXcgPSB0cnVlO1xuICAgICAgdGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IENlc2l1bS5TY2VuZVRyYW5zZm9ybXMud2dzODRUb1dpbmRvd0Nvb3JkaW5hdGVzKHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLFxuICAgICAgICAgIHRoaXMucHJvcHMucG9zaXRpb24pO1xuICAgICAgICB0aGlzLnNldFNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGBibG9ja2ApO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJlUmVuZGVyLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5wcmVSZW5kZXJFdmVudExpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMucHJvcHMuc2hvdykge1xuICAgICAgdGhpcy5hZGQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG59XG4iXX0=