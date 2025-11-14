import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import activityRoutes from "./routes/activityRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// API routes
app.use("/api/activities", activityRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
