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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvc21hcnQtYXNzaWduZXIvc21hcnQtYXNzaWduZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRztBQUNILE1BQU0sT0FBTyxhQUFhO0lBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBa0IsRUFBRSxFQUFFLGlCQUEwQixJQUFJO1FBQ2hFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDcEIsMkNBQTJDO2dCQUMzQyxNQUFNLElBQUksZUFBZSxJQUFJLG1EQUFtRCxJQUFJLDZCQUE2QixJQUFJLGNBQWMsSUFBSSxRQUFRLENBQUM7WUFDbEosQ0FBQztpQkFBTSxDQUFDO2dCQUNOLE1BQU0sSUFBSSxjQUFjLElBQUksZ0RBQWdELElBQUksY0FBYyxJQUFJLE1BQU0sQ0FBQztZQUMzRyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksYUFBYSxDQUFDO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdEQsT0FBTyxTQUFTLGFBQWEsQ0FBQyxJQUFZLEVBQUUsSUFBWTtZQUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXJ2aWNlIGZvciBlZmZlY3RpdmUgYXNzaWdubWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFNtYXJ0QXNzaWduZXIge1xuXG4gIHN0YXRpYyBjcmVhdGUocHJvcHM6IHN0cmluZ1tdID0gW10sIGFsbG93VW5kZWZpbmVkOiBib29sZWFuID0gdHJ1ZSk6IChvYmoxOiBPYmplY3QsIG9iajI6IE9iamVjdCkgPT4gT2JqZWN0IHtcbiAgICBsZXQgZm5Cb2R5ID0gYGA7XG5cbiAgICBwcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgaWYgKCFhbGxvd1VuZGVmaW5lZCkge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgIGZuQm9keSArPSBgaWYgKCEob2JqMVsnJHtwcm9wfSddIGluc3RhbmNlb2YgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkpICYmIG9iajJbJyR7cHJvcH0nXSAhPT0gdW5kZWZpbmVkKSB7IG9iajFbJyR7cHJvcH0nXSA9IG9iajJbJyR7cHJvcH0nXTsgfSBgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm5Cb2R5ICs9IGBpZighKG9iajFbJyR7cHJvcH0nXSBpbnN0YW5jZW9mIENlc2l1bS5DYWxsYmFja1Byb3BlcnR5KSlvYmoxWycke3Byb3B9J10gPSBvYmoyWycke3Byb3B9J107IGA7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBmbkJvZHkgKz0gYHJldHVybiBvYmoxYDtcbiAgICBjb25zdCBhc3NpZ25GbiA9IG5ldyBGdW5jdGlvbignb2JqMScsICdvYmoyJywgZm5Cb2R5KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBzbWFydEFzc2lnbmVyKG9iajE6IE9iamVjdCwgb2JqMjogT2JqZWN0KSB7XG4gICAgICByZXR1cm4gYXNzaWduRm4ob2JqMSwgb2JqMik7XG4gICAgfTtcbiAgfVxufVxuIl19