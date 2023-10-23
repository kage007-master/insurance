import mongoose, { Schema } from "mongoose";

const CoverageSchema: Schema = new Schema({
  coverageID: { type: String, required: true },
  clientID: { type: String, required: true },
  subscription_date: { type: Date, required: true, default: new Date() },
  expire_date: { type: Date, required: true },
  paid_amount: { type: Number, require: true },
});

export default mongoose.model("coverage_history", CoverageSchema);
