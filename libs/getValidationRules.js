'use strict';

/**
 * Get validation rules for a given variant
 * @param {Number} variant - The variant number
 * @returns {Object} - The validation rules
 */
function getValidationRules(variant) {
  switch (variant) {
    case 7:
      return {
        pattern: /^(?=.*[0-9])(?=.*[+\-*/]).*$/,
        message:
          'Password must contain at least one digit and one special character',
      };
    case 12:
      return {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
      };
    case 18:
      return {
        pattern: /^(?=.*\d)(?=.*[,.!?])(?=.*[+\-*/]).*$/,
        message:
          'Password must contain at least one digit, one punctuation mark, and one operator',
      };
    default:
      return {
        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
        message:
          'Password must contain at least one digit, one lowercase letter, and one uppercase letter',
      };
  }
}

module.exports = { getValidationRules };
