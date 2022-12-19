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
}
AcDefaultPlonterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDefaultPlonterComponent, deps: [{ token: i1.PlonterService }, { token: i0.ChangeDetectorRef }, { token: i2.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
AcDefaultPlonterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: AcDefaultPlonterComponent, selector: "ac-default-plonter", providers: [CoordinateConverter], ngImport: i0, template: `
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
    `, isInline: true, styles: [".plonter-context-menu{background-color:#fafafacc;box-shadow:1px 1px 5px #00000026}.plonter-item{cursor:pointer;padding:2px 15px;text-align:start}.plonter-item:hover{background-color:#00000026}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: AcDefaultPlonterComponent, decorators: [{
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
        }], ctorParameters: function () { return [{ type: i1.PlonterService }, { type: i0.ChangeDetectorRef }, { type: i2.CoordinateConverter }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1kZWZhdWx0LXBsb250ZXIvYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQXFCLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU5RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQzs7Ozs7O0FBc0N2RyxNQUFNLE9BQU8seUJBQXlCO0lBRXBDLFlBQW1CLGNBQThCLEVBQzdCLEVBQXFCLEVBQ3JCLFlBQWlDO1FBRmxDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFDckQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO1lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDO1lBQ3ZFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFRCxZQUFZLENBQUMsTUFBVztRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDOzt1SEFwQlUseUJBQXlCOzJHQUF6Qix5QkFBeUIsNkNBSHZCLENBQUMsbUJBQW1CLENBQUMsMEJBOUJ0Qjs7Ozs7Ozs7Ozs7S0FXVDs0RkFzQlEseUJBQXlCO2tCQXBDckMsU0FBUzsrQkFFSSxvQkFBb0IsWUFDcEI7Ozs7Ozs7Ozs7O0tBV1QsbUJBa0JnQix1QkFBdUIsQ0FBQyxNQUFNLGFBQ3BDLENBQUMsbUJBQW1CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtZGVmYXVsdC1wbG9udGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPGFjLWh0bWwgKm5nSWY9XCJwbG9udGVyU2VydmljZS5wbG9udGVyU2hvd25cIiBbcHJvcHNdPVwie1xuICAgICAgICBwb3NpdGlvbjogcGxvbnRlclBvc2l0aW9uXG4gICAgICB9XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwbG9udGVyLWNvbnRleHQtbWVudVwiPlxuICAgICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGVudGl0eSBvZiBwbG9udGVyU2VydmljZS5lbnRpdGVzVG9QbG9udGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGxvbnRlci1pdGVtXCIgKGNsaWNrKT1cImNob29zZUVudGl0eShlbnRpdHkpXCI+e3sgZW50aXR5Py5uYW1lIHx8IGVudGl0eT8uaWQgfX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvYWMtaHRtbD5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgLnBsb250ZXItY29udGV4dC1tZW51IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjUwLCAyNTAsIDI1MCwgMC44KTtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNXB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsb250ZXItaXRlbSB7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBwYWRkaW5nOiAycHggMTVweDtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsb250ZXItaXRlbTpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgICAgICB9XG5cbiAgICBgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyXSxcbiAgfVxuKVxuZXhwb3J0IGNsYXNzIEFjRGVmYXVsdFBsb250ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwbG9udGVyU2VydmljZTogUGxvbnRlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGdlb0NvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyQ2hhbmdlTm90aWZpZXIuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpKTtcbiAgfVxuXG4gIGdldCBwbG9udGVyUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlclNob3duKSB7XG4gICAgICBjb25zdCBzY3JlZW5Qb3MgPSB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJDbGlja1Bvc2l0aW9uLmVuZFBvc2l0aW9uO1xuICAgICAgcmV0dXJuIHRoaXMuZ2VvQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzY3JlZW5Qb3MpO1xuICAgIH1cbiAgfVxuXG4gIGNob29zZUVudGl0eShlbnRpdHk6IGFueSkge1xuICAgIHRoaXMucGxvbnRlclNlcnZpY2UucmVzb2x2ZVBsb250ZXIoZW50aXR5KTtcbiAgfVxufVxuIl19