/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
export class CzmlDrawerService extends BasicDrawerService {
    /**
     * @param {?} cesiumService
     */
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    init(options) {
        /** @type {?} */
        const dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    /**
     * @param {?} cesiumProps
     * @return {?}
     */
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    /**
     * @param {?} entity
     * @param {?} cesiumProps
     * @return {?}
     */
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    /**
     * @return {?}
     */
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    /**
     * @param {?} showValue
     * @return {?}
     */
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
}
CzmlDrawerService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
CzmlDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
if (false) {
    /** @type {?} */
    CzmlDrawerService.prototype.czmlStream;
    /**
     * @type {?}
     * @private
     */
    CzmlDrawerService.prototype.cesiumService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7QUFPMUUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGtCQUFrQjs7OztJQUl2RCxZQUNVLGFBQTRCO1FBRXBDLEtBQUssRUFBRSxDQUFDO1FBRkEsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFHdEMsQ0FBQzs7Ozs7SUFHRCxJQUFJLENBQUMsT0FBK0I7O2NBQzVCLFdBQVcsR0FBRyxFQUFFO1FBRXRCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7Ozs7O0lBR0QsR0FBRyxDQUFDLFdBQWdCO1FBRWxCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzs7Ozs7SUFFRCxNQUFNLENBQUMsTUFBVyxFQUFFLFdBQWdCO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7Ozs7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdkMsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsU0FBa0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUM1QyxDQUFDOzs7WUE5Q0YsVUFBVTs7OztZQVBGLGFBQWE7Ozs7SUFVcEIsdUNBQWdCOzs7OztJQUdkLDBDQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VudGl0aWVzLWRyYXdlci1vcHRpb25zJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgY3ptbCBkYXRhU291cmNlcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN6bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcblxuICBjem1sU3RyZWFtOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cblxuICBpbml0KG9wdGlvbnM/OiBFbnRpdGllc0RyYXdlck9wdGlvbnMpIHtcbiAgICBjb25zdCBkYXRhU291cmNlcyA9IFtdO1xuXG4gICAgdGhpcy5jem1sU3RyZWFtID0gbmV3IENlc2l1bS5Dem1sRGF0YVNvdXJjZSgnY3ptbCcpO1xuXG4gICAgZGF0YVNvdXJjZXMucHVzaCh0aGlzLmN6bWxTdHJlYW0pO1xuXG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLmFkZCh0aGlzLmN6bWxTdHJlYW0pO1xuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2VzO1xuICB9XG5cbiAgLy8gcmV0dXJucyB0aGUgcGFja2V0LCBwcm92aWRlZCBieSB0aGUgc3RyZWFtXG4gIGFkZChjZXNpdW1Qcm9wczogYW55KTogYW55IHtcblxuICAgIHRoaXMuY3ptbFN0cmVhbS5wcm9jZXNzKGNlc2l1bVByb3BzLmN6bWxQYWNrZXQpO1xuXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xuICB9XG5cbiAgdXBkYXRlKGVudGl0eTogYW55LCBjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLnByb2Nlc3MoY2VzaXVtUHJvcHMuY3ptbFBhY2tldCk7XG4gIH1cblxuICByZW1vdmUoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMucmVtb3ZlQnlJZChlbnRpdHkuYWNFbnRpdHkuaWQpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnNob3cgPSBzaG93VmFsdWU7XG4gIH1cblxufVxuXG5cbiJdfQ==