// TODO change here to change all components from single file later
import Label from './red3/components/label';
import Line from './red3/components/line';
import Bar from './red3/components/bar';
import Circle from './red3/components/circle';
import yAxis from './red3/components/yAxis';
import xAxis from './red3/components/xAxis';
import BrushX from './red3/components/brush';
import Event from './red3/components/event';
import Area from './red3/components/area';
import Chart from './red3/charts/chart';
import Sampler from './sampler';
import Radial from './red3/components/radial';
import MoonPhaseHandler from './moon-phase-handler';
import DataRepository from './data-repository';
import dataLabel, {
    DataLabel
} from './red3/components/data-label';
import * as utils from './red3/utils';
import * as d3 from 'd3';
import {
    EventTypes
} from './red3/event-bus';
async function draw() {

    let radialConfig = {
        max: 100,
        min: 0,
        text: d => `%${Math.round(d)}`
    }
    let lineConfig = {
        opacity: 1,
        strokeWidth: 2,
        colorMap: d => "white",
        curve: "curveLinear",
        dataLabel: d => d.temperature,
        x: d => d.time,
        y: d => d.temperature,
    }


    let barConfig = {
        components: ["bar", "dataLabel", "circle", "line", "yAxis", "brush"],
        opacity: 1,
        strokeWidth: 2,
        barWidth: 30,
        colorMap: d => "#62C0FC",
        height: 100,
        minY: 0,
        maxY: 0,
        x: d => d.time,
        y: d => d.max,
        yStart: d => d.min,
        brush: {
            handle: MoonPhaseHandler,
        },
        line: {
            colorMap: d => "white",
            y: d => d.average,
            opacity: 0.7,
        },
        circle: {
            colorMap: d => "white",
            y: d => d.average,
            opacity: 0.7,
        },
        yAxis: {
            opacity: 0.2,
            textColor: "white",
            strokeColor: "white",
            format: d => `${d}°C`
        },
        //dataLabel
        dataLabel: {
            colorMap: d => "white",
            y: d => -10,
            text: d => {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const date = new Date(d.time);
                return monthNames[date.getMonth()];
            }
        }
    }


    let areaConfig = {
        opacity: 0.1,
        strokeWidth: 2,
        colorMap: d => "white",
        curve: "curveLinear",
        x: d => d.time,
        y: d => d.temperature,
    }

    let labelConfig = {
        opacity: 0.1,
        strokeWidth: 2,
        colorMap: d => "white",
        x: d => d.time,
        y: d => d.temperature,
        text: d => `${d.temperature}°C`
    }



    let eventConfig = {
        x: d => d.time,
        minY: -1,
        maxY: 1,
        y: d => 0,
        iconFunction: d => {

            const iconSource = "https://img.icons8.com/color/30/";
            switch (d.condition) {
                case "sunny":
                    return `${iconSource}sun.png`;
                case "fog":
                    return `${iconSource}fog-day.png`;
                case "lightning":
                    return `${iconSource}cloud-lighting.png`;
                case "thunderstorm":
                    return `${iconSource}chance-of-storm.png`;
                case "cloud":
                    return `${iconSource}cloud.png`;
                case "rain light":
                    return `${iconSource}light-rain.png`;
                case "rain medium":
                    return `${iconSource}moderate-rain.png`;
                case "rain heavy":
                    return `${iconSource}torrential-rain.png`;
                default:
                    return `${iconSource}sun.png`;

            }
        }

    }
    let brusgChartConfig = {
        opacity: 1,
        strokeWidth: 2,
        barWidth: 30,
        colorMap: d => "#62C0FC",
        curve: "curveLinear",
        x: d => d.time,
        y: d => d.max,
        yStart: d => d.min,
    }
    let weatherConfig = {
        x: d => d.time,
        y: d => d.temperature,
        colorMap: d => "white",
        minY: -10,
        strokeWidth: 2,
        //components: ["line"],
        components: ["dataLabel", "line", "area", "event"],
        line: {
            opacity: 1,
            dataLabel: d => d.temperature,
        },
        area: {
            opacity: 0.1,

        },
        dataLabel: {
            opacity: 0.1,
            text: d => `${d.temperature} °C`
        },
        event: {
            minY: -1,
            maxY: 4,
            y: d => 1,
            iconFunction: d => {
                const iconSource = "https://img.icons8.com/color/40/";
                switch (d.condition) {
                    case "sunny":
                        return `${iconSource}sun.png`;
                    case "fog":
                        return `${iconSource}fog-day.png`;
                    case "lightning":
                        return `${iconSource}cloud-lighting.png`;
                    case "thunderstorm":
                        return `${iconSource}chance-of-storm.png`;
                    case "cloud":
                        return `${iconSource}cloud.png`;
                    case "rain light":
                        return `${iconSource}light-rain.png`;
                    case "rain medium":
                        return `${iconSource}moderate-rain.png`;
                    case "rain heavy":
                        return `${iconSource}torrential-rain.png`;
                    default:
                        return `${iconSource}sun.png`;

                }
            }
        }
    }

    let radialValue = 50;

    const dataRepository = new DataRepository();

    const istanbul = await dataRepository.getData();

    const sampleData = Sampler.sampleTo(istanbul, 1000, Sampler.minMaxSampler(x => x.temperature), 2);

    // group data by month (all data should be same year if not first group data by year)
    const monthGroup = d3.nest()
        .key(function(d) {
            return new Date(d.time).getMonth();
        })
        .entries(istanbul);

    const mountMinMaxSample = [];
    let minY = null,
        maxY = null;
    monthGroup.forEach((d) => {
        const time = d.values[0].time;
        const minMax = d3.extent(d.values, d => d.temperature);
        const avg = d3.mean(d.values, d => d.temperature);
        if (minY === null && maxY === null) {
            minY = minMax[0];
            maxY = minMax[1]
        } else {
            if (minMax[0] < minY) {
                minY = minMax[0];
            }
            if (minMax[1] > maxY)
                maxY = minMax[1];
        }
        mountMinMaxSample.push({
            time: time,
            min: minMax[0],
            max: minMax[1],
            average: avg,
        })
    });

    barConfig.minY = minY;
    barConfig.maxY = maxY;

    const weatherData = {
        weather: sampleData
    };

    const mountMinMaxData = {
        weather: mountMinMaxSample
    };
    const dataLabel = new DataLabel("#data-label", weatherData, labelConfig);
    const line = new Line("#line", weatherData, lineConfig);
    const area = new Area("#area", weatherData, areaConfig);
    const event = new Event("#event", weatherData, eventConfig);
    const radial = new Radial("#radial", radialValue, radialConfig);
    const brush = new BrushX("#brush", weatherData, lineConfig);
    const bar = new Bar("#bar", mountMinMaxData, barConfig);

    line.Draw();
    area.Draw();
    event.Draw();
    dataLabel.Draw();
    radial.Draw();
    brush.Draw();
    bar.Draw();

    const brushChart = new Chart("#brush-chart", mountMinMaxData, barConfig);

    const weatherChart = new Chart("#weather-chart", weatherData, weatherConfig);

    weatherChart.Init();

    const eventData = {
        weather: Sampler.sampleTo(istanbul, 50, Sampler.minMaxSampler(x => x.temperature), 2)
    }

    weatherChart.components["event"]._setData(eventData);

    weatherChart.components["dataLabel"]._setData(eventData);

    weatherChart.Draw();
    brushChart.Draw();

    brushChart.eventBus.subscribe("horizontalzoom", (name, sender, args) => {
        // get data in range
        const dataInRange = istanbul.filter(x => x.time >= args.min && x.time <= args.max)

        const eventData = {
            weather: Sampler.sampleTo(dataInRange, 50, Sampler.minMaxSampler(x => x.temperature), 2)
        }

        weatherChart._setData({
            weather: dataInRange
        });

        weatherChart.components["event"]._setData(eventData);
        weatherChart.components["dataLabel"]._setData(eventData);

        weatherChart.Update();
    })
}
draw()