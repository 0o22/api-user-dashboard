'use strict';

const { validatePasswordVariant12 } = require('./validatePasswordVariant12');
const { validatePasswordVariant18 } = require('./validatePasswordVariant18');
const { validatePasswordVariant28 } = require('./validatePasswordVariant28');
const { validatePasswordVariant7 } = require('./validatePasswordVariant7');

const VARIANT = Number(process.env.VARIANT);

/**
 * @typedef {Object} ValidationResult
 * @property {Boolean} valid - Indicates if the value is valid
 * @property {String} rule - The rule that was violated
 */

/**
 * Validate username
 * @param {String} username - The username to validate
 * @returns {ValidationResult} - The result of the validation
 */
function validateUsername(username) {
  if (!/^[a-z0-9]+$/i.test(username)) {
    return {
      valid: false,
      rule: 'Username can only contain letters and numbers',
    };
  }

  return { valid: true, rule: null };
}

/**
 * Validate password
 * @param {String} password - The password to validate
 * @returns {ValidationResult} - The result of the validation
 */
function validatePassword(password) {
  const createRuleMessage = (rule) => {
    return `Password must ${rule}.`;
  };

  const rules = {
    7: {
      valid: validatePasswordVariant7(password),
      rule: createRuleMessage(
        'contain at least one digit and one special character'
      ),
    },
    12: {
      valid: validatePasswordVariant12(password),
      rule: createRuleMessage(
        'contain at least one lowercase letter, one uppercase letter, and one digit'
      ),
    },
    18: {
      valid: validatePasswordVariant18(password),
      rule: createRuleMessage(
        'contain at least one digit, one punctuation mark, and one operator'
      ),
    },
    28: {
      valid: validatePasswordVariant28(password),
      rule: createRuleMessage('alternate letters, punctuation, and numbers'),
    },
  };

  console.log(VARIANT);

  if (!rules[VARIANT]) {
    throw new Error('Invalid VARIANT specified.');
  }

  return rules[VARIANT];
}

module.exports = { validateUsername, validatePassword };
