/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
var AcDefaultPlonterComponent = /** @class */ (function () {
    function AcDefaultPlonterComponent(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    /**
     * @return {?}
     */
    AcDefaultPlonterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.plonterService.plonterChangeNotifier.subscribe((/**
         * @return {?}
         */
        function () { return _this.cd.detectChanges(); }));
    };
    Object.defineProperty(AcDefaultPlonterComponent.prototype, "plonterPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.plonterService.plonterShown) {
                /** @type {?} */
                var screenPos = this.plonterService.plonterClickPosition.endPosition;
                return this.geoConverter.screenToCartesian3(screenPos);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} entity
     * @return {?}
     */
    AcDefaultPlonterComponent.prototype.chooseEntity = /**
     * @param {?} entity
     * @return {?}
     */
    function (entity) {
        this.plonterService.resolvePlonter(entity);
    };
    AcDefaultPlonterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ac-default-plonter',
                    template: "\n      <ac-html *ngIf=\"plonterService.plonterShown\" [props]=\"{\n        position: plonterPosition\n      }\">\n        <div class=\"plonter-context-menu\">\n          <div *ngFor=\"let entity of plonterService.entitesToPlonter\">\n            <div class=\"plonter-item\" (click)=\"chooseEntity(entity)\">{{ entity?.name || entity?.id }}\n            </div>\n          </div>\n        </div>\n      </ac-html>\n    ",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [CoordinateConverter],
                    styles: ["\n        .plonter-context-menu {\n            background-color: rgba(250, 250, 250, 0.8);\n            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);\n        }\n\n        .plonter-item {\n            cursor: pointer;\n            padding: 2px 15px;\n            text-align: start;\n        }\n\n        .plonter-item:hover {\n            background-color: rgba(0, 0, 0, 0.15);\n        }\n\n    "]
                }] }
    ];
    /** @nocollapse */
    AcDefaultPlonterComponent.ctorParameters = function () { return [
        { type: PlonterService },
        { type: ChangeDetectorRef },
        { type: CoordinateConverter }
    ]; };
    return AcDefaultPlonterComponent;
}());
export { AcDefaultPlonterComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtZGVmYXVsdC1wbG9udGVyL2FjLWRlZmF1bHQtcGxvbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBRXZHO0lBc0NFLG1DQUFtQixjQUE4QixFQUM3QixFQUFxQixFQUNyQixZQUFpQztRQUZsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDN0IsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQXFCO0lBQ3JELENBQUM7Ozs7SUFFRCw0Q0FBUTs7O0lBQVI7UUFBQSxpQkFFQztRQURDLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsU0FBUzs7O1FBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQXZCLENBQXVCLEVBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsc0JBQUksc0RBQWU7Ozs7UUFBbkI7WUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFOztvQkFDOUIsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsV0FBVztnQkFDdEUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3hEO1FBQ0gsQ0FBQzs7O09BQUE7Ozs7O0lBRUQsZ0RBQVk7Ozs7SUFBWixVQUFhLE1BQVc7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7Z0JBeERGLFNBQVMsU0FDUjtvQkFDRSxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUUsb2FBV1Q7b0JBa0JELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQzs2QkFsQnZCLGlaQWdCUjtpQkFHRjs7OztnQkFyQ00sY0FBYztnQkFEVyxpQkFBaUI7Z0JBRTFDLG1CQUFtQjs7SUEyRDVCLGdDQUFDO0NBQUEsQUF6REQsSUF5REM7U0FyQlkseUJBQXlCOzs7SUFFeEIsbURBQXFDOzs7OztJQUNyQyx1Q0FBNkI7Ozs7O0lBQzdCLGlEQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KFxuICB7XG4gICAgc2VsZWN0b3I6ICdhYy1kZWZhdWx0LXBsb250ZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8YWMtaHRtbCAqbmdJZj1cInBsb250ZXJTZXJ2aWNlLnBsb250ZXJTaG93blwiIFtwcm9wc109XCJ7XG4gICAgICAgIHBvc2l0aW9uOiBwbG9udGVyUG9zaXRpb25cbiAgICAgIH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBsb250ZXItY29udGV4dC1tZW51XCI+XG4gICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgZW50aXR5IG9mIHBsb250ZXJTZXJ2aWNlLmVudGl0ZXNUb1Bsb250ZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwbG9udGVyLWl0ZW1cIiAoY2xpY2spPVwiY2hvb3NlRW50aXR5KGVudGl0eSlcIj57eyBlbnRpdHk/Lm5hbWUgfHwgZW50aXR5Py5pZCB9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hYy1odG1sPlxuICAgIGAsXG4gICAgc3R5bGVzOiBbYFxuICAgICAgICAucGxvbnRlci1jb250ZXh0LW1lbnUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTAsIDI1MCwgMjUwLCAwLjgpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMXB4IDFweCA1cHggMHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIH1cblxuICAgICAgICAucGxvbnRlci1pdGVtIHtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDJweCAxNXB4O1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogc3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICAucGxvbnRlci1pdGVtOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIH1cblxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHByb3ZpZGVyczogW0Nvb3JkaW5hdGVDb252ZXJ0ZXJdLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNEZWZhdWx0UGxvbnRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBsb250ZXJTZXJ2aWNlOiBQbG9udGVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgZ2VvQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJDaGFuZ2VOb3RpZmllci5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCkpO1xuICB9XG5cbiAgZ2V0IHBsb250ZXJQb3NpdGlvbigpIHtcbiAgICBpZiAodGhpcy5wbG9udGVyU2VydmljZS5wbG9udGVyU2hvd24pIHtcbiAgICAgIGNvbnN0IHNjcmVlblBvcyA9IHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNsaWNrUG9zaXRpb24uZW5kUG9zaXRpb247XG4gICAgICByZXR1cm4gdGhpcy5nZW9Db252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvcyk7XG4gICAgfVxuICB9XG5cbiAgY2hvb3NlRW50aXR5KGVudGl0eTogYW55KSB7XG4gICAgdGhpcy5wbG9udGVyU2VydmljZS5yZXNvbHZlUGxvbnRlcihlbnRpdHkpO1xuICB9XG59XG4iXX0=