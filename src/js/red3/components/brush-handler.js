import * as d3 from 'd3';
export default class BrushHandler {
    constructor(selection, width, height) {
        const handle = selection.append("g");
        const rectWidth = 6;
        handle.append("rect")
            .attr("fill", "white")
            .attr("x", -rectWidth * 0.5)
            .attr("y", 0)
            .attr("width", rectWidth)
            .attr("height", height);

        this.handle = handle;
    }
    update(dataRange) {

        let v1 = dataRange[0] / 1000;
        let v2 = dataRange[1] / 1000;
        console.log(dataRange);
        this.handle
            .attr("display", null)
            .attr("transform", function(d, i) {
                return "translate(" + dataRange[i] + "," + 0 + ")";
            });
    }
}