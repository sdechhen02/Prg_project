import Reminder from "../models/Reminder.js";

export const createReminder = async (req, res) => {
  const reminder = new Reminder({ ...req.body, user: req.user._id });
  await reminder.save();
  res.status(201).json(reminder);
};

export const getReminders = async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id });
  res.json(reminders);
};

export const updateReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(reminder);
};

export const deleteReminder = async (req, res) => {
  await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Deleted" });
};
