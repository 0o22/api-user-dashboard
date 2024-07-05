'use strict';

/**
 * Caesar cipher implementation.
 * @param {String} charset - The string to encode or decode.
 * @param {Boolean} encode - True to encode, false to decode.
 * @returns {String} The encoded or decoded string.
 */
function caesarCipher(charset, encode = true) {
  const shift = 3;
  const { length } = charset;
  let result = '';

  for (let i = 0; i < length; i++) {
    const char = charset[i];
    const charCode = charset.charCodeAt(i);

    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(
        ((charCode - 65 + (encode ? shift : 26 - shift)) % 26) + 65
      );
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(
        ((charCode - 97 + (encode ? shift : 26 - shift)) % 26) + 97
      );
    } else {
      result += char;
    }
  }

  return result;
}

module.exports = { caesarCipher };
