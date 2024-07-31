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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ComputationCache, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ComputationCache }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: ComputationCache, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sZ0JBQWdCO0lBRDdCO1FBRVUsV0FBTSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7S0FlekM7SUFiQyxHQUFHLENBQUMsVUFBa0IsRUFBRSxRQUFxQjtRQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDaEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7OEdBZlUsZ0JBQWdCO2tIQUFoQixnQkFBZ0I7OzJGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb21wdXRhdGlvbkNhY2hlIHtcbiAgcHJpdmF0ZSBfY2FjaGUgPSBuZXcgTWFwPHN0cmluZywgYW55PigpO1xuXG4gIGdldChleHByZXNzaW9uOiBzdHJpbmcsIGluc2VydEZuOiAoKCkgPT4gYW55KSk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlLmhhcyhleHByZXNzaW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlLmdldChleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IGluc2VydEZuKCk7XG4gICAgdGhpcy5fY2FjaGUuc2V0KGV4cHJlc3Npb24sIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xuICB9XG59XG4iXX0=