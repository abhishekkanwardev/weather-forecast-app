import React from "react";
import { useNavigate } from "react-router-dom";

const NoDataFound = ({ reloadBtn = true }) => {
  const navigate = useNavigate();
  return (
    <div className="no-data-found">
      <div>
        <p>Sorry, we couldn't find any weather information.</p>{" "}
      </div>
      <div>
        {reloadBtn ? (
          <button onClick={() => window.location.reload()}>Reload</button>
        ) : (
          <button onClick={() => navigate(`/`)}>Go Back</button>
        )}
      </div>
    </div>
  );
};

export default NoDataFound;
