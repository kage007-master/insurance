import mongoose, { Schema } from "mongoose";

const NotificationSchema: Schema = new Schema({
  clientID: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  read: { type: String, required: true, default: false },
});

export default mongoose.model("notification", NotificationSchema);
