import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../../services/ac-html-manager/ac-html-manager.service";
export class AcHtmlContext {
    constructor(id, context) {
        this.id = id;
        this.context = context;
    }
}
export class AcHtmlDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i1.LayerService }, { token: i2.AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: AcHtmlDirective, selector: "[acHtml]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtml]',
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: i1.LayerService }, { type: i2.AcHtmlManager }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXFCLFNBQVMsRUFBeUMsTUFBTSxlQUFlLENBQUM7Ozs7QUFJcEcsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxFQUFPLEVBQ1AsT0FBWTtRQURaLE9BQUUsR0FBRixFQUFFLENBQUs7UUFDUCxZQUFPLEdBQVAsT0FBTyxDQUFLO0lBRXJCLENBQUM7Q0FDRjtBQUtELE1BQU0sT0FBTyxlQUFlO0lBSTFCLFlBQ1UsWUFBd0MsRUFDeEMsaUJBQW1DLEVBQ25DLGVBQWtDLEVBQ2xDLGFBQTJCLEVBQzNCLGNBQTZCO1FBSjdCLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQVAvQixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUFTaEUsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDO0lBRU8sV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLEVBQUUsRUFBRSxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkMsQ0FBQzthQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2xELElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkMsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsRUFBTyxFQUFFLFNBQWM7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDM0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUUzRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ3pELENBQUM7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFPLEVBQUUsU0FBYztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN6QixPQUFPO1FBQ1QsQ0FBQztRQUVELE1BQU0sRUFBQyxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDOzhHQWxEVSxlQUFlO2tHQUFmLGVBQWU7OzJGQUFmLGVBQWU7a0JBSDNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlkOiBhbnksXG4gICAgcHVibGljIGNvbnRleHQ6IGFueVxuICApIHtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWNIdG1sXScsXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJpdmF0ZSBfdmlld3MgPSBuZXcgTWFwPGFueSwgeyB2aWV3UmVmOiBhbnksIGNvbnRleHQ6IGFueSB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxBY0h0bWxDb250ZXh0PixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZVZpZXcoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnksIGVudGl0eTogYW55KSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFjSHRtbENvbnRleHQoaWQsIHskaW1wbGljaXQ6IGVudGl0eX0pO1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RlbXBsYXRlUmVmLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3ZpZXdzLnNldChpZCwge3ZpZXdSZWYsIGNvbnRleHR9KTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICB9ICBlbHNlIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkT3JVcGRhdGUoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnkpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fbGF5ZXJTZXJ2aWNlLmNvbnRleHQ7XG4gICAgY29uc3QgZW50aXR5ID0gY29udGV4dFt0aGlzLl9sYXllclNlcnZpY2UuZ2V0RW50aXR5TmFtZSgpXTtcblxuICAgIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpKSB7XG4gICAgICB0aGlzLl92aWV3cy5nZXQoaWQpLmNvbnRleHQuY29udGV4dC4kaW1wbGljaXQgPSBlbnRpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWNIdG1sTWFuYWdlci5hZGRPclVwZGF0ZShpZCwge2VudGl0eSwgcHJpbWl0aXZlfSk7XG4gICAgdGhpcy5faGFuZGxlVmlldyhpZCwgcHJpbWl0aXZlLCBlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlKGlkOiBhbnksIHByaW1pdGl2ZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge3ZpZXdSZWZ9ID0gdGhpcy5fdmlld3MuZ2V0KGlkKTtcbiAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLnJlbW92ZSh0aGlzLl92aWV3Q29udGFpbmVyUmVmLmluZGV4T2Yodmlld1JlZikpO1xuICAgIHRoaXMuX3ZpZXdzLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5fYWNIdG1sTWFuYWdlci5yZW1vdmUoaWQpO1xuICAgIHByaW1pdGl2ZS5lbGVtZW50ID0gbnVsbDtcbiAgfVxufVxuIl19