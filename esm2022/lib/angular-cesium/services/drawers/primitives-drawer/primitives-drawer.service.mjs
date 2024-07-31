import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
export class PrimitivesDrawerService extends BasicDrawerService {
    constructor(drawerType, cesiumService) {
        super();
        this.drawerType = drawerType;
        this.cesiumService = cesiumService;
        this._show = true;
    }
    init() {
        const scene = this.cesiumService.getScene();
        this._cesiumCollection = new this.drawerType({ scene });
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        scene.primitives.add(this._primitiveCollectionWrap);
    }
    add(cesiumProps, ...args) {
        return this._cesiumCollection.add(cesiumProps);
    }
    update(entity, cesiumProps, ...args) {
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    }
    remove(entity) {
        if (this._cesiumCollection) {
            this._cesiumCollection.remove(entity);
        }
    }
    removeAll() {
        if (this._cesiumCollection) {
            this._cesiumCollection.removeAll();
        }
    }
    setShow(showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    }
    getShow() {
        return this._show;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRTFFOzs7R0FHRztBQUNILE1BQU0sT0FBZ0IsdUJBQXdCLFNBQVEsa0JBQWtCO0lBTXRFLFlBQW9CLFVBQWUsRUFBVSxhQUE0QjtRQUN2RSxLQUFLLEVBQUUsQ0FBQztRQURVLGVBQVUsR0FBVixVQUFVLENBQUs7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUxqRSxVQUFLLEdBQUcsSUFBSSxDQUFDO0lBT3JCLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELEdBQUcsQ0FBQyxXQUFnQixFQUFFLEdBQUcsSUFBVztRQUNsQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFXLEVBQUUsV0FBZ0IsRUFBRSxHQUFHLElBQVc7UUFDbEQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0MsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFrQjtRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5cbi8qKlxuICogIEdlbmVyYWwgcHJpbWl0aXZlcyBkcmF3ZXIgcmVzcG9uc2libGUgb2YgZHJhd2luZyBDZXNpdW0gcHJpbWl0aXZlcy5cbiAqICBEcmF3ZXJzIHRoZSBoYW5kbGUgQ2VzaXVtIHByaW1pdGl2ZXMgZXh0ZW5kIGl0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgZXh0ZW5kcyBCYXNpY0RyYXdlclNlcnZpY2Uge1xuICBwcml2YXRlIF9zaG93ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfcHJpbWl0aXZlQ29sbGVjdGlvbldyYXA6IGFueTtcbiAgcHJvdGVjdGVkIF9jZXNpdW1Db2xsZWN0aW9uOiBhbnk7XG4gIHByb3RlY3RlZCBfcHJvcHNBc3NpZ25lcjogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkcmF3ZXJUeXBlOiBhbnksIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnN0IHNjZW5lID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XG4gICAgdGhpcy5fY2VzaXVtQ29sbGVjdGlvbiA9IG5ldyB0aGlzLmRyYXdlclR5cGUoeyBzY2VuZSB9KTtcbiAgICB0aGlzLl9wcmltaXRpdmVDb2xsZWN0aW9uV3JhcCA9IG5ldyBDZXNpdW0uUHJpbWl0aXZlQ29sbGVjdGlvbih7ZGVzdHJveVByaW1pdGl2ZXM6IGZhbHNlfSk7XG4gICAgdGhpcy5fcHJpbWl0aXZlQ29sbGVjdGlvbldyYXAuYWRkKHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24pO1xuICAgIHNjZW5lLnByaW1pdGl2ZXMuYWRkKHRoaXMuX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwKTtcbiAgfVxuXG4gIGFkZChjZXNpdW1Qcm9wczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24uYWRkKGNlc2l1bVByb3BzKTtcbiAgfVxuXG4gIHVwZGF0ZShlbnRpdHk6IGFueSwgY2VzaXVtUHJvcHM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAodGhpcy5fcHJvcHNBc3NpZ25lcikge1xuICAgICAgdGhpcy5fcHJvcHNBc3NpZ25lcihlbnRpdHksIGNlc2l1bVByb3BzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmFzc2lnbihlbnRpdHksIGNlc2l1bVByb3BzKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoZW50aXR5OiBhbnkpIHtcbiAgICBpZiAodGhpcy5fY2VzaXVtQ29sbGVjdGlvbikge1xuICAgICAgdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5yZW1vdmUoZW50aXR5KTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgaWYgKHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24pIHtcbiAgICAgIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24ucmVtb3ZlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0U2hvdyhzaG93VmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93ID0gc2hvd1ZhbHVlO1xuICAgIHRoaXMuX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwLnNob3cgPSBzaG93VmFsdWU7XG4gIH1cblxuICBnZXRTaG93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93O1xuICB9XG59XG4iXX0=