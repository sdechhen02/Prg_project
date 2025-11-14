import Activity from "../models/Activity.js";

// CREATE activity
export const createActivity = async (req, res) => {
  try {
    const activity = new Activity({ ...req.body, user: req.user._id });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all activities for user
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE an activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE an activity
export const deleteActivity = async (req, res) => {
  try {
    await Activity.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
