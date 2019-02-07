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

        yAxis: {
            textColor: "white",
            strokeColor: "white",
            format: d => `${d}°C`
        },
        //dataLabel
        dataLabel: {
            colorMap: d => "white",
            y: d => 0,
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

            /*
            https://img.icons8.com/color/48/000000/moderate-rain.png
            https://img.icons8.com/color/48/000000/torrential-rain.png
            https://img.icons8.com/color/48/000000/torrential-rain.png 
            https://img.icons8.com/color/48/000000/light-rain.png
            https://img.icons8.com/color/48/000000/cloud.png
            https://img.icons8.com/color/48/000000/snow.png
            https://img.icons8.com/color/48/000000/fog-day.png
            https://img.icons8.com/color/48/000000/chance-of-storm.png
            https://img.icons8.com/color/48/000000/cloud-lighting.png
            https://img.icons8.com/color/48/000000/fog-day.png
            https://img.icons8.com/color/48/000000/fog-night.png

            rain heavy torrential-rain.png
            rain medium   moderate-rain.png
            rain light light-rain.png
            cloud  cloud.png
            thunderstorm  chance-of-storm.png
            lightning; cloud-lighting.png
            fog fog-day.png
            sunny ->sun.png
            */

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

                /*
                https://img.icons8.com/color/48/000000/moderate-rain.png
                https://img.icons8.com/color/48/000000/torrential-rain.png
                https://img.icons8.com/color/48/000000/torrential-rain.png 
                https://img.icons8.com/color/48/000000/light-rain.png
                https://img.icons8.com/color/48/000000/cloud.png
                https://img.icons8.com/color/48/000000/snow.png
                https://img.icons8.com/color/48/000000/fog-day.png
                https://img.icons8.com/color/48/000000/chance-of-storm.png
                https://img.icons8.com/color/48/000000/cloud-lighting.png
                https://img.icons8.com/color/48/000000/fog-day.png
                https://img.icons8.com/color/48/000000/fog-night.png

                rain heavy torrential-rain.png
                rain medium   moderate-rain.png
                rain light light-rain.png
                cloud  cloud.png
                thunderstorm  chance-of-storm.png
                lightning; cloud-lighting.png
                fog fog-day.png
                sunny ->sun.png
                */

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
            max: minMax[1]
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

    const brushChart = new BrushChart("#brush-chart", mountMinMaxData, barConfig);

    const weatherChart = new WeatherChart("#weather-chart", weatherData, weatherConfig);

    weatherChart.Init();

    weatherChart.components["event"].data = {
        weather: Sampler.sampleTo(istanbul, 20, Sampler.minMaxSampler(x => x.temperature), 2)
    }

    weatherChart.components["dataLabel"].data = {
        weather: Sampler.sampleTo(istanbul, 30, Sampler.minMaxSampler(x => x.temperature), 2)
    }

    weatherChart.Draw();
    brushChart.Draw();

}

draw();