"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.normal = function (args) { return (console.log(typeof args === "string" ? chalk_1.default.yellow(args) : args)); };
    Logger.info = function (args) { return console.log(chalk_1.default.blueBright("[".concat(new Date().toLocaleString(), "] [INFO]")), typeof args === "string" ? chalk_1.default.blueBright(args) : args); };
    Logger.warn = function (args) { return console.log(chalk_1.default.yellowBright("[".concat(new Date().toLocaleString(), "] [WARN]")), typeof args === "string" ? chalk_1.default.yellowBright(args) : args); };
    Logger.error = function (args) { return console.log(chalk_1.default.redBright("[".concat(new Date().toLocaleString(), "] [ERROR]")), typeof args === "string" ? chalk_1.default.redBright(args) : args); };
    Logger.debug = function (args) { return console.log(chalk_1.default.greenBright("[".concat(new Date().toLocaleString(), "] [DEBUG]")), typeof args === "string" ? chalk_1.default.greenBright(args) : args); };
    Logger.success = function (args) { return console.log(chalk_1.default.greenBright("[".concat(new Date().toLocaleString(), "] [SUCCESS]")), typeof args === "string" ? chalk_1.default.greenBright(args) : args); };
    Logger.log = function (args) { return console.log(chalk_1.default.whiteBright("[".concat(new Date().toLocaleString(), "] [LOG]")), typeof args === "string" ? chalk_1.default.whiteBright(args) : args); };
    Logger.fatal = function (args) { return console.log(chalk_1.default.redBright("[".concat(new Date().toLocaleString(), "] [FATAL]")), typeof args === "string" ? chalk_1.default.redBright(args) : args); };
    Logger.trace = function (args) { return console.log(chalk_1.default.magentaBright("[".concat(new Date().toLocaleString(), "] [TRACE]")), typeof args === "string" ? chalk_1.default.magentaBright(args) : args); };
    Logger.verbose = function (args) { return console.log(chalk_1.default.cyanBright("[".concat(new Date().toLocaleString(), "] [VERBOSE]")), typeof args === "string" ? chalk_1.default.cyanBright(args) : args); };
    Logger.beautifulSpace = function () { return console.log(chalk_1.default.whiteBright("\n=-=-=-=-=-=-= ".concat(new Date().toLocaleString(), " =-=-=-=-=-=-=\n"))); };
    return Logger;
}());
exports.default = Logger;
