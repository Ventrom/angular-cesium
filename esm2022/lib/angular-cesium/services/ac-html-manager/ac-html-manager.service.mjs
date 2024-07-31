import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class AcHtmlManager {
    constructor() {
        this._entities = new Map();
    }
    has(id) {
        return this._entities.has(id);
    }
    get(id) {
        return this._entities.get(id);
    }
    addOrUpdate(id, info) {
        this._entities.set(id, info);
    }
    remove(id) {
        this._entities.delete(id);
    }
    forEach(callback) {
        this._entities.forEach(callback);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlManager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: AcHtmlManager, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNlc2l1bS9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sYUFBYTtJQUd4QjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVksQ0FBQztJQUN2QyxDQUFDO0lBRUQsR0FBRyxDQUFDLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxHQUFHLENBQUMsRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFPLEVBQUUsSUFBcUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxPQUFPLENBQUMsUUFBYTtRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDOzhHQXpCVSxhQUFhO2tIQUFiLGFBQWE7OzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBY0h0bWxNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBfZW50aXRpZXM6IE1hcDxhbnksIGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fZW50aXRpZXMgPSBuZXcgTWFwPGFueSwgYW55PigpO1xuICB9XG5cbiAgaGFzKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuaGFzKGlkKTtcbiAgfVxuXG4gIGdldChpZDogc3RyaW5nKTogeyBlbnRpdHk6IGFueSwgcHJpbWl0aXZlOiBhbnkgfSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmdldChpZCk7XG4gIH1cblxuICBhZGRPclVwZGF0ZShpZDogYW55LCBpbmZvOiB7IGVudGl0eTogYW55LCBwcmltaXRpdmU6IGFueSB9KSB7XG4gICAgdGhpcy5fZW50aXRpZXMuc2V0KGlkLCBpbmZvKTtcbiAgfVxuXG4gIHJlbW92ZShpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZW50aXRpZXMuZGVsZXRlKGlkKTtcbiAgfVxuXG4gIGZvckVhY2goY2FsbGJhY2s6IGFueSkge1xuICAgIHRoaXMuX2VudGl0aWVzLmZvckVhY2goY2FsbGJhY2spO1xuICB9XG59XG4iXX0=