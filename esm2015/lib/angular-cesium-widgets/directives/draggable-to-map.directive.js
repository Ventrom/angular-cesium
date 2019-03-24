/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DraggableToMapService } from '../services/draggable-to-map.service';
/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * \@Input {src: string, style?: any} | string -
 * the [src: string | string] should be the image src of the dragged image.
 * The style is an optional style object for the image.
 *
 * example:
 * ```
 * <a href="..." class="..." [draggableToMap]="{src: '../assets/GitHub-Mark-Light.png', style: {width: '50px', height: '50px'}}">
 *     <img class="github" src="../assets/GitHub-Mark-Light.png">
 * </a>
 * ```
 *
 * In order the get notified of the dragging location  and drop state subscribe to `DraggableToMapService.dragUpdates()`
 * ```
 *  this.iconDragService.dragUpdates().subscribe(e => console.log(e));
 * ```
 *
 * In order the cancel dragging use `DraggableToMapService.cancel()`
 * ```
 *  this.iconDragService.cancel();
 * ```
 */
export class DraggableToMapDirective {
    /**
     * @param {?} el
     * @param {?} iconDragService
     */
    constructor(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    }
    /**
     * @return {?}
     */
    onMouseDown() {
        this.iconDragService.drag(this.src, this.style);
    }
}
DraggableToMapDirective.decorators = [
    { type: Directive, args: [{ selector: '[draggableToMap]' },] }
];
/** @nocollapse */
DraggableToMapDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: DraggableToMapService }
];
DraggableToMapDirective.propDecorators = {
    draggableToMap: [{ type: Input }],
    onMouseDown: [{ type: HostListener, args: ['mousedown',] }]
};
if (false) {
    /** @type {?} */
    DraggableToMapDirective.prototype.draggableToMap;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapDirective.prototype.src;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapDirective.prototype.style;
    /**
     * @type {?}
     * @private
     */
    DraggableToMapDirective.prototype.iconDragService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2RpcmVjdGl2ZXMvZHJhZ2dhYmxlLXRvLW1hcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QjdFLE1BQU0sT0FBTyx1QkFBdUI7Ozs7O0lBS2xDLFlBQVksRUFBYyxFQUFVLGVBQXNDO1FBQXRDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN4RSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3JELENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssUUFBUSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQzs7OztJQUdELFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDOzs7WUEzQkYsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFDOzs7O1lBNUJyQixVQUFVO1lBQ3JCLHFCQUFxQjs7OzZCQTZCM0IsS0FBSzswQkFzQkwsWUFBWSxTQUFDLFdBQVc7Ozs7SUF0QnpCLGlEQUErRDs7Ozs7SUFDL0Qsc0NBQW9COzs7OztJQUNwQix3Q0FBbUI7Ozs7O0lBRVMsa0RBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERyYWdnYWJsZVRvTWFwU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RyYWdnYWJsZS10by1tYXAuc2VydmljZSc7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdXNlZCB0byBhbGxvdyBkcmFnZ2luZyBvZiBpY29ucyBmcm9tIG91dHNpZGUgdGhlIG1hcCBvdmVyIHRoZSBtYXBcbiAqIHdoaWxlIGJlaW5nIG5vdGlmaWVkIG9mIHRoZSBkcmFnZ2luZyBwb3NpdGlvbiBhbmQgZHJvcCBwb3NpdGlvbiB3aXRoIGFuIG9ic2VydmFibGUgZXhwb3NlZCBmcm9tIGBEcmFnZ2FibGVUb01hcFNlcnZpY2VgLlxuICogQElucHV0IHtzcmM6IHN0cmluZywgc3R5bGU/OiBhbnl9IHwgc3RyaW5nIC1cbiAqIHRoZSBbc3JjOiBzdHJpbmcgfCBzdHJpbmddIHNob3VsZCBiZSB0aGUgaW1hZ2Ugc3JjIG9mIHRoZSBkcmFnZ2VkIGltYWdlLlxuICogVGhlIHN0eWxlIGlzIGFuIG9wdGlvbmFsIHN0eWxlIG9iamVjdCBmb3IgdGhlIGltYWdlLlxuICpcbiAqIGV4YW1wbGU6XG4gKiBgYGBcbiAqIDxhIGhyZWY9XCIuLi5cIiBjbGFzcz1cIi4uLlwiIFtkcmFnZ2FibGVUb01hcF09XCJ7c3JjOiAnLi4vYXNzZXRzL0dpdEh1Yi1NYXJrLUxpZ2h0LnBuZycsIHN0eWxlOiB7d2lkdGg6ICc1MHB4JywgaGVpZ2h0OiAnNTBweCd9fVwiPlxuICogICAgIDxpbWcgY2xhc3M9XCJnaXRodWJcIiBzcmM9XCIuLi9hc3NldHMvR2l0SHViLU1hcmstTGlnaHQucG5nXCI+XG4gKiA8L2E+XG4gKiBgYGBcbiAqXG4gKiBJbiBvcmRlciB0aGUgZ2V0IG5vdGlmaWVkIG9mIHRoZSBkcmFnZ2luZyBsb2NhdGlvbiAgYW5kIGRyb3Agc3RhdGUgc3Vic2NyaWJlIHRvIGBEcmFnZ2FibGVUb01hcFNlcnZpY2UuZHJhZ1VwZGF0ZXMoKWBcbiAqIGBgYFxuICogIHRoaXMuaWNvbkRyYWdTZXJ2aWNlLmRyYWdVcGRhdGVzKCkuc3Vic2NyaWJlKGUgPT4gY29uc29sZS5sb2coZSkpO1xuICogYGBgXG4gKlxuICogSW4gb3JkZXIgdGhlIGNhbmNlbCBkcmFnZ2luZyB1c2UgYERyYWdnYWJsZVRvTWFwU2VydmljZS5jYW5jZWwoKWBcbiAqIGBgYFxuICogIHRoaXMuaWNvbkRyYWdTZXJ2aWNlLmNhbmNlbCgpO1xuICogYGBgXG4gKi9cblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZHJhZ2dhYmxlVG9NYXBdJ30pXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlVG9NYXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBkcmFnZ2FibGVUb01hcDogeyBzcmM6IHN0cmluZywgc3R5bGU/OiBhbnkgfSB8IHN0cmluZztcbiAgcHJpdmF0ZSBzcmM6IHN0cmluZztcbiAgcHJpdmF0ZSBzdHlsZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIGljb25EcmFnU2VydmljZTogRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlKSB7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsndXNlci1kcmFnJ10gPSAnbm9uZSc7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsndXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyctbW96LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLWRyYWcnXSA9ICdub25lJztcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyctd2Via2l0LXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLW1zLXVzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZHJhZ2dhYmxlVG9NYXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNyYyA9IHRoaXMuZHJhZ2dhYmxlVG9NYXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3JjID0gdGhpcy5kcmFnZ2FibGVUb01hcC5zcmM7XG4gICAgICB0aGlzLnN0eWxlID0gdGhpcy5kcmFnZ2FibGVUb01hcC5zdHlsZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nKVxuICBvbk1vdXNlRG93bigpIHtcbiAgICB0aGlzLmljb25EcmFnU2VydmljZS5kcmFnKHRoaXMuc3JjLCB0aGlzLnN0eWxlKTtcbiAgfVxufVxuIl19