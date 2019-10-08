/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
 * <ac-html-desc props="{position: html.position, show: html.show}">
 * <ng-template let-html>
 * <div>
 * <h1>This is ac-html {{html.name}}</h1>
 * <button (click)="changeText(html, 'Test')">change text</button>
 * </div>
 * </ng-template>
 * </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
export class AcHtmlDescComponent extends BasicDesc {
    /**
     * @param {?} htmlDrawer
     * @param {?} layerService
     * @param {?} computationCache
     * @param {?} cesiumProperties
     */
    constructor(htmlDrawer, layerService, computationCache, cesiumProperties) {
        super(htmlDrawer, layerService, computationCache, cesiumProperties);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        if (!this.acHtmlCreator) {
            throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
        }
        if (!this.acHtmlTemplate) {
            throw new Error(`AcHtml desc ERROR: html template not found.`);
        }
    }
    /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    draw(context, id) {
        /** @type {?} */
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            const primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            /** @type {?} */
            const primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumObjectsMap.forEach(((/**
         * @param {?} primitive
         * @param {?} id
         * @return {?}
         */
        (primitive, id) => {
            this.acHtmlCreator.remove(id, primitive);
        })));
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
            }] }
];
/** @nocollapse */
AcHtmlDescComponent.ctorParameters = () => [
    { type: HtmlDrawerService },
    { type: LayerService },
    { type: ComputationCache },
    { type: CesiumProperties }
];
AcHtmlDescComponent.propDecorators = {
    acHtmlCreator: [{ type: ViewChild, args: [AcHtmlDirective,] }],
    acHtmlTemplate: [{ type: ContentChild, args: [TemplateRef,] }]
};
if (false) {
    /** @type {?} */
    AcHtmlDescComponent.prototype.acHtmlCreator;
    /** @type {?} */
    AcHtmlDescComponent.prototype.acHtmlTemplate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtaHRtbC1kZXNjL2FjLWh0bWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFVLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DdkYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFNBQVM7Ozs7Ozs7SUFLaEQsWUFBWSxVQUE2QixFQUFFLFlBQTBCLEVBQ3pELGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7Ozs7OztJQUVELElBQUksQ0FBQyxPQUFZLEVBQUUsRUFBTzs7Y0FDbEIsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFOztrQkFDN0IsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUMvQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDL0M7YUFBTTs7a0JBQ0MsU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxFQUFVOztjQUNULFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7O0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7Ozs7O1FBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7WUEzREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7O2FBTUM7YUFDWjs7OztZQXBDUSxpQkFBaUI7WUFIakIsWUFBWTtZQUNaLGdCQUFnQjtZQUNoQixnQkFBZ0I7Ozs0QkF3Q3RCLFNBQVMsU0FBQyxlQUFlOzZCQUN6QixZQUFZLFNBQUMsV0FBVzs7OztJQUR6Qiw0Q0FBMkQ7O0lBQzNELDZDQUE0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjSHRtbERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBY0h0bWxNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWMtaHRtbC1tYW5hZ2VyL2FjLWh0bWwtbWFuYWdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBodG1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1odG1sIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgPGJyPlxuICogIFtwcm9wc10gYWNjZXB0cyBwb3NpdGlvbihDYXJ0ZXNpYW4zKSBhbmQgc2hvdyhib29sZWFuKS5cbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1sYXllciBhY0Zvcj1cImxldCBodG1sIG9mIGh0bWxzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiA8YWMtaHRtbC1kZXNjIHByb3BzPVwie3Bvc2l0aW9uOiBodG1sLnBvc2l0aW9uLCBzaG93OiBodG1sLnNob3d9XCI+XG4gPG5nLXRlbXBsYXRlIGxldC1odG1sPlxuIDxkaXY+XG4gPGgxPlRoaXMgaXMgYWMtaHRtbCB7e2h0bWwubmFtZX19PC9oMT5cbiA8YnV0dG9uIChjbGljayk9XCJjaGFuZ2VUZXh0KGh0bWwsICdUZXN0JylcIj5jaGFuZ2UgdGV4dDwvYnV0dG9uPlxuIDwvZGl2PlxuIDwvbmctdGVtcGxhdGU+XG4gPC9hYy1odG1sLWRlc2M+XG4gKiAgPGFjLWh0bWwgW3Byb3BzXT1cIntwb3NpdGlvbjogcG9zaXRpb24sIHNob3c6IHRydWV9XCI+O1xuICogICAgPHA+aHRtbCBlbGVtZW50PC9wPlxuICogIDwvYWMtaHRtbD5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtaHRtbC1kZXNjJyxcbiAgcHJvdmlkZXJzOiBbQWNIdG1sTWFuYWdlcl0sXG4gIHRlbXBsYXRlOiBgXG4gICAgICA8ZGl2ICphY0h0bWw9XCJsZXQgYWNIdG1sRW50aXR5SWQgPSBpZDsgbGV0IGFjSHRtbENvbnRleHQgPSBjb250ZXh0XCI+XG4gICAgICAgICAgPGRpdiBbYWNIdG1sQ29udGFpbmVyXT1cImFjSHRtbEVudGl0eUlkXCI+XG4gICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJhY0h0bWxUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiYWNIdG1sQ29udGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5gXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoQWNIdG1sRGlyZWN0aXZlKSBhY0h0bWxDcmVhdG9yOiBBY0h0bWxEaXJlY3RpdmU7XG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIGFjSHRtbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKGh0bWxEcmF3ZXI6IEh0bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGh0bWxEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLmFjSHRtbENyZWF0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGFjIGh0bWwgZGlyZWN0aXZlIG5vdCBmb3VuZC5gKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWNIdG1sVGVtcGxhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGh0bWwgdGVtcGxhdGUgbm90IGZvdW5kLmApO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogYW55KTogYW55IHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5hY0h0bWxDcmVhdG9yLnJlbW92ZShpZCwgcHJpbWl0aXZlKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmZvckVhY2goKChwcmltaXRpdmUsIGlkKSA9PiB7XG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0pKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xuICB9XG59XG4iXX0=