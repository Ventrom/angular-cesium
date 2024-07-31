import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/plonter/plonter.service";
import * as i2 from "../../services/coordinate-converter/coordinate-converter.service";
import * as i3 from "@angular/common";
import * as i4 from "../ac-html/ac-html.component";
export class AcDefaultPlonterComponent {
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
    }
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcDefaultPlonterComponent, deps: [{ token: i1.PlonterService }, { token: i0.ChangeDetectorRef }, { token: i2.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcDefaultPlonterComponent, selector: "ac-default-plonter", providers: [CoordinateConverter], ngImport: i0, template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `, isInline: true, styles: [".plonter-context-menu{background-color:#fafafacc;box-shadow:1px 1px 5px #00000026}.plonter-item{cursor:pointer;padding:2px 15px;text-align:start}.plonter-item:hover{background-color:#00000026}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcDefaultPlonterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-default-plonter', template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `, changeDetection: ChangeDetectionStrategy.OnPush, providers: [CoordinateConverter], styles: [".plonter-context-menu{background-color:#fafafacc;box-shadow:1px 1px 5px #00000026}.plonter-item{cursor:pointer;padding:2px 15px;text-align:start}.plonter-item:hover{background-color:#00000026}\n"] }]
        }], ctorParameters: () => [{ type: i1.PlonterService }, { type: i0.ChangeDetectorRef }, { type: i2.CoordinateConverter }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1kZWZhdWx0LXBsb250ZXIvYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQXFCLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU5RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQzs7Ozs7O0FBc0N2RyxNQUFNLE9BQU8seUJBQXlCO0lBRXBDLFlBQW1CLGNBQThCLEVBQzdCLEVBQXFCLEVBQ3JCLFlBQWlDO1FBRmxDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFDckQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUM7WUFDdkUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7SUFDSCxDQUFDO0lBRUQsWUFBWSxDQUFDLE1BQVc7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs4R0FwQlUseUJBQXlCO2tHQUF6Qix5QkFBeUIsNkNBSHZCLENBQUMsbUJBQW1CLENBQUMsMEJBOUJ0Qjs7Ozs7Ozs7Ozs7S0FXVDs7MkZBc0JRLHlCQUF5QjtrQkFwQ3JDLFNBQVM7K0JBRUksb0JBQW9CLFlBQ3BCOzs7Ozs7Ozs7OztLQVdULG1CQWtCZ0IsdUJBQXVCLENBQUMsTUFBTSxhQUNwQyxDQUFDLG1CQUFtQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGxvbnRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wbG9udGVyL3Bsb250ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoXG4gIHtcbiAgICBzZWxlY3RvcjogJ2FjLWRlZmF1bHQtcGxvbnRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxhYy1odG1sICpuZ0lmPVwicGxvbnRlclNlcnZpY2UucGxvbnRlclNob3duXCIgW3Byb3BzXT1cIntcbiAgICAgICAgcG9zaXRpb246IHBsb250ZXJQb3NpdGlvblxuICAgICAgfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGxvbnRlci1jb250ZXh0LW1lbnVcIj5cbiAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBlbnRpdHkgb2YgcGxvbnRlclNlcnZpY2UuZW50aXRlc1RvUGxvbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBsb250ZXItaXRlbVwiIChjbGljayk9XCJjaG9vc2VFbnRpdHkoZW50aXR5KVwiPnt7IGVudGl0eT8ubmFtZSB8fCBlbnRpdHk/LmlkIH19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2FjLWh0bWw+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5wbG9udGVyLWNvbnRleHQtbWVudSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1MCwgMjUwLCAyNTAsIDAuOCk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDVweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wbG9udGVyLWl0ZW0ge1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgcGFkZGluZzogMnB4IDE1cHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wbG9udGVyLWl0ZW06aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICAgICAgfVxuXG4gICAgYF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlcl0sXG4gIH1cbilcbmV4cG9ydCBjbGFzcyBBY0RlZmF1bHRQbG9udGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxvbnRlclNlcnZpY2U6IFBsb250ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBnZW9Db252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNoYW5nZU5vdGlmaWVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNkLmRldGVjdENoYW5nZXMoKSk7XG4gIH1cblxuICBnZXQgcGxvbnRlclBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJTaG93bikge1xuICAgICAgY29uc3Qgc2NyZWVuUG9zID0gdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyQ2xpY2tQb3NpdGlvbi5lbmRQb3NpdGlvbjtcbiAgICAgIHJldHVybiB0aGlzLmdlb0NvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zKTtcbiAgICB9XG4gIH1cblxuICBjaG9vc2VFbnRpdHkoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLnBsb250ZXJTZXJ2aWNlLnJlc29sdmVQbG9udGVyKGVudGl0eSk7XG4gIH1cbn1cbiJdfQ==