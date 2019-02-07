class BaseBuilder() {
    constructor() {
        this.config = {};
    }
    _set() {

    }
    data(value) {
        this._set(value);
        return this;
    }
    colorMap(value) {
        this._set(value);
        return this;
    }
    opacity(value) {
        this._set(value);
        return this;
    }
    container(value) {
        this._set(value);
        return this;
    }
    width(value) {
        this._set(value);
        return this;
    }
    height(value) {
        this._set(value);
        return this;
    }
    x(value) {
        this._set(value);
        return this;
    }
    y(value) {
        this._set(value);
        return this;
    }
    build() {
        return this.config;
    }
}