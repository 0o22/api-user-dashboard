'use strict';

const { VARIANT: VARIANT_ENV } = require('../config/env');

const VARIANT = Number(VARIANT_ENV);

/**
 * @typedef {Object} ValidationInfo
 * @property {Boolean} valid - Whether the password is valid
 * @property {String} rule - The rule that was violated
 */

/**
 * @param {String} username - The username to validate
 * @returns {ValidationInfo} - The validation result
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
 * Validate a password
 * @param {String} password - The password to validate
 * @returns {ValidationInfo} - The validation result
 */
function validatePassword(password) {
  const createRuleMessage = (rule) => {
    return `Password must ${rule}.`;
  };

  const rules = {
    7: {
      regex: /^(?=.*[0-9])(?=.*[+\-*/]).*$/,
      ruleMessage: 'contain at least one digit and one special character',
    },
    12: {
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
      ruleMessage:
        'contain at least one lowercase letter, one uppercase letter, and one digit',
    },
    18: {
      regex: /^(?=.*\d)(?=.*[,.!?])(?=.*[+\-*/]).*$/,
      ruleMessage:
        'contain at least one digit, one punctuation mark, and one operator',
    },
    28: {
      regex:
        /^(([a-zA-Z][!@#$%^&*(),.?":{}|<>][0-9])|([0-9][!@#$%^&*(),.?":{}|<>][a-zA-Z])|([!@#$%^&*(),.?":{}|<>][0-9][a-zA-Z]))+$/,
      ruleMessage: 'alternate letters, punctuation, and numbers',
    },
  };

  if (!rules[VARIANT]) {
    throw new Error('Invalid VARIANT specified.');
  }

  const { regex, ruleMessage } = rules[VARIANT];

  if (!regex.test(password)) {
    return {
      valid: false,
      rule: createRuleMessage(ruleMessage),
    };
  }

  return { valid: true, rule: null };
}

module.exports = { validateUsername, validatePassword };
