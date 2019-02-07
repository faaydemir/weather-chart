import d3Base from './d3-base';
import * as d3 from 'd3';

export default class yAxis extends d3Base {
    constructor(container, data, config) {
        super(container, data, config);

        this._defaultConfig = {
            tickCount: 6,
            width: 50,
            height: "100%",
            maxDataCount: null,
            minY: null,
            resize: true,
            maxY: null,
            scaleX: null,
            y: d => d.y,
            opacity: 0.5,
            yStart: null,
            domainX: null,
            format: d => d,
            textColor: null,
            strokeColor: "#A06F5E",
            tickSizeOuter: 0,
            tickPadding: 5,
            tickSizeInner: 100,
        };
    }

    _draw() {

        this.yAxis = d3.axisLeft()
            .scale(this.scaleY)
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format)
            .tickPadding(this.config.tickPadding)
            .tickSizeInner(-this.width)
            .tickSizeOuter(this.tickSizeOuter);

        this.yAxisContainer = this.container
            .append("g")
            .attr("width", this.width)
            .attr("height", this.height)
            //.attr("transform", "translate(" + this.width + "," + 0 + ")")
            .attr("class", "y axis axis-text")
            .call(this.yAxis);

        this.yAxisContainer.selectAll("text").attr("fill", this.config.textColor);

        this.yAxisContainer.selectAll("line")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);
        this.yAxisContainer.selectAll("path")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);

    }
    Zoom(min, max) {
        super.ZoomY(min, max)
    }
    _updateDraw() {
        this.yAxis.scale(this.scaleY);
        this.yAxisContainer.call(this.yAxis);
        this.yAxisContainer.selectAll("line")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);
        this.yAxisContainer.selectAll("path")
            .attr("stroke", this.config.strokeColor)
            .attr("opacity", this.config.opacity);
    }
}