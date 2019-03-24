/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
var AcToolbarComponent = /** @class */ (function () {
    function AcToolbarComponent(element, cesiumService) {
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
    AcToolbarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            /** @type {?} */
            var mouseDown$ = observableFromEvent(this.element.nativeElement, 'mousedown');
            /** @type {?} */
            var mouseMove$_1 = observableFromEvent(document, 'mousemove');
            /** @type {?} */
            var mouseUp$_1 = observableFromEvent(document, 'mouseup');
            /** @type {?} */
            var drag$ = mouseDown$.pipe(switchMap((/**
             * @return {?}
             */
            function () { return mouseMove$_1.pipe(takeUntil(mouseUp$_1)); })));
            this.subscription = drag$.subscribe((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                _this.element.nativeElement.style.left = event.x + 'px';
                _this.element.nativeElement.style.top = event.y + 'px';
            }));
        }
    };
    /**
     * @return {?}
     */
    AcToolbarComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    AcToolbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-toolbar',
                    template: "\n        <div class=\"{{toolbarClass}}\">\n            <div *ngIf=\"allowDrag\">\n                <ac-toolbar-button>\n                    <ac-drag-icon></ac-drag-icon>\n                </ac-toolbar-button>\n            </div>\n\n            <ng-content></ng-content>\n        </div>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["\n        :host {\n            position: absolute;\n            top: 20px;\n            left: 20px;\n            width: 20px;\n            height: 20px;\n            z-index: 999;\n            -webkit-user-drag: none;\n        }\n    "]
                }] }
    ];
    /** @nocollapse */
    AcToolbarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CesiumService }
    ]; };
    AcToolbarComponent.propDecorators = {
        toolbarClass: [{ type: Input }],
        allowDrag: [{ type: Input }]
    };
    return AcToolbarComponent;
}());
export { AcToolbarComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2FjLXRvb2xiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJEQUEyRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBa0IxRjtJQXlDRSw0QkFBb0IsT0FBbUIsRUFBVSxhQUE0QjtRQUF6RCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFUN0UsY0FBUyxHQUFHLElBQUksQ0FBQztRQUVqQixjQUFTLEdBQUc7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQztJQUtGLENBQUM7Ozs7SUFFRCxxQ0FBUTs7O0lBQVI7UUFBQSxpQkFjQztRQWJDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEYsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFOztnQkFDWixVQUFVLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDOztnQkFDekUsWUFBVSxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7O2dCQUN2RCxVQUFRLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQzs7Z0JBRW5ELEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVM7OztZQUFDLGNBQU0sT0FBQSxZQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFRLENBQUMsQ0FBQyxFQUFwQyxDQUFvQyxFQUFDLENBQUM7WUFFcEYsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUzs7OztZQUFDLFVBQUMsS0FBaUI7Z0JBQ3BELEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZELEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDeEQsQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Ozs7SUFFRCx3Q0FBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNqQztJQUNILENBQUM7O2dCQWhFRixTQUFTLFNBQ1I7b0JBQ0UsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxvU0FVVDtvQkFZRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs2QkFYdEMsNE9BVVI7aUJBRUY7Ozs7Z0JBL0MwQyxVQUFVO2dCQUc5QyxhQUFhOzs7K0JBK0NuQixLQUFLOzRCQUVMLEtBQUs7O0lBa0NSLHlCQUFDO0NBQUEsQUFqRUQsSUFpRUM7U0FyQ1ksa0JBQWtCOzs7SUFDN0IsMENBQ3FCOztJQUNyQix1Q0FDaUI7O0lBRWpCLHVDQUdFOzs7OztJQUVGLDBDQUFtQzs7Ozs7SUFFdkIscUNBQTJCOzs7OztJQUFFLDJDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcblxuXG4vKipcbiAqIFRvb2xiYXIgd2lkZ2V0LCBhY3QgYXMgYSBjb250YWluZXIgZm9yIGFjLXRvb2xiYXItYnV0dG9uIGNvbXBvbmVudHNcbiAqIGFsbG93aW5nIGRyYWcgY29uZmlndXJhdGlvbiBhbmQgcGFzc2luZyBgdG9vbGJhckNsYXNzYCBhcyBhdHRyaWJ1dGVzXG4gKlxuICogVXNhZ2U6XG4gKiBgYGBcbiAqIDxhYy10b29sYmFyIFthbGxvd0RyYWddPVwidHJ1ZVwiPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2hvbWUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwiZ29Ib21lKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2V4cGxvcmUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwicmFuZ2VBbmRCZWFyaW5nKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDwvYWMtdG9vbGJhcj5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInt7dG9vbGJhckNsYXNzfX1cIj5cbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJhbGxvd0RyYWdcIj5cbiAgICAgICAgICAgICAgICA8YWMtdG9vbGJhci1idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxhYy1kcmFnLWljb24+PC9hYy1kcmFnLWljb24+XG4gICAgICAgICAgICAgICAgPC9hYy10b29sYmFyLWJ1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDIwcHg7XG4gICAgICAgICAgICBsZWZ0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB6LWluZGV4OiA5OTk7XG4gICAgICAgICAgICAtd2Via2l0LXVzZXItZHJhZzogbm9uZTtcbiAgICAgICAgfVxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNUb29sYmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICB0b29sYmFyQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgYWxsb3dEcmFnID0gdHJ1ZTtcblxuICBkcmFnU3R5bGUgPSB7XG4gICAgJ2hlaWdodC5weCc6IDIwLFxuICAgICd3aWR0aC5weCc6IDIwLFxuICB9O1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXAoKS5nZXRNYXBDb250YWluZXIoKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBjb25zdCBtb3VzZURvd24kID0gb2JzZXJ2YWJsZUZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicpO1xuICAgICAgY29uc3QgbW91c2VNb3ZlJCA9IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZW1vdmUnKTtcbiAgICAgIGNvbnN0IG1vdXNlVXAkID0gb2JzZXJ2YWJsZUZyb21FdmVudChkb2N1bWVudCwgJ21vdXNldXAnKTtcblxuICAgICAgY29uc3QgZHJhZyQgPSBtb3VzZURvd24kLnBpcGUoc3dpdGNoTWFwKCgpID0+IG1vdXNlTW92ZSQucGlwZSh0YWtlVW50aWwobW91c2VVcCQpKSkpO1xuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IGRyYWckLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggKyAncHgnO1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55ICsgJ3B4JztcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==