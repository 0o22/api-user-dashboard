'use strict';

/**
 * @typedef {Object} ValidationResult
 * @property {Boolean} valid - Indicates if the value is valid
 * @property {String} rule - The rule that was violated
 */

/**
 * Validate username
 * *can only contain letters and numbers
 * @param {String} username - The username to validate
 * @returns {ValidationResult} - The result of the validation
 */
function validateUsername(username) {
  const regex = /^[a-z0-9]+$/i;

  return {
    valid: regex.test(username),
    rule: 'Username can only contain letters and numbers',
  };
}

module.exports = { validateUsername };
