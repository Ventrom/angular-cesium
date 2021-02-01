var Checker = /** @class */ (function () {
    function Checker() {
    }
    Checker.throwIfAnyNotPresent = function (values, propertyNames) {
        propertyNames.forEach(function (propertyName) { return Checker.throwIfNotPresent(values, propertyName); });
    };
    Checker.throwIfNotPresent = function (value, name) {
        if (!Checker.present(value[name])) {
            throw new Error("Error: " + name + " was not given.");
        }
    };
    Checker.present = function (value) {
        return value !== undefined && value !== null;
    };
    return Checker;
}());
export { Checker };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3V0aWxzL2NoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFBQTtJQWNBLENBQUM7SUFiUSw0QkFBb0IsR0FBM0IsVUFBNEIsTUFBYyxFQUFFLGFBQXVCO1FBQ2pFLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZLElBQUksT0FBQSxPQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVNLHlCQUFpQixHQUF4QixVQUF5QixLQUFVLEVBQUUsSUFBWTtRQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVUsSUFBSSxvQkFBaUIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUVNLGVBQU8sR0FBZCxVQUFlLEtBQVU7UUFDdkIsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBZEQsSUFjQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDaGVja2VyIHtcbiAgc3RhdGljIHRocm93SWZBbnlOb3RQcmVzZW50KHZhbHVlczogT2JqZWN0LCBwcm9wZXJ0eU5hbWVzOiBzdHJpbmdbXSkge1xuICAgIHByb3BlcnR5TmFtZXMuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4gQ2hlY2tlci50aHJvd0lmTm90UHJlc2VudCh2YWx1ZXMsIHByb3BlcnR5TmFtZSkpO1xuICB9XG5cbiAgc3RhdGljIHRocm93SWZOb3RQcmVzZW50KHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZykge1xuICAgIGlmICghQ2hlY2tlci5wcmVzZW50KHZhbHVlW25hbWVdKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvcjogJHtuYW1lfSB3YXMgbm90IGdpdmVuLmApO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBwcmVzZW50KHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDtcbiAgfVxufVxuIl19