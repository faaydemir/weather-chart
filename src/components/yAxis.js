class yAxis extends d3Base {
    constructor(container, data, config) {
        super(container, data, config);
        this._defaultConfig = {
            tickCount: 6,
            width: 50,
            height: "100%",
            maxDataCount: null,
            minY:null,
            maxY:null,
            scaleX: null,
            y: d => d.y,
            yStart: null,
            domainX: null,
            format: d => d,
            textColor: null,
            strokeColor: null,
            tickSizeOuter: 100,
            tickPadding: 2,
            tickSizeInner: 100,
        };


    }
    _draw() {

        this.yAxis = d3.axisRight()
            .scale(this.scaleY)
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format)
            .tickPadding(this.config.tickPadding)
            .tickSizeInner(this.config.width)
            .tickSizeOuter(0)

        this.customAxis = (g) => {
            g.call(this.yAxis);
            g.select(".domain").remove();
            g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
        }

        this.yAxisContainer = this.container
            .append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            //.attr("transform", "translate(" + this.config.width + "," + 0 + ")")
            .attr("class", "y axis axis-text")
            .call(this.customAxis);

        if (this.config.textColor)
            this.yAxisContainer.selectAll("text").attr("fill", this.config.textColor);

        if (this.config.strokeColor) {
            this.yAxisContainer.selectAll("line").attr("stroke", this.config.strokeColor);
            this.yAxisContainer.selectAll("path").attr("stroke", this.config.strokeColor);
        }
    }
    Zoom(min, max) {
        super.ZoomY(min, max)
    }
    _updateDraw() {
        this.yAxis.scale(this.scaleY);
        this.yAxisContainer.call(this.customAxis);
    }
}