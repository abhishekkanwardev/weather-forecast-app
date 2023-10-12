import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../config/APIConfig";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import Loader from "../component/Loader";
import NoDataFound from "../component/NoDataFound";
import backIcon from "../goBack.png";
import HourlyForecast from "../component/HourlyForecast";

const SingleDayForecast = () => {
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [forecastData, setforecastData] = useState([]);
  const [hourlyForcastData, setHourlyForcastData] = useState([]);
  const { date } = useParams();
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
        .get(`${baseURL}&q=${lat},${long}&&dt=${date}`)
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
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          setNoDataFound(true);
        });
    }
  }, [lat, long]);

  return (
    <>
      {!loader ? (
        <main>
          {noDataFound ? (
            <NoDataFound reloadBtn={false} />
          ) : (
            <>
              <div className="latest_weather">
                <Link to="/">
                  <img src={backIcon} className="backButton" />
                </Link>
                <div className="wrapper">
                  <div className="Topheader">
                    <div className="inner_wrap">
                      <img
                        src={forecastData?.day?.condition?.icon}
                        alt={forecastData?.day?.condition?.text}
                      />
                      <div>
                        <h2>{forecastData?.day?.condition?.text}</h2>
                        <div className="dayfore-header">
                          <span>
                            {moment(
                              forecastData.date,
                              "YYYY-MM-DD HH:mm"
                            ).format("dddd")}
                          </span>
                          <span>{forecastData.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul>
                    <li>
                      <b>Temp. Celsious</b>{" "}
                      {Math.round(forecastData?.day?.avgtemp_c)} ° C{" "}
                    </li>
                    <li>
                      <b>Temp. Fahrenheit</b>
                      {Math.round(forecastData?.day?.avgtemp_f)}
                    </li>
                    <li>
                      <b>Humidity</b> {forecastData?.day?.avghumidity}
                    </li>
                    <li>
                      <b>Wind</b> {forecastData?.day?.maxwind_mph}&nbsp;mph
                    </li>
                  </ul>
                </div>
              </div>
              <HourlyForecast
                forecastData={forecastData}
                hourlyForcastData={hourlyForcastData}
              />
            </>
          )}
        </main>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SingleDayForecast;
