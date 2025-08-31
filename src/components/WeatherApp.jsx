import React, { useState } from "react";
import searchIcon from "../assets/search.png";
import clearIcon from "../assets/clear.png";
import cloudIcon from "../assets/cloud.png";
import drizzleIcon from "../assets/drizzle.png";
import rainIcon from "../assets/rain.png";
import snowIcon from "../assets/snow.png";
import windIcon from "../assets/wind.png";
import humidityIcon from "../assets/humidity.png";

function WeatherApp() {
  const [wicon, setWicon] = useState(cloudIcon);

  const search = async () => {
    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return 0;
    }

    const cityName = element[0].value;
    const apiKey = "";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName
    )}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const humidity = document.getElementsByClassName("humidity-percent");
      const wind = document.getElementsByClassName("wind-rate");
      const temperature = document.getElementsByClassName("weather-temp");
      const location = document.getElementsByClassName("weather-location");

      humidity[0].innerHTML = `${data.main.humidity} %`;
      wind[0].innerHTML = `${Math.floor(data.wind.speed)} km/h`;
      temperature[0].innerHTML = `${Math.floor(data.main.temp)} °C`;
      location[0].innerHTML = data.name;

      if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
        setWicon(clearIcon);
      } else if (
        data.weather[0].icon === "02d" ||
        data.weather[0].icon === "02n"
      ) {
        setWicon(cloudIcon);
      } else if (
        data.weather[0].icon === "03d" ||
        data.weather[0].icon === "03d"
      ) {
        setWicon(drizzleIcon);
      } else if (
        data.weather[0].icon === "04d" ||
        data.weather[0].icon === "04n"
      ) {
        setWicon(drizzleIcon);
      } else if (
        data.weather[0].icon === "09d" ||
        data.weather[0].icon === "09n"
      ) {
        setWicon(rainIcon);
      } else if (
        data.weather[0].icon === "10d" ||
        data.weather[0].icon === "10n"
      ) {
        setWicon(rainIcon);
      } else if (
        data.weather[0].icon === "13d" ||
        data.weather[0].icon === "13n"
      ) {
        setWicon(snowIcon);
      } else {
        setWicon(clearIcon);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données météorologiques:",
        error
      );
    }
    return false;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <div className="container">
      <div className="int-container">
        <div className="top-bar">
          <input
            type="text"
            className="cityInput"
            placeholder="Votre ville on Radio World"
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="search-icon"
            onClick={() => {
              search();
            }}
          >
            <img src={searchIcon} alt="" />
          </button>
        </div>
        <div className="weather-image">
          <img src={wicon} alt="" />
        </div>
        <div className="weather-temp">...°</div>
        <div className="weather-location">Indiquer votre ville</div>
        <div className="data-container">
          <div className="element">
            <img className="icon" src={humidityIcon} alt="" />
            <div className="data">
              <div className="humidity-percent">...%</div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={windIcon} alt="" className="icon" />
            <div className="data">
              <div className="wind-rate">... km/h</div>
              <div className="text">Wind speed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
