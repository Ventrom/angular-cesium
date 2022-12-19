/**
 * Service for effective assignment.
 */
export class SmartAssigner {
    static create(props = [], allowUndefined = true) {
        let fnBody = ``;
        props.forEach(prop => {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += `if (!(obj1['${prop}'] instanceof Cesium.CallbackProperty) && obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
            }
            else {
                fnBody += `if(!(obj1['${prop}'] instanceof Cesium.CallbackProperty))obj1['${prop}'] = obj2['${prop}']; `;
            }
        });
        fnBody += `return obj1`;
        const assignFn = new Function('obj1', 'obj2', fnBody);
        return function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxFQUFFLGlCQUEwQixJQUFJO1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ25CLDJDQUEyQztnQkFDM0MsTUFBTSxJQUFJLGVBQWUsSUFBSSxtREFBbUQsSUFBSSw2QkFBNkIsSUFBSSxjQUFjLElBQUksUUFBUSxDQUFDO2FBQ2pKO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxjQUFjLElBQUksZ0RBQWdELElBQUksY0FBYyxJQUFJLE1BQU0sQ0FBQzthQUMxRztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLGFBQWEsQ0FBQztRQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXRELE9BQU8sU0FBUyxhQUFhLENBQUMsSUFBWSxFQUFFLElBQVk7WUFDdEQsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2VydmljZSBmb3IgZWZmZWN0aXZlIGFzc2lnbm1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTbWFydEFzc2lnbmVyIHtcblxuICBzdGF0aWMgY3JlYXRlKHByb3BzOiBzdHJpbmdbXSA9IFtdLCBhbGxvd1VuZGVmaW5lZDogYm9vbGVhbiA9IHRydWUpOiAob2JqMTogT2JqZWN0LCBvYmoyOiBPYmplY3QpID0+IE9iamVjdCB7XG4gICAgbGV0IGZuQm9keSA9IGBgO1xuXG4gICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGlmICghYWxsb3dVbmRlZmluZWQpIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICBmbkJvZHkgKz0gYGlmICghKG9iajFbJyR7cHJvcH0nXSBpbnN0YW5jZW9mIENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KSAmJiBvYmoyWycke3Byb3B9J10gIT09IHVuZGVmaW5lZCkgeyBvYmoxWycke3Byb3B9J10gPSBvYmoyWycke3Byb3B9J107IH0gYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZuQm9keSArPSBgaWYoIShvYmoxWycke3Byb3B9J10gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkpb2JqMVsnJHtwcm9wfSddID0gb2JqMlsnJHtwcm9wfSddOyBgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZm5Cb2R5ICs9IGByZXR1cm4gb2JqMWA7XG4gICAgY29uc3QgYXNzaWduRm4gPSBuZXcgRnVuY3Rpb24oJ29iajEnLCAnb2JqMicsIGZuQm9keSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gc21hcnRBc3NpZ25lcihvYmoxOiBPYmplY3QsIG9iajI6IE9iamVjdCkge1xuICAgICAgcmV0dXJuIGFzc2lnbkZuKG9iajEsIG9iajIpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==