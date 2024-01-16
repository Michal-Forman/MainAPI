import { HourlyData } from "../../interfaces/smartWeather/interfaces.js";

function getSunscreenNeed(uvIndex: number): number {
  return 1 / (1 + 2 ** (-uvIndex + 3));
}

function getUmbrellaNeed(hourlyData: HourlyData[]): number {
  let firstHourIndex: number | undefined;
  let highestRainIntensity = 0;

  // Get comparable time
  const today: Date = new Date();
  today.setMinutes(0, 0, 0);
  let todayString: string = today.toISOString();
  todayString = todayString.replace(/\.\d{3}/, "");

  // Find this hour in hourly data
  hourlyData.forEach((hour, index) => {
    if (hour.time === todayString) {
      firstHourIndex = index;
    }
  });
  if (firstHourIndex === undefined) {
    throw new Error("Could not find first hour index");
  }
  const now = new Date().getUTCHours() + 1;
  const hoursNeeded = 18 - now;
  for (
    let i: number = firstHourIndex;
    i < hoursNeeded + firstHourIndex + 1;
    i++
  ) {
    if (hourlyData[i].values.rainIntensity > highestRainIntensity) {
      highestRainIntensity = hourlyData[i].values.rainIntensity;
    }
  }

  // console.log("Highest rain intensity:", highestRainIntensity);
  return 1 / (1 + 2 ** (-highestRainIntensity + 2));
}

function getOutfit(temperature: number): number {
  return 1 / (1 + 1.123 ** (-temperature + 8.833));
}

function getOutdoorActivities(hourlyData: HourlyData[]): number {
  let firstHourIndex: number | undefined;
  const today: Date = new Date();
  today.setMinutes(0, 0, 0);
  let todayString: string = today.toISOString();
  todayString = todayString.replace(/\.\d{3}/, "");

  // Find this hour in hourly data
  hourlyData.forEach((hour, index) => {
    if (hour.time === todayString) {
      firstHourIndex = index;
    }
  });
  if (firstHourIndex === undefined) {
    throw new Error("Could not find first hour index");
  }
  // get the average rain intensity for the next 16 hours
  let rainIntensitiesSum: number = 0;
  for (let i = firstHourIndex; i < 17 + firstHourIndex; i++) {
    rainIntensitiesSum += hourlyData[i].values.rainIntensity;
  }
  const rainIntensity: number = rainIntensitiesSum / 16;

  // console.log(rainIntensity);
  return 1 / (1 + 100 ** (rainIntensity - 0.2));
}

export { getSunscreenNeed, getUmbrellaNeed, getOutfit, getOutdoorActivities };
