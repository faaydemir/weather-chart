class Event extends d3Base {
    constructor(container, data, config) {

        super(container, data, config);

        this.events = {};

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
            iconFunction: d => d.icon
        }
    }
    _draw() {
        this._evenContainer = this.container
            .append("g")
            .attr("width", this.config.width)
            .attr("height", this.config.height);



        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);
            this.events[key] = this._evenContainer.append("g")

            this.events[key].selectAll("image")
                .data(this.data[key])
                .enter()
                .append("image")
                .attr("fill", color)
                .attr("class", this.config.class)
                .attr("xlink:href", this.config.iconFunction)
                .attr("x", d => this.scaleX(this.config.x(d)))
                .attr("y", d => this.scaleY(this.config.y(d)));
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