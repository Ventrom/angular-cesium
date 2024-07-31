import { Input, Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/basic-drawer/basic-drawer.service";
import * as i2 from "../map-layers/map-layers.service";
/**
 *  Extend this class to create drawing on map components.
 */
export class EntityOnMapComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: EntityOnMapComponent, deps: [{ token: i1.BasicDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.2", type: EntityOnMapComponent, inputs: { props: "props" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: EntityOnMapComponent, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.BasicDrawerService }, { type: i2.MapLayersService }], propDecorators: { props: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LW9uLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBK0MsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBSTlGOztHQUVHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQVEvQixZQUFzQixPQUEyQixFQUFVLFNBQTJCO1FBQWhFLFlBQU8sR0FBUCxPQUFPLENBQW9CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBa0I7SUFDdEYsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUMvQiwyREFBMkQ7UUFDN0QsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdELENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDOzhHQS9DVSxvQkFBb0I7a0dBQXBCLG9CQUFvQjs7MkZBQXBCLG9CQUFvQjtrQkFEaEMsU0FBUztzSEFHUixLQUFLO3NCQURKLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcywgRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9kcmF3ZXJzL2Jhc2ljLWRyYXdlci9iYXNpYy1kcmF3ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xuXG4vKipcbiAqICBFeHRlbmQgdGhpcyBjbGFzcyB0byBjcmVhdGUgZHJhd2luZyBvbiBtYXAgY29tcG9uZW50cy5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgRW50aXR5T25NYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KClcbiAgcHJvcHM6IGFueTtcblxuICBwcm90ZWN0ZWQgc2VsZlByaW1pdGl2ZTogYW55O1xuICBwcm90ZWN0ZWQgc2VsZlByaW1pdGl2ZUlzRHJhdzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGRhdGFTb3VyY2VzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIF9kcmF3ZXI6IEJhc2ljRHJhd2VyU2VydmljZSwgcHJpdmF0ZSBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZlByaW1pdGl2ZUlzRHJhdyA9IGZhbHNlO1xuICAgIGNvbnN0IGRhdGFTb3VyY2VzID0gdGhpcy5fZHJhd2VyLmluaXQoKTtcbiAgICBpZiAoZGF0YVNvdXJjZXMpIHtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlcztcbiAgICAgIC8vIHRoaXMubWFwTGF5ZXJzLnJlZ2lzdGVyTGF5ZXJEYXRhU291cmNlcyhkYXRhU291cmNlcywgMCk7XG4gICAgfVxuICAgIHRoaXMuZHJhd09uTWFwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcHJvcHMgPSBjaGFuZ2VzWydwcm9wcyddO1xuICAgIGlmIChwcm9wcy5jdXJyZW50VmFsdWUgIT09IHByb3BzLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlT25NYXAoKTtcbiAgICB9XG4gIH1cblxuICBkcmF3T25NYXAoKSB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5zZWxmUHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZCh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21NYXAoKSB7XG4gICAgdGhpcy5zZWxmUHJpbWl0aXZlSXNEcmF3ID0gZmFsc2U7XG4gICAgcmV0dXJuIHRoaXMuX2RyYXdlci5yZW1vdmUodGhpcy5zZWxmUHJpbWl0aXZlKTtcbiAgfVxuXG4gIHVwZGF0ZU9uTWFwKCkge1xuICAgIGlmICh0aGlzLnNlbGZQcmltaXRpdmVJc0RyYXcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kcmF3ZXIudXBkYXRlKHRoaXMuc2VsZlByaW1pdGl2ZSwgdGhpcy5wcm9wcyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5tYXBMYXllcnMucmVtb3ZlRGF0YVNvdXJjZXModGhpcy5kYXRhU291cmNlcyk7XG4gICAgdGhpcy5yZW1vdmVGcm9tTWFwKCk7XG4gIH1cbn1cbiJdfQ==