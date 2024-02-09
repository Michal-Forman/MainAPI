// Library imports
import express from "express";
// Custom imports
import {
  createUser,
  loginUser,
} from "../../controllers/smartDietTracker/controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

export default router;
