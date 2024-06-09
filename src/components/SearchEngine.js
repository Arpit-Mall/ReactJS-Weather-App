import React, { useState } from "react";
import axios from "axios";

function SearchEngine({ query, setQuery, search }) {

  const [isDisabled, setIsDisabled] = useState(false);
  const handleSearch = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      search();
    }
  };

  const getCoordinate = async () => {
    if (!isDisabled) {
      setIsDisabled(true);
      navigator.geolocation.getCurrentPosition((position) => {
        var config = {
          method: 'get',
          url: `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&apiKey=a1a6fdc7cd804974b9603ab0176504b4`,
          headers: {}
        };

        axios(config)
          .then(function (response) {
            const location = response.data.features[0].properties.state
            localStorage.setItem("lastLocation", location);
            const address = `${response.data.features[0].properties.address_line1},${response.data.features[0].properties.state}`
            setQuery(location);
            search(location);
          })
          .catch(function (error) {
            console.log(error);
          })
      });
    } else {
      setIsDisabled(false);
      setQuery("")
    }
  }

  return (
    <div className="SearchEngine">
      <input
        type="text"
        className="city-search"
        placeholder="Enter City Name"
        name="query"
        value={query || ""}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={handleSearch}
      />
      <button type="button" className="search-button" onClick={handleSearch}>
        <i className="fas fa-search" style={{ fontSize: "18px" }}></i>
      </button>
      <button type="button" className="location-button" onClick={getCoordinate}
        style={{
          backgroundColor: isDisabled ? 'blue' : 'grey',
          color: 'white',
        }}>
        <i className="fa fa-location-arrow" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default SearchEngine;
