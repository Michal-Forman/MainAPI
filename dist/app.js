// Library imports
import express from "express";
import cors from "cors";
// Custom imports
import smartWeatherRouter from "./routes/smartWeather/router.js";
const app = express();
const port = process.env.PORT || 3000;
// Enable CORS
app.use(cors());
app.use(express.json());
app.use("/api/smart-weather", smartWeatherRouter);
app.listen(port, () => {
    console.log(`Example app listening at port: ${port}`);
});
//# sourceMappingURL=app.js.map