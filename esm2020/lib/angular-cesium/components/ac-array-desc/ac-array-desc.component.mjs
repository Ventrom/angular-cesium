import { ChangeDetectionStrategy, Component, ContentChildren, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as _get from 'lodash.get';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../ac-layer/ac-layer.component";
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
export class AcArrayDescComponent {
    constructor(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    ngOnChanges(changes) {
        if (changes['acFor'].firstChange) {
            const acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
            }
            const acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    }
    ngOnInit() {
        if (this.layer) {
            this.layer.getLayerService().cache = false;
        }
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(() => {
            this.cd.detectChanges();
        });
    }
    ngAfterContentInit() {
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((component) => {
            component.setLayerService(this.layer.getLayerService());
        });
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((component) => {
            this.layerService.unregisterDescription(component);
            this.layer.getLayerService().registerDescription(component);
            component.layerService = this.layer.getLayerService();
            component.setLayerService(this.layer.getLayerService());
        });
    }
    ngOnDestroy() {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    }
    setLayerService(layerService) {
        this.layerService = layerService;
    }
    draw(context, id, contextEntity) {
        const get = _get;
        const entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        const previousEntitiesIdArray = this.entitiesMap.get(id);
        const entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((item, index) => {
            this.layerService.context[this.entityName] = item;
            const arrayItemId = this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            this.layer.update(contextEntity, arrayItemId);
        });
        if (previousEntitiesIdArray) {
            const entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((entityId) => entitiesIdArray.indexOf(entityId) < 0) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((entityId) => this.layer.remove(entityId));
            }
        }
    }
    remove(id) {
        const entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((entityId) => this.layer.remove(entityId));
        }
        this.entitiesMap.delete(id);
    }
    removeAll() {
        this.layer.removeAll();
        this.entitiesMap.clear();
    }
    getAcForString() {
        return `let ${this.entityName + '___temp'} of arrayObservable$`;
    }
    generateCombinedId(entityId, arrayItem, index) {
        let arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    }
}
AcArrayDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcArrayDescComponent, deps: [{ token: i1.LayerService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
AcArrayDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcArrayDescComponent, selector: "ac-array-desc", inputs: { acFor: "acFor", idGetter: "idGetter", show: "show" }, queries: [{ propertyName: "basicDescs", predicate: BasicDesc }, { propertyName: "arrayDescs", predicate: AcArrayDescComponent }], viewQueries: [{ propertyName: "layer", first: true, predicate: ["layer"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `, isInline: true, dependencies: [{ kind: "component", type: i2.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcArrayDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-array-desc',
                    template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.LayerService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { acFor: [{
                type: Input
            }], idGetter: [{
                type: Input
            }], show: [{
                type: Input
            }], layer: [{
                type: ViewChild,
                args: ['layer', { static: true }]
            }], basicDescs: [{
                type: ContentChildren,
                args: [BasicDesc, { descendants: false }]
            }], arrayDescs: [{
                type: ContentChildren,
                args: [AcArrayDescComponent, { descendants: false }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJyYXktZGVzYy9hYy1hcnJheS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUtMLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUduQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7QUFFekU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQWVILE1BQU0sT0FBTyxvQkFBb0I7SUFrQi9CLFlBQW1CLFlBQTBCLEVBQVUsRUFBcUI7UUFBekQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVpuRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBSWIsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUUxQyxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ0UsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBR25ELHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO0lBR2pELENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ2hDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxD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QyxXQUFXLEVBQUUsS0FBSyxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElEZXNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9kZXNjcmlwdGlvbic7XG5pbXBvcnQgKiBhcyBfZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgY29tcG9uZW50IHJlcHJlc2VudHMgYW4gYXJyYXkgdW5kZXIgYGFjLWxheWVyYC5cbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cbiAqICArIGFjRm9yIGB7c3RyaW5nfWAgLSBnZXQgdGhlIHRyYWNrZWQgYXJyYXkgYW5kIGVudGl0eU5hbWUgKHNlZSB0aGUgZXhhbXBsZSkuXG4gKiAgKyBpZEdldHRlciBge0Z1bmN0aW9ufWAgLSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyB0aGUgaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudCBpbiB0aGUgYXJyYXkgLXNob3VsZCBiZSBkZWZpbmVkIGZvciBtYXhpbXVtIHBlcmZvcm1hbmNlLlxuICogICsgc2hvdyBge2Jvb2xlYW59YCAtIHNob3cvaGlkZSBhcnJheSdzIGVudGl0aWVzLlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICo8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW3N0b3JlXT1cInRydWVcIj5cbiAqICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBhcnJheUl0ZW0gb2YgdHJhY2suYXJyYXlcIiBbaWRHZXR0ZXJdPVwidHJhY2tBcnJheUlkR2V0dGVyXCI+XG4gKiAgICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBpbm5lckFycmF5SXRlbSBvZiBhcnJheUl0ZW0uaW5uZXJBcnJheVwiIFtpZEdldHRlcl09XCJ0cmFja0FycmF5SWRHZXR0ZXJcIj5cbiAqICAgICAgPGFjLXBvaW50LWRlc2MgcHJvcHM9XCJ7XG4gKiAgICAgICAgcG9zaXRpb246IGlubmVyQXJyYXlJdGVtLnBvcyxcbiAqICAgICAgICBwaXhlbFNpemU6IDEwLFxuICogICAgICAgIGNvbG9yOiBnZXRUcmFja0NvbG9yKHRyYWNrKSxcbiAqICAgICAgICBvdXRsaW5lQ29sb3I6IENlc2l1bS5Db2xvci5CTFVFLFxuICogICAgICAgIG91dGxpbmVXaWR0aDogMVxuICogICAgICB9XCI+XG4gKiAgICAgIDwvYWMtcG9pbnQtZGVzYz5cbiAqICAgIDwvYWMtYXJyYXktZGVzYz5cbiAqICA8L2FjLWFycmF5LWRlc2M+XG4gKjwvYWMtbGF5ZXI+XG4gKiAgYGBgXG4gKi9cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWMtYXJyYXktZGVzYycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGFjLWxheWVyICNsYXllciBbYWNGb3JdPVwiZ2V0QWNGb3JTdHJpbmcoKVwiXG4gICAgICAgICAgICAgIFtjb250ZXh0XT1cImxheWVyU2VydmljZS5jb250ZXh0XCJcbiAgICAgICAgICAgICAgW29wdGlvbnNdPVwibGF5ZXJTZXJ2aWNlLm9wdGlvbnNcIlxuICAgICAgICAgICAgICBbc2hvd109XCJsYXllclNlcnZpY2Uuc2hvdyAmJiBzaG93XCJcbiAgICAgICAgICAgICAgW3pJbmRleF09XCJsYXllclNlcnZpY2UuekluZGV4XCI+XG4gICAgICA8bmctY29udGVudCAjY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9hYy1sYXllcj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEFjQXJyYXlEZXNjQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgSURlc2NyaXB0aW9uIHtcblxuICBASW5wdXQoKSBhY0Zvcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGlkR2V0dGVyOiAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmc7XG5cbiAgQElucHV0KCkgc2hvdyA9IHRydWU7XG4gIEBWaWV3Q2hpbGQoJ2xheWVyJywge3N0YXRpYzogdHJ1ZX0pIHByaXZhdGUgbGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBDb250ZW50Q2hpbGRyZW4oQmFzaWNEZXNjLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgcHJpdmF0ZSBiYXNpY0Rlc2NzOiBhbnk7XG4gIEBDb250ZW50Q2hpbGRyZW4oQWNBcnJheURlc2NDb21wb25lbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBwcml2YXRlIGFycmF5RGVzY3M6IGFueTtcbiAgcHJpdmF0ZSBlbnRpdGllc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgcHJpdmF0ZSBsYXllclNlcnZpY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBpZCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWNGb3JSZ3ggPSAvXmxldFxccysuK1xccytvZlxccysuKyQvO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGFycmF5UGF0aDogc3RyaW5nO1xuICBhcnJheU9ic2VydmFibGUkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydhY0ZvciddLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBhY0ZvclN0cmluZyA9IGNoYW5nZXNbJ2FjRm9yJ10uY3VycmVudFZhbHVlO1xuICAgICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QoYWNGb3JTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke2FjRm9yU3RyaW5nfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgYWNGb3JBcnIgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZS5zcGxpdCgnICcpO1xuICAgICAgdGhpcy5hcnJheVBhdGggPSBhY0ZvckFyclszXTtcbiAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGFjRm9yQXJyWzFdO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxheWVyKSB7XG4gICAgICB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpLmNhY2hlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24gPSB0aGlzLmxheWVyU2VydmljZS5sYXllclVwZGF0ZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dFsnYXJyYXlPYnNlcnZhYmxlJCddID0gdGhpcy5hcnJheU9ic2VydmFibGUkO1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XG4gICAgdGhpcy5iYXNpY0Rlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQmFzaWNEZXNjKSA9PiB7XG4gICAgICBjb21wb25lbnQuc2V0TGF5ZXJTZXJ2aWNlKHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkpO1xuICAgIH0pO1xuICAgIHRoaXMuYXJyYXlEZXNjcy5fcmVzdWx0cy5zcGxpY2UoMCwgMSk7XG4gICAgdGhpcy5hcnJheURlc2NzLl9yZXN1bHRzLmZvckVhY2goKGNvbXBvbmVudDogQWNBcnJheURlc2NDb21wb25lbnQpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbihjb21wb25lbnQpO1xuICAgICAgdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKS5yZWdpc3RlckRlc2NyaXB0aW9uKGNvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQubGF5ZXJTZXJ2aWNlID0gdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKTtcbiAgICAgIGNvbXBvbmVudC5zZXRMYXllclNlcnZpY2UodGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGF5ZXJTZXJ2aWNlKGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy5sYXllclNlcnZpY2UgPSBsYXllclNlcnZpY2U7XG4gIH1cblxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IHN0cmluZywgY29udGV4dEVudGl0eTogYW55KSB7XG4gICAgY29uc3QgZ2V0ID0gX2dldDtcbiAgICBjb25zdCBlbnRpdGllc0FycmF5OiBhbnlbXSA9IGdldChjb250ZXh0LCB0aGlzLmFycmF5UGF0aCk7XG4gICAgaWYgKCFlbnRpdGllc0FycmF5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHByZXZpb3VzRW50aXRpZXNJZEFycmF5ID0gdGhpcy5lbnRpdGllc01hcC5nZXQoaWQpO1xuICAgIGNvbnN0IGVudGl0aWVzSWRBcnJheTogYW55W10gPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLnNldChpZCwgZW50aXRpZXNJZEFycmF5KTtcblxuICAgIGVudGl0aWVzQXJyYXkuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHRbdGhpcy5lbnRpdHlOYW1lXSA9IGl0ZW07XG4gICAgICBjb25zdCBhcnJheUl0ZW1JZCA9IHRoaXMuZ2VuZXJhdGVDb21iaW5lZElkKGlkLCBpdGVtLCBpbmRleCk7XG4gICAgICBlbnRpdGllc0lkQXJyYXkucHVzaChhcnJheUl0ZW1JZCk7XG4gICAgICB0aGlzLmxheWVyLnVwZGF0ZShjb250ZXh0RW50aXR5LCBhcnJheUl0ZW1JZCk7XG4gICAgfSk7XG5cbiAgICBpZiAocHJldmlvdXNFbnRpdGllc0lkQXJyYXkpIHtcbiAgICAgIGNvbnN0IGVudGl0aWVzVG9SZW1vdmUgPSB0aGlzLmlkR2V0dGVyID9cbiAgICAgICAgcHJldmlvdXNFbnRpdGllc0lkQXJyYXkuZmlsdGVyKChlbnRpdHlJZCkgPT4gZW50aXRpZXNJZEFycmF5LmluZGV4T2YoZW50aXR5SWQpIDwgMCkgOlxuICAgICAgICBwcmV2aW91c0VudGl0aWVzSWRBcnJheTtcbiAgICAgIGlmIChlbnRpdGllc1RvUmVtb3ZlKSB7XG4gICAgICAgIGVudGl0aWVzVG9SZW1vdmUuZm9yRWFjaCgoZW50aXR5SWQpID0+IHRoaXMubGF5ZXIucmVtb3ZlKGVudGl0eUlkKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbnRpdGllc0lkQXJyYXkgPSB0aGlzLmVudGl0aWVzTWFwLmdldChpZCk7XG4gICAgaWYgKGVudGl0aWVzSWRBcnJheSkge1xuICAgICAgZW50aXRpZXNJZEFycmF5LmZvckVhY2goKGVudGl0eUlkKSA9PiB0aGlzLmxheWVyLnJlbW92ZShlbnRpdHlJZCkpO1xuICAgIH1cbiAgICB0aGlzLmVudGl0aWVzTWFwLmRlbGV0ZShpZCk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5sYXllci5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLmVudGl0aWVzTWFwLmNsZWFyKCk7XG4gIH1cblxuICBnZXRBY0ZvclN0cmluZygpIHtcbiAgICByZXR1cm4gYGxldCAke3RoaXMuZW50aXR5TmFtZSArICdfX190ZW1wJ30gb2YgYXJyYXlPYnNlcnZhYmxlJGA7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlQ29tYmluZWRJZChlbnRpdHlJZDogc3RyaW5nLCBhcnJheUl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IGFycmF5SXRlbUlkO1xuICAgIGlmICh0aGlzLmlkR2V0dGVyKSB7XG4gICAgICBhcnJheUl0ZW1JZCA9IHRoaXMuaWRHZXR0ZXIoYXJyYXlJdGVtLCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5SXRlbUlkID0gKHRoaXMuaWQrKykgJSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICB9XG4gICAgcmV0dXJuIGVudGl0eUlkICsgYXJyYXlJdGVtSWQ7XG4gIH1cbn1cbiJdfQ==