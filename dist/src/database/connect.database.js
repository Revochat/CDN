"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_Connect = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var logger_1 = __importDefault(require("../logger"));
var config_1 = require("../../config");
mongoose_1.default.set('strictQuery', false);
function DB_Connect() {
    return new Promise(function (resolve) {
        mongoose_1.default
            .connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
            .then(function (DB) {
            logger_1.default.success("Connected to the database called ".concat(config_1.config.mongo.username, "."));
            logger_1.default.beautifulSpace();
            resolve(DB);
        })
            .catch(function () {
            logger_1.default.fatal("Failed to connect to the database, exiting... ");
            logger_1.default.warn("Please check your database configuration in the environment file (.env)");
            process.exit(1);
        });
    });
}
exports.DB_Connect = DB_Connect;
