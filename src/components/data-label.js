class DataLabel extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.dataLabels = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeCategory10),
            opacity: 0.5,
            width: "100%",
            height: "100%",
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            class: "event-icon",
            x: d => d.x,
            y: d => d.y,
            mouseOut: null,
            mouseOver: null,
            text: d => d.x,
            fontsize: 10,
        }
    }
    _draw() {
        this._labelContainer = this.container
            .append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height);



        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);
            this.dataLabels[key] = this._labelContainer.append("g")

            this.dataLabels[key].selectAll("text")
                .data(this.data[key])
                .enter()
                .append("text")
                .style("fill", color)
                .style("font-size", this.config.fontsize)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr("class", this.config.class)
                .attr("x", (d, i) => this.scaleX(this.config.x(d, i)))
                .attr("y", (d, i) => this.scaleY(this.config.y(d, i)))
                .text(this.config.text);
        }

    }

    _updateDraw() {

        // for (var key in this.data) {
        //     if (!this.data.hasOwnProperty(key)) continue;

        //     let color = this.config.colorMap(key);

        //     let selection = this.circles[key].selectAll(".circle")
        //         .data(this.data[key]);

        //     // add 
        //     selection.enter().append("circle")
        //         .attr("fill", color)
        //         .attr("class", "circle")
        //         .attr("cx", d => this.scaleX(this.config.x(d)))
        //         .attr("cy", d => this.scaleY(this.config.y(d)))
        //         .attr("r", d => this.scaleZ(this.config.y(d)));

        //     // update
        //     selection
        //         .attr("cx", d => this.scaleX(this.config.x(d)))
        //         .attr("cy", d => this.scaleY(this.config.y(d)))
        //         .attr("r", d => this.scaleZ(this.config.y(d)));

        //     selection.exit().remove();
    }
}