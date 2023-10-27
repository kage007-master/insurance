import mongoose, { Schema } from "mongoose";

const transactionSchema: Schema = new Schema({
  clientID: { type: String, required: true },
  type: { type: String, required: true, default: "Premium Paid" },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

export default mongoose.model("transaction_history", transactionSchema);
