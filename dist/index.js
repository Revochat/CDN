"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
const dotenv_1 = __importDefault(require("dotenv"));
// import axios from 'axios';
// import FormData from 'form-data';
// import fs from 'fs';
// import path from 'path';
dotenv_1.default.config();
const port = Number(process.env.APP_PORT) || 3000;
const server = new src_1.RouteServer(port, './uploads');
server.listen();
// class FileUploadClient {
//     private serverUrl: string;
//     private token: string;
//     constructor(serverUrl: string, token: string) {
//         this.serverUrl = serverUrl;
//         this.token = token;
//     }
//     public async uploadFile(channelId: string, filePath: string): Promise<void> {
//         const url = `${this.serverUrl}/upload/${channelId}`;
//         const formData = new FormData();
//         const fileStream = fs.createReadStream(filePath);
//         formData.append('file', fileStream, path.basename(filePath));
//         try {
//             const response = await axios.post(url, formData, {
//                 headers: {
//                     ...formData.getHeaders(),
//                     'Authorization': `Bearer ${this.token}`
//                 }
//             });
//             console.log('File uploaded successfully:', response.data);
//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     }
// }
// // Usage example:
// setTimeout(() => {
//     const client = new FileUploadClient('http://localhost:4000', 'F10E0584D4955A93AB36C0B5C5B363021702227938667');
//     const channelId = '1703084544390';
//     const filePath = 'tsconfig.json';
//     client.uploadFile(channelId, filePath)
//         .then(() => console.log('Upload complete.'))
//         .catch(error => console.error('Upload failed:', error));
// })
