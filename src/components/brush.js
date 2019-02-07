/**
 * @param  {} container dom or svg that will contain visualization module 
 * @param  {} data data to visualize
 * @param  {} config component configuration
 */
class BrushX extends d3Base {
    constructor(container, data, config) {
        // call base constructor
        super(container, data, config)


        this._defaultConfig = {
            start: null,
            end: null,
            handle: null,
            min: null,
            max: null,
            steps: null,
            width: "100%",
            height: "100%",
            minRange: 0,
            brushHeight: 140,
            // handle: {
            //     type: TriangleBrushHandle,
            //     config: {
            //         orientation: 'X'
            //     }
            // }
        }

        // brush move handlers
        this.OnBrushMove;
        // brush end handlers
        this.OnBrushMoveEnd;
    }
    _brushMoveHandler(self) {
        return function() {
            if (d3.event == null)
                return;
            let s = d3.event.selection;
            if (s == null) {
                self.handle.handle.attr("display", "none");
            } else {
                var sx = s.map(self.scaleX.invert);
                self.handle.update(s);
                self.gBrush.selectAll(".selection")
                    .attr("y", self.height - self.config.brushHeight)
                    .attr("opacity", 0.1)
                    .attr("height", self.config.brushHeight);
            }
        }
    }
    _draw() {

        this.brush = d3.brushX()
            .extent([
                [0, 0],
                [this.width, this.height]
            ])
            .on("start brush end", this._brushMoveHandler(this));

        this.gBrush = this.container.append("g")
            .attr("class", "brush")
            .call(this.brush);

        let handleSelection = this.gBrush.selectAll(".handle--custom")
            .data([{
                type: "w"
            }, {
                type: "e"
            }])
            .enter();
        this.handle = new MoonPhaseHandler(handleSelection, this.width, this.height);
        this.gBrush.call(this.brush.move, [1, 5].map(this.scaleX));
        this.gBrush.selectAll(".selection").attr("fill", "white");
        this.gBrush.selectAll(".selection").attr("y", this.height - this.config.brushHeight);
        this.gBrush.selectAll(".selection").attr("height", this.config.brushHeight);
    }
    _update() {

    }
}

