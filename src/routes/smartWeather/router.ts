import express from "express";
import {
  getData,
  getTestingData,
} from "../../controllers/smartWeather/controller.js";

const router = express.Router();

router.get("/production/:coords", getData);
router.get("/testing/:coords?", getTestingData);

export default router;
