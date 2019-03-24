/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class Checker {
    /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    static throwIfAnyNotPresent(values, propertyNames) {
        propertyNames.forEach((/**
         * @param {?} propertyName
         * @return {?}
         */
        propertyName => Checker.throwIfNotPresent(values, propertyName)));
    }
    /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    static throwIfNotPresent(value, name) {
        if (!Checker.present(value[name])) {
            throw new Error(`Error: ${name} was not given.`);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static present(value) {
        return value !== undefined && value !== null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3V0aWxzL2NoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU0sT0FBTyxPQUFPOzs7Ozs7SUFDbEIsTUFBTSxDQUFDLG9CQUFvQixDQUFDLE1BQWMsRUFBRSxhQUF1QjtRQUNqRSxhQUFhLENBQUMsT0FBTzs7OztRQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBQyxDQUFDO0lBQ3pGLENBQUM7Ozs7OztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFVLEVBQUUsSUFBWTtRQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQVU7UUFDdkIsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDL0MsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENoZWNrZXIge1xuICBzdGF0aWMgdGhyb3dJZkFueU5vdFByZXNlbnQodmFsdWVzOiBPYmplY3QsIHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgcHJvcGVydHlOYW1lcy5mb3JFYWNoKHByb3BlcnR5TmFtZSA9PiBDaGVja2VyLnRocm93SWZOb3RQcmVzZW50KHZhbHVlcywgcHJvcGVydHlOYW1lKSk7XG4gIH1cblxuICBzdGF0aWMgdGhyb3dJZk5vdFByZXNlbnQodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodmFsdWVbbmFtZV0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yOiAke25hbWV9IHdhcyBub3QgZ2l2ZW4uYCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHByZXNlbnQodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICB9XG59XG4iXX0=