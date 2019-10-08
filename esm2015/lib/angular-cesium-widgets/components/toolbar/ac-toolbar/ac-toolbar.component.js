/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 * <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 * </ac-toolbar-button>
 * <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 * </ac-toolbar-button>
 * </ac-toolbar>
 * ```
 *
 */
export class AcToolbarComponent {
    /**
     * @param {?} element
     * @param {?} cesiumService
     */
    constructor(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            /** @type {?} */
            const mouseDown$ = observableFromEvent(this.element.nativeElement, 'mousedown');
            /** @type {?} */
            const mouseMove$ = observableFromEvent(document, 'mousemove');
            /** @type {?} */
            const mouseUp$ = observableFromEvent(document, 'mouseup');
            /** @type {?} */
            const drag$ = mouseDown$.pipe(switchMap((/**
             * @return {?}
             */
            () => mouseMove$.pipe(takeUntil(mouseUp$)))));
            this.subscription = drag$.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this.element.nativeElement.style.left = event.x + 'px';
                this.element.nativeElement.style.top = event.y + 'px';
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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
            }] }
];
/** @nocollapse */
AcToolbarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: CesiumService }
];
AcToolbarComponent.propDecorators = {
    toolbarClass: [{ type: Input }],
    allowDrag: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    AcToolbarComponent.prototype.toolbarClass;
    /** @type {?} */
    AcToolbarComponent.prototype.allowDrag;
    /** @type {?} */
    AcToolbarComponent.prototype.dragStyle;
    /**
     * @type {?}
     * @private
     */
    AcToolbarComponent.prototype.subscription;
    /**
     * @type {?}
     * @private
     */
    AcToolbarComponent.prototype.element;
    /**
     * @type {?}
     * @private
     */
    AcToolbarComponent.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2FjLXRvb2xiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJEQUEyRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBOEMxRixNQUFNLE9BQU8sa0JBQWtCOzs7OztJQWE3QixZQUFvQixPQUFtQixFQUFVLGFBQTRCO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVQ3RSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRWpCLGNBQVMsR0FBRztZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBS0YsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RGLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTs7a0JBQ1osVUFBVSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQzs7a0JBQ3pFLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDOztrQkFDdkQsUUFBUSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7O2tCQUVuRCxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTOzs7WUFBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUzs7OztZQUFDLENBQUMsS0FBaUIsRUFBRSxFQUFFO2dCQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3hELENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQzs7O1lBaEVGLFNBQVMsU0FDUjtnQkFDRSxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFOzs7Ozs7Ozs7O0tBVVQ7Z0JBWUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07eUJBWHRDOzs7Ozs7Ozs7O0tBVVI7YUFFRjs7OztZQS9DMEMsVUFBVTtZQUc5QyxhQUFhOzs7MkJBK0NuQixLQUFLO3dCQUVMLEtBQUs7Ozs7SUFGTiwwQ0FDcUI7O0lBQ3JCLHVDQUNpQjs7SUFFakIsdUNBR0U7Ozs7O0lBRUYsMENBQW1DOzs7OztJQUV2QixxQ0FBMkI7Ozs7O0lBQUUsMkNBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQgYXMgb2JzZXJ2YWJsZUZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogVG9vbGJhciB3aWRnZXQsIGFjdCBhcyBhIGNvbnRhaW5lciBmb3IgYWMtdG9vbGJhci1idXR0b24gY29tcG9uZW50c1xuICogYWxsb3dpbmcgZHJhZyBjb25maWd1cmF0aW9uIGFuZCBwYXNzaW5nIGB0b29sYmFyQ2xhc3NgIGFzIGF0dHJpYnV0ZXNcbiAqXG4gKiBVc2FnZTpcbiAqIGBgYFxuICogPGFjLXRvb2xiYXIgW2FsbG93RHJhZ109XCJ0cnVlXCI+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvaG9tZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJnb0hvbWUoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvZXhwbG9yZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJyYW5nZUFuZEJlYXJpbmcoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPC9hYy10b29sYmFyPlxuICogYGBgXG4gKlxuICovXG5AQ29tcG9uZW50KFxuICB7XG4gICAgc2VsZWN0b3I6ICdhYy10b29sYmFyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IGNsYXNzPVwie3t0b29sYmFyQ2xhc3N9fVwiPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cImFsbG93RHJhZ1wiPlxuICAgICAgICAgICAgICAgIDxhYy10b29sYmFyLWJ1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGFjLWRyYWctaWNvbj48L2FjLWRyYWctaWNvbj5cbiAgICAgICAgICAgICAgICA8L2FjLXRvb2xiYXItYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIDpob3N0IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMjBweDtcbiAgICAgICAgICAgIGxlZnQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTtcbiAgICAgICAgICAgIC13ZWJraXQtdXNlci1kcmFnOiBub25lO1xuICAgICAgICB9XG4gICAgYF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIH1cbilcbmV4cG9ydCBjbGFzcyBBY1Rvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHRvb2xiYXJDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBhbGxvd0RyYWcgPSB0cnVlO1xuXG4gIGRyYWdTdHlsZSA9IHtcbiAgICAnaGVpZ2h0LnB4JzogMjAsXG4gICAgJ3dpZHRoLnB4JzogMjAsXG4gIH07XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldE1hcENvbnRhaW5lcigpLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIGNvbnN0IG1vdXNlRG93biQgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJyk7XG4gICAgICBjb25zdCBtb3VzZU1vdmUkID0gb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScpO1xuICAgICAgY29uc3QgbW91c2VVcCQgPSBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcpO1xuXG4gICAgICBjb25zdCBkcmFnJCA9IG1vdXNlRG93biQucGlwZShzd2l0Y2hNYXAoKCkgPT4gbW91c2VNb3ZlJC5waXBlKHRha2VVbnRpbChtb3VzZVVwJCkpKSk7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gZHJhZyQuc3Vic2NyaWJlKChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCArICdweCc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgKyAncHgnO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19