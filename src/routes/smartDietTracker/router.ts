// Library imports
import express from "express";
// Custom imports
import { getTestingData } from "../../controllers/smartDietTracker/controller.js";
import { createUser } from "../../controllers/smartDietTracker/controller.js";

const router = express.Router();

router.get("/testing", getTestingData);
router.post("/register", createUser);

export default router;
