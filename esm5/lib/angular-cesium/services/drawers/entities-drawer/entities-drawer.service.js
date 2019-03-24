/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { OptimizedEntityCollection } from './optimized-entity-collection';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
var /**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
EntitiesDrawerService = /** @class */ (function (_super) {
    tslib_1.__extends(EntitiesDrawerService, _super);
    function EntitiesDrawerService(cesiumService, graphicsType, defaultOptions) {
        if (defaultOptions === void 0) { defaultOptions = {
            collectionMaxSize: -1,
            collectionSuspensionTime: -1,
            collectionsNumber: 1,
        }; }
        var _this = _super.call(this) || this;
        _this.cesiumService = cesiumService;
        _this.graphicsType = graphicsType;
        _this.defaultOptions = defaultOptions;
        _this.entityCollections = new Map();
        _this.graphicsTypeName = GraphicsType[_this.graphicsType];
        // Fix bad enum compilation
        for (var i in GraphicsType) {
            if ((/** @type {?} */ (GraphicsType[i])) === _this.graphicsType) {
                _this.graphicsTypeName = i;
            }
        }
        return _this;
    }
    /**
     * @private
     * @return {?}
     */
    EntitiesDrawerService.prototype.getFreeEntitiesCollection = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var freeEntityCollection = null;
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        }));
        return freeEntityCollection;
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    EntitiesDrawerService.prototype.init = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var finalOptions = options || this.defaultOptions;
        /** @type {?} */
        var dataSources = [];
        for (var i = 0; i < finalOptions.collectionsNumber; i++) {
            /** @type {?} */
            var dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    };
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    EntitiesDrawerService.prototype.add = /**
     * @param {?} cesiumProps
     * @return {?}
     */
    function (cesiumProps) {
        var _a;
        /** @type {?} */
        var optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        /** @type {?} */
        var graphicsClass = (/** @type {?} */ (this.graphicsType));
        /** @type {?} */
        var entityObject = (_a = {
                position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
                description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
                orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
                viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined
            },
            _a[this.graphicsTypeName] = cesiumProps,
            _a);
        if (cesiumProps.name !== undefined) {
            entityObject.name = cesiumProps.name;
        }
        return optimizedEntityCollection.add(entityObject);
    };
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    EntitiesDrawerService.prototype.update = /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    function (entity, cesiumProps) {
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
    };
    /**
     * @param {?} entity
     * @return {?}
     */
    EntitiesDrawerService.prototype.remove = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    };
    /**
     * @return {?}
     */
    EntitiesDrawerService.prototype.removeAll = /**
     * @return {?}
     */
    function () {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            entityCollection.removeAll();
        }));
    };
    /**
     * @param {?} showValue
     * @return {?}
     */
    EntitiesDrawerService.prototype.setShow = /**
     * @param {?} showValue
     * @return {?}
     */
    function (showValue) {
        this.entityCollections.forEach((/**
         * @param {?} entityCollection
         * @return {?}
         */
        function (entityCollection) {
            entityCollection.setShow(showValue);
        }));
    };
    /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    EntitiesDrawerService.prototype.suspendEntityCollection = /**
     * @private
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        /** @type {?} */
        var id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        /** @type {?} */
        var entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    };
    return EntitiesDrawerService;
}(BasicDrawerService));
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
export { EntitiesDrawerService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRTFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUxRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7Ozs7QUFPMUU7Ozs7O0lBQTJDLGlEQUFrQjtJQUkzRCwrQkFDVSxhQUE0QixFQUM1QixZQUEwQixFQUMxQixjQUlQO1FBSk8sK0JBQUEsRUFBQTtZQUNOLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUNyQix3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFDNUIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQjtRQVBILFlBU0UsaUJBQU8sU0FTUjtRQWpCUyxtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixvQkFBYyxHQUFkLGNBQWMsQ0FJckI7UUFWSyx1QkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztRQWFwRSxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV4RCwyQkFBMkI7UUFDM0IsS0FBSyxJQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDNUIsSUFBSSxtQkFBQSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQU8sS0FBSyxLQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNoRCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7O0lBQ0gsQ0FBQzs7Ozs7SUFFTyx5REFB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QUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7O0lBRUQseUNBQVM7OztJQUFUO1FBQ0UsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLGdCQUFnQjtZQUM3QyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMvQixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRUQsdUNBQU87Ozs7SUFBUCxVQUFRLFNBQWtCO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQSxnQkFBZ0I7WUFDN0MsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sdURBQXVCOzs7OztJQUEvQixVQUFnQyxNQUFXOztZQUNuQyxFQUFFLEdBQUcsTUFBTSxDQUFDLGdCQUFnQjtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDcEU7O1lBRUssZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDdkQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXhIRCxDQUEyQyxrQkFBa0IsR0F3SDVEOzs7Ozs7Ozs7OztJQXZIQyxrREFBc0U7Ozs7O0lBQ3RFLGlEQUFpQzs7Ozs7SUFHL0IsOENBQW9DOzs7OztJQUNwQyw2Q0FBa0M7Ozs7O0lBQ2xDLCtDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhpY3NUeXBlIH0gZnJvbSAnLi9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0nO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VudGl0aWVzLWRyYXdlci1vcHRpb25zJztcbmltcG9ydCB7IE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24gfSBmcm9tICcuL29wdGltaXplZC1lbnRpdHktY29sbGVjdGlvbic7XG5cbi8qKlxuICogIEdlbmVyYWwgcHJpbWl0aXZlcyBkcmF3ZXIgcmVzcG9uc2libGUgb2YgZHJhd2luZyBDZXNpdW0gcHJpbWl0aXZlcy5cbiAqICBEcmF3ZXJzIHRoZSBoYW5kbGUgQ2VzaXVtIHByaW1pdGl2ZXMgZXh0ZW5kIGl0LlxuICovXG5cbmV4cG9ydCBjbGFzcyBFbnRpdGllc0RyYXdlclNlcnZpY2UgZXh0ZW5kcyBCYXNpY0RyYXdlclNlcnZpY2Uge1xuICBwcml2YXRlIGVudGl0eUNvbGxlY3Rpb25zID0gbmV3IE1hcDxhbnksIE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24+KCk7XG4gIHByaXZhdGUgZ3JhcGhpY3NUeXBlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcbiAgICBwcml2YXRlIGdyYXBoaWNzVHlwZTogR3JhcGhpY3NUeXBlLFxuICAgIHByaXZhdGUgZGVmYXVsdE9wdGlvbnM6IEVudGl0aWVzRHJhd2VyT3B0aW9ucyA9IHtcbiAgICAgIGNvbGxlY3Rpb25NYXhTaXplOiAtMSxcbiAgICAgIGNvbGxlY3Rpb25TdXNwZW5zaW9uVGltZTogLTEsXG4gICAgICBjb2xsZWN0aW9uc051bWJlcjogMSxcbiAgICB9LFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZ3JhcGhpY3NUeXBlTmFtZSA9IEdyYXBoaWNzVHlwZVt0aGlzLmdyYXBoaWNzVHlwZV07XG5cbiAgICAvLyBGaXggYmFkIGVudW0gY29tcGlsYXRpb25cbiAgICBmb3IgKGNvbnN0IGkgaW4gR3JhcGhpY3NUeXBlKSB7XG4gICAgICBpZiAoR3JhcGhpY3NUeXBlW2ldIGFzIGFueSA9PT0gdGhpcy5ncmFwaGljc1R5cGUpIHtcbiAgICAgICAgdGhpcy5ncmFwaGljc1R5cGVOYW1lID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEZyZWVFbnRpdGllc0NvbGxlY3Rpb24oKTogT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiB7XG4gICAgbGV0IGZyZWVFbnRpdHlDb2xsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBpZiAoZW50aXR5Q29sbGVjdGlvbi5pc0ZyZWUoKSkge1xuICAgICAgICBmcmVlRW50aXR5Q29sbGVjdGlvbiA9IGVudGl0eUNvbGxlY3Rpb247XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZnJlZUVudGl0eUNvbGxlY3Rpb247XG4gIH1cblxuICBpbml0KG9wdGlvbnM/OiBFbnRpdGllc0RyYXdlck9wdGlvbnMpIHtcbiAgICBjb25zdCBmaW5hbE9wdGlvbnMgPSBvcHRpb25zIHx8IHRoaXMuZGVmYXVsdE9wdGlvbnM7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmFsT3B0aW9ucy5jb2xsZWN0aW9uc051bWJlcjsgaSsrKSB7XG4gICAgICBjb25zdCBkYXRhU291cmNlID0gbmV3IENlc2l1bS5DdXN0b21EYXRhU291cmNlKHRoaXMuZ3JhcGhpY3NUeXBlTmFtZSk7XG4gICAgICBkYXRhU291cmNlcy5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLmFkZChkYXRhU291cmNlKTtcbiAgICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuc2V0KFxuICAgICAgICBkYXRhU291cmNlLmVudGl0aWVzLFxuICAgICAgICBuZXcgT3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbihkYXRhU291cmNlLmVudGl0aWVzLCBmaW5hbE9wdGlvbnMuY29sbGVjdGlvbk1heFNpemUsIGZpbmFsT3B0aW9ucy5jb2xsZWN0aW9uU3VzcGVuc2lvblRpbWUpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZXM7XG4gIH1cblxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiA9IHRoaXMuZ2V0RnJlZUVudGl0aWVzQ29sbGVjdGlvbigpO1xuICAgIGlmIChvcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG1vcmUgZnJlZSBlbnRpdHkgY29sbGVjdGlvbnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBncmFwaGljc0NsYXNzID0gdGhpcy5ncmFwaGljc1R5cGUgYXMgYW55O1xuICAgIGNvbnN0IGVudGl0eU9iamVjdCA9IHtcbiAgICAgIHBvc2l0aW9uOiBjZXNpdW1Qcm9wcy5wb3NpdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMucG9zaXRpb24gOiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogY2VzaXVtUHJvcHMuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkLFxuICAgICAgb3JpZW50YXRpb246IGNlc2l1bVByb3BzLm9yaWVudGF0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5vcmllbnRhdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgIHZpZXdGcm9tOiBjZXNpdW1Qcm9wcy52aWV3RnJvbSAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMudmlld0Zyb20gOiB1bmRlZmluZWQsXG4gICAgICBbdGhpcy5ncmFwaGljc1R5cGVOYW1lXTogY2VzaXVtUHJvcHMsXG4gICAgfTtcblxuICAgIGlmIChjZXNpdW1Qcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVudGl0eU9iamVjdC5uYW1lID0gY2VzaXVtUHJvcHMubmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbi5hZGQoZW50aXR5T2JqZWN0KTtcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xuICAgIHRoaXMuc3VzcGVuZEVudGl0eUNvbGxlY3Rpb24oZW50aXR5KTtcblxuICAgIGlmIChlbnRpdHkucG9zaXRpb24gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkge1xuICAgICAgaWYgKGVudGl0eS5wb3NpdGlvbi5faXNDb25zdGFudCkge1xuICAgICAgICBlbnRpdHkucG9zaXRpb24gPSBjZXNpdW1Qcm9wcy5wb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgZW50aXR5LnBvc2l0aW9uID0gY2VzaXVtUHJvcHMucG9zaXRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLnBvc2l0aW9uIDogdW5kZWZpbmVkO1xuICAgIGVudGl0eS5uYW1lID0gY2VzaXVtUHJvcHMubmFtZSAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMubmFtZSA6IGVudGl0eS5uYW1lO1xuICAgIGVudGl0eS5kZXNjcmlwdGlvbiA9IGNlc2l1bVByb3BzLmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5kZXNjcmlwdGlvbiA6IGVudGl0eS5kZXNjcmlwdGlvbjtcbiAgICBlbnRpdHkub3JpZW50YXRpb24gPSBjZXNpdW1Qcm9wcy5vcmllbnRhdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMub3JpZW50YXRpb24gOiBlbnRpdHkub3JpZW50YXRpb247XG4gICAgZW50aXR5LnZpZXdGcm9tID0gY2VzaXVtUHJvcHMudmlld0Zyb20gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLnZpZXdGcm9tIDogZW50aXR5LnZpZXdGcm9tO1xuXG4gICAgaWYgKHRoaXMuX3Byb3BzQXNzaWduZXIpIHtcbiAgICAgIHRoaXMuX3Byb3BzQXNzaWduZXIoZW50aXR5W3RoaXMuZ3JhcGhpY3NUeXBlTmFtZV0sIGNlc2l1bVByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHlbdGhpcy5ncmFwaGljc1R5cGVOYW1lXSwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xuICAgIGNvbnN0IG9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24gPSB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmdldChlbnRpdHkuZW50aXR5Q29sbGVjdGlvbik7XG4gICAgb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uLnJlbW92ZUFsbCgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0U2hvdyhzaG93VmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmZvckVhY2goZW50aXR5Q29sbGVjdGlvbiA9PiB7XG4gICAgICBlbnRpdHlDb2xsZWN0aW9uLnNldFNob3coc2hvd1ZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3VzcGVuZEVudGl0eUNvbGxlY3Rpb24oZW50aXR5OiBhbnkpIHtcbiAgICBjb25zdCBpZCA9IGVudGl0eS5lbnRpdHlDb2xsZWN0aW9uO1xuICAgIGlmICghdGhpcy5lbnRpdHlDb2xsZWN0aW9ucy5oYXMoaWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIEVudGl0eUNvbGxlY3Rpb24gZm9yIGVudGl0eS5lbnRpdHlDb2xsZWN0aW9uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50aXR5Q29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuZ2V0KGlkKTtcbiAgICBlbnRpdHlDb2xsZWN0aW9uLnN1c3BlbmQoKTtcbiAgfVxufVxuIl19