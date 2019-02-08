import Line from "./line";
import * as d3 from "d3";

export default class Area extends Line {

	constructor(container, data, config) {
		super(container, data, config);
		this._defaultConfig.opacity = 0.2;
	}

	_draw() {
		this.d = d3.area()
			.x(d => {
				return this.scaleX(this.config.x(d));

			})
			.y1(d => {
				return this.scaleY(this.config.y(d));
			})
			.y0(this.height)
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
				.attr("class", "area")
				.attr("fill", color)
				.attr("opacity", this.config.opacity)
				.on("mouseover", this.OnMouseOver(this))
				.on("mouseout", this.OnMouseOut(this));
		}

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