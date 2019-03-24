import { ChangeDetectorRef, OnInit } from '@angular/core';
import { PlonterService } from '../../services/plonter/plonter.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
export declare class AcDefaultPlonterComponent implements OnInit {
    plonterService: PlonterService;
    private cd;
    private geoConverter;
    constructor(plonterService: PlonterService, cd: ChangeDetectorRef, geoConverter: CoordinateConverter);
    ngOnInit(): void;
    readonly plonterPosition: any;
    chooseEntity(entity: any): void;
}
