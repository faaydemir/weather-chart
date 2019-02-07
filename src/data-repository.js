class DataRepository {
    constructor() {
        this.source = 'src/data/17060.01.01.2018.31.12.2018.1.0.0.en.ansi.00000000.csv';
    }

    //from https://stackoverflow.com/questions/43187145/d3-cant-return-data-from-json-request
    async getData(sourceUrl) {
        if (sourceUrl)
            this.source = sourceUrl;
        var url = this.source;

        return d3.text(url).then(
            x => {
                const semicolonParser = d3.dsvFormat(';')
                const parsedData = semicolonParser.parse(x);
                return this._simplifyData(parsedData);
            }
        );

    }

    _simplifyData(data) {

        const parseTime = d3.timeParse("%d.%m.%Y %H:%M");
        const simplifiedData = [];
        for (let i = 0; i < data.length; i++) {

            let entity = {};

            entity.temperature = parseFloat(data[i].T);
            entity.time = parseTime(data[i]["Local Time"]).getTime();
            entity.condition = this._simplifyWeatherCondition(data[i].WW);

            simplifiedData.push(entity);
        }
        return simplifiedData;
    }

    /**
     * @param  {Array} data simplify the weather condition explanation to basic words;
     */
    _simplifyWeatherCondition(conditionText) {
        /*
        rain  continuous  ||   rain shower   -> rain heavy 
        rain intermittent  -> rain medium     
        Drizzle - >rain light 
        cloud - > cloud  
        Thunderstorm - > thunderstorm  
        Lightning -> lightning; 
        dust || fog || haze ||mist ->  fog 
        */
        conditionText = conditionText.toLowerCase();
        if (conditionText.includes("rain")) {
            if (conditionText.includes("intermittent")) {
                return "rain medium";
            } else if (conditionText.includes("continuous") || conditionText.includes("shower")) {
                return "rain heavy";
            } else if (conditionText.includes("drizzle")) {
                return "rain light";
            } else {
                return "rain light";
            }
        } else if (conditionText.includes("cloud")) {
            return "cloud";
        } else if (conditionText.includes("mist")) {
            return "mist";
        } else if (conditionText.includes("snow")) {
            return "snow";
        } else if (conditionText.includes("thunderstorm")) {
            return "thunderstorm";
        } else if (conditionText.includes("fog") || conditionText.includes("haze") || conditionText.includes("fog")) {
            return "fog";
        } else if (conditionText.includes("lightning")) {
            return "lightning";
        } else {
            return "sunny";
        }
    }


    __checkWeatherCondition(data) {

        const conditionMap = new Map();

        for (let i = 0; i < data.length; i++) {
            let key = data[i].WW
            if (conditionMap.has(key)) {
                conditionMap.set(key, conditionMap.get(key) + 1);
            } else {
                conditionMap.set(key, 1);
            }
        }
        conditionMap.forEach(function(value, key) {
            console.log(key + ' = ' + value);
        });
    }
}