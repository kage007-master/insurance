import mongoose, { Schema } from "mongoose";
import { PENDING } from "../config/const";

const ClaimSchema: Schema = new Schema({
  weather: { type: String, required: true },
  weatherEventID: { type: String, required: true },
  clientID: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, default: PENDING },
  validatorID: { type: String },
  validateTime: { type: Date },
  detail: { type: String },
  file: { type: String, default: "" },
  schedule: { type: Date },
});

export default mongoose.model("claim", ClaimSchema);
