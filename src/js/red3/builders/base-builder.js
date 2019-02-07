//not used
class builderBase {
    constructor() {
        this.config = {};
    }
    set_or_get(propertyName, callerArguments) {

        if (callerArguments.length === 0) {
            return this.config[propertyName];
        } else {
            this.config[propertyName] = callerArguments[0]
        }
        return this;
    }
    build() {
        return this.config;
    }
}