/**
 *
 * @param {number} time - Unix time in seconds returns it in miliseconds
 */
export function convertDate(time) {
  return time * 1000;
}

// checks if zipcode entered is 5 digits using a Regex Literal
// checks for 5 digits ( \d{5} ) followed by optional hyphen and four digits ( (-\d{4})? )
export function isUSAZipCode(str) {
  return /^\d{5}(-\d{4})?$/.test(str);
}

// checks if a string has all of the same characters
// Ex) user enters '11111'
export function allCharactersSame(zip) {
  for (let i = 0; i < zip.length; i++) {
    if (zip[i] != zip[0]) {
      return false;
    }
  }
  return true;
}

// checks if the data returned is an empty object (zipcode does not exist)
export function zipDoesNotExist(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

//clears UI when searching for another zipcode
export function clear(element) {
  element.addEventListener("change", function () {
    // get header displaying city name
    const cityForecast = document.querySelector("#city");
    cityForecast.innerHTML = "";

    // get list of forecast items
    const list = document.getElementById("forecastList");
    list.innerHTML = "";
  });
}
