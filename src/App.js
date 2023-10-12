import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SingleDayForecast from "./pages/singleDayForecast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detailed-forecast/:date" element={<SingleDayForecast />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
