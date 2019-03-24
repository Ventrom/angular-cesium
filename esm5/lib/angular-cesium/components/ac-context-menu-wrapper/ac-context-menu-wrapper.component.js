/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
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
 *       // Open the context menu on the position that was clicked and pass some data to ContextMenuComponent.
 *       this.contextMenuService.open(
 *         ContextMenuComponent,
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
    /**
     * @return {?}
     */
    AcContextMenuWrapperComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe((/**
             * @return {?}
             */
            function () { return _this.cd.detectChanges(); }));
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var componentFactory = _this.componentFactoryResolver.resolveComponentFactory((/** @type {?} */ (_this.contextMenuService.content)));
                _this.viewContainerRef.clear();
                /** @type {?} */
                var componentRef = _this.viewContainerRef.createComponent(componentFactory);
                ((/** @type {?} */ (componentRef.instance))).data = _this.contextMenuService.options.data;
                _this.cd.detectChanges();
            }));
    };
    /**
     * @return {?}
     */
    AcContextMenuWrapperComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    };
    AcContextMenuWrapperComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-context-menu-wrapper',
                    template: "\n    <ac-html *ngIf=\"contextMenuService.showContextMenu\" [props]=\"{position: contextMenuService.position}\">\n      <div #contextMenuContainer></div>\n    </ac-html>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    AcContextMenuWrapperComponent.ctorParameters = function () { return [
        { type: ContextMenuService },
        { type: ChangeDetectorRef },
        { type: ComponentFactoryResolver }
    ]; };
    AcContextMenuWrapperComponent.propDecorators = {
        viewContainerRef: [{ type: ViewChild, args: ['contextMenuContainer', { read: ViewContainerRef },] }]
    };
    return AcContextMenuWrapperComponent;
}());
export { AcContextMenuWrapperComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AcContextMenuWrapperComponent.prototype.contextMenuChangeSubscription;
    /**
     * @type {?}
     * @private
     */
    AcContextMenuWrapperComponent.prototype.contextMenuOpenSubscription;
    /** @type {?} */
    AcContextMenuWrapperComponent.prototype.viewContainerRef;
    /** @type {?} */
    AcContextMenuWrapperComponent.prototype.contextMenuService;
    /**
     * @type {?}
     * @private
     */
    AcContextMenuWrapperComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    AcContextMenuWrapperComponent.prototype.componentFactoryResolver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY29udGV4dC1tZW51LXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci9hYy1jb250ZXh0LW1lbnUtd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCx3QkFBd0IsRUFHeEIsU0FBUyxFQUNULGdCQUFnQixFQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCdEY7SUFpQkUsdUNBQW1CLGtCQUFzQyxFQUNyQyxFQUFxQixFQUNyQix3QkFBa0Q7UUFGbkQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNyQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO0lBQ3RFLENBQUM7Ozs7SUFFRCxnREFBUTs7O0lBQVI7UUFBQSxpQkFXQztRQVZDLElBQUksQ0FBQyw2QkFBNkI7WUFDaEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHlCQUF5QixDQUFDLFNBQVM7OztZQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxFQUF2QixDQUF1QixFQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLDJCQUEyQjtZQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFNBQVM7OztZQUFDOztvQkFDakMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLG1CQUFBLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQU8sQ0FBQztnQkFDdEgsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDOztvQkFDeEIsWUFBWSxHQUFHLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVFLENBQUMsbUJBQUEsWUFBWSxDQUFDLFFBQVEsRUFBb0IsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDeEYsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMxQixDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFRCxtREFBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyw2QkFBNkIsRUFBRTtZQUN0QyxJQUFJLENBQUMsNkJBQTZCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEQ7UUFFRCxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEQ7SUFDSCxDQUFDOztnQkEzQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx5QkFBeUI7b0JBQ25DLFFBQVEsRUFBRSwrS0FJVDtvQkFFRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7Ozs7Z0JBdENRLGtCQUFrQjtnQkFSekIsaUJBQWlCO2dCQUVqQix3QkFBd0I7OzttQ0FrRHZCLFNBQVMsU0FBQyxzQkFBc0IsRUFBRSxFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBQzs7SUE2QjdELG9DQUFDO0NBQUEsQUE1Q0QsSUE0Q0M7U0FsQ1ksNkJBQTZCOzs7Ozs7SUFFeEMsc0VBQW9EOzs7OztJQUNwRCxvRUFBa0Q7O0lBRWxELHlEQUFnRzs7SUFFcEYsMkRBQTZDOzs7OztJQUM3QywyQ0FBNkI7Ozs7O0lBQzdCLGlFQUEwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250ZXh0TWVudVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb250ZXh0LW1lbnUvY29udGV4dC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBCYXNpY0NvbnRleHRNZW51IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Jhc2ljLWNvbnRleHQtbWVudSc7XG5cbi8qKlxuICogVGhpcyBjb21wb25lbnQgaXMgdXNlZCB0byBpbmplY3QgdGhlIGNvbXBvbmVudCB0aGF0IGlzIHBhc3NlZCB0byB0aGUgQ29udGV4dE1lbnVTZXJ2aWNlIHdoZW4gb3BlbmluZyBhIGNvbnRleHQgbWVudS5cbiAqIEl0IHNob3VsZG4ndCBiZSB1c2VkIGRpcmVjdGx5LlxuICpcbiAqIHVzYWdlOlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gV2Ugd2FudCB0byBvcGVuIHRoZSBjb250ZXh0IG1lbnUgb24gbW91c2UgcmlnaHQgY2xpY2suXG4gKiAvLyBSZWdpc3RlciB0byBtb3VzZSByaWdodCBjbGljayB3aXRoIHRoZSBNYXBFdmVudHNNYW5hZ2VyXG4gKiB0aGlzLm1hcEV2ZW50c01hbmFnZXIucmVnaXN0ZXIoeyBldmVudDogQ2VzaXVtRXZlbnQuUklHSFRfQ0xJQ0ssIHBpY2s6IFBpY2tPcHRpb25zLk5PX1BJQ0sgfSlcbiAqICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICogICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGV2ZW50Lm1vdmVtZW50LmVuZFBvc2l0aW9uLCB0cnVlKTtcbiAqICAgICAgIGlmICghcG9zaXRpb24pIHtcbiAqICAgICAgICAgcmV0dXJuO1xuICogICAgICAgfVxuICogICAgICAgLy8gT3BlbiB0aGUgY29udGV4dCBtZW51IG9uIHRoZSBwb3NpdGlvbiB0aGF0IHdhcyBjbGlja2VkIGFuZCBwYXNzIHNvbWUgZGF0YSB0byBDb250ZXh0TWVudUNvbXBvbmVudC5cbiAqICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oXG4gKiAgICAgICAgIENvbnRleHRNZW51Q29tcG9uZW50LFxuICogICAgICAgICBwb3NpdGlvbixcbiAqICAgICAgICAgeyBkYXRhOiB7IGl0ZW1zOiBbJ05ldyBUcmFjaycsICdDaGFuZ2UgTWFwJywgJ0NvbnRleHQgTWVudScsICdEbyBTb21ldGhpbmcnXSB9IH1cbiAqICAgICAgIClcbiAqICAgIH0pO1xuICpcbiAqIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWNvbnRleHQtbWVudS13cmFwcGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YWMtaHRtbCAqbmdJZj1cImNvbnRleHRNZW51U2VydmljZS5zaG93Q29udGV4dE1lbnVcIiBbcHJvcHNdPVwie3Bvc2l0aW9uOiBjb250ZXh0TWVudVNlcnZpY2UucG9zaXRpb259XCI+XG4gICAgICA8ZGl2ICNjb250ZXh0TWVudUNvbnRhaW5lcj48L2Rpdj5cbiAgICA8L2FjLWh0bWw+XG4gIGAsXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBBY0NvbnRleHRNZW51V3JhcHBlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwcml2YXRlIGNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgY29udGV4dE1lbnVPcGVuU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQFZpZXdDaGlsZCgnY29udGV4dE1lbnVDb250YWluZXInLCB7cmVhZDogVmlld0NvbnRhaW5lclJlZn0pIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNkLmRldGVjdENoYW5nZXMoKSk7XG4gICAgdGhpcy5jb250ZXh0TWVudU9wZW5TdWJzY3JpcHRpb24gPVxuICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub25PcGVuLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0aGlzLmNvbnRleHRNZW51U2VydmljZS5jb250ZW50IGFzIGFueSk7XG4gICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICAoY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEJhc2ljQ29udGV4dE1lbnUpLmRhdGEgPSB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vcHRpb25zLmRhdGE7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jb250ZXh0TWVudU9wZW5TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==