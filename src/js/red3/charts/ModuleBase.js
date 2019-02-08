// const ComponentType = Object.freeze({
//     bar: Symbol("bar"),
//     circle: Symbol("circle"),
//     line: Symbol("line"),
//     yAxis: Symbol("yAxis"),
//     xAxis: Symbol("xAxis"),
//     label: Symbol("label"),
//     brush: Symbol("brush"),
//     tooltip: Symbol("tooltip"),
//     dataLabel: Symbol("dataLabel"),
// });

/*
class Raptor {
   constructor(build) {
      this.specimenId = build.specimenId;
      this.speed = build.speed;
      this.plumage = build.plumage;
   }
   static get Builder() {
      class Builder {
         constructor(specimenId) {
            this.specimenId = specimenId;
         }
         withSpeed(speed) {
            this.speed = speed;
            return this;
         }
         withPlumage(plumage) {
            this.plumage = plumage;
            return this;
         }
         build() {
            return new Raptor(this);
         }
      }
      return Builder;
   }
}
// We can call build unto our newly constructed builder object ...
let raptorBuilder1 = new Raptor.Builder('244E-C');
let raptor1 = raptorBuilder1.build();
// ... or pass in the builder object as an argument to Raptor. 
// Your call.
let raptorBuilder2 = new Raptor.Builder('3998A-D');
let raptor2 = new Raptor(raptorBuilder2);

*/
class ComponentBuilder {
	constructor() {
		this.components = [];
	}
	withBar() {
		components.push(ComponentType.bar);
		return this;
	}
	withCircle() {
		components.push(ComponentType.circle);
		return this;
	}
	withLine() {
		components.push(ComponentType.line);
		return this;
	}
	withYAxis() {
		components.push(ComponentType.yAxis);
		return this;
	}
	withLabel() {
		components.push(ComponentType.label);
		return this;
	}
	withDataLabel() {
		components.push(ComponentType.dataLabel);
		return this;
	}
	withBrush() {
		components.push(ComponentType.brush);
		return this;
	}
	withTooltip() {
		components.push(ComponentType.tooltip);
		return this;
	}
	build() {
		return this.components;
	}
}

class ModuleBase {
	constructor(container, data, config) {

		this.containers = {};
		this.components = {};

		this.baseConfig = {
			components: ["bar", "circle", "line", "xAxis", "yAxis", "axis", "label", "brush",
				"tooltip", "dataLabel"
			],
			width: "100%",
			height: "100%",

		};
		// set components 
		this.componentConfig = {
			tooltip: {
				type: Tooltip,
			},
			label: {
				type: Label,
				config: {
					width: "100%",
					height: 20,
					row: 0,
					column: 1,
				}
			},
			line: {
				type: Line,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			dataLabel: {
				type: DataLabel,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			brush: {
				type: BrushX,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			bar: {
				type: Bar,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			circle: {
				type: Circle,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			xAxis: {
				type: xAxis,
				config: {
					width: "100%",
					height: 20,
					row: 2,
					column: 1,
				}
			},
			yAxis: {
				type: yAxis,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			},
			Axis: {
				type: Axis,
				config: {
					width: "100%",
					height: "100%",
					row: 1,
					column: 1,
				}
			}
		};

		if (data) {
			this.data = clone(data);
		}
		if (config) {
			this.configParam = config;
		}
		this.containerParam = container;
		this.margin = {
			x: 20,
			y: 20
		};

	}
	Init() {
		this.initilized = true;
		this._init();
	}
	Draw() {
		if (this.initilized !== true)
			this.Init();

		this._drawComponents();
	}
	_init() {
		// merge config with default 
		this.config = MergeTo(this.baseConfig, MergeTo(this._defaultConfig, this.configParam));
		this.eventBus = new EventBus();

		this._initContainer(this.containerParam);
		// init grid layout that contain components g 
		this._initLayout();
		// set component s config
		this._initComponents();

	}

	_initLayout() {
		let colorMap = d3.scaleOrdinal(d3.schemeCategory10);
		this.grid = new AutoGrid(this.container);
		let calculatedLayout = {};
		this.config.components.forEach(
			component => {
				if ((this.componentConfig[component]) && (this.componentConfig[component].config)) {
					let cLayout = this.componentConfig[component].config;
					this.grid.AddItem(cLayout.column, cLayout.row, cLayout.width, cLayout.height);
				}
			});

		this.grid.Update();

		this.config.components.forEach(
			component => {
				if ((this.componentConfig[component]) && (this.componentConfig[component].config)) {
					let cLayout = this.componentConfig[component].config;

					let ly = this.grid.GetLayout(cLayout.column, cLayout.row, cLayout.width, cLayout.height);
					this.containers[component] = this.container.append("g").attr("width", ly.width).attr("height", ly.height).attr("transform", ly.translate);

					// for debug 
					// delete later
					this.containers[component].append("rect")
						.attr("width", ly.width)
						.attr("height", ly.height)
						.attr("opacity", 0)
						.style("fill", colorMap(component));
				}
			});


	}
	_initComponents() {


		this.config.components.forEach(
			component => {

				if ((this.componentConfig[component])) {

					let container = this.containers[component];

					let config = MergeTo(this.componentConfig[component].config, MergeTo(this.config, this.config[component]));

					let data = this.data;

					this.components[component] = new this.componentConfig[component].type(container, data, config);

					this.components[component].eventBus(this.eventBus);
				}
			});
	}
	_drawComponents() {
		this.config.components.forEach(
			component => {
				this.components[component].Draw();
			});
	}
	AppendData(data) {

		this.config.components.forEach(
			component => {
				if (this.components[component].AppendData)
					this.components[component].AppendData(data);
			});
	}
	_initContainer(container) {
		if (typeof container === "string") { // if #divId , or  .divclass 

			// create new svg and append it to selected dom component
			const containerSvg = d3.select(container)
				.append("svg")
				.attr("width", "100%")
				.attr("height", "100%");

			const width = containerSvg.node().getBoundingClientRect().width - this.margin.x * 2;
			const height = containerSvg.node().getBoundingClientRect().height - this.margin.y * 2;
			this.container = containerSvg
				.append("g")
				.attr("width", width)
				.attr("height", height)
				.attr("transform", `translate(${ this.margin.x },${ this.margin.y })`);
			this.container.append("rect").attr("width", width)
				.attr("height", height).attr("opacity", 0);
			//this.container = containerSvg

		} else { // else  assume container is appended g or svg
			this.container = container;
		}
	}
}