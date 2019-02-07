function calculatedLayout(container, width, height) {
    let calculatedWidth = _calculateValue(container.node().getBoundingClientRect().width, width);
    let calculatedHeight = _calculateValue(container.node().getBoundingClientRect().height, height);

    return {
        width: calculatedWidth,
        height: calculatedHeight
    };

    function _calculateValue(gValue, configValue) {
        let calculatedValue = null;
        if (typeof configValue != 'undefined') {
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
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};