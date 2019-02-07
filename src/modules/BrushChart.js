class BrushChart extends ModuleBase {
    constructor(container, data, config) {
        super(container, data, config);

        this._defaultConfig = {
            components: ["bar", "dataLabel", "yAxis", "brush"],
        }
    };
}