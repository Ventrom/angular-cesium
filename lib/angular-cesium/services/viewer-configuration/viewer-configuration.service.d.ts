/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
export declare class ViewerConfiguration {
    /**
     * cesium viewer options According to [Viewer]{@link https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=vie}
     */
    private _viewerOptions;
    private _viewerModifier;
    private nextViewerOptionsIndex;
    private nextViewerModifierIndex;
    /**
    * Can be used to set initial map viewer options.
    * If there is more than one map you can give the function an array of options.
    * The map initialized first will be set with the first option object in the options array and so on.
    */
    viewerOptions: object | object[];
    Ï: any;
    getNextViewerOptions(): object | object[];
    /**
    * Can be used to set map viewer options after the map has been initialized.
    * If there is more than one map you can give the function an array of functions.
    * The map initialized first will be set with the first option object in the options array and so on.
    */
    viewerModifier: Function | Function[];
    getNextViewerModifier(): Function | Function[];
}
