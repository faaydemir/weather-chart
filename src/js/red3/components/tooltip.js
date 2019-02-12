import d3Base from "./d3-base";
import * as d3 from "d3";
import { sleep } from "../utils";

export default class Tooltip extends d3Base {
    constructor(contanier, data, config) {

        super(null, null, config);
        this._defaultConfig = {
            html: d => JSON.stringify(d) + "<br/>",
            class: "tooltip-default",
            id: "tooltip",
            container: "body",
            time: 1000,
            onTooltipCreated: null,
        };
        this.eventListeners = {
            onMouseOver: (n, s, args) => this.show(args.d, args.x, args.y),
            onMouseOut: (n, s, args) => this.hide()
        };
        this.IsTimeElapsed = false;
        this.AppendData = null;
        this.UpdateData = null;
    }

    _draw() {
        this.TooltipDiv = d3.select(this.config.container)
            .append("div")
            .style("opacity", 1);
    }

    hide() {

        this.TooltipDiv.transition()
            .delay(this.config.time)
            .style("opacity", 0)
            .style("top", "0px");

    }
    _setData() {

    }
    _updateDraw() {

    }
    show(d, x, y) {

        this.TooltipDiv.transition();
        this.TooltipDiv
            .style("left", (x + "px"))
            .style("top", (y + "px"))
            .html(this.config.html(d))
            .style("opacity", 1)
            .style("position", "absolute")
            .style("z-index", "100");

        let rect = this.TooltipDiv.node().getBoundingClientRect();
        let bodyRect = this.TooltipDiv.node().getBoundingClientRect();

        if ((x > rect.width / 2) && (y > rect.height)) {
            x = x - rect.width / 2;
            y = y - rect.height;
        }
        if ((x + rect.width / 2) > bodyRect.width) {
            x = x - rect.width / 2;
        }




        if (this.config.onTooltipCreated) {
            this.config.onTooltipCreated(d);
        }
    }

}