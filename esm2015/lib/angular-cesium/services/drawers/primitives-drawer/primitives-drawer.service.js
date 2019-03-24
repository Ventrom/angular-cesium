/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 * @abstract
 */
export class PrimitivesDrawerService extends BasicDrawerService {
    /**
     * @param {?} drawerType
     * @param {?} cesiumService
     */
    constructor(drawerType, cesiumService) {
        super();
        this.drawerType = drawerType;
        this.cesiumService = cesiumService;
        this._show = true;
    }
    /**
     * @return {?}
     */
    init() {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new Cesium.PrimitiveCollection({ destroyPrimitives: false });
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    }
    /**
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    add(cesiumProps, ...args) {
        return this._cesiumCollection.add(cesiumProps);
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @param {...?} args
     * @return {?}
     */
    update(entity, cesiumProps, ...args) {
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this._cesiumCollection.remove(entity);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this._cesiumCollection.removeAll();
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    }
    /**
     * @return {?}
     */
    getShow() {
        return this._show;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype._show;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype._primitiveCollectionWrap;
    /**
     * @type {?}
     * @protected
     */
    PrimitivesDrawerService.prototype._cesiumCollection;
    /**
     * @type {?}
     * @protected
     */
    PrimitivesDrawerService.prototype._propsAssigner;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype.drawerType;
    /**
     * @type {?}
     * @private
     */
    PrimitivesDrawerService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvcHJpbWl0aXZlcy1kcmF3ZXIvcHJpbWl0aXZlcy1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7OztBQU0xRSxNQUFNLE9BQWdCLHVCQUF3QixTQUFRLGtCQUFrQjs7Ozs7SUFNdEUsWUFBb0IsVUFBZSxFQUFVLGFBQTRCO1FBQ3ZFLEtBQUssRUFBRSxDQUFDO1FBRFUsZUFBVSxHQUFWLFVBQVUsQ0FBSztRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBTGpFLFVBQUssR0FBRyxJQUFJLENBQUM7SUFPckIsQ0FBQzs7OztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLEVBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM5RSxDQUFDOzs7Ozs7SUFFRCxHQUFHLENBQUMsV0FBZ0IsRUFBRSxHQUFHLElBQVc7UUFDbEMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Ozs7Ozs7SUFFRCxNQUFNLENBQUMsTUFBVyxFQUFFLFdBQWdCLEVBQUUsR0FBRyxJQUFXO1FBQ2xELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMxQzthQUFNO1lBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7OztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckMsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsU0FBa0I7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDdkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7SUFDakQsQ0FBQzs7OztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztDQUNGOzs7Ozs7SUE1Q0Msd0NBQXFCOzs7OztJQUNyQiwyREFBc0M7Ozs7O0lBQ3RDLG9EQUFpQzs7Ozs7SUFDakMsaURBQW1DOzs7OztJQUV2Qiw2Q0FBdUI7Ozs7O0lBQUUsZ0RBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuXG4vKipcbiAqICBHZW5lcmFsIHByaW1pdGl2ZXMgZHJhd2VyIHJlc3BvbnNpYmxlIG9mIGRyYXdpbmcgQ2VzaXVtIHByaW1pdGl2ZXMuXG4gKiAgRHJhd2VycyB0aGUgaGFuZGxlIENlc2l1bSBwcmltaXRpdmVzIGV4dGVuZCBpdC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfc2hvdyA9IHRydWU7XG4gIHByaXZhdGUgX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwOiBhbnk7XG4gIHByb3RlY3RlZCBfY2VzaXVtQ29sbGVjdGlvbjogYW55O1xuICBwcm90ZWN0ZWQgX3Byb3BzQXNzaWduZXI6IEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHJhd2VyVHlwZTogYW55LCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uID0gbmV3IHRoaXMuZHJhd2VyVHlwZSgpO1xuICAgIHRoaXMuX3ByaW1pdGl2ZUNvbGxlY3Rpb25XcmFwID0gbmV3IENlc2l1bS5QcmltaXRpdmVDb2xsZWN0aW9uKHtkZXN0cm95UHJpbWl0aXZlczogZmFsc2V9KTtcbiAgICB0aGlzLl9wcmltaXRpdmVDb2xsZWN0aW9uV3JhcC5hZGQodGhpcy5fY2VzaXVtQ29sbGVjdGlvbik7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJpbWl0aXZlcy5hZGQodGhpcy5fcHJpbWl0aXZlQ29sbGVjdGlvbldyYXApO1xuICB9XG5cbiAgYWRkKGNlc2l1bVByb3BzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5hZGQoY2VzaXVtUHJvcHMpO1xuICB9XG5cbiAgdXBkYXRlKGVudGl0eTogYW55LCBjZXNpdW1Qcm9wczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLl9wcm9wc0Fzc2lnbmVyKSB7XG4gICAgICB0aGlzLl9wcm9wc0Fzc2lnbmVyKGVudGl0eSwgY2VzaXVtUHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3QuYXNzaWduKGVudGl0eSwgY2VzaXVtUHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xuICAgIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24ucmVtb3ZlKGVudGl0eSk7XG4gIH1cblxuICByZW1vdmVBbGwoKSB7XG4gICAgdGhpcy5fY2VzaXVtQ29sbGVjdGlvbi5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvdyA9IHNob3dWYWx1ZTtcbiAgICB0aGlzLl9wcmltaXRpdmVDb2xsZWN0aW9uV3JhcC5zaG93ID0gc2hvd1ZhbHVlO1xuICB9XG5cbiAgZ2V0U2hvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxufVxuIl19