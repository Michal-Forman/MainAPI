// Library imports
import express from "express";
// Custom imports
import { verifyToken } from "../../middlewares/smartDietTracker/middlewares.js";
import {
  createUser,
  loginUser,
  logFood,
  getTodaysFood,
} from "../../controllers/smartDietTracker/controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/food", verifyToken, logFood);
router.get("/food", verifyToken, getTodaysFood);

export default router;
