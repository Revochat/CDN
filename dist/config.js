"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var BASE_URI = process.env.BASE_URI;
var MONGO_USERNAME = process.env.MONGO_USERNAME;
var MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.config = {
    application: {
        name: "CDN",
        version: "1.0.0",
        description: "The RevochatAPI is a REST API that allows you to interact with the Revochat database.",
        owners: [
            "ByLife",
            "Thomas78125",
            "Lux",
        ],
    },
    properties: {
        port: Number(process.env.APP_PORT) || 3000,
        readyEventTimeout: 500,
    },
    mongo: {
        username: MONGO_USERNAME,
        url: ((_a = process.env.MONGO_URL) === null || _a === void 0 ? void 0 : _a.replace("<USERNAME>", MONGO_USERNAME).replace("<PASSWORD>", MONGO_PASSWORD)),
    },
    api: {
        url: BASE_URI,
        version: "0.6.9",
    },
    ascii: {
        art: "\n        _______                                           __                    __     \n        /                                                /  |                  /  |    \n        $$$$$$$  |  ______   __     __  ______    _______ $$ |____    ______   _$$ |_   \n        $$ |__$$ | /       /     /  |/        /       |$$        /       / $$   |  \n        $$    $$< /$$$$$$  |$$   /$$//$$$$$$  |/$$$$$$$/ $$$$$$$  | $$$$$$  |$$$$$$/   \n        $$$$$$$  |$$    $$ | $$  /$$/ $$ |  $$ |$$ |      $$ |  $$ | /    $$ |  $$ | __ \n        $$ |  $$ |$$$$$$$$/   $$ $$/  $$ __$$ |$$ _____ $$ |  $$ |/$$$$$$$ |  $$ |/  |\n        $$ |  $$ |$$       |   $$$/   $$    $$/ $$       |$$ |  $$ |$$    $$ |  $$  $$/ \n        $$/   $$/  $$$$$$$/     $/     $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$$/    $$$$/                                                                                \n        "
    }
};
