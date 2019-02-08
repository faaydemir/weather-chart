import * as d3 from 'd3';
import * as utils from './../utils';
import ResizeSensor from 'resize-sensor';

/**
 * @param  {} container dom or svg that will contain visualization module 
 * @param  {} data data to visualize
 * @param  {} config component configuration
 */
export default class d3Base {
    constructor(container, data, config) {

        this._defaultConfig;
        this.scaleX;
        this.container;
        this.scaleY;
        this.config;
        this._draw;
        this._updateDraw;
        this.eventBus;
        this.eventListeners = {};

        if (data) {
            this.data = utils.clone(data);
        }
        if (config) {
            this.configParam = config;
        }
        this.containerParam = container;
    }

    Draw() {
        this._init();
        this._initScales();
        this._draw();
    }

    AppendDataAsync(data) {
        return new Promise((resolve, reject) => {
            this.AppendData(data);
        });
    }

    AppendData(data) {
        this._addData(data);
        this._initScales();
        this._updateDraw();
    }

    UpdateData(data) {
        this._setData(data);
        Update();
    }
    Update() {
        this._initScales();
        this._updateDraw();
    }
    ZoomX(min, max) {
        this.scaleX.domain([min, max]);
        this._updateDraw();
    }
    ZoomY(min, max) {
        this.scaleY.domain([max, min]);
        this._updateDraw();
    }


    _init() {
        this.config = utils.mergeTo(this._defaultConfig, this.configParam);
        if (this.containerParam) {
            this._initContainer(this.containerParam);
            this._initWidthAndHeight();
        }

        if (this.config.resize === true) {
            this._initResizeHandler();
        }

    }
    _initWidthAndHeight() {
        if (this.containerParam) {
            let layoutParams = utils.calculatedLayout(this.container, this.config.width, this.config.height);
            this.width = layoutParams.width;
            this.height = layoutParams.height;
        }
    }

    _initResizeHandler() {
        new ResizeSensor(document.getElementsByTagName('body'),
            async() => {
                if (!this._waitForResize) {
                    await utils.sleep(500);
                    this._resize();
                    this._waitForResize = false;
                }
            });
    }

    _resize() {
        return;
        //not enable 

        this._initWidthAndHeight();
        this._initScales();
        this._updateDraw();

        console.log(`w : ${this.width} - h : ${this.height}`);

    }

    eventBus(eventBus) {
        if (eventBus) {
            this._eventBus = eventBus;
            for (let listener in this.eventListeners) {
                this._eventBus.subscribe(listener, this.eventListeners[listener]);
            }
        }
    }

    _initContainer(container) {
        if (typeof container === "string") { // if #divId , or  .divclass 
            this.container = d3.select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%");
        } else { // else  assume container is appended g or svg
            this.container = container;
        }
    }

    _setData(data) {
        for (var key in data) {
            if (!data.hasOwnProperty(key)) continue;
            if (!this.data.hasOwnProperty(key)) continue;
            this.data[key] = utils.clone(data[key]);
        }
    }

    _addData(data) {

        if (data === null || this.data === null)
            return;

        for (var key in data) {
            if (!data.hasOwnProperty(key)) continue;
            if (!this.data.hasOwnProperty(key)) continue;
            this.data[key] = this.data[key].concat(data[key]);

            if (this.config.maxDataCount) {
                let start = this.data[key].length - this.config.maxDataCount;
                this.data[key] = this.data[key].slice(start);
            }
        }
    }

    _raiseEvent(name, source, args) {
        if (this._eventBus) {
            this._eventBus.notify(name, source, args);
        }
    }

    _initScales() {

        if (this.data) {
            let dataArrays = Object.values(this.data);
            this.__flattenData = [].concat.apply([], dataArrays);
            this._initYScale();
            this._initXScale();
        }
    }

    _initYScale() {
        let domainY = d3.extent(this.__flattenData, this.config.y);

        //TO DO fix zero bug 
        this.domainY = [(this.config.minY || domainY[0]), (this.config.maxY || domainY[1])];

        this.scaleY = this.config.scaleY || d3.scaleLinear()
            .range([this.height, 0])
            .domain(this.domainY);
    }

    _initXScale() {
        let domainX = d3.extent(this.__flattenData, this.config.x);

        //TO DO fix zero bug 
        this.domainX = [(this.config.minX || domainX[0]), (this.config.maxX || domainX[1])];

        this.scaleX = this.config.scaleX || d3.scaleLinear()
            .range([0 + 40, this.width - 40])
            .domain(this.domainX);
    }
}