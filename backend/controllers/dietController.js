import Diet from "../models/Diet.js";

// ---------------- MEALS ----------------
export const getMeals = async (req, res) => {
  try {
    const meals = await Diet.find({ user: req.user._id, type: "meal" });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMeal = async (req, res) => {
  try {
    const { mealName, calories } = req.body;
    const meal = new Diet({
      user: req.user._id,
      mealName,
      calories,
      type: "meal",
    });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const meal = await Diet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, type: "meal" },
      req.body,
      { new: true }
    );
    res.json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    await Diet.findOneAndDelete({ _id: req.params.id, user: req.user._id, type: "meal" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------- WATER ----------------
export const getWaterLogs = async (req, res) => {
  try {
    const waterLogs = await Diet.find({ user: req.user._id, type: "water" });
    res.json(waterLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logWater = async (req, res) => {
  try {
    const { amount } = req.body;
    const water = new Diet({
      user: req.user._id,
      amount,
      type: "water",
    });
    await water.save();
    res.status(201).json(water);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
