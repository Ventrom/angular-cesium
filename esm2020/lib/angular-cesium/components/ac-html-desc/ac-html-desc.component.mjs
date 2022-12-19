import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { AcHtmlDirective } from '../../directives/ac-html/ac-html.directive';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/html-drawer/html-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
import * as i5 from "@angular/common";
import * as i6 from "../../directives/ac-html/ac-html.directive";
import * as i7 from "../../directives/ac-html-container/ac-html-container.directive";
/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-layer element.
 *  <br>
 *  [props] accepts position(Cartesian3) and show(boolean).
 *
 *  __Usage:__
 *  ```
 *  <ac-layer acFor="let html of htmls$" [context]="this">
 <ac-html-desc props="{position: html.position, show: html.show}">
 <ng-template let-html>
 <div>
 <h1>This is ac-html {{html.name}}</h1>
 <button (click)="changeText(html, 'Test')">change text</button>
 </div>
 </ng-template>
 </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
export class AcHtmlDescComponent extends BasicDesc {
    constructor(htmlDrawer, layerService, computationCache, cesiumProperties) {
        super(htmlDrawer, layerService, computationCache, cesiumProperties);
    }
    ngOnInit() {
        super.ngOnInit();
        if (!this.acHtmlCreator) {
            throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
        }
        if (!this.acHtmlTemplate) {
            throw new Error(`AcHtml desc ERROR: html template not found.`);
        }
    }
    draw(context, id) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }
    remove(id) {
        const primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }
    removeAll() {
        this._cesiumObjectsMap.forEach(((primitive, id) => {
            this.acHtmlCreator.remove(id, primitive);
        }));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
}
AcHtmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlDescComponent, deps: [{ token: i1.HtmlDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcHtmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcHtmlDescComponent, selector: "ac-html-desc", providers: [AcHtmlManager], queries: [{ propertyName: "acHtmlTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "acHtmlCreator", first: true, predicate: AcHtmlDirective, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`, isInline: true, dependencies: [{ kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.AcHtmlDirective, selector: "[acHtml]" }, { kind: "directive", type: i7.AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: ["acHtmlContainer"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-html-desc',
                    providers: [AcHtmlManager],
                    template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
                }]
        }], ctorParameters: function () { return [{ type: i1.HtmlDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { acHtmlCreator: [{
                type: ViewChild,
                args: [AcHtmlDirective, { static: true }]
            }], acHtmlTemplate: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1odG1sLWRlc2MvYWMtaHRtbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUt6RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOzs7Ozs7Ozs7QUFFdkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQVlILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxTQUFTO0lBS2hELFlBQVksVUFBNkIsRUFBRSxZQUEwQixFQUN6RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDcEU7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQVksRUFBRSxFQUFPO1FBQ3hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQy9DO2FBQU07WUFDTCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQVU7UUFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7aUhBaERVLG1CQUFtQjtxR0FBbkIsbUJBQW1CLHVDQVRuQixDQUFDLGFBQWEsQ0FBQyxzRUFZWixXQUFXLDZHQURkLGVBQWUscUZBVmhCOzs7Ozs7YUFNQzs0RkFFQSxtQkFBbUI7a0JBWC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDMUIsUUFBUSxFQUFFOzs7Ozs7YUFNQztpQkFDWjtpTUFHNkMsYUFBYTtzQkFBeEQsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNDLGNBQWM7c0JBQXhELFlBQVk7dUJBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjSHRtbERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBY0h0bWxNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWMtaHRtbC1tYW5hZ2VyL2FjLWh0bWwtbWFuYWdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBodG1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1odG1sIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgPGJyPlxuICogIFtwcm9wc10gYWNjZXB0cyBwb3NpdGlvbihDYXJ0ZXNpYW4zKSBhbmQgc2hvdyhib29sZWFuKS5cbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1sYXllciBhY0Zvcj1cImxldCBodG1sIG9mIGh0bWxzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiA8YWMtaHRtbC1kZXNjIHByb3BzPVwie3Bvc2l0aW9uOiBodG1sLnBvc2l0aW9uLCBzaG93OiBodG1sLnNob3d9XCI+XG4gPG5nLXRlbXBsYXRlIGxldC1odG1sPlxuIDxkaXY+XG4gPGgxPlRoaXMgaXMgYWMtaHRtbCB7e2h0bWwubmFtZX19PC9oMT5cbiA8YnV0dG9uIChjbGljayk9XCJjaGFuZ2VUZXh0KGh0bWwsICdUZXN0JylcIj5jaGFuZ2UgdGV4dDwvYnV0dG9uPlxuIDwvZGl2PlxuIDwvbmctdGVtcGxhdGU+XG4gPC9hYy1odG1sLWRlc2M+XG4gKiAgPGFjLWh0bWwgW3Byb3BzXT1cIntwb3NpdGlvbjogcG9zaXRpb24sIHNob3c6IHRydWV9XCI+O1xuICogICAgPHA+aHRtbCBlbGVtZW50PC9wPlxuICogIDwvYWMtaHRtbD5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtaHRtbC1kZXNjJyxcbiAgcHJvdmlkZXJzOiBbQWNIdG1sTWFuYWdlcl0sXG4gIHRlbXBsYXRlOiBgXG4gICAgICA8ZGl2ICphY0h0bWw9XCJsZXQgYWNIdG1sRW50aXR5SWQgPSBpZDsgbGV0IGFjSHRtbENvbnRleHQgPSBjb250ZXh0XCI+XG4gICAgICAgICAgPGRpdiBbYWNIdG1sQ29udGFpbmVyXT1cImFjSHRtbEVudGl0eUlkXCI+XG4gICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJhY0h0bWxUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiYWNIdG1sQ29udGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5gXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoQWNIdG1sRGlyZWN0aXZlLCB7c3RhdGljOiB0cnVlfSkgYWNIdG1sQ3JlYXRvcjogQWNIdG1sRGlyZWN0aXZlO1xuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgYWNIdG1sVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IoaHRtbERyYXdlcjogSHRtbERyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoaHRtbERyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICBpZiAoIXRoaXMuYWNIdG1sQ3JlYXRvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY0h0bWwgZGVzYyBFUlJPUjogYWMgaHRtbCBkaXJlY3RpdmUgbm90IGZvdW5kLmApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5hY0h0bWxUZW1wbGF0ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY0h0bWwgZGVzYyBFUlJPUjogaHRtbCB0ZW1wbGF0ZSBub3QgZm91bmQuYCk7XG4gICAgfVxuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBhbnksIGlkOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGNlc2l1bVByb3BzID0gdGhpcy5fcHJvcHNFdmFsdWF0b3IoY29udGV4dCk7XG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX2RyYXdlci5hZGQoY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5zZXQoaWQsIHByaW1pdGl2ZSk7XG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IuYWRkT3JVcGRhdGUoaWQsIHByaW1pdGl2ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICAgIHRoaXMuX2RyYXdlci51cGRhdGUocHJpbWl0aXZlLCBjZXNpdW1Qcm9wcyk7XG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IuYWRkT3JVcGRhdGUoaWQsIHByaW1pdGl2ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZShwcmltaXRpdmUpO1xuICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZGVsZXRlKGlkKTtcbiAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCk6IHZvaWQge1xuICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZm9yRWFjaCgoKHByaW1pdGl2ZSwgaWQpID0+IHtcbiAgICAgIHRoaXMuYWNIdG1sQ3JlYXRvci5yZW1vdmUoaWQsIHByaW1pdGl2ZSk7XG4gICAgfSkpO1xuICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuY2xlYXIoKTtcbiAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlQWxsKCk7XG4gIH1cbn1cbiJdfQ==