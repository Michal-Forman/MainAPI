import express from "express";
import { getData } from "../../controllers/smartWeather/controller.js";

const router = express.Router();

router.get("/:cords", getData);

export default router;
