import moment from "moment";
import React from "react";

const HourlyForecast = ({ forecastData, hourlyForcastData }) => {
  return (
    <div className="restForecast">
      <div className="wrapper">
        <h6 className="top-title">
          <span>
            More On{" "}
            {new Date(forecastData.date).toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </span>
        </h6>
        <ul className="forecast-list">
          {hourlyForcastData.map((hours, index) => (
            <li key={index}>
              <div className="timezone">
                <div>
                  {" "}
                  {moment(hours.time, "YYYY-MM-DD HH:mm").format("hh:mm A")}
                </div>
              </div>
              <div className="img-weather">
                <img src={hours.condition?.icon} alt={hours.condition?.text} />
                <div className="weather-tooltip">
                  <span>{hours.condition?.text}</span>
                </div>
              </div>
              <div className="temp">{hours.temp_c}° C</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HourlyForecast;
