import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcToolbarButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.2", type: AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: { iconUrl: "iconUrl", buttonClass: "buttonClass", iconClass: "iconClass" }, outputs: { onClick: "onClick" }, ngImport: i0, template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [".button-container{border-radius:1px;background-color:#fffc;height:30px;width:30px;padding:5px;transition:all .2s;cursor:pointer;display:flex;justify-content:center;align-items:center;flex-direction:column}.button-container:hover{background-color:#fffffff2}.icon{height:30px;width:30px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcToolbarButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ac-toolbar-button', template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".button-container{border-radius:1px;background-color:#fffc;height:30px;width:30px;padding:5px;transition:all .2s;cursor:pointer;display:flex;justify-content:center;align-items:center;flex-direction:column}.button-container:hover{background-color:#fffffff2}.icon{height:30px;width:30px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { iconUrl: [{
                type: Input
            }], buttonClass: [{
                type: Input
            }], iconClass: [{
                type: Input
            }], onClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyLWJ1dHRvbi9hYy10b29sYmFyLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBRXhHOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQXFDSCxNQUFNLE9BQU8sd0JBQXdCO0lBY25DO1FBRkEsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFHN0IsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDOzhHQW5CVSx3QkFBd0I7a0dBQXhCLHdCQUF3Qiw4S0FqQ3ZCOzs7OztLQUtUOzsyRkE0QlEsd0JBQXdCO2tCQXBDcEMsU0FBUzsrQkFFSSxtQkFBbUIsWUFDbkI7Ozs7O0tBS1QsbUJBeUJnQix1QkFBdUIsQ0FBQyxNQUFNO3dEQU1qRCxPQUFPO3NCQUROLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixPQUFPO3NCQUROLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFRvb2xiYXIgYnV0dG9uIHdpZGdldCwgYWN0IGFzIGEgc2luZ2xlIGJ1dHRvbiBpbnNpZGUgYWMtdG9vbGJhciBjb21wb25lbnRcbiAqIENhbiBhY2NlcHRzIGNvbnRlbnQgY29tcG9uZW50cyBvciBwYXNzaW5nIFtpY29uVXJsXVxuICogY29uZmlndXJlIHdpdGg6IGBbaWNvblVybF1gLGBbYnV0dG9uQ2xhc3NdYCxgW2ljb25DbGFzc11gLGAob25DbGljaylgXG4gKlxuICogVXNhZ2U6XG4gKiBgYGBcbiAqIDxhYy10b29sYmFyIFthbGxvd0RyYWddPVwidHJ1ZVwiPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2hvbWUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwiZ29Ib21lKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDxhYy10b29sYmFyLWJ1dHRvbiBbaWNvblVybF09XCInYXNzZXRzL2V4cGxvcmUtaWNvbi5zdmcnXCIgKG9uQ2xpY2spPVwicmFuZ2VBbmRCZWFyaW5nKClcIj5cbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxuIDwvYWMtdG9vbGJhcj5cbiAqIGBgYFxuICpcbiAqL1xuQENvbXBvbmVudChcbiAge1xuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhci1idXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgKGNsaWNrKT1cIm9uQ2xpY2suZW1pdCgpXCIgY2xhc3M9XCJidXR0b24tY29udGFpbmVyIHt7YnV0dG9uQ2xhc3N9fVwiPlxuICAgICAgICAgICAgPGltZyAqbmdJZj1cImljb25VcmxcIiBbc3JjXT1cImljb25VcmxcIiBjbGFzcz1cImljb24ge3tpY29uQ2xhc3N9fVwiLz5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBzdHlsZXM6IFtgXG4gICAgICAgIC5idXR0b24tY29udGFpbmVyIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbiAgICAgICAgICAgIGhlaWdodDogMzBweDtcbiAgICAgICAgICAgIHdpZHRoOiAzMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogNXB4O1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5idXR0b24tY29udGFpbmVyOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45NSk7XG4gICAgICAgIH1cblxuICAgICAgICAuaWNvbiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICAgICAgICB3aWR0aDogMzBweDtcbiAgICAgICAgfVxuICAgIGBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB9XG4pXG5leHBvcnQgY2xhc3MgQWNUb29sYmFyQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKVxuICBpY29uVXJsOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgYnV0dG9uQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBpY29uQ2xhc3M6IHN0cmluZztcblxuICBAT3V0cHV0KClcbiAgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuXG4gIH1cbn1cbiJdfQ==