/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */
var AcCircleComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AcCircleComponent, _super);
    function AcCircleComponent(ellipseDrawerService, mapLayers) {
        return _super.call(this, ellipseDrawerService, mapLayers) || this;
    }
    /**
     * @private
     * @return {?}
     */
    AcCircleComponent.prototype.updateEllipseProps = /**
     * @private
     * @return {?}
     */
    function () {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    };
    /**
     * @return {?}
     */
    AcCircleComponent.prototype.drawOnMap = /**
     * @return {?}
     */
    function () {
        this.updateEllipseProps();
        _super.prototype.drawOnMap.call(this);
    };
    /**
     * @return {?}
     */
    AcCircleComponent.prototype.updateOnMap = /**
     * @return {?}
     */
    function () {
        this.updateEllipseProps();
        _super.prototype.updateOnMap.call(this);
    };
    AcCircleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-circle',
                    template: ''
                }] }
    ];
    /** @nocollapse */
    AcCircleComponent.ctorParameters = function () { return [
        { type: EllipseDrawerService },
        { type: MapLayersService }
    ]; };
    return AcCircleComponent;
}(EntityOnMapComponent));
export { AcCircleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtY2lyY2xlL2FjLWNpcmNsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJoRjtJQUl1Qyw2Q0FBb0I7SUFFekQsMkJBQVksb0JBQTBDLEVBQUUsU0FBMkI7ZUFDakYsa0JBQU0sb0JBQW9CLEVBQUUsU0FBUyxDQUFDO0lBQ3hDLENBQUM7Ozs7O0lBRU8sOENBQWtCOzs7O0lBQTFCO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCxxQ0FBUzs7O0lBQVQ7UUFDRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixpQkFBTSxTQUFTLFdBQUUsQ0FBQztJQUNwQixDQUFDOzs7O0lBRUQsdUNBQVc7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsaUJBQU0sV0FBVyxXQUFFLENBQUM7SUFDdEIsQ0FBQzs7Z0JBeEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7Ozs7Z0JBekJRLG9CQUFvQjtnQkFDcEIsZ0JBQWdCOztJQThDekIsd0JBQUM7Q0FBQSxBQXpCRCxDQUl1QyxvQkFBb0IsR0FxQjFEO1NBckJZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIFRoaXMgaXMgYSBjaXJjbGUgaW1wbGVtZW50YXRpb24uXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxuICogIHNlbWlNYWpvckF4aXMgYW5zIHNlbWlNaW5vckF4aXMgYXJlIHJlcGxhY2VkIHdpdGggcmFkaXVzIHByb3BlcnR5LlxuICogIEFsbCBvdGhlciBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIEVsbGlwc2VHcmFwaGljczpcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9FbGxpcHNlR3JhcGhpY3MuaHRtbFxuICpcbiAqICBfX1VzYWdlOl9fXG4gKiAgYGBgXG4gKiAgPGFjLWNpcmNsZSBbcHJvcHNdPVwie1xuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxuICogICAgcmFkaXVzOjQwMDAwLjAsXG4gKiAgICBncmFudWxhcml0eTowLjAzLFxuICogIH1cIj5cbiAqICA8L2FjLWNpcmNsZT5cbiAqICBgYGBcbiAqL1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy1jaXJjbGUnLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjQ2lyY2xlQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKGVsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBFbGxpcHNlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gICAgc3VwZXIoZWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVycyk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUVsbGlwc2VQcm9wcygpIHtcbiAgICB0aGlzLnByb3BzLnNlbWlNYWpvckF4aXMgPSB0aGlzLnByb3BzLnJhZGl1cztcbiAgICB0aGlzLnByb3BzLnNlbWlNaW5vckF4aXMgPSB0aGlzLnByb3BzLnJhZGl1cztcbiAgICB0aGlzLnByb3BzLnJvdGF0aW9uID0gMC4wO1xuICB9XG5cbiAgZHJhd09uTWFwKCkge1xuICAgIHRoaXMudXBkYXRlRWxsaXBzZVByb3BzKCk7XG4gICAgc3VwZXIuZHJhd09uTWFwKCk7XG4gIH1cblxuICB1cGRhdGVPbk1hcCgpIHtcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VQcm9wcygpO1xuICAgIHN1cGVyLnVwZGF0ZU9uTWFwKCk7XG4gIH1cbn1cbiJdfQ==