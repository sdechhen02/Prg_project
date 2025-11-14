import mongoose from "mongoose";

const dietSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealName: { type: String },
  calories: { type: Number },
  amount: { type: Number }, // for water in ml
  type: { type: String, enum: ["meal", "water"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Diet", dietSchema);
