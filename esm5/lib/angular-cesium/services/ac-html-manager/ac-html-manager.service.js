import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
var AcHtmlManager = /** @class */ (function () {
    function AcHtmlManager() {
        this._entities = new Map();
    }
    AcHtmlManager.prototype.has = function (id) {
        return this._entities.has(id);
    };
    AcHtmlManager.prototype.get = function (id) {
        return this._entities.get(id);
    };
    AcHtmlManager.prototype.addOrUpdate = function (id, info) {
        this._entities.set(id, info);
    };
    AcHtmlManager.prototype.remove = function (id) {
        this._entities.delete(id);
    };
    AcHtmlManager.prototype.forEach = function (callback) {
        this._entities.forEach(callback);
    };
    AcHtmlManager = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], AcHtmlManager);
    return AcHtmlManager;
}());
export { AcHtmlManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWNlc2l1bS8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7SUFHRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVksQ0FBQztJQUN2QyxDQUFDO0lBRUQsMkJBQUcsR0FBSCxVQUFJLEVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCwyQkFBRyxHQUFILFVBQUksRUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxFQUFPLEVBQUUsSUFBcUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCw4QkFBTSxHQUFOLFVBQU8sRUFBVTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwrQkFBTyxHQUFQLFVBQVEsUUFBYTtRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBekJVLGFBQWE7UUFEekIsVUFBVSxFQUFFOztPQUNBLGFBQWEsQ0EwQnpCO0lBQUQsb0JBQUM7Q0FBQSxBQTFCRCxJQTBCQztTQTFCWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQWNIdG1sTWFuYWdlciB7XG4gIHByaXZhdGUgX2VudGl0aWVzOiBNYXA8YW55LCBhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2VudGl0aWVzID0gbmV3IE1hcDxhbnksIGFueT4oKTtcbiAgfVxuXG4gIGhhcyhpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XG4gIH1cblxuICBnZXQoaWQ6IHN0cmluZyk6IHsgZW50aXR5OiBhbnksIHByaW1pdGl2ZTogYW55IH0ge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5nZXQoaWQpO1xuICB9XG5cbiAgYWRkT3JVcGRhdGUoaWQ6IGFueSwgaW5mbzogeyBlbnRpdHk6IGFueSwgcHJpbWl0aXZlOiBhbnkgfSkge1xuICAgIHRoaXMuX2VudGl0aWVzLnNldChpZCwgaW5mbyk7XG4gIH1cblxuICByZW1vdmUoaWQ6IHN0cmluZykge1xuICAgIHRoaXMuX2VudGl0aWVzLmRlbGV0ZShpZCk7XG4gIH1cblxuICBmb3JFYWNoKGNhbGxiYWNrOiBhbnkpIHtcbiAgICB0aGlzLl9lbnRpdGllcy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgfVxufVxuIl19