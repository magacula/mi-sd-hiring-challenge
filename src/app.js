// import { convertDate } from "./utils";
import cloudy from "../img/cloudy.png";
import rain from "../img/rain.png";
import snow from "../img/snow.png";
import sunny from "../img/sunny.png";

const form = document.querySelector("#search");
form.addEventListener("submit", onSubmit);

// handles form submit
async function onSubmit(e) {
  e.preventDefault();

  // retrieve zipcode
  let zip = form.elements[0].value;
  console.log(zip);

  // Sends GET request to get city, state, and lat & long values
  let getCoordinates = await getLocation(zip);

  //   let city = "San Francisco";
  //   let state = "CA";
  let city = getCoordinates.city;
  let state = getCoordinates.regionCode;
  let lat = getCoordinates.latitude;
  let long = getCoordinates.longitude;

  let weather = await getWeather(lat, long);

  renderForecast(city, state, weather);
}

// handles API call to get geolocation via Geolocation API
async function getLocation(zip) {
  try {
    let geoURL = `https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zip}`;
    let res = await fetch(geoURL);
    let data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// handle API call to get forecast via Forecast API
// takes lat & long values as params
async function getWeather(lat, long) {
  const today = new Date();

  // converts date into format: MM/DD/YEAR
  const date = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;
  console.log(date);

  try {
    let weatherURL = `https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${lat}&longitude=-${long}&date=${date}`;
    let res = await fetch(weatherURL);
    let data = await res.json();
    console.log(data);

    return data.daily.data;
  } catch (error) {
    console.log(error);
  }
}

// renders out weather forecast UI to DOM
function renderForecast(city, state, weather) {
  const cityForecast = document.querySelector("#city");
  // display heading for forecast of city, state
  cityForecast.innerHTML = `<h2>WEATHER FORECAST FOR ${city.toUpperCase()}, ${state}.</h2>`;

  const date = ["Today", "Tomorrow", "Day After Tomorrow"];

  // constructs forecast items. Iterate only three times since we need to display 3-day forecast
  for (let i = 0; i < weather.length - 2; i++) {
    // creates a forecast item for each day
    let li = document.createElement("li");

    li.innerHTML = `
    <h3 id="date">${date[i]}</h3>
    <div id="weatherInfo">
      <div>
      <img src="${date[i].icon}" alt="" />
      </div>
      <div>
        <p>${weather[i].icon}</p>
        <p><span style='font-weight:bold'>${Math.round(
          weather[i].temperatureHigh
        )}</span>° / ${Math.round(weather[i].temperatureLow)}°</p>
      </div>
    </div>`;

    document.getElementById("forecastList").appendChild(li);
  }
}
