/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as _get from 'lodash.get';
import { AcLayerComponent } from '../ac-layer/ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 * <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Cesium.Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 * </ac-layer>
 *  ```
 */
var AcArrayDescComponent = /** @class */ (function () {
    function AcArrayDescComponent(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['acFor'].firstChange) {
            /** @type {?} */
            var acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + acForString);
            }
            /** @type {?} */
            var acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layer.getLayerService().cache = false;
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe((/**
         * @return {?}
         */
        function () {
            _this.cd.detectChanges();
        }));
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            component.setLayerService(_this.layer.getLayerService());
        }));
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            _this.layerService.unregisterDescription(component);
            _this.layer.getLayerService().registerDescription(component);
            component.layerService = _this.layer.getLayerService();
            component.setLayerService(_this.layer.getLayerService());
        }));
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} layerService
     * @return {?}
     */
    AcArrayDescComponent.prototype.setLayerService = /**
     * @param {?} layerService
     * @return {?}
     */
    function (layerService) {
        this.layerService = layerService;
    };
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    AcArrayDescComponent.prototype.draw = /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    function (context, id, contextEntity) {
        var _this = this;
        /** @type {?} */
        var get = _get;
        /** @type {?} */
        var entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        /** @type {?} */
        var previousEntitiesIdArray = this.entitiesMap.get(id);
        /** @type {?} */
        var entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        function (item, index) {
            _this.layerService.context[_this.entityName] = item;
            /** @type {?} */
            var arrayItemId = _this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            _this.layer.update(contextEntity, arrayItemId);
        }));
        if (previousEntitiesIdArray) {
            /** @type {?} */
            var entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                function (entityId) { return entitiesIdArray.indexOf(entityId) < 0; })) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                function (entityId) { return _this.layer.remove(entityId); }));
            }
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    AcArrayDescComponent.prototype.remove = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        var _this = this;
        /** @type {?} */
        var entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((/**
             * @param {?} entityId
             * @return {?}
             */
            function (entityId) { return _this.layer.remove(entityId); }));
        }
        this.entitiesMap.delete(id);
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.layer.removeAll();
        this.entitiesMap.clear();
    };
    /**
     * @return {?}
     */
    AcArrayDescComponent.prototype.getAcForString = /**
     * @return {?}
     */
    function () {
        return "let " + (this.entityName + '___temp') + " of arrayObservable$";
    };
    /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    AcArrayDescComponent.prototype.generateCombinedId = /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    function (entityId, arrayItem, index) {
        /** @type {?} */
        var arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    };
    AcArrayDescComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-array-desc',
                    template: "\n    <ac-layer #layer [acFor]=\"getAcForString()\"\n              [context]=\"layerService.context\"\n              [options]=\"layerService.options\"\n              [show]=\"layerService.show && show\"\n              [zIndex]=\"layerService.zIndex\">\n      <ng-content #content></ng-content>\n    </ac-layer>\n  ",
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    /** @nocollapse */
    AcArrayDescComponent.ctorParameters = function () { return [
        { type: LayerService },
        { type: ChangeDetectorRef }
    ]; };
    AcArrayDescComponent.propDecorators = {
        acFor: [{ type: Input }],
        idGetter: [{ type: Input }],
        show: [{ type: Input }],
        layer: [{ type: ViewChild, args: ['layer',] }],
        basicDescs: [{ type: ContentChildren, args: [BasicDesc, { descendants: false },] }],
        arrayDescs: [{ type: ContentChildren, args: [AcArrayDescComponent, { descendants: false },] }]
    };
    return AcArrayDescComponent;
}());
export { AcArrayDescComponent };
if (false) {
    /** @type {?} */
    AcArrayDescComponent.prototype.acFor;
    /** @type {?} */
    AcArrayDescComponent.prototype.idGetter;
    /** @type {?} */
    AcArrayDescComponent.prototype.show;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.layer;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.basicDescs;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.arrayDescs;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.entitiesMap;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.layerServiceSubscription;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.id;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.acForRgx;
    /** @type {?} */
    AcArrayDescComponent.prototype.entityName;
    /** @type {?} */
    AcArrayDescComponent.prototype.arrayPath;
    /** @type {?} */
    AcArrayDescComponent.prototype.arrayObservable$;
    /** @type {?} */
    AcArrayDescComponent.prototype.layerService;
    /**
     * @type {?}
     * @private
     */
    AcArrayDescComponent.prototype.cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFycmF5LWRlc2MvYWMtYXJyYXktZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUtMLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCekU7SUErQkUsOEJBQW1CLFlBQTBCLEVBQVUsRUFBcUI7UUFBekQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVpuRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBSWIsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUUxQyxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ0UsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBR25ELHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO0lBR2pELENBQUM7Ozs7O0lBRUQsMENBQVc7Ozs7SUFBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRTs7Z0JBQzFCLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFD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QUFvQjs7O0lBRS9CLHFDQUF1Qjs7SUFFdkIsd0NBQXdEOztJQUV4RCxvQ0FBcUI7Ozs7O0lBQ3JCLHFDQUFvRDs7Ozs7SUFDcEQsMENBQTBFOzs7OztJQUMxRSwwQ0FBcUY7Ozs7O0lBQ3JGLDJDQUFrRDs7Ozs7SUFDbEQsd0RBQStDOzs7OztJQUMvQyxrQ0FBZTs7Ozs7SUFDZix3Q0FBbUQ7O0lBQ25ELDBDQUFtQjs7SUFDbkIseUNBQWtCOztJQUNsQixnREFBaUQ7O0lBRXJDLDRDQUFpQzs7Ozs7SUFBRSxrQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgSURlc2NyaXB0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Rlc2NyaXB0aW9uJztcbmltcG9ydCAqIGFzIF9nZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgVGhpcyBpcyBjb21wb25lbnQgcmVwcmVzZW50cyBhbiBhcnJheSB1bmRlciBgYWMtbGF5ZXJgLlxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxuICogICsgYWNGb3IgYHtzdHJpbmd9YCAtIGdldCB0aGUgdHJhY2tlZCBhcnJheSBhbmQgZW50aXR5TmFtZSAoc2VlIHRoZSBleGFtcGxlKS5cbiAqICArIGlkR2V0dGVyIGB7RnVuY3Rpb259YCAtIGEgZnVuY3Rpb24gdGhhdCBnZXRzIHRoZSBpZCBmb3IgYSBnaXZlbiBlbGVtZW50IGluIHRoZSBhcnJheSAtc2hvdWxkIGJlIGRlZmluZWQgZm9yIG1heGltdW0gcGVyZm9ybWFuY2UuXG4gKiAgKyBzaG93IGB7Ym9vbGVhbn1gIC0gc2hvdy9oaWRlIGFycmF5J3MgZW50aXRpZXMuXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKjxhYy1sYXllciBhY0Zvcj1cImxldCB0cmFjayBvZiB0cmFja3MkXCIgW3Nob3ddPVwic2hvd1wiIFtjb250ZXh0XT1cInRoaXNcIiBbc3RvcmVdPVwidHJ1ZVwiPlxuICogIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGFycmF5SXRlbSBvZiB0cmFjay5hcnJheVwiIFtpZEdldHRlcl09XCJ0cmFja0FycmF5SWRHZXR0ZXJcIj5cbiAqICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGlubmVyQXJyYXlJdGVtIG9mIGFycmF5SXRlbS5pbm5lckFycmF5XCIgW2lkR2V0dGVyXT1cInRyYWNrQXJyYXlJZEdldHRlclwiPlxuICogICAgICA8YWMtcG9pbnQtZGVzYyBwcm9wcz1cIntcbiAqICAgICAgICBwb3NpdGlvbjogaW5uZXJBcnJheUl0ZW0ucG9zLFxuICogICAgICAgIHBpeGVsU2l6ZTogMTAsXG4gKiAgICAgICAgY29sb3I6IGdldFRyYWNrQ29sb3IodHJhY2spLFxuICogICAgICAgIG91dGxpbmVDb2xvcjogQ2VzaXVtLkNvbG9yLkJMVUUsXG4gKiAgICAgICAgb3V0bGluZVdpZHRoOiAxXG4gKiAgICAgIH1cIj5cbiAqICAgICAgPC9hYy1wb2ludC1kZXNjPlxuICogICAgPC9hYy1hcnJheS1kZXNjPlxuICogIDwvYWMtYXJyYXktZGVzYz5cbiAqPC9hYy1sYXllcj5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1hcnJheS1kZXNjJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YWMtbGF5ZXIgI2xheWVyIFthY0Zvcl09XCJnZXRBY0ZvclN0cmluZygpXCJcbiAgICAgICAgICAgICAgW2NvbnRleHRdPVwibGF5ZXJTZXJ2aWNlLmNvbnRleHRcIlxuICAgICAgICAgICAgICBbb3B0aW9uc109XCJsYXllclNlcnZpY2Uub3B0aW9uc1wiXG4gICAgICAgICAgICAgIFtzaG93XT1cImxheWVyU2VydmljZS5zaG93ICYmIHNob3dcIlxuICAgICAgICAgICAgICBbekluZGV4XT1cImxheWVyU2VydmljZS56SW5kZXhcIj5cbiAgICAgIDxuZy1jb250ZW50ICNjb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2FjLWxheWVyPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQWNBcnJheURlc2NDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBJRGVzY3JpcHRpb24ge1xuXG4gIEBJbnB1dCgpIGFjRm9yOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaWRHZXR0ZXI6IChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHN0cmluZztcblxuICBASW5wdXQoKSBzaG93ID0gdHJ1ZTtcbiAgQFZpZXdDaGlsZCgnbGF5ZXInKSBwcml2YXRlIGxheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAQ29udGVudENoaWxkcmVuKEJhc2ljRGVzYywge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHByaXZhdGUgYmFzaWNEZXNjczogYW55O1xuICBAQ29udGVudENoaWxkcmVuKEFjQXJyYXlEZXNjQ29tcG9uZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgcHJpdmF0ZSBhcnJheURlc2NzOiBhbnk7XG4gIHByaXZhdGUgZW50aXRpZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIHByaXZhdGUgbGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgaWQgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IGFjRm9yUmd4ID0gL15sZXRcXHMrLitcXHMrb2ZcXHMrLiskLztcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBhcnJheVBhdGg6IHN0cmluZztcbiAgYXJyYXlPYnNlcnZhYmxlJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snYWNGb3InXS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgYWNGb3JTdHJpbmcgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICghdGhpcy5hY0ZvclJneC50ZXN0KGFjRm9yU3RyaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGFjLWxheWVyOiBJbnZhbGlkIFthY0Zvcl0gc3ludGF4LiBFeHBlY3RlZDogW2FjRm9yXT1cImxldCBpdGVtIG9mIG9ic2VydmFibGVcIiAuSW5zdGVhZCByZWNlaXZlZDogJHthY0ZvclN0cmluZ31gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjRm9yQXJyID0gY2hhbmdlc1snYWNGb3InXS5jdXJyZW50VmFsdWUuc3BsaXQoJyAnKTtcbiAgICAgIHRoaXMuYXJyYXlQYXRoID0gYWNGb3JBcnJbM107XG4gICAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpLmNhY2hlID0gZmFsc2U7XG4gICAgdGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24gPSB0aGlzLmxheWVyU2VydmljZS5sYXllclVwZGF0ZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dFsnYXJyYXlPYnNlcnZhYmxlJCddID0gdGhpcy5hcnJheU9ic2VydmFibGUkO1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5iYXNpY0Rlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQmFzaWNEZXNjKSA9PiB7XG4gICAgICBjb21wb25lbnQuc2V0TGF5ZXJTZXJ2aWNlKHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkpO1xuICAgIH0pO1xuICAgIHRoaXMuYXJyYXlEZXNjcy5fcmVzdWx0cy5zcGxpY2UoMCwgMSk7XG4gICAgdGhpcy5hcnJheURlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQWNBcnJheURlc2NDb21wb25lbnQpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbihjb21wb25lbnQpO1xuICAgICAgdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKS5yZWdpc3RlckRlc2NyaXB0aW9uKGNvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQubGF5ZXJTZXJ2aWNlID0gdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKTtcbiAgICAgIGNvbXBvbmVudC5zZXRMYXllclNlcnZpY2UodGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGF5ZXJTZXJ2aWNlKGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UgPSBsYXllclNlcnZpY2U7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgY29udGV4dEVudGl0eTogYW55KSB7XG4gICAgY29uc3QgZ2V0ID0gX2dldDtcbiAgICBjb25zdCBlbnRpdGllc0FycmF5OiBhbnlbXSA9IGdldChjb250ZXh0LCB0aGlzLmFycmF5UGF0aCk7XG4gICAgaWYgKCFlbnRpdGllc0FycmF5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzRW50aXRpZXNJZEFycmF5ID0gdGhpcy5lbnRpdGllc01hcC5nZXQoaWQpO1xuICAgIGNvbnN0IGVudGl0aWVzSWRBcnJheTogYW55W10gPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLnNldChpZCwgZW50aXRpZXNJZEFycmF5KTtcblxuICAgIGVudGl0aWVzQXJyYXkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHRbdGhpcy5lbnRpdHlOYW1lXSA9IGl0ZW07XG4gICAgICBjb25zdCBhcnJheUl0ZW1JZCA9IHRoaXMuZ2VuZXJhdGVDb21iaW5lZElkKGlkLCBpdGVtLCBpbmRleCk7XG4gICAgICBlbnRpdGllc0lkQXJyYXkucHVzaChhcnJheUl0ZW1JZCk7XG4gICAgICB0aGlzLmxheWVyLnVwZGF0ZShjb250ZXh0RW50aXR5LCBhcnJheUl0ZW1JZCk7XG4gICAgfSk7XG5cbiAgICBpZiAocHJldmlvdXNFbnRpdGllc0lkQXJyYXkpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzVG9SZW1vdmUgPSB0aGlzLmlkR2V0dGVyID9cbiAgICAgICAgcHJldmlvdXNFbnRpdGllc0lkQXJyYXkuZmlsdGVyKChlbnRpdHlJZCkgPT4gZW50aXRpZXNJZEFycmF5LmluZGV4T2YoZW50aXR5SWQpIDwgMCkgOlxuICAgICAgICBwcmV2aW91c0VudGl0aWVzSWRBcnJheTtcbiAgICAgIGlmIChlbnRpdGllc1RvUmVtb3ZlKSB7XG4gICAgICAgIGVudGl0aWVzVG9SZW1vdmUuZm9yRWFjaCgoZW50aXR5SWQpID0+IHRoaXMubGF5ZXIucmVtb3ZlKGVudGl0eUlkKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbnRpdGllc0lkQXJyYXkgPSB0aGlzLmVudGl0aWVzTWFwLmdldChpZCk7XG4gICAgaWYgKGVudGl0aWVzSWRBcnJheSkge1xuICAgICAgZW50aXRpZXNJZEFycmF5LmZvckVhY2goKGVudGl0eUlkKSA9PiB0aGlzLmxheWVyLnJlbW92ZShlbnRpdHlJZCkpO1xuICAgIH1cbiAgICB0aGlzLmVudGl0aWVzTWFwLmRlbGV0ZShpZCk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5sYXllci5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLmNsZWFyKCk7XG4gIH1cblxuICBnZXRBY0ZvclN0cmluZygpIHtcbiAgICByZXR1cm4gYGxldCAke3RoaXMuZW50aXR5TmFtZSArICdfX190ZW1wJ30gb2YgYXJyYXlPYnNlcnZhYmxlJGA7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ29tYmluZWRJZChlbnRpdHlJZDogc3RyaW5nLCBhcnJheUl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IGFycmF5SXRlbUlkO1xuICAgIGlmICh0aGlzLmlkR2V0dGVyKSB7XG4gICAgICBhcnJheUl0ZW1JZCA9IHRoaXMuaWRHZXR0ZXIoYXJyYXlJdGVtLCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5SXRlbUlkID0gKHRoaXMuaWQrKykgJSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eUlkICsgYXJyYXlJdGVtSWQ7XG4gIH1cbn1cbiJdfQ==