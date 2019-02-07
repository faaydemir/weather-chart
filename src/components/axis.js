const AxisTypes = Object.freeze({
    left: "axisLeft",
    right: "axisRight",
    top: "axisTop",
    bottom: "axisBottom"
});

class Axis extends d3Base {
    constructor(container, data, config) {
        super(container, data, config);
        this._defaultConfig = {
            tickCount: 10,
            width: "100%",
            height: "100%",
            maxDataCount: null,
            x: d => d.x,
            y: d => d.y,
            format: d => d,
            textColor: null,
            strokeColor: null,
            tickSizeOuter: 1000,
            tickPadding: 5,
            tickSizeInner: 10,
            tickSize: 5,
            axisType: AxisTypes.left,

        };
    }
    _draw() {
        if (this.config.taxisType === AxisTypes.left || this.config.taxisType === AxisTypes.right)
            this.scale = this.scaleY;
        else
            this.scale = this.scaleX;

        this.axis = d3[this.config.axisType]()
            .scale(this.scale)
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format)
            .tickSizeOuter(this.config.tickSizeOuter)
            .tickPadding(this.config.tickPadding)
            .tickSizeInner(this.config.tickSizeInner)
            .tickSize(this.config.tickSize)

        this.xAxisContainer = this.container
            .append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .attr("class", "x axis axis-text")
            .call(this.axis);
        if (this.config.textColor)
            this.xAxisContainer.selectAll("text").attr("fill", this.config.textColor);

        if (this.config.strokeColor) {
            this.xAxisContainer.selectAll("line").attr("stroke", this.config.strokeColor);
            this.xAxisContainer.selectAll("path").attr("stroke", this.config.strokeColor);
        }
    }
    Zoom(min, max) {
        if (this.config.taxisType === AxisTypes.left || this.config.taxisType === AxisTypes.right)
            super.ZoomY(min, max);
        else
            super.ZoomX(min, max);

    }
    _updateDraw() {
        if (this.config.taxisType === AxisTypes.left || this.config.taxisType === AxisTypes.right)
            this.scale = this.scaleY;
        else
            this.scale = this.scaleX;

        this.axis.scale(this.scale);
        this.xAxisContainer.call(this.axis);
    }
}