import { RouteServer } from "./src";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.APP_PORT) || 3000;

const server = new RouteServer(port, './uploads');

server.listen();