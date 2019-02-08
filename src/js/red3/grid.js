export default function AutoGrid(container) {
	let _this = this;
	this.container = container;
	let rows = {};
	let columns = {};
	let rowCount = 0;
	let columnCount = 0;

	this.__verticalPercentFactor;
	this.__horizontalPercentFactor;


	this.width = this.container.node().getBoundingClientRect().width;
	this.height = this.container.node().getBoundingClientRect().height;

	function AddItem(c, r, itemWidth, itemHeight) {

		if (r + 1 > rowCount)
			rowCount = r + 1;
		if (c + 1 > columnCount)
			columnCount = c + 1;

		if (!columns[c]) {
			columns[c] = {
				size: itemWidth
			};
		} else {
			if (IsAbsolute(itemWidth)) {
				if (IsAbsolute(columns[c].size)) {
					if (itemWidth > columns[c].size) {
						columns[c].size = itemWidth;
					}
				} else {
					columns[c].size = itemWidth;
				}
			} else {
				if (IsPercent(columns[c].size)) {
					if (Percent(itemWidth) > Percent(columns[c].size))
						columns[c].size = itemWidth;
				}
			}
		}
		if (!rows[r]) {
			rows[r] = {
				size: itemHeight
			};
		} else if (IsAbsolute(itemHeight)) {
			if (IsAbsolute(rows[r].size)) {
				if (itemHeight > rows[r].size) {
					rows[r].size = itemHeight;
				}
			} else {
				rows[r].size = itemHeight;
			}
		} else {
			if (IsPercent(rows[r].size)) {
				if (Percent(itemHeight) > Percent(rows[r].size))
					rows[r].size = itemHeight;
			}
		}


	}

	function GetLayout(c, r, width, height, align) {

		let translateTop = 0;
		let translateLeft = 0;
		let absoluteWidth = IsPercent(width) ? Percent(width) * _this.__horizontalPercentFactor : width;
		let absoluteHeight = IsPercent(height) ? Percent(height) * _this.__verticalPercentFactor : height;

		if (align === "right") {
			translateLeft = columns[c].start + columns[c].absoluteSize - absoluteWidth;
		} else {
			translateLeft = columns[c].start;
		}

		if (align === "top") {
			translateTop = rows[r].start + row[r].absoluteSize - absoluteHeight;

		} else {
			translateTop = rows[r].start;
		}

		return {
			translate: "translate(" + translateLeft + "," + translateTop + ")",
			width: absoluteWidth,
			height: absoluteHeight,
		};
	}

	function Resize(container) {
		this.container = container;
		this.width = this.container.node().getBoundingClientRect().width;
		this.height = this.container.node().getBoundingClientRect().height;
		Update();
	}

	function Update() {
		function calculateAbsoluteValues(__, count, absTotal) {
			let offset = 0;
			let topOffset = 0;
			let absoluteTotal = 0;
			let relativeTotal = null;
			let percentFactor = 0;

			for (let i = 0; i < count; i++) {
				if (!__[i]) continue;
				if (IsPercent(__[i].size)) {
					relativeTotal += Percent(__[i].size);
				} else if (IsAbsolute(__[i].size)) {
					absoluteTotal += __[i].size;
				}
			}

			if (relativeTotal === null)
				relativeTotal = 100;
			percentFactor = (absTotal - absoluteTotal) / relativeTotal;

			for (let i = 0; i < count; i++) {
				if (!__[i]) continue;

				if (IsPercent(__[i].size)) {
					__[i].absoluteSize = Percent(__[i].size) * percentFactor;
				} else if (IsAbsolute(__[i].size)) {
					__[i].absoluteSize = __[i].size;
				}
				__[i].start = offset;
				offset += __[i].absoluteSize;
			}
			return percentFactor;
		}
		_this.__horizontalPercentFactor = calculateAbsoluteValues(columns, columnCount, this.width);
		_this.__verticalPercentFactor = calculateAbsoluteValues(rows, rowCount, this.height);
		return [columns, rows];
	}

	function IsPercent(value) {
		if (/^\d+(\.\d+)?%$/.test(value)) {
			return true;
		} else {
			return false;
		}
	}

	function IsAbsolute(value) {
		return Number.isFinite(value);
	}

	function Percent(value) {
		return parseFloat(value);
	}

	this.AddItem = AddItem;
	this.Update = Update;
	this.GetLayout = GetLayout;
	this.Resize = Resize;
}