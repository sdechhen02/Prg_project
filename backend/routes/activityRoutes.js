import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../controllers/activityController.js";

const router = express.Router();

router.use(protect);

router.get("/", getActivities);
router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
