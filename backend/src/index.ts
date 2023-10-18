import express from "express";
import middleware from "./middlewares";
import routes from "./routes";
import dbConnect from "./config/db";
// import { config } from "dotenv";

// config();

const app = express();

middleware(app);
routes(app);
dbConnect();

const port = 8000;

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
