// Merge  obj2 over obj1 1
export function mergeTo(obj1, obj2) {
	let cloneObject = Object.assign({}, obj1);


	for (let property in obj2) {

		if (obj2.hasOwnProperty(property)) {
			if (obj2[property] &&
                 typeof obj2[property] === "object" &&
                 typeof cloneObject[property] === "object" &&
                 (!Array.isArray(obj2[property])) &&
                 (!Array.isArray(cloneObject[property]))
			) {
				cloneObject[property] = mergeTo(cloneObject[property], obj2[property]);
			} else {
				cloneObject[property] = obj2[property];
			}
		}
	}
	return cloneObject;
}

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export function calculatedLayout(container, width, height) {
	let calculatedWidth = _calculateValue(container.node().getBoundingClientRect().width, width);
	let calculatedHeight = _calculateValue(container.node().getBoundingClientRect().height, height);

	return {
		width: calculatedWidth,
		height: calculatedHeight
	};

	function _calculateValue(gValue, configValue) {
		let calculatedValue = null;
		if (typeof configValue != "undefined") {
			if (configValue % 1 === 0) { // if number
				calculatedValue = configValue;
			} else if (!isNaN(parseFloat(configValue))) { // if "100%" like
				calculatedValue = parseInt(gValue) * parseFloat(configValue) / 100;
			} else if (!isNaN(parseInt(configValue))) { // if number string 
				calculatedValue = parseInt(configValue);
			} else {
				calculatedValue = parseInt(gValue); // default size 
			}
		}
		return calculatedValue;
	}
}