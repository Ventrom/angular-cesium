import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
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
}
AcToolbarComponent.decorators = [
    { type: Component, args: [{
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
            },] }
];
AcToolbarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: CesiumService }
];
AcToolbarComponent.propDecorators = {
    toolbarClass: [{ type: Input }],
    allowDrag: [{ type: Input }],
    onDrag: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXIvYWMtdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFLTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUcxRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQTZCSCxNQUFNLE9BQU8sa0JBQWtCO0lBbUI3QixZQUFvQixPQUFtQixFQUFVLGFBQTRCO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWY3RSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRWpCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRXhDLGNBQVMsR0FBRztZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBUThFLENBQUM7SUFFakYsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEYsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUdELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtZQUMzRixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtRQUVELElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO1lBQzNGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVPLGlCQUFpQjtRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQTJCLENBQUM7UUFDMUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQTJCLENBQUM7UUFFcEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztZQUNWLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNqQixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUNyQixTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUN6QixDQUFDLENBQ0osQ0FBQztRQUVmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRTtZQUNqRSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUExRkYsU0FBUyxTQUNSO2dCQUNFLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7S0FVVDtnQkFZRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTt5QkFYdEM7Ozs7Ozs7Ozs7S0FVUjthQUVGOzs7WUF2REQsVUFBVTtZQVdILGFBQWE7OzsyQkErQ25CLEtBQUs7d0JBRUwsS0FBSztxQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogVG9vbGJhciB3aWRnZXQsIGFjdCBhcyBhIGNvbnRhaW5lciBmb3IgYWMtdG9vbGJhci1idXR0b24gY29tcG9uZW50c1xuICogYWxsb3dpbmcgZHJhZyBjb25maWd1cmF0aW9uIGFuZCBwYXNzaW5nIGB0b29sYmFyQ2xhc3NgIGFzIGF0dHJpYnV0ZXNcbiAqXG4gKiBVc2FnZTpcbiAqIGBgYFxuICogPGFjLXRvb2xiYXIgW2FsbG93RHJhZ109XCJ0cnVlXCIgKG9uRHJhZyk9XCJoYW5kbGVEcmFnKCRldmVudClcIj5cbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9ob21lLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cImdvSG9tZSgpXCI+XG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9leHBsb3JlLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cInJhbmdlQW5kQmVhcmluZygpXCI+XG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cbiA8L2FjLXRvb2xiYXI+XG4gKiBgYGBcbiAqXG4gKi9cbkBDb21wb25lbnQoXG4gIHtcbiAgICBzZWxlY3RvcjogJ2FjLXRvb2xiYXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7e3Rvb2xiYXJDbGFzc319XCI+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiYWxsb3dEcmFnXCI+XG4gICAgICAgICAgICAgICAgPGFjLXRvb2xiYXItYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YWMtZHJhZy1pY29uPjwvYWMtZHJhZy1pY29uPlxuICAgICAgICAgICAgICAgIDwvYWMtdG9vbGJhci1idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAyMHB4O1xuICAgICAgICAgICAgbGVmdDogMjBweDtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5O1xuICAgICAgICAgICAgLXdlYmtpdC11c2VyLWRyYWc6IG5vbmU7XG4gICAgICAgIH1cbiAgICBgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgfVxuKVxuZXhwb3J0IGNsYXNzIEFjVG9vbGJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICB0b29sYmFyQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgYWxsb3dEcmFnID0gdHJ1ZTtcbiAgQE91dHB1dCgpXG4gIG9uRHJhZyA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICBkcmFnU3R5bGUgPSB7XG4gICAgJ2hlaWdodC5weCc6IDIwLFxuICAgICd3aWR0aC5weCc6IDIwLFxuICB9O1xuXG4gIHByaXZhdGUgbW91c2VEb3duJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgcHJpdmF0ZSBtb3VzZU1vdmUkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIG1vdXNlVXAkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIGRyYWckOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIGRyYWdTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0TWFwQ29udGFpbmVyKCkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JEcmFnZ2luZygpO1xuICAgIH1cbiAgfVxuXG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmFsbG93RHJhZyAmJiBjaGFuZ2VzLmFsbG93RHJhZy5jdXJyZW50VmFsdWUgJiYgIWNoYW5nZXMuYWxsb3dEcmFnLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yRHJhZ2dpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5hbGxvd0RyYWcgJiYgIWNoYW5nZXMuYWxsb3dEcmFnLmN1cnJlbnRWYWx1ZSAmJiBjaGFuZ2VzLmFsbG93RHJhZy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kcmFnU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckRyYWdnaW5nKCkge1xuICAgIHRoaXMubW91c2VEb3duJCA9IHRoaXMubW91c2VEb3duJCB8fCBvYnNlcnZhYmxlRnJvbUV2ZW50KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJyk7XG4gICAgdGhpcy5tb3VzZU1vdmUkID0gdGhpcy5tb3VzZU1vdmUkIHx8IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZW1vdmUnKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHRoaXMubW91c2VVcCQgPSB0aGlzLm1vdXNlVXAkIHx8IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcblxuICAgIHRoaXMuZHJhZyQgPSB0aGlzLmRyYWckIHx8XG4gICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duJC5waXBlKFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5tb3VzZU1vdmUkLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgdGFwKHRoaXMub25EcmFnLmVtaXQpLFxuICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLm1vdXNlVXAkKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICApO1xuXG4gICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uID0gdGhpcy5kcmFnJC5zdWJzY3JpYmUoKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7ZXZlbnQueH1weGA7XG4gICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBgJHtldmVudC55fXB4YDtcbiAgICB9KTtcbiAgfVxufVxuIl19