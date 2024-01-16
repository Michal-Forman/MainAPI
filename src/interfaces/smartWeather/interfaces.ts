export interface HourlyData {
  time: string;
  values: {
    temperature: number;
    rainIntensity: number;
  };
}

export interface WeatherData {
  umbrellaNeed: number | undefined;
  sunscreenNeed: number | undefined;
  outdoorActivities: number | undefined;
  outfit: number | undefined;
}
