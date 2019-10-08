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
export class AcArrayDescComponent {
    /**
     * @param {?} layerService
     * @param {?} cd
     */
    constructor(layerService, cd) {
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
    ngOnChanges(changes) {
        if (changes['acFor'].firstChange) {
            /** @type {?} */
            const acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
            }
            /** @type {?} */
            const acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.layer.getLayerService().cache = false;
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe((/**
         * @return {?}
         */
        () => {
            this.cd.detectChanges();
        }));
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        (component) => {
            component.setLayerService(this.layer.getLayerService());
        }));
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((/**
         * @param {?} component
         * @return {?}
         */
        (component) => {
            this.layerService.unregisterDescription(component);
            this.layer.getLayerService().registerDescription(component);
            component.layerService = this.layer.getLayerService();
            component.setLayerService(this.layer.getLayerService());
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    }
    /**
     * @param {?} layerService
     * @return {?}
     */
    setLayerService(layerService) {
        this.layerService = layerService;
    }
    /**
     * @param {?} context
     * @param {?} id
     * @param {?} contextEntity
     * @return {?}
     */
    draw(context, id, contextEntity) {
        /** @type {?} */
        const get = _get;
        /** @type {?} */
        const entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        /** @type {?} */
        const previousEntitiesIdArray = this.entitiesMap.get(id);
        /** @type {?} */
        const entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            this.layerService.context[this.entityName] = item;
            /** @type {?} */
            const arrayItemId = this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            this.layer.update(contextEntity, arrayItemId);
        }));
        if (previousEntitiesIdArray) {
            /** @type {?} */
            const entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                (entityId) => entitiesIdArray.indexOf(entityId) < 0)) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((/**
                 * @param {?} entityId
                 * @return {?}
                 */
                (entityId) => this.layer.remove(entityId)));
            }
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    remove(id) {
        /** @type {?} */
        const entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((/**
             * @param {?} entityId
             * @return {?}
             */
            (entityId) => this.layer.remove(entityId)));
        }
        this.entitiesMap.delete(id);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.layer.removeAll();
        this.entitiesMap.clear();
    }
    /**
     * @return {?}
     */
    getAcForString() {
        return `let ${this.entityName + '___temp'} of arrayObservable$`;
    }
    /**
     * @private
     * @param {?} entityId
     * @param {?} arrayItem
     * @param {?} index
     * @return {?}
     */
    generateCombinedId(entityId, arrayItem, index) {
        /** @type {?} */
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
AcArrayDescComponent.decorators = [
    { type: Component, args: [{
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
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
/** @nocollapse */
AcArrayDescComponent.ctorParameters = () => [
    { type: LayerService },
    { type: ChangeDetectorRef }
];
AcArrayDescComponent.propDecorators = {
    acFor: [{ type: Input }],
    idGetter: [{ type: Input }],
    show: [{ type: Input }],
    layer: [{ type: ViewChild, args: ['layer',] }],
    basicDescs: [{ type: ContentChildren, args: [BasicDesc, { descendants: false },] }],
    arrayDescs: [{ type: ContentChildren, args: [AcArrayDescComponent, { descendants: false },] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFycmF5LWRlc2MvYWMtYXJyYXktZGVzYy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUtMLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDekUsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7SUFrQi9CLFlBQW1CLFlBQTBCLEVBQVUsRUFBcUI7UUFBekQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVpuRSxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBSWIsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUUxQyxPQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ0UsYUFBUSxHQUFHLHNCQUFzQixDQUFDO1FBR25ELHFCQUFnQixHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO0lBR2pELENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRTs7a0JBQzFCLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWTtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUdBQW1HLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDbkk7O2tCQUNLLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMzQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDOUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxTQUFvQixFQUFFLEVBQUU7WUFDeEQsU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLFNBQStCLEVBQUUsRUFBRTtZQUNuRSxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUQsU0FBUyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3RELFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQzFELENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUNqQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDN0M7SUFDSCxDQUFDOzs7OztJQUVELGVBQWUsQ0FBQyxZQUEwQjtRQUN4QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNuQyxDQUFDOzs7Ozs7O0lBRUQsSUFBSSxDQUFDLE9BQVksRUFBRSxFQUFVLEVBQUUsYUFBa0I7O2NBQ3pDLEdBQUcsR0FBRyxJQUFJOztjQUNWLGFBQWEsR0FBVSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDekQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixPQUFPO1NBQ1I7O2NBQ0ssdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDOztjQUNsRCxlQUFlLEdBQVUsRUFBRTtRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFMUMsYUFBYSxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQzs7a0JBQzVDLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7WUFDNUQsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDaEQsQ0FBQyxFQUFDLENBQUM7UUFFSCxJQUFJLHVCQUF1QixFQUFFOztrQkFDckIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0Qyx1QkFBdUIsQ0FBQyxNQUFNOzs7O2dCQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7Z0JBQ3JGLHVCQUF1QjtZQUN6QixJQUFJLGdCQUFnQixFQUFFO2dCQUNwQixnQkFBZ0IsQ0FBQyxPQUFPOzs7O2dCQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDO2FBQ3JFO1NBQ0Y7SUFDSCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxFQUFVOztjQUNULGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDaEQsSUFBSSxlQUFlLEVBQUU7WUFDbkIsZUFBZSxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUMsQ0FBQztTQUNwRTtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1osT0FBTyxPQUFPLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxzQkFBc0IsQ0FBQztJQUNsRSxDQUFDOzs7Ozs7OztJQUVPLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsU0FBYyxFQUFFLEtBQWE7O1lBQ3BFLFdBQVc7UUFDZixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9DO2FBQU07WUFDTCxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7U0FDckQ7UUFDRCxPQUFPLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDaEMsQ0FBQzs7O1lBbElGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFOzs7Ozs7OztHQVFUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7O1lBekNRLFlBQVk7WUFmbkIsaUJBQWlCOzs7b0JBMkRoQixLQUFLO3VCQUVMLEtBQUs7bUJBRUwsS0FBSztvQkFDTCxTQUFTLFNBQUMsT0FBTzt5QkFDakIsZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7eUJBQy9DLGVBQWUsU0FBQyxvQkFBb0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7Ozs7SUFQM0QscUNBQXVCOztJQUV2Qix3Q0FBd0Q7O0lBRXhELG9DQUFxQjs7Ozs7SUFDckIscUNBQW9EOzs7OztJQUNwRCwwQ0FBMEU7Ozs7O0lBQzFFLDBDQUFxRjs7Ozs7SUFDckYsMkNBQWtEOzs7OztJQUNsRCx3REFBK0M7Ozs7O0lBQy9DLGtDQUFlOzs7OztJQUNmLHdDQUFtRDs7SUFDbkQsMENBQW1COztJQUNuQix5Q0FBa0I7O0lBQ2xCLGdEQUFpRDs7SUFFckMsNENBQWlDOzs7OztJQUFFLGtDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY05vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1ub3RpZmljYXRpb24nO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xuaW1wb3J0ICogYXMgX2dldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCB7IEFjTGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi9hYy1sYXllci9hYy1sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xuXG4vKipcbiAqICBUaGlzIGlzIGNvbXBvbmVudCByZXByZXNlbnRzIGFuIGFycmF5IHVuZGVyIGBhYy1sYXllcmAuXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLWxheWVyIGVsZW1lbnQuXG4gKiAgKyBhY0ZvciBge3N0cmluZ31gIC0gZ2V0IHRoZSB0cmFja2VkIGFycmF5IGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxuICogICsgaWRHZXR0ZXIgYHtGdW5jdGlvbn1gIC0gYSBmdW5jdGlvbiB0aGF0IGdldHMgdGhlIGlkIGZvciBhIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGFycmF5IC1zaG91bGQgYmUgZGVmaW5lZCBmb3IgbWF4aW11bSBwZXJmb3JtYW5jZS5cbiAqICArIHNob3cgYHtib29sZWFufWAgLSBzaG93L2hpZGUgYXJyYXkncyBlbnRpdGllcy5cbiAqXG4gKiAgX19Vc2FnZSA6X19cbiAqICBgYGBcbiAqPGFjLWxheWVyIGFjRm9yPVwibGV0IHRyYWNrIG9mIHRyYWNrcyRcIiBbc2hvd109XCJzaG93XCIgW2NvbnRleHRdPVwidGhpc1wiIFtzdG9yZV09XCJ0cnVlXCI+XG4gKiAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgYXJyYXlJdGVtIG9mIHRyYWNrLmFycmF5XCIgW2lkR2V0dGVyXT1cInRyYWNrQXJyYXlJZEdldHRlclwiPlxuICogICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgaW5uZXJBcnJheUl0ZW0gb2YgYXJyYXlJdGVtLmlubmVyQXJyYXlcIiBbaWRHZXR0ZXJdPVwidHJhY2tBcnJheUlkR2V0dGVyXCI+XG4gKiAgICAgIDxhYy1wb2ludC1kZXNjIHByb3BzPVwie1xuICogICAgICAgIHBvc2l0aW9uOiBpbm5lckFycmF5SXRlbS5wb3MsXG4gKiAgICAgICAgcGl4ZWxTaXplOiAxMCxcbiAqICAgICAgICBjb2xvcjogZ2V0VHJhY2tDb2xvcih0cmFjayksXG4gKiAgICAgICAgb3V0bGluZUNvbG9yOiBDZXNpdW0uQ29sb3IuQkxVRSxcbiAqICAgICAgICBvdXRsaW5lV2lkdGg6IDFcbiAqICAgICAgfVwiPlxuICogICAgICA8L2FjLXBvaW50LWRlc2M+XG4gKiAgICA8L2FjLWFycmF5LWRlc2M+XG4gKiAgPC9hYy1hcnJheS1kZXNjPlxuICo8L2FjLWxheWVyPlxuICogIGBgYFxuICovXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLWFycmF5LWRlc2MnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhYy1sYXllciAjbGF5ZXIgW2FjRm9yXT1cImdldEFjRm9yU3RyaW5nKClcIlxuICAgICAgICAgICAgICBbY29udGV4dF09XCJsYXllclNlcnZpY2UuY29udGV4dFwiXG4gICAgICAgICAgICAgIFtvcHRpb25zXT1cImxheWVyU2VydmljZS5vcHRpb25zXCJcbiAgICAgICAgICAgICAgW3Nob3ddPVwibGF5ZXJTZXJ2aWNlLnNob3cgJiYgc2hvd1wiXG4gICAgICAgICAgICAgIFt6SW5kZXhdPVwibGF5ZXJTZXJ2aWNlLnpJbmRleFwiPlxuICAgICAgPG5nLWNvbnRlbnQgI2NvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvYWMtbGF5ZXI+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBBY0FycmF5RGVzY0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3ksIElEZXNjcmlwdGlvbiB7XG5cbiAgQElucHV0KCkgYWNGb3I6IHN0cmluZztcblxuICBASW5wdXQoKSBpZEdldHRlcjogKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4gc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHNob3cgPSB0cnVlO1xuICBAVmlld0NoaWxkKCdsYXllcicpIHByaXZhdGUgbGF5ZXI6IEFjTGF5ZXJDb21wb25lbnQ7XG4gIEBDb250ZW50Q2hpbGRyZW4oQmFzaWNEZXNjLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgcHJpdmF0ZSBiYXNpY0Rlc2NzOiBhbnk7XG4gIEBDb250ZW50Q2hpbGRyZW4oQWNBcnJheURlc2NDb21wb25lbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBwcml2YXRlIGFycmF5RGVzY3M6IGFueTtcbiAgcHJpdmF0ZSBlbnRpdGllc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgcHJpdmF0ZSBsYXllclNlcnZpY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBpZCA9IDA7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWNGb3JSZ3ggPSAvXmxldFxccysuK1xccytvZlxccysuKyQvO1xuICBlbnRpdHlOYW1lOiBzdHJpbmc7XG4gIGFycmF5UGF0aDogc3RyaW5nO1xuICBhcnJheU9ic2VydmFibGUkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydhY0ZvciddLmZpcnN0Q2hhbmdlKSB7XG4gICAgICBjb25zdCBhY0ZvclN0cmluZyA9IGNoYW5nZXNbJ2FjRm9yJ10uY3VycmVudFZhbHVlO1xuICAgICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QoYWNGb3JTdHJpbmcpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke2FjRm9yU3RyaW5nfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgYWNGb3JBcnIgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZS5zcGxpdCgnICcpO1xuICAgICAgdGhpcy5hcnJheVBhdGggPSBhY0ZvckFyclszXTtcbiAgICAgIHRoaXMuZW50aXR5TmFtZSA9IGFjRm9yQXJyWzFdO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCkuY2FjaGUgPSBmYWxzZTtcbiAgICB0aGlzLmxheWVyU2VydmljZVN1YnNjcmlwdGlvbiA9IHRoaXMubGF5ZXJTZXJ2aWNlLmxheWVyVXBkYXRlcygpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0WydhcnJheU9ic2VydmFibGUkJ10gPSB0aGlzLmFycmF5T2JzZXJ2YWJsZSQ7XG4gICAgdGhpcy5sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcbiAgICB0aGlzLmJhc2ljRGVzY3MuX3Jlc3VsdHMuZm9yRWFjaCgoY29tcG9uZW50OiBCYXNpY0Rlc2MpID0+IHtcbiAgICAgIGNvbXBvbmVudC5zZXRMYXllclNlcnZpY2UodGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKSk7XG4gICAgfSk7XG4gICAgdGhpcy5hcnJheURlc2NzLl9yZXN1bHRzLnNwbGljZSgwLCAxKTtcbiAgICB0aGlzLmFycmF5RGVzY3MuX3Jlc3VsdHMuZm9yRWFjaCgoY29tcG9uZW50OiBBY0FycmF5RGVzY0NvbXBvbmVudCkgPT4ge1xuICAgICAgdGhpcy5sYXllclNlcnZpY2UudW5yZWdpc3RlckRlc2NyaXB0aW9uKGNvbXBvbmVudCk7XG4gICAgICB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpLnJlZ2lzdGVyRGVzY3JpcHRpb24oY29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5sYXllclNlcnZpY2UgPSB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpO1xuICAgICAgY29tcG9uZW50LnNldExheWVyU2VydmljZSh0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxheWVyU2VydmljZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sYXllclNlcnZpY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBzZXRMYXllclNlcnZpY2UobGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UpIHtcbiAgICB0aGlzLmxheWVyU2VydmljZSA9IGxheWVyU2VydmljZTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBjb250ZXh0RW50aXR5OiBhbnkpIHtcbiAgICBjb25zdCBnZXQgPSBfZ2V0O1xuICAgIGNvbnN0IGVudGl0aWVzQXJyYXk6IGFueVtdID0gZ2V0KGNvbnRleHQsIHRoaXMuYXJyYXlQYXRoKTtcbiAgICBpZiAoIWVudGl0aWVzQXJyYXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcHJldmlvdXNFbnRpdGllc0lkQXJyYXkgPSB0aGlzLmVudGl0aWVzTWFwLmdldChpZCk7XG4gICAgY29uc3QgZW50aXRpZXNJZEFycmF5OiBhbnlbXSA9IFtdO1xuICAgIHRoaXMuZW50aXRpZXNNYXAuc2V0KGlkLCBlbnRpdGllc0lkQXJyYXkpO1xuXG4gICAgZW50aXRpZXNBcnJheS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5sYXllclNlcnZpY2UuY29udGV4dFt0aGlzLmVudGl0eU5hbWVdID0gaXRlbTtcbiAgICAgIGNvbnN0IGFycmF5SXRlbUlkID0gdGhpcy5nZW5lcmF0ZUNvbWJpbmVkSWQoaWQsIGl0ZW0sIGluZGV4KTtcbiAgICAgIGVudGl0aWVzSWRBcnJheS5wdXNoKGFycmF5SXRlbUlkKTtcbiAgICAgIHRoaXMubGF5ZXIudXBkYXRlKGNvbnRleHRFbnRpdHksIGFycmF5SXRlbUlkKTtcbiAgICB9KTtcblxuICAgIGlmIChwcmV2aW91c0VudGl0aWVzSWRBcnJheSkge1xuICAgICAgY29uc3QgZW50aXRpZXNUb1JlbW92ZSA9IHRoaXMuaWRHZXR0ZXIgP1xuICAgICAgICBwcmV2aW91c0VudGl0aWVzSWRBcnJheS5maWx0ZXIoKGVudGl0eUlkKSA9PiBlbnRpdGllc0lkQXJyYXkuaW5kZXhPZihlbnRpdHlJZCkgPCAwKSA6XG4gICAgICAgIHByZXZpb3VzRW50aXRpZXNJZEFycmF5O1xuICAgICAgaWYgKGVudGl0aWVzVG9SZW1vdmUpIHtcbiAgICAgICAgZW50aXRpZXNUb1JlbW92ZS5mb3JFYWNoKChlbnRpdHlJZCkgPT4gdGhpcy5sYXllci5yZW1vdmUoZW50aXR5SWQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW1vdmUoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IGVudGl0aWVzSWRBcnJheSA9IHRoaXMuZW50aXRpZXNNYXAuZ2V0KGlkKTtcbiAgICBpZiAoZW50aXRpZXNJZEFycmF5KSB7XG4gICAgICBlbnRpdGllc0lkQXJyYXkuZm9yRWFjaCgoZW50aXR5SWQpID0+IHRoaXMubGF5ZXIucmVtb3ZlKGVudGl0eUlkKSk7XG4gICAgfVxuICAgIHRoaXMuZW50aXRpZXNNYXAuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmxheWVyLnJlbW92ZUFsbCgpO1xuICAgIHRoaXMuZW50aXRpZXNNYXAuY2xlYXIoKTtcbiAgfVxuXG4gIGdldEFjRm9yU3RyaW5nKCkge1xuICAgIHJldHVybiBgbGV0ICR7dGhpcy5lbnRpdHlOYW1lICsgJ19fX3RlbXAnfSBvZiBhcnJheU9ic2VydmFibGUkYDtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVDb21iaW5lZElkKGVudGl0eUlkOiBzdHJpbmcsIGFycmF5SXRlbTogYW55LCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBsZXQgYXJyYXlJdGVtSWQ7XG4gICAgaWYgKHRoaXMuaWRHZXR0ZXIpIHtcbiAgICAgIGFycmF5SXRlbUlkID0gdGhpcy5pZEdldHRlcihhcnJheUl0ZW0sIGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlJdGVtSWQgPSAodGhpcy5pZCsrKSAlIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIH1cbiAgICByZXR1cm4gZW50aXR5SWQgKyBhcnJheUl0ZW1JZDtcbiAgfVxufVxuIl19