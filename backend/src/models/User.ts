import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true, default: "customer" },
  password: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.model("user", UserSchema);
