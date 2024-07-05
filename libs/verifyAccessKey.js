'use strict';

const { ACCESS_KEY_SECRET } = require('../config/env');
const { caesarCipher } = require('../libs/caesarCipher');

/**
 * Verify the access key.
 * @param {String} key - The access key.
 * @param {String} username - The username.
 * @returns {Boolean} True if the key is valid, false otherwise.
 */
function verifyAccessKey(key, username) {
  const encodedKey = caesarCipher(key, false);

  const targetKey = `${username}${ACCESS_KEY_SECRET}`;

  return encodedKey === targetKey;
}

module.exports = { verifyAccessKey };
