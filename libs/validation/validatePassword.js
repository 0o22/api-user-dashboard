'use strict';

/**
 * @typedef {Object} ValidationResult
 * @property {Boolean} valid - Indicates if the value is valid
 * @property {String} rule - The rule that was violated
 */

/**
 * Validate password
 * *contain at least one digit and one special character
 * @param {String} password - The password to validate
 * @returns {ValidationResult} - The result of the validation
 */
function validatePassword(password) {
  const numberRegex = /[0-9]/;
  const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

  let hasDigit = false;
  let hasSpecial = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (numberRegex.test(char)) {
      hasDigit = true;
    } else if (specialRegex.test(char)) {
      hasSpecial = true;
    }
  }

  return {
    valid: hasDigit && hasSpecial,
    rule: 'Password must contain at least one digit and one special character.',
  };
}

module.exports = { validatePassword };
