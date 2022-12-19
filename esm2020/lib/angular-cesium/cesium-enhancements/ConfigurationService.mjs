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
}
ConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ConfigurationService, deps: [{ token: ANGULAR_CESIUM_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ConfigurationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANGULAR_CESIUM_CONFIG]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlndXJhdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2Nlc2l1bS1lbmhhbmNlbWVudHMvQ29uZmlndXJhdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFFdEUsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUdqRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLFlBQStELE1BQVc7UUFBWCxXQUFNLEdBQU4sTUFBTSxDQUFLO1FBQ3hFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNyRSxJQUFJLGtCQUFrQixLQUFLLEtBQUssRUFBRTtZQUNoQyx3QkFBd0IsRUFBRSxDQUFDO1NBQzVCO0lBQ0gsQ0FBQzs7a0hBTlUsb0JBQW9CLGtCQUNDLHFCQUFxQjtzSEFEMUMsb0JBQW9COzRGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVU7OzBCQUVJLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZpeENlc2l1bUVudGl0aWVzU2hhZG93cyB9IGZyb20gJy4vU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoJztcblxuZXhwb3J0IGNvbnN0IEFOR1VMQVJfQ0VTSVVNX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbignQU5HVUxBUl9DRVNJVU1fQ09ORklHJyk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5HVUxBUl9DRVNJVU1fQ09ORklHKSBwcml2YXRlIGNvbmZpZzogYW55KSB7XG4gICAgY29uc3QgZml4RW50aXRpZXNTaGFkb3dzID0gY29uZmlnID8gY29uZmlnLmZpeEVudGl0aWVzU2hhZG93cyA6IHRydWU7XG4gICAgaWYgKGZpeEVudGl0aWVzU2hhZG93cyAhPT0gZmFsc2UpIHtcbiAgICAgIGZpeENlc2l1bUVudGl0aWVzU2hhZG93cygpO1xuICAgIH1cbiAgfVxufVxuIl19