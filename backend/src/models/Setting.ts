import mongoose, { Schema } from "mongoose";
const SettingSchema: Schema = new Schema({
  duration: { type: Number, required: true, default: 10 },
  unit: { type: String, reqiured: true, default: "m" },
});

export default mongoose.model("setting", SettingSchema);
