'use strict';

const { VARIANT } = require('../config/env');
const { getValidationRules } = require('../libs/getValidationRules');

const USERNAME_REGEX = /^[a-z0-9]+$/i; // Alphanumeric characters only (case-insensitive) and no spaces
const PASSWORD_REGEX = getValidationRules(VARIANT); // Get validation rules based on the variant

module.exports = {
  USERNAME_REGEX,
  PASSWORD_REGEX,
};
