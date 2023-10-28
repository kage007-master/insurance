import mongoose, { Schema } from "mongoose";

const ClaimSchema: Schema = new Schema({
  weather: { type: String, required: true },
  weatherEventID: { type: String, required: true },
  clientID: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, default: "Pending" },
  validatorID: { type: String },
  detail: { type: String },
  file: { type: String, default: "" },
  confirmed: { type: Boolean, required: true, default: false },
  schedule: { type: Date },
});

export default mongoose.model("claim", ClaimSchema);
