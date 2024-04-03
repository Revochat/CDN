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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteServer = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../database");
const logger_1 = __importDefault(require("../logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_bearer_token_1 = __importDefault(require("express-bearer-token"));
dotenv_1.default.config();
class RouteServer {
    constructor(port, uploadFolder) {
        this.app = (0, express_1.default)();
        // set cors headers
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, express_bearer_token_1.default)());
        this.port = port;
        this.uploadFolder = uploadFolder;
        logger_1.default.beautifulSpace();
        this.init();
    }
    init() {
        (0, database_1.DB_Connect)().then(DB => {
            if (!fs_1.default.existsSync(this.uploadFolder)) {
                fs_1.default.mkdirSync(this.uploadFolder);
            }
            const storage = multer_1.default.diskStorage({
                destination: (req, file, cb) => __awaiter(this, void 0, void 0, function* () {
                    const channelID = req.params.channelID;
                    const userID = req.params.userID;
                    if (!req.token)
                        return cb(new Error('No token provided'), '');
                    const DB = yield (0, database_1.DB_Connect)();
                    const user = yield DB.connection.collection('users').findOne({ token: req.token });
                    if (!user)
                        return cb(new Error('Invalid token'), '');
                    req.userID = user.user_id;
                    var channelPath = '';
                    var userPath = '';
                    if (channelID) {
                        var channelPath = path_1.default.join(this.uploadFolder, 'channel', channelID);
                        var userPath = path_1.default.join(channelPath, user.user_id.toString());
                    }
                    else if (userID) {
                        var channelPath = path_1.default.join(this.uploadFolder, 'avatar');
                        var userPath = path_1.default.join(this.uploadFolder, 'avatar', userID);
                    }
                    else {
                        return cb(new Error('No channelID or userID provided'), '');
                    }
                    if (!fs_1.default.existsSync(channelPath)) {
                        fs_1.default.mkdirSync(channelPath, { recursive: true });
                    }
                    if (!fs_1.default.existsSync(userPath)) {
                        fs_1.default.mkdirSync(userPath);
                    }
                    cb(null, userPath);
                }),
                filename: (req, file, cb) => {
                    const timestamp = Date.now();
                    const newFilename = `${file.originalname}_${timestamp}${path_1.default.extname(file.originalname)}`;
                    cb(null, newFilename);
                }
            });
            const upload = (0, multer_1.default)({ storage: storage });
            this.app.post('/uploads/channel/:channelID', upload.single('file'), (req, res) => __awaiter(this, void 0, void 0, function* () {
                logger_1.default.info('uploading file');
                const file = req.file;
                if (!file)
                    return res.status(400).json({ error: 'No file uploaded' });
                if (!req.params.channelID)
                    return res.status(400).json({ error: 'No channelID provided' });
                if (!req.token)
                    return res.status(400).json({ error: 'No token provided' });
                const token = req.token;
                const user = yield DB.connection.collection('users').findOne({ token: token });
                if (!user)
                    return res.status(400).json({ error: 'Invalid token' });
                const channelID = req.params.channelID;
                if (!channelID)
                    return res.status(400).json({ error: 'No channelID provided' });
                // check if channel exists and if user is in it
                const channel = yield DB.connection.collection('channels').findOne({ channel_id: channelID });
                if (!channel)
                    return res.status(400).json({ error: 'Invalid channelID' });
                if (!channel.members.includes(user.user_id))
                    return res.status(400).json({ error: 'You are not in this channel' });
                // check file size
                const stats = fs_1.default.statSync(file.path);
                const fileSizeInBytes = stats.size;
                const fileSizeInMegabytes = fileSizeInBytes / 1000000.0; // 1MB = 1000000 bytes
                if (fileSizeInMegabytes > 50)
                    return res.status(400).json({ error: 'File size is too big' });
                const fileURL = `/uploads/channel/${req.params.channelID}/${req.userID}/${file.filename}`;
                logger_1.default.info(fileURL);
                res.json({ link: fileURL });
            }));
            this.app.post('/uploads/avatar/:userID', upload.single('file'), (req, res) => __awaiter(this, void 0, void 0, function* () {
                logger_1.default.info('uploading avatar');
                const file = req.file;
                const server_url = process.env.SERVER_URL;
                if (!file)
                    return res.status(400).json({ error: 'No file uploaded' });
                if (!req.params.userID)
                    return res.status(400).json({ error: 'No userID provided' });
                if (!req.token)
                    return res.status(400).json({ error: 'No token provided' });
                const token = req.token;
                const user = yield DB.connection.collection('users').findOne({ token: token });
                if (!user)
                    return res.status(400).json({ error: 'Invalid token' });
                const userID = req.params.userID;
                if (!userID)
                    return res.status(400).json({ error: 'No userID provided' });
                // check file size
                const stats = fs_1.default.statSync(file.path);
                const fileSizeInBytes = stats.size;
                const fileSizeInMegabytes = fileSizeInBytes / 1000000.0; // 1MB = 1000000 bytes
                if (fileSizeInMegabytes > 50)
                    return res.status(400).json({ error: 'File size is too big' });
                // save in user document in database
                const fileURL = `${server_url}/uploads/avatar/${req.params.userID}/${file.filename}`;
                yield DB.connection.collection('users').updateOne({ user_id: userID }, { $set: { avatar: fileURL } });
                res.json({ link: fileURL });
            }));
            this.app.use((err, req, res, next) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });
            this.app.use('/uploads/avatar', express_1.default.static(path_1.default.join(this.uploadFolder, 'avatar')));
            this.app.use('/uploads/channel', express_1.default.static(path_1.default.join(this.uploadFolder, 'channel')));
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            logger_1.default.success(`Server listening on port ${this.port}`);
            process.env.APP_PORT ? null : logger_1.default.warn(`The port hasn't been specified in the .env file, using the default port (3000)`);
        });
    }
}
exports.RouteServer = RouteServer;
