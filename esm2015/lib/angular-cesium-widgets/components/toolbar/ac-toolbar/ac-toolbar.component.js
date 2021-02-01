import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
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
let AcToolbarComponent = class AcToolbarComponent {
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
};
AcToolbarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: CesiumService }
];
__decorate([
    Input(),
    __metadata("design:type", String)
], AcToolbarComponent.prototype, "toolbarClass", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AcToolbarComponent.prototype, "allowDrag", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AcToolbarComponent.prototype, "onDrag", void 0);
AcToolbarComponent = __decorate([
    Component({
        selector: 'ac-toolbar',
        template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [`
        :host {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 999;
            -webkit-user-drag: none;
        }
    `]
    }),
    __metadata("design:paramtypes", [ElementRef, CesiumService])
], AcToolbarComponent);
export { AcToolbarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2FjLXRvb2xiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUcxRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQTZCSCxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQW1CN0IsWUFBb0IsT0FBbUIsRUFBVSxhQUE0QjtRQUF6RCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFmN0UsY0FBUyxHQUFHLElBQUksQ0FBQztRQUVqQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUV4QyxjQUFTLEdBQUc7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQztJQVE4RSxDQUFDO0lBRWpGLFFBQVE7UUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RGLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFHRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUU7WUFDM0YsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtZQUMzRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUEyQixDQUFDO1FBQzFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUEyQixDQUFDO1FBRXBHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDakIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFDckIsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsQ0FBQyxDQUNKLENBQUM7UUFFZixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUE7O1lBNUM4QixVQUFVO1lBQXlCLGFBQWE7O0FBakI3RTtJQURDLEtBQUssRUFBRTs7d0RBQ2E7QUFFckI7SUFEQyxLQUFLLEVBQUU7O3FEQUNTO0FBRWpCO0lBREMsTUFBTSxFQUFFOztrREFDK0I7QUFON0Isa0JBQWtCO0lBNUI5QixTQUFTLENBQ1I7UUFDRSxRQUFRLEVBQUUsWUFBWTtRQUN0QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7S0FVVDtRQVlELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQVh0Qzs7Ozs7Ozs7OztLQVVSO0tBRUYsQ0FDRjtxQ0FvQjhCLFVBQVUsRUFBeUIsYUFBYTtHQW5CbEUsa0JBQWtCLENBK0Q5QjtTQS9EWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQgYXMgb2JzZXJ2YWJsZUZyb21FdmVudCwgU3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5cblxuLyoqXG4gKiBUb29sYmFyIHdpZGdldCwgYWN0IGFzIGEgY29udGFpbmVyIGZvciBhYy10b29sYmFyLWJ1dHRvbiBjb21wb25lbnRzXG4gKiBhbGxvd2luZyBkcmFnIGNvbmZpZ3VyYXRpb24gYW5kIHBhc3NpbmcgYHRvb2xiYXJDbGFzc2AgYXMgYXR0cmlidXRlc1xuICpcbiAqIFVzYWdlOlxuICogYGBgXG4gKiA8YWMtdG9vbGJhciBbYWxsb3dEcmFnXT1cInRydWVcIiAob25EcmFnKT1cImhhbmRsZURyYWcoJGV2ZW50KVwiPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2hvbWUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwiZ29Ib21lKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2V4cGxvcmUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwicmFuZ2VBbmRCZWFyaW5nKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDwvYWMtdG9vbGJhcj5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInt7dG9vbGJhckNsYXNzfX1cIj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJhbGxvd0RyYWdcIj5cbiAgICAgICAgICAgICAgICA8YWMtdG9vbGJhci1idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxhYy1kcmFnLWljb24+PC9hYy1kcmFnLWljb24+XG4gICAgICAgICAgICAgICAgPC9hYy10b29sYmFyLWJ1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDIwcHg7XG4gICAgICAgICAgICBsZWZ0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB6LWluZGV4OiA5OTk7XG4gICAgICAgICAgICAtd2Via2l0LXVzZXItZHJhZzogbm9uZTtcbiAgICAgICAgfVxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNUb29sYmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHRvb2xiYXJDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBhbGxvd0RyYWcgPSB0cnVlO1xuICBAT3V0cHV0KClcbiAgb25EcmFnID0gbmV3IEV2ZW50RW1pdHRlcjxNb3VzZUV2ZW50PigpO1xuXG4gIGRyYWdTdHlsZSA9IHtcbiAgICAnaGVpZ2h0LnB4JzogMjAsXG4gICAgJ3dpZHRoLnB4JzogMjAsXG4gIH07XG5cbiAgcHJpdmF0ZSBtb3VzZURvd24kOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIG1vdXNlTW92ZSQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gIHByaXZhdGUgbW91c2VVcCQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gIHByaXZhdGUgZHJhZyQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gIHByaXZhdGUgZHJhZ1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvckRyYWdnaW5nKCk7XG4gICAgfVxuICB9XG5cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuYWxsb3dEcmFnICYmIGNoYW5nZXMuYWxsb3dEcmFnLmN1cnJlbnRWYWx1ZSAmJiAhY2hhbmdlcy5hbGxvd0RyYWcucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JEcmFnZ2luZygpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmFsbG93RHJhZyAmJiAhY2hhbmdlcy5hbGxvd0RyYWcuY3VycmVudFZhbHVlICYmIGNoYW5nZXMuYWxsb3dEcmFnLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRyYWdTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuZHJhZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yRHJhZ2dpbmcoKSB7XG4gICAgdGhpcy5tb3VzZURvd24kID0gdGhpcy5tb3VzZURvd24kIHx8IG9ic2VydmFibGVGcm9tRXZlbnQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nKTtcbiAgICB0aGlzLm1vdXNlTW92ZSQgPSB0aGlzLm1vdXNlTW92ZSQgfHwgb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gICAgdGhpcy5tb3VzZVVwJCA9IHRoaXMubW91c2VVcCQgfHwgb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ21vdXNldXAnKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuXG4gICAgdGhpcy5kcmFnJCA9IHRoaXMuZHJhZyQgfHxcbiAgICAgICAgICAgICAgICAgdGhpcy5tb3VzZURvd24kLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm1vdXNlTW92ZSQucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICB0YXAodGhpcy5vbkRyYWcuZW1pdCksXG4gICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMubW91c2VVcCQpXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICk7XG5cbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24gPSB0aGlzLmRyYWckLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtldmVudC54fXB4YDtcbiAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IGAke2V2ZW50Lnl9cHhgO1xuICAgIH0pO1xuICB9XG59XG4iXX0=