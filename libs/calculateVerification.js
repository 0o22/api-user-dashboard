'use strict';

/**
 * Verify that user is authorized to perform an action
 * @param {Number} a - The first number (formally variant)
 * @param {Number} x - The second number
 * @returns {Number} - The result of the operation
 */
function calculateVerification(a, x) {
  switch (a) {
    case 7:
      return x / Math.sin(a);

    case 12:
      return Math.log10(a * x);

    case 8:
    case 28:
      return a * Math.sin(1 / x);

    default:
      return x / a;
  }
}

module.exports = { calculateVerification };
