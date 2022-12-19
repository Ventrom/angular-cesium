import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/context-menu/context-menu.service";
import * as i2 from "@angular/common";
import * as i3 from "../ac-html/ac-html.component";
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
export class AcContextMenuWrapperComponent {
    constructor(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ngOnInit() {
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe(() => this.cd.detectChanges());
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe(() => {
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.contextMenuService.content);
                this.viewContainerRef.clear();
                const componentRef = this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.data = this.contextMenuService.options.data;
                this.cd.detectChanges();
            });
    }
    ngOnDestroy() {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    }
}
AcContextMenuWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcContextMenuWrapperComponent, deps: [{ token: i1.ContextMenuService }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Component });
AcContextMenuWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcContextMenuWrapperComponent, selector: "ac-context-menu-wrapper", viewQueries: [{ propertyName: "viewContainerRef", first: true, predicate: ["contextMenuContainer"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcContextMenuWrapperComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-context-menu-wrapper', template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `, changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i1.ContextMenuService }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }]; }, propDecorators: { viewContainerRef: [{
                type: ViewChild,
                args: ['contextMenuContainer', { read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY29udGV4dC1tZW51LXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWNvbnRleHQtbWVudS13cmFwcGVyL2FjLWNvbnRleHQtbWVudS13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFJVCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDOzs7OztBQUt2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFZSCxNQUFNLE9BQU8sNkJBQTZCO0lBT3hDLFlBQW1CLGtCQUFzQyxFQUNyQyxFQUFxQixFQUNyQix3QkFBa0Q7UUFGbkQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNyQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO0lBQ3RFLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLDZCQUE2QjtZQUNoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMsMkJBQTJCO1lBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDNUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQWMsQ0FBQyxDQUFDO2dCQUN2SCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDNUUsWUFBWSxDQUFDLFFBQTZCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUN4RixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyw2QkFBNkIsRUFBRTtZQUN0QyxJQUFJLENBQUMsNkJBQTZCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEQ7UUFFRCxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEQ7SUFDSCxDQUFDOzsySEFqQ1UsNkJBQTZCOytHQUE3Qiw2QkFBNkIsb0tBS0csZ0JBQWdCLDZCQWJqRDs7OztHQUlUOzRGQUlVLDZCQUE2QjtrQkFWekMsU0FBUzsrQkFDRSx5QkFBeUIsWUFDekI7Ozs7R0FJVCxtQkFFZ0IsdUJBQXVCLENBQUMsTUFBTTtnTEFPZ0IsZ0JBQWdCO3NCQUE5RSxTQUFTO3VCQUFDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEJhc2ljQ29udGV4dE1lbnUgfSBmcm9tICcuLi8uLi9tb2RlbHMvYmFzaWMtY29udGV4dC1tZW51JztcblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIHRvIGluamVjdCB0aGUgY29tcG9uZW50IHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBDb250ZXh0TWVudVNlcnZpY2Ugd2hlbiBvcGVuaW5nIGEgY29udGV4dCBtZW51LlxuICogSXQgc2hvdWxkbid0IGJlIHVzZWQgZGlyZWN0bHkuXG4gKlxuICogdXNhZ2U6XG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBXZSB3YW50IHRvIG9wZW4gdGhlIGNvbnRleHQgbWVudSBvbiBtb3VzZSByaWdodCBjbGljay5cbiAqIC8vIFJlZ2lzdGVyIHRvIG1vdXNlIHJpZ2h0IGNsaWNrIHdpdGggdGhlIE1hcEV2ZW50c01hbmFnZXJcbiAqIHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7IGV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSywgcGljazogUGlja09wdGlvbnMuTk9fUElDSyB9KVxuICogICAgLnN1YnNjcmliZShldmVudCA9PiB7XG4gKiAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoZXZlbnQubW92ZW1lbnQuZW5kUG9zaXRpb24sIHRydWUpO1xuICogICAgICAgaWYgKCFwb3NpdGlvbikge1xuICogICAgICAgICByZXR1cm47XG4gKiAgICAgICB9XG4gKiAgICAgICAvLyBPcGVuIHRoZSBjb250ZXh0IG1lbnUgb24gdGhlIHBvc2l0aW9uIHRoYXQgd2FzIGNsaWNrZWQgYW5kIHBhc3Mgc29tZSBkYXRhIHRvIE15Q3VzdG9tQ29udGV4dE1lbnVDb21wb25lbnQuXG4gKiAgICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vcGVuKFxuICogICAgICAgICBNeUN1c3RvbUNvbnRleHRNZW51Q29tcG9uZW50LFxuICogICAgICAgICBwb3NpdGlvbixcbiAqICAgICAgICAgeyBkYXRhOiB7IGl0ZW1zOiBbJ05ldyBUcmFjaycsICdDaGFuZ2UgTWFwJywgJ0NvbnRleHQgTWVudScsICdEbyBTb21ldGhpbmcnXSB9IH1cbiAqICAgICAgIClcbiAqICAgIH0pO1xuICpcbiAqIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWNvbnRleHQtbWVudS13cmFwcGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YWMtaHRtbCAqbmdJZj1cImNvbnRleHRNZW51U2VydmljZS5zaG93Q29udGV4dE1lbnVcIiBbcHJvcHNdPVwie3Bvc2l0aW9uOiBjb250ZXh0TWVudVNlcnZpY2UucG9zaXRpb259XCI+XG4gICAgICA8bmctdGVtcGxhdGUgI2NvbnRleHRNZW51Q29udGFpbmVyPjwvbmctdGVtcGxhdGU+XG4gICAgPC9hYy1odG1sPlxuICBgLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQWNDb250ZXh0TWVudVdyYXBwZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBjb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRleHRNZW51Q29udGFpbmVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5jb250ZXh0TWVudUNoYW5nZU5vdGlmaWVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNkLmRldGVjdENoYW5nZXMoKSk7XG4gICAgdGhpcy5jb250ZXh0TWVudU9wZW5TdWJzY3JpcHRpb24gPVxuICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub25PcGVuLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0aGlzLmNvbnRleHRNZW51U2VydmljZS5jb250ZW50IGFzIGFueSk7XG4gICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICAoY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIEJhc2ljQ29udGV4dE1lbnUpLmRhdGEgPSB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vcHRpb25zLmRhdGE7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jb250ZXh0TWVudU9wZW5TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==