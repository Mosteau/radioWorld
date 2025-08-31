import React, { useState } from "react";
import Clock from "./Clock";
import WeatherApp from "./WeatherApp";

function Footer() {
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);

  const toggleWeatherPopup = () => {
    setShowWeatherPopup(!showWeatherPopup);
  };

  return (
    <div className="footer">
      <Clock />
      <button
        type="button"
        className="open-button"
        onClick={toggleWeatherPopup}
      >
        Voir la météo ☀️
      </button>
      {showWeatherPopup && (
        <div className="weather-popup-overlay">
          <div className="weather-popup">
            <button
              type="button"
              className="close-button"
              onClick={toggleWeatherPopup}
            >
              Fermer
            </button>
            <WeatherApp />
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
