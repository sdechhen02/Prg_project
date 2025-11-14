import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutType: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Workout", workoutSchema);
