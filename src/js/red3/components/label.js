import d3Base from './d3-base';
import * as d3 from 'd3';
import { EventTypes, EventBus } from './../event-bus';

export default class Label extends d3Base {
    constructor(container, data, config) {
        super(container, data, config);
        this._defaultConfig = {
            fontsize: 12,
            colorMap: d3.scaleOrdinal(d3.schemeAccent),
            flow: "Y",
            opacity: 1,
            width: '100%',
            height: '100%',
            format: d => d,
            labelWidth: 15,
            labelHeight: 15,
            textWidth: 50,
            align: "left"
        }

        this.AppendData = null;
        this.UpdateData = null;
        this.data = Object.keys(data);
    }
    __calculateTotalWidth() {
        return this.data.length * (this.config.labelHeight + 2 + this.config.textWidth);
    }
    _initScales() {
        let totalWidth = this.__calculateTotalWidth();
        this.scale = this.config.scale || d3.scaleLinear()
            .range([this.width - totalWidth, this.width])
            .domain([0, this.data.length]);
    }
    _draw() {
        this.labelContainer = this.container.append("g")
            .attr("width", this.width)
            .attr("height", this.height);

        var chartLabels = this.labelContainer.selectAll(".label")
            .data(this.data)
            .enter().append("g")
            .attr("class", "label")
            .on("mouseover",
                this.OnMouseOver(this)
            )
            .on("mouseout",
                this.OnMouseOut(this)
            )
            .on("click",
                this.OnMouseClick(this)
            );

        var rects = chartLabels.append("rect")
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("x", (d, i) => this.scale(i))
            .attr("y", 0)
            .attr("fill", d => this.config.colorMap(d))
            .attr("opacity", this.opacity)
            .attr("width", this.config.labelWidth)
            .attr("height", this.config.labelHeight);

        var texts = chartLabels.append("text")
            .attr("x", (d, i) => this.scale(i) + this.config.labelWidth + 2)
            .attr("y", this.config.labelHeight * 0.5)
            .style("fill", d => this.config.colorMap(d))
            .style("font-size", this.config.labelHeight * 0.6)
            .style('dominant-baseline', 'central')
            .text((d, i) => this.config.format(d));
    }
    _updateDraw() {

    }
    OnMouseClick(self) {
        return function(d, i) {

            let args = {}
            args.d = d;
            self._raiseEvent(EventTypes.onMouseClickLabel, self, args);
        }
    }
    OnMouseOver(self) {
        return function(d, i) {
            let args = {}
            args.d = d;
            self._raiseEvent(EventTypes.onMouseOverLabel, self, args);
        }
    }
    OnMouseOut(self) {
        return function(d, i) {
            let args = {}
            args.d = d;
            self._raiseEvent(EventTypes.onMouseOutLabel, self, args);
        }
    }
}