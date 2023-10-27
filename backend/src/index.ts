import express from "express";
import middleware from "./middlewares";
import routes from "./routes";
import dbConnect from "./config/db";
import { warningScrap } from "./services/scrapper";
import Interactor from "./services/interactor";
// import { config } from "dotenv";

// config();

const app = express();

middleware(app);
routes(app);
dbConnect();

warningScrap();

const port = 8001;

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
