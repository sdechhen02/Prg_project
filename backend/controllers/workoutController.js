import Workout from "../models/Workout.js";

export const createWorkout = async (req, res) => {
  const workout = new Workout({ ...req.body, user: req.user._id });
  await workout.save();
  res.status(201).json(workout);
};

export const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id });
  res.json(workouts);
};

export const updateWorkout = async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(workout);
};

export const deleteWorkout = async (req, res) => {
  await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Deleted" });
};
