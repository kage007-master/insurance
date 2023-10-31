import mongoose, { Schema } from "mongoose";

const CoverageSchema: Schema = new Schema({
  coverageID: { type: String, required: true },
  clientID: { type: String, required: true },
  subscription_date: { type: Date, required: true },
  expire_date: { type: Date, required: true },
  paid_amount: { type: Number, require: true },
  expired: { type: Boolean, required: true, default: false },
});

export default mongoose.model("coverage_history", CoverageSchema);
