export class Checker {
    static throwIfAnyNotPresent(values, propertyNames) {
        propertyNames.forEach(propertyName => Checker.throwIfNotPresent(values, propertyName));
    }
    static throwIfNotPresent(value, name) {
        if (!Checker.present(value[name])) {
            throw new Error(`Error: ${name} was not given.`);
        }
    }
    static present(value) {
        return value !== undefined && value !== null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vdXRpbHMvY2hlY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sT0FBTztJQUNsQixNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBYyxFQUFFLGFBQXVCO1FBQ2pFLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFVLEVBQUUsSUFBWTtRQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQVU7UUFDdkIsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDL0MsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENoZWNrZXIge1xuICBzdGF0aWMgdGhyb3dJZkFueU5vdFByZXNlbnQodmFsdWVzOiBPYmplY3QsIHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgcHJvcGVydHlOYW1lcy5mb3JFYWNoKHByb3BlcnR5TmFtZSA9PiBDaGVja2VyLnRocm93SWZOb3RQcmVzZW50KHZhbHVlcywgcHJvcGVydHlOYW1lKSk7XG4gIH1cblxuICBzdGF0aWMgdGhyb3dJZk5vdFByZXNlbnQodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodmFsdWVbbmFtZV0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yOiAke25hbWV9IHdhcyBub3QgZ2l2ZW4uYCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHByZXNlbnQodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICB9XG59XG4iXX0=