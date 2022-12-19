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
}
LayerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LayerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LayerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LayerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: LayerService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItc2VydmljZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLekQsTUFBTSxPQUFPLFlBQVk7SUFEekI7UUFPVSxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2QsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQThFMUM7SUE1RUMsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsS0FBYztRQUNyQixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFtQjtRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLE9BQU87UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYSxDQUFDLElBQVk7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELG1CQUFtQixDQUFDLG9CQUFrQztRQUNwRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQscUJBQXFCLENBQUMsb0JBQWtDO1FBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDOUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDOzswR0FyRlUsWUFBWTs4R0FBWixZQUFZOzRGQUFaLFlBQVk7a0JBRHhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElEZXNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9kZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBMYXllck9wdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGF5ZXItb3B0aW9ucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMYXllclNlcnZpY2Uge1xuICBwcml2YXRlIF9jb250ZXh0OiBhbnk7XG4gIHByaXZhdGUgX29wdGlvbnM6IExheWVyT3B0aW9ucztcbiAgcHJpdmF0ZSBfc2hvdzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfekluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgX2VudGl0eU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBfY2FjaGUgPSB0cnVlO1xuICBwcml2YXRlIGRlc2NyaXB0aW9uczogSURlc2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSBsYXllclVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBnZXQgY2FjaGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlO1xuICB9XG5cbiAgc2V0IGNhY2hlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2FjaGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB6SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fekluZGV4O1xuICB9XG5cbiAgc2V0IHpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICAgIH1cbiAgICB0aGlzLl96SW5kZXggPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzaG93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93O1xuICB9XG5cbiAgc2V0IHNob3codmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX3Nob3cpIHtcbiAgICAgIHRoaXMubGF5ZXJVcGRhdGUuZW1pdCgpO1xuICAgIH1cbiAgICB0aGlzLl9zaG93ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgb3B0aW9ucygpOiBMYXllck9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICB9XG5cbiAgc2V0IG9wdGlvbnModmFsdWU6IExheWVyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMgPSB2YWx1ZTtcbiAgICB0aGlzLmxheWVyVXBkYXRlLmVtaXQoKTtcbiAgfVxuXG4gIGdldCBjb250ZXh0KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHQ7XG4gIH1cblxuICBzZXQgY29udGV4dChjb250ZXh0KSB7XG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5sYXllclVwZGF0ZS5lbWl0KCk7XG4gIH1cblxuICBzZXRFbnRpdHlOYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX2VudGl0eU5hbWUgPSBuYW1lO1xuICB9XG5cbiAgZ2V0RW50aXR5TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdHlOYW1lO1xuICB9XG5cbiAgcmVnaXN0ZXJEZXNjcmlwdGlvbihkZXNjcmlwdGlvbkNvbXBvbmVudDogSURlc2NyaXB0aW9uKSB7XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpIDwgMCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMucHVzaChkZXNjcmlwdGlvbkNvbXBvbmVudCk7XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlckRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uQ29tcG9uZW50OiBJRGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZGVzY3JpcHRpb25zLmluZGV4T2YoZGVzY3JpcHRpb25Db21wb25lbnQpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGdldERlc2NyaXB0aW9ucygpOiBJRGVzY3JpcHRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb25zO1xuICB9XG5cbiAgbGF5ZXJVcGRhdGVzKCk6IEV2ZW50RW1pdHRlcjxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5sYXllclVwZGF0ZTtcbiAgfVxufVxuIl19