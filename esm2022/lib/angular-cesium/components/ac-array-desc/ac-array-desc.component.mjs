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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcArrayDescComponent, deps: [{ token: i1.LayerService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcArrayDescComponent, selector: "ac-array-desc", inputs: { acFor: "acFor", idGetter: "idGetter", show: "show" }, queries: [{ propertyName: "basicDescs", predicate: BasicDesc }, { propertyName: "arrayDescs", predicate: AcArrayDescComponent }], viewQueries: [{ propertyName: "layer", first: true, predicate: ["layer"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `, isInline: true, dependencies: [{ kind: "component", type: i2.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcArrayDescComponent, decorators: [{
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
        }], ctorParameters: () => [{ type: i1.LayerService }, { type: i0.ChangeDetectorRef }], propDecorators: { acFor: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJyYXktZGVzYy9hYy1hcnJheS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUtMLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUduQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7QUFFekU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdCRztBQWVILE1BQU0sT0FBTyxvQkFBb0I7SUFrQi9CLFlBQW1CLFlBQTBCLEVBQVUsRUFBcUI7UUFBekQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVpuRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBSWIsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUUxQyxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ0UsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBR25ELHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO0lBR2pELENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtR0FBbUcsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUNwSSxDQUFDO1lBQ0QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDN0MsQ0FBQztRQUVELElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDOUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFvQixFQUFFLEVBQUU7WUFDeEQsU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQStCLEVBQUUsRUFBRTtZQUNuRSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3RELFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QyxDQUFDO0lBQ0gsQ0FBQztJQUVELGVBQWUsQ0FBQyxZQUEwQjtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQVksRUFBRSxFQUFVLEVBQUUsYUFBa0I7UUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLE1BQU0sYUFBYSxHQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNuQixPQUFPO1FBQ1QsQ0FBQztRQUNELE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekQsTUFBTSxlQUFlLEdBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUUxQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDN0QsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUF1QixFQUFFLENBQUM7WUFDNUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRix1QkFBdUIsQ0FBQztZQUMxQixJQUFJLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3JCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNmLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksZUFBZSxFQUFFLENBQUM7WUFDcEIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLE9BQU8sSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLHNCQUFzQixDQUFDO0lBQ2xFLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLFNBQWMsRUFBRSxLQUFhO1FBQ3hFLElBQUksV0FBVyxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRCxDQUFDO2FBQU0sQ0FBQztZQUNOLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsT0FBTyxRQUFRLEdBQUcsV0FBVyxDQUFDO0lBQ2hDLENBQUM7OEdBeEhVLG9CQUFvQjtrR0FBcEIsb0JBQW9CLGdKQVFkLFNBQVMsNkNBQ1Qsb0JBQW9CLGdLQXBCM0I7Ozs7Ozs7O0dBUVQ7OzJGQUdVLG9CQUFvQjtrQkFiaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFOzs7Ozs7OztHQVFUO29CQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDtpSEFHVSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ3NDLEtBQUs7c0JBQWhELFNBQVM7dUJBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDd0IsVUFBVTtzQkFBbkUsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFDO2dCQUNxQixVQUFVO3NCQUE5RSxlQUFlO3VCQUFDLG9CQUFvQixFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xuaW1wb3J0ICogYXMgX2dldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGNvbXBvbmVudCByZXByZXNlbnRzIGFuIGFycmF5IHVuZGVyIGBhYy1sYXllcmAuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgKyBhY0ZvciBge3N0cmluZ31gIC0gZ2V0IHRoZSB0cmFja2VkIGFycmF5IGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxuICogICsgaWRHZXR0ZXIgYHtGdW5jdGlvbn1gIC0gYSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIGlkIGZvciBhIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGFycmF5IC1zaG91bGQgYmUgZGVmaW5lZCBmb3IgbWF4aW11bSBwZXJmb3JtYW5jZS5cbiAqICArIHNob3cgYHtib29sZWFufWAgLSBzaG93L2hpZGUgYXJyYXkncyBlbnRpdGllcy5cbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqPGFjLWxheWVyIGFjRm9yPVwibGV0IHRyYWNrIG9mIHRyYWNrcyRcIiBbc2hvd109XCJzaG93XCIgW2NvbnRleHRdPVwidGhpc1wiIFtzdG9yZV09XCJ0cnVlXCI+XG4gKiAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgYXJyYXlJdGVtIG9mIHRyYWNrLmFycmF5XCIgW2lkR2V0dGVyXT1cInRyYWNrQXJyYXlJZEdldHRlclwiPlxuICogICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgaW5uZXJBcnJheUl0ZW0gb2YgYXJyYXlJdGVtLmlubmVyQXJyYXlcIiBbaWRHZXR0ZXJdPVwidHJhY2tBcnJheUlkR2V0dGVyXCI+XG4gKiAgICAgIDxhYy1wb2ludC1kZXNjIHByb3BzPVwie1xuICogICAgICAgIHBvc2l0aW9uOiBpbm5lckFycmF5SXRlbS5wb3MsXG4gKiAgICAgICAgcGl4ZWxTaXplOiAxMCxcbiAqICAgICAgICBjb2xvcjogZ2V0VHJhY2tDb2xvcih0cmFjayksXG4gKiAgICAgICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxVRSxcbiAqICAgICAgICBvdXRsaW5lV2lkdGg6IDFcbiAqICAgICAgfVwiPlxuICogICAgICA8L2FjLXBvaW50LWRlc2M+XG4gKiAgICA8L2FjLWFycmF5LWRlc2M+XG4gKiAgPC9hYy1hcnJheS1kZXNjPlxuICo8L2FjLWxheWVyPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFycmF5LWRlc2MnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhYy1sYXllciAjbGF5ZXIgW2FjRm9yXT1cImdldEFjRm9yU3RyaW5nKClcIlxuICAgICAgICAgICAgICBbY29udGV4dF09XCJsYXllclNlcnZpY2UuY29udGV4dFwiXG4gICAgICAgICAgICAgIFtvcHRpb25zXT1cImxheWVyU2VydmljZS5vcHRpb25zXCJcbiAgICAgICAgICAgICAgW3Nob3ddPVwibGF5ZXJTZXJ2aWNlLnNob3cgJiYgc2hvd1wiXG4gICAgICAgICAgICAgIFt6SW5kZXhdPVwibGF5ZXJTZXJ2aWNlLnpJbmRleFwiPlxuICAgICAgPG5nLWNvbnRlbnQgI2NvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBBY0FycmF5RGVzY0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksIElEZXNjcmlwdGlvbiB7XG5cbiAgQElucHV0KCkgYWNGb3I6IHN0cmluZztcblxuICBASW5wdXQoKSBpZEdldHRlcjogKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4gc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHNob3cgPSB0cnVlO1xuICBAVmlld0NoaWxkKCdsYXllcicsIHtzdGF0aWM6IHRydWV9KSBwcml2YXRlIGxheWVyOiBBY0xheWVyQ29tcG9uZW50O1xuICBAQ29udGVudENoaWxkcmVuKEJhc2ljRGVzYywge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHByaXZhdGUgYmFzaWNEZXNjczogYW55O1xuICBAQ29udGVudENoaWxkcmVuKEFjQXJyYXlEZXNjQ29tcG9uZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgcHJpdmF0ZSBhcnJheURlc2NzOiBhbnk7XG4gIHByaXZhdGUgZW50aXRpZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nW10+KCk7XG4gIHByaXZhdGUgbGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgaWQgPSAwO1xuICBwcml2YXRlIHJlYWRvbmx5IGFjRm9yUmd4ID0gL15sZXRcXHMrLitcXHMrb2ZcXHMrLiskLztcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xuICBhcnJheVBhdGg6IHN0cmluZztcbiAgYXJyYXlPYnNlcnZhYmxlJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1snYWNGb3InXS5maXJzdENoYW5nZSkge1xuICAgICAgY29uc3QgYWNGb3JTdHJpbmcgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICghdGhpcy5hY0ZvclJneC50ZXN0KGFjRm9yU3RyaW5nKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGFjLWxheWVyOiBJbnZhbGlkIFthY0Zvcl0gc3ludGF4LiBFeHBlY3RlZDogW2FjRm9yXT1cImxldCBpdGVtIG9mIG9ic2VydmFibGVcIiAuSW5zdGVhZCByZWNlaXZlZDogJHthY0ZvclN0cmluZ31gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFjRm9yQXJyID0gY2hhbmdlc1snYWNGb3InXS5jdXJyZW50VmFsdWUuc3BsaXQoJyAnKTtcbiAgICAgIHRoaXMuYXJyYXlQYXRoID0gYWNGb3JBcnJbM107XG4gICAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sYXllcikge1xuICAgICAgdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKS5jYWNoZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uID0gdGhpcy5sYXllclNlcnZpY2UubGF5ZXJVcGRhdGVzKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHRbJ2FycmF5T2JzZXJ2YWJsZSQnXSA9IHRoaXMuYXJyYXlPYnNlcnZhYmxlJDtcbiAgICB0aGlzLmxheWVyU2VydmljZS5yZWdpc3RlckRlc2NyaXB0aW9uKHRoaXMpO1xuICAgIHRoaXMuYmFzaWNEZXNjcy5fcmVzdWx0cy5mb3JFYWNoKChjb21wb25lbnQ6IEJhc2ljRGVzYykgPT4ge1xuICAgICAgY29tcG9uZW50LnNldExheWVyU2VydmljZSh0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpKTtcbiAgICB9KTtcbiAgICB0aGlzLmFycmF5RGVzY3MuX3Jlc3VsdHMuc3BsaWNlKDAsIDEpO1xuICAgIHRoaXMuYXJyYXlEZXNjcy5fcmVzdWx0cy5mb3JFYWNoKChjb21wb25lbnQ6IEFjQXJyYXlEZXNjQ29tcG9uZW50KSA9PiB7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS51bnJlZ2lzdGVyRGVzY3JpcHRpb24oY29tcG9uZW50KTtcbiAgICAgIHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkucmVnaXN0ZXJEZXNjcmlwdGlvbihjb21wb25lbnQpO1xuICAgICAgY29tcG9uZW50LmxheWVyU2VydmljZSA9IHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCk7XG4gICAgICBjb21wb25lbnQuc2V0TGF5ZXJTZXJ2aWNlKHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxheWVyU2VydmljZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldExheWVyU2VydmljZShsYXllclNlcnZpY2U6IExheWVyU2VydmljZSkge1xuICAgIHRoaXMubGF5ZXJTZXJ2aWNlID0gbGF5ZXJTZXJ2aWNlO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0OiBhbnksIGlkOiBzdHJpbmcsIGNvbnRleHRFbnRpdHk6IGFueSkge1xuICAgIGNvbnN0IGdldCA9IF9nZXQ7XG4gICAgY29uc3QgZW50aXRpZXNBcnJheTogYW55W10gPSBnZXQoY29udGV4dCwgdGhpcy5hcnJheVBhdGgpO1xuICAgIGlmICghZW50aXRpZXNBcnJheSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwcmV2aW91c0VudGl0aWVzSWRBcnJheSA9IHRoaXMuZW50aXRpZXNNYXAuZ2V0KGlkKTtcbiAgICBjb25zdCBlbnRpdGllc0lkQXJyYXk6IGFueVtdID0gW107XG4gICAgdGhpcy5lbnRpdGllc01hcC5zZXQoaWQsIGVudGl0aWVzSWRBcnJheSk7XG5cbiAgICBlbnRpdGllc0FycmF5LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0W3RoaXMuZW50aXR5TmFtZV0gPSBpdGVtO1xuICAgICAgY29uc3QgYXJyYXlJdGVtSWQgPSB0aGlzLmdlbmVyYXRlQ29tYmluZWRJZChpZCwgaXRlbSwgaW5kZXgpO1xuICAgICAgZW50aXRpZXNJZEFycmF5LnB1c2goYXJyYXlJdGVtSWQpO1xuICAgICAgdGhpcy5sYXllci51cGRhdGUoY29udGV4dEVudGl0eSwgYXJyYXlJdGVtSWQpO1xuICAgIH0pO1xuXG4gICAgaWYgKHByZXZpb3VzRW50aXRpZXNJZEFycmF5KSB7XG4gICAgICBjb25zdCBlbnRpdGllc1RvUmVtb3ZlID0gdGhpcy5pZEdldHRlciA/XG4gICAgICAgIHByZXZpb3VzRW50aXRpZXNJZEFycmF5LmZpbHRlcigoZW50aXR5SWQpID0+IGVudGl0aWVzSWRBcnJheS5pbmRleE9mKGVudGl0eUlkKSA8IDApIDpcbiAgICAgICAgcHJldmlvdXNFbnRpdGllc0lkQXJyYXk7XG4gICAgICBpZiAoZW50aXRpZXNUb1JlbW92ZSkge1xuICAgICAgICBlbnRpdGllc1RvUmVtb3ZlLmZvckVhY2goKGVudGl0eUlkKSA9PiB0aGlzLmxheWVyLnJlbW92ZShlbnRpdHlJZCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgZW50aXRpZXNJZEFycmF5ID0gdGhpcy5lbnRpdGllc01hcC5nZXQoaWQpO1xuICAgIGlmIChlbnRpdGllc0lkQXJyYXkpIHtcbiAgICAgIGVudGl0aWVzSWRBcnJheS5mb3JFYWNoKChlbnRpdHlJZCkgPT4gdGhpcy5sYXllci5yZW1vdmUoZW50aXR5SWQpKTtcbiAgICB9XG4gICAgdGhpcy5lbnRpdGllc01hcC5kZWxldGUoaWQpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMubGF5ZXIucmVtb3ZlQWxsKCk7XG4gICAgdGhpcy5lbnRpdGllc01hcC5jbGVhcigpO1xuICB9XG5cbiAgZ2V0QWNGb3JTdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBsZXQgJHt0aGlzLmVudGl0eU5hbWUgKyAnX19fdGVtcCd9IG9mIGFycmF5T2JzZXJ2YWJsZSRgO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNvbWJpbmVkSWQoZW50aXR5SWQ6IHN0cmluZywgYXJyYXlJdGVtOiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGxldCBhcnJheUl0ZW1JZDtcbiAgICBpZiAodGhpcy5pZEdldHRlcikge1xuICAgICAgYXJyYXlJdGVtSWQgPSB0aGlzLmlkR2V0dGVyKGFycmF5SXRlbSwgaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnJheUl0ZW1JZCA9ICh0aGlzLmlkKyspICUgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHlJZCArIGFycmF5SXRlbUlkO1xuICB9XG59XG4iXX0=