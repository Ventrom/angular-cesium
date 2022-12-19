import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ComputationCache {
    constructor() {
        this._cache = new Map();
    }
    get(expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        const value = insertFn();
        this._cache.set(expression, value);
        return value;
    }
    clear() {
        this._cache.clear();
    }
}
ComputationCache.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ComputationCache, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ComputationCache.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ComputationCache });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: ComputationCache, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRVUsV0FBTSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7S0FlekM7SUFiQyxHQUFHLENBQUMsVUFBa0IsRUFBRSxRQUFxQjtRQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFFRCxNQUFNLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7OEdBZlUsZ0JBQWdCO2tIQUFoQixnQkFBZ0I7NEZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbXB1dGF0aW9uQ2FjaGUge1xuICBwcml2YXRlIF9jYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG5cbiAgZ2V0KGV4cHJlc3Npb246IHN0cmluZywgaW5zZXJ0Rm46ICgoKSA9PiBhbnkpKTogYW55IHtcbiAgICBpZiAodGhpcy5fY2FjaGUuaGFzKGV4cHJlc3Npb24pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGUuZ2V0KGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gaW5zZXJ0Rm4oKTtcbiAgICB0aGlzLl9jYWNoZS5zZXQoZXhwcmVzc2lvbiwgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2NhY2hlLmNsZWFyKCk7XG4gIH1cbn1cbiJdfQ==