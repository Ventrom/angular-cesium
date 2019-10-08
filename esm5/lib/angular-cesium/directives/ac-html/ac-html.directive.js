/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef } from '@angular/core';
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
if (false) {
    /** @type {?} */
    AcHtmlContext.prototype.id;
    /** @type {?} */
    AcHtmlContext.prototype.context;
}
var AcHtmlDirective = /** @class */ (function () {
    function AcHtmlDirective(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    /**
     * @return {?}
     */
    AcHtmlDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @private
     * @param {?} id
     * @param {?} primitive
     * @param {?} entity
     * @return {?}
     */
    AcHtmlDirective.prototype._handleView = /**
     * @private
     * @param {?} id
     * @param {?} primitive
     * @param {?} entity
     * @return {?}
     */
    function (id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            /** @type {?} */
            var context = new AcHtmlContext(id, { $implicit: entity });
            /** @type {?} */
            var viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef: viewRef, context: context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && !primitive.show) {
            this.remove(id, primitive);
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    };
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    AcHtmlDirective.prototype.addOrUpdate = /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    function (id, primitive) {
        /** @type {?} */
        var context = this._layerService.context;
        /** @type {?} */
        var entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity: entity, primitive: primitive });
        this._handleView(id, primitive, entity);
    };
    /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    AcHtmlDirective.prototype.remove = /**
     * @param {?} id
     * @param {?} primitive
     * @return {?}
     */
    function (id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        var viewRef = this._views.get(id).viewRef;
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    };
    AcHtmlDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[acHtml]',
                },] }
    ];
    /** @nocollapse */
    AcHtmlDirective.ctorParameters = function () { return [
        { type: TemplateRef },
        { type: ViewContainerRef },
        { type: ChangeDetectorRef },
        { type: LayerService },
        { type: AcHtmlManager }
    ]; };
    return AcHtmlDirective;
}());
export { AcHtmlDirective };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._views;
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._templateRef;
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._viewContainerRef;
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._changeDetector;
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._layerService;
    /**
     * @type {?}
     * @private
     */
    AcHtmlDirective.prototype._acHtmlManager;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9kaXJlY3RpdmVzL2FjLWh0bWwvYWMtaHRtbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQVUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFFdkY7SUFDRSx1QkFDUyxFQUFPLEVBQ1AsT0FBWTtRQURaLE9BQUUsR0FBRixFQUFFLENBQUs7UUFDUCxZQUFPLEdBQVAsT0FBTyxDQUFLO0lBRXJCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFORCxJQU1DOzs7O0lBSkcsMkJBQWM7O0lBQ2QsZ0NBQW1COztBQUt2QjtJQU9FLHlCQUNVLFlBQXdDLEVBQ3hDLGlCQUFtQyxFQUNuQyxlQUFrQyxFQUNsQyxhQUEyQixFQUMzQixjQUE2QjtRQUo3QixpQkFBWSxHQUFaLFlBQVksQ0FBNEI7UUFDeEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7UUFDbEMsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0IsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFQL0IsV0FBTSxHQUFHLElBQUksR0FBRyxFQUF1QyxDQUFDO0lBU2hFLENBQUM7Ozs7SUFFRCxrQ0FBUTs7O0lBQVI7SUFFQSxDQUFDOzs7Ozs7OztJQUVPLHFDQUFXOzs7Ozs7O0lBQW5CLFVBQW9CLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTs7Z0JBQ3BDLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUM7O2dCQUNwRCxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDO1lBQ3JGLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFDLE9BQU8sU0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RDO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDNUI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QztJQUNILENBQUM7Ozs7OztJQUVELHFDQUFXOzs7OztJQUFYLFVBQVksRUFBTyxFQUFFLFNBQWM7O1lBQzNCLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87O1lBQ3BDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUUxRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztTQUN4RDtRQUVELElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFDLE1BQU0sUUFBQSxFQUFFLFNBQVMsV0FBQSxFQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7O0lBRUQsZ0NBQU07Ozs7O0lBQU4sVUFBTyxFQUFPLEVBQUUsU0FBYztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRU0sSUFBQSxxQ0FBTztRQUNkLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7O2dCQXZERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7aUJBQ3JCOzs7O2dCQWQ4QyxXQUFXO2dCQUFFLGdCQUFnQjtnQkFBbkUsaUJBQWlCO2dCQUNqQixZQUFZO2dCQUNaLGFBQWE7O0lBa0V0QixzQkFBQztDQUFBLEFBeERELElBd0RDO1NBckRZLGVBQWU7Ozs7OztJQUUxQixpQ0FBZ0U7Ozs7O0lBRzlELHVDQUFnRDs7Ozs7SUFDaEQsNENBQTJDOzs7OztJQUMzQywwQ0FBMEM7Ozs7O0lBQzFDLHdDQUFtQzs7Ozs7SUFDbkMseUNBQXFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBBY0h0bWxDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlkOiBhbnksXG4gICAgcHVibGljIGNvbnRleHQ6IGFueVxuICApIHtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYWNIdG1sXScsXG59KVxuZXhwb3J0IGNsYXNzIEFjSHRtbERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJpdmF0ZSBfdmlld3MgPSBuZXcgTWFwPGFueSwgeyB2aWV3UmVmOiBhbnksIGNvbnRleHQ6IGFueSB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxBY0h0bWxDb250ZXh0PixcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcbiAgICBwcml2YXRlIF9hY0h0bWxNYW5hZ2VyOiBBY0h0bWxNYW5hZ2VyXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxuXG4gIHByaXZhdGUgX2hhbmRsZVZpZXcoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnksIGVudGl0eTogYW55KSB7XG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFjSHRtbENvbnRleHQoaWQsIHskaW1wbGljaXQ6IGVudGl0eX0pO1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RlbXBsYXRlUmVmLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3ZpZXdzLnNldChpZCwge3ZpZXdSZWYsIGNvbnRleHR9KTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3ZpZXdzLmhhcyhpZCkgJiYgIXByaW1pdGl2ZS5zaG93KSB7XG4gICAgICB0aGlzLnJlbW92ZShpZCwgcHJpbWl0aXZlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3ZpZXdzLmhhcyhpZCkgJiYgcHJpbWl0aXZlLnNob3cpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBhZGRPclVwZGF0ZShpZDogYW55LCBwcmltaXRpdmU6IGFueSkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLl9sYXllclNlcnZpY2UuY29udGV4dDtcbiAgICBjb25zdCBlbnRpdHkgPSBjb250ZXh0W3RoaXMuX2xheWVyU2VydmljZS5nZXRFbnRpdHlOYW1lKCldO1xuXG4gICAgaWYgKHRoaXMuX3ZpZXdzLmhhcyhpZCkpIHtcbiAgICAgIHRoaXMuX3ZpZXdzLmdldChpZCkuY29udGV4dC5jb250ZXh0LiRpbXBsaWNpdCA9IGVudGl0eTtcbiAgICB9XG5cbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLmFkZE9yVXBkYXRlKGlkLCB7ZW50aXR5LCBwcmltaXRpdmV9KTtcbiAgICB0aGlzLl9oYW5kbGVWaWV3KGlkLCBwcmltaXRpdmUsIGVudGl0eSk7XG4gIH1cblxuICByZW1vdmUoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuX3ZpZXdzLmhhcyhpZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7dmlld1JlZn0gPSB0aGlzLl92aWV3cy5nZXQoaWQpO1xuICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYucmVtb3ZlKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih2aWV3UmVmKSk7XG4gICAgdGhpcy5fdmlld3MuZGVsZXRlKGlkKTtcbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLnJlbW92ZShpZCk7XG4gICAgcHJpbWl0aXZlLmVsZW1lbnQgPSBudWxsO1xuICB9XG59XG4iXX0=