class MoonPhaseHandler {
    constructor(selection, width, height) {
        const handle = selection.append("g");
        this.moonScale = d3.scaleLinear()
            .range([-12, 12])
            .domain([0, 1]);

        handle.append("rect")
            .attr("fill", "white")
            .attr("x", -3)
            .attr("y", 40)
            .attr("width", 6)
            .attr("height", height - 40);

        this.circles = handle.selectAll("circle").data([{
                m: 'l',
                v: 0.5
            }, {
                m: 'd',
                v: 0.5
            }]).enter().append("circle")
            .attr("fill", d => (d.m == 'd') ? "white" : "#3C5B9E")
            .attr("cx", d => this.moonScale(d.v))
            .attr("cy", 15)
            .attr("r", 12);

        this.handle = handle;
    }
    update(s) {

        let v1 = s[0] / 1000;
        let v2 = s[1] / 1000;

        this.handle.filter(function(d, i) {
                return i == 0;
            }).selectAll("circle").data([{
                    m: 'l',
                    v: 0.5
                },
                {
                    m: 'd',
                    v: v1
                }
            ])
            .attr("fill", d => (d.m === 'd') ? " #3C5B9E" : "white")
            .attr("cx", d => this.moonScale(d.v));


        this.handle.filter(function(d, i) {
                return i == 1;
            }).selectAll("circle").data([{
                m: 'l',
                v: 0.5

            }, {
                m: 'd',
                v: v2
            }])
            .attr("fill", d => (d.m === 'd') ? "#3C5B9E" : "white")
            .attr("cx", d => this.moonScale(d.v));

        this.handle.attr("display", null).attr("transform", function(d, i) {
            return "translate(" + s[i] + "," + 0 + ")";
        });
    }
}
/*
class ValueBrushHandle {

    constructor(g, config) {

        let defaultConfig = {
            width: 40,
            height: 40,
            format: x => "" + x,
        }
        this.config = MergeTo(defaultConfig, config);


        g.selectAll(".resize").append("rect").attr("x", 0)
            .attr("y", 0)
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .attr("class", "border-rectangle");

        this.handleText = g.selectAll(".resize")
            .append("text")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .attr("class", "brush-value")
            .attr("text-anchor", "middle")
            .attr("transform", (d, i) => { return "translate(" + (this.config.width / 2) + "," + (this.config.height / 2 + 5) + ")"; })

        .text((d, i) => { return this.config.format(d + "-" + i) });
    }
    updateValue(min, max) {
        this.handleText.text((d, i) => { return (i) ? this.config.format(min) : this.config.format(max) });
    }

}
class TriangleBrushHandle {
    constructor(g, config) {

        if (config.orientation == 'X' || config.orientation == 'x') {
            let size = parseInt(g.attr("height"));
            let triangleWidth = Math.sqrt(size);
            g.selectAll(".resize").append("line")
                .attr("y2", size);

            g.selectAll(".resize").append("path")
                .attr("d", d3.svg.symbol().type("triangle-up").size(size))
                .attr("transform", function(d, i) { return i ? "translate(" + -triangleWidth + "," + size / 2 + ") rotate(-90)" : "translate(" + triangleWidth + "," + size / 2 + ") rotate(90)"; });

        } else if (config.orientation == 'Y' || config.orientation == 'y') {
            let size = parseInt(g.attr("width"));
            let triangleWidth = Math.floor(Math.sqrt(size));
            g.selectAll(".resize").append("line")
                .attr("x2", size);

            g.selectAll(".resize").append("path")
                .attr("d", d3.svg.symbol().type("triangle-up").size(size))
                .attr("transform", function(d, i) { return i ? "translate(" + size / 2 + "," + triangleWidth + ") rotate(-180)" : "translate(" + size / 2 + "," + -triangleWidth + ") rotate(0)"; });

        }
    }
    updateValue() {}
}
class Brush {

    constructor(g, config) {

        this.brushMove;
        this.brushEnd;

        let defaultConfig = {
            orientation: 'X',
            start: null,
            end: null,
            handle: null,
            min: null,
            max: null,
            steps: null,
            width: 100,
            height: 100,
            minRange: 0,
            handle: {
                type: TriangleBrushHandle,
                config: {
                    orientation: 'X'
                }
            }
        }

        this.config = MergeTo(defaultConfig, config);
        this.config.start = this.config.start || this.config.min;
        this.config.end = this.config.end || this.config.max;
        this.brush;
        this.scale;
        this._buildBrush();

        //Set up the brush
        this.gBrush = g.append("g")
            .attr("class", "brush")
            .attr("width", this.config.width)
            .attr("height", this.config.height)
            .call(this.brush);

        this.gBrush.selectAll(".extent")
            .attr("height", this.config.height)
            .attr("width", this.config.width);
        this.brush.extent([this.config.start, this.config.end])

        this.gBrush.call(this.brush.event);

        if (this.config.handle) {
            this.config.handle.config.orientation = this.config.orientation;
            this.Handle = new this.config.handle.type(this.gBrush, this.config.handle.config);
            this.Handle.updateValue(this.config.min, this.config.max);
        }
    }

    _buildBrush() {

        if (this.config.orientation == 'X' || this.config.orientation == 'x') {
            this.scale = d3.scale.linear()
                .range([0, this.config.width])
                .domain([this.config.min, this.config.max]);
            this.brush = d3.svg.brush()
                .x(this.scale)
                .extent([this.config.min, this.config.max])
                .on("brush", this._onBrushMove(this))
                .on("brushend", this._onBrushEnd(this));

        } else if (this.config.orientation == 'Y' || this.config.orientation == 'y') {
            this.scale = d3.scale.linear()
                .range([this.config.height, 0])
                .domain([this.config.min, this.config.max]);
            this.brush = d3.svg.brush()
                .y(this.scale)
                .extent([this.config.min, this.config.max])
                .on("brush", this._onBrushMove(this))
                .on("brushend", this._onBrushEnd(this));
        }
    }

    _onBrushMove(self) {
        return function() {
            if (self.brushMove) {
                let extent = self.brush.extent();
                let min = extent[0];
                let max = extent[1];
                if (self.config.steps) {
                    let bisect = d3.bisector(function(d) { return d; }).left;
                    min = self.config.steps[bisect(self.config.steps, min)];
                    max = self.config.steps[bisect(self.config.steps, max)];
                }

                if (self.Handle) {
                    self.handle.updateValue(min, max);
                }

                self.brushMove(min, max);
            }
        }
    }
    _onBrushEnd(self) {
        return function() {
            if (self.brushEnd) {
                let extent = self.brush.extent();
                let min = extent[0];
                let max = extent[1];

                if (self.config.steps) {
                    let bisect = d3.bisector(function(d) { return d; }).left;
                    min = self.config.steps[bisect(self.config.steps, min)];
                    let asdf = bisect(self.config.steps, max);
                    max = self.config.steps[bisect(self.config.steps, max)];


                    self.gBrush.call(self.brush.extent([min, max]));
                }

                if (self.Handle) {
                    self.Handle.updateValue(min, max);
                }
                self.brushEnd(min, max);
            }
        }
    }
}*/