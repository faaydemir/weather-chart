import Label from "./../components/label";
import Line from "./../components/line";
import Bar from "./../components/bar";
import Circle from "./../components/circle";
import yAxis from "./../components/yAxis";
import xAxis from "./../components/xAxis";
import Area from "./../components/area";
import Tooltip from "./../components/tooltip";
import BrushX from "./../components/brush";
import Event from "./../components/event";
import DataLabel from "./../components/data-label";
import * as utils from "./../utils";
import AutoGrid from "./../grid";
import * as d3 from "d3";
import EventBus from "./../event-bus";

export default class ChartBase {
    constructor(container, data, config) {

        this.containers = {};
        this.components = {};

        this.baseConfig = {
            components: ["bar", "circle", "line", "xAxis", "yAxis", "label", "brush", "tooltip", "dataLabel", "event"],
            width: "100%",
            height: "100%",

        };
        // set components 
        this.componentConfig = {

            tooltip: {
                type: Tooltip,
            },

            label: {
                type: Label,
                config: {
                    width: "100%",
                    height: 20,
                    row: 0,
                    column: 1,
                }
            },
            line: {
                type: Line,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            area: {
                type: Area,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            dataLabel: {
                type: DataLabel,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            brush: {
                type: BrushX,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            bar: {
                type: Bar,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            circle: {
                type: Circle,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            xAxis: {
                type: xAxis,
                config: {
                    width: "100%",
                    height: 20,
                    row: 2,
                    column: 1,
                }
            },
            yAxis: {
                type: yAxis,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
            event: {
                type: Event,
                config: {
                    width: "100%",
                    height: "100%",
                    row: 1,
                    column: 1,
                }
            },
        };

        if (data) {
            this.data = utils.clone(data);
        }

        if (config) {
            this.configParam = config;
        }

        this.containerParam = container;

        this.margin = {
            x: 40,
            y: 40
        };
    }

    Init() {
        this.initilized = true;
        this._init();
    }

    Draw() {
        if (this.initilized !== true)
            this.Init();

        this._drawComponents();
    }

    _init() {
        // merge config with default 
        this.config = utils.mergeTo(this.baseConfig, utils.mergeTo(this._defaultConfig, this.configParam));
        this.eventBus = new EventBus();

        this._initContainer(this.containerParam);
        // init grid layout that contain components g 
        this._initLayout();
        // set component s config
        this._initComponents();

    }

    _initLayout() {
        let colorMap = d3.scaleOrdinal(d3.schemeCategory10);
        this.grid = new AutoGrid(this.container);
        let calculatedLayout = {};
        this.config.components.forEach(
            component => {
                if ((this.componentConfig[component]) && (this.componentConfig[component].config)) {
                    let cLayout = this.componentConfig[component].config;
                    this.grid.AddItem(cLayout.column, cLayout.row, cLayout.width, cLayout.height);
                }
            });

        this.grid.Update();

        this.config.components.forEach(
            component => {
                if ((this.componentConfig[component]) && (this.componentConfig[component].config)) {
                    let cLayout = this.componentConfig[component].config;

                    let ly = this.grid.GetLayout(cLayout.column, cLayout.row, cLayout.width, cLayout.height);
                    this.containers[component] = this.container.append("g").attr("width", ly.width).attr("height", ly.height).attr("transform", ly.translate);

                    // for debug 
                    // delete later
                    this.containers[component].append("rect")
                        .attr("width", ly.width)
                        .attr("height", ly.height)
                        .attr("opacity", 0)
                        .style("fill", colorMap(component));
                }
            });
    }

    _initComponents() {
        this.config.components.forEach(
            component => {

                if ((this.componentConfig[component])) {

                    let container = this.containers[component];

                    let config = utils.mergeTo(this.componentConfig[component].config, utils.mergeTo(this.config, this.config[component]));

                    let data = [];
                    if (config[component] && config[component].data) // if component data set
                    {
                        data = config[component].data;
                    } else {
                        data = this.data;
                    }


                    this.components[component] = new this.componentConfig[component].type(container, data, config);

                    this.components[component].eventBus(this.eventBus);
                }
            });
    }

    _drawComponents() {
        this.config.components.forEach(
            component => {
                this.components[component].Draw();
            });
    }

    AppendData(data) {

        this.config.components.forEach(
            component => {
                if (this.components[component].AppendData)
                    this.components[component].AppendData(data);
            });
    }
    _setData(data) {
        this.config.components.forEach(
            component => {
                if (this.components[component]._setData)
                    this.components[component]._setData(data);
            });
    }
    Update() {
        this.config.components.forEach(
            component => {
                if (this.components[component].Update)
                    this.components[component].Update();
            });
    }
    UpdateData(data) {

        this.config.components.forEach(
            component => {
                if (this.components[component].UpdateData)
                    this.components[component].UpdateData(data);
            });
    }
    _initContainer(container) {
        if (typeof container === "string") { // if #divId , or  .divclass 

            // create new svg and append it to selected dom component
            const containerSvg = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");

            const width = containerSvg.node().getBoundingClientRect().width - this.margin.x * 2;
            const height = containerSvg.node().getBoundingClientRect().height - this.margin.y * 2;
            this.container = containerSvg
                .append("g")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", `translate(${ this.margin.x },${ this.margin.y })`);
            this.container.append("rect").attr("width", width)
                .attr("height", height).attr("opacity", 0);
            //this.container = containerSvg

        } else { // else  assume container is appended g or svg
            this.container = container;
        }
    }
}