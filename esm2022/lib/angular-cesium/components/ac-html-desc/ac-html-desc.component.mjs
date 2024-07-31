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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlDescComponent, deps: [{ token: i1.HtmlDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcHtmlDescComponent, selector: "ac-html-desc", providers: [AcHtmlManager], queries: [{ propertyName: "acHtmlTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "acHtmlCreator", first: true, predicate: AcHtmlDirective, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`, isInline: true, dependencies: [{ kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.AcHtmlDirective, selector: "[acHtml]" }, { kind: "directive", type: i7.AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: ["acHtmlContainer"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlDescComponent, decorators: [{
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
        }], ctorParameters: () => [{ type: i1.HtmlDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }], propDecorators: { acHtmlCreator: [{
                type: ViewChild,
                args: [AcHtmlDirective, { static: true }]
            }], acHtmlTemplate: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1odG1sLWRlc2MvYWMtaHRtbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUt6RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOzs7Ozs7Ozs7QUFFdkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQVlILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxTQUFTO0lBS2hELFlBQVksVUFBNkIsRUFBRSxZQUEwQixFQUN6RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsT0FBWSxFQUFFLEVBQU87UUFDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFVO1FBQ2YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7OEdBaERVLG1CQUFtQjtrR0FBbkIsbUJBQW1CLHVDQVRuQixDQUFDLGFBQWEsQ0FBQyxzRUFZWixXQUFXLDZHQURkLGVBQWUscUZBVmhCOzs7Ozs7YUFNQzs7MkZBRUEsbUJBQW1CO2tCQVgvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQzFCLFFBQVEsRUFBRTs7Ozs7O2FBTUM7aUJBQ1o7K0tBRzZDLGFBQWE7c0JBQXhELFNBQVM7dUJBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDQyxjQUFjO3NCQUF4RCxZQUFZO3VCQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XG5pbXBvcnQgeyBIdG1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBY0h0bWxEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2FjLWh0bWwvYWMtaHRtbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYW4gaHRtbCBpbXBsZW1lbnRhdGlvbi5cbiAqICBUaGUgYWMtaHRtbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogIDxicj5cbiAqICBbcHJvcHNdIGFjY2VwdHMgcG9zaXRpb24oQ2FydGVzaWFuMykgYW5kIHNob3coYm9vbGVhbikuXG4gKlxuICogIF9fVXNhZ2U6X19cbiAqICBgYGBcbiAqICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgaHRtbCBvZiBodG1scyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XG4gPGFjLWh0bWwtZGVzYyBwcm9wcz1cIntwb3NpdGlvbjogaHRtbC5wb3NpdGlvbiwgc2hvdzogaHRtbC5zaG93fVwiPlxuIDxuZy10ZW1wbGF0ZSBsZXQtaHRtbD5cbiA8ZGl2PlxuIDxoMT5UaGlzIGlzIGFjLWh0bWwge3todG1sLm5hbWV9fTwvaDE+XG4gPGJ1dHRvbiAoY2xpY2spPVwiY2hhbmdlVGV4dChodG1sLCAnVGVzdCcpXCI+Y2hhbmdlIHRleHQ8L2J1dHRvbj5cbiA8L2Rpdj5cbiA8L25nLXRlbXBsYXRlPlxuIDwvYWMtaHRtbC1kZXNjPlxuICogIDxhYy1odG1sIFtwcm9wc109XCJ7cG9zaXRpb246IHBvc2l0aW9uLCBzaG93OiB0cnVlfVwiPjtcbiAqICAgIDxwPmh0bWwgZWxlbWVudDwvcD5cbiAqICA8L2FjLWh0bWw+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWh0bWwtZGVzYycsXG4gIHByb3ZpZGVyczogW0FjSHRtbE1hbmFnZXJdLFxuICB0ZW1wbGF0ZTogYFxuICAgICAgPGRpdiAqYWNIdG1sPVwibGV0IGFjSHRtbEVudGl0eUlkID0gaWQ7IGxldCBhY0h0bWxDb250ZXh0ID0gY29udGV4dFwiPlxuICAgICAgICAgIDxkaXYgW2FjSHRtbENvbnRhaW5lcl09XCJhY0h0bWxFbnRpdHlJZFwiPlxuICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiYWNIdG1sVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImFjSHRtbENvbnRleHRcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+YFxufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBAVmlld0NoaWxkKEFjSHRtbERpcmVjdGl2ZSwge3N0YXRpYzogdHJ1ZX0pIGFjSHRtbENyZWF0b3I6IEFjSHRtbERpcmVjdGl2ZTtcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIGFjSHRtbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKGh0bWxEcmF3ZXI6IEh0bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGh0bWxEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLmFjSHRtbENyZWF0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGFjIGh0bWwgZGlyZWN0aXZlIG5vdCBmb3VuZC5gKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWNIdG1sVGVtcGxhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGh0bWwgdGVtcGxhdGUgbm90IGZvdW5kLmApO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogYW55KTogYW55IHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5hY0h0bWxDcmVhdG9yLnJlbW92ZShpZCwgcHJpbWl0aXZlKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmZvckVhY2goKChwcmltaXRpdmUsIGlkKSA9PiB7XG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0pKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xuICB9XG59XG4iXX0=