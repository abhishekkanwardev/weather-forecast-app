const wetherAppAPIkey = process.env.REACT_APP_API_KEY;
export const baseURL = `${process.env.REACT_APP_WEATHER_API_URL}?key=${wetherAppAPIkey}`;
export const historyBaseURL = `${process.env.REACT_APP_WEATHER_HISTORY_API_URL}?key=${wetherAppAPIkey}`;
