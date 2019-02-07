import BrushHandler from './red3/components/brush-handler';
export default class MoonPhaseHandler extends BrushHandler {
    constructor(selection, width, height) {
        const handle = selection.append("g");
        this.moonScale = d3.scaleLinear()
            .range([-12, 12])
            .domain([0, 1]);
        const rectWidth = 6;
        const r = 12;
        handle.append("rect")
            .attr("fill", "white")
            .attr("x", -rectWidth * 0.5)
            .attr("y", 0) //was  40
            .attr("width", rectWidth)
            .attr("height", height);

        this.circles = handle.selectAll("circle").data([{
                m: 'l',
                v: 0.5
            }, {
                m: 'd',
                v: 0.5
            }])
            .enter()
            .append("circle")
            .attr("fill", d => (d.m == 'd') ? "white" : "#3C5B9E")
            .attr("cx", d => this.moonScale(d.v))
            .attr("cy", -r * 1.2)
            .attr("r", r);

        this.handle = handle;
    }

    /**
     * @param  {Array} dataRange min max data of brush range
     */
    update(dataRange) {

        let v1 = dataRange[0] / 1000;
        let v2 = dataRange[1] / 1000;

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
            return "translate(" + dataRange[i] + "," + 0 + ")";
        });
    }
}