function getSunscreenNeed(uvIndex) {
    return 1 / (1 + 2 ** (-uvIndex + 3));
}
function getUmbrellaNeed(hourlyData) {
    let firstHourIndex;
    let highestRainIntensity = 0;
    // Get comparable time
    const today = new Date();
    today.setMinutes(0, 0, 0);
    let todayString = today.toISOString();
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
    console.log(now);
    const hoursNeeded = 18 - now;
    for (let i = firstHourIndex; i < hoursNeeded + firstHourIndex + 1; i++) {
        if (hourlyData[i].values.rainIntensity > highestRainIntensity) {
            highestRainIntensity = hourlyData[i].values.rainIntensity;
        }
    }
    // console.log("Highest rain intensity:", highestRainIntensity);
    return 1 / (1 + 2 ** (-highestRainIntensity + 2));
}
function getOutfit(temperature) {
    return 1 / (1 + 1.123 ** (-temperature + 8.833));
}
function getOutdoorActivities(hourlyData) {
    let firstHourIndex;
    const today = new Date();
    today.setMinutes(0, 0, 0);
    let todayString = today.toISOString();
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
    let rainIntensitiesSum = 0;
    for (let i = firstHourIndex; i < 17 + firstHourIndex; i++) {
        rainIntensitiesSum += hourlyData[i].values.rainIntensity;
    }
    const rainIntensity = rainIntensitiesSum / 16;
    // console.log(rainIntensity);
    return 1 / (1 + 100 ** (rainIntensity - 0.2));
}
export { getSunscreenNeed, getUmbrellaNeed, getOutfit, getOutdoorActivities };
//# sourceMappingURL=functions.js.map