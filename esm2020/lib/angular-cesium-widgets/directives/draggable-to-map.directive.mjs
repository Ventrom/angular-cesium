import { Directive, HostListener, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../services/draggable-to-map.service";
/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * @Input {src: string, style?: any} | string -
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
    constructor(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    ngOnInit() {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    }
    onMouseDown() {
        this.iconDragService.drag(this.src, this.style);
    }
}
DraggableToMapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: DraggableToMapDirective, deps: [{ token: i0.ElementRef }, { token: i1.DraggableToMapService }], target: i0.ɵɵFactoryTarget.Directive });
DraggableToMapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: DraggableToMapDirective, selector: "[draggableToMap]", inputs: { draggableToMap: "draggableToMap" }, host: { listeners: { "mousedown": "onMouseDown()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: DraggableToMapDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[draggableToMap]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.DraggableToMapService }]; }, propDecorators: { draggableToMap: [{
                type: Input
            }], onMouseDown: [{
                type: HostListener,
                args: ['mousedown']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvZGlyZWN0aXZlcy9kcmFnZ2FibGUtdG8tbWFwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7OztBQUduRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFHSCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQVksRUFBYyxFQUFVLGVBQXNDO1FBQXRDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN4RSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3JELENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssUUFBUSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUdELFdBQVc7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDOztxSEExQlUsdUJBQXVCO3lHQUF2Qix1QkFBdUI7NEZBQXZCLHVCQUF1QjtrQkFEbkMsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQztxSUFFOUIsY0FBYztzQkFBdEIsS0FBSztnQkF1Qk4sV0FBVztzQkFEVixZQUFZO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZHJhZ2dhYmxlLXRvLW1hcC5zZXJ2aWNlJztcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyB1c2VkIHRvIGFsbG93IGRyYWdnaW5nIG9mIGljb25zIGZyb20gb3V0c2lkZSB0aGUgbWFwIG92ZXIgdGhlIG1hcFxuICogd2hpbGUgYmVpbmcgbm90aWZpZWQgb2YgdGhlIGRyYWdnaW5nIHBvc2l0aW9uIGFuZCBkcm9wIHBvc2l0aW9uIHdpdGggYW4gb2JzZXJ2YWJsZSBleHBvc2VkIGZyb20gYERyYWdnYWJsZVRvTWFwU2VydmljZWAuXG4gKiBASW5wdXQge3NyYzogc3RyaW5nLCBzdHlsZT86IGFueX0gfCBzdHJpbmcgLVxuICogdGhlIFtzcmM6IHN0cmluZyB8IHN0cmluZ10gc2hvdWxkIGJlIHRoZSBpbWFnZSBzcmMgb2YgdGhlIGRyYWdnZWQgaW1hZ2UuXG4gKiBUaGUgc3R5bGUgaXMgYW4gb3B0aW9uYWwgc3R5bGUgb2JqZWN0IGZvciB0aGUgaW1hZ2UuXG4gKlxuICogZXhhbXBsZTpcbiAqIGBgYFxuICogPGEgaHJlZj1cIi4uLlwiIGNsYXNzPVwiLi4uXCIgW2RyYWdnYWJsZVRvTWFwXT1cIntzcmM6ICcuLi9hc3NldHMvR2l0SHViLU1hcmstTGlnaHQucG5nJywgc3R5bGU6IHt3aWR0aDogJzUwcHgnLCBoZWlnaHQ6ICc1MHB4J319XCI+XG4gKiAgICAgPGltZyBjbGFzcz1cImdpdGh1YlwiIHNyYz1cIi4uL2Fzc2V0cy9HaXRIdWItTWFyay1MaWdodC5wbmdcIj5cbiAqIDwvYT5cbiAqIGBgYFxuICpcbiAqIEluIG9yZGVyIHRoZSBnZXQgbm90aWZpZWQgb2YgdGhlIGRyYWdnaW5nIGxvY2F0aW9uICBhbmQgZHJvcCBzdGF0ZSBzdWJzY3JpYmUgdG8gYERyYWdnYWJsZVRvTWFwU2VydmljZS5kcmFnVXBkYXRlcygpYFxuICogYGBgXG4gKiAgdGhpcy5pY29uRHJhZ1NlcnZpY2UuZHJhZ1VwZGF0ZXMoKS5zdWJzY3JpYmUoZSA9PiBjb25zb2xlLmxvZyhlKSk7XG4gKiBgYGBcbiAqXG4gKiBJbiBvcmRlciB0aGUgY2FuY2VsIGRyYWdnaW5nIHVzZSBgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlLmNhbmNlbCgpYFxuICogYGBgXG4gKiAgdGhpcy5pY29uRHJhZ1NlcnZpY2UuY2FuY2VsKCk7XG4gKiBgYGBcbiAqL1xuXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tkcmFnZ2FibGVUb01hcF0nfSlcbmV4cG9ydCBjbGFzcyBEcmFnZ2FibGVUb01hcERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGRyYWdnYWJsZVRvTWFwOiB7IHNyYzogc3RyaW5nLCBzdHlsZT86IGFueSB9IHwgc3RyaW5nO1xuICBwcml2YXRlIHNyYzogc3RyaW5nO1xuICBwcml2YXRlIHN0eWxlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgaWNvbkRyYWdTZXJ2aWNlOiBEcmFnZ2FibGVUb01hcFNlcnZpY2UpIHtcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyd1c2VyLWRyYWcnXSA9ICdub25lJztcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyd1c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy1tb3otdXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyctd2Via2l0LXVzZXItZHJhZyddID0gJ25vbmUnO1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy13ZWJraXQtdXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBlbC5uYXRpdmVFbGVtZW50LnN0eWxlWyctbXMtdXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdGhpcy5kcmFnZ2FibGVUb01hcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuc3JjID0gdGhpcy5kcmFnZ2FibGVUb01hcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zcmMgPSB0aGlzLmRyYWdnYWJsZVRvTWFwLnNyYztcbiAgICAgIHRoaXMuc3R5bGUgPSB0aGlzLmRyYWdnYWJsZVRvTWFwLnN0eWxlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicpXG4gIG9uTW91c2VEb3duKCkge1xuICAgIHRoaXMuaWNvbkRyYWdTZXJ2aWNlLmRyYWcodGhpcy5zcmMsIHRoaXMuc3R5bGUpO1xuICB9XG59XG4iXX0=