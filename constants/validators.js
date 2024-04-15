'use strict';

const { VARIANT } = require('../config/env');
const { getValidationRules } = require('../libs/getValidationRules');

const USERNAME_REGEX = {
  pattern: /^[a-z0-9]+$/i,
  message: 'Username must contain only alphanumeric characters and no spaces',
};

// Get validation rules for password based on the variant
const PASSWORD_REGEX = getValidationRules(Number(VARIANT));

module.exports = { USERNAME_REGEX, PASSWORD_REGEX };
