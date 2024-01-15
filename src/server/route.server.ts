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
                destination: (req, file, cb) => {
                    const channelID = req.params.channelID;
                    const date = Date.now();
                    const channelPath = path.join(this.uploadFolder, channelID);
                    const finalPath = path.join(channelPath, date.toString());
                    if (!fs.existsSync(channelPath)) {
                        fs.mkdirSync(channelPath);
                    }
                    if (!fs.existsSync(finalPath)) {
                        fs.mkdirSync(finalPath);
                    }
                    cb(null, finalPath);
                },
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                }
            });

            const upload = multer({ storage: storage });

            this.app.post('/upload/:channelID', upload.single('file'), async (req, res) => {
                const file = req.file;
                if (!file) return res.status(400).json({ error: 'No file uploaded' });
                if(!req.params.channelID) return res.status(400).json({ error: 'No channelID provided' });

                if(!req.token) return res.status(400).json({ error: 'No token provided' });
                const token = req.token;

                const user = await DB.connection.collection('users').findOne({ token: token });
                if(!user) return res.status(400).json({ error: 'Invalid token' });

                const channelID = new ObjectId(req.params.channelID);
                const channel = await DB.connection.collection('channels').findOne({ _id: channelID });

                if(!channel) return res.status(400).json({ error: 'Invalid channelID' });

                if(!channel.members.includes(user.username)) return res.status(400).json({ error: 'You are not in this channel' });

                res.json({ data: 'File uploaded successfully' });
            });

            this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                }
            });

            this.app.use(express.static('uploads'));
        })
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            Logger.success(`Server listening on port ${this.port}`);
            process.env.PORT ? null : Logger.warn(`The port hasn't been specified in the .env file, using the default port (3000)`);
        });
    }
}
