import d3Base from './d3-base';
import * as d3 from 'd3';

export default class Line extends d3Base {

    constructor(container, data, config) {

        super(container, data, config);

        this.lines = {};

        this._defaultConfig = {
            colorMap: d3.scaleOrdinal(d3.schemeAccent),
            strokeWidth: 1,
            opacity: 1,
            width: '100%',
            height: '100%',
            resize: true,
            maxDataCount: null,
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            x: d => d.x,
            y: d => d.y,
            mouseOut: null,
            mouseOver: null,
            hoverOpacity: 1,
            hoverStrokeWidth: 2,
            curve: "curveMonotoneX",
            onFocus: {
                opacity: 1,
                strokeWidth: 2,
                colorMap: d3.scaleOrdinal(d3.schemeAccent),
            }
        };

        this.eventListeners = {
            onMouseOverLabel: (n, s, args) => this.__focus(args.d),
            onMouseOutLabel: (n, s, args) => this.__unfocus(args.d),
        };
    }
    __focus(key) {
        this.lines[key]
            .attr("opacity", this.config.onFocus.opacity)
            .attr("stroke-width", this.config.onFocus.strokeWidth);
    }
    __unfocus(key) {
        this.lines[key]
            .attr("opacity", this.config.opacity)
            .attr("stroke-width", this.config.onFocus.strokewidth);
    }
    _draw() {
        this.d = d3.line()
            .x(d => {
                return this.scaleX(this.config.x(d));

            })
            .y(d => {
                return this.scaleY(this.config.y(d));
            })
            .curve(d3[this.config.curve]);

        this._lineContainer = this.container
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        for (var key in this.data) {
            if (!this.data.hasOwnProperty(key)) continue;

            let color = this.config.colorMap(key);
            this.lines[key] = this._lineContainer.append("path")
                .datum(this.data[key])
                .attr("d", this.d)
                .attr("class", "line")
                .attr("stroke", color)
                .attr("stroke-width", this.config.strokeWidth)
                .attr("opacity", this.config.opacity)
                .on("mouseover", this.OnMouseOver(this))
                .on("mouseout", this.OnMouseOut(this));
        }

    }

    OnMouseOver(self) {
        return function(d, i) {
            let bisector = d3.bisector(self.config.x).left;
            let x0 = self.scaleX.invert(d3.mouse(this)[0]);
            let selectedIndex = bisector(d, x0, 1);
            let args = {};

            args.d = d[selectedIndex];
            args.i = i;
            args.x = event.pageX;
            args.y = event.pageY;
            self._raiseEvent(EventTypes.onMouseOver, self, args);
        };
    }
    OnMouseOut(self) {
        return function(d, i) {
            let args = {};
            // args.d = d;
            args.i = i;
            args.x = event.pageX;
            args.y = event.pageY;
            self._raiseEvent(EventTypes.onMouseOut, self, args);
        };
    }


    _updateDraw() {
        for (var key in this.data) {
            if (!this.lines.hasOwnProperty(key)) continue;
            if (!this.data.hasOwnProperty(key)) continue;

            //updvalueate data
            this.lines[key].datum(this.data[key]);
        }
        this._lineContainer.selectAll("path").attr("d", this.d);
    }

}