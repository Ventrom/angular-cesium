import { Injectable } from '@angular/core';
import { JsonStringMapper } from 'json-string-mapper';
import * as i0 from "@angular/core";
export class JsonMapper {
    constructor() {
        this._mapper = new JsonStringMapper();
    }
    map(expression) {
        return this._mapper.map(expression);
    }
}
JsonMapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: JsonMapper, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JsonMapper.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: JsonMapper });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: JsonMapper, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1tYXBwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvanNvbi1tYXBwZXIvanNvbi1tYXBwZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUd0RCxNQUFNLE9BQU8sVUFBVTtJQUdyQjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxHQUFHLENBQUMsVUFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDOzt3R0FUVSxVQUFVOzRHQUFWLFVBQVU7NEZBQVYsVUFBVTtrQkFEdEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TdHJpbmdNYXBwZXIgfSBmcm9tICdqc29uLXN0cmluZy1tYXBwZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnNvbk1hcHBlciB7XG4gIHByaXZhdGUgX21hcHBlcjogSnNvblN0cmluZ01hcHBlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9tYXBwZXIgPSBuZXcgSnNvblN0cmluZ01hcHBlcigpO1xuICB9XG5cbiAgbWFwKGV4cHJlc3Npb246IHN0cmluZyk6IE1hcDxzdHJpbmcsIHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9tYXBwZXIubWFwKGV4cHJlc3Npb24pO1xuICB9XG59XG4iXX0=