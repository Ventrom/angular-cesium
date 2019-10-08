/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
export class AcDefaultPlonterComponent {
    /**
     * @param {?} plonterService
     * @param {?} cd
     * @param {?} geoConverter
     */
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe((/**
         * @return {?}
         */
        () => this.cd.detectChanges()));
    }
    /**
     * @return {?}
     */
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            /** @type {?} */
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    /**
     * @param {?} entity
     * @return {?}
     */
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
}
AcDefaultPlonterComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-default-plonter',
                template: `
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
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [CoordinateConverter],
                styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `]
            }] }
];
/** @nocollapse */
AcDefaultPlonterComponent.ctorParameters = () => [
    { type: PlonterService },
    { type: ChangeDetectorRef },
    { type: CoordinateConverter }
];
if (false) {
    /** @type {?} */
    AcDefaultPlonterComponent.prototype.plonterService;
    /**
     * @type {?}
     * @private
     */
    AcDefaultPlonterComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    AcDefaultPlonterComponent.prototype.geoConverter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtZGVmYXVsdC1wbG9udGVyL2FjLWRlZmF1bHQtcGxvbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBc0N2RyxNQUFNLE9BQU8seUJBQXlCOzs7Ozs7SUFFcEMsWUFBbUIsY0FBOEIsRUFDN0IsRUFBcUIsRUFDckIsWUFBaUM7UUFGbEMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzdCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtJQUNyRCxDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBQyxDQUFDO0lBQ3JGLENBQUM7Ozs7SUFFRCxJQUFJLGVBQWU7UUFDakIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRTs7a0JBQzlCLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFdBQVc7WUFDdEUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxZQUFZLENBQUMsTUFBVztRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDOzs7WUF4REYsU0FBUyxTQUNSO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7S0FXVDtnQkFrQkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO3lCQWxCdkI7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlI7YUFHRjs7OztZQXJDTSxjQUFjO1lBRFcsaUJBQWlCO1lBRTFDLG1CQUFtQjs7OztJQXdDZCxtREFBcUM7Ozs7O0lBQ3JDLHVDQUE2Qjs7Ozs7SUFDN0IsaURBQXlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGxvbnRlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wbG9udGVyL3Bsb250ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDb29yZGluYXRlQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoXG4gIHtcbiAgICBzZWxlY3RvcjogJ2FjLWRlZmF1bHQtcGxvbnRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxhYy1odG1sICpuZ0lmPVwicGxvbnRlclNlcnZpY2UucGxvbnRlclNob3duXCIgW3Byb3BzXT1cIntcbiAgICAgICAgcG9zaXRpb246IHBsb250ZXJQb3NpdGlvblxuICAgICAgfVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGxvbnRlci1jb250ZXh0LW1lbnVcIj5cbiAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBlbnRpdHkgb2YgcGxvbnRlclNlcnZpY2UuZW50aXRlc1RvUGxvbnRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBsb250ZXItaXRlbVwiIChjbGljayk9XCJjaG9vc2VFbnRpdHkoZW50aXR5KVwiPnt7IGVudGl0eT8ubmFtZSB8fCBlbnRpdHk/LmlkIH19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2FjLWh0bWw+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5wbG9udGVyLWNvbnRleHQtbWVudSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1MCwgMjUwLCAyNTAsIDAuOCk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAxcHggMXB4IDVweCAwcHggcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wbG9udGVyLWl0ZW0ge1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgcGFkZGluZzogMnB4IDE1cHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wbG9udGVyLWl0ZW06aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICAgICAgfVxuXG4gICAgYF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlcl0sXG4gIH1cbilcbmV4cG9ydCBjbGFzcyBBY0RlZmF1bHRQbG9udGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxvbnRlclNlcnZpY2U6IFBsb250ZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBnZW9Db252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNoYW5nZU5vdGlmaWVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNkLmRldGVjdENoYW5nZXMoKSk7XG4gIH1cblxuICBnZXQgcGxvbnRlclBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJTaG93bikge1xuICAgICAgY29uc3Qgc2NyZWVuUG9zID0gdGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyQ2xpY2tQb3NpdGlvbi5lbmRQb3NpdGlvbjtcbiAgICAgIHJldHVybiB0aGlzLmdlb0NvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zKTtcbiAgICB9XG4gIH1cblxuICBjaG9vc2VFbnRpdHkoZW50aXR5OiBhbnkpIHtcbiAgICB0aGlzLnBsb250ZXJTZXJ2aWNlLnJlc29sdmVQbG9udGVyKGVudGl0eSk7XG4gIH1cbn1cbiJdfQ==