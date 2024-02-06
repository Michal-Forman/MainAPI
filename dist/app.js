// Library imports
import express from "express";
import cors from "cors";
// Custom imports
import smartWeatherRouter from "./routes/smartWeather/router.js";
import connectSmartDietTrackerDB from "./config/smartDietTracker/database.js";
import smartDietTrackerRouter from "./routes/smartDietTracker/router.js";
// Database connections
connectSmartDietTrackerDB();
const app = express();
const port = process.env.PORT || 3000;
// Enable CORS
app.use(cors());
app.use(express.json());
app.use("/api/smart-weather", smartWeatherRouter);
app.use("/api/smart-diet-tracker", smartDietTrackerRouter);
app.listen(port, () => {
    console.log(`Example app listening at port: ${port}`);
});
//# sourceMappingURL=app.js.map