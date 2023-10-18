import mongoose from "mongoose";

export default () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect("mongodb://127.0.0.1:27017/insurance", {})
    .then(() => {
      return console.info(`MongoDB connected.`);
    })
    .catch((error) => {
      console.error("Error connecting to database: ", error);
      return process.exit(1);
    });
};
