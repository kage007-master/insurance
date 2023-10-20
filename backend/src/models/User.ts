import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true, default: "customer" },
  password: { type: String, required: true },
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  balance: { type: Number, default: 0 },
  coverages: { type: [String], default: [] },
  claims: { type: [String], default: [] },
});

export default mongoose.model("user", UserSchema);
