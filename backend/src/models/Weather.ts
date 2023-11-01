import mongoose, { Schema } from "mongoose";

const WeatherSchema: Schema = new Schema({
  url: { type: String },
  fake: { type: String },
});

export default mongoose.model("weather", WeatherSchema);
