/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
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
    /**
     * @param {?} screenPosition
     * @return {?}
     */
    AcHtmlComponent.prototype.setScreenPosition = /**
     * @param {?} screenPosition
     * @return {?}
     */
    function (screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', screenPosition.y + "px");
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', screenPosition.x + "px");
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.remove = /**
     * @return {?}
     */
    function () {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.hideElement = /**
     * @return {?}
     */
    function () {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', "none");
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.add = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.cesiumService.getScene(), _this.props.position);
                _this.setScreenPosition(screenPosition);
            });
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', "block");
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    };
    /**
     * @return {?}
     */
    AcHtmlComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.remove();
    };
    AcHtmlComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-html',
                    template: "<ng-content></ng-content>",
                    styles: [":host {\n                position: absolute;\n                z-index: 100;\n\t\t\t\t}"]
                }] }
    ];
    /** @nocollapse */
    AcHtmlComponent.ctorParameters = function () { return [
        { type: CesiumService },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    AcHtmlComponent.propDecorators = {
        props: [{ type: Input }]
    };
    return AcHtmlComponent;
}());
export { AcHtmlComponent };
if (false) {
    /** @type {?} */
    AcHtmlComponent.prototype.props;
    /**
     * @type {?}
     * @private
     */
    AcHtmlComponent.prototype.isDraw;
    /** @type {?} */
    AcHtmlComponent.prototype.preRenderEventListener;
    /**
     * @type {?}
     * @private
     */
    AcHtmlComponent.prototype.cesiumService;
    /**
     * @type {?}
     * @private
     */
    AcHtmlComponent.prototype.elementRef;
    /**
     * @type {?}
     * @private
     */
    AcHtmlComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWh0bWwvYWMtaHRtbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVcsVUFBVSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7Ozs7Ozs7QUFhckU7SUFlRSx5QkFBb0IsYUFBNEIsRUFBVSxVQUFzQixFQUFVLFFBQW1CO1FBQXpGLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFIckcsV0FBTSxHQUFHLEtBQUssQ0FBQztJQUl2QixDQUFDOzs7OztJQUVELDJDQUFpQjs7OztJQUFqQixVQUFrQixjQUFtQjtRQUNuQyxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUssY0FBYyxDQUFDLENBQUMsT0FBSSxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFLLGNBQWMsQ0FBQyxDQUFDLE9BQUksQ0FBQyxDQUFDO1NBQ3hGO0lBQ0gsQ0FBQzs7OztJQUVELGtDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekYsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7OztJQUVELGdDQUFNOzs7SUFBTjtRQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFRCxxQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQzs7OztJQUVELDZCQUFHOzs7SUFBSDtRQUFBLGlCQVdDO1FBVkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxDQUFDLHNCQUFzQjs7O1lBQUc7O29CQUN0QixjQUFjLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUNsRyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDdEIsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQSxDQUFDO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0gsQ0FBQzs7OztJQUVELG1DQUFTOzs7SUFBVDtRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ3BELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNaO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7Ozs7SUFFRCxxQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQzs7Z0JBbkVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsU0FBUztvQkFDbkIsUUFBUSxFQUFFLDJCQUEyQjs2QkFDNUIsd0ZBR0w7aUJBQ0w7Ozs7Z0JBcEJRLGFBQWE7Z0JBRE8sVUFBVTtnQkFBNEIsU0FBUzs7O3dCQXlCekUsS0FBSzs7SUF5RFIsc0JBQUM7Q0FBQSxBQXBFRCxJQW9FQztTQTVEWSxlQUFlOzs7SUFHMUIsZ0NBQW9COzs7OztJQUNwQixpQ0FBdUI7O0lBQ3ZCLGlEQUFtQzs7Ozs7SUFFdkIsd0NBQW9DOzs7OztJQUFFLHFDQUE4Qjs7Ozs7SUFBRSxtQ0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIERvQ2hlY2ssIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBodG1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1odG1sIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtaHRtbCBbcHJvcHNdPVwie3Bvc2l0aW9uOiBwb3NpdGlvbiwgc2hvdzogdHJ1ZX1cIj47XG4gKiAgICA8cD5odG1sIGVsZW1lbnQ8L3A+XG4gKiAgPC9hYy1odG1sPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWh0bWwnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtgOmhvc3Qge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICB6LWluZGV4OiAxMDA7XG5cdFx0XHRcdH1gXVxufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb21wb25lbnQgaW1wbGVtZW50cyBEb0NoZWNrLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cblxuICBASW5wdXQoKSBwcm9wczogYW55O1xuICBwcml2YXRlIGlzRHJhdyA9IGZhbHNlO1xuICBwcmVSZW5kZXJFdmVudExpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIHNldFNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uOiBhbnkpIHtcbiAgICBpZiAoc2NyZWVuUG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBgJHtzY3JlZW5Qb3NpdGlvbi55fXB4YCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIGAke3NjcmVlblBvc2l0aW9uLnh9cHhgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0TWFwQ29udGFpbmVyKCkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmhpZGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLmlzRHJhdykge1xuICAgICAgdGhpcy5pc0RyYXcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLnByZVJlbmRlci5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICB0aGlzLmhpZGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZUVsZW1lbnQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCBgbm9uZWApO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIGlmICghdGhpcy5pc0RyYXcpIHtcbiAgICAgIHRoaXMuaXNEcmF3ID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2NyZWVuUG9zaXRpb24gPSBDZXNpdW0uU2NlbmVUcmFuc2Zvcm1zLndnczg0VG9XaW5kb3dDb29yZGluYXRlcyh0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKSxcbiAgICAgICAgICB0aGlzLnByb3BzLnBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5zZXRTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbik7XG4gICAgICB9O1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCBgYmxvY2tgKTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLnByZVJlbmRlci5hZGRFdmVudExpc3RlbmVyKHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuYWRkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxufVxuIl19