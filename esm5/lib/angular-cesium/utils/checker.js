/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var Checker = /** @class */ (function () {
    function Checker() {
    }
    /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    Checker.throwIfAnyNotPresent = /**
     * @param {?} values
     * @param {?} propertyNames
     * @return {?}
     */
    function (values, propertyNames) {
        propertyNames.forEach((/**
         * @param {?} propertyName
         * @return {?}
         */
        function (propertyName) { return Checker.throwIfNotPresent(values, propertyName); }));
    };
    /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    Checker.throwIfNotPresent = /**
     * @param {?} value
     * @param {?} name
     * @return {?}
     */
    function (value, name) {
        if (!Checker.present(value[name])) {
            throw new Error("Error: " + name + " was not given.");
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Checker.present = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value !== undefined && value !== null;
    };
    return Checker;
}());
export { Checker };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3V0aWxzL2NoZWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0lBQUE7SUFjQSxDQUFDOzs7Ozs7SUFiUSw0QkFBb0I7Ozs7O0lBQTNCLFVBQTRCLE1BQWMsRUFBRSxhQUF1QjtRQUNqRSxhQUFhLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBL0MsQ0FBK0MsRUFBQyxDQUFDO0lBQ3pGLENBQUM7Ozs7OztJQUVNLHlCQUFpQjs7Ozs7SUFBeEIsVUFBeUIsS0FBVSxFQUFFLElBQVk7UUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFVLElBQUksb0JBQWlCLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7Ozs7O0lBRU0sZUFBTzs7OztJQUFkLFVBQWUsS0FBVTtRQUN2QixPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztJQUMvQyxDQUFDO0lBQ0gsY0FBQztBQUFELENBQUMsQUFkRCxJQWNDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIENoZWNrZXIge1xuICBzdGF0aWMgdGhyb3dJZkFueU5vdFByZXNlbnQodmFsdWVzOiBPYmplY3QsIHByb3BlcnR5TmFtZXM6IHN0cmluZ1tdKSB7XG4gICAgcHJvcGVydHlOYW1lcy5mb3JFYWNoKHByb3BlcnR5TmFtZSA9PiBDaGVja2VyLnRocm93SWZOb3RQcmVzZW50KHZhbHVlcywgcHJvcGVydHlOYW1lKSk7XG4gIH1cblxuICBzdGF0aWMgdGhyb3dJZk5vdFByZXNlbnQodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodmFsdWVbbmFtZV0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yOiAke25hbWV9IHdhcyBub3QgZ2l2ZW4uYCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHByZXNlbnQodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsO1xuICB9XG59XG4iXX0=