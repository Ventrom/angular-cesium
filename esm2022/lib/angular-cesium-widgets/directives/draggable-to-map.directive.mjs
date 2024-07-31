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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DraggableToMapDirective, deps: [{ token: i0.ElementRef }, { token: i1.DraggableToMapService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: DraggableToMapDirective, selector: "[draggableToMap]", inputs: { draggableToMap: "draggableToMap" }, host: { listeners: { "mousedown": "onMouseDown()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: DraggableToMapDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[draggableToMap]' }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.DraggableToMapService }], propDecorators: { draggableToMap: [{
                type: Input
            }], onMouseDown: [{
                type: HostListener,
                args: ['mousedown']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLXRvLW1hcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvZGlyZWN0aXZlcy9kcmFnZ2FibGUtdG8tbWFwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7OztBQUduRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFHSCxNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQVksRUFBYyxFQUFVLGVBQXNDO1FBQXRDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUN4RSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3BELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ3JELENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDNUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ2pDLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1FBQ3pDLENBQUM7SUFDSCxDQUFDO0lBR0QsV0FBVztRQUNULElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7OEdBMUJVLHVCQUF1QjtrR0FBdkIsdUJBQXVCOzsyRkFBdkIsdUJBQXVCO2tCQURuQyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFDO21IQUU5QixjQUFjO3NCQUF0QixLQUFLO2dCQXVCTixXQUFXO3NCQURWLFlBQVk7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEcmFnZ2FibGVUb01hcFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kcmFnZ2FibGUtdG8tbWFwLnNlcnZpY2UnO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgdG8gYWxsb3cgZHJhZ2dpbmcgb2YgaWNvbnMgZnJvbSBvdXRzaWRlIHRoZSBtYXAgb3ZlciB0aGUgbWFwXG4gKiB3aGlsZSBiZWluZyBub3RpZmllZCBvZiB0aGUgZHJhZ2dpbmcgcG9zaXRpb24gYW5kIGRyb3AgcG9zaXRpb24gd2l0aCBhbiBvYnNlcnZhYmxlIGV4cG9zZWQgZnJvbSBgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlYC5cbiAqIEBJbnB1dCB7c3JjOiBzdHJpbmcsIHN0eWxlPzogYW55fSB8IHN0cmluZyAtXG4gKiB0aGUgW3NyYzogc3RyaW5nIHwgc3RyaW5nXSBzaG91bGQgYmUgdGhlIGltYWdlIHNyYyBvZiB0aGUgZHJhZ2dlZCBpbWFnZS5cbiAqIFRoZSBzdHlsZSBpcyBhbiBvcHRpb25hbCBzdHlsZSBvYmplY3QgZm9yIHRoZSBpbWFnZS5cbiAqXG4gKiBleGFtcGxlOlxuICogYGBgXG4gKiA8YSBocmVmPVwiLi4uXCIgY2xhc3M9XCIuLi5cIiBbZHJhZ2dhYmxlVG9NYXBdPVwie3NyYzogJy4uL2Fzc2V0cy9HaXRIdWItTWFyay1MaWdodC5wbmcnLCBzdHlsZToge3dpZHRoOiAnNTBweCcsIGhlaWdodDogJzUwcHgnfX1cIj5cbiAqICAgICA8aW1nIGNsYXNzPVwiZ2l0aHViXCIgc3JjPVwiLi4vYXNzZXRzL0dpdEh1Yi1NYXJrLUxpZ2h0LnBuZ1wiPlxuICogPC9hPlxuICogYGBgXG4gKlxuICogSW4gb3JkZXIgdGhlIGdldCBub3RpZmllZCBvZiB0aGUgZHJhZ2dpbmcgbG9jYXRpb24gIGFuZCBkcm9wIHN0YXRlIHN1YnNjcmliZSB0byBgRHJhZ2dhYmxlVG9NYXBTZXJ2aWNlLmRyYWdVcGRhdGVzKClgXG4gKiBgYGBcbiAqICB0aGlzLmljb25EcmFnU2VydmljZS5kcmFnVXBkYXRlcygpLnN1YnNjcmliZShlID0+IGNvbnNvbGUubG9nKGUpKTtcbiAqIGBgYFxuICpcbiAqIEluIG9yZGVyIHRoZSBjYW5jZWwgZHJhZ2dpbmcgdXNlIGBEcmFnZ2FibGVUb01hcFNlcnZpY2UuY2FuY2VsKClgXG4gKiBgYGBcbiAqICB0aGlzLmljb25EcmFnU2VydmljZS5jYW5jZWwoKTtcbiAqIGBgYFxuICovXG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2RyYWdnYWJsZVRvTWFwXSd9KVxuZXhwb3J0IGNsYXNzIERyYWdnYWJsZVRvTWFwRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZHJhZ2dhYmxlVG9NYXA6IHsgc3JjOiBzdHJpbmcsIHN0eWxlPzogYW55IH0gfCBzdHJpbmc7XG4gIHByaXZhdGUgc3JjOiBzdHJpbmc7XG4gIHByaXZhdGUgc3R5bGU6IGFueTtcblxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBpY29uRHJhZ1NlcnZpY2U6IERyYWdnYWJsZVRvTWFwU2VydmljZSkge1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJ3VzZXItZHJhZyddID0gJ25vbmUnO1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJ3VzZXItc2VsZWN0J10gPSAnbm9uZSc7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLW1vei11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy13ZWJraXQtdXNlci1kcmFnJ10gPSAnbm9uZSc7XG4gICAgZWwubmF0aXZlRWxlbWVudC5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICAgIGVsLm5hdGl2ZUVsZW1lbnQuc3R5bGVbJy1tcy11c2VyLXNlbGVjdCddID0gJ25vbmUnO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRyYWdnYWJsZVRvTWFwID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zcmMgPSB0aGlzLmRyYWdnYWJsZVRvTWFwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNyYyA9IHRoaXMuZHJhZ2dhYmxlVG9NYXAuc3JjO1xuICAgICAgdGhpcy5zdHlsZSA9IHRoaXMuZHJhZ2dhYmxlVG9NYXAuc3R5bGU7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJylcbiAgb25Nb3VzZURvd24oKSB7XG4gICAgdGhpcy5pY29uRHJhZ1NlcnZpY2UuZHJhZyh0aGlzLnNyYywgdGhpcy5zdHlsZSk7XG4gIH1cbn1cbiJdfQ==