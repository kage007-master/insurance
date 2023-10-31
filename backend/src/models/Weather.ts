import mongoose, { Schema } from "mongoose";

const WeatherSchema: Schema = new Schema({
  url: { type: String },
});

export default mongoose.model("weather", WeatherSchema);
