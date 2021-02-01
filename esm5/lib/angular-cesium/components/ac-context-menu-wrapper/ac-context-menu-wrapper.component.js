import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 *
 * usage:
 * ```typescript
 * // We want to open the context menu on mouse right click.
 * // Register to mouse right click with the MapEventsManager
 * this.mapEventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
 *    .subscribe(event => {
 *       const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition, true);
 *       if (!position) {
 *         return;
 *       }
 *       // Open the context menu on the position that was clicked and pass some data to MyCustomContextMenuComponent.
 *       this.contextMenuService.open(
 *         MyCustomContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
var AcContextMenuWrapperComponent = /** @class */ (function () {
    function AcContextMenuWrapperComponent(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    AcContextMenuWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe(function () { return _this.cd.detectChanges(); });
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe(function () {
                var componentFactory = _this.componentFactoryResolver.resolveComponentFactory(_this.contextMenuService.content);
                _this.viewContainerRef.clear();
                var componentRef = _this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.data = _this.contextMenuService.options.data;
                _this.cd.detectChanges();
            });
    };
    AcContextMenuWrapperComponent.prototype.ngOnDestroy = function () {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    };
    AcContextMenuWrapperComponent.ctorParameters = function () { return [
        { type: ContextMenuService },
        { type: ChangeDetectorRef },
        { type: ComponentFactoryResolver }
    ]; };
    __decorate([
        ViewChild('contextMenuContainer', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], AcContextMenuWrapperComponent.prototype, "viewContainerRef", void 0);
    AcContextMenuWrapperComponent = __decorate([
        Component({
            selector: 'ac-context-menu-wrapper',
            template: "\n    <ac-html *ngIf=\"contextMenuService.showContextMenu\" [props]=\"{position: contextMenuService.position}\">\n      <ng-template #contextMenuContainer></ng-template>\n    </ac-html>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [ContextMenuService,
            ChangeDetectorRef,
            ComponentFactoryResolver])
    ], AcContextMenuWrapperComponent);
    return AcContextMenuWrapperComponent;
}());
export { AcContextMenuWrapperComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY29udGV4dC1tZW51LXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsU0FBUyxFQUNULE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBSXRGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQVlIO0lBT0UsdUNBQW1CLGtCQUFzQyxFQUNyQyxFQUFxQixFQUNyQix3QkFBa0Q7UUFGbkQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNyQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO0lBQ3RFLENBQUM7SUFFRCxnREFBUSxHQUFSO1FBQUEsaUJBV0M7UUFWQyxJQUFJLENBQUMsNkJBQTZCO1lBQ2hDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQXZCLENBQXVCLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMsMkJBQTJCO1lBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN2QyxJQUFNLGdCQUFnQixHQUFHLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBYyxDQUFDLENBQUM7Z0JBQ3ZILEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDOUIsSUFBTSxZQUFZLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM1RSxZQUFZLENBQUMsUUFBNkIsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3hGLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsbURBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLDZCQUE2QixFQUFFO1lBQ3RDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNsRDtRQUVELElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ3BDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoRDtJQUNILENBQUM7O2dCQTFCc0Msa0JBQWtCO2dCQUNqQyxpQkFBaUI7Z0JBQ0ssd0JBQXdCOztJQUpQO1FBQTlELFNBQVMsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO2tDQUFtQixnQkFBZ0I7MkVBQUM7SUFMdkYsNkJBQTZCO1FBVnpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsUUFBUSxFQUFFLCtMQUlUO1lBRUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07U0FDaEQsQ0FBQzt5Q0FRdUMsa0JBQWtCO1lBQ2pDLGlCQUFpQjtZQUNLLHdCQUF3QjtPQVQzRCw2QkFBNkIsQ0FrQ3pDO0lBQUQsb0NBQUM7Q0FBQSxBQWxDRCxJQWtDQztTQWxDWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29udGV4dC1tZW51L2NvbnRleHQtbWVudS5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0TWVudSB9IGZyb20gJy4uLy4uL21vZGVscy9iYXNpYy1jb250ZXh0LW1lbnUnO1xuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgdG8gaW5qZWN0IHRoZSBjb21wb25lbnQgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIENvbnRleHRNZW51U2VydmljZSB3aGVuIG9wZW5pbmcgYSBjb250ZXh0IG1lbnUuXG4gKiBJdCBzaG91bGRuJ3QgYmUgdXNlZCBkaXJlY3RseS5cbiAqXG4gKiB1c2FnZTpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIFdlIHdhbnQgdG8gb3BlbiB0aGUgY29udGV4dCBtZW51IG9uIG1vdXNlIHJpZ2h0IGNsaWNrLlxuICogLy8gUmVnaXN0ZXIgdG8gbW91c2UgcmlnaHQgY2xpY2sgd2l0aCB0aGUgTWFwRXZlbnRzTWFuYWdlclxuICogdGhpcy5tYXBFdmVudHNNYW5hZ2VyLnJlZ2lzdGVyKHsgZXZlbnQ6IENlc2l1bUV2ZW50LlJJR0hUX0NMSUNLLCBwaWNrOiBQaWNrT3B0aW9ucy5OT19QSUNLIH0pXG4gKiAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAqICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhldmVudC5tb3ZlbWVudC5lbmRQb3NpdGlvbiwgdHJ1ZSk7XG4gKiAgICAgICBpZiAoIXBvc2l0aW9uKSB7XG4gKiAgICAgICAgIHJldHVybjtcbiAqICAgICAgIH1cbiAqICAgICAgIC8vIE9wZW4gdGhlIGNvbnRleHQgbWVudSBvbiB0aGUgcG9zaXRpb24gdGhhdCB3YXMgY2xpY2tlZCBhbmQgcGFzcyBzb21lIGRhdGEgdG8gTXlDdXN0b21Db250ZXh0TWVudUNvbXBvbmVudC5cbiAqICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oXG4gKiAgICAgICAgIE15Q3VzdG9tQ29udGV4dE1lbnVDb21wb25lbnQsXG4gKiAgICAgICAgIHBvc2l0aW9uLFxuICogICAgICAgICB7IGRhdGE6IHsgaXRlbXM6IFsnTmV3IFRyYWNrJywgJ0NoYW5nZSBNYXAnLCAnQ29udGV4dCBNZW51JywgJ0RvIFNvbWV0aGluZyddIH0gfVxuICogICAgICAgKVxuICogICAgfSk7XG4gKlxuICogYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtY29udGV4dC1tZW51LXdyYXBwZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhYy1odG1sICpuZ0lmPVwiY29udGV4dE1lbnVTZXJ2aWNlLnNob3dDb250ZXh0TWVudVwiIFtwcm9wc109XCJ7cG9zaXRpb246IGNvbnRleHRNZW51U2VydmljZS5wb3NpdGlvbn1cIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjY29udGV4dE1lbnVDb250YWluZXI+PC9uZy10ZW1wbGF0ZT5cbiAgICA8L2FjLWh0bWw+XG4gIGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBBY0NvbnRleHRNZW51V3JhcHBlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwcml2YXRlIGNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgY29udGV4dE1lbnVPcGVuU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQFZpZXdDaGlsZCgnY29udGV4dE1lbnVDb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uID1cbiAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmNvbnRleHRNZW51Q2hhbmdlTm90aWZpZXIuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpKTtcbiAgICB0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vbk9wZW4uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmNvbnRlbnQgYXMgYW55KTtcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIChjb21wb25lbnRSZWYuaW5zdGFuY2UgYXMgQmFzaWNDb250ZXh0TWVudSkuZGF0YSA9IHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wdGlvbnMuZGF0YTtcbiAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29udGV4dE1lbnVPcGVuU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19