/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
export class AcHtmlComponent {
    /**
     * @param {?} cesiumService
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    /**
     * @param {?} screenPosition
     * @return {?}
     */
    setScreenPosition(screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${screenPosition.y}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${screenPosition.x}px`);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    }
    /**
     * @return {?}
     */
    hideElement() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `none`);
    }
    /**
     * @return {?}
     */
    add() {
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = (/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(), this.props.position);
                this.setScreenPosition(screenPosition);
            });
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.remove();
    }
}
AcHtmlComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-html',
                template: `<ng-content></ng-content>`,
                styles: [`:host {
                position: absolute;
                z-index: 100;
				}`]
            }] }
];
/** @nocollapse */
AcHtmlComponent.ctorParameters = () => [
    { type: CesiumService },
    { type: ElementRef },
    { type: Renderer2 }
];
AcHtmlComponent.propDecorators = {
    props: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWh0bWwvYWMtaHRtbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVcsVUFBVSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7Ozs7Ozs7Ozs7QUFxQnJFLE1BQU0sT0FBTyxlQUFlOzs7Ozs7SUFPMUIsWUFBb0IsYUFBNEIsRUFBVSxVQUFzQixFQUFVLFFBQW1CO1FBQXpGLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFIckcsV0FBTSxHQUFHLEtBQUssQ0FBQztJQUl2QixDQUFDOzs7OztJQUVELGlCQUFpQixDQUFDLGNBQW1CO1FBQ25DLElBQUksY0FBYyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hGO0lBQ0gsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDekYsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQzs7OztJQUVELEdBQUc7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsc0JBQXNCOzs7WUFBRyxHQUFHLEVBQUU7O3NCQUMzQixjQUFjLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxFQUNsRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQSxDQUFDO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0gsQ0FBQzs7OztJQUVELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNwRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDWjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDOzs7WUFuRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxTQUFTO2dCQUNuQixRQUFRLEVBQUUsMkJBQTJCO3lCQUM1Qjs7O01BR0w7YUFDTDs7OztZQXBCUSxhQUFhO1lBRE8sVUFBVTtZQUE0QixTQUFTOzs7b0JBeUJ6RSxLQUFLOzs7O0lBQU4sZ0NBQW9COzs7OztJQUNwQixpQ0FBdUI7O0lBQ3ZCLGlEQUFtQzs7Ozs7SUFFdkIsd0NBQW9DOzs7OztJQUFFLHFDQUE4Qjs7Ozs7SUFBRSxtQ0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIERvQ2hlY2ssIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBodG1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1odG1sIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtaHRtbCBbcHJvcHNdPVwie3Bvc2l0aW9uOiBwb3NpdGlvbiwgc2hvdzogdHJ1ZX1cIj47XG4gKiAgICA8cD5odG1sIGVsZW1lbnQ8L3A+XG4gKiAgPC9hYy1odG1sPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWh0bWwnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBzdHlsZXM6IFtgOmhvc3Qge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICB6LWluZGV4OiAxMDA7XG5cdFx0XHRcdH1gXVxufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxDb21wb25lbnQgaW1wbGVtZW50cyBEb0NoZWNrLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cblxuICBASW5wdXQoKSBwcm9wczogYW55O1xuICBwcml2YXRlIGlzRHJhdyA9IGZhbHNlO1xuICBwcmVSZW5kZXJFdmVudExpc3RlbmVyOiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIHNldFNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uOiBhbnkpIHtcbiAgICBpZiAoc2NyZWVuUG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBgJHtzY3JlZW5Qb3NpdGlvbi55fXB4YCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIGAke3NjcmVlblBvc2l0aW9uLnh9cHhgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0TWFwQ29udGFpbmVyKCkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmhpZGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLmlzRHJhdykge1xuICAgICAgdGhpcy5pc0RyYXcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLnByZVJlbmRlci5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lcik7XG4gICAgICB0aGlzLmhpZGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgaGlkZUVsZW1lbnQoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCBgbm9uZWApO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIGlmICghdGhpcy5pc0RyYXcpIHtcbiAgICAgIHRoaXMuaXNEcmF3ID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2NyZWVuUG9zaXRpb24gPSBDZXNpdW0uU2NlbmVUcmFuc2Zvcm1zLndnczg0VG9XaW5kb3dDb29yZGluYXRlcyh0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKSxcbiAgICAgICAgICB0aGlzLnByb3BzLnBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5zZXRTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbik7XG4gICAgICB9O1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCBgYmxvY2tgKTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLnByZVJlbmRlci5hZGRFdmVudExpc3RlbmVyKHRoaXMucHJlUmVuZGVyRXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNob3cgPT09IHVuZGVmaW5lZCB8fCB0aGlzLnByb3BzLnNob3cpIHtcbiAgICAgIHRoaXMuYWRkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxufVxuIl19