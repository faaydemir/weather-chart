class WeatherChart extends ModuleBase {
    constructor(container, data, config) {
        super(container, data, config);

        this._defaultConfig = {
            components: ["dataLabel", "line", "area", "event"],
        }
        this.componentConfig = {
            dataLabel: {
                type: DataLabel,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 0,
                    column: 0,
                }
            },
            brush: {
                type: BrushX,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 0,
                    column: 0,
                }
            },
            line: {
                type: Line,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 0,
                    column: 0,
                }
            },
            area: {
                type: Area,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 0,
                    column: 0,
                }
            },
            event: {
                type: Event,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 0,
                    column: 0,
                }
            },
        }
    };
}