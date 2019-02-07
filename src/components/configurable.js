// class ConfigBuilder {
//     constructor(type) {
//         this.data;
//         this.container;
//         this.config = {};
//         this.type = type;

//     }
//     build() {
//         new this.type(this.container, this.data, this.config)
//     }
//     __configure(configName, configValue, argumentCount) {
//         if (argumentCount === 0) {
//             return this.config[configName];
//         } else {
//             this.config[configName] = configName;
//             return this;
//         }
//     }
//     data(value) {
//         if (argumentCount === 0) {
//             return this.data;
//         } else {
//             this.data = value;
//             return this;
//         }
//     }
//     data(value) {
//         if (argumentCount === 0) {
//             return this.data;
//         } else {
//             this.data = value;
//             return this;
//         }
//     }


//     config(value) {
//         return __configure("config", value, arguments.length);
//     }
//     container(value) {
//         return __configure("container", value, arguments.length);
//     }

//     colorMap(value) {
//         return __configure("colorMap", value, arguments.length);
//     }
//     width(value) {
//         return __configure("width", value, arguments.length);
//     }
//     height(value) {
//         return __configure("height", value, arguments.length);
//     }
//     scaleX(value) {
//         return __configure("scaleX", value, arguments.length);
//     }
//     scaleY(value) {
//         return __configure("scaleY", value, arguments.length);
//     }
// }