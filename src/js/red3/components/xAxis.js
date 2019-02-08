import d3Base from "./d3-base";
import * as d3 from "d3";

export default class xAxis extends d3Base {
    constructor(container, data, config) {
        super(container, data, config);
        this._defaultConfig = {
            tickCount: 10,
            width: "100%",
            height: "100%",
            maxDataCount: null,
            scaleX: null,
            resize: true,
            x: d => d.x,
            domainX: null,
            opacity: 0.5,
            format: d => d,
            textColor: null,
            strokeColor: "#A06F5E",
            tickSizeOuter: 0,
            tickPadding: 5,
            tickSizeInner: 0,
            tickSize: 5,
        };
    }
    _draw() {

        this.xAxis = d3.axisBottom()
            .scale(this.scaleX)
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format)
            .tickSizeOuter(this.config.tickSize)
            .tickSizeInner(this.config.tickSize)
            .tickPadding(this.config.tickPadding);

        this.xAxisContainer = this.container
            .append("g")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("class", "x axis axis-text")
            .call(this.xAxis);

        this.xAxisContainer.selectAll("text").attr("fill", this.config.textColor);

        this.xAxisContainer.selectAll("line")
            .attr("opacity", this.config.opacity)
            .attr("stroke", this.config.strokeColor);
        this.xAxisContainer.selectAll("path")
            .attr("opacity", this.config.opacity)
            .attr("stroke", this.config.strokeColor);

    }
    Zoom(min, max) {
        super.ZoomX(min, max);
    }
    _updateDraw() {
        this.xAxis.scale(this.scaleX);
        this.xAxisContainer.call(this.xAxis);


        this.xAxisContainer.selectAll("text")
            .attr("fill", this.config.textColor);
        this.xAxisContainer.selectAll("line")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);
        this.xAxisContainer.selectAll("path")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);
    }
}