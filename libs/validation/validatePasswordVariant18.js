'use strict';

/**
 * Validate password for variant 18
 * *contain at least one digit, one punctuation mark, and one operator
 * @param {String} password - The password to validate
 * @returns {Boolean} - The result of the validation
 */
function validatePasswordVariant18(password) {
  let hasDigit = false;
  let hasPunctuation = false;
  let hasOperator = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (/[0-9]/.test(char)) {
      hasDigit = true;
    } else if (/[!?.,:-]/.test(char)) {
      hasPunctuation = true;
    } else if (/[+-/*]/.test(char)) {
      hasOperator = true;
    }
  }

  return hasDigit && hasPunctuation && hasOperator;
}

module.exports = { validatePasswordVariant18 };
