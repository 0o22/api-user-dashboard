'use strict';

/**
 * Validate password for variant 7
 * *contain at least one digit and one special character
 * @param {String} password - The password to validate
 * @returns {Boolean} - The result of the validation
 */
function validatePasswordVariant7(password) {
  let hasDigit = false;
  let hasSpecial = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (/[0-9]/.test(char)) {
      hasDigit = true;
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(char)) {
      hasSpecial = true;
    }
  }

  return hasDigit && hasSpecial;
}

module.exports = { validatePasswordVariant7 };
