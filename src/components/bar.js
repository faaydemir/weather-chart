class Bar extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.bars = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeCategory10),
            yAxisWidth: 40,
            xAxisHeight: 40,
            strokeWidth: 1,
            opacity: 0.3,
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
                colorMap: d3.scaleOrdinal(d3.schemeCategory10),
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
                domainY[1] = domainYMin[1]
                //TO DO fix zero bug 
            this.domainY = [(this.config.minY || domainY[0]), (this.config.maxY || domainY[1])];

            this.scaleY = this.config.scaleY || d3.scaleLinear()
                .range([0, this.config.height])
                .domain(this.domainY);
        }
    }

    _initBarRelatedFunction() {
        if (this.config.yStart !== null) {
            this._barHeight = (d, i) => this.scaleY(this.config.y(d)) - this.scaleY(this.config.yStart(d));
            this._barY = (d, i) => this.height - this.scaleY(this.config.y(d))
        } else {
            this._barHeight = (d, i) => this.config.height - this.scaleY(this.config.y(d));
            this._barY = (d, i) => this.height - this.scaleY(this.config.y(d));
        }

    }
    _draw() {
        let barIndex = 0;
        let barWidth = this._calculateBarWidth();

        this._initBarRelatedFunction();

        this._barContainer = this.container
            .append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height);

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            const barOffset = barWidth * barIndex;

            const color = this.config.colorMap(key);

            this.bars[key] = this._barContainer.append("g")

            this.bars[key].selectAll(".bar")
                .data(this.data[key])
                .enter()
                .append("rect")
                .attr("fill", color)
                .attr("class", "bar")
                .attr("x", d => this.scaleX(this.config.x(d)) + barOffset - barWidth / 2)
                .attr("width", barWidth)
                .attr("y", this._barY)
                .attr("height", this._barHeight);

            barIndex++;
        }

    }

    __focus(key) {
        this.bars[key]
            .attr("opacity", this.config.onFocus.opacity)
            .attr("fill", this.config.onFocus.colorMap(key))
            .moveToFront();
    }

    __unfocus(key) {
        this.bars[key]
            .attr("opacity", this.config.opacity)
            .attr("fill", this.config.colorMap(key))
            .moveToFront();
    }

    _updateDraw() {
        let barIndex = 0;
        let barWidth = this._calculateBarWidth();

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let barOfset = barWidth * barIndex;

            let color = this.config.colorMap(key);

            let selection = this.bars[key].selectAll(".bar")
                .data(this.data[key]);

            // add 
            selection.enter().append("rect")
                .attr("fill", color)
                .attr("class", "bar")
                .attr("x", d => this.scaleX(this.config.x(d)) + barOfset)
                .attr("width", barWidth)
                .attr("y", this._barY)
                .attr("height", this._barHeight);

            // update
            selection.attr("x", d => this.scaleX(this.config.x(d)) + barOfset)
                .attr("width", barWidth)
                .attr("y", this._barY)
                .attr("height", this._barHeight);

            selection.exit().remove();

            barIndex++;
        }
    }
    _calculateBarWidth() {
        let maxLength = 0;
        let barCount = Object.keys(this.data).length

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;
            if (this.data[key].length > maxLength)
                maxLength = this.data[key].length;
        }
        let barWidth = this.config.width / (maxLength * (barCount + 1)); //+1 for margin
        // if barWidth defined
        if (this.config.barWidth)
            if (this.config.barWidth < barWidth)
                barWidth = this.config.barWidth
        return barWidth;
    }
}