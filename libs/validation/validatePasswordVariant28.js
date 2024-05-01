'use strict';

/**
 * Validate password for variant 28
 * *alternate letters, punctuation, and numbers
 * @param {String} password - The password to validate
 * @returns {Boolean} - The result of the validation
 */
function validatePasswordVariant28(password) {
  const validCombination = [];

  for (let i = 0; i < password.length; i += 3) {
    const firstChar = password[i];
    const secondChar = password[i + 1];
    const thirdChar = password[i + 2];

    if (/[a-z]/.test(firstChar)) {
      validCombination.push(firstChar);
    }

    if (/[!?.,:-]/.test(secondChar)) {
      validCombination.push(secondChar);
    }

    if (/[0-9]/.test(thirdChar)) {
      validCombination.push(thirdChar);
    }
  }

  return validCombination.length === password.length;
}

module.exports = { validatePasswordVariant28 };
