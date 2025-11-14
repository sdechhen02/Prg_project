import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  getMeals, 
  addMeal, 
  updateMeal, 
  deleteMeal, 
  getWaterLogs, 
  logWater 
} from "../controllers/dietController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ---------- MEALS ----------
router.get("/meals", getMeals);
router.post("/meals", addMeal);
router.put("/meals/:id", updateMeal);
router.delete("/meals/:id", deleteMeal);

// ---------- WATER ----------
router.get("/water", getWaterLogs);
router.post("/water", logWater);

export default router;
