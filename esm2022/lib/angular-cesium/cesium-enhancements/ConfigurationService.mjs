import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fixCesiumEntitiesShadows } from './StaticGeometryColorBatch';
import * as i0 from "@angular/core";
export const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
export class ConfigurationService {
    constructor(config) {
        this.config = config;
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ConfigurationService, deps: [{ token: ANGULAR_CESIUM_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ConfigurationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANGULAR_CESIUM_CONFIG]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFFdEUsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUdqRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQStELE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQ3hFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNyRSxJQUFJLGtCQUFrQixLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ2pDLHdCQUF3QixFQUFFLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7OEdBTlUsb0JBQW9CLGtCQUNDLHFCQUFxQjtrSEFEMUMsb0JBQW9COzsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVOzswQkFFSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MgfSBmcm9tICcuL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaCc7XG5cbmV4cG9ydCBjb25zdCBBTkdVTEFSX0NFU0lVTV9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0FOR1VMQVJfQ0VTSVVNX0NPTkZJRycpO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvblNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KEFOR1VMQVJfQ0VTSVVNX0NPTkZJRykgcHJpdmF0ZSBjb25maWc6IGFueSkge1xuICAgIGNvbnN0IGZpeEVudGl0aWVzU2hhZG93cyA9IGNvbmZpZyA/IGNvbmZpZy5maXhFbnRpdGllc1NoYWRvd3MgOiB0cnVlO1xuICAgIGlmIChmaXhFbnRpdGllc1NoYWRvd3MgIT09IGZhbHNlKSB7XG4gICAgICBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==