export const UtilsService = {
    unique: (array) => {
        return array.reduce((accumulator, currentValue) => {
            if (accumulator.indexOf(currentValue) < 0) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, []);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2VzaXVtL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vdXRpbHMvdXRpbHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUc7SUFDMUIsTUFBTSxFQUFFLENBQUMsS0FBWSxFQUFTLEVBQUU7UUFDOUIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxFQUFFO1lBQ2hELElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDMUMsV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsT0FBTyxXQUFXLENBQUM7UUFDckIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgVXRpbHNTZXJ2aWNlID0ge1xuICB1bmlxdWU6IChhcnJheTogYW55W10pOiBhbnlbXSA9PiB7XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgaWYgKGFjY3VtdWxhdG9yLmluZGV4T2YoY3VycmVudFZhbHVlKSA8IDApIHtcbiAgICAgICAgYWNjdW11bGF0b3IucHVzaChjdXJyZW50VmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH0sIFtdKTtcbiAgfVxufTtcblxuIl19