'use strict';

/**
 * Get validation rules for a given variant
 * @param {number} variant - The variant number
 * @returns {object} - The validation rules
 */
function getValidationRules(variant) {
  switch (variant) {
    case 7:
      return /^(?=.*[0-9])(?=.*[+\-*/]).*$/;
    case 12:
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/;
    case 18:
      return /^(?=.*\d)(?=.*[,.!?])(?=.*[+\-*/]).*$/;
    case 28:
      return /^(?:(\p{L})(?!\1)([\p{P}\p{S}])(?!\2)(\d))+$/u;
    default:
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/;
  }
}

module.exports = { getValidationRules };
