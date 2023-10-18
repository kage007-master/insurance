import mongoose, { Schema } from "mongoose";

const CoverageSchema: Schema = new Schema({
  name: { type: String, required: true },
  weather: { type: String, required: true },
  premium: { type: Number, required: true },
  reimbursement: { type: Number, required: true },
  threshold: { type: Number, required: true },
});

export default mongoose.model("coverage", CoverageSchema);
