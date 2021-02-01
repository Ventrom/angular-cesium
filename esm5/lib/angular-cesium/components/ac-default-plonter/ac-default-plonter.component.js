import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
var AcDefaultPlonterComponent = /** @class */ (function () {
    function AcDefaultPlonterComponent(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    AcDefaultPlonterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.plonterService.plonterChangeNotifier.subscribe(function () { return _this.cd.detectChanges(); });
    };
    Object.defineProperty(AcDefaultPlonterComponent.prototype, "plonterPosition", {
        get: function () {
            if (this.plonterService.plonterShown) {
                var screenPos = this.plonterService.plonterClickPosition.endPosition;
                return this.geoConverter.screenToCartesian3(screenPos);
            }
        },
        enumerable: true,
        configurable: true
    });
    AcDefaultPlonterComponent.prototype.chooseEntity = function (entity) {
        this.plonterService.resolvePlonter(entity);
    };
    AcDefaultPlonterComponent.ctorParameters = function () { return [
        { type: PlonterService },
        { type: ChangeDetectorRef },
        { type: CoordinateConverter }
    ]; };
    AcDefaultPlonterComponent = __decorate([
        Component({
            selector: 'ac-default-plonter',
            template: "\n      <ac-html *ngIf=\"plonterService.plonterShown\" [props]=\"{\n        position: plonterPosition\n      }\">\n        <div class=\"plonter-context-menu\">\n          <div *ngFor=\"let entity of plonterService.entitesToPlonter\">\n            <div class=\"plonter-item\" (click)=\"chooseEntity(entity)\">{{ entity?.name || entity?.id }}\n            </div>\n          </div>\n        </div>\n      </ac-html>\n    ",
            changeDetection: ChangeDetectionStrategy.OnPush,
            providers: [CoordinateConverter],
            styles: ["\n        .plonter-context-menu {\n            background-color: rgba(250, 250, 250, 0.8);\n            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);\n        }\n\n        .plonter-item {\n            cursor: pointer;\n            padding: 2px 15px;\n            text-align: start;\n        }\n\n        .plonter-item:hover {\n            background-color: rgba(0, 0, 0, 0.15);\n        }\n\n    "]
        }),
        __metadata("design:paramtypes", [PlonterService,
            ChangeDetectorRef,
            CoordinateConverter])
    ], AcDefaultPlonterComponent);
    return AcDefaultPlonterComponent;
}());
export { AcDefaultPlonterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtZGVmYXVsdC1wbG9udGVyL2FjLWRlZmF1bHQtcGxvbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQXNDdkc7SUFFRSxtQ0FBbUIsY0FBOEIsRUFDN0IsRUFBcUIsRUFDckIsWUFBaUM7UUFGbEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzdCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtJQUNyRCxDQUFDO0lBRUQsNENBQVEsR0FBUjtRQUFBLGlCQUVDO1FBREMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQXZCLENBQXVCLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsc0JBQUksc0RBQWU7YUFBbkI7WUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO2dCQUNwQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQztnQkFDdkUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3hEO1FBQ0gsQ0FBQzs7O09BQUE7SUFFRCxnREFBWSxHQUFaLFVBQWEsTUFBVztRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDOztnQkFsQmtDLGNBQWM7Z0JBQ3pCLGlCQUFpQjtnQkFDUCxtQkFBbUI7O0lBSjFDLHlCQUF5QjtRQXBDckMsU0FBUyxDQUNSO1lBQ0UsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixRQUFRLEVBQUUsb2FBV1Q7WUFrQkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUM7cUJBbEJ2QixpWkFnQlI7U0FHRixDQUNGO3lDQUdvQyxjQUFjO1lBQ3pCLGlCQUFpQjtZQUNQLG1CQUFtQjtPQUoxQyx5QkFBeUIsQ0FxQnJDO0lBQUQsZ0NBQUM7Q0FBQSxBQXJCRCxJQXFCQztTQXJCWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtZGVmYXVsdC1wbG9udGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgPGFjLWh0bWwgKm5nSWY9XCJwbG9udGVyU2VydmljZS5wbG9udGVyU2hvd25cIiBbcHJvcHNdPVwie1xuICAgICAgICBwb3NpdGlvbjogcGxvbnRlclBvc2l0aW9uXG4gICAgICB9XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwbG9udGVyLWNvbnRleHQtbWVudVwiPlxuICAgICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGVudGl0eSBvZiBwbG9udGVyU2VydmljZS5lbnRpdGVzVG9QbG9udGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGxvbnRlci1pdGVtXCIgKGNsaWNrKT1cImNob29zZUVudGl0eShlbnRpdHkpXCI+e3sgZW50aXR5Py5uYW1lIHx8IGVudGl0eT8uaWQgfX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvYWMtaHRtbD5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgLnBsb250ZXItY29udGV4dC1tZW51IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjUwLCAyNTAsIDI1MCwgMC44KTtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNXB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsb250ZXItaXRlbSB7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBwYWRkaW5nOiAycHggMTVweDtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IHN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsb250ZXItaXRlbTpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgICAgICB9XG5cbiAgICBgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyXSxcbiAgfVxuKVxuZXhwb3J0IGNsYXNzIEFjRGVmYXVsdFBsb250ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwbG9udGVyU2VydmljZTogUGxvbnRlclNlcnZpY2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGdlb0NvbnZlcnRlcjogQ29vcmRpbmF0ZUNvbnZlcnRlcikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyQ2hhbmdlTm90aWZpZXIuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpKTtcbiAgfVxuXG4gIGdldCBwbG9udGVyUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlclNob3duKSB7XG4gICAgICBjb25zdCBzY3JlZW5Qb3MgPSB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJDbGlja1Bvc2l0aW9uLmVuZFBvc2l0aW9uO1xuICAgICAgcmV0dXJuIHRoaXMuZ2VvQ29udmVydGVyLnNjcmVlblRvQ2FydGVzaWFuMyhzY3JlZW5Qb3MpO1xuICAgIH1cbiAgfVxuXG4gIGNob29zZUVudGl0eShlbnRpdHk6IGFueSkge1xuICAgIHRoaXMucGxvbnRlclNlcnZpY2UucmVzb2x2ZVBsb250ZXIoZW50aXR5KTtcbiAgfVxufVxuIl19