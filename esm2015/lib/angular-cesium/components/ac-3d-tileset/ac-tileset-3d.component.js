import { Component, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
export class AcTileset3dComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        this.tilesetInstance = null;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)) {
            throw new Error('Options must have a url');
        }
        this._3dtilesCollection = new Cesium.PrimitiveCollection();
        this.cesiumService.getScene().primitives.add(this._3dtilesCollection);
        if (this.show) {
            this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
            if (this.style) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.tilesetInstance) {
                    this._3dtilesCollection.add(this.tilesetInstance, this.index);
                }
                else {
                    this.tilesetInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
                    if (this.style) {
                        this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
                    }
                }
            }
            else if (this.tilesetInstance) {
                this._3dtilesCollection.remove(this.tilesetInstance, false);
            }
        }
        if (changes['style'] && !changes['style'].isFirstChange()) {
            const styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium.Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnDestroy() {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    }
}
AcTileset3dComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-3d-tile-layer',
                template: ''
            },] }
];
AcTileset3dComponent.ctorParameters = () => [
    { type: CesiumService }
];
AcTileset3dComponent.propDecorators = {
    options: [{ type: Input }],
    index: [{ type: Input }],
    show: [{ type: Input }],
    style: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdGlsZXNldC0zZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtM2QtdGlsZXNldC9hYy10aWxlc2V0LTNkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUU5Qzs7Ozs7Ozs7Ozs7R0FXRztBQUtILE1BQU0sT0FBTyxvQkFBb0I7SUE0Qi9CLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBM0JoRDs7V0FFRztRQUVILFlBQU8sR0FBcUIsRUFBRSxDQUFDO1FBUS9COztXQUVHO1FBRUgsU0FBSSxHQUFHLElBQUksQ0FBQztRQVFMLG9CQUFlLEdBQVEsSUFBSSxDQUFDO0lBSW5DLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFdEUsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkU7U0FDRjtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDdkQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUUvQyxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9EO3FCQUFNO29CQUNMLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUNkLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDdkU7aUJBQ0Y7YUFDRjtpQkFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM3RDtTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDekQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUNqRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2RTtTQUNGO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQzs7O1lBaEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixRQUFRLEVBQUUsRUFBRTthQUNiOzs7WUFsQlEsYUFBYTs7O3NCQXVCbkIsS0FBSztvQkFNTCxLQUFLO21CQU1MLEtBQUs7b0JBTUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uL3V0aWxzL2NoZWNrZXInO1xuXG4vKipcbiAqICBUaGlzIGNvbXBvbmVudCBpcyB1c2VkIGZvciBhZGRpbmcgYSAzZCB0aWxlc2V0IGxheWVyIHRvIHRoZSBtYXAgKGFjLW1hcCkuXG4gKiAgb3B0aW9ucyBhY2NvcmRpbmcgdG8gYENlc2l1bTNEVGlsZXNldGAgZGVmaW5pdGlvbi5cbiAqICBjaGVjayBvdXQ6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0Nlc2l1bTNEVGlsZXNldC5odG1sXG4gKlxuICpcbiAqICBfX1VzYWdlIDpfX1xuICogIGBgYFxuICogICAgPGFjLTNkLXRpbGUtbGF5ZXIgW29wdGlvbnNdPVwib3B0aW9uc09iamVjdFwiPlxuICogICAgPC9hYy0zZC10aWxlLWxheWVyPlxuICogIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhYy0zZC10aWxlLWxheWVyJyxcbiAgdGVtcGxhdGU6ICcnLFxufSlcbmV4cG9ydCBjbGFzcyBBY1RpbGVzZXQzZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogcmVmZXIgdG8gY2VzaXVtIGRvY3MgZm9yIGRldGFpbHMgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2VzaXVtM0RUaWxlc2V0Lmh0bWxcbiAgICovXG4gIEBJbnB1dCgpXG4gIG9wdGlvbnM6IHsgdXJsPzogc3RyaW5nIH0gPSB7fTtcblxuICAvKipcbiAgICogaW5kZXggKG9wdGlvbmFsKSAtIFRoZSBpbmRleCB0byBhZGQgdGhlIGxheWVyIGF0LiBJZiBvbWl0dGVkLCB0aGUgbGF5ZXIgd2lsbCBhZGRlZCBvbiB0b3Agb2YgYWxsIGV4aXN0aW5nIGxheWVycy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGluZGV4OiBOdW1iZXI7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIERldGVybWluZXMgaWYgdGhlIG1hcCBsYXllciBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNob3cgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBzaG93IChvcHRpb25hbCkgLSBTZXRzIDNEdGlsZXMgc3R5bGUuXG4gICAqL1xuICBASW5wdXQoKVxuICBzdHlsZTogYW55O1xuXG4gIHB1YmxpYyB0aWxlc2V0SW5zdGFuY2U6IGFueSA9IG51bGw7XG4gIHByaXZhdGUgXzNkdGlsZXNDb2xsZWN0aW9uOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIUNoZWNrZXIucHJlc2VudCh0aGlzLm9wdGlvbnMudXJsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xuICAgIH1cblxuICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uID0gbmV3IENlc2l1bS5QcmltaXRpdmVDb2xsZWN0aW9uKCk7XG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCkucHJpbWl0aXZlcy5hZGQodGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24pO1xuXG4gICAgaWYgKHRoaXMuc2hvdykge1xuICAgICAgdGhpcy50aWxlc2V0SW5zdGFuY2UgPSB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5hZGQobmV3IENlc2l1bS5DZXNpdW0zRFRpbGVzZXQodGhpcy5vcHRpb25zKSwgdGhpcy5pbmRleCk7XG4gICAgICBpZiAodGhpcy5zdHlsZSkge1xuICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzaG93J10gJiYgIWNoYW5nZXNbJ3Nob3cnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHNob3dWYWx1ZSA9IGNoYW5nZXNbJ3Nob3cnXS5jdXJyZW50VmFsdWU7XG5cbiAgICAgIGlmIChzaG93VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XG4gICAgICAgICAgdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24uYWRkKHRoaXMudGlsZXNldEluc3RhbmNlLCB0aGlzLmluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZSA9IHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLmFkZChuZXcgQ2VzaXVtLkNlc2l1bTNEVGlsZXNldCh0aGlzLm9wdGlvbnMpLCB0aGlzLmluZGV4KTtcbiAgICAgICAgICBpZiAodGhpcy5zdHlsZSkge1xuICAgICAgICAgICAgdGhpcy50aWxlc2V0SW5zdGFuY2Uuc3R5bGUgPSBuZXcgQ2VzaXVtLkNlc2l1bTNEVGlsZVN0eWxlKHRoaXMuc3R5bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnRpbGVzZXRJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy50aWxlc2V0SW5zdGFuY2UsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ3N0eWxlJ10gJiYgIWNoYW5nZXNbJ3N0eWxlJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBjb25zdCBzdHlsZVZhbHVlID0gY2hhbmdlc1snc3R5bGUnXS5jdXJyZW50VmFsdWU7XG4gICAgICBpZiAodGhpcy50aWxlc2V0SW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy50aWxlc2V0SW5zdGFuY2Uuc3R5bGUgPSBuZXcgQ2VzaXVtLkNlc2l1bTNEVGlsZVN0eWxlKHRoaXMuc3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRpbGVzZXRJbnN0YW5jZSkge1xuICAgICAgdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24ucmVtb3ZlKHRoaXMudGlsZXNldEluc3RhbmNlLCBmYWxzZSk7XG4gICAgfVxuICB9XG59XG4iXX0=