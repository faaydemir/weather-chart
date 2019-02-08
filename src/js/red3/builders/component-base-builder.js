//not used yet
class ComponentBuilderBase extends builderBase {
	constructor(type) {
		super();
		this.type = type;
	}
	build() {
		new this.type(this.container, this.data, this.config);
	}
	data(value) {
		if (argumentCount === 0) {
			return this.data;
		} else {
			this.data = value;
			return this;
		}
	}
	container(value) {
		if (argumentCount === 0) {
			return this.container;
		} else {
			this.container = value;
			return this;
		}
	}
	x(_) {
		return this.set_or_get("x", arguments);
	}
	z(_) {
		return this.set_or_get("y", arguments);
	}
	y(_) {
		return this.set_or_get("z", arguments);
	}
	colorMap(_) {
		return this.set_or_get("colorMap", arguments);
	}
	opacity(_) {
		return this.set_or_get("opacity", arguments);
	}
	container(_) {
		return this.set_or_get("container", arguments);
	}
	width(_) {
		return this.set_or_get("width", arguments);
	}
	height(_) {
		return this.set_or_get("height", arguments);
	}
}