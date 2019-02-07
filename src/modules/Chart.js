class Chart extends ModuleBase {
    constructor(container, data, config) {
        super(container, data, config);

        this._defaultConfig = {
            components: ["bar", "circle", "brush", "line", "xAxis", "yAxis", "label", "tooltip"],
        }
        this._init(container, data, config);
    };
}