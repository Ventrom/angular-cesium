import { __extends } from "tslib";
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { OptimizedEntityCollection } from './optimized-entity-collection';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
var EntitiesDrawerService = /** @class */ (function (_super) {
    __extends(EntitiesDrawerService, _super);
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
            if (GraphicsType[i] === _this.graphicsType) {
                _this.graphicsTypeName = i;
            }
        }
        return _this;
    }
    EntitiesDrawerService.prototype.getFreeEntitiesCollection = function () {
        var freeEntityCollection = null;
        this.entityCollections.forEach(function (entityCollection) {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        });
        return freeEntityCollection;
    };
    EntitiesDrawerService.prototype.init = function (options) {
        var finalOptions = options || this.defaultOptions;
        var dataSources = [];
        for (var i = 0; i < finalOptions.collectionsNumber; i++) {
            var dataSource = new Cesium.CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    };
    EntitiesDrawerService.prototype.add = function (cesiumProps) {
        var _a;
        var optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
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
        if (cesiumProps.availability !== undefined) {
            entityObject.availability = cesiumProps.availability;
        }
        return optimizedEntityCollection.add(entityObject);
    };
    EntitiesDrawerService.prototype.update = function (entity, cesiumProps) {
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
        entity.availability = cesiumProps.availability !== undefined ? cesiumProps.availability : cesiumProps.availability;
        if (this._propsAssigner) {
            this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
        }
        else {
            Object.assign(entity[this.graphicsTypeName], cesiumProps);
        }
    };
    EntitiesDrawerService.prototype.remove = function (entity) {
        var optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    };
    EntitiesDrawerService.prototype.removeAll = function () {
        this.entityCollections.forEach(function (entityCollection) {
            entityCollection.removeAll();
        });
    };
    EntitiesDrawerService.prototype.setShow = function (showValue) {
        this.entityCollections.forEach(function (entityCollection) {
            entityCollection.setShow(showValue);
        });
    };
    EntitiesDrawerService.prototype.suspendEntityCollection = function (entity) {
        var id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        var entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    };
    return EntitiesDrawerService;
}(BasicDrawerService));
export { EntitiesDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXRpZXMtZHJhd2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2VudGl0aWVzLWRyYXdlci9lbnRpdGllcy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFFMUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTFELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRTFFOzs7R0FHRztBQUVIO0lBQTJDLHlDQUFrQjtJQUkzRCwrQkFDVSxhQUE0QixFQUM1QixZQUEwQixFQUMxQixjQUlQO1FBSk8sK0JBQUEsRUFBQTtZQUNOLGlCQUFpQixFQUFFLENBQUMsQ0FBQztZQUNyQix3QkFBd0IsRUFBRSxDQUFDLENBQUM7WUFDNUIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQjtRQVBILFlBU0UsaUJBQU8sU0FTUjtRQWpCUyxtQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixrQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixvQkFBYyxHQUFkLGNBQWMsQ0FJckI7UUFWSyx1QkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztRQWFwRSxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV4RCwyQkFBMkI7UUFDM0IsS0FBSyxJQUFNLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDNUIsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFRLEtBQUssS0FBSSxDQUFDLFlBQVksRUFBRTtnQkFDaEQsS0FBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQzthQUMzQjtTQUNGOztJQUNILENBQUM7SUFFTyx5REFBeUIsR0FBakM7UUFDRSxJ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Q0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzNEO0lBQ0gsQ0FBQztJQUVELHNDQUFNLEdBQU4sVUFBTyxNQUFXO1FBQ2hCLElBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0Rix5QkFBeUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELHlDQUFTLEdBQVQ7UUFDRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUEsZ0JBQWdCO1lBQzdDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVDQUFPLEdBQVAsVUFBUSxTQUFrQjtRQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUEsZ0JBQWdCO1lBQzdDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyx1REFBdUIsR0FBL0IsVUFBZ0MsTUFBVztRQUN6QyxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQ3BFO1FBRUQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUEzSEQsQ0FBMkMsa0JBQWtCLEdBMkg1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyYXBoaWNzVHlwZSB9IGZyb20gJy4vZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtJztcbmltcG9ydCB7IEVudGl0aWVzRHJhd2VyT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL21vZGVscy9lbnRpdGllcy1kcmF3ZXItb3B0aW9ucyc7XG5pbXBvcnQgeyBPcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uIH0gZnJvbSAnLi9vcHRpbWl6ZWQtZW50aXR5LWNvbGxlY3Rpb24nO1xuXG4vKipcbiAqICBHZW5lcmFsIHByaW1pdGl2ZXMgZHJhd2VyIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgQ2VzaXVtIHByaW1pdGl2ZXMuXG4gKiAgRHJhd2VycyB0aGUgaGFuZGxlIENlc2l1bSBwcmltaXRpdmVzIGV4dGVuZCBpdC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgRW50aXRpZXNEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBlbnRpdHlDb2xsZWN0aW9ucyA9IG5ldyBNYXA8YW55LCBPcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uPigpO1xuICBwcml2YXRlIGdyYXBoaWNzVHlwZU5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBncmFwaGljc1R5cGU6IEdyYXBoaWNzVHlwZSxcbiAgICBwcml2YXRlIGRlZmF1bHRPcHRpb25zOiBFbnRpdGllc0RyYXdlck9wdGlvbnMgPSB7XG4gICAgICBjb2xsZWN0aW9uTWF4U2l6ZTogLTEsXG4gICAgICBjb2xsZWN0aW9uU3VzcGVuc2lvblRpbWU6IC0xLFxuICAgICAgY29sbGVjdGlvbnNOdW1iZXI6IDEsXG4gICAgfSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmdyYXBoaWNzVHlwZU5hbWUgPSBHcmFwaGljc1R5cGVbdGhpcy5ncmFwaGljc1R5cGVdO1xuXG4gICAgLy8gRml4IGJhZCBlbnVtIGNvbXBpbGF0aW9uXG4gICAgZm9yIChjb25zdCBpIGluIEdyYXBoaWNzVHlwZSkge1xuICAgICAgaWYgKEdyYXBoaWNzVHlwZVtpXSBhcyBhbnkgPT09IHRoaXMuZ3JhcGhpY3NUeXBlKSB7XG4gICAgICAgIHRoaXMuZ3JhcGhpY3NUeXBlTmFtZSA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGcmVlRW50aXRpZXNDb2xsZWN0aW9uKCk6IE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24ge1xuICAgIGxldCBmcmVlRW50aXR5Q29sbGVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5lbnRpdHlDb2xsZWN0aW9ucy5mb3JFYWNoKGVudGl0eUNvbGxlY3Rpb24gPT4ge1xuICAgICAgaWYgKGVudGl0eUNvbGxlY3Rpb24uaXNGcmVlKCkpIHtcbiAgICAgICAgZnJlZUVudGl0eUNvbGxlY3Rpb24gPSBlbnRpdHlDb2xsZWN0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZyZWVFbnRpdHlDb2xsZWN0aW9uO1xuICB9XG5cbiAgaW5pdChvcHRpb25zPzogRW50aXRpZXNEcmF3ZXJPcHRpb25zKSB7XG4gICAgY29uc3QgZmluYWxPcHRpb25zID0gb3B0aW9ucyB8fCB0aGlzLmRlZmF1bHRPcHRpb25zO1xuICAgIGNvbnN0IGRhdGFTb3VyY2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5hbE9wdGlvbnMuY29sbGVjdGlvbnNOdW1iZXI7IGkrKykge1xuICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IG5ldyBDZXNpdW0uQ3VzdG9tRGF0YVNvdXJjZSh0aGlzLmdyYXBoaWNzVHlwZU5hbWUpO1xuICAgICAgZGF0YVNvdXJjZXMucHVzaChkYXRhU291cmNlKTtcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQoZGF0YVNvdXJjZSk7XG4gICAgICB0aGlzLmVudGl0eUNvbGxlY3Rpb25zLnNldChcbiAgICAgICAgZGF0YVNvdXJjZS5lbnRpdGllcyxcbiAgICAgICAgbmV3IE9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24oZGF0YVNvdXJjZS5lbnRpdGllcywgZmluYWxPcHRpb25zLmNvbGxlY3Rpb25NYXhTaXplLCBmaW5hbE9wdGlvbnMuY29sbGVjdGlvblN1c3BlbnNpb25UaW1lKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2VzO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IG9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24gPSB0aGlzLmdldEZyZWVFbnRpdGllc0NvbGxlY3Rpb24oKTtcbiAgICBpZiAob3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBtb3JlIGZyZWUgZW50aXR5IGNvbGxlY3Rpb25zJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZW50aXR5T2JqZWN0ID0ge1xuICAgICAgcG9zaXRpb246IGNlc2l1bVByb3BzLnBvc2l0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5wb3NpdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiBjZXNpdW1Qcm9wcy5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMuZGVzY3JpcHRpb24gOiB1bmRlZmluZWQsXG4gICAgICBvcmllbnRhdGlvbjogY2VzaXVtUHJvcHMub3JpZW50YXRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLm9yaWVudGF0aW9uIDogdW5kZWZpbmVkLFxuICAgICAgdmlld0Zyb206IGNlc2l1bVByb3BzLnZpZXdGcm9tICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy52aWV3RnJvbSA6IHVuZGVmaW5lZCxcbiAgICAgIFt0aGlzLmdyYXBoaWNzVHlwZU5hbWVdOiBjZXNpdW1Qcm9wcyxcbiAgICB9O1xuXG4gICAgaWYgKGNlc2l1bVByb3BzLm5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZW50aXR5T2JqZWN0Lm5hbWUgPSBjZXNpdW1Qcm9wcy5uYW1lO1xuICAgIH1cbiAgICBpZiAoY2VzaXVtUHJvcHMuYXZhaWxhYmlsaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVudGl0eU9iamVjdC5hdmFpbGFiaWxpdHkgPSBjZXNpdW1Qcm9wcy5hdmFpbGFiaWxpdHk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGltaXplZEVudGl0eUNvbGxlY3Rpb24uYWRkKGVudGl0eU9iamVjdCk7XG4gIH1cblxuICB1cGRhdGUoZW50aXR5OiBhbnksIGNlc2l1bVByb3BzOiBhbnkpIHtcbiAgICB0aGlzLnN1c3BlbmRFbnRpdHlDb2xsZWN0aW9uKGVudGl0eSk7XG5cbiAgICBpZiAoZW50aXR5LnBvc2l0aW9uIGluc3RhbmNlb2YgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkpIHtcbiAgICAgIGlmIChlbnRpdHkucG9zaXRpb24uX2lzQ29uc3RhbnQpIHtcbiAgICAgICAgZW50aXR5LnBvc2l0aW9uID0gY2VzaXVtUHJvcHMucG9zaXRpb247XG4gICAgICB9XG4gICAgfVxuICAgIGVudGl0eS5wb3NpdGlvbiA9IGNlc2l1bVByb3BzLnBvc2l0aW9uICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5wb3NpdGlvbiA6IHVuZGVmaW5lZDtcbiAgICBlbnRpdHkubmFtZSA9IGNlc2l1bVByb3BzLm5hbWUgIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLm5hbWUgOiBlbnRpdHkubmFtZTtcbiAgICBlbnRpdHkuZGVzY3JpcHRpb24gPSBjZXNpdW1Qcm9wcy5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMuZGVzY3JpcHRpb24gOiBlbnRpdHkuZGVzY3JpcHRpb247XG4gICAgZW50aXR5Lm9yaWVudGF0aW9uID0gY2VzaXVtUHJvcHMub3JpZW50YXRpb24gIT09IHVuZGVmaW5lZCA/IGNlc2l1bVByb3BzLm9yaWVudGF0aW9uIDogZW50aXR5Lm9yaWVudGF0aW9uO1xuICAgIGVudGl0eS52aWV3RnJvbSA9IGNlc2l1bVByb3BzLnZpZXdGcm9tICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy52aWV3RnJvbSA6IGVudGl0eS52aWV3RnJvbTtcbiAgICBlbnRpdHkuYXZhaWxhYmlsaXR5ID0gY2VzaXVtUHJvcHMuYXZhaWxhYmlsaXR5ICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy5hdmFpbGFiaWxpdHkgOiBjZXNpdW1Qcm9wcy5hdmFpbGFiaWxpdHk7XG5cbiAgICBpZiAodGhpcy5fcHJvcHNBc3NpZ25lcikge1xuICAgICAgdGhpcy5fcHJvcHNBc3NpZ25lcihlbnRpdHlbdGhpcy5ncmFwaGljc1R5cGVOYW1lXSwgY2VzaXVtUHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKGVudGl0eVt0aGlzLmdyYXBoaWNzVHlwZU5hbWVdLCBjZXNpdW1Qcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGVudGl0eTogYW55KSB7XG4gICAgY29uc3Qgb3B0aW1pemVkRW50aXR5Q29sbGVjdGlvbiA9IHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuZ2V0KGVudGl0eS5lbnRpdHlDb2xsZWN0aW9uKTtcbiAgICBvcHRpbWl6ZWRFbnRpdHlDb2xsZWN0aW9uLnJlbW92ZShlbnRpdHkpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuZm9yRWFjaChlbnRpdHlDb2xsZWN0aW9uID0+IHtcbiAgICAgIGVudGl0eUNvbGxlY3Rpb24ucmVtb3ZlQWxsKCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRTaG93KHNob3dWYWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZW50aXR5Q29sbGVjdGlvbnMuZm9yRWFjaChlbnRpdHlDb2xsZWN0aW9uID0+IHtcbiAgICAgIGVudGl0eUNvbGxlY3Rpb24uc2V0U2hvdyhzaG93VmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdXNwZW5kRW50aXR5Q29sbGVjdGlvbihlbnRpdHk6IGFueSkge1xuICAgIGNvbnN0IGlkID0gZW50aXR5LmVudGl0eUNvbGxlY3Rpb247XG4gICAgaWYgKCF0aGlzLmVudGl0eUNvbGxlY3Rpb25zLmhhcyhpZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gRW50aXR5Q29sbGVjdGlvbiBmb3IgZW50aXR5LmVudGl0eUNvbGxlY3Rpb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRpdHlDb2xsZWN0aW9uID0gdGhpcy5lbnRpdHlDb2xsZWN0aW9ucy5nZXQoaWQpO1xuICAgIGVudGl0eUNvbGxlY3Rpb24uc3VzcGVuZCgpO1xuICB9XG59XG5cbiJdfQ==