import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export class AcToolbarButtonComponent {
    constructor() {
        this.onClick = new EventEmitter();
    }
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
            },] }
];
AcToolbarButtonComponent.ctorParameters = () => [];
AcToolbarButtonComponent.propDecorators = {
    iconUrl: [{ type: Input }],
    buttonClass: [{ type: Input }],
    iconClass: [{ type: Input }],
    onClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyLWJ1dHRvbi9hYy10b29sYmFyLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV4Rzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFxQ0gsTUFBTSxPQUFPLHdCQUF3QjtJQWNuQztRQUZBLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBRzdCLENBQUM7SUFFRCxRQUFRO0lBRVIsQ0FBQzs7O1lBdkRGLFNBQVMsU0FDUjtnQkFDRSxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7O0tBS1Q7Z0JBeUJELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO3lCQXhCdEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJSO2FBRUY7Ozs7c0JBSUEsS0FBSzswQkFHTCxLQUFLO3dCQUdMLEtBQUs7c0JBR0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogVG9vbGJhciBidXR0b24gd2lkZ2V0LCBhY3QgYXMgYSBzaW5nbGUgYnV0dG9uIGluc2lkZSBhYy10b29sYmFyIGNvbXBvbmVudFxuICogQ2FuIGFjY2VwdHMgY29udGVudCBjb21wb25lbnRzIG9yIHBhc3NpbmcgW2ljb25VcmxdXG4gKiBjb25maWd1cmUgd2l0aDogYFtpY29uVXJsXWAsYFtidXR0b25DbGFzc11gLGBbaWNvbkNsYXNzXWAsYChvbkNsaWNrKWBcbiAqXG4gKiBVc2FnZTpcbiAqIGBgYFxuICogPGFjLXRvb2xiYXIgW2FsbG93RHJhZ109XCJ0cnVlXCI+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvaG9tZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJnb0hvbWUoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvZXhwbG9yZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJyYW5nZUFuZEJlYXJpbmcoKVwiPlxuIDwvYWMtdG9vbGJhci1idXR0b24+XG4gPC9hYy10b29sYmFyPlxuICogYGBgXG4gKlxuICovXG5AQ29tcG9uZW50KFxuICB7XG4gICAgc2VsZWN0b3I6ICdhYy10b29sYmFyLWJ1dHRvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAoY2xpY2spPVwib25DbGljay5lbWl0KClcIiBjbGFzcz1cImJ1dHRvbi1jb250YWluZXIge3tidXR0b25DbGFzc319XCI+XG4gICAgICAgICAgICA8aW1nICpuZ0lmPVwiaWNvblVybFwiIFtzcmNdPVwiaWNvblVybFwiIGNsYXNzPVwiaWNvbiB7e2ljb25DbGFzc319XCIvPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHN0eWxlczogW2BcbiAgICAgICAgLmJ1dHRvbi1jb250YWluZXIge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMXB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xuICAgICAgICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDMwcHg7XG4gICAgICAgICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycztcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgLmJ1dHRvbi1jb250YWluZXI6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjk1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5pY29uIHtcbiAgICAgICAgICAgIGhlaWdodDogMzBweDtcbiAgICAgICAgICAgIHdpZHRoOiAzMHB4O1xuICAgICAgICB9XG4gICAgYF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIH1cbilcbmV4cG9ydCBjbGFzcyBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpXG4gIGljb25Vcmw6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBidXR0b25DbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIGljb25DbGFzczogc3RyaW5nO1xuXG4gIEBPdXRwdXQoKVxuICBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgfVxufVxuIl19