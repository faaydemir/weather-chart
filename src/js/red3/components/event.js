import d3Base from "./d3-base";
import * as d3 from "d3";

export default class Event extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.events = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeAccent),
            opacity: 0.5,
            width: "100%",
            height: "100%",
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            iconWidth: 30,
            iconHeight: 30,
            class: "event-icon",
            x: d => d.x,
            y: d => d.y,
            mouseOut: null,
            mouseOver: null,
            iconFunction: d => d.icon
        };
    }
    _draw() {
        this._evenContainer = this.container
            .append("g")
            .attr("width", this.width)
            .attr("height", this.height);



        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);
            this.events[key] = this._evenContainer.append("g");

            this.events[key].selectAll("image")
                .data(this.data[key])
                .enter()
                .append("image")
                .attr("width", this.config.iconWidth)
                .attr("height", this.config.iconHeight)
                .attr("fill", color)
                .attr("class", this.config.class)
                .attr("xlink:href", this.config.iconFunction)
                .attr("x", d => this.scaleX(this.config.x(d)) - this.config.iconWidth / 2)
                .attr("y", d => this.scaleY(this.config.y(d)) + this.config.iconWidth / 2);
        }

    }

    _updateDraw() {

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);

            let selection = this.events[key].selectAll("image")
                .data(this.data[key]);


            //remove
            selection.exit().remove();

            // update
            selection
                .attr("xlink:href", this.config.iconFunction)
                .attr("x", d => this.scaleX(this.config.x(d)) - this.config.iconWidth / 2)
                .attr("y", d => this.scaleY(this.config.y(d)) + this.config.iconWidth / 2);

            // add 
            selection.enter().append("image")
                .attr("width", this.config.iconWidth)
                .attr("height", this.config.iconHeight)
                .attr("fill", color)
                .attr("class", this.config.class)
                .attr("xlink:href", this.config.iconFunction)
                .attr("x", d => this.scaleX(this.config.x(d)) - this.config.iconWidth / 2)
                .attr("y", d => this.scaleY(this.config.y(d)) + this.config.iconWidth / 2);
        }
    }
}