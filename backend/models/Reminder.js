import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["goal", "workout", "meal", "water"], required: true },
  time: { type: Date, required: true },
});

export default mongoose.model("Reminder", reminderSchema);
