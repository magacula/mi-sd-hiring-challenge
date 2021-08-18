// import { convertDate } from "./utils";
import { isUSAZipCode, allCharactersSame } from "./utils";
import cloudy from "../img/cloudy.png";
import rain from "../img/rain.png";
import snow from "../img/snow.png";
import sunny from "../img/sunny.png";

const form = document.querySelector("#search");
form.addEventListener("submit", onSubmit);

// handles form submit
// async functions run asynchronously in the background (not blocking the main thread of execution or CALL stack)
async function onSubmit(e) {
  e.preventDefault();

  // retrieve zipcode
  let zip = form.elements[0].value;

  /***** FIX #1: Clear text filed so they cant make the same API call  ******/
  form.reset();

  if (validateZip(zip)) {
    // Sends GET request to retrieve city, state, and lat & long values
    // await will stop the code execution at this point of the function, until promise has been
    // fulfilled (when the data has been fetched)
    let getCoordinates = await getLocation(zip);

    let city = getCoordinates.city;
    let state = getCoordinates.regionCode;
    let lat = getCoordinates.latitude;
    let long = getCoordinates.longitude;

    let weather = await getWeather(lat, long);
    console.log("weather", weather);
    renderForecast(city, state, weather);
  } else {
    alert("You entered an invalid zip code");
  }
}

function validateZip(zip) {
  if (isUSAZipCode(zip) && !allCharactersSame(zip)) {
    console.log("Zipcode is valid");
    return true;
  }
  console.log("Invalid Zip");
  return false;
}

/***** FIX 2: functions fetches data when specifying the URL we want to hit  ******/
// Function that deals with an abstraction of making more than 1 api call
async function fetchData(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// handles API call to fetch geolocation data via Geolocation API
async function getLocation(zip) {
  let geoURL = `https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=${zip}`;
  let getGeoData = await fetchData(geoURL);
  return getGeoData;
}

// handle API call to fetch forecast data of each day via Forecast API
// takes lat & long values as params
async function getWeather(lat, long) {
  const today = new Date();

  // converts date into format: MM/DD/YEAR
  const date = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`;

  let weatherURL = `https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=${lat}&longitude=-${long}&date=${date}`;
  let getWeatherData = await fetchData(weatherURL);
  console.log(getWeatherData);
  return getWeatherData.daily.data;
}

// renders out weather forecast UI to DOM
function renderForecast(city, state, weather) {
  const cityForecast = document.querySelector("#city");
  // display heading for forecast of city, state
  cityForecast.innerHTML = `<h2>WEATHER FORECAST FOR ${city.toUpperCase()}, ${state}.</h2>`;

  /***** FIX #3: Displaying days of the week  *****/
  // Uses "wrapping effect" on array with modulus operator %

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // gets the day of the week: Ex) if Monday, will return 1
  // we need to subtract 1 to match the indices in the days array
  let dayOfTheWeekIndex = new Date().getDay() - 1;
  console.log(dayOfTheWeekIndex);

  // we subtract 2 from the end since we are only getting the 3-day forecast
  // we can take out if we want to get the 5-day (what the api gives us back)
  for (
    let i = dayOfTheWeekIndex;
    i < weather.length + dayOfTheWeekIndex - 2;
    i++
  ) {
    // creates a forecast item for each day
    let li = document.createElement("li");

    li.innerHTML = `
    <h3 id="date">${
      i === dayOfTheWeekIndex ? "Today" : days[parseInt(i % days.length)]
    }</h3>
    <div id="weatherInfo">
      <div>
      <img src="${weather[i - dayOfTheWeekIndex].icon}" alt="" />
      </div>
      <div>
        <p>${weather[i - dayOfTheWeekIndex].icon}</p>
        <p><span style='font-weight:bold'>${Math.round(
          weather[i - dayOfTheWeekIndex].temperatureHigh
        )}</span>° / ${Math.round(
      weather[i - dayOfTheWeekIndex].temperatureLow
    )}°</p>
      </div>
    </div>`;
    document.getElementById("forecastList").appendChild(li);
  }
}
