import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
var AcHtmlContext = /** @class */ (function () {
    function AcHtmlContext(id, context) {
        this.id = id;
        this.context = context;
    }
    return AcHtmlContext;
}());
export { AcHtmlContext };
var AcHtmlDirective = /** @class */ (function () {
    function AcHtmlDirective(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    AcHtmlDirective.prototype.ngOnInit = function () {
    };
    AcHtmlDirective.prototype._handleView = function (id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            var context = new AcHtmlContext(id, { $implicit: entity });
            var viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef: viewRef, context: context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    };
    AcHtmlDirective.prototype.addOrUpdate = function (id, primitive) {
        var context = this._layerService.context;
        var entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity: entity, primitive: primitive });
        this._handleView(id, primitive, entity);
    };
    AcHtmlDirective.prototype.remove = function (id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        var viewRef = this._views.get(id).viewRef;
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    };
    AcHtmlDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ChangeDetectorRef },
        { type: LayerService },
        { type: AcHtmlManager }
    ]; };
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
    return AcHtmlDirective;
}());
export { AcHtmlDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwvYWMtaHRtbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBRXZGO0lBQ0UsdUJBQ1MsRUFBTyxFQUNQLE9BQVk7UUFEWixPQUFFLEdBQUYsRUFBRSxDQUFLO1FBQ1AsWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUVyQixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQzs7QUFLRDtJQUlFLHlCQUNVLFlBQXdDLEVBQ3hDLGlCQUFtQyxFQUNuQyxlQUFrQyxFQUNsQyxhQUEyQixFQUMzQixjQUE2QjtRQUo3QixpQkFBWSxHQUFaLFlBQVksQ0FBNEI7UUFDeEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7UUFDbEMsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFQL0IsV0FBTSxHQUFHLElBQUksR0FBRyxFQUF1QyxDQUFDO0lBU2hFLENBQUM7SUFFRCxrQ0FBUSxHQUFSO0lBRUEsQ0FBQztJQUVPLHFDQUFXLEdBQW5CLFVBQW9CLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUMxQyxJQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QzthQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUNqRCxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVELHFDQUFXLEdBQVgsVUFBWSxFQUFPLEVBQUUsU0FBYztRQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUMzQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBRTNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUMsTUFBTSxRQUFBLEVBQUUsU0FBUyxXQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLEVBQU8sRUFBRSxTQUFjO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN4QixPQUFPO1NBQ1I7UUFFTSxJQUFBLHFDQUFPLENBQXdCO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7O2dCQTdDdUIsV0FBVztnQkFDTixnQkFBZ0I7Z0JBQ2xCLGlCQUFpQjtnQkFDbkIsWUFBWTtnQkFDWCxhQUFhOztJQVQ1QixlQUFlO1FBSDNCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUM7eUNBTXdCLFdBQVc7WUFDTixnQkFBZ0I7WUFDbEIsaUJBQWlCO1lBQ25CLFlBQVk7WUFDWCxhQUFhO09BVDVCLGVBQWUsQ0FtRDNCO0lBQUQsc0JBQUM7Q0FBQSxBQW5ERCxJQW1EQztTQW5EWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlkOiBhbnksXG4gICAgcHVibGljIGNvbnRleHQ6IGFueVxuICApIHtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWNIdG1sXScsXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJpdmF0ZSBfdmlld3MgPSBuZXcgTWFwPGFueSwgeyB2aWV3UmVmOiBhbnksIGNvbnRleHQ6IGFueSB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxBY0h0bWxDb250ZXh0PixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZVZpZXcoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnksIGVudGl0eTogYW55KSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFjSHRtbENvbnRleHQoaWQsIHskaW1wbGljaXQ6IGVudGl0eX0pO1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RlbXBsYXRlUmVmLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3ZpZXdzLnNldChpZCwge3ZpZXdSZWYsIGNvbnRleHR9KTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICB9ICBlbHNlIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkT3JVcGRhdGUoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnkpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fbGF5ZXJTZXJ2aWNlLmNvbnRleHQ7XG4gICAgY29uc3QgZW50aXR5ID0gY29udGV4dFt0aGlzLl9sYXllclNlcnZpY2UuZ2V0RW50aXR5TmFtZSgpXTtcblxuICAgIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpKSB7XG4gICAgICB0aGlzLl92aWV3cy5nZXQoaWQpLmNvbnRleHQuY29udGV4dC4kaW1wbGljaXQgPSBlbnRpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWNIdG1sTWFuYWdlci5hZGRPclVwZGF0ZShpZCwge2VudGl0eSwgcHJpbWl0aXZlfSk7XG4gICAgdGhpcy5faGFuZGxlVmlldyhpZCwgcHJpbWl0aXZlLCBlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlKGlkOiBhbnksIHByaW1pdGl2ZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3ZpZXdSZWZ9ID0gdGhpcy5fdmlld3MuZ2V0KGlkKTtcbiAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLnJlbW92ZSh0aGlzLl92aWV3Q29udGFpbmVyUmVmLmluZGV4T2Yodmlld1JlZikpO1xuICAgIHRoaXMuX3ZpZXdzLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5fYWNIdG1sTWFuYWdlci5yZW1vdmUoaWQpO1xuICAgIHByaW1pdGl2ZS5lbGVtZW50ID0gbnVsbDtcbiAgfVxufVxuIl19