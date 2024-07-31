import { EventEmitter, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class LayerService {
    constructor() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    get cache() {
        return this._cache;
    }
    set cache(value) {
        this._cache = value;
    }
    get zIndex() {
        return this._zIndex;
    }
    set zIndex(value) {
        if (value !== this._zIndex) {
            this.layerUpdate.emit();
        }
        this._zIndex = value;
    }
    get show() {
        return this._show;
    }
    set show(value) {
        if (value !== this._show) {
            this.layerUpdate.emit();
        }
        this._show = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
        this.layerUpdate.emit();
    }
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
        this.layerUpdate.emit();
    }
    setEntityName(name) {
        this._entityName = name;
    }
    getEntityName() {
        return this._entityName;
    }
    registerDescription(descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    }
    unregisterDescription(descriptionComponent) {
        const index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    }
    getDescriptions() {
        return this.descriptions;
    }
    layerUpdates() {
        return this.layerUpdate;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: LayerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: LayerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.2", ngImport: i0, type: LayerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLekQsTUFBTSxPQUFPLFlBQVk7SUFEekI7UUFPVSxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQThFMUM7SUE1RUMsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLEtBQWM7UUFDckIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEtBQW1CO1FBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxPQUFPLENBQUMsT0FBTztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsbUJBQW1CLENBQUMsb0JBQWtDO1FBQ3BELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN4RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9DLENBQUM7SUFDSCxDQUFDO0lBRUQscUJBQXFCLENBQUMsb0JBQWtDO1FBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDOUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQzs4R0FyRlUsWUFBWTtrSEFBWixZQUFZOzsyRkFBWixZQUFZO2tCQUR4QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xuaW1wb3J0IHsgTGF5ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xheWVyLW9wdGlvbnMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTGF5ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xuICBwcml2YXRlIF9vcHRpb25zOiBMYXllck9wdGlvbnM7XG4gIHByaXZhdGUgX3Nob3c6IGJvb2xlYW47XG4gIHByaXZhdGUgX3pJbmRleDogbnVtYmVyO1xuICBwcml2YXRlIF9lbnRpdHlOYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgX2NhY2hlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBkZXNjcmlwdGlvbnM6IElEZXNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgbGF5ZXJVcGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgZ2V0IGNhY2hlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZTtcbiAgfVxuXG4gIHNldCBjYWNoZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2NhY2hlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgekluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3pJbmRleDtcbiAgfVxuXG4gIHNldCB6SW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fekluZGV4KSB7XG4gICAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgICB9XG4gICAgdGhpcy5fekluZGV4ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2hvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvdztcbiAgfVxuXG4gIHNldCBzaG93KHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9zaG93KSB7XG4gICAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgICB9XG4gICAgdGhpcy5fc2hvdyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG9wdGlvbnMoKTogTGF5ZXJPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuXG4gIHNldCBvcHRpb25zKHZhbHVlOiBMYXllck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdmFsdWU7XG4gICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gIH1cblxuICBnZXQgY29udGV4dCgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xuICB9XG5cbiAgc2V0IGNvbnRleHQoY29udGV4dCkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICB9XG5cbiAgc2V0RW50aXR5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9lbnRpdHlOYW1lID0gbmFtZTtcbiAgfVxuXG4gIGdldEVudGl0eU5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXR5TmFtZTtcbiAgfVxuXG4gIHJlZ2lzdGVyRGVzY3JpcHRpb24oZGVzY3JpcHRpb25Db21wb25lbnQ6IElEZXNjcmlwdGlvbikge1xuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9ucy5pbmRleE9mKGRlc2NyaXB0aW9uQ29tcG9uZW50KSA8IDApIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25zLnB1c2goZGVzY3JpcHRpb25Db21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJEZXNjcmlwdGlvbihkZXNjcmlwdGlvbkNvbXBvbmVudDogSURlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmRlc2NyaXB0aW9ucy5pbmRleE9mKGRlc2NyaXB0aW9uQ29tcG9uZW50KTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cblxuICBnZXREZXNjcmlwdGlvbnMoKTogSURlc2NyaXB0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9ucztcbiAgfVxuXG4gIGxheWVyVXBkYXRlcygpOiBFdmVudEVtaXR0ZXI8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMubGF5ZXJVcGRhdGU7XG4gIH1cbn1cbiJdfQ==