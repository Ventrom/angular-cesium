import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
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
export declare class AcToolbarComponent implements OnInit, OnDestroy {
    private element;
    private cesiumService;
    toolbarClass: string;
    allowDrag: boolean;
    dragStyle: {
        'height.px': number;
        'width.px': number;
    };
    private subscription;
    constructor(element: ElementRef, cesiumService: CesiumService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
