import express from "express";
import middleware from "./middlewares";
import routes from "./routes";
import dbConnect from "./config/db";
import { warningScrap } from "./services/scrapper";
import http from "http";
import socket from "./services/socket";

const app = express();

middleware(app);
routes(app);
dbConnect();

const httpServer = new http.Server(app);

socket.init(httpServer);

warningScrap(socket);

const port = 8001;
httpServer.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
