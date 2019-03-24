export declare class ViewerFactory {
    cesium: any;
    constructor();
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    createViewer(mapContainer: HTMLElement, options?: any): any;
}
