import { __decorate, __metadata } from "tslib";
import { Input, Directive } from '@angular/core';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { MapLayersService } from '../map-layers/map-layers.service';
/**
 *  Extend this class to create drawing on map components.
 */
var EntityOnMapComponent = /** @class */ (function () {
    function EntityOnMapComponent(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    EntityOnMapComponent.prototype.ngOnInit = function () {
        this.selfPrimitiveIsDraw = false;
        var dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    };
    EntityOnMapComponent.prototype.ngOnChanges = function (changes) {
        var props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    };
    EntityOnMapComponent.prototype.drawOnMap = function () {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    };
    EntityOnMapComponent.prototype.removeFromMap = function () {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    };
    EntityOnMapComponent.prototype.updateOnMap = function () {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    };
    EntityOnMapComponent.prototype.ngOnDestroy = function () {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    };
    EntityOnMapComponent.ctorParameters = function () { return [
        { type: BasicDrawerService },
        { type: MapLayersService }
    ]; };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], EntityOnMapComponent.prototype, "props", void 0);
    EntityOnMapComponent = __decorate([
        Directive(),
        __metadata("design:paramtypes", [BasicDrawerService, MapLayersService])
    ], EntityOnMapComponent);
    return EntityOnMapComponent;
}());
export { EntityOnMapComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUErQyxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFcEU7O0dBRUc7QUFFSDtJQVFFLDhCQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQztJQUVELHVDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQiwyREFBMkQ7U0FDNUQ7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELDBDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELHdDQUFTLEdBQVQ7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELDRDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCwwQ0FBVyxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRCwwQ0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7O2dCQXZDOEIsa0JBQWtCO2dCQUFxQixnQkFBZ0I7O0lBTnRGO1FBREMsS0FBSyxFQUFFOzt1REFDRztJQUZBLG9CQUFvQjtRQURoQyxTQUFTLEVBQUU7eUNBU3FCLGtCQUFrQixFQUFxQixnQkFBZ0I7T0FSM0Usb0JBQW9CLENBZ0RoQztJQUFELDJCQUFDO0NBQUEsQUFoREQsSUFnREM7U0FoRFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMsIERpcmVjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcblxuLyoqXG4gKiAgRXh0ZW5kIHRoaXMgY2xhc3MgdG8gY3JlYXRlIGRyYXdpbmcgb24gbWFwIGNvbXBvbmVudHMuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEVudGl0eU9uTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpXG4gIHByb3BzOiBhbnk7XG5cbiAgcHJvdGVjdGVkIHNlbGZQcmltaXRpdmU6IGFueTtcbiAgcHJvdGVjdGVkIHNlbGZQcmltaXRpdmVJc0RyYXc6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBkYXRhU291cmNlczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBfZHJhd2VyOiBCYXNpY0RyYXdlclNlcnZpY2UsIHByaXZhdGUgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcgPSBmYWxzZTtcbiAgICBjb25zdCBkYXRhU291cmNlcyA9IHRoaXMuX2RyYXdlci5pbml0KCk7XG4gICAgaWYgKGRhdGFTb3VyY2VzKSB7XG4gICAgICB0aGlzLmRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXM7XG4gICAgICAvLyB0aGlzLm1hcExheWVycy5yZWdpc3RlckxheWVyRGF0YVNvdXJjZXMoZGF0YVNvdXJjZXMsIDApO1xuICAgIH1cbiAgICB0aGlzLmRyYXdPbk1hcCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHByb3BzID0gY2hhbmdlc1sncHJvcHMnXTtcbiAgICBpZiAocHJvcHMuY3VycmVudFZhbHVlICE9PSBwcm9wcy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZU9uTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgZHJhd09uTWFwKCkge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuc2VsZlByaW1pdGl2ZSA9IHRoaXMuX2RyYXdlci5hZGQodGhpcy5wcm9wcyk7XG4gIH1cblxuICByZW1vdmVGcm9tTWFwKCkge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzLl9kcmF3ZXIucmVtb3ZlKHRoaXMuc2VsZlByaW1pdGl2ZSk7XG4gIH1cblxuICB1cGRhdGVPbk1hcCgpIHtcbiAgICBpZiAodGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3KSB7XG4gICAgICByZXR1cm4gdGhpcy5fZHJhd2VyLnVwZGF0ZSh0aGlzLnNlbGZQcmltaXRpdmUsIHRoaXMucHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubWFwTGF5ZXJzLnJlbW92ZURhdGFTb3VyY2VzKHRoaXMuZGF0YVNvdXJjZXMpO1xuICAgIHRoaXMucmVtb3ZlRnJvbU1hcCgpO1xuICB9XG59XG4iXX0=