import { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";
import smartWeatherRouter from "../../routes/smartWeather/router.js";
import smartDietTrackerRouter from "../../routes/smartDietTracker/router.js";
import mainRouter from "../../routes/main/router.js";

export const getLobby = (req: Request, res: Response) => {
  const mainEndpoints = listEndpoints(mainRouter);
  const smartWeatherEndpoints = listEndpoints(smartWeatherRouter);
  const smartDietTrackerEndpoints = listEndpoints(smartDietTrackerRouter);
  let answer: any = [];
  console.log(mainEndpoints);
  console.log(smartWeatherEndpoints);
  console.log(smartDietTrackerEndpoints);

  // Create final objects
  mainEndpoints.forEach((endpoint: any) => {
    const { path, methods } = endpoint;
    answer.push({ path, methods });
  });

  smartWeatherEndpoints.forEach((endpoint: any) => {
    let { path, methods } = endpoint;
    path = `/api/smart-weater${path}`;
    answer.push({ path, methods });
  });

  smartDietTrackerEndpoints.forEach((endpoint: any) => {
    let { path, methods } = endpoint;
    path = `/api/smart-diet-tracker${path}`;
    answer.push({ path, methods });
  });

  res.send(answer);
};
