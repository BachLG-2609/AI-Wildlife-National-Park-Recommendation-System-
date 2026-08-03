import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  updatePreferences,
  getRecommendations,
} from "../controllers/userController.js";

const router = Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/preferences", protect, updatePreferences);
router.get("/recommendations", protect, getRecommendations);

export default router;