import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { AcHtmlDirective } from '../../directives/ac-html/ac-html.directive';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
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
AcHtmlDescComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-html-desc',
                providers: [AcHtmlManager],
                template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
            },] }
];
AcHtmlDescComponent.ctorParameters = () => [
    { type: HtmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcHtmlDescComponent.propDecorators = {
    acHtmlCreator: [{ type: ViewChild, args: [AcHtmlDirective, { static: true },] }],
    acHtmlTemplate: [{ type: ContentChild, args: [TemplateRef, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1odG1sLWRlc2MvYWMtaHRtbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUV2Rjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBWUgsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFNBQVM7SUFLaEQsWUFBWSxVQUE2QixFQUFFLFlBQTBCLEVBQ3pELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxRQUFRO1FBQ04sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsT0FBWSxFQUFFLEVBQU87UUFDeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDL0M7YUFBTTtZQUNMLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7WUEzREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7O2FBTUM7YUFDWjs7O1lBcENRLGlCQUFpQjtZQUhqQixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGdCQUFnQjs7OzRCQXdDdEIsU0FBUyxTQUFDLGVBQWUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7NkJBQ3pDLFlBQVksU0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgSHRtbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2h0bWwtZHJhd2VyL2h0bWwtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNIdG1sRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9hYy1odG1sL2FjLWh0bWwuZGlyZWN0aXZlJztcbmltcG9ydCB7IEFjSHRtbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGFuIGh0bWwgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGFjLWh0bWwgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICA8YnI+XG4gKiAgW3Byb3BzXSBhY2NlcHRzIHBvc2l0aW9uKENhcnRlc2lhbjMpIGFuZCBzaG93KGJvb2xlYW4pLlxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLWxheWVyIGFjRm9yPVwibGV0IGh0bWwgb2YgaHRtbHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxuIDxhYy1odG1sLWRlc2MgcHJvcHM9XCJ7cG9zaXRpb246IGh0bWwucG9zaXRpb24sIHNob3c6IGh0bWwuc2hvd31cIj5cbiA8bmctdGVtcGxhdGUgbGV0LWh0bWw+XG4gPGRpdj5cbiA8aDE+VGhpcyBpcyBhYy1odG1sIHt7aHRtbC5uYW1lfX08L2gxPlxuIDxidXR0b24gKGNsaWNrKT1cImNoYW5nZVRleHQoaHRtbCwgJ1Rlc3QnKVwiPmNoYW5nZSB0ZXh0PC9idXR0b24+XG4gPC9kaXY+XG4gPC9uZy10ZW1wbGF0ZT5cbiA8L2FjLWh0bWwtZGVzYz5cbiAqICA8YWMtaHRtbCBbcHJvcHNdPVwie3Bvc2l0aW9uOiBwb3NpdGlvbiwgc2hvdzogdHJ1ZX1cIj47XG4gKiAgICA8cD5odG1sIGVsZW1lbnQ8L3A+XG4gKiAgPC9hYy1odG1sPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1odG1sLWRlc2MnLFxuICBwcm92aWRlcnM6IFtBY0h0bWxNYW5hZ2VyXSxcbiAgdGVtcGxhdGU6IGBcbiAgICAgIDxkaXYgKmFjSHRtbD1cImxldCBhY0h0bWxFbnRpdHlJZCA9IGlkOyBsZXQgYWNIdG1sQ29udGV4dCA9IGNvbnRleHRcIj5cbiAgICAgICAgICA8ZGl2IFthY0h0bWxDb250YWluZXJdPVwiYWNIdG1sRW50aXR5SWRcIj5cbiAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImFjSHRtbFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJhY0h0bWxDb250ZXh0XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmBcbn0pXG5leHBvcnQgY2xhc3MgQWNIdG1sRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQFZpZXdDaGlsZChBY0h0bWxEaXJlY3RpdmUsIHtzdGF0aWM6IHRydWV9KSBhY0h0bWxDcmVhdG9yOiBBY0h0bWxEaXJlY3RpdmU7XG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSBhY0h0bWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3RvcihodG1sRHJhd2VyOiBIdG1sRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcbiAgICBzdXBlcihodG1sRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIGlmICghdGhpcy5hY0h0bWxDcmVhdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBkZXNjIEVSUk9SOiBhYyBodG1sIGRpcmVjdGl2ZSBub3QgZm91bmQuYCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmFjSHRtbFRlbXBsYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjSHRtbCBkZXNjIEVSUk9SOiBodG1sIHRlbXBsYXRlIG5vdCBmb3VuZC5gKTtcbiAgICB9XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IGFueSk6IGFueSB7XG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSB0aGlzLl9wcm9wc0V2YWx1YXRvcihjb250ZXh0KTtcbiAgICBpZiAoIXRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuaGFzKGlkKSkge1xuICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZChjZXNpdW1Qcm9wcyk7XG4gICAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLnNldChpZCwgcHJpbWl0aXZlKTtcbiAgICAgIHRoaXMuYWNIdG1sQ3JlYXRvci5hZGRPclVwZGF0ZShpZCwgcHJpbWl0aXZlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgICAgdGhpcy5fZHJhd2VyLnVwZGF0ZShwcmltaXRpdmUsIGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMuYWNIdG1sQ3JlYXRvci5hZGRPclVwZGF0ZShpZCwgcHJpbWl0aXZlKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuZ2V0KGlkKTtcbiAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlKHByaW1pdGl2ZSk7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5kZWxldGUoaWQpO1xuICAgIHRoaXMuYWNIdG1sQ3JlYXRvci5yZW1vdmUoaWQsIHByaW1pdGl2ZSk7XG4gIH1cblxuICByZW1vdmVBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5mb3JFYWNoKCgocHJpbWl0aXZlLCBpZCkgPT4ge1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLnJlbW92ZShpZCwgcHJpbWl0aXZlKTtcbiAgICB9KSk7XG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5jbGVhcigpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmVBbGwoKTtcbiAgfVxufVxuIl19