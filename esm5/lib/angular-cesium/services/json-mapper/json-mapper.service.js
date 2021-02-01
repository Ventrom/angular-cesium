import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { JsonStringMapper } from 'json-string-mapper';
var JsonMapper = /** @class */ (function () {
    function JsonMapper() {
        this._mapper = new JsonStringMapper();
    }
    JsonMapper.prototype.map = function (expression) {
        return this._mapper.map(expression);
    };
    JsonMapper = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], JsonMapper);
    return JsonMapper;
}());
export { JsonMapper };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tYXBwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2pzb24tbWFwcGVyL2pzb24tbWFwcGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHdEQ7SUFHRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCx3QkFBRyxHQUFILFVBQUksVUFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBVFUsVUFBVTtRQUR0QixVQUFVLEVBQUU7O09BQ0EsVUFBVSxDQVV0QjtJQUFELGlCQUFDO0NBQUEsQUFWRCxJQVVDO1NBVlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TdHJpbmdNYXBwZXIgfSBmcm9tICdqc29uLXN0cmluZy1tYXBwZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvbk1hcHBlciB7XG4gIHByaXZhdGUgX21hcHBlcjogSnNvblN0cmluZ01hcHBlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9tYXBwZXIgPSBuZXcgSnNvblN0cmluZ01hcHBlcigpO1xuICB9XG5cbiAgbWFwKGV4cHJlc3Npb246IHN0cmluZyk6IE1hcDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9tYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuICB9XG59XG4iXX0=