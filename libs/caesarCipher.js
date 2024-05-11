'use strict';

/**
 * Caesar cipher implementation.
 * @param {String} charset - The string to encode or decode.
 * @param {Boolean} encode - True to encode, false to decode.
 * @returns {String} The encoded or decoded string.
 */
function caesarCipher(charset, encode = true) {
  const shift = 3;
  const direction = encode ? 1 : -1;

  return charset.replace(/[a-z]/gi, (char) => {
    let startCode = char <= 'Z' ? 65 : 97;

    return String.fromCharCode(
      ((char.charCodeAt(0) + shift * direction - startCode) % 26) + startCode
    );
  });
}

module.exports = { caesarCipher };
