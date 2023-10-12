import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config/APIConfig";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import Loader from "../component/Loader";
import NoDataFound from "../component/NoDataFound";

const Home = () => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [forecastData, setforecastData] = useState([]);
  const [todaysforecast, setTodaysforecast] = useState({});
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [noDataFound, setNoDataFound] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (lat && long) {
      axios
        .get(`${baseURL}&q=${lat},${long}&days=7&aqi=no&alerts=no`)
        .then((res) => {
          setLoader(false);
          setforecastData(res.data);
          setTodaysforecast(res.data?.current);
        })
        .catch((err) => {
          setNoDataFound(true);
          setLoader(false);
        });
    }
  }, [lat, long]);

  const getDetailsOFSelectedDate = (date) => {
    navigate(`/detailed-forecast/${date}`);
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
                  <div className="Topheader">
                    <div className="inner_wrap">
                      <img
                        src={todaysforecast.condition?.icon}
                        alt={todaysforecast.condition?.text}
                      />
                      <div>
                        <h2>{todaysforecast.condition?.text}</h2>
                        <div className="dayfore-header">
                          <span>
                            {moment(
                              todaysforecast.last_updated,
                              "YYYY-MM-DD HH:mm"
                            ).format("dddd")}
                          </span>
                          <span>
                            {moment(
                              todaysforecast.last_updated,
                              "YYYY-MM-DD HH:mm"
                            ).format("h:mm A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <b>Temp. Celsius</b> {Math.round(todaysforecast.temp_c)} °
                      C
                    </li>
                    <li>
                      <b>Temp. Fahrenheit</b>{" "}
                      {Math.round(todaysforecast.temp_f)} ° F
                    </li>
                    <li>
                      <b>Humidity</b> {todaysforecast.humidity}%
                    </li>
                    <li>
                      <b>Wind</b> {todaysforecast.wind_mph}mph
                    </li>
                  </ul>
                </div>
              </div>
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
