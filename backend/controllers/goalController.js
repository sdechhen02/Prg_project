import Goal from "../models/Goal.js";

// Create a new goal
export const createGoal = async (req, res) => {
  const goal = new Goal({ ...req.body, user: req.user?._id });
  await goal.save();
  res.status(201).json(goal);
};

// Get all goals
export const getGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.user?._id });
  res.json(goals);
};

// Update goal
export const updateGoal = async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user?._id },
    req.body,
    { new: true }
  );
  res.json(goal);
};

// Delete goal
export const deleteGoal = async (req, res) => {
  await Goal.findOneAndDelete({ _id: req.params.id, user: req.user?._id });
  res.json({ message: "Deleted" });
};

//Complete goal
// Mark goal as achieved
export const achieveGoal = async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.user?._id },
    { achieved: true },
    { new: true }
  );
  res.json(goal);
};
