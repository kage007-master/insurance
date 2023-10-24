import mongoose, { Schema } from "mongoose";

const WeatherSchema: Schema = new Schema({
  weather: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: Date, required: true, default: new Date() },
  url: { type: String },
  status: { type: String, required: true, default: "Active" },
  raised_claims: { type: Number, required: true, default: 0 },
  confirmed_damage: { type: Number, required: true, default: 0 },
});

export default mongoose.model("weather", WeatherSchema);
