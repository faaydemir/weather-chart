export const EventTypes = {
	onMouseOver: "onMouseOver",
	onMouseOut: "onMouseOut",
	click: "click",
	verticalzoom: "verticalzoom",
	horizontalzoom: "horizontalzoom",
	onMouseOutLabel: "onMouseOutLabel",
	onMouseOverLabel: "onMouseOverLabel",
	onMouseClickLabel: "onMouseClickLabel",
};

export default class EventBus {
	constructor() {
		this.observers = {};

		this.unsubscribe = function(eventName, eventListener) {
			if (!(this.observers[eventName]))
				return;

			var index = this.observers[eventName].indexOf(eventListener);
			if (index > -1) {
				this.observers[eventName].splice(index, 1);
			}
		};

		this.subscribe = function(eventName, eventListener) {
			if (!(this.observers[eventName]))
				this.observers[eventName] = [];

			this.observers[eventName].push(eventListener);
		};

		this.notify = function(name, source, args) {
			if (this.observers[name])
				for (var i = 0; i < this.observers[name].length; i++) {
					this.observers[name][i](name, source, args);
				}
		};
	}
}