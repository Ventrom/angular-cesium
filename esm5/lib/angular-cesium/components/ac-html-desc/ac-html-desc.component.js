/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var AcHtmlDescComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcHtmlDescComponent, _super);
    function AcHtmlDescComponent(htmlDrawer, layerService, computationCache, cesiumProperties) {
        return _super.call(this, htmlDrawer, layerService, computationCache, cesiumProperties) || this;
    }
    /**
     * @return {?}
     */
    AcHtmlDescComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        _super.prototype.ngOnInit.call(this);
        if (!this.acHtmlCreator) {
            throw new Error("AcHtml desc ERROR: ac html directive not found.");
        }
        if (!this.acHtmlTemplate) {
            throw new Error("AcHtml desc ERROR: html template not found.");
        }
    };
    /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    AcHtmlDescComponent.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @return {?}
     */
    function (context, id) {
        /** @type {?} */
        var cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            /** @type {?} */
            var primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            /** @type {?} */
            var primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcHtmlDescComponent.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    };
    /**
     * @return {?}
     */
    AcHtmlDescComponent.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._cesiumObjectsMap.forEach(((/**
         * @param {?} primitive
         * @param {?} id
         * @return {?}
         */
        function (primitive, id) {
            _this.acHtmlCreator.remove(id, primitive);
        })));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    };
    AcHtmlDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-html-desc',
                    providers: [AcHtmlManager],
                    template: "\n      <div *acHtml=\"let acHtmlEntityId = id; let acHtmlContext = context\">\n          <div [acHtmlContainer]=\"acHtmlEntityId\">\n              <ng-template [ngTemplateOutlet]=\"acHtmlTemplate\"\n                           [ngTemplateOutletContext]=\"acHtmlContext\"></ng-template>\n          </div>\n      </div>"
                }] }
    ];
    /** @nocollapse */
    AcHtmlDescComponent.ctorParameters = function () { return [
        { type: HtmlDrawerService },
        { type: LayerService },
        { type: ComputationCache },
        { type: CesiumProperties }
    ]; };
    AcHtmlDescComponent.propDecorators = {
        acHtmlCreator: [{ type: ViewChild, args: [AcHtmlDirective,] }],
        acHtmlTemplate: [{ type: ContentChild, args: [TemplateRef,] }]
    };
    return AcHtmlDescComponent;
}(BasicDesc));
export { AcHtmlDescComponent };
if (false) {
    /** @type {?} */
    AcHtmlDescComponent.prototype.acHtmlCreator;
    /** @type {?} */
    AcHtmlDescComponent.prototype.acHtmlTemplate;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtaHRtbC1kZXNjL2FjLWh0bWwtZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDOUYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDM0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3REFBd0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QnZGO0lBV3lDLCtDQUFTO0lBS2hELDZCQUFZLFVBQTZCLEVBQUUsWUFBMEIsRUFDekQsZ0JBQWtDLEVBQUUsZ0JBQWtDO2VBQ2hGLGtCQUFNLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7SUFDckUsQ0FBQzs7OztJQUVELHNDQUFROzs7SUFBUjtRQUNFLGlCQUFNLFFBQVEsV0FBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7Ozs7OztJQUVELGtDQUFJOzs7OztJQUFKLFVBQUssT0FBWSxFQUFFLEVBQU87O1lBQ2xCLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTs7Z0JBQzdCLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQy9DO2FBQU07O2dCQUNDLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxvQ0FBTTs7OztJQUFOLFVBQU8sRUFBVTs7WUFDVCxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7OztJQUVELHVDQUFTOzs7SUFBVDtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQzs7Ozs7UUFBQyxVQUFDLFNBQVMsRUFBRSxFQUFFO1lBQzVDLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Z0JBM0RGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUMxQixRQUFRLEVBQUUsK1RBTUM7aUJBQ1o7Ozs7Z0JBcENRLGlCQUFpQjtnQkFIakIsWUFBWTtnQkFDWixnQkFBZ0I7Z0JBQ2hCLGdCQUFnQjs7O2dDQXdDdEIsU0FBUyxTQUFDLGVBQWU7aUNBQ3pCLFlBQVksU0FBQyxXQUFXOztJQThDM0IsMEJBQUM7Q0FBQSxBQTVERCxDQVd5QyxTQUFTLEdBaURqRDtTQWpEWSxtQkFBbUI7OztJQUU5Qiw0Q0FBMkQ7O0lBQzNELDZDQUE0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IEFjSHRtbERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBY0h0bWxNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWMtaHRtbC1tYW5hZ2VyL2FjLWh0bWwtbWFuYWdlci5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBhbiBodG1sIGltcGxlbWVudGF0aW9uLlxuICogIFRoZSBhYy1odG1sIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgPGJyPlxuICogIFtwcm9wc10gYWNjZXB0cyBwb3NpdGlvbihDYXJ0ZXNpYW4zKSBhbmQgc2hvdyhib29sZWFuKS5cbiAqXG4gKiAgX19Vc2FnZTpfX1xuICogIGBgYFxuICogIDxhYy1sYXllciBhY0Zvcj1cImxldCBodG1sIG9mIGh0bWxzJFwiIFtjb250ZXh0XT1cInRoaXNcIj5cbiA8YWMtaHRtbC1kZXNjIHByb3BzPVwie3Bvc2l0aW9uOiBodG1sLnBvc2l0aW9uLCBzaG93OiBodG1sLnNob3d9XCI+XG4gPG5nLXRlbXBsYXRlIGxldC1odG1sPlxuIDxkaXY+XG4gPGgxPlRoaXMgaXMgYWMtaHRtbCB7e2h0bWwubmFtZX19PC9oMT5cbiA8YnV0dG9uIChjbGljayk9XCJjaGFuZ2VUZXh0KGh0bWwsICdUZXN0JylcIj5jaGFuZ2UgdGV4dDwvYnV0dG9uPlxuIDwvZGl2PlxuIDwvbmctdGVtcGxhdGU+XG4gPC9hYy1odG1sLWRlc2M+XG4gKiAgPGFjLWh0bWwgW3Byb3BzXT1cIntwb3NpdGlvbjogcG9zaXRpb24sIHNob3c6IHRydWV9XCI+O1xuICogICAgPHA+aHRtbCBlbGVtZW50PC9wPlxuICogIDwvYWMtaHRtbD5cbiAqICBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtaHRtbC1kZXNjJyxcbiAgcHJvdmlkZXJzOiBbQWNIdG1sTWFuYWdlcl0sXG4gIHRlbXBsYXRlOiBgXG4gICAgICA8ZGl2ICphY0h0bWw9XCJsZXQgYWNIdG1sRW50aXR5SWQgPSBpZDsgbGV0IGFjSHRtbENvbnRleHQgPSBjb250ZXh0XCI+XG4gICAgICAgICAgPGRpdiBbYWNIdG1sQ29udGFpbmVyXT1cImFjSHRtbEVudGl0eUlkXCI+XG4gICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJhY0h0bWxUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiYWNIdG1sQ29udGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5gXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoQWNIdG1sRGlyZWN0aXZlKSBhY0h0bWxDcmVhdG9yOiBBY0h0bWxEaXJlY3RpdmU7XG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIGFjSHRtbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKGh0bWxEcmF3ZXI6IEh0bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xuICAgIHN1cGVyKGh0bWxEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLmFjSHRtbENyZWF0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGFjIGh0bWwgZGlyZWN0aXZlIG5vdCBmb3VuZC5gKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuYWNIdG1sVGVtcGxhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGh0bWwgdGVtcGxhdGUgbm90IGZvdW5kLmApO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogYW55KTogYW55IHtcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKGNlc2l1bVByb3BzKTtcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XG4gICAgICB0aGlzLl9kcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgY2VzaXVtUHJvcHMpO1xuICAgICAgdGhpcy5hY0h0bWxDcmVhdG9yLmFkZE9yVXBkYXRlKGlkLCBwcmltaXRpdmUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xuICAgIHRoaXMuX2RyYXdlci5yZW1vdmUocHJpbWl0aXZlKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5hY0h0bWxDcmVhdG9yLnJlbW92ZShpZCwgcHJpbWl0aXZlKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmZvckVhY2goKChwcmltaXRpdmUsIGlkKSA9PiB7XG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xuICAgIH0pKTtcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmNsZWFyKCk7XG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xuICB9XG59XG4iXX0=