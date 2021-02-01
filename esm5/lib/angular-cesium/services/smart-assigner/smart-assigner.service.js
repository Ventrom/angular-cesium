/**
 * Service for effective assignment.
 */
var SmartAssigner = /** @class */ (function () {
    function SmartAssigner() {
    }
    SmartAssigner.create = function (props, allowUndefined) {
        if (props === void 0) { props = []; }
        if (allowUndefined === void 0) { allowUndefined = true; }
        var fnBody = "";
        props.forEach(function (prop) {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += "if (!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty) && obj2['" + prop + "'] !== undefined) { obj1['" + prop + "'] = obj2['" + prop + "']; } ";
            }
            else {
                fnBody += "if(!(obj1['" + prop + "'] instanceof Cesium.CallbackProperty))obj1['" + prop + "'] = obj2['" + prop + "']; ";
            }
        });
        fnBody += "return obj1";
        var assignFn = new Function('obj1', 'obj2', fnBody);
        return function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        };
    };
    return SmartAssigner;
}());
export { SmartAssigner };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3NtYXJ0LWFzc2lnbmVyL3NtYXJ0LWFzc2lnbmVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSDtJQUFBO0lBcUJBLENBQUM7SUFuQlEsb0JBQU0sR0FBYixVQUFjLEtBQW9CLEVBQUUsY0FBOEI7UUFBcEQsc0JBQUEsRUFBQSxVQUFvQjtRQUFFLCtCQUFBLEVBQUEscUJBQThCO1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNoQixJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNuQiwyQ0FBMkM7Z0JBQzNDLE1BQU0sSUFBSSxpQkFBZSxJQUFJLHdEQUFtRCxJQUFJLGtDQUE2QixJQUFJLG1CQUFjLElBQUksV0FBUSxDQUFDO2FBQ2pKO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxnQkFBYyxJQUFJLHFEQUFnRCxJQUFJLG1CQUFjLElBQUksU0FBTSxDQUFDO2FBQzFHO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksYUFBYSxDQUFDO1FBQ3hCLElBQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdEQsT0FBTyxTQUFTLGFBQWEsQ0FBQyxJQUFZLEVBQUUsSUFBWTtZQUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2VydmljZSBmb3IgZWZmZWN0aXZlIGFzc2lnbm1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTbWFydEFzc2lnbmVyIHtcblxuICBzdGF0aWMgY3JlYXRlKHByb3BzOiBzdHJpbmdbXSA9IFtdLCBhbGxvd1VuZGVmaW5lZDogYm9vbGVhbiA9IHRydWUpOiAob2JqMTogT2JqZWN0LCBvYmoyOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgbGV0IGZuQm9keSA9IGBgO1xuXG4gICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGlmICghYWxsb3dVbmRlZmluZWQpIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICBmbkJvZHkgKz0gYGlmICghKG9iajFbJyR7cHJvcH0nXSBpbnN0YW5jZW9mIENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KSAmJiBvYmoyWycke3Byb3B9J10gIT09IHVuZGVmaW5lZCkgeyBvYmoxWycke3Byb3B9J10gPSBvYmoyWycke3Byb3B9J107IH0gYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZuQm9keSArPSBgaWYoIShvYmoxWycke3Byb3B9J10gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkpb2JqMVsnJHtwcm9wfSddID0gb2JqMlsnJHtwcm9wfSddOyBgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZm5Cb2R5ICs9IGByZXR1cm4gb2JqMWA7XG4gICAgY29uc3QgYXNzaWduRm4gPSBuZXcgRnVuY3Rpb24oJ29iajEnLCAnb2JqMicsIGZuQm9keSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gc21hcnRBc3NpZ25lcihvYmoxOiBPYmplY3QsIG9iajI6IE9iamVjdCkge1xuICAgICAgcmV0dXJuIGFzc2lnbkZuKG9iajEsIG9iajIpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==