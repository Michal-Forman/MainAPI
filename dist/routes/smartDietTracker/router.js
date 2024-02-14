// Library imports
import express from "express";
// Custom imports
import { verifyToken } from "../../middlewares/smartDietTracker/middlewares.js";
import { createUser, loginUser, logFood, getTodaysFood, getAllFood, deleteFood, } from "../../controllers/smartDietTracker/controller.js";
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/food", verifyToken, logFood);
router.get("/food", verifyToken, getAllFood);
router.delete("/food/:id", verifyToken, deleteFood);
router.get("/todays-food", verifyToken, getTodaysFood);
export default router;
//# sourceMappingURL=router.js.map