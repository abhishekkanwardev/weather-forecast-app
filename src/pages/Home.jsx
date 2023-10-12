import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, historyBaseURL } from "../config/APIConfig";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import Loader from "../component/Loader";
import NoDataFound from "../component/NoDataFound";
import HourlyForecast from "../component/HourlyForecast";

const Home = () => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [forecastData, setforecastData] = useState([]);
  const [todaysforecast, setTodaysforecast] = useState({});
  const [hourlyForcastData, setHourlyForcastData] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [noDataFound, setNoDataFound] = useState(false);
  const [showHourlyData, setShowHourlyData] = useState(false);
  const [dateValue, setDateValue] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (lat && long) {
      getCurrentWether();
    }
  }, [lat, long]);

  const getDetailsOFSelectedDate = (date) => {
    navigate(`/detailed-forecast/${date}`);
  };

  const getCurrentWether = () => {
    axios
      .get(`${baseURL}&q=${lat},${long}&days=7&aqi=no&alerts=no`)
      .then((res) => {
        setLoader(false);
        setforecastData(res.data);
        setTodaysforecast(res.data?.current);
        setShowHourlyData(false);
        const currentDate = moment(res.data?.current.last_updated).format(
          "YYYY-MM-DD"
        );
        setDateValue(currentDate);
      })
      .catch((err) => {
        setNoDataFound(true);
        setLoader(false);
      });
  };

  const handleForecastOnDate = (e) => {
    let dateValue = e.target.value;
    setDateValue(dateValue);
    dateValue = moment(dateValue, "YYYY-MM-DD").format("YYYY/MM/DD");
    axios
      .get(`${historyBaseURL}&q=${lat},${long}&dt=${dateValue}`)
      .then((res) => {
        const threeHourForecast = [];
        const tempForcastData = res.data.forecast.forecastday[0].hour;
        setforecastData(res.data.forecast.forecastday[0]);
        for (let i = 0; i < tempForcastData.length; i += 4) {
          threeHourForecast.push(tempForcastData[i]);
        }
        setHourlyForcastData([
          ...threeHourForecast,
          tempForcastData[tempForcastData.length - 1],
        ]);
        setShowHourlyData(true);
      })
      .catch((error) => {
        setNoDataFound(true);
      });
  };

  return (
    <>
      {!loader ? (
        <main>
          {noDataFound ? (
            <NoDataFound />
          ) : (
            <>
              <div className="latest_weather">
                <div className="wrapper">
                  <div className="text-center mb-4">
                    <input
                      type="date"
                      className="weather-date-field"
                      onChange={handleForecastOnDate}
                      value={dateValue}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {showHourlyData && (
                      <button
                        className="weather-current-btn"
                        onClick={getCurrentWether}
                      >
                        Current Wether
                      </button>
                    )}
                  </div>
                  <div className="Topheader">
                    <div className="inner_wrap">
                      <img
                        src={
                          !showHourlyData
                            ? todaysforecast.condition?.icon
                            : forecastData?.day?.condition?.icon
                        }
                        alt={
                          !showHourlyData
                            ? todaysforecast.condition?.text
                            : forecastData?.day?.condition?.text
                        }
                      />
                      <div>
                        <h2>
                          {!showHourlyData
                            ? todaysforecast.condition?.text
                            : forecastData?.day?.condition?.text}
                        </h2>
                        <div className="dayfore-header">
                          <span>
                            {moment(
                              !showHourlyData
                                ? todaysforecast.last_updated
                                : forecastData.date,
                              "YYYY-MM-DD HH:mm"
                            ).format("dddd")}
                          </span>
                          <span>
                            {moment(
                              !showHourlyData
                                ? todaysforecast.last_updated
                                : forecastData.date,
                              "YYYY-MM-DD HH:mm"
                            ).format("h:mm A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul>
                    <li>
                      <b>Temp. Celsius</b>{" "}
                      {Math.round(
                        !showHourlyData
                          ? todaysforecast.temp_c
                          : forecastData?.day?.avgtemp_c
                      )}{" "}
                      ° C
                    </li>
                    <li>
                      <b>Temp. Fahrenheit</b>{" "}
                      {Math.round(
                        !showHourlyData
                          ? todaysforecast.temp_f
                          : forecastData?.day?.avgtemp_f
                      )}{" "}
                      ° F
                    </li>
                    <li>
                      <b>Humidity</b>{" "}
                      {!showHourlyData
                        ? todaysforecast.humidity
                        : forecastData?.day?.avghumidity}
                      %
                    </li>
                    <li>
                      <b>Wind</b>{" "}
                      {!showHourlyData
                        ? todaysforecast.wind_mph
                        : forecastData?.day?.maxwind_mph}
                      mph
                    </li>
                  </ul>
                </div>
              </div>
              {showHourlyData ? (
                <HourlyForecast
                  forecastData={forecastData}
                  hourlyForcastData={hourlyForcastData}
                />
              ) : (
                <div className="restForecast">
                  <div className="wrapper">
                    <h6 className="top-title">
                      <span>Upcoming Seven Days Forecast</span>
                    </h6>
                    <ul className="forecast-list">
                      {forecastData?.forecast?.forecastday?.length > 0 &&
                        forecastData?.forecast?.forecastday.map(
                          (forecast, index) => (
                            <li key={index}>
                              <div
                                onClick={() =>
                                  getDetailsOFSelectedDate(forecast.date)
                                }
                              >
                                <div className="weekDays">
                                  {new Date(forecast.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                    }
                                  )}
                                </div>
                                <div className="img-weather">
                                  <img
                                    src={forecast.day.condition?.icon}
                                    alt={forecast.day.condition?.text}
                                  />
                                  <div className="weather-tooltip">
                                    <span>{forecast.day.condition?.text}</span>
                                  </div>
                                </div>
                                <div className="temp">
                                  {forecast.day.avgtemp_c}° C
                                </div>
                              </div>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Home;
