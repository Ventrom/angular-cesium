import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
export class AcHtmlContext {
    constructor(id, context) {
        this.id = id;
        this.context = context;
    }
}
let AcHtmlDirective = class AcHtmlDirective {
    constructor(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    ngOnInit() {
    }
    _handleView(id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            const context = new AcHtmlContext(id, { $implicit: entity });
            const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef, context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    }
    addOrUpdate(id, primitive) {
        const context = this._layerService.context;
        const entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity, primitive });
        this._handleView(id, primitive, entity);
    }
    remove(id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        const { viewRef } = this._views.get(id);
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    }
};
AcHtmlDirective.ctorParameters = () => [
    { type: TemplateRef },
    { type: ViewContainerRef },
    { type: ChangeDetectorRef },
    { type: LayerService },
    { type: AcHtmlManager }
];
AcHtmlDirective = __decorate([
    Directive({
        selector: '[acHtml]',
    }),
    __metadata("design:paramtypes", [TemplateRef,
        ViewContainerRef,
        ChangeDetectorRef,
        LayerService,
        AcHtmlManager])
], AcHtmlDirective);
export { AcHtmlDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwvYWMtaHRtbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBRXZGLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQ1MsRUFBTyxFQUNQLE9BQVk7UUFEWixPQUFFLEdBQUYsRUFBRSxDQUFLO1FBQ1AsWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUVyQixDQUFDO0NBQ0Y7QUFLRCxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBSTFCLFlBQ1UsWUFBd0MsRUFDeEMsaUJBQW1DLEVBQ25DLGVBQWtDLEVBQ2xDLGFBQTJCLEVBQzNCLGNBQTZCO1FBSjdCLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQVAvQixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUFTaEUsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDO0lBRU8sV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RDO2FBQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFPLEVBQUUsU0FBYztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7Q0FDRixDQUFBOztZQTlDeUIsV0FBVztZQUNOLGdCQUFnQjtZQUNsQixpQkFBaUI7WUFDbkIsWUFBWTtZQUNYLGFBQWE7O0FBVDVCLGVBQWU7SUFIM0IsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFVBQVU7S0FDckIsQ0FBQztxQ0FNd0IsV0FBVztRQUNOLGdCQUFnQjtRQUNsQixpQkFBaUI7UUFDbkIsWUFBWTtRQUNYLGFBQWE7R0FUNUIsZUFBZSxDQW1EM0I7U0FuRFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFjSHRtbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5leHBvcnQgY2xhc3MgQWNIdG1sQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBpZDogYW55LFxuICAgIHB1YmxpYyBjb250ZXh0OiBhbnlcbiAgKSB7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2FjSHRtbF0nLFxufSlcbmV4cG9ydCBjbGFzcyBBY0h0bWxEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByaXZhdGUgX3ZpZXdzID0gbmV3IE1hcDxhbnksIHsgdmlld1JlZjogYW55LCBjb250ZXh0OiBhbnkgfT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF90ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8QWNIdG1sQ29udGV4dD4sXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfYWNIdG1sTWFuYWdlcjogQWNIdG1sTWFuYWdlclxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gIH1cblxuICBwcml2YXRlIF9oYW5kbGVWaWV3KGlkOiBhbnksIHByaW1pdGl2ZTogYW55LCBlbnRpdHk6IGFueSkge1xuICAgIGlmICghdGhpcy5fdmlld3MuaGFzKGlkKSAmJiBwcmltaXRpdmUuc2hvdykge1xuICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBBY0h0bWxDb250ZXh0KGlkLCB7JGltcGxpY2l0OiBlbnRpdHl9KTtcbiAgICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLl90ZW1wbGF0ZVJlZiwgY29udGV4dCk7XG4gICAgICB0aGlzLl92aWV3cy5zZXQoaWQsIHt2aWV3UmVmLCBjb250ZXh0fSk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSAgZWxzZSBpZiAodGhpcy5fdmlld3MuaGFzKGlkKSAmJiBwcmltaXRpdmUuc2hvdykge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIGFkZE9yVXBkYXRlKGlkOiBhbnksIHByaW1pdGl2ZTogYW55KSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2xheWVyU2VydmljZS5jb250ZXh0O1xuICAgIGNvbnN0IGVudGl0eSA9IGNvbnRleHRbdGhpcy5fbGF5ZXJTZXJ2aWNlLmdldEVudGl0eU5hbWUoKV07XG5cbiAgICBpZiAodGhpcy5fdmlld3MuaGFzKGlkKSkge1xuICAgICAgdGhpcy5fdmlld3MuZ2V0KGlkKS5jb250ZXh0LmNvbnRleHQuJGltcGxpY2l0ID0gZW50aXR5O1xuICAgIH1cblxuICAgIHRoaXMuX2FjSHRtbE1hbmFnZXIuYWRkT3JVcGRhdGUoaWQsIHtlbnRpdHksIHByaW1pdGl2ZX0pO1xuICAgIHRoaXMuX2hhbmRsZVZpZXcoaWQsIHByaW1pdGl2ZSwgZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZShpZDogYW55LCBwcmltaXRpdmU6IGFueSkge1xuICAgIGlmICghdGhpcy5fdmlld3MuaGFzKGlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHt2aWV3UmVmfSA9IHRoaXMuX3ZpZXdzLmdldChpZCk7XG4gICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5yZW1vdmUodGhpcy5fdmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHZpZXdSZWYpKTtcbiAgICB0aGlzLl92aWV3cy5kZWxldGUoaWQpO1xuICAgIHRoaXMuX2FjSHRtbE1hbmFnZXIucmVtb3ZlKGlkKTtcbiAgICBwcmltaXRpdmUuZWxlbWVudCA9IG51bGw7XG4gIH1cbn1cbiJdfQ==