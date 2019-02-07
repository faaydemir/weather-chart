class Label extends d3Base {
    constructor(container, data, config) {
        super();
        this._defaultConfig = {
            fontsize: 12,
            colorMap: d3.scaleOrdinal(d3.schemeCategory10),
            flow: "X",
            width: "100%",
            opacity: 0.7,
            height: "100%",
            format: d => d,
            labelWidth: 15,
            labelHeight: 15,
            textWidth: 50,
            align: "left"
        }
        this.AppendData = null;
        this.UpdateData = null;
        this._init(container, data, config);
        this.data = Object.keys(data);
        this._initScales();
        this._draw();
    }

    __calculateTotalWidth() {
        return this.data.length * (this.config.labelHeight + 2 + this.config.textWidth);
    }
    _initScales() {
        let totalWidth = this.__calculateTotalWidth();
        this.scale = this.config.scale || d3.scaleLinear()
            .range([this.config.width - totalWidth, this.config.width])
            .domain([0, this.data.length]);
    }
    _draw() {
        this.labelContainer = this.container.append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height);

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
            .attr("y", this.config.labelHeight * 0.8)
            .style("fill", d => this.config.colorMap(d))
            .style("font-size", this.config.labelHeight * 0.6)
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