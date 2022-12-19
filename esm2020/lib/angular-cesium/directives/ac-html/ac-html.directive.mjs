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
}
AcHtmlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i1.LayerService }, { token: i2.AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive });
AcHtmlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: AcHtmlDirective, selector: "[acHtml]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcHtmlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtml]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: i1.LayerService }, { type: i2.AcHtmlManager }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXFCLFNBQVMsRUFBeUMsTUFBTSxlQUFlLENBQUM7Ozs7QUFJcEcsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxFQUFPLEVBQ1AsT0FBWTtRQURaLE9BQUUsR0FBRixFQUFFLENBQUs7UUFDUCxZQUFPLEdBQVAsT0FBTyxDQUFLO0lBRXJCLENBQUM7Q0FDRjtBQUtELE1BQU0sT0FBTyxlQUFlO0lBSTFCLFlBQ1UsWUFBd0MsRUFDeEMsaUJBQW1DLEVBQ25DLGVBQWtDLEVBQ2xDLGFBQTJCLEVBQzNCLGNBQTZCO1FBSjdCLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQVAvQixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUFTaEUsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDO0lBRU8sV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RDO2FBQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFPLEVBQUUsU0FBYztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7OzZHQWxEVSxlQUFlO2lHQUFmLGVBQWU7NEZBQWYsZUFBZTtrQkFIM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBBY0h0bWxNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYWMtaHRtbC1tYW5hZ2VyL2FjLWh0bWwtbWFuYWdlci5zZXJ2aWNlJztcblxuZXhwb3J0IGNsYXNzIEFjSHRtbENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgaWQ6IGFueSxcbiAgICBwdWJsaWMgY29udGV4dDogYW55XG4gICkge1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thY0h0bWxdJyxcbn0pXG5leHBvcnQgY2xhc3MgQWNIdG1sRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcml2YXRlIF92aWV3cyA9IG5ldyBNYXA8YW55LCB7IHZpZXdSZWY6IGFueSwgY29udGV4dDogYW55IH0+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPEFjSHRtbENvbnRleHQ+LFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2xheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2FjSHRtbE1hbmFnZXI6IEFjSHRtbE1hbmFnZXJcbiAgKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcblxuICB9XG5cbiAgcHJpdmF0ZSBfaGFuZGxlVmlldyhpZDogYW55LCBwcmltaXRpdmU6IGFueSwgZW50aXR5OiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuX3ZpZXdzLmhhcyhpZCkgJiYgcHJpbWl0aXZlLnNob3cpIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQWNIdG1sQ29udGV4dChpZCwgeyRpbXBsaWNpdDogZW50aXR5fSk7XG4gICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fdGVtcGxhdGVSZWYsIGNvbnRleHQpO1xuICAgICAgdGhpcy5fdmlld3Muc2V0KGlkLCB7dmlld1JlZiwgY29udGV4dH0pO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0gIGVsc2UgaWYgKHRoaXMuX3ZpZXdzLmhhcyhpZCkgJiYgcHJpbWl0aXZlLnNob3cpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBhZGRPclVwZGF0ZShpZDogYW55LCBwcmltaXRpdmU6IGFueSkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLl9sYXllclNlcnZpY2UuY29udGV4dDtcbiAgICBjb25zdCBlbnRpdHkgPSBjb250ZXh0W3RoaXMuX2xheWVyU2VydmljZS5nZXRFbnRpdHlOYW1lKCldO1xuXG4gICAgaWYgKHRoaXMuX3ZpZXdzLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuX3ZpZXdzLmdldChpZCkuY29udGV4dC5jb250ZXh0LiRpbXBsaWNpdCA9IGVudGl0eTtcbiAgICB9XG5cbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLmFkZE9yVXBkYXRlKGlkLCB7ZW50aXR5LCBwcmltaXRpdmV9KTtcbiAgICB0aGlzLl9oYW5kbGVWaWV3KGlkLCBwcmltaXRpdmUsIGVudGl0eSk7XG4gIH1cblxuICByZW1vdmUoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuX3ZpZXdzLmhhcyhpZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7dmlld1JlZn0gPSB0aGlzLl92aWV3cy5nZXQoaWQpO1xuICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYucmVtb3ZlKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih2aWV3UmVmKSk7XG4gICAgdGhpcy5fdmlld3MuZGVsZXRlKGlkKTtcbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLnJlbW92ZShpZCk7XG4gICAgcHJpbWl0aXZlLmVsZW1lbnQgPSBudWxsO1xuICB9XG59XG4iXX0=