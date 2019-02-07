import ChartBase from './chart-base';

export default class Chart extends ChartBase {
    constructor(container, data, config) {
        super(container, data, config);

        this._defaultConfig = {
            components: ["tooltip", "label", "line", "area", "bar", "circle", "dataLabel", "xAxis", "yAxis", "brush", "event"],
        }

    };
}