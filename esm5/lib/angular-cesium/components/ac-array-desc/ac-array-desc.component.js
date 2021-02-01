import { __decorate, __metadata } from "tslib";
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
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
 *</ac-layer>
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
    AcArrayDescComponent_1 = AcArrayDescComponent;
    AcArrayDescComponent.prototype.ngOnChanges = function (changes) {
        if (changes['acFor'].firstChange) {
            var acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error("ac-layer: Invalid [acFor] syntax. Expected: [acFor]=\"let item of observable\" .Instead received: " + acForString);
            }
            var acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    };
    AcArrayDescComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.layer) {
            this.layer.getLayerService().cache = false;
        }
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(function () {
            _this.cd.detectChanges();
        });
    };
    AcArrayDescComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach(function (component) {
            component.setLayerService(_this.layer.getLayerService());
        });
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach(function (component) {
            _this.layerService.unregisterDescription(component);
            _this.layer.getLayerService().registerDescription(component);
            component.layerService = _this.layer.getLayerService();
            component.setLayerService(_this.layer.getLayerService());
        });
    };
    AcArrayDescComponent.prototype.ngOnDestroy = function () {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    };
    AcArrayDescComponent.prototype.setLayerService = function (layerService) {
        this.layerService = layerService;
    };
    AcArrayDescComponent.prototype.draw = function (context, id, contextEntity) {
        var _this = this;
        var get = _get;
        var entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        var previousEntitiesIdArray = this.entitiesMap.get(id);
        var entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach(function (item, index) {
            _this.layerService.context[_this.entityName] = item;
            var arrayItemId = _this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            _this.layer.update(contextEntity, arrayItemId);
        });
        if (previousEntitiesIdArray) {
            var entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter(function (entityId) { return entitiesIdArray.indexOf(entityId) < 0; }) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach(function (entityId) { return _this.layer.remove(entityId); });
            }
        }
    };
    AcArrayDescComponent.prototype.remove = function (id) {
        var _this = this;
        var entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach(function (entityId) { return _this.layer.remove(entityId); });
        }
        this.entitiesMap.delete(id);
    };
    AcArrayDescComponent.prototype.removeAll = function () {
        this.layer.removeAll();
        this.entitiesMap.clear();
    };
    AcArrayDescComponent.prototype.getAcForString = function () {
        return "let " + (this.entityName + '___temp') + " of arrayObservable$";
    };
    AcArrayDescComponent.prototype.generateCombinedId = function (entityId, arrayItem, index) {
        var arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    };
    var AcArrayDescComponent_1;
    AcArrayDescComponent.ctorParameters = function () { return [
        { type: LayerService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AcArrayDescComponent.prototype, "acFor", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], AcArrayDescComponent.prototype, "idGetter", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "show", void 0);
    __decorate([
        ViewChild('layer', { static: true }),
        __metadata("design:type", AcLayerComponent)
    ], AcArrayDescComponent.prototype, "layer", void 0);
    __decorate([
        ContentChildren(BasicDesc, { descendants: false }),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "basicDescs", void 0);
    __decorate([
        ContentChildren(AcArrayDescComponent_1, { descendants: false }),
        __metadata("design:type", Object)
    ], AcArrayDescComponent.prototype, "arrayDescs", void 0);
    AcArrayDescComponent = AcArrayDescComponent_1 = __decorate([
        Component({
            selector: 'ac-array-desc',
            template: "\n    <ac-layer #layer [acFor]=\"getAcForString()\"\n              [context]=\"layerService.context\"\n              [options]=\"layerService.options\"\n              [show]=\"layerService.show && show\"\n              [zIndex]=\"layerService.zIndex\">\n      <ng-content #content></ng-content>\n    </ac-layer>\n  ",
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [LayerService, ChangeDetectorRef])
    ], AcArrayDescComponent);
    return AcArrayDescComponent;
}());
export { AcArrayDescComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFycmF5LWRlc2MvYWMtYXJyYXktZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFDTCxTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixhQUFhLEVBQ2IsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRTdDLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFekU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQWVIO0lBa0JFLDhCQUFtQixZQUEwQixFQUFVLEVBQXFCO1FBQXpELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFabkUsU0FBSSxHQUFHLElBQUksQ0FBQztRQUliLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFFMUMsT0FBRSxHQUFHLENBQUMsQ0FBQztRQUNFLGFBQVEsR0FBRyxzQkFBc0IsQ0FBQztRQUduRCxxQkFBZ0IsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztJQUdqRCxDQUFDOzZCQW5CVSxvQkFBb0I7SUFxQi9CLDBDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8s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QyxXQUFXLEVBQUUsS0FBSyxFQUFDLENBQUM7OzREQUF5QjtJQUNiO1FBQTVELGVBQWUsQ0FBQyxzQkFBb0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUMsQ0FBQzs7NERBQXlCO0lBVDFFLG9CQUFvQjtRQWJoQyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixRQUFRLEVBQUUsNlRBUVQ7WUFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtTQUNoRCxDQUFDO3lDQW1CaUMsWUFBWSxFQUFjLGlCQUFpQjtPQWxCakUsb0JBQW9CLENBeUhoQztJQUFELDJCQUFDO0NBQUEsQUF6SEQsSUF5SEM7U0F6SFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElEZXNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9kZXNjcmlwdGlvbic7XG5pbXBvcnQgKiBhcyBfZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgY29tcG9uZW50IHJlcHJlc2VudHMgYW4gYXJyYXkgdW5kZXIgYGFjLWxheWVyYC5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICArIGFjRm9yIGB7c3RyaW5nfWAgLSBnZXQgdGhlIHRyYWNrZWQgYXJyYXkgYW5kIGVudGl0eU5hbWUgKHNlZSB0aGUgZXhhbXBsZSkuXG4gKiAgKyBpZEdldHRlciBge0Z1bmN0aW9ufWAgLSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyB0aGUgaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudCBpbiB0aGUgYXJyYXkgLXNob3VsZCBiZSBkZWZpbmVkIGZvciBtYXhpbXVtIHBlcmZvcm1hbmNlLlxuICogICsgc2hvdyBge2Jvb2xlYW59YCAtIHNob3cvaGlkZSBhcnJheSdzIGVudGl0aWVzLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICo8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW3N0b3JlXT1cInRydWVcIj5cbiAqICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBhcnJheUl0ZW0gb2YgdHJhY2suYXJyYXlcIiBbaWRHZXR0ZXJdPVwidHJhY2tBcnJheUlkR2V0dGVyXCI+XG4gKiAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBpbm5lckFycmF5SXRlbSBvZiBhcnJheUl0ZW0uaW5uZXJBcnJheVwiIFtpZEdldHRlcl09XCJ0cmFja0FycmF5SWRHZXR0ZXJcIj5cbiAqICAgICAgPGFjLXBvaW50LWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgcG9zaXRpb246IGlubmVyQXJyYXlJdGVtLnBvcyxcbiAqICAgICAgICBwaXhlbFNpemU6IDEwLFxuICogICAgICAgIGNvbG9yOiBnZXRUcmFja0NvbG9yKHRyYWNrKSxcbiAqICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTFVFLFxuICogICAgICAgIG91dGxpbmVXaWR0aDogMVxuICogICAgICB9XCI+XG4gKiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAqICAgIDwvYWMtYXJyYXktZGVzYz5cbiAqICA8L2FjLWFycmF5LWRlc2M+XG4gKjwvYWMtbGF5ZXI+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYXJyYXktZGVzYycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGFjLWxheWVyICNsYXllciBbYWNGb3JdPVwiZ2V0QWNGb3JTdHJpbmcoKVwiXG4gICAgICAgICAgICAgIFtjb250ZXh0XT1cImxheWVyU2VydmljZS5jb250ZXh0XCJcbiAgICAgICAgICAgICAgW29wdGlvbnNdPVwibGF5ZXJTZXJ2aWNlLm9wdGlvbnNcIlxuICAgICAgICAgICAgICBbc2hvd109XCJsYXllclNlcnZpY2Uuc2hvdyAmJiBzaG93XCJcbiAgICAgICAgICAgICAgW3pJbmRleF09XCJsYXllclNlcnZpY2UuekluZGV4XCI+XG4gICAgICA8bmctY29udGVudCAjY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEFjQXJyYXlEZXNjQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgSURlc2NyaXB0aW9uIHtcblxuICBASW5wdXQoKSBhY0Zvcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGlkR2V0dGVyOiAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmc7XG5cbiAgQElucHV0KCkgc2hvdyA9IHRydWU7XG4gIEBWaWV3Q2hpbGQoJ2xheWVyJywge3N0YXRpYzogdHJ1ZX0pIHByaXZhdGUgbGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBDb250ZW50Q2hpbGRyZW4oQmFzaWNEZXNjLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgcHJpdmF0ZSBiYXNpY0Rlc2NzOiBhbnk7XG4gIEBDb250ZW50Q2hpbGRyZW4oQWNBcnJheURlc2NDb21wb25lbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBwcml2YXRlIGFycmF5RGVzY3M6IGFueTtcbiAgcHJpdmF0ZSBlbnRpdGllc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgcHJpdmF0ZSBsYXllclNlcnZpY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBpZCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWNGb3JSZ3ggPSAvXmxldFxccysuK1xccytvZlxccysuKyQvO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGFycmF5UGF0aDogc3RyaW5nO1xuICBhcnJheU9ic2VydmFibGUkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydhY0ZvciddLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBhY0ZvclN0cmluZyA9IGNoYW5nZXNbJ2FjRm9yJ10uY3VycmVudFZhbHVlO1xuICAgICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QoYWNGb3JTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke2FjRm9yU3RyaW5nfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgYWNGb3JBcnIgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZS5zcGxpdCgnICcpO1xuICAgICAgdGhpcy5hcnJheVBhdGggPSBhY0ZvckFyclszXTtcbiAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGFjRm9yQXJyWzFdO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxheWVyKSB7XG4gICAgICB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpLmNhY2hlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24gPSB0aGlzLmxheWVyU2VydmljZS5sYXllclVwZGF0ZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dFsnYXJyYXlPYnNlcnZhYmxlJCddID0gdGhpcy5hcnJheU9ic2VydmFibGUkO1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5iYXNpY0Rlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQmFzaWNEZXNjKSA9PiB7XG4gICAgICBjb21wb25lbnQuc2V0TGF5ZXJTZXJ2aWNlKHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkpO1xuICAgIH0pO1xuICAgIHRoaXMuYXJyYXlEZXNjcy5fcmVzdWx0cy5zcGxpY2UoMCwgMSk7XG4gICAgdGhpcy5hcnJheURlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQWNBcnJheURlc2NDb21wb25lbnQpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbihjb21wb25lbnQpO1xuICAgICAgdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKS5yZWdpc3RlckRlc2NyaXB0aW9uKGNvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQubGF5ZXJTZXJ2aWNlID0gdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKTtcbiAgICAgIGNvbXBvbmVudC5zZXRMYXllclNlcnZpY2UodGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGF5ZXJTZXJ2aWNlKGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UgPSBsYXllclNlcnZpY2U7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgY29udGV4dEVudGl0eTogYW55KSB7XG4gICAgY29uc3QgZ2V0ID0gX2dldDtcbiAgICBjb25zdCBlbnRpdGllc0FycmF5OiBhbnlbXSA9IGdldChjb250ZXh0LCB0aGlzLmFycmF5UGF0aCk7XG4gICAgaWYgKCFlbnRpdGllc0FycmF5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzRW50aXRpZXNJZEFycmF5ID0gdGhpcy5lbnRpdGllc01hcC5nZXQoaWQpO1xuICAgIGNvbnN0IGVudGl0aWVzSWRBcnJheTogYW55W10gPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLnNldChpZCwgZW50aXRpZXNJZEFycmF5KTtcblxuICAgIGVudGl0aWVzQXJyYXkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHRbdGhpcy5lbnRpdHlOYW1lXSA9IGl0ZW07XG4gICAgICBjb25zdCBhcnJheUl0ZW1JZCA9IHRoaXMuZ2VuZXJhdGVDb21iaW5lZElkKGlkLCBpdGVtLCBpbmRleCk7XG4gICAgICBlbnRpdGllc0lkQXJyYXkucHVzaChhcnJheUl0ZW1JZCk7XG4gICAgICB0aGlzLmxheWVyLnVwZGF0ZShjb250ZXh0RW50aXR5LCBhcnJheUl0ZW1JZCk7XG4gICAgfSk7XG5cbiAgICBpZiAocHJldmlvdXNFbnRpdGllc0lkQXJyYXkpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzVG9SZW1vdmUgPSB0aGlzLmlkR2V0dGVyID9cbiAgICAgICAgcHJldmlvdXNFbnRpdGllc0lkQXJyYXkuZmlsdGVyKChlbnRpdHlJZCkgPT4gZW50aXRpZXNJZEFycmF5LmluZGV4T2YoZW50aXR5SWQpIDwgMCkgOlxuICAgICAgICBwcmV2aW91c0VudGl0aWVzSWRBcnJheTtcbiAgICAgIGlmIChlbnRpdGllc1RvUmVtb3ZlKSB7XG4gICAgICAgIGVudGl0aWVzVG9SZW1vdmUuZm9yRWFjaCgoZW50aXR5SWQpID0+IHRoaXMubGF5ZXIucmVtb3ZlKGVudGl0eUlkKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbnRpdGllc0lkQXJyYXkgPSB0aGlzLmVudGl0aWVzTWFwLmdldChpZCk7XG4gICAgaWYgKGVudGl0aWVzSWRBcnJheSkge1xuICAgICAgZW50aXRpZXNJZEFycmF5LmZvckVhY2goKGVudGl0eUlkKSA9PiB0aGlzLmxheWVyLnJlbW92ZShlbnRpdHlJZCkpO1xuICAgIH1cbiAgICB0aGlzLmVudGl0aWVzTWFwLmRlbGV0ZShpZCk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5sYXllci5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLmNsZWFyKCk7XG4gIH1cblxuICBnZXRBY0ZvclN0cmluZygpIHtcbiAgICByZXR1cm4gYGxldCAke3RoaXMuZW50aXR5TmFtZSArICdfX190ZW1wJ30gb2YgYXJyYXlPYnNlcnZhYmxlJGA7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ29tYmluZWRJZChlbnRpdHlJZDogc3RyaW5nLCBhcnJheUl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IGFycmF5SXRlbUlkO1xuICAgIGlmICh0aGlzLmlkR2V0dGVyKSB7XG4gICAgICBhcnJheUl0ZW1JZCA9IHRoaXMuaWRHZXR0ZXIoYXJyYXlJdGVtLCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5SXRlbUlkID0gKHRoaXMuaWQrKykgJSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eUlkICsgYXJyYXlJdGVtSWQ7XG4gIH1cbn1cbiJdfQ==