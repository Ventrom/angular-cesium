export var GraphicsType;
(function (GraphicsType) {
    GraphicsType[GraphicsType["ellipse"] = Cesium.EllipseGraphics] = "ellipse";
    GraphicsType[GraphicsType["ellipsoid"] = Cesium.EllipsoidGraphics] = "ellipsoid";
    GraphicsType[GraphicsType["polygon"] = Cesium.PolygonGraphics] = "polygon";
    GraphicsType[GraphicsType["polyline"] = Cesium.PolylineGraphics] = "polyline";
    GraphicsType[GraphicsType["polylineVolume"] = Cesium.PolylineVolumeGraphics] = "polylineVolume";
    GraphicsType[GraphicsType["box"] = Cesium.BoxGraphics] = "box";
    GraphicsType[GraphicsType["corridor"] = Cesium.CorridorGraphics] = "corridor";
    GraphicsType[GraphicsType["cylinder"] = Cesium.CylinderGraphics] = "cylinder";
    GraphicsType[GraphicsType["label"] = Cesium.LabelGraphics] = "label";
    GraphicsType[GraphicsType["billboard"] = Cesium.BillboardGraphics] = "billboard";
    GraphicsType[GraphicsType["model"] = Cesium.ModelGraphics] = "model";
    GraphicsType[GraphicsType["path"] = Cesium.PathGraphics] = "path";
    GraphicsType[GraphicsType["point"] = Cesium.PointGraphics] = "point";
    GraphicsType[GraphicsType["rectangle"] = Cesium.RectangleGraphics] = "rectangle";
    GraphicsType[GraphicsType["wall"] = Cesium.WallGraphics] = "wall";
})(GraphicsType || (GraphicsType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhpY3MtdHlwZS5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1jZXNpdW0vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2VudGl0aWVzLWRyYXdlci9lbnVtcy9ncmFwaGljcy10eXBlLmVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFOLElBQVksWUFnQlg7QUFoQkQsV0FBWSxZQUFZO0lBQ3RCLHVDQUFVLE1BQU0sQ0FBQyxlQUFlLGFBQUEsQ0FBQTtJQUNoQyx5Q0FBWSxNQUFNLENBQUMsaUJBQWlCLGVBQUEsQ0FBQTtJQUNwQyx1Q0FBVSxNQUFNLENBQUMsZUFBZSxhQUFBLENBQUE7SUFDaEMsd0NBQVcsTUFBTSxDQUFDLGdCQUFnQixjQUFBLENBQUE7SUFDbEMsOENBQWlCLE1BQU0sQ0FBQyxzQkFBc0Isb0JBQUEsQ0FBQTtJQUM5QyxtQ0FBTSxNQUFNLENBQUMsV0FBVyxTQUFBLENBQUE7SUFDeEIsd0NBQVcsTUFBTSxDQUFDLGdCQUFnQixjQUFBLENBQUE7SUFDbEMsd0NBQVcsTUFBTSxDQUFDLGdCQUFnQixjQUFBLENBQUE7SUFDbEMscUNBQVEsTUFBTSxDQUFDLGFBQWEsV0FBQSxDQUFBO0lBQzVCLHlDQUFZLE1BQU0sQ0FBQyxpQkFBaUIsZUFBQSxDQUFBO0lBQ3BDLHFDQUFRLE1BQU0sQ0FBQyxhQUFhLFdBQUEsQ0FBQTtJQUM1QixvQ0FBTyxNQUFNLENBQUMsWUFBWSxVQUFBLENBQUE7SUFDMUIscUNBQVEsTUFBTSxDQUFDLGFBQWEsV0FBQSxDQUFBO0lBQzVCLHlDQUFZLE1BQU0sQ0FBQyxpQkFBaUIsZUFBQSxDQUFBO0lBQ3BDLG9DQUFPLE1BQU0sQ0FBQyxZQUFZLFVBQUEsQ0FBQTtBQUM1QixDQUFDLEVBaEJXLFlBQVksS0FBWixZQUFZLFFBZ0J2QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIEdyYXBoaWNzVHlwZSB7XG4gIGVsbGlwc2UgPSBDZXNpdW0uRWxsaXBzZUdyYXBoaWNzLFxuICBlbGxpcHNvaWQgPSBDZXNpdW0uRWxsaXBzb2lkR3JhcGhpY3MsXG4gIHBvbHlnb24gPSBDZXNpdW0uUG9seWdvbkdyYXBoaWNzLFxuICBwb2x5bGluZSA9IENlc2l1bS5Qb2x5bGluZUdyYXBoaWNzLFxuICBwb2x5bGluZVZvbHVtZSA9IENlc2l1bS5Qb2x5bGluZVZvbHVtZUdyYXBoaWNzLFxuICBib3ggPSBDZXNpdW0uQm94R3JhcGhpY3MsXG4gIGNvcnJpZG9yID0gQ2VzaXVtLkNvcnJpZG9yR3JhcGhpY3MsXG4gIGN5bGluZGVyID0gQ2VzaXVtLkN5bGluZGVyR3JhcGhpY3MsXG4gIGxhYmVsID0gQ2VzaXVtLkxhYmVsR3JhcGhpY3MsXG4gIGJpbGxib2FyZCA9IENlc2l1bS5CaWxsYm9hcmRHcmFwaGljcyxcbiAgbW9kZWwgPSBDZXNpdW0uTW9kZWxHcmFwaGljcyxcbiAgcGF0aCA9IENlc2l1bS5QYXRoR3JhcGhpY3MsXG4gIHBvaW50ID0gQ2VzaXVtLlBvaW50R3JhcGhpY3MsXG4gIHJlY3RhbmdsZSA9IENlc2l1bS5SZWN0YW5nbGVHcmFwaGljcyxcbiAgd2FsbCA9IENlc2l1bS5XYWxsR3JhcGhpY3MsXG59XG4iXX0=