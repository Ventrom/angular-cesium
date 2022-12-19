import { Component, Input } from '@angular/core';
import { Checker } from '../../utils/checker';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
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
AcTileset3dComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcTileset3dComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcTileset3dComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcTileset3dComponent, selector: "ac-3d-tile-layer", inputs: { options: "options", index: "index", show: "show", style: "style" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcTileset3dComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-3d-tile-layer',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], style: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdGlsZXNldC0zZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtM2QtdGlsZXNldC9hYy10aWxlc2V0LTNkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFFOUYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7QUFFOUM7Ozs7Ozs7Ozs7O0dBV0c7QUFLSCxNQUFNLE9BQU8sb0JBQW9CO0lBNEIvQixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQTNCaEQ7O1dBRUc7UUFFSCxZQUFPLEdBQXFCLEVBQUUsQ0FBQztRQVEvQjs7V0FFRztRQUVILFNBQUksR0FBRyxJQUFJLENBQUM7UUFRTCxvQkFBZSxHQUFRLElBQUksQ0FBQztJQUluQyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBRUQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXRFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6RyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3ZELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFFL0MsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO29CQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMvRDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3ZFO2lCQUNGO2FBQ0Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUMvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDN0Q7U0FDRjtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3pELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDakQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkU7U0FDRjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3RDtJQUNILENBQUM7O2tIQTVFVSxvQkFBb0I7c0dBQXBCLG9CQUFvQiwySkFGckIsRUFBRTs0RkFFRCxvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7b0dBTUMsT0FBTztzQkFETixLQUFLO2dCQU9OLEtBQUs7c0JBREosS0FBSztnQkFPTixJQUFJO3NCQURILEtBQUs7Z0JBT04sS0FBSztzQkFESixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hlY2tlcic7XG5cbi8qKlxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIDNkIHRpbGVzZXQgbGF5ZXIgdG8gdGhlIG1hcCAoYWMtbWFwKS5cbiAqICBvcHRpb25zIGFjY29yZGluZyB0byBgQ2VzaXVtM0RUaWxlc2V0YCBkZWZpbml0aW9uLlxuICogIGNoZWNrIG91dDogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2VzaXVtM0RUaWxlc2V0Lmh0bWxcbiAqXG4gKlxuICogIF9fVXNhZ2UgOl9fXG4gKiAgYGBgXG4gKiAgICA8YWMtM2QtdGlsZS1sYXllciBbb3B0aW9uc109XCJvcHRpb25zT2JqZWN0XCI+XG4gKiAgICA8L2FjLTNkLXRpbGUtbGF5ZXI+XG4gKiAgYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjLTNkLXRpbGUtbGF5ZXInLFxuICB0ZW1wbGF0ZTogJycsXG59KVxuZXhwb3J0IGNsYXNzIEFjVGlsZXNldDNkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiByZWZlciB0byBjZXNpdW0gZG9jcyBmb3IgZGV0YWlscyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DZXNpdW0zRFRpbGVzZXQuaHRtbFxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogeyB1cmw/OiBzdHJpbmcgfSA9IHt9O1xuXG4gIC8qKlxuICAgKiBpbmRleCAob3B0aW9uYWwpIC0gVGhlIGluZGV4IHRvIGFkZCB0aGUgbGF5ZXIgYXQuIElmIG9taXR0ZWQsIHRoZSBsYXllciB3aWxsIGFkZGVkIG9uIHRvcCBvZiBhbGwgZXhpc3RpbmcgbGF5ZXJzLlxuICAgKi9cbiAgQElucHV0KClcbiAgaW5kZXg6IE51bWJlcjtcblxuICAvKipcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gRGV0ZXJtaW5lcyBpZiB0aGUgbWFwIGxheWVyIGlzIHNob3duLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2hvdyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIHNob3cgKG9wdGlvbmFsKSAtIFNldHMgM0R0aWxlcyBzdHlsZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHN0eWxlOiBhbnk7XG5cbiAgcHVibGljIHRpbGVzZXRJbnN0YW5jZTogYW55ID0gbnVsbDtcbiAgcHJpdmF0ZSBfM2R0aWxlc0NvbGxlY3Rpb246IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghQ2hlY2tlci5wcmVzZW50KHRoaXMub3B0aW9ucy51cmwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09wdGlvbnMgbXVzdCBoYXZlIGEgdXJsJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24gPSBuZXcgQ2VzaXVtLlByaW1pdGl2ZUNvbGxlY3Rpb24oKTtcbiAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0U2NlbmUoKS5wcmltaXRpdmVzLmFkZCh0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbik7XG5cbiAgICBpZiAodGhpcy5zaG93KSB7XG4gICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZSA9IHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLmFkZChuZXcgQ2VzaXVtLkNlc2l1bTNEVGlsZXNldCh0aGlzLm9wdGlvbnMpLCB0aGlzLmluZGV4KTtcbiAgICAgIGlmICh0aGlzLnN0eWxlKSB7XG4gICAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlLnN0eWxlID0gbmV3IENlc2l1bS5DZXNpdW0zRFRpbGVTdHlsZSh0aGlzLnN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXNbJ3Nob3cnXSAmJiAhY2hhbmdlc1snc2hvdyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgaWYgKHNob3dWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy50aWxlc2V0SW5zdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5hZGQodGhpcy50aWxlc2V0SW5zdGFuY2UsIHRoaXMuaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlID0gdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24uYWRkKG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlc2V0KHRoaXMub3B0aW9ucyksIHRoaXMuaW5kZXgpO1xuICAgICAgICAgIGlmICh0aGlzLnN0eWxlKSB7XG4gICAgICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnRpbGVzZXRJbnN0YW5jZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snc3R5bGUnXSAmJiAhY2hhbmdlc1snc3R5bGUnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHN0eWxlVmFsdWUgPSBjaGFuZ2VzWydzdHlsZSddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICh0aGlzLnRpbGVzZXRJbnN0YW5jZSkge1xuICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0uQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XG4gICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy50aWxlc2V0SW5zdGFuY2UsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==