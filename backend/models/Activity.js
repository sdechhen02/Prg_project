import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: String,
  calories: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
