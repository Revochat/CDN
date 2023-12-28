import express from 'express';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from "fs"
import path from "path"

const app = express();
const port = 3000;

const uploadFolder = './uploads';

const channelID = "4ga54az544ha54a1zf465g4a"

if (!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder);
}

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const date = Date.now()
        const channelPath = `${uploadFolder}/${channelID}`
        const finalPath = `${uploadFolder}/${channelID}/${date}`
        if(!fs.existsSync(channelPath)) {
            fs.mkdirSync(channelPath);
        }
        if(!fs.existsSync(finalPath)) {
            fs.mkdirSync(finalPath);
        }
        cb(null, finalPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage});

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({error: 'No file uploaded'});
    }




    res.json({data: 'File uploaded successfully'});
});

app.use((err: Error, req: Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
        res.status(400).json({error: err.message});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
