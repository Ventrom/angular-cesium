import { ElementRef, OnInit } from '@angular/core';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
export declare class AcHtmlContainerDirective implements OnInit {
    private _element;
    private _acHtmlManager;
    private _id;
    constructor(_element: ElementRef, _acHtmlManager: AcHtmlManager);
    acHtmlContainer: string;
    ngOnInit(): void;
}
