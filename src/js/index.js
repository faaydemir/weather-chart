// TODO change here to change all components from single file later

import Line from './red3/components/line';
import Bar from './red3/components/bar';
import BrushX from './red3/components/brush';
import Event from './red3/components/event';
import Area from './red3/components/area';
import Chart from './red3/charts/chart';

import Radial from './red3/components/radial';
import DataLabel from './red3/components/data-label';
import Sampler from './sampler';
import MoonPhaseHandler from './moon-phase-handler';
import DataRepository from './data-repository';

async function draw() {

    // init data 
    let radialValue = 50;

    const dataRepository = new DataRepository();

    const [allWeatherData, monthMinMax] = await dataRepository.getData();
    const [minTemperature, maxTemperature] = monthMinMax.reduce((minMax, current, index) => {
        if (index === 1) {
            minMax = [minMax.min, minMax.max];
        }
        if (current.min < minMax[0]) {
            minMax[0] = current.min;
        }
        if (current.max > minMax[1]) {
            minMax[1] = current.max;
        }
        return minMax;
    })
    const sampleWeatherData = Sampler.sampleTo(allWeatherData, 1000, weatherSampler, 1);

    const eventData = {
        weather: Sampler.sampleTo(sampleWeatherData, 36, weatherSampler, 1)
    };
    const weatherData = {
        weather: sampleWeatherData
    };
    const mountMinMaxData = {
        weather: monthMinMax
    };


    let radialConfig = {
        max: 100,
        min: 0,
        text: d => `%${Math.round(d)}`
    }


    let genericConfig = {
        opacity: 0.8,
        strokeWidth: 2,
        colorMap: d => "white",
        x: d => d.time,
        y: d => d.temperature,
        text: d => `${d.temperature}°C` // for dataLabel module
    }
    const barConfig = {
        colorMap: d => "#62C0FC",
        x: d => d.time,
        y: d => d.max,
        yStart: d => d.min,
        minY: minTemperature,
        maxY: maxTemperature,
        barWidth: 30,
    }

    let brushChartConfig = {
        components: ["bar", "dataLabel", "circle", "line", "yAxis", "brush"],
        opacity: 1,
        strokeWidth: 2,
        barWidth: 30,
        colorMap: d => "#62C0FC",
        height: 100,
        minY: minTemperature,
        maxY: maxTemperature,
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


    let eventConfig = {
        x: d => d.time,
        minY: -1,
        maxY: 5,
        y: d => 1,
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

    let weatherConfig = {
        x: d => d.time,
        y: d => d.temperature,
        colorMap: d => "white",
        textColor: "white",
        strokeColor: "white",
        format: d => new Date(d).toISOString().slice(0, 10),
        minY: minTemperature - 10,
        maxY: maxTemperature,
        strokeWidth: 2,
        components: ["dataLabel", "line", "area", "event", "xAxis"],

        area: {
            opacity: 0.1,

        },
        dataLabel: {
            data: eventData,
            opacity: 0.1,
            text: d => `${ Math.floor( d.temperature)} °C`
        },
        event: {
            data: eventData,
            minY: -1,
            maxY: 5,
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



    const radial = new Radial("#radial", radialValue, radialConfig);
    const bar = new Bar("#bar", mountMinMaxData, barConfig);
    const event = new Event("#event", weatherData, eventConfig);

    const dataLabel = new DataLabel("#data-label", weatherData, genericConfig);
    const line = new Line("#line", weatherData, genericConfig);
    const area = new Area("#area", weatherData, genericConfig);
    const brush = new BrushX("#brush", weatherData, genericConfig);

    radial.Draw();
    bar.Draw();
    event.Draw();
    dataLabel.Draw();
    line.Draw();
    area.Draw();
    brush.Draw();

    const brushChart = new Chart("#brush-chart", mountMinMaxData, brushChartConfig);
    const weatherChart = new Chart("#weather-chart", weatherData, weatherConfig);

    weatherChart.Draw();
    brushChart.Draw();

    brushChart.eventBus.subscribe("horizontalzoom", (name, sender, args) => {
        // get data in range
        const chartData = allWeatherData.filter(x => x.time >= args.min && x.time <= args.max);
        const eventData = Sampler.sampleTo(chartData, 36, weatherSampler, 1);


        weatherChart._setData({
            weather: chartData
        })

        weatherChart.components["event"]._setData({
            weather: eventData
        });
        weatherChart.components["dataLabel"]._setData({
            weather: eventData
        });

        weatherChart.Update();
    })
}
draw();


function weatherSampler(dataArray) {
    function jsonCopy(src) {
        return JSON.parse(JSON.stringify(src));
    }
    if (dataArray.length < 2) {
        return [];
    }
    const averageTemperature = dataArray.reduce((total, d, index, array) => {
        if (index === 1)
            total = total.temperature;
        total += d.temperature;
        if (index === array.length - 1) {
            return total / array.length;
        } else {
            return total;
        }
    });
    const averageCondition = dataArray.reduce((total, d, index, array) => {

        if (index === 1) {
            const map = new Map();
            map.set(total.condition, 1);
            total = map;
        }
        if (!total.has(d.condition)) {
            total.set(d.condition, 1);
        } else {
            let weight = 1;
            if (d.condition.includes("sunny")) {
                weight = 0.1;
            } else if (d.condition.includes("rain")) {
                weight = 3;
            } else if (d.condition.includes("thunderstorm")) {
                weight = 5;
            } else if (d.condition.includes("mist")) {
                weight = 2;
            } else if (d.condition.includes("snow")) {
                weight = 10;
            } else if (d.condition.includes("lightning")) {
                weight = 5;
            }
            total.set(d.condition, total.get(d.condition) + weight);
        }

        if (index === dataArray.length - 1) {
            let key,
                value = -1;
            total.forEach((v, k) => {
                if (v > value) {
                    key = k;
                    value = v;
                }
            });
            return key;
        } else {
            return total;
        }
    });
    const sample = jsonCopy(dataArray[0]);
    sample.temperature = averageTemperature;
    sample.condition = averageCondition;
    return [sample];
}