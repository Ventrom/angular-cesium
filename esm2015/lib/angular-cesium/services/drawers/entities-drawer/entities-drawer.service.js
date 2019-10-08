/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { OptimizedEntityCollection } from './optimized-entity-collection';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
export class EntitiesDrawerService extends BasicDrawerService {
    /**
     * @param {?} cesiumService
     * @param {?} graphicsType
     * @param {?=} defaultOptions
     */
    constructor(cesiumService, graphicsType, defaultOptions = {
        collectionMaxSize: -1,
        collectionSuspensionTime: -1,
        collectionsNumber: 1,
    }) {
        super();
        this.cesiumService = cesiumService;
        this.graphicsType = graphicsType;
        this.defaultOptions = defaultOptions;
        this.entityCollections = new Map();
        this.graphicsTypeName = GraphicsType[this.graphicsType];
        // Fix bad enum compilation
        for (const i in GraphicsType) {
            if ((/** @type {?} */ (GraphicsType[i])) === this.graphicsType) {
                this.graphicsTypeName = i;
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    getFreeEntitiesCollection() {
        /** @type {?} */
        let freeEntityCollection = null;
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        }));
        return freeEntityCollection;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    init(options) {
        /** @type {?} */
        const finalOptions = options || this.defaultOptions;
        /** @type {?} */
        const dataSources = [];
        for (let i = 0; i < finalOptions.collectionsNumber; i++) {
            /** @type {?} */
            const dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    }
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        /** @type {?} */
        const optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        /** @type {?} */
        const graphicsClass = (/** @type {?} */ (this.graphicsType));
        /** @type {?} */
        const entityObject = {
            position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
            description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
            orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
            viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined,
            [this.graphicsTypeName]: cesiumProps,
        };
        if (cesiumProps.name !== undefined) {
            entityObject.name = cesiumProps.name;
        }
        return optimizedEntityCollection.add(entityObject);
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    update(entity, cesiumProps) {
        this.suspendEntityCollection(entity);
        if (entity.position instanceof Cesium.CallbackProperty) {
            if (entity.position._isConstant) {
                entity.position = cesiumProps.position;
            }
        }
        entity.position = cesiumProps.position !== undefined ? cesiumProps.position : undefined;
        entity.name = cesiumProps.name !== undefined ? cesiumProps.name : entity.name;
        entity.description = cesiumProps.description !== undefined ? cesiumProps.description : entity.description;
        entity.orientation = cesiumProps.orientation !== undefined ? cesiumProps.orientation : entity.orientation;
        entity.viewFrom = cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : entity.viewFrom;
        if (this._propsAssigner) {
            this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
        }
        else {
            Object.assign(entity[this.graphicsTypeName], cesiumProps);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        /** @type {?} */
        const optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            entityCollection.removeAll();
        }));
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        entityCollection => {
            entityCollection.setShow(showValue);
        }));
    }
    /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    suspendEntityCollection(entity) {
        /** @type {?} */
        const id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        /** @type {?} */
        const entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    EntitiesDrawerService.prototype.entityCollections;
    /**
     * @type {?}
     * @private
     */
    EntitiesDrawerService.prototype.graphicsTypeName;
    /**
     * @type {?}
     * @private
     */
    EntitiesDrawerService.prototype.cesiumService;
    /**
     * @type {?}
     * @private
     */
    EntitiesDrawerService.prototype.graphicsType;
    /**
     * @type {?}
     * @private
     */
    EntitiesDrawerService.prototype.defaultOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFMUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTFELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7OztBQU8xRSxNQUFNLE9BQU8scUJBQXNCLFNBQVEsa0JBQWtCOzs7Ozs7SUFJM0QsWUFDVSxhQUE0QixFQUM1QixZQUEwQixFQUMxQixpQkFBd0M7UUFDOUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLHdCQUF3QixFQUFFLENBQUMsQ0FBQztRQUM1QixpQkFBaUIsRUFBRSxDQUFDO0tBQ3JCO1FBRUQsS0FBSyxFQUFFLENBQUM7UUFSQSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixtQkFBYyxHQUFkLGNBQWMsQ0FJckI7UUFWSyxzQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztRQWFwRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV4RCwyQkFBMkI7UUFDM0IsS0FBSyxNQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDNUIsSUFBSSxtQkFBQSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQU8sS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNoRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7SUFDSCxDQUFDOzs7OztJQUVPLHlCQUF5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O1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ2hELGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQy9CLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsU0FBa0I7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ2hELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVPLHVCQUF1QixDQUFDLE1BQVc7O2NBQ25DLEVBQUUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUNwRTs7Y0FFSyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN2RCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7Ozs7OztJQXZIQyxrREFBc0U7Ozs7O0lBQ3RFLGlEQUFpQzs7Ozs7SUFHL0IsOENBQW9DOzs7OztJQUNwQyw2Q0FBa0M7Ozs7O0lBQ2xDLCtDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VudGl0aWVzLWRyYXdlci1vcHRpb25zJztcbmltcG9ydCB7IE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL29wdGltaXplZC1lbnRpdHktY29sbGVjdGlvbic7XG5cbi8qKlxuICogIEdlbmVyYWwgcHJpbWl0aXZlcyBkcmF3ZXIgcmVzcG9uc2libGUgb2YgZHJhd2luZyBDZXNpdW0gcHJpbWl0aXZlcy5cbiAqICBEcmF3ZXJzIHRoZSBoYW5kbGUgQ2VzaXVtIHByaW1pdGl2ZXMgZXh0ZW5kIGl0LlxuICovXG5cbmV4cG9ydCBjbGFzcyBFbnRpdGllc0RyYXdlclNlcnZpY2UgZXh0ZW5kcyBCYXNpY0RyYXdlclNlcnZpY2Uge1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25zID0gbmV3IE1hcDxhbnksIE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24+KCk7XG4gIHByaXZhdGUgZ3JhcGhpY3NUeXBlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICBwcml2YXRlIGdyYXBoaWNzVHlwZTogR3JhcGhpY3NUeXBlLFxuICAgIHByaXZhdGUgZGVmYXVsdE9wdGlvbnM6IEVudGl0aWVzRHJhd2VyT3B0aW9ucyA9IHtcbiAgICAgIGNvbGxlY3Rpb25NYXhTaXplOiAtMSxcbiAgICAgIGNvbGxlY3Rpb25TdXNwZW5zaW9uVGltZTogLTEsXG4gICAgICBjb2xsZWN0aW9uc051bWJlcjogMSxcbiAgICB9LFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZ3JhcGhpY3NUeXBlTmFtZSA9IEdyYXBoaWNzVHlwZVt0aGlzLmdyYXBoaWNzVHlwZV07XG5cbiAgICAvLyBGaXggYmFkIGVudW0gY29tcGlsYXRpb25cbiAgICBmb3IgKGNvbnN0IGkgaW4gR3JhcGhpY3NUeXBlKSB7XG4gICAgICBpZiAoR3JhcGhpY3NUeXBlW2ldIGFzIGFueSA9PT0gdGhpcy5ncmFwaGljc1R5cGUpIHtcbiAgICAgICAgdGhpcy5ncmFwaGljc1R5cGVOYW1lID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEZyZWVFbnRpdGllc0NvbGxlY3Rpb24oKTogT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiB7XG4gICAgbGV0IGZyZWVFbnRpdHlDb2xsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBpZiAoZW50aXR5Q29sbGVjdGlvbi5pc0ZyZWUoKSkge1xuICAgICAgICBmcmVlRW50aXR5Q29sbGVjdGlvbiA9IGVudGl0eUNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZnJlZUVudGl0eUNvbGxlY3Rpb247XG4gIH1cblxuICBpbml0KG9wdGlvbnM/OiBFbnRpdGllc0RyYXdlck9wdGlvbnMpIHtcbiAgICBjb25zdCBmaW5hbE9wdGlvbnMgPSBvcHRpb25zIHx8IHRoaXMuZGVmYXVsdE9wdGlvbnM7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmFsT3B0aW9ucy5jb2xsZWN0aW9uc051bWJlcjsgaSsrKSB7XG4gICAgICBjb25zdCBkYXRhU291cmNlID0gbmV3IENlc2l1bS5DdXN0b21EYXRhU291cmNlKHRoaXMuZ3JhcGhpY3NUeXBlTmFtZSk7XG4gICAgICBkYXRhU291cmNlcy5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLmFkZChkYXRhU291cmNlKTtcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuc2V0KFxuICAgICAgICBkYXRhU291cmNlLmVudGl0aWVzLFxuICAgICAgICBuZXcgT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbihkYXRhU291cmNlLmVudGl0aWVzLCBmaW5hbE9wdGlvbnMuY29sbGVjdGlvbk1heFNpemUsIGZpbmFsT3B0aW9ucy5jb2xsZWN0aW9uU3VzcGVuc2lvblRpbWUpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZXM7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiA9IHRoaXMuZ2V0RnJlZUVudGl0aWVzQ29sbGVjdGlvbigpO1xuICAgIGlmIChvcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgZnJlZSBlbnRpdHkgY29sbGVjdGlvbnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBncmFwaGljc0NsYXNzID0gdGhpcy5ncmFwaGljc1R5cGUgYXMgYW55O1xuICAgIGNvbnN0IGVudGl0eU9iamVjdCA9IHtcbiAgICAgIHBvc2l0aW9uOiBjZXNpdW1Qcm9wcy5wb3NpdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMucG9zaXRpb24gOiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogY2VzaXVtUHJvcHMuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkLFxuICAgICAgb3JpZW50YXRpb246IGNlc2l1bVByb3BzLm9yaWVudGF0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5vcmllbnRhdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgIHZpZXdGcm9tOiBjZXNpdW1Qcm9wcy52aWV3RnJvbSAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMudmlld0Zyb20gOiB1bmRlZmluZWQsXG4gICAgICBbdGhpcy5ncmFwaGljc1R5cGVOYW1lXTogY2VzaXVtUHJvcHMsXG4gICAgfTtcblxuICAgIGlmIChjZXNpdW1Qcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVudGl0eU9iamVjdC5uYW1lID0gY2VzaXVtUHJvcHMubmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbi5hZGQoZW50aXR5T2JqZWN0KTtcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHRoaXMuc3VzcGVuZEVudGl0eUNvbGxlY3Rpb24oZW50aXR5KTtcblxuICAgIGlmIChlbnRpdHkucG9zaXRpb24gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkge1xuICAgICAgaWYgKGVudGl0eS5wb3NpdGlvbi5faXNDb25zdGFudCkge1xuICAgICAgICBlbnRpdHkucG9zaXRpb24gPSBjZXNpdW1Qcm9wcy5wb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgZW50aXR5LnBvc2l0aW9uID0gY2VzaXVtUHJvcHMucG9zaXRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLnBvc2l0aW9uIDogdW5kZWZpbmVkO1xuICAgIGVudGl0eS5uYW1lID0gY2VzaXVtUHJvcHMubmFtZSAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMubmFtZSA6IGVudGl0eS5uYW1lO1xuICAgIGVudGl0eS5kZXNjcmlwdGlvbiA9IGNlc2l1bVByb3BzLmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5kZXNjcmlwdGlvbiA6IGVudGl0eS5kZXNjcmlwdGlvbjtcbiAgICBlbnRpdHkub3JpZW50YXRpb24gPSBjZXNpdW1Qcm9wcy5vcmllbnRhdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMub3JpZW50YXRpb24gOiBlbnRpdHkub3JpZW50YXRpb247XG4gICAgZW50aXR5LnZpZXdGcm9tID0gY2VzaXVtUHJvcHMudmlld0Zyb20gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLnZpZXdGcm9tIDogZW50aXR5LnZpZXdGcm9tO1xuXG4gICAgaWYgKHRoaXMuX3Byb3BzQXNzaWduZXIpIHtcbiAgICAgIHRoaXMuX3Byb3BzQXNzaWduZXIoZW50aXR5W3RoaXMuZ3JhcGhpY3NUeXBlTmFtZV0sIGNlc2l1bVByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHlbdGhpcy5ncmFwaGljc1R5cGVOYW1lXSwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xuICAgIGNvbnN0IG9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmdldChlbnRpdHkuZW50aXR5Q29sbGVjdGlvbik7XG4gICAgb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uLnJlbW92ZUFsbCgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0U2hvdyhzaG93VmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uLnNldFNob3coc2hvd1ZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3VzcGVuZEVudGl0eUNvbGxlY3Rpb24oZW50aXR5OiBhbnkpIHtcbiAgICBjb25zdCBpZCA9IGVudGl0eS5lbnRpdHlDb2xsZWN0aW9uO1xuICAgIGlmICghdGhpcy5lbnRpdHlDb2xsZWN0aW9ucy5oYXMoaWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIEVudGl0eUNvbGxlY3Rpb24gZm9yIGVudGl0eS5lbnRpdHlDb2xsZWN0aW9uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50aXR5Q29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuZ2V0KGlkKTtcbiAgICBlbnRpdHlDb2xsZWN0aW9uLnN1c3BlbmQoKTtcbiAgfVxufVxuIl19