'use strict';

const USERNAME_REGEX = /^[a-z0-9]+$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[,.!?])(?=.*[+\-*/]).*$/;

module.exports = {
  USERNAME_REGEX,
  PASSWORD_REGEX,
};
