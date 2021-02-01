import { __decorate, __metadata } from "tslib";
import { Input, Directive } from '@angular/core';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { MapLayersService } from '../map-layers/map-layers.service';
/**
 *  Extend this class to create drawing on map components.
 */
let EntityOnMapComponent = class EntityOnMapComponent {
    constructor(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    ngOnInit() {
        this.selfPrimitiveIsDraw = false;
        const dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    }
    ngOnChanges(changes) {
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    }
    removeFromMap() {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    }
    ngOnDestroy() {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    }
};
EntityOnMapComponent.ctorParameters = () => [
    { type: BasicDrawerService },
    { type: MapLayersService }
];
__decorate([
    Input(),
    __metadata("design:type", Object)
], EntityOnMapComponent.prototype, "props", void 0);
EntityOnMapComponent = __decorate([
    Directive(),
    __metadata("design:paramtypes", [BasicDrawerService, MapLayersService])
], EntityOnMapComponent);
export { EntityOnMapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUErQyxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFcEU7O0dBRUc7QUFFSCxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQVEvQixZQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQiwyREFBMkQ7U0FDNUQ7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRixDQUFBOztZQXhDZ0Msa0JBQWtCO1lBQXFCLGdCQUFnQjs7QUFOdEY7SUFEQyxLQUFLLEVBQUU7O21EQUNHO0FBRkEsb0JBQW9CO0lBRGhDLFNBQVMsRUFBRTtxQ0FTcUIsa0JBQWtCLEVBQXFCLGdCQUFnQjtHQVIzRSxvQkFBb0IsQ0FnRGhDO1NBaERZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzLCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2ljRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL2RyYXdlcnMvYmFzaWMtZHJhd2VyL2Jhc2ljLWRyYXdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XG5cbi8qKlxuICogIEV4dGVuZCB0aGlzIGNsYXNzIHRvIGNyZWF0ZSBkcmF3aW5nIG9uIG1hcCBjb21wb25lbnRzLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBFbnRpdHlPbk1hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKVxuICBwcm9wczogYW55O1xuXG4gIHByb3RlY3RlZCBzZWxmUHJpbWl0aXZlOiBhbnk7XG4gIHByb3RlY3RlZCBzZWxmUHJpbWl0aXZlSXNEcmF3OiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZGF0YVNvdXJjZXM6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2RyYXdlcjogQmFzaWNEcmF3ZXJTZXJ2aWNlLCBwcml2YXRlIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gZmFsc2U7XG4gICAgY29uc3QgZGF0YVNvdXJjZXMgPSB0aGlzLl9kcmF3ZXIuaW5pdCgpO1xuICAgIGlmIChkYXRhU291cmNlcykge1xuICAgICAgdGhpcy5kYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzO1xuICAgICAgLy8gdGhpcy5tYXBMYXllcnMucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzLCAwKTtcbiAgICB9XG4gICAgdGhpcy5kcmF3T25NYXAoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwcm9wcyA9IGNoYW5nZXNbJ3Byb3BzJ107XG4gICAgaWYgKHByb3BzLmN1cnJlbnRWYWx1ZSAhPT0gcHJvcHMucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVPbk1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdPbk1hcCgpIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLnNlbGZQcmltaXRpdmUgPSB0aGlzLl9kcmF3ZXIuYWRkKHRoaXMucHJvcHMpO1xuICB9XG5cbiAgcmVtb3ZlRnJvbU1hcCgpIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcy5fZHJhd2VyLnJlbW92ZSh0aGlzLnNlbGZQcmltaXRpdmUpO1xuICB9XG5cbiAgdXBkYXRlT25NYXAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RyYXdlci51cGRhdGUodGhpcy5zZWxmUHJpbWl0aXZlLCB0aGlzLnByb3BzKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcExheWVycy5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmRhdGFTb3VyY2VzKTtcbiAgICB0aGlzLnJlbW92ZUZyb21NYXAoKTtcbiAgfVxufVxuIl19