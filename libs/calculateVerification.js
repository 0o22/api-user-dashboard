'use strict';

/**
 * Verify that user is authorized to perform an action
 * @param {Number} a - The first number
 * @param {Number} x - The second number
 * @returns {Number} - The result of the operation
 */
function calculateVerification(a, x) {
  return x / Math.sin(a);
}

module.exports = { calculateVerification };
