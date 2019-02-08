import d3Base from "./d3-base";
import * as d3 from "d3";

export default class DataLabel extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.dataLabels = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeAccent),
            opacity: 1,
            width: "100%",
            height: "100%",
            resize: true,
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            class: "event-icon",
            x: d => d.x,
            y: d => d.y,
            mouseOut: null,
            mouseOver: null,
            text: d => "value" + Math.floor(d.y),
            fontsize: 12,
        };
    }

    _draw() {
        this._labelContainer = this.container
            .append("g")
            .attr("width", this.width)
            .attr("height", this.height);

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);
            this.dataLabels[key] = this._labelContainer.append("g");

            this.dataLabels[key].selectAll("text")
                .data(this.data[key])
                .enter()
                .append("text")
                .style("fill", color)
                .style("font-size", this.config.fontsize)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("class", this.config.class)
                .attr("x", (d, i) => this.scaleX(this.config.x(d, i)))
                .attr("y", (d, i) => this.scaleY(this.config.y(d, i)) - this.config.fontsize)
                .text(this.config.text);
        }
    }

    _updateDraw() {

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);

            let selection = this.dataLabels[key].selectAll("text")
                .data(this.data[key]);

            // add 
            selection.enter().append("text")
                .style("fill", color)
                .style("font-size", this.config.fontsize)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("class", this.config.class)
                .attr("x", (d, i) => this.scaleX(this.config.x(d, i)))
                .attr("y", (d, i) => this.scaleY(this.config.y(d, i)) - this.config.fontsize)
                .text(this.config.text);

            // update
            selection
                .attr("x", (d, i) => this.scaleX(this.config.x(d, i)))
                .attr("y", (d, i) => this.scaleY(this.config.y(d, i)) - this.config.fontsize);

            //remove
            selection.exit().remove();
        }

    }
}