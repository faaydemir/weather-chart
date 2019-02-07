import d3Base from './d3-base';
import * as d3 from 'd3';

export default class Bar extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.bars = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeAccent),
            yAxisWidth: 40,
            xAxisHeight: 40,
            strokeWidth: 1,
            opacity: 0.5,
            width: "100%",
            resize: true,
            height: "100%",
            maxDataCount: null,
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            x: d => d.x,
            y: d => d.y,
            yStart: null,
            mouseOut: null,
            mouseOver: null,
            curve: d3.curveStep,
            barWidth: null,
            onFocus: {
                opacity: 1,
                colorMap: d3.scaleOrdinal(d3.schemeAccent),
            }

        };
        this.eventListeners = {
            onMouseOverLabel: (n, s, args) => this.__focus(args.d),
            onMouseOutLabel: (n, s, args) => this.__unfocus(args.d),
        }
    }

    _initYScale() {

        // if barchart start y point is not defined

        if (this.config.yStart === null) {
            super._initYScale();
        } else {

            let domainY = d3.extent(this.__flattenData, (d) => (this.config.y(d)));
            let domainYMin = d3.extent(this.__flattenData, (d) => (this.config.yStart(d)));

            if (domainYMin[0] < domainY[0])
                domainY[0] = domainYMin[0];

            if (domainYMin[1] > domainY[1]) // should be always false
                domainY[1] = domainYMin[1];
            //TO DO fix zero bug 
            this.domainY = [(this.config.minY || domainY[0]), (this.config.maxY || domainY[1])];

            this.scaleY = this.config.scaleY || d3.scaleLinear()
                .range([0, this.height])
                .domain(this.domainY);
        }
    }

    _initBarRelatedFunction() {
        // if start point (yStart) is defined means bar represent range 
        if (this.config.yStart !== null) {
            //BUG there is a bug
            this._barHeight = (d, i) => this.scaleY(this.config.y(d)) - this.scaleY(this.config.yStart(d));
            this._barY = (d, i) => this.height - this.scaleY(this.config.y(d))
        } else {
            this._barHeight = (d, i) => this.height - this.scaleY(this.config.y(d));
            this._barY = (d, i) => this.scaleY(this.config.y(d));
        }

    }


    __focus(key) {
        this.bars[key]
            .attr("opacity", this.config.onFocus.opacity)
            .attr("fill", this.config.onFocus.colorMap(key));
    }

    __unfocus(key) {
        this.bars[key]
            .attr("opacity", this.config.opacity)
            .attr("fill", this.config.colorMap(key));
    }
    _draw() {
        let barIndex = 0;
        let barLayout = this._calculateBarLayout();

        this._initBarRelatedFunction();

        this._barContainer = this.container
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let barOfset = barLayout.offsetFunc(barIndex);

            const color = this.config.colorMap(key);

            this.bars[key] = this._barContainer.append("g")

            this.bars[key].selectAll(".bar")
                .data(this.data[key])
                .enter()
                .append("rect")
                .attr("fill", color)
                .attr("opacity", this.config.opacity)
                .attr("class", "bar")
                .attr("x", d => this.scaleX(this.config.x(d)) + barOfset)
                .attr("width", barLayout.width)
                .attr("y", this._barY)
                .attr("height", this._barHeight);

            barIndex += 1;
        }

    }
    _updateDraw() {
        let barIndex = 0;
        let barLayout = this._calculateBarLayout();

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let barOfset = barLayout.offsetFunc(barIndex);

            let color = this.config.colorMap(key);

            let selection = this.bars[key].selectAll(".bar")
                .data(this.data[key]);

            //delete
            selection.exit().remove();

            // update
            selection
                .attr("x", d => this.scaleX(this.config.x(d)) + barOfset)
                .attr("width", barLayout.width)
                .attr("y", this._barY)
                .attr("height", this._barHeight);

            // add 
            selection
                .enter()
                .append("rect")
                .attr("fill", color)
                .attr("opacity", this.config.opacity)
                .attr("class", "bar")
                .attr("x", d => this.scaleX.range()[0] + barOfset)
                .attr("width", barLayout.width)
                .attr("y", this._barY)
                .attr("height", this._barHeight)
                .attr("x", d => this.scaleX(this.config.x(d)) + barOfset);


            barIndex += 1;
        }
    }
    _calculateBarLayout() {
        let maxDataCount = 0;
        let dataSetCount = Object.keys(this.data).length;
        let barMargin = 3; // margin between bars
        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;
            if (this.data[key].length > maxDataCount)
                maxDataCount = this.data[key].length;
        }
        let barWidth = this.width / (maxDataCount * (dataSetCount + 2)); // +2 for margin between data sets
        // if barWidth defined
        if (this.config.barWidth)
            if (this.config.barWidth < barWidth)
                barWidth = this.config.barWidth;

        return {
            width: barWidth,
            offsetFunc: (index) => {
                return (-0.5 * (dataSetCount * (barWidth + barMargin))) + barMargin + (barWidth + barMargin) * index;
            }
        };
    }
}