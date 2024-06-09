import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${data.city}&key=${apiKey}&units=metric`;
      
      try {
        const response = await axios.get(url);
        setForecastData(response.data.daily);
      } catch (error) {
        console.log("Error fetching forecast data:", error);
      }
    };
    fetchForecastData();
  }, [data.city]);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  const renderTemperature = (temperature) => {
    return isCelsius ? Math.round(temperature) : convertToFahrenheit(temperature);
  };

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>
      <div className="temp">
        {renderTemperature(data.temperature.current)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData.slice(0, 5).map((day) => (
            <div className="day" key={day.time}>
              <p className="day-name">{formatDay(day.time)}</p>
              <img
                className="day-icon"
                src={day.condition.icon_url}
                alt={day.condition.description}
              />
              <p className="day-temperature">
                {Math.round(day.temperature.minimum)}° / {Math.round(day.temperature.maximum)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
