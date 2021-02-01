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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhpY3MtdHlwZS5lbnVtLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1jZXNpdW0vIiwic291cmNlcyI6WyJsaWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9lbnRpdGllcy1kcmF3ZXIvZW51bXMvZ3JhcGhpY3MtdHlwZS5lbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBTixJQUFZLFlBZ0JYO0FBaEJELFdBQVksWUFBWTtJQUN0Qix1Q0FBVSxNQUFNLENBQUMsZUFBZSxhQUFBLENBQUE7SUFDaEMseUNBQVksTUFBTSxDQUFDLGlCQUFpQixlQUFBLENBQUE7SUFDcEMsdUNBQVUsTUFBTSxDQUFDLGVBQWUsYUFBQSxDQUFBO0lBQ2hDLHdDQUFXLE1BQU0sQ0FBQyxnQkFBZ0IsY0FBQSxDQUFBO0lBQ2xDLDhDQUFpQixNQUFNLENBQUMsc0JBQXNCLG9CQUFBLENBQUE7SUFDOUMsbUNBQU0sTUFBTSxDQUFDLFdBQVcsU0FBQSxDQUFBO0lBQ3hCLHdDQUFXLE1BQU0sQ0FBQyxnQkFBZ0IsY0FBQSxDQUFBO0lBQ2xDLHdDQUFXLE1BQU0sQ0FBQyxnQkFBZ0IsY0FBQSxDQUFBO0lBQ2xDLHFDQUFRLE1BQU0sQ0FBQyxhQUFhLFdBQUEsQ0FBQTtJQUM1Qix5Q0FBWSxNQUFNLENBQUMsaUJBQWlCLGVBQUEsQ0FBQTtJQUNwQyxxQ0FBUSxNQUFNLENBQUMsYUFBYSxXQUFBLENBQUE7SUFDNUIsb0NBQU8sTUFBTSxDQUFDLFlBQVksVUFBQSxDQUFBO0lBQzFCLHFDQUFRLE1BQU0sQ0FBQyxhQUFhLFdBQUEsQ0FBQTtJQUM1Qix5Q0FBWSxNQUFNLENBQUMsaUJBQWlCLGVBQUEsQ0FBQTtJQUNwQyxvQ0FBTyxNQUFNLENBQUMsWUFBWSxVQUFBLENBQUE7QUFDNUIsQ0FBQyxFQWhCVyxZQUFZLEtBQVosWUFBWSxRQWdCdkIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBHcmFwaGljc1R5cGUge1xuICBlbGxpcHNlID0gQ2VzaXVtLkVsbGlwc2VHcmFwaGljcyxcbiAgZWxsaXBzb2lkID0gQ2VzaXVtLkVsbGlwc29pZEdyYXBoaWNzLFxuICBwb2x5Z29uID0gQ2VzaXVtLlBvbHlnb25HcmFwaGljcyxcbiAgcG9seWxpbmUgPSBDZXNpdW0uUG9seWxpbmVHcmFwaGljcyxcbiAgcG9seWxpbmVWb2x1bWUgPSBDZXNpdW0uUG9seWxpbmVWb2x1bWVHcmFwaGljcyxcbiAgYm94ID0gQ2VzaXVtLkJveEdyYXBoaWNzLFxuICBjb3JyaWRvciA9IENlc2l1bS5Db3JyaWRvckdyYXBoaWNzLFxuICBjeWxpbmRlciA9IENlc2l1bS5DeWxpbmRlckdyYXBoaWNzLFxuICBsYWJlbCA9IENlc2l1bS5MYWJlbEdyYXBoaWNzLFxuICBiaWxsYm9hcmQgPSBDZXNpdW0uQmlsbGJvYXJkR3JhcGhpY3MsXG4gIG1vZGVsID0gQ2VzaXVtLk1vZGVsR3JhcGhpY3MsXG4gIHBhdGggPSBDZXNpdW0uUGF0aEdyYXBoaWNzLFxuICBwb2ludCA9IENlc2l1bS5Qb2ludEdyYXBoaWNzLFxuICByZWN0YW5nbGUgPSBDZXNpdW0uUmVjdGFuZ2xlR3JhcGhpY3MsXG4gIHdhbGwgPSBDZXNpdW0uV2FsbEdyYXBoaWNzLFxufVxuIl19