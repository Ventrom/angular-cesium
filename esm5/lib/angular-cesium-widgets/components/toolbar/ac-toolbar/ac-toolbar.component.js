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
var AcToolbarComponent = /** @class */ (function () {
    function AcToolbarComponent(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.onDrag = new EventEmitter();
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    AcToolbarComponent.prototype.ngOnInit = function () {
        this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            this.listenForDragging();
        }
    };
    AcToolbarComponent.prototype.ngOnChanges = function (changes) {
        if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
            this.listenForDragging();
        }
        if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
            this.dragSubscription.unsubscribe();
        }
    };
    AcToolbarComponent.prototype.ngOnDestroy = function () {
        if (this.dragSubscription) {
            this.dragSubscription.unsubscribe();
        }
    };
    AcToolbarComponent.prototype.listenForDragging = function () {
        var _this = this;
        this.mouseDown$ = this.mouseDown$ || observableFromEvent(this.element.nativeElement, 'mousedown');
        this.mouseMove$ = this.mouseMove$ || observableFromEvent(document, 'mousemove');
        this.mouseUp$ = this.mouseUp$ || observableFromEvent(document, 'mouseup');
        this.drag$ = this.drag$ ||
            this.mouseDown$.pipe(switchMap(function () { return _this.mouseMove$.pipe(tap(_this.onDrag.emit), takeUntil(_this.mouseUp$)); }));
        this.dragSubscription = this.drag$.subscribe(function (event) {
            _this.element.nativeElement.style.left = event.x + "px";
            _this.element.nativeElement.style.top = event.y + "px";
        });
    };
    AcToolbarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: CesiumService }
    ]; };
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
            template: "\n        <div class=\"{{toolbarClass}}\">\n            <div *ngIf=\"allowDrag\">\n                <ac-toolbar-button>\n                    <ac-drag-icon></ac-drag-icon>\n                </ac-toolbar-button>\n            </div>\n\n            <ng-content></ng-content>\n        </div>\n    ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: ["\n        :host {\n            position: absolute;\n            top: 20px;\n            left: 20px;\n            width: 20px;\n            height: 20px;\n            z-index: 999;\n            -webkit-user-drag: none;\n        }\n    "]
        }),
        __metadata("design:paramtypes", [ElementRef, CesiumService])
    ], AcToolbarComponent);
    return AcToolbarComponent;
}());
export { AcToolbarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyL2FjLXRvb2xiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sU0FBUyxFQUNULGFBQWEsRUFDYixNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLElBQUksbUJBQW1CLEVBQTRCLE1BQU0sTUFBTSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUcxRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQTZCSDtJQW1CRSw0QkFBb0IsT0FBbUIsRUFBVSxhQUE0QjtRQUF6RCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFmN0UsY0FBUyxHQUFHLElBQUksQ0FBQztRQUVqQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUV4QyxjQUFTLEdBQUc7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQztJQVE4RSxDQUFDO0lBRWpGLHFDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RGLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFHRCx3Q0FBVyxHQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUU7WUFDM0YsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtZQUMzRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTyw4Q0FBaUIsR0FBekI7UUFBQSxpQkFpQkM7UUFoQkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUEyQixDQUFDO1FBQzFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUEyQixDQUFDO1FBRXBHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDakIsU0FBUyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDbEMsR0FBRyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQ3JCLFNBQVMsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCLEVBSGUsQ0FHZixDQUFDLENBQ0osQ0FBQztRQUVmLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEtBQWlCO1lBQzdELEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQU0sS0FBSyxDQUFDLENBQUMsT0FBSSxDQUFDO1lBQ3ZELEtBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQU0sS0FBSyxDQUFDLENBQUMsT0FBSSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBM0M0QixVQUFVO2dCQUF5QixhQUFhOztJQWpCN0U7UUFEQyxLQUFLLEVBQUU7OzREQUNhO0lBRXJCO1FBREMsS0FBSyxFQUFFOzt5REFDUztJQUVqQjtRQURDLE1BQU0sRUFBRTs7c0RBQytCO0lBTjdCLGtCQUFrQjtRQTVCOUIsU0FBUyxDQUNSO1lBQ0UsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLG9TQVVUO1lBWUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07cUJBWHRDLDRPQVVSO1NBRUYsQ0FDRjt5Q0FvQjhCLFVBQVUsRUFBeUIsYUFBYTtPQW5CbEUsa0JBQWtCLENBK0Q5QjtJQUFELHlCQUFDO0NBQUEsQUEvREQsSUErREM7U0EvRFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuXG5cbi8qKlxuICogVG9vbGJhciB3aWRnZXQsIGFjdCBhcyBhIGNvbnRhaW5lciBmb3IgYWMtdG9vbGJhci1idXR0b24gY29tcG9uZW50c1xuICogYWxsb3dpbmcgZHJhZyBjb25maWd1cmF0aW9uIGFuZCBwYXNzaW5nIGB0b29sYmFyQ2xhc3NgIGFzIGF0dHJpYnV0ZXNcbiAqXG4gKiBVc2FnZTpcbiAqIGBgYFxuICogPGFjLXRvb2xiYXIgW2FsbG93RHJhZ109XCJ0cnVlXCIgKG9uRHJhZyk9XCJoYW5kbGVEcmFnKCRldmVudClcIj5cbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9ob21lLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cImdvSG9tZSgpXCI+XG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9leHBsb3JlLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cInJhbmdlQW5kQmVhcmluZygpXCI+XG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cbiA8L2FjLXRvb2xiYXI+XG4gKiBgYGBcbiAqXG4gKi9cbkBDb21wb25lbnQoXG4gIHtcbiAgICBzZWxlY3RvcjogJ2FjLXRvb2xiYXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7e3Rvb2xiYXJDbGFzc319XCI+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiYWxsb3dEcmFnXCI+XG4gICAgICAgICAgICAgICAgPGFjLXRvb2xiYXItYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YWMtZHJhZy1pY29uPjwvYWMtZHJhZy1pY29uPlxuICAgICAgICAgICAgICAgIDwvYWMtdG9vbGJhci1idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgOmhvc3Qge1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAyMHB4O1xuICAgICAgICAgICAgbGVmdDogMjBweDtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5O1xuICAgICAgICAgICAgLXdlYmtpdC11c2VyLWRyYWc6IG5vbmU7XG4gICAgICAgIH1cbiAgICBgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgfVxuKVxuZXhwb3J0IGNsYXNzIEFjVG9vbGJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICB0b29sYmFyQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgYWxsb3dEcmFnID0gdHJ1ZTtcbiAgQE91dHB1dCgpXG4gIG9uRHJhZyA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcblxuICBkcmFnU3R5bGUgPSB7XG4gICAgJ2hlaWdodC5weCc6IDIwLFxuICAgICd3aWR0aC5weCc6IDIwLFxuICB9O1xuXG4gIHByaXZhdGUgbW91c2VEb3duJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgcHJpdmF0ZSBtb3VzZU1vdmUkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIG1vdXNlVXAkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIGRyYWckOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICBwcml2YXRlIGRyYWdTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0TWFwKCkuZ2V0TWFwQ29udGFpbmVyKCkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JEcmFnZ2luZygpO1xuICAgIH1cbiAgfVxuXG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmFsbG93RHJhZyAmJiBjaGFuZ2VzLmFsbG93RHJhZy5jdXJyZW50VmFsdWUgJiYgIWNoYW5nZXMuYWxsb3dEcmFnLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yRHJhZ2dpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5hbGxvd0RyYWcgJiYgIWNoYW5nZXMuYWxsb3dEcmFnLmN1cnJlbnRWYWx1ZSAmJiBjaGFuZ2VzLmFsbG93RHJhZy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kcmFnU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckRyYWdnaW5nKCkge1xuICAgIHRoaXMubW91c2VEb3duJCA9IHRoaXMubW91c2VEb3duJCB8fCBvYnNlcnZhYmxlRnJvbUV2ZW50KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJyk7XG4gICAgdGhpcy5tb3VzZU1vdmUkID0gdGhpcy5tb3VzZU1vdmUkIHx8IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZW1vdmUnKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuICAgIHRoaXMubW91c2VVcCQgPSB0aGlzLm1vdXNlVXAkIHx8IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcblxuICAgIHRoaXMuZHJhZyQgPSB0aGlzLmRyYWckIHx8XG4gICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duJC5waXBlKFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5tb3VzZU1vdmUkLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgdGFwKHRoaXMub25EcmFnLmVtaXQpLFxuICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLm1vdXNlVXAkKVxuICAgICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgICApO1xuXG4gICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uID0gdGhpcy5kcmFnJC5zdWJzY3JpYmUoKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7ZXZlbnQueH1weGA7XG4gICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBgJHtldmVudC55fXB4YDtcbiAgICB9KTtcbiAgfVxufVxuIl19