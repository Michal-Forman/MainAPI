// Library imports
import "dotenv/config";
import { Request, Response } from "express";

// Custom imports
import {
  WeatherData,
  TestingWeatherData,
} from "../../interfaces/smartWeather/interfaces.js";
import {
  getUmbrellaNeed,
  getSunscreenNeed,
  getOutdoorActivities,
  getOutfit,
} from "./functions.js";

export const getData = (req: Request, res: Response) => {
  const coords = req.params.coords;
  // console.log(coords);
  const link = `https://api.tomorrow.io/v4/weather/forecast?location=${coords}&apikey=${process.env.TOMORROW_API_KEY}`;
  fetch(link)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let weatherData: WeatherData = {
        umbrellaNeed: undefined,
        sunscreenNeed: undefined,
        outdoorActivities: undefined,
        outfit: undefined,
      };

      // Umbrella
      let umbrellaNeed = getUmbrellaNeed(data.timelines.hourly);
      weatherData.umbrellaNeed = umbrellaNeed;

      // Sunscreen
      let sunscreenNeed = getSunscreenNeed(
        data.timelines.daily[0].values.uvIndexMax,
      );
      weatherData.sunscreenNeed = sunscreenNeed;

      // Outfit
      let outfit = getOutfit(
        data.timelines.daily[0].values.temperatureApparentAvg,
      );
      weatherData.outfit = outfit;

      // Outdoor
      let outdoorActivities = getOutdoorActivities(data.timelines.hourly);
      weatherData.outdoorActivities = outdoorActivities;

      res.send(weatherData);
    })
    .catch((error) => {
      // Handle errors
      console.error("Fetch error:", error);
    });
};

export const getTestingData = (req: Request, res: Response) => {
  const defaultCoords = "undefined";
  const coords = req.params.coords || defaultCoords;

  const weatherData: TestingWeatherData = {
    umbrellaNeed: 0.2,
    sunscreenNeed: 0.4,
    outdoorActivities: 0.6,
    outfit: 0.8,
    coords: coords,
  };
  res.send(weatherData);
};
