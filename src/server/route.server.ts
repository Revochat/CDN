import express from 'express';
import multer from 'multer';
import fs from "fs";
import path from "path";
import {DB_Connect} from "../database"
import Logger from '../logger';
import dotenv from 'dotenv';
import bearerToken from 'express-bearer-token';
import { ObjectId } from 'mongodb';


dotenv.config();

export class RouteServer {
    public app: express.Application;
    public port: number;
    public uploadFolder: string;

    constructor(port: number, uploadFolder: string) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bearerToken());
        this.port = port;
        this.uploadFolder = uploadFolder;
        Logger.beautifulSpace();
        this.init();
    }

    private init(): void {
        DB_Connect().then(DB => {
            if (!fs.existsSync(this.uploadFolder)){
                fs.mkdirSync(this.uploadFolder);
            }

            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    const channelID = req.params.channelID;
                    
                    if(!req.token) return cb(new Error('No token provided'), '');
                    const DB = await DB_Connect();
                    const user = await DB.connection.collection('users').findOne({ token: req.token });
                    if(!user) return cb(new Error('Invalid token'), '');
            
                    (req as any).userID = user.user_id;
                    console.log(path)
                    const channelPath = path.join(this.uploadFolder, channelID);
                    const userPath = path.join(channelPath, user.user_id.toString());
            
                    if (!fs.existsSync(channelPath)) {
                        fs.mkdirSync(channelPath, { recursive: true });
                    }
                    if (!fs.existsSync(userPath)) {
                        fs.mkdirSync(userPath);
                    }
                    cb(null, userPath);
                },
                filename: (req, file, cb) => {
                    const timestamp = Date.now();
                    const newFilename = `${file.originalname}_${timestamp}${path.extname(file.originalname)}`;
                    cb(null, newFilename);
                }
            });

            const upload = multer({ storage: storage });

            this.app.post('/upload/channel/:channelID', upload.single('file'), async (req, res) => {
                Logger.info('uploading file');
                const file = req.file;
                if (!file) return res.status(400).json({ error: 'No file uploaded' });
                if(!req.params.channelID) return res.status(400).json({ error: 'No channelID provided' });

                if(!req.token) return res.status(400).json({ error: 'No token provided' });
                const token = req.token;

                const user = await DB.connection.collection('users').findOne({ token: token });
                if(!user) return res.status(400).json({ error: 'Invalid token' });

                const channelID = req.params.channelID

                // check if channel exists and if user is in it
                const channel = await DB.connection.collection('channels').findOne({ channel_id: channelID });
                if(!channel) return res.status(400).json({ error: 'Invalid channelID' });

                if(!channel.members.includes(user.user_id)) return res.status(400).json({ error: 'You are not in this channel' });

                // check file size
                const stats = fs.statSync(file.path);
                const fileSizeInBytes = stats.size;
                const fileSizeInMegabytes = fileSizeInBytes / 1000000.0; // 1MB = 1000000 bytes
                if(fileSizeInMegabytes > 50) return res.status(400).json({ error: 'File size is too big' });
                Logger.info(`/${req.params.channelID}/${(req as any).userID}/${file.filename}`);

                // const fileURL = `/${req.params.channelID}/${(req as any).userID}/${file.filename}`;
                const fileURL = `/uploads/channels/${req.params.channelID}/${file.filename}`;
                Logger.info(fileURL);
                res.json({ link: fileURL });
            });

            this.app.post('/upload/avatar/:userID', upload.single('file'), async (req, res) => { // for profile picture
                Logger.info('uploading profile picture');
                const file = req.file;
                if (!file) return res.status(400).json({ error: 'No file uploaded' });
                if(!req.params.userID) return res.status(400).json({ error: 'No userID provided' });

                if(!req.token) return res.status(400).json({ error: 'No token provided' });
                const token = req.token;

                Logger.info(token);
                const user = await DB.connection.collection('users').findOne({ token: token });
                if(!user) return res.status(400).json({ error: 'Invalid token' });
                
                const userID = req.params.userID
                if(user.user_id.toString() !== userID) return res.status(400).json({ error: 'Invalid userID' });

                // check file size
                const stats = fs.statSync(file.path);
                const fileSizeInBytes = stats.size;
                const fileSizeInMegabytes = fileSizeInBytes / 1000000.0; // 1MB = 1000000 bytes
                if(fileSizeInMegabytes > 50) return res.status(400).json({ error: 'File size is too big' });
                
                // set avatar in database
                await DB.connection.collection('users').updateOne({ user_id: user.user_id }, { $set: { avatar: `/${userID}/${file.filename}` } });

                Logger.info(`/${userID}/${file.filename}`);
                const fileURL = `/profile/${userID}/${file.filename}`;
                Logger.info(fileURL);
                res.json({ link: fileURL });
            });

            this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });

            this.app.use(express.static('uploads'));
            this.app.use(express.static('uploads/avatars'));
            this.app.use(express.static('uploads/channels'));
        })
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            Logger.success(`Server listening on port ${this.port}`);
            process.env.APP_PORT ? null : Logger.warn(`The port hasn't been specified in the .env file, using the default port (3000)`);
        });
    }
}