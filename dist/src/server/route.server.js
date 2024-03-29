"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServer = void 0;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var database_1 = require("../database");
var logger_1 = __importDefault(require("../logger"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_bearer_token_1 = __importDefault(require("express-bearer-token"));
dotenv_1.default.config();
var RouteServer = /** @class */ (function () {
    function RouteServer(port, uploadFolder) {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, express_bearer_token_1.default)());
        this.port = port;
        this.uploadFolder = uploadFolder;
        logger_1.default.beautifulSpace();
        this.init();
    }
    RouteServer.prototype.init = function () {
        var _this = this;
        (0, database_1.DB_Connect)().then(function (DB) {
            if (!fs_1.default.existsSync(_this.uploadFolder)) {
                fs_1.default.mkdirSync(_this.uploadFolder);
            }
            var storage = multer_1.default.diskStorage({
                destination: function (req, file, cb) { return __awaiter(_this, void 0, void 0, function () {
                    var channelID, userID, DB, user, channelPath, userPath, channelPath, userPath, channelPath, userPath;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                channelID = req.params.channelID;
                                userID = req.params.userID;
                                if (!req.token)
                                    return [2 /*return*/, cb(new Error('No token provided'), '')];
                                return [4 /*yield*/, (0, database_1.DB_Connect)()];
                            case 1:
                                DB = _a.sent();
                                return [4 /*yield*/, DB.connection.collection('users').findOne({ token: req.token })];
                            case 2:
                                user = _a.sent();
                                if (!user)
                                    return [2 /*return*/, cb(new Error('Invalid token'), '')];
                                req.userID = user.user_id;
                                channelPath = '';
                                userPath = '';
                                if (channelID) {
                                    channelPath = path_1.default.join(this.uploadFolder, 'channel', channelID);
                                    userPath = path_1.default.join(channelPath, user.user_id.toString());
                                }
                                else if (userID) {
                                    channelPath = path_1.default.join(this.uploadFolder, 'avatar');
                                    userPath = path_1.default.join(this.uploadFolder, 'avatar', userID);
                                }
                                else {
                                    return [2 /*return*/, cb(new Error('No channelID or userID provided'), '')];
                                }
                                if (!fs_1.default.existsSync(channelPath)) {
                                    fs_1.default.mkdirSync(channelPath, { recursive: true });
                                }
                                if (!fs_1.default.existsSync(userPath)) {
                                    fs_1.default.mkdirSync(userPath);
                                }
                                cb(null, userPath);
                                return [2 /*return*/];
                        }
                    });
                }); },
                filename: function (req, file, cb) {
                    var timestamp = Date.now();
                    var newFilename = "".concat(file.originalname, "_").concat(timestamp).concat(path_1.default.extname(file.originalname));
                    cb(null, newFilename);
                }
            });
            var upload = (0, multer_1.default)({ storage: storage });
            _this.app.post('/uploads/channel/:channelID', upload.single('file'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var file, token, user, channelID, channel, stats, fileSizeInBytes, fileSizeInMegabytes, fileURL;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger_1.default.info('uploading file');
                            file = req.file;
                            if (!file)
                                return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                            if (!req.params.channelID)
                                return [2 /*return*/, res.status(400).json({ error: 'No channelID provided' })];
                            if (!req.token)
                                return [2 /*return*/, res.status(400).json({ error: 'No token provided' })];
                            token = req.token;
                            return [4 /*yield*/, DB.connection.collection('users').findOne({ token: token })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, res.status(400).json({ error: 'Invalid token' })];
                            channelID = req.params.channelID;
                            if (!channelID)
                                return [2 /*return*/, res.status(400).json({ error: 'No channelID provided' })];
                            return [4 /*yield*/, DB.connection.collection('channels').findOne({ channel_id: channelID })];
                        case 2:
                            channel = _a.sent();
                            if (!channel)
                                return [2 /*return*/, res.status(400).json({ error: 'Invalid channelID' })];
                            if (!channel.members.includes(user.user_id))
                                return [2 /*return*/, res.status(400).json({ error: 'You are not in this channel' })];
                            stats = fs_1.default.statSync(file.path);
                            fileSizeInBytes = stats.size;
                            fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
                            if (fileSizeInMegabytes > 50)
                                return [2 /*return*/, res.status(400).json({ error: 'File size is too big' })];
                            fileURL = "/uploads/channel/".concat(req.params.channelID, "/").concat(req.userID, "/").concat(file.filename);
                            logger_1.default.info(fileURL);
                            res.json({ link: fileURL });
                            return [2 /*return*/];
                    }
                });
            }); });
            _this.app.post('/uploads/avatar/:userID', upload.single('file'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var file, token, user, userID, stats, fileSizeInBytes, fileSizeInMegabytes, fileURL;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger_1.default.info('uploading avatar');
                            file = req.file;
                            if (!file)
                                return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                            if (!req.params.userID)
                                return [2 /*return*/, res.status(400).json({ error: 'No userID provided' })];
                            if (!req.token)
                                return [2 /*return*/, res.status(400).json({ error: 'No token provided' })];
                            token = req.token;
                            return [4 /*yield*/, DB.connection.collection('users').findOne({ token: token })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, res.status(400).json({ error: 'Invalid token' })];
                            userID = req.params.userID;
                            if (!userID)
                                return [2 /*return*/, res.status(400).json({ error: 'No userID provided' })];
                            stats = fs_1.default.statSync(file.path);
                            fileSizeInBytes = stats.size;
                            fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
                            if (fileSizeInMegabytes > 50)
                                return [2 /*return*/, res.status(400).json({ error: 'File size is too big' })];
                            fileURL = "/uploads/avatar/".concat(req.params.userID, "/").concat(file.filename);
                            return [4 /*yield*/, DB.connection.collection('users').updateOne({ user_id: userID }, { $set: { avatar: fileURL } })];
                        case 2:
                            _a.sent();
                            res.json({ link: fileURL });
                            return [2 /*return*/];
                    }
                });
            }); });
            _this.app.use(function (err, req, res, next) {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });
            _this.app.use('/uploads/avatar', express_1.default.static(path_1.default.join(_this.uploadFolder, 'avatar')));
            _this.app.use('/uploads/channel', express_1.default.static(path_1.default.join(_this.uploadFolder, 'channel')));
        });
    };
    RouteServer.prototype.listen = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            logger_1.default.success("Server listening on port ".concat(_this.port));
            process.env.APP_PORT ? null : logger_1.default.warn("The port hasn't been specified in the .env file, using the default port (3000)");
        });
    };
    return RouteServer;
}());
exports.RouteServer = RouteServer;
