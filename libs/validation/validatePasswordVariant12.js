'use strict';

/**
 * Validate password for variant 12
 * *contain at least one lowercase letter, one uppercase letter, and one digit
 * @param {String} password - The password to validate
 * @returns {Boolean} - The result of the validation
 */
function validatePasswordVariant12(password) {
  let hasLower = false;
  let hasUpper = false;
  let hasDigit = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (/[a-z]/.test(char)) {
      hasLower = true;
    } else if (/[A-Z]/.test(char)) {
      hasUpper = true;
    } else if (/[0-9]/.test(char)) {
      hasDigit = true;
    }
  }

  return hasLower && hasUpper && hasDigit;
}

module.exports = { validatePasswordVariant12 };
