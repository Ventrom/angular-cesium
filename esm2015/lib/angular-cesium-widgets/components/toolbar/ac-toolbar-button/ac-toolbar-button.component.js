/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 * <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 * </ac-toolbar-button>
 * <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 * </ac-toolbar-button>
 * </ac-toolbar>
 * ```
 *
 */
export class AcToolbarButtonComponent {
    constructor() {
        this.onClick = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
AcToolbarButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'ac-toolbar-button',
                template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
        .button-container {
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            height: 30px;
            width: 30px;
            padding: 5px;
            transition: all 0.2s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .button-container:hover {
            background-color: rgba(255, 255, 255, 0.95);
        }

        .icon {
            height: 30px;
            width: 30px;
        }
    `]
            }] }
];
/** @nocollapse */
AcToolbarButtonComponent.ctorParameters = () => [];
AcToolbarButtonComponent.propDecorators = {
    iconUrl: [{ type: Input }],
    buttonClass: [{ type: Input }],
    iconClass: [{ type: Input }],
    onClick: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    AcToolbarButtonComponent.prototype.iconUrl;
    /** @type {?} */
    AcToolbarButtonComponent.prototype.buttonClass;
    /** @type {?} */
    AcToolbarButtonComponent.prototype.iconClass;
    /** @type {?} */
    AcToolbarButtonComponent.prototype.onClick;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL3Rvb2xiYXIvYWMtdG9vbGJhci1idXR0b24vYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQXNEeEcsTUFBTSxPQUFPLHdCQUF3QjtJQWNuQztRQUZBLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBRzdCLENBQUM7Ozs7SUFFRCxRQUFRO0lBRVIsQ0FBQzs7O1lBdkRGLFNBQVMsU0FDUjtnQkFDRSxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7O0tBS1Q7Z0JBeUJELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO3lCQXhCdEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJSO2FBRUY7Ozs7O3NCQUlBLEtBQUs7MEJBR0wsS0FBSzt3QkFHTCxLQUFLO3NCQUdMLE1BQU07Ozs7SUFUUCwyQ0FDZ0I7O0lBRWhCLCtDQUNvQjs7SUFFcEIsNkNBQ2tCOztJQUVsQiwyQ0FDNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFRvb2xiYXIgYnV0dG9uIHdpZGdldCwgYWN0IGFzIGEgc2luZ2xlIGJ1dHRvbiBpbnNpZGUgYWMtdG9vbGJhciBjb21wb25lbnRcbiAqIENhbiBhY2NlcHRzIGNvbnRlbnQgY29tcG9uZW50cyBvciBwYXNzaW5nIFtpY29uVXJsXVxuICogY29uZmlndXJlIHdpdGg6IGBbaWNvblVybF1gLGBbYnV0dG9uQ2xhc3NdYCxgW2ljb25DbGFzc11gLGAob25DbGljaylgXG4gKlxuICogVXNhZ2U6XG4gKiBgYGBcbiAqIDxhYy10b29sYmFyIFthbGxvd0RyYWddPVwidHJ1ZVwiPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2hvbWUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwiZ29Ib21lKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2V4cGxvcmUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwicmFuZ2VBbmRCZWFyaW5nKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDwvYWMtdG9vbGJhcj5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhci1idXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgKGNsaWNrKT1cIm9uQ2xpY2suZW1pdCgpXCIgY2xhc3M9XCJidXR0b24tY29udGFpbmVyIHt7YnV0dG9uQ2xhc3N9fVwiPlxuICAgICAgICAgICAgPGltZyAqbmdJZj1cImljb25VcmxcIiBbc3JjXT1cImljb25VcmxcIiBjbGFzcz1cImljb24ge3tpY29uQ2xhc3N9fVwiLz5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5idXR0b24tY29udGFpbmVyIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbiAgICAgICAgICAgIGhlaWdodDogMzBweDtcbiAgICAgICAgICAgIHdpZHRoOiAzMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5idXR0b24tY29udGFpbmVyOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45NSk7XG4gICAgICAgIH1cblxuICAgICAgICAuaWNvbiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICAgICAgICB3aWR0aDogMzBweDtcbiAgICAgICAgfVxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKVxuICBpY29uVXJsOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgYnV0dG9uQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBpY29uQ2xhc3M6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gIH1cbn1cbiJdfQ==