/**
 *
 * @param {number} time - Unix time in seconds returns it in miliseconds
 */
export function convertDate(time) {
  return time * 1000;
}

// checks if zipcode entered is 5 digits using a Regex Literal
export function isUSAZipCode(str) {
  return /^\d{5}(-\d{4})?$/.test(str);
}

// function that checks if a string has all of the same characters
// Ex) user enters '11111'
export function allCharactersSame(zip) {
  for (let i = 0; i < zip.length; i++) {
    if (zip[i] != zip[0]) {
      return false;
    }
  }
  return true;
}
