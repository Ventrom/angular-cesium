import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
let CzmlDrawerService = class CzmlDrawerService extends BasicDrawerService {
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    init(options) {
        const dataSources = [];
        this.czmlStream = new Cesium.CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
};
CzmlDrawerService.ctorParameters = () => [
    { type: CesiumService }
];
CzmlDrawerService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [CesiumService])
], CzmlDrawerService);
export { CzmlDrawerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2RyYXdlcnMvY3ptbC1kcmF3ZXIvY3ptbC1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFHMUU7O0dBRUc7QUFFSCxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFrQixTQUFRLGtCQUFrQjtJQUl2RCxZQUNVLGFBQTRCO1FBRXBDLEtBQUssRUFBRSxDQUFDO1FBRkEsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFHdEMsQ0FBQztJQUdELElBQUksQ0FBQyxPQUErQjtRQUNsQyxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRSxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsNkNBQTZDO0lBQzdDLEdBQUcsQ0FBQyxXQUFnQjtRQUVsQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFaEQsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFXLEVBQUUsV0FBZ0I7UUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxNQUFNLENBQUMsTUFBVztRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBa0I7UUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUM1QyxDQUFDO0NBRUYsQ0FBQTs7WUExQzBCLGFBQWE7O0FBTDNCLGlCQUFpQjtJQUQ3QixVQUFVLEVBQUU7cUNBTWMsYUFBYTtHQUwzQixpQkFBaUIsQ0ErQzdCO1NBL0NZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRW50aXRpZXNEcmF3ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL2VudGl0aWVzLWRyYXdlci1vcHRpb25zJztcblxuLyoqXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgY3ptbCBkYXRhU291cmNlcy5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN6bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgQmFzaWNEcmF3ZXJTZXJ2aWNlIHtcblxuICBjem1sU3RyZWFtOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cblxuICBpbml0KG9wdGlvbnM/OiBFbnRpdGllc0RyYXdlck9wdGlvbnMpIHtcbiAgICBjb25zdCBkYXRhU291cmNlcyA9IFtdO1xuXG4gICAgdGhpcy5jem1sU3RyZWFtID0gbmV3IENlc2l1bS5Dem1sRGF0YVNvdXJjZSgnY3ptbCcpO1xuXG4gICAgZGF0YVNvdXJjZXMucHVzaCh0aGlzLmN6bWxTdHJlYW0pO1xuXG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmRhdGFTb3VyY2VzLmFkZCh0aGlzLmN6bWxTdHJlYW0pO1xuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2VzO1xuICB9XG5cbiAgLy8gcmV0dXJucyB0aGUgcGFja2V0LCBwcm92aWRlZCBieSB0aGUgc3RyZWFtXG4gIGFkZChjZXNpdW1Qcm9wczogYW55KTogYW55IHtcblxuICAgIHRoaXMuY3ptbFN0cmVhbS5wcm9jZXNzKGNlc2l1bVByb3BzLmN6bWxQYWNrZXQpO1xuXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xuICB9XG5cbiAgdXBkYXRlKGVudGl0eTogYW55LCBjZXNpdW1Qcm9wczogYW55KSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLnByb2Nlc3MoY2VzaXVtUHJvcHMuY3ptbFBhY2tldCk7XG4gIH1cblxuICByZW1vdmUoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMucmVtb3ZlQnlJZChlbnRpdHkuYWNFbnRpdHkuaWQpO1xuICB9XG5cbiAgcmVtb3ZlQWxsKCkge1xuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5yZW1vdmVBbGwoKTtcbiAgfVxuXG4gIHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnNob3cgPSBzaG93VmFsdWU7XG4gIH1cblxufVxuXG5cbiJdfQ==