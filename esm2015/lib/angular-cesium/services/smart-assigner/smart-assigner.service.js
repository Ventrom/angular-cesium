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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnQtYXNzaWduZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItY2VzaXVtLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL3NtYXJ0LWFzc2lnbmVyL3NtYXJ0LWFzc2lnbmVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sYUFBYTtJQUV4QixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWtCLEVBQUUsRUFBRSxpQkFBMEIsSUFBSTtRQUNoRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNuQiwyQ0FBMkM7Z0JBQzNDLE1BQU0sSUFBSSxlQUFlLElBQUksbURBQW1ELElBQUksNkJBQTZCLElBQUksY0FBYyxJQUFJLFFBQVEsQ0FBQzthQUNqSjtpQkFBTTtnQkFDTCxNQUFNLElBQUksY0FBYyxJQUFJLGdEQUFnRCxJQUFJLGNBQWMsSUFBSSxNQUFNLENBQUM7YUFDMUc7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxhQUFhLENBQUM7UUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV0RCxPQUFPLFNBQVMsYUFBYSxDQUFDLElBQVksRUFBRSxJQUFZO1lBQ3RELE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNlcnZpY2UgZm9yIGVmZmVjdGl2ZSBhc3NpZ25tZW50LlxuICovXG5leHBvcnQgY2xhc3MgU21hcnRBc3NpZ25lciB7XG5cbiAgc3RhdGljIGNyZWF0ZShwcm9wczogc3RyaW5nW10gPSBbXSwgYWxsb3dVbmRlZmluZWQ6IGJvb2xlYW4gPSB0cnVlKTogKG9iajE6IE9iamVjdCwgb2JqMjogT2JqZWN0KSA9PiBPYmplY3Qge1xuICAgIGxldCBmbkJvZHkgPSBgYDtcblxuICAgIHByb3BzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBpZiAoIWFsbG93VW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgZm5Cb2R5ICs9IGBpZiAoIShvYmoxWycke3Byb3B9J10gaW5zdGFuY2VvZiBDZXNpdW0uQ2FsbGJhY2tQcm9wZXJ0eSkgJiYgb2JqMlsnJHtwcm9wfSddICE9PSB1bmRlZmluZWQpIHsgb2JqMVsnJHtwcm9wfSddID0gb2JqMlsnJHtwcm9wfSddOyB9IGA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbkJvZHkgKz0gYGlmKCEob2JqMVsnJHtwcm9wfSddIGluc3RhbmNlb2YgQ2VzaXVtLkNhbGxiYWNrUHJvcGVydHkpKW9iajFbJyR7cHJvcH0nXSA9IG9iajJbJyR7cHJvcH0nXTsgYDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZuQm9keSArPSBgcmV0dXJuIG9iajFgO1xuICAgIGNvbnN0IGFzc2lnbkZuID0gbmV3IEZ1bmN0aW9uKCdvYmoxJywgJ29iajInLCBmbkJvZHkpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHNtYXJ0QXNzaWduZXIob2JqMTogT2JqZWN0LCBvYmoyOiBPYmplY3QpIHtcbiAgICAgIHJldHVybiBhc3NpZ25GbihvYmoxLCBvYmoyKTtcbiAgICB9O1xuICB9XG59XG4iXX0=