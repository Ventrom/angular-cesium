import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../../angular-cesium/services/cesium/cesium.service";
import * as i2 from "@angular/common";
import * as i3 from "./drag-icon.component";
import * as i4 from "../ac-toolbar-button/ac-toolbar-button.component";
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export class AcToolbarComponent {
    constructor(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.onDrag = new EventEmitter();
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            this.listenForDragging();
        }
    }
    ngOnChanges(changes) {
        if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
            this.listenForDragging();
        }
        if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
            this.dragSubscription.unsubscribe();
        }
    }
    ngOnDestroy() {
        if (this.dragSubscription) {
            this.dragSubscription.unsubscribe();
        }
    }
    listenForDragging() {
        this.mouseDown$ = this.mouseDown$ || observableFromEvent(this.element.nativeElement, 'mousedown');
        this.mouseMove$ = this.mouseMove$ || observableFromEvent(document, 'mousemove');
        this.mouseUp$ = this.mouseUp$ || observableFromEvent(document, 'mouseup');
        this.drag$ = this.drag$ ||
            this.mouseDown$.pipe(switchMap(() => this.mouseMove$.pipe(tap(this.onDrag.emit), takeUntil(this.mouseUp$))));
        this.dragSubscription = this.drag$.subscribe((event) => {
            this.element.nativeElement.style.left = `${event.x}px`;
            this.element.nativeElement.style.top = `${event.y}px`;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcToolbarComponent, deps: [{ token: i0.ElementRef }, { token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcToolbarComponent, selector: "ac-toolbar", inputs: { toolbarClass: "toolbarClass", allowDrag: "allowDrag" }, outputs: { onDrag: "onDrag" }, usesOnChanges: true, ngImport: i0, template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [":host{position:absolute;top:20px;left:20px;width:20px;height:20px;z-index:999;-webkit-user-drag:none}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.DragIconComponent, selector: "ac-drag-icon" }, { kind: "component", type: i4.AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: ["iconUrl", "buttonClass", "iconClass"], outputs: ["onClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-toolbar', template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{position:absolute;top:20px;left:20px;width:20px;height:20px;z-index:999;-webkit-user-drag:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.CesiumService }], propDecorators: { toolbarClass: [{
                type: Input
            }], allowDrag: [{
                type: Input
            }], onDrag: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXIvYWMtdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUtMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsSUFBSSxtQkFBbUIsRUFBNEIsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQUkzRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQTZCSCxNQUFNLE9BQU8sa0JBQWtCO0lBbUI3QixZQUFvQixPQUFtQixFQUFVLGFBQTRCO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWY3RSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRWpCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRXhDLGNBQVMsR0FBRztZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBUThFLENBQUM7SUFFakYsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEYsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7SUFHRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM1RixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRUQsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUM1RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsQ0FBQztJQUNILENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUEyQixDQUFDO1FBQzFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUEyQixDQUFDO1FBRXBHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDakIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFDckIsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsQ0FBQyxDQUNKLENBQUM7UUFFZixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0E5RFUsa0JBQWtCO2tHQUFsQixrQkFBa0Isd0tBekJqQjs7Ozs7Ozs7OztLQVVUOzsyRkFlUSxrQkFBa0I7a0JBNUI5QixTQUFTOytCQUVJLFlBQVksWUFDWjs7Ozs7Ozs7OztLQVVULG1CQVlnQix1QkFBdUIsQ0FBQyxNQUFNOzJHQUtqRCxZQUFZO3NCQURYLEtBQUs7Z0JBR04sU0FBUztzQkFEUixLQUFLO2dCQUdOLE1BQU07c0JBREwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCBhcyBvYnNlcnZhYmxlRnJvbUV2ZW50LCBTdWJzY3JpcHRpb24sIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN3aXRjaE1hcCwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuXG4vKipcbiAqIFRvb2xiYXIgd2lkZ2V0LCBhY3QgYXMgYSBjb250YWluZXIgZm9yIGFjLXRvb2xiYXItYnV0dG9uIGNvbXBvbmVudHNcbiAqIGFsbG93aW5nIGRyYWcgY29uZmlndXJhdGlvbiBhbmQgcGFzc2luZyBgdG9vbGJhckNsYXNzYCBhcyBhdHRyaWJ1dGVzXG4gKlxuICogVXNhZ2U6XG4gKiBgYGBcbiAqIDxhYy10b29sYmFyIFthbGxvd0RyYWddPVwidHJ1ZVwiIChvbkRyYWcpPVwiaGFuZGxlRHJhZygkZXZlbnQpXCI+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvaG9tZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJnb0hvbWUoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvZXhwbG9yZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJyYW5nZUFuZEJlYXJpbmcoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPC9hYy10b29sYmFyPlxuICogYGBgXG4gKlxuICovXG5AQ29tcG9uZW50KFxuICB7XG4gICAgc2VsZWN0b3I6ICdhYy10b29sYmFyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwie3t0b29sYmFyQ2xhc3N9fVwiPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cImFsbG93RHJhZ1wiPlxuICAgICAgICAgICAgICAgIDxhYy10b29sYmFyLWJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGFjLWRyYWctaWNvbj48L2FjLWRyYWctaWNvbj5cbiAgICAgICAgICAgICAgICA8L2FjLXRvb2xiYXItYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMjBweDtcbiAgICAgICAgICAgIGxlZnQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTtcbiAgICAgICAgICAgIC13ZWJraXQtdXNlci1kcmFnOiBub25lO1xuICAgICAgICB9XG4gICAgYF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIH1cbilcbmV4cG9ydCBjbGFzcyBBY1Rvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgdG9vbGJhckNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGFsbG93RHJhZyA9IHRydWU7XG4gIEBPdXRwdXQoKVxuICBvbkRyYWcgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XG5cbiAgZHJhZ1N0eWxlID0ge1xuICAgICdoZWlnaHQucHgnOiAyMCxcbiAgICAnd2lkdGgucHgnOiAyMCxcbiAgfTtcblxuICBwcml2YXRlIG1vdXNlRG93biQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gIHByaXZhdGUgbW91c2VNb3ZlJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgcHJpdmF0ZSBtb3VzZVVwJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgcHJpdmF0ZSBkcmFnJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgcHJpdmF0ZSBkcmFnU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldE1hcENvbnRhaW5lcigpLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yRHJhZ2dpbmcoKTtcbiAgICB9XG4gIH1cblxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5hbGxvd0RyYWcgJiYgY2hhbmdlcy5hbGxvd0RyYWcuY3VycmVudFZhbHVlICYmICFjaGFuZ2VzLmFsbG93RHJhZy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvckRyYWdnaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuYWxsb3dEcmFnICYmICFjaGFuZ2VzLmFsbG93RHJhZy5jdXJyZW50VmFsdWUgJiYgY2hhbmdlcy5hbGxvd0RyYWcucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZHJhZ1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JEcmFnZ2luZygpIHtcbiAgICB0aGlzLm1vdXNlRG93biQgPSB0aGlzLm1vdXNlRG93biQgfHwgb2JzZXJ2YWJsZUZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicpO1xuICAgIHRoaXMubW91c2VNb3ZlJCA9IHRoaXMubW91c2VNb3ZlJCB8fCBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgICB0aGlzLm1vdXNlVXAkID0gdGhpcy5tb3VzZVVwJCB8fCBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD47XG5cbiAgICB0aGlzLmRyYWckID0gdGhpcy5kcmFnJCB8fFxuICAgICAgICAgICAgICAgICB0aGlzLm1vdXNlRG93biQucGlwZShcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMubW91c2VNb3ZlJC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgIHRhcCh0aGlzLm9uRHJhZy5lbWl0KSxcbiAgICAgICAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5tb3VzZVVwJClcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgKTtcblxuICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbiA9IHRoaXMuZHJhZyQuc3Vic2NyaWJlKChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2V2ZW50Lnh9cHhgO1xuICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7ZXZlbnQueX1weGA7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